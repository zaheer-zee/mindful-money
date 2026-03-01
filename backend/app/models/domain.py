import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import Field, BaseModel
from beanie import Document, Link

class BehavioralProfile(BaseModel):
    preferences: Dict[str, Any] = Field(default_factory=dict)
    ml_baseline_state: Dict[str, Any] = Field(default_factory=dict)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(Document):
    # Supabase Auth ID
    supabase_id: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    
    profile: BehavioralProfile = Field(default_factory=BehavioralProfile)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class Insight(BaseModel):
    ai_explanation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Transaction(Document):
    user_id: str = Field(index=True) # References User.supabase_id
    date: datetime = Field(index=True)
    merchant: str
    amount: float
    category: str = Field(index=True)
    
    is_anomaly: bool = False
    anomaly_score: Optional[float] = None
    
    insight: Optional[Insight] = None
    
    class Settings:
        name = "transactions"
