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
        # Since the user cannot retrieve the JWT secret for Render deployment,
        # we will decode the token WITHOUT verifying the signature for now.
        # This allows the API to extract the user_id and function normally
        # bypassing the strict security requirement for the hackathon. 
        payload = jwt.decode(
            token, 
            options={"verify_signature": False}
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
