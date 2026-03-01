from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
import json
from app.core.config import settings
from app.models.domain import User, Transaction
from app.core.auth import get_current_user

router = APIRouter()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat_with_ai(request: ChatRequest, user: User = Depends(get_current_user)):
    """
    Sends the user's message to Groq Llama, infusing the prompt with 
    their recent financial data and behavioral profile.
    """
    # Fetch Recent Transactions (last 10)
    transactions = await Transaction.find(
        Transaction.user_id == user.supabase_id
    ).sort("-date").limit(10).to_list()
    
    # Build a context string
    tx_context = "\n".join([f"- {t.date.strftime('%Y-%m-%d')}: {t.merchant} (₹{t.amount}) [{t.category}] {'(Flagged as Anomaly)' if t.is_anomaly else ''}" for t in transactions])
    
    prompt = f"""
    You are 'Mindful', a supportive and analytical AI financial coach.
    You help users understand their spending behavior and stick to their goals.
    Keep your answers concise, practical, and empathetic. Do not use markdown headers, just simple paragraphs or bullet points.
    
    User Profile Context: {json.dumps(user.profile.preferences if user.profile else {})}
    
    Recent Transactions Context:
    {tx_context if tx_context else "No recent transactions found."}
    
    The user says: "{request.message}"
    """
    
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a helpful AI financial advisor named Mindful."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=payload, timeout=30.0)
        
        if response.status_code != 200:
            print(f"Groq API Error: {response.text}")
            raise HTTPException(status_code=502, detail="Failed to communicate with AI provider.")
            
        data = response.json()
        ai_reply = data["choices"][0]["message"]["content"]
        
        return {"reply": ai_reply.strip()}
