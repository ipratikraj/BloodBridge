from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    request_id = Column(
        Integer,
        nullable=False
    )

    donor_id = Column(
        Integer,
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )