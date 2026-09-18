from sqlalchemy import Column, Integer, String, Float

from app.database.database import Base


class BloodRequest(Base):

    __tablename__ = "blood_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_name = Column(
        String,
        nullable=False
    )

    blood_group = Column(
        String,
        nullable=False
    )

    city = Column(
        String,
        nullable=False
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    units_required = Column(
        Integer,
        nullable=False
    )

    source_type = Column(
        String,
        nullable=False,
        default="individual"
    )

    verification_status = Column(
        String,
        nullable=False,
        default="pending"
    )

    status = Column(
        String,
        default="pending"
    )