from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.models.domain import User
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/budgets")
async def get_category_budgets(user: User = Depends(get_current_user)):
    """
    Fetches the user's manual category budgets.
    """
        
    preferences = user.profile.preferences if user.profile else {}
    category_budgets = preferences.get("category_budgets", {})
    
    return {
        "status": "success",
        "category_budgets": category_budgets
    }

@router.put("/budgets")
async def update_category_budgets(budgets: Dict[str, float], user: User = Depends(get_current_user)):
    """
    Updates the user's manual category budgets.
    Accepts a dictionary like: {"Dining": 5000.0, "Entertainment": 2000.0}
    """
        
    if not user.profile:
        raise HTTPException(status_code=400, detail="User profile not initialized")
        
    # Get existing preferences or empty dict
    prefs = user.profile.preferences or {}
    
    # Update just the category_budgets dictionary inside the flexible preferences object
    prefs["category_budgets"] = budgets
    user.profile.preferences = prefs
    
    await user.save()
    
    return {
        "status": "success",
        "message": "Category budgets updated successfully",
        "category_budgets": budgets
    }
