from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.database.database import get_db
from app.models.blood_request import BloodRequest
from app.models.user import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/requests")
def get_requests_for_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin"))
):
    requests = (
        db.query(BloodRequest)
        .order_by(BloodRequest.id.desc())
        .all()
    )

    return [
        {
            "id": request.id,
            "patient_name": request.patient_name,
            "blood_group": request.blood_group,
            "city": request.city,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "units_required": request.units_required,
            "source_type": request.source_type,
            "verification_status": request.verification_status,
            "status": request.status,
        }
        for request in requests
    ]


@router.patch("/requests/{request_id}/verify")
def verify_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin"))
):
    blood_request = (
        db.query(BloodRequest)
        .filter(BloodRequest.id == request_id)
        .first()
    )

    if not blood_request:
        raise HTTPException(
            status_code=404,
            detail="Blood request not found."
        )

    blood_request.verification_status = "verified"

    db.commit()
    db.refresh(blood_request)

    return {
        "message": "Blood request verified successfully.",
        "request": {
            "id": blood_request.id,
            "verification_status": blood_request.verification_status,
        }
    }


@router.patch("/requests/{request_id}/reject")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin"))
):
    blood_request = (
        db.query(BloodRequest)
        .filter(BloodRequest.id == request_id)
        .first()
    )

    if not blood_request:
        raise HTTPException(
            status_code=404,
            detail="Blood request not found."
        )

    blood_request.verification_status = "rejected"

    db.commit()
    db.refresh(blood_request)

    return {
        "message": "Blood request rejected.",
        "request": {
            "id": blood_request.id,
            "verification_status": blood_request.verification_status,
        }
    }