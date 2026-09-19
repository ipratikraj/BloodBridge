import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.donor import Donor
from app.models.blood_request import BloodRequest
from app.models.user import User
from app.models.refresh_session import RefreshSession
from app.models.notification import Notification

from app.routers import donors, requests, notifications, auth, admin


# ---------------------------------------------------------
# Create database tables
# ---------------------------------------------------------

Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# Create default admin account
# ---------------------------------------------------------

def create_default_admin():
    db = SessionLocal()

    try:
        admin_email = os.getenv(
            "ADMIN_EMAIL",
            "admin@bloodbridge.com"
        ).lower().strip()

        admin_password = os.getenv(
            "ADMIN_PASSWORD",
            "Admin@12345"
        )

        existing_admin = (
            db.query(User)
            .filter(User.email == admin_email)
            .first()
        )

        if existing_admin:
            # Make sure the existing account remains an admin
            existing_admin.role = "admin"
            existing_admin.is_active = True
            existing_admin.is_verified = True

            db.commit()

            print(f"Admin account already exists: {admin_email}")
            return

        admin_user = User(
            full_name="BloodBridge Admin",
            email=admin_email,
            password_hash=hash_password(admin_password),
            role="admin",
            is_active=True,
            is_verified=True
        )

        db.add(admin_user)
        db.commit()

        print(f"Default admin account created: {admin_email}")

    except Exception as e:
        db.rollback()
        print(f"Admin creation failed: {e}")

    finally:
        db.close()


create_default_admin()


# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="BloodBridge API"
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://blood-bridge-1phv74cx9-pr-dd6d.vercel.app",
        "https://blood-bridge-pink.vercel.app",
        "https://blood-bridge-3smgekf8h-pr-dd6d.vercel.app",
        "https://blood-bridge-eyftyqtr2-pr-dd6d.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Routers
# ---------------------------------------------------------

app.include_router(donors.router)
app.include_router(requests.router)
app.include_router(notifications.router)
app.include_router(auth.router)
app.include_router(admin.router)


# ---------------------------------------------------------
# Home
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to BloodBridge",
        "status": "API is running"
    }