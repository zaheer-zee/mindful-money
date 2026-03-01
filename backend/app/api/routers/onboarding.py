from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from typing import Optional
import json
import pandas as pd
import io
from datetime import datetime
from app.models.domain import User, Transaction, BehavioralProfile, Insight
from app.services.ai_service import categorize_transactions

router = APIRouter()

@router.post("/")
async def complete_onboarding(
    survey_data: str = Form(...),
    statement: UploadFile = File(...),
    statement_password: Optional[str] = Form(None)
):
    """
    Unified endpoint for onboarding. 
    Accepts the initial survey answers as a JSON string, the bank statement file, 
    and an optional password if the file is encrypted.
    """
    try:
        parsed_survey = json.loads(survey_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid survey JSON string")
        
    # In a real app, 'user_id' comes from the Supabase JWT token.
    # We will mock a user for now.
    mock_supabase_id = "test-user-123"
    
    # 1. Ensure user exists (Upsert)
    user = await User.find_one(User.supabase_id == mock_supabase_id)
    if not user:
        user = User(
            supabase_id=mock_supabase_id,
            email="test@example.com",
            profile=BehavioralProfile(preferences=parsed_survey)
        )
        await user.insert()
    else:
        user.profile.preferences = parsed_survey
        await user.save()

    # 2. Extract Data
    # A complete implementation would branch here based on the extension (.csv vs .pdf)
    # and use the `statement_password` if extracting from a PDF.
    content = await statement.read()
    
    try:
        df = pd.read_csv(io.BytesIO(content))
        # Keep only basic rows for the demo
        # Assuming columns: Date, Description, Amount
        raw_transactions = []
        for _, row in df.iterrows():
            raw_transactions.append({
                "date": str(row.get("Date", datetime.utcnow().date())),
                "merchant": str(row.get("Description", "Unknown")),
                "amount": float(row.get("Amount", 0.0))
            })
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # 3. AI Processing (Groq)
    # Convert survey to a flat string for the LLM
    context_str = json.dumps(parsed_survey)
    
    # Process in a small batch to respect API limits in demo
    batch = raw_transactions[:10] 
    enriched_batch = await categorize_transactions(batch, context_str)
    
    # 4. Save to Database
    db_transactions = []
    for t in enriched_batch:
        try:
            date_obj = datetime.strptime(t["date"], "%Y-%m-%d")
        except:
            date_obj = datetime.utcnow()
            
        trans_doc = Transaction(
            user_id=user.supabase_id,
            date=date_obj,
            merchant=t["merchant"],
            amount=t["amount"],
            category=t["category"],
            is_anomaly=t.get("is_anomaly", False)
        )
        
        insight_text = t.get("ai_insight")
        if insight_text:
            trans_doc.insight = Insight(ai_explanation=insight_text)
            
        db_transactions.append(trans_doc)
        
    if db_transactions:
        await Transaction.insert_many(db_transactions)

    return {
        "status": "success",
        "message": f"Successfully processed {len(db_transactions)} transactions.",
        "processed_data": enriched_batch
    }
