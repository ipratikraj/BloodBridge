from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import models so SQLAlchemy knows about all tables
from app.models.donor import Donor
from app.models.blood_request import BloodRequest
from app.models.user import User
from app.models.refresh_session import RefreshSession
from app.models.notification import Notification

from app.routers import donors, requests, notifications, auth


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BloodBridge API"
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://blood-bridge-1phv74cx9-pr-dd6d.vercel.app",
        "https://blood-bridge-pink.vercel.app",
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


# ---------------------------------------------------------
# Home
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to BloodBridge",
        "status": "API is running"
    }
