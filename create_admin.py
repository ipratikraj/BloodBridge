import os

from app.core.security import hash_password
from app.database.database import SessionLocal
from app.models.user import User


admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")


if not admin_email or not admin_password:
    raise RuntimeError(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment."
    )


db = SessionLocal()

try:
    existing_admin = (
        db.query(User)
        .filter(User.email == admin_email.lower().strip())
        .first()
    )

    if existing_admin:
        if existing_admin.role != "admin":
            existing_admin.role = "admin"
            db.commit()
            print("Existing account updated to admin.")
        else:
            print("Admin account already exists.")
    else:
        admin = User(
            full_name="BloodBridge Admin",
            email=admin_email.lower().strip(),
            password_hash=hash_password(admin_password),
            role="admin",
            is_active=True,
            is_verified=True,
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")

finally:
    db.close()