from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.database.database import get_db
from app.models.donor import Donor
from app.models.blood_request import BloodRequest
from app.models.notification import Notification
from app.models.user import User
from app.services.matching import calculate_distance


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ==================================================
# GET ALL NOTIFICATIONS
# ==================================================

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).all()

    return {
        "count": len(notifications),
        "notifications": [
            {
                "id": notification.id,
                "request_id": notification.request_id,
                "donor_id": notification.donor_id,
                "status": notification.status
            }
            for notification in notifications
        ]
    }


# ==================================================
# AUTHENTICATED DONOR DASHBOARD
# ==================================================
# The donor is identified from the logged-in user.
# The frontend does NOT provide a donor_id.
# ==================================================

@router.get("/dashboard/me")
def get_my_donor_dashboard(
    current_user: User = Depends(require_roles("donor")),
    db: Session = Depends(get_db)
):

    # ------------------------------------------
    # FIND DONOR BELONGING TO CURRENT USER
    # ------------------------------------------

    donor = db.query(Donor).filter(
        Donor.user_id == current_user.id
    ).first()

    if not donor:
        raise HTTPException(
            status_code=404,
            detail="Donor profile not found for this account"
        )


    # ------------------------------------------
    # GET ONLY THIS DONOR'S NOTIFICATIONS
    # ------------------------------------------

    notifications = db.query(Notification).filter(
        Notification.donor_id == donor.id
    ).all()


    dashboard = []


    for notification in notifications:

        # ------------------------------------------
        # GET BLOOD REQUEST
        # ------------------------------------------

        blood_request = db.query(BloodRequest).filter(
            BloodRequest.id == notification.request_id
        ).first()

        if not blood_request:
            continue


        # ------------------------------------------
        # CALCULATE DISTANCE
        # ------------------------------------------

        distance = calculate_distance(
            blood_request.latitude,
            blood_request.longitude,
            donor.latitude,
            donor.longitude
        )


        # ------------------------------------------
        # DASHBOARD ITEM
        # ------------------------------------------

        dashboard.append({

            "id": notification.id,

            "status": notification.status,

            "distance_km": round(
                distance,
                2
            ),

            "match_reason":
                "Same blood group, eligible donation interval, available, and within 50 km",

            "request": {

                "id": blood_request.id,

                "patient_name":
                    blood_request.patient_name,

                "blood_group":
                    blood_request.blood_group,

                "city":
                    blood_request.city,

                "units_required":
                    blood_request.units_required,

                "status":
                    blood_request.status
            },

            "donor": {

                "id": donor.id,

                "name":
                    donor.name,

                "blood_group":
                    donor.blood_group,

                "city":
                    donor.city,

                "status":
                    donor.status
            }
        })


    return {

        "count":
            len(dashboard),

        "dashboard":
            dashboard
    }


# ==================================================
# OLD DONOR DASHBOARD
# ==================================================
# Kept temporarily so the existing frontend does
# not break while we migrate it to /dashboard/me.
# ==================================================

@router.get("/dashboard/{donor_id}")
def get_donor_dashboard(
    donor_id: int,
    db: Session = Depends(get_db)
):

    # ------------------------------------------
    # CHECK DONOR
    # ------------------------------------------

    donor = db.query(Donor).filter(
        Donor.id == donor_id
    ).first()

    if not donor:
        raise HTTPException(
            status_code=404,
            detail="Donor not found"
        )


    # ------------------------------------------
    # GET DONOR NOTIFICATIONS
    # ------------------------------------------

    notifications = db.query(Notification).filter(
        Notification.donor_id == donor_id
    ).all()


    dashboard = []


    for notification in notifications:

        # ------------------------------------------
        # GET BLOOD REQUEST
        # ------------------------------------------

        blood_request = db.query(BloodRequest).filter(
            BloodRequest.id == notification.request_id
        ).first()

        if not blood_request:
            continue


        # ------------------------------------------
        # CALCULATE DISTANCE
        # ------------------------------------------

        distance = calculate_distance(
            blood_request.latitude,
            blood_request.longitude,
            donor.latitude,
            donor.longitude
        )


        # ------------------------------------------
        # DASHBOARD ITEM
        # ------------------------------------------

        dashboard.append({

            "id": notification.id,

            "status": notification.status,

            "distance_km": round(
                distance,
                2
            ),

            "match_reason":
                "Same blood group, eligible donation interval, available, and within 50 km",

            "request": {

                "id": blood_request.id,

                "patient_name":
                    blood_request.patient_name,

                "blood_group":
                    blood_request.blood_group,

                "city":
                    blood_request.city,

                "units_required":
                    blood_request.units_required,

                "status":
                    blood_request.status
            },

            "donor": {

                "id": donor.id,

                "name":
                    donor.name,

                "blood_group":
                    donor.blood_group,

                "city":
                    donor.city,

                "status":
                    donor.status
            }
        })


    return {

        "count":
            len(dashboard),

        "dashboard":
            dashboard
    }


# ==================================================
# ACCEPT NOTIFICATION
# ==================================================
# Only the donor who owns this notification can
# accept it.
# ==================================================

@router.post("/{notification_id}/accept")
def accept_notification(
    notification_id: int,
    current_user: User = Depends(require_roles("donor")),
    db: Session = Depends(get_db)
):

    # ------------------------------------------
    # FIND LOGGED-IN USER'S DONOR PROFILE
    # ------------------------------------------

    donor = db.query(Donor).filter(
        Donor.user_id == current_user.id
    ).first()

    if not donor:
        raise HTTPException(
            status_code=404,
            detail="Donor profile not found for this account"
        )


    # ------------------------------------------
    # FIND NOTIFICATION
    # ------------------------------------------

    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )


    # ------------------------------------------
    # SECURITY CHECK
    # ------------------------------------------
    # Make sure this notification belongs to
    # the currently logged-in donor.
    # ------------------------------------------

    if notification.donor_id != donor.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to accept this notification"
        )


    # ------------------------------------------
    # PREVENT RE-ACCEPTING
    # ------------------------------------------

    if notification.status == "accepted":
        raise HTTPException(
            status_code=400,
            detail="Notification already accepted"
        )


    if notification.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="This request has already been closed"
        )


    # ------------------------------------------
    # GET BLOOD REQUEST
    # ------------------------------------------

    blood_request = db.query(BloodRequest).filter(
        BloodRequest.id == notification.request_id
    ).first()

    if not blood_request:
        raise HTTPException(
            status_code=404,
            detail="Blood request not found"
        )


    # ------------------------------------------
    # PREVENT MULTIPLE ACCEPTED DONORS
    # ------------------------------------------

    existing_accepted = db.query(Notification).filter(
        Notification.request_id == notification.request_id,
        Notification.status == "accepted",
        Notification.id != notification.id
    ).first()

    if existing_accepted:
        raise HTTPException(
            status_code=400,
            detail="Another donor has already accepted this request"
        )


    # ------------------------------------------
    # ACCEPT
    # ------------------------------------------

    notification.status = "accepted"

    donor.status = "reserved"

    blood_request.status = "matched"


    # ------------------------------------------
    # CLOSE OTHER PENDING NOTIFICATIONS
    # ------------------------------------------

    other_notifications = db.query(Notification).filter(
        Notification.request_id == notification.request_id,
        Notification.id != notification.id,
        Notification.status == "pending"
    ).all()


    for other in other_notifications:
        other.status = "closed"


    db.commit()


    # ------------------------------------------
    # RETURN ACCEPTED DATA
    # ------------------------------------------

    return {

        "message":
            "Donor accepted the blood request",

        "notification": {

            "id":
                notification.id,

            "request_id":
                notification.request_id,

            "donor_id":
                notification.donor_id,

            "status":
                notification.status
        },

        "request": {

            "id":
                blood_request.id,

            "patient_name":
                blood_request.patient_name,

            "blood_group":
                blood_request.blood_group,

            "city":
                blood_request.city,

            "units_required":
                blood_request.units_required,

            "status":
                blood_request.status
        },

        "donor": {

            "id":
                donor.id,

            "name":
                donor.name,

            "blood_group":
                donor.blood_group,

            "city":
                donor.city,

            "status":
                donor.status
        },

        # ------------------------------------------
        # CONTACT REVEALED ONLY AFTER ACCEPTANCE
        # ------------------------------------------

        "donor_contact": {

            "name":
                donor.name,

            "phone":
                donor.phone,

            "email":
                donor.email
        }
    }
    
# ==================================================
# GET CONTACT DETAILS AFTER ACCEPTANCE
# ==================================================
# Contact details are revealed only when the donor
# has accepted the blood request.
# ==================================================

@router.get("/{notification_id}/contact")
def get_accepted_contact(
    notification_id: int,
    current_user: User = Depends(require_roles("donor")),
    db: Session = Depends(get_db)
):

    # ------------------------------------------
    # FIND LOGGED-IN USER'S DONOR PROFILE
    # ------------------------------------------

    donor = db.query(Donor).filter(
        Donor.user_id == current_user.id
    ).first()

    if not donor:
        raise HTTPException(
            status_code=404,
            detail="Donor profile not found for this account"
        )


    # ------------------------------------------
    # FIND NOTIFICATION
    # ------------------------------------------

    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )


    # ------------------------------------------
    # SECURITY CHECK
    # ------------------------------------------
    # The logged-in donor must own this
    # notification.
    # ------------------------------------------

    if notification.donor_id != donor.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to access this notification"
        )


    # ------------------------------------------
    # CONTACT ONLY AFTER ACCEPTANCE
    # ------------------------------------------

    if notification.status != "accepted":
        raise HTTPException(
            status_code=403,
            detail="Donor contact details are available only after acceptance"
        )


    # ------------------------------------------
    # RETURN CONTACT DETAILS
    # ------------------------------------------

    return {

        "message":
            "Donor contact details retrieved successfully",

        "donor_contact": {

            "name":
                donor.name,

            "phone":
                donor.phone,

            "email":
                donor.email
        }
    }