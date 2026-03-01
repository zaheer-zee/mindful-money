from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Context-Aware Behavioral Finance Platform"
    
    # Supabase Auth
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str = ""
    
    # Database (MongoDB)
    MONGODB_URI: str
    DATABASE_NAME: str
    
    # AI/ML Integrations
    GROQ_API_KEY: str
    
    # Worker
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"

settings = Settings()
