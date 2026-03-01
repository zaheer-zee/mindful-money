from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.domain import User, Transaction

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]
    
    await init_beanie(
        database=database,
        document_models=[User, Transaction]
    )
