import asyncio
from datetime import datetime, timedelta
from app.core.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.domain import User, Transaction, BehavioralProfile

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]
    await init_beanie(database=database, document_models=[User, Transaction])

    mock_supabase_id = "test-user-123"
    
    # 1. Create User
    user = await User.find_one(User.supabase_id == mock_supabase_id)
    if not user:
        user = User(
            supabase_id=mock_supabase_id,
            email="test@example.com",
            profile=BehavioralProfile(preferences={"monthly_budget": 45000, "goals": "Save for a car"})
        )
        await user.insert()

    # 2. Clear old transactions for clean slate
    await Transaction.find(Transaction.user_id == mock_supabase_id).delete()

    # 3. Insert mock transactions
    now = datetime.utcnow()
    transactions = [
        Transaction(user_id=mock_supabase_id, date=now, merchant="Amazon", amount=1200, category="Shopping", is_anomaly=False),
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=1), merchant="Uber", amount=350, category="Transport", is_anomaly=False),
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=2), merchant="Swiggy", amount=800, category="Food & Dining", is_anomaly=False),
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=3), merchant="Gucci Store", amount=25000, category="Shopping", is_anomaly=True), # Anomaly
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=4), merchant="Netflix", amount=649, category="Entertainment", is_anomaly=False),
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=5), merchant="Electricity Bill", amount=1500, category="Rent & Bills", is_anomaly=False),
        Transaction(user_id=mock_supabase_id, date=now - timedelta(days=6), merchant="Zomato", amount=600, category="Food & Dining", is_anomaly=False),
    ]
    
    await Transaction.insert_many(transactions)
    print("Database seeded with mock user and transactions!")

if __name__ == "__main__":
    asyncio.run(seed())
