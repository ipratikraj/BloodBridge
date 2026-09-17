from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.donor import Donor

router = APIRouter(
    prefix="/donors",
    tags=["Donors"]
)


# Register a new donor
@router.post("/")
def create_donor(
    donor_data: dict,
    db: Session = Depends(get_db)
):
    donor = Donor(
        name=donor_data["name"],
        blood_group=donor_data["blood_group"],
        city=donor_data["city"],
        latitude=donor_data["latitude"],
        longitude=donor_data["longitude"],
        last_donation_date=donor_data.get("last_donation_date"),
        phone=donor_data["phone"],
        email=donor_data["email"],
        status="available"
    )

    db.add(donor)
    db.commit()
    db.refresh(donor)

    return {
        "message": "Donor registered successfully",
        "donor": {
            "id": donor.id,
            "name": donor.name,
            "blood_group": donor.blood_group,
            "city": donor.city,
            "status": donor.status
        }
    }


# Public donor list
# Contact details are intentionally NOT returned
@router.get("/")
def get_donors(
    db: Session = Depends(get_db)
):
    donors = db.query(Donor).all()

    return {
        "count": len(donors),
        "donors": [
            {
                "id": donor.id,
                "name": donor.name,
                "blood_group": donor.blood_group,
                "city": donor.city,
                "status": donor.status
            }
            for donor in donors
        ]
    }


# Public donor profile
# Contact details are intentionally NOT returned
@router.get("/{donor_id}")
def get_donor(
    donor_id: int,
    db: Session = Depends(get_db)
):
    donor = db.query(Donor).filter(
        Donor.id == donor_id
    ).first()

    if not donor:
        raise HTTPException(
            status_code=404,
            detail="Donor not found"
        )

    return {
        "id": donor.id,
        "name": donor.name,
        "blood_group": donor.blood_group,
        "city": donor.city,
        "status": donor.status
    }