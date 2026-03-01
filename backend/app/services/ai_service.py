import json
import httpx
from typing import List, Dict, Any
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

async def categorize_transactions(transactions: List[Dict[str, Any]], user_context: str) -> List[Dict[str, Any]]:
    """
    Sends a batch of raw transactions to Groq to be categorized based on the user's survey context.
    """
    
    # We create a prompt that asks the LLM to return a strict JSON array of categories
    prompt = f"""
    You are a highly analytical financial assistant.
    User Context/Survey Answers: {user_context}
    
    Given the following list of raw bank transactions, assign each one a standardized category (e.g., 'Groceries', 'Rent', 'Impulse Buy', 'Subscription', 'Entertainment').
    Consider the user's context when assigning categories (e.g., if they are trying to pay down debt, flag non-essentials).
    
    Also, flag if any transaction appears to be an anomaly (`is_anomaly`: true/false) based on standard spending behavior.
    
    Return the result STRICTLY as a JSON array of objects with keys: `transaction_id`, `category`, `is_anomaly`, `ai_reasoning`.
    Do not return any markdown formatting, just the raw JSON.
    
    Transactions:
    {json.dumps([{ 'id': i, 'desc': t['merchant'], 'amt': t['amount'] } for i, t in enumerate(transactions)])}
    """
    
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-8b-8192", # Fast and capable model
        "messages": [
            {"role": "system", "content": "You are a JSON-only API that outputs valid financial categorization JSON arrays."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=payload, timeout=30.0)
        response.raise_for_status()
        
        data = response.json()
        raw_json_str = data["choices"][0]["message"]["content"]
        
        # Clean up in case the LLM returned markdown blocks anyway
        if raw_json_str.startswith("```json"):
            raw_json_str = raw_json_str[7:-3]
            
        try:
            results = json.loads(raw_json_str.strip())
            
            # Merge results back into original transactions
            for i, res in enumerate(results):
                if i < len(transactions):
                    transactions[i]["category"] = res.get("category", "Uncategorized")
                    transactions[i]["is_anomaly"] = res.get("is_anomaly", False)
                    transactions[i]["ai_insight"] = res.get("ai_reasoning", "")
                    
            return transactions
        except json.JSONDecodeError:
            print(f"Failed to parse LLM response: {raw_json_str}")
            # Fallback
            for t in transactions:
                t["category"] = "Processing Error"
            return transactions
