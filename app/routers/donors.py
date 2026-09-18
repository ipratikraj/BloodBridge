from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.database.database import get_db
from app.models.donor import Donor
from app.models.user import User


router = APIRouter(
    prefix="/donors",
    tags=["Donors"]
)


@router.post("/")
def create_donor(
    donor_data: dict,
    current_user: User = Depends(require_roles("donor")),
    db: Session = Depends(get_db)
):
    existing_donor = db.query(Donor).filter(
        Donor.user_id == current_user.id
    ).first()

    if existing_donor:
        raise HTTPException(
            status_code=409,
            detail="A donor profile already exists for this account."
        )

    last_donation_date = donor_data.get("last_donation_date")

    if last_donation_date:
        try:
            last_donation_date = date.fromisoformat(
                str(last_donation_date)
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid last donation date. Use YYYY-MM-DD format."
            )

    required_fields = [
        "blood_group",
        "city",
        "latitude",
        "longitude",
        "phone"
    ]

    for field in required_fields:
        if field not in donor_data:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required field: {field}"
            )

    donor = Donor(
        user_id=current_user.id,
        name=current_user.full_name,
        blood_group=donor_data["blood_group"],
        city=donor_data["city"],
        latitude=donor_data["latitude"],
        longitude=donor_data["longitude"],
        last_donation_date=last_donation_date,
        email=current_user.email,
        phone=donor_data["phone"],
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
