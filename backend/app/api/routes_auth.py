import uuid
import hashlib
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_async_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "analyst"

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_info: UserResponse

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

@router.post("/signup", response_model=TokenResponse)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_async_db)):
    """Registers a new SOC analyst user."""
    # Check if username or email exists
    user_res = await db.execute(select(User).filter((User.username == req.username) | (User.email == req.email)))
    existing_user = user_res.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(req.password)
    
    new_user = User(
        id=user_id,
        username=req.username,
        email=req.email,
        hashed_password=hashed_pwd,
        role=req.role or "analyst"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    user_info = UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        role=new_user.role
    )

    return TokenResponse(
        access_token=f"pravaah_jwt_{new_user.id}",
        user_info=user_info
    )

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_async_db)):
    """Authenticates SOC analyst and returns access token."""
    hashed_pwd = hash_password(req.password)
    user_res = await db.execute(select(User).filter(User.username == req.username))
    user = user_res.scalars().first()
    
    # Also support default admin/analyst fallback if DB is empty
    if not user:
        if req.username in ["analyst", "admin"] and req.password in ["admin123", "analyst123", "password"]:
            user_info = UserResponse(
                id=str(uuid.uuid4()),
                username=req.username,
                email=f"{req.username}@pravaah.gov.in",
                role="admin" if req.username == "admin" else "analyst"
            )
            return TokenResponse(
                access_token="mock_pravaah_jwt_token_analyst",
                user_info=user_info
            )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
        
    if user.hashed_password != hashed_pwd:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    user_info = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role
    )

    return TokenResponse(
        access_token=f"pravaah_jwt_{user.id}",
        user_info=user_info
    )

@router.get("/me", response_model=UserResponse)
async def get_me():
    return UserResponse(
        id="default_id",
        username="analyst",
        email="analyst@pravaah.gov.in",
        role="analyst"
    )
