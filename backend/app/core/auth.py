import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.models.domain import User

security = HTTPBearer()

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Validates the Supabase JWT access token and returns the Supabase user ID.
    """
    token = credentials.credentials
    try:
        # Supabase signs JWTs with the anon key or JWT secret
        # We need to decode it using the JWT Secret (from Supabase Auth Settings)
        # For this setup, we will use the HS256 algorithm
        payload = jwt.decode(
            token, 
            settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            options={"verify_aud": False} # Supabase generic aud is 'authenticated'
        )
        user_id = payload.get("sub") # 'sub' contains the UUID of the Supabase user
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload: no user id")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

async def get_current_user(user_id: str = Depends(get_current_user_id)) -> User:
    """
    Fetches the User document from MongoDB given the verified Supabase user ID.
    If the user doesn't exist yet, we create an empty placeholder User.
    """
    user = await User.find_one(User.supabase_id == user_id)
    if not user:
        # Auto-provision the user placeholder in MangoDB upon first authenticated request
        user = User(
            supabase_id=user_id,
            email="fetched_from_token@example.com" # Could extract email from payload if needed
        )
        await user.insert()
    return user
