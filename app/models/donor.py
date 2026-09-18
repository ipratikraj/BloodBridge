from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey

from app.database.database import Base


class Donor(Base):

    __tablename__ = "donors"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    name = Column(
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

    last_donation_date = Column(
        Date,
        nullable=True
    )

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="available"
    )