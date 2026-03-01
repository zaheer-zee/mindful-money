from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.models.domain import User, Transaction
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data(user: User = Depends(get_current_user)):
    """
    Returns aggregated data for the React dashboard.
    """

    # 2. Setup date range (Current Month)
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1)

    # 3. Aggregate Transactions
    # Retrieve all transactions for this month for the user
    transactions = await Transaction.find(
        Transaction.user_id == user.supabase_id,
        Transaction.date >= start_of_month
    ).to_list()

    total_spent = sum(t.amount for t in transactions if t.amount > 0)
    
    # Simple hardcoded budget for demo unless set in preferences
    monthly_budget = 40000
    if user.profile and user.profile.preferences:
        monthly_budget = user.profile.preferences.get("monthly_budget", 40000)
    savings = max(0, monthly_budget - total_spent)
    
    # Calculate simple discipline score (100 = perfect, under budget with no anomalies)
    anomaly_count = sum(1 for t in transactions if t.is_anomaly)
    base_score = 100
    if total_spent > monthly_budget:
        base_score -= 30
    base_score -= (anomaly_count * 5) # Deduct 5 points per anomaly
    discipline_score = max(0, min(100, base_score))

    # Category Breakdown
    category_totals: Dict[str, float] = {}
    for t in transactions:
        if t.amount > 0:
            category_totals[t.category] = category_totals.get(t.category, 0) + t.amount
            
    # Format for Recharts Pie chart
    pie_data = [
        {"name": cat, "value": amt} 
        for cat, amt in category_totals.items()
    ]
    
    # Sort pie data largest to smallest
    pie_data.sort(key=lambda x: x["value"], reverse=True)

    # Sort transactions by date descending to get the most recent
    recent_transactions = sorted(transactions, key=lambda x: x.date, reverse=True)[:5]
    recent_tx_data = [
        {
            "id": str(t.id),
            "date": t.date.strftime("%b %d, %Y"),
            "merchant": t.merchant,
            "amount": t.amount,
            "category": t.category,
            "is_anomaly": t.is_anomaly
        }
        for t in recent_transactions
    ]

    return {
        "monthly_budget": monthly_budget,
        "total_spent": total_spent,
        "savings": savings,
        "discipline_score": discipline_score,
        "distribution": pie_data,
        "anomalies_detected": anomaly_count,
        "recent_transactions": recent_tx_data
    }
