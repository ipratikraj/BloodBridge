from datetime import date
from math import radians, sin, cos, sqrt, atan2


# ==================================================
# BLOODBRIDGE MATCHING CONFIGURATION
# ==================================================

DONATION_INTERVAL_DAYS = 90
MAX_DISTANCE_KM = 50


# ==================================================
# CALCULATE DISTANCE
# ==================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate distance between two coordinates
    using the Haversine formula.
    """

    earth_radius_km = 6371

    lat1 = radians(lat1)
    lon1 = radians(lon1)

    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return earth_radius_km * c


# ==================================================
# FIND MATCHING DONORS
# ==================================================

def find_matching_donors(
    blood_group,
    request_latitude,
    request_longitude,
    donors
):
    """
    Find eligible donors based on:

    1. Exact blood group
    2. Donor availability
    3. Donation interval
    4. Maximum distance

    Results are sorted from nearest to farthest.
    """

    matches = []

    today = date.today()

    for donor in donors:

        # ------------------------------------------
        # 1. BLOOD GROUP
        # ------------------------------------------

        if donor["blood_group"] != blood_group:
            continue

        # ------------------------------------------
        # 2. DONOR STATUS
        # ------------------------------------------

        if donor.get("status") != "available":
            continue

        # ------------------------------------------
        # 3. DONATION INTERVAL
        # ------------------------------------------

        last_donation = donor.get(
            "last_donation_date"
        )

        if last_donation:

            if isinstance(last_donation, date):
                donation_date = last_donation
            else:
                donation_date = date.fromisoformat(
                    str(last_donation)
                )

            days_since_donation = (
                today - donation_date
            ).days

            if days_since_donation < DONATION_INTERVAL_DAYS:
                continue

        # ------------------------------------------
        # 4. DISTANCE
        # ------------------------------------------

        distance = calculate_distance(
            request_latitude,
            request_longitude,
            donor["latitude"],
            donor["longitude"]
        )

        if distance > MAX_DISTANCE_KM:
            continue

        # ------------------------------------------
        # MATCH FOUND
        # ------------------------------------------

        donor_match = {
            "id": donor["id"],
            "name": donor["name"],
            "blood_group": donor["blood_group"],
            "city": donor["city"],
            "distance_km": round(distance, 2),

            # Explain why this donor matched
            "match_reason": (
                "Same blood group, eligible donation "
                "interval, available, and within "
                "50 km"
            )
        }

        matches.append(donor_match)

    # ------------------------------------------
    # NEAREST DONORS FIRST
    # ------------------------------------------

    matches.sort(
        key=lambda donor:
            donor["distance_km"]
    )

    return matches