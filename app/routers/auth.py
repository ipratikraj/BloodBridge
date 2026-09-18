from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_refresh_token,
    verify_password,
    
)

from app.database.database import get_db
from app.models.user import User
from app.models.refresh_session import RefreshSession
from datetime import datetime, timedelta, timezone

from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# REQUEST SCHEMAS
# =========================================================

class RegisterRequest(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )

    role: str = "donor"


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    email = data.email.lower().strip()

    allowed_roles = {
        "donor",
        "requester"
    }

    if data.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Choose donor or requester."
        )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    password_hash = hash_password(
        data.password
    )

    user = User(
        full_name=data.full_name.strip(),
        email=email,
        password_hash=password_hash,
        role=data.role,
        is_active=True,
        is_verified=False
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Account created successfully",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    email = data.email.lower().strip()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive."
        )

    # Create short-lived access token
    access_token = create_access_token(
        subject=str(user.id),
        role=user.role
    )

    # Create refresh token
    refresh_token = create_refresh_token(
        subject=str(user.id)
    )

    # Store only a hash of the refresh token
    refresh_token_hash = hash_refresh_token(
        refresh_token
    )

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=expires_at,
        is_revoked=False
    )

    db.add(refresh_session)
    db.commit()

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": (
            settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        ),
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }

# =========================================================
# REFRESH ACCESS TOKEN
# =========================================================

class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh")
def refresh_access_token(
    data: RefreshRequest,
    db: Session = Depends(get_db)
):
    refresh_token = data.refresh_token.strip()

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is required."
        )

    # Decode the refresh JWT
    try:
        payload = decode_token(refresh_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token."
        )

    # Make sure this is actually a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token."
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token."
        )

    # Hash the supplied token and find its server-side session
    token_hash = hash_refresh_token(
        refresh_token
    )

    session = db.query(RefreshSession).filter(
        RefreshSession.token_hash == token_hash,
        RefreshSession.user_id == int(user_id),
        RefreshSession.is_revoked == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session is invalid or has been revoked."
        )

    # Check session expiration
    now = datetime.now(timezone.utc)

    expires_at = session.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at <= now:
        session.is_revoked = True
        session.revoked_at = now
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session has expired."
        )

    # Find the user
    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive."
        )

    # -----------------------------------------------------
    # ROTATE REFRESH TOKEN
    # -----------------------------------------------------

    session.is_revoked = True
    session.revoked_at = now

    new_access_token = create_access_token(
        subject=str(user.id),
        role=user.role
    )

    new_refresh_token = create_refresh_token(
        subject=str(user.id)
    )

    new_refresh_token_hash = hash_refresh_token(
        new_refresh_token
    )

    new_expires_at = (
        now
        + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    new_session = RefreshSession(
        user_id=user.id,
        token_hash=new_refresh_token_hash,
        expires_at=new_expires_at,
        is_revoked=False
    )

    db.add(new_session)
    db.commit()

    return {
        "message": "Token refreshed successfully",
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": (
            settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        ),
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }

# =========================================================
# LOGOUT
# =========================================================

class LogoutRequest(BaseModel):
    refresh_token: str


@router.post("/logout")
def logout(
    data: LogoutRequest,
    db: Session = Depends(get_db)
):
    refresh_token = data.refresh_token.strip()

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required."
        )

    token_hash = hash_refresh_token(
        refresh_token
    )

    session = db.query(RefreshSession).filter(
        RefreshSession.token_hash == token_hash,
        RefreshSession.is_revoked == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session is invalid or already revoked."
        )

    now = datetime.now(timezone.utc)

    session.is_revoked = True
    session.revoked_at = now

    db.commit()

    return {
        "message": "Logout successful"
    }
