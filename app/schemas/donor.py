from pydantic import BaseModel
from datetime import date


class DonorCreate(BaseModel):
    name: str
    blood_group: str
    city: str
    latitude: float
    longitude: float
    last_donation_date: date | None = None
    phone: str
    email: str