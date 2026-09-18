from pydantic import BaseModel


class BloodRequestCreate(BaseModel):
    patient_name: str
    blood_group: str
    city: str
    latitude: float
    longitude: float
    units_required: int
    source_type: str = "individual"
    verification_status: str = "pending"