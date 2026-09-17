from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.request import BloodRequestCreate
from app.database.database import get_db

from app.models.donor import Donor
from app.models.blood_request import BloodRequest
from app.models.notification import Notification

from app.services.matching import find_matching_donors


router = APIRouter(
    prefix="/requests",
    tags=["Blood Requests"]
)


# ---------------------------------------------------------
# CREATE BLOOD REQUEST
# ---------------------------------------------------------

@router.post("/")
def create_request(
    request: BloodRequestCreate,
    db: Session = Depends(get_db)
):

    # Create database blood request
    new_request = BloodRequest(
        patient_name=request.patient_name,
        blood_group=request.blood_group,
        city=request.city,
        latitude=request.latitude,
        longitude=request.longitude,
        units_required=request.units_required,
        status="pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # Get all donors from database
    donors = db.query(Donor).all()

    # Convert SQLAlchemy donors into dictionaries
    donor_data = []

    for donor in donors:
        donor_data.append({
            "id": donor.id,
            "name": donor.name,
            "blood_group": donor.blood_group,
            "city": donor.city,
            "latitude": donor.latitude,
            "longitude": donor.longitude,
            "last_donation_date": donor.last_donation_date,
            "phone": donor.phone,
            "email": donor.email,
            "status": donor.status
        })

    # Find matching donors
    
    all_matches = find_matching_donors(
        request.blood_group,
        request.latitude,
        request.longitude,
        donor_data
    )

    # Select only the number of nearest donors
    # required for the requested units.
    
    matches = all_matches[:request.units_required]

    # Create notifications for matched donors
    for donor in matches:

        notification = Notification(
            request_id=new_request.id,
            donor_id=donor["id"],
            status="pending"
        )

        db.add(notification)

    db.commit()

    return {
        "message": "Blood request created successfully",

        "request": {
            "id": new_request.id,
            "patient_name": new_request.patient_name,
            "blood_group": new_request.blood_group,
            "city": new_request.city,
            "latitude": new_request.latitude,
            "longitude": new_request.longitude,
            "units_required": new_request.units_required,
            "status": new_request.status
        },

        "matching_donors": matches
    }


# ---------------------------------------------------------
# GET ALL BLOOD REQUESTS
# ---------------------------------------------------------

@router.get("/")
def get_requests(
    db: Session = Depends(get_db)
):

    blood_requests = db.query(
        BloodRequest
    ).all()

    return {
        "count": len(blood_requests),

        "requests": [
            {
                "id": request.id,
                "patient_name": request.patient_name,
                "blood_group": request.blood_group,
                "city": request.city,
                "latitude": request.latitude,
                "longitude": request.longitude,
                "units_required": request.units_required,
                "status": request.status
            }

            for request in blood_requests
        ]
    }


# ---------------------------------------------------------
# GET SINGLE BLOOD REQUEST
# ---------------------------------------------------------

@router.get("/{request_id}")
def get_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    blood_request = db.query(
        BloodRequest
    ).filter(
        BloodRequest.id == request_id
    ).first()

    if not blood_request:
        raise HTTPException(
            status_code=404,
            detail="Blood request not found"
        )

    return {
        "id": blood_request.id,
        "patient_name": blood_request.patient_name,
        "blood_group": blood_request.blood_group,
        "city": blood_request.city,
        "latitude": blood_request.latitude,
        "longitude": blood_request.longitude,
        "units_required": blood_request.units_required,
        "status": blood_request.status
    }