from datetime import date
from math import radians, sin, cos, sqrt, atan2


# ==================================================
# BLOODBRIDGE MATCHING CONFIGURATION
# ==================================================

DONATION_INTERVAL_DAYS = 90
MAX_DISTANCE_KM = 50

# Standard red blood cell compatibility matrix
# (Who can donor give blood to?)
RED_BLOOD_CELL_COMPATIBILITY = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],  # Universal donor
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"]  # Recipient only
}


# ==================================================
# CALCULATE DISTANCE (HAVERSINE)
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
# SMART MATCH SCORE CALCULATION
# ==================================================
# Breakdown:
#   Blood compatibility:  40%
#   Distance:             30%
#   Availability:         20%
#   Donation eligibility: 10%
#   Total:               100%
# ==================================================

def compute_smart_match_score(
    donor_blood,
    needed_blood,
    distance_km,
    donor_status,
    days_since_donation
):
    """
    Computes a weighted multi-factor match score (0-100%)
    based on medical compatibility, geographic proximity,
    donor status, and eligibility interval.
    """

    # 1. Blood Compatibility (Max: 40%)
    if donor_blood == needed_blood:
        compatibility_score = 40
    elif needed_blood in RED_BLOOD_CELL_COMPATIBILITY.get(donor_blood, []):
        compatibility_score = 35  # Clinically compatible alternative
    else:
        compatibility_score = 0

    # 2. Distance Score (Max: 30%)
    if distance_km <= 2.0:
        distance_score = 30
    elif distance_km <= 5.0:
        distance_score = 28
    elif distance_km <= 15.0:
        distance_score = 24
    elif distance_km <= 30.0:
        distance_score = 18
    elif distance_km <= MAX_DISTANCE_KM:
        distance_score = max(5, round(30 * (1 - (distance_km / MAX_DISTANCE_KM))))
    else:
        distance_score = 0

    # 3. Availability Score (Max: 20%)
    if donor_status == "available":
        availability_score = 20
    elif donor_status == "busy":
        availability_score = 8
    else:
        availability_score = 0

    # 4. Donation Eligibility Score (Max: 10%)
    if days_since_donation is None:
        eligibility_score = 10  # First-time or unrecorded eligible donor
    elif days_since_donation >= 180:
        eligibility_score = 10
    elif days_since_donation >= DONATION_INTERVAL_DAYS:
        eligibility_score = 9
    else:
        eligibility_score = 0

    total_score = compatibility_score + distance_score + availability_score + eligibility_score
    total_score = max(0, min(100, total_score))

    breakdown = {
        "blood_compatibility": compatibility_score,
        "distance": distance_score,
        "availability": availability_score,
        "donation_eligibility": eligibility_score,
        "total": total_score
    }

    return total_score, breakdown


# ==================================================
# FIND MATCHING DONORS (SMART SCORING)
# ==================================================

def find_matching_donors(
    blood_group,
    request_latitude,
    request_longitude,
    donors
):
    """
    Find and rank matching donors using the Smart Match scoring system:
    - Compatibility (40%)
    - Proximity (30%)
    - Availability (20%)
    - Eligibility (10%)

    Results are sorted by highest Match Score first.
    """

    matches = []
    today = date.today()

    for donor in donors:
        donor_blood = donor.get("blood_group")

        # Must be exact match or medically compatible
        is_exact = donor_blood == blood_group
        is_compatible = blood_group in RED_BLOOD_CELL_COMPATIBILITY.get(donor_blood, [])

        if not is_exact and not is_compatible:
            continue

        # Check distance
        distance = calculate_distance(
            request_latitude,
            request_longitude,
            donor["latitude"],
            donor["longitude"]
        )

        if distance > MAX_DISTANCE_KM:
            continue

        # Check donation interval
        last_donation = donor.get("last_donation_date")
        days_since_donation = None
        is_eligible = True

        if last_donation:
            if isinstance(last_donation, date):
                donation_date = last_donation
            else:
                try:
                    donation_date = date.fromisoformat(str(last_donation))
                except Exception:
                    donation_date = None

            if donation_date:
                days_since_donation = (today - donation_date).days
                if days_since_donation < DONATION_INTERVAL_DAYS:
                    is_eligible = False

        # Filter out completely ineligible/unavailable donors if necessary
        donor_status = donor.get("status", "available")
        if donor_status not in ["available", "busy"]:
            continue

        # Calculate Smart Match Score
        score, breakdown = compute_smart_match_score(
            donor_blood=donor_blood,
            needed_blood=blood_group,
            distance_km=distance,
            donor_status=donor_status,
            days_since_donation=days_since_donation
        )

        rounded_dist = round(distance, 2)

        match_reason = (
            f"Smart Match {score}%: "
            f"Compatibility {breakdown['blood_compatibility']}%, "
            f"Distance {breakdown['distance']}%, "
            f"Availability {breakdown['availability']}%, "
            f"Eligibility {breakdown['donation_eligibility']}%"
        )

        donor_match = {
            "id": donor["id"],
            "name": donor["name"],
            "blood_group": donor["blood_group"],
            "city": donor["city"],
            "distance_km": rounded_dist,
            "status": donor_status,
            "is_eligible": is_eligible,
            "match_score": score,
            "score_breakdown": breakdown,
            "match_reason": match_reason
        }

        matches.append(donor_match)

    # Sort primarily by Match Score descending, secondarily by Distance ascending
    matches.sort(
        key=lambda d: (-d["match_score"], d["distance_km"])
    )

    return matches