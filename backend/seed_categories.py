import asyncio
from app.core.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.domain import User

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]
    await init_beanie(database=database, document_models=[User])

    mock_supabase_id = "test-user-123"
    user = await User.find_one(User.supabase_id == mock_supabase_id)
    if user:
        prefs = user.profile.preferences or {}
        prefs["category_budgets"] = {
            "Rent & Housing": 20000,
            "Food & Dining": 8000,
            "Shopping": 5000,
            "Transport": 4000,
            "Entertainment": 3000
        }
        user.profile.preferences = prefs
        await user.save()
        print("Done setting category budgets mock data.")

if __name__ == "__main__":
    asyncio.run(seed())
