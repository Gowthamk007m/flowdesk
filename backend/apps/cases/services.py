from datetime import datetime

from django.db import transaction

from .models import Case


@transaction.atomic
def create_case(*, validated_data, created_by):
    year = datetime.now().year

    last_case = ( Case.objects.select_for_update() .filter(case_number__startswith=f"CASE-{year}-") .order_by("-case_number") .first() )

    if last_case:
        last_number = int(last_case.case_number.split("-")[-1])
        next_number = last_number + 1
    else:
        next_number = 1

    case_number = f"CASE-{year}-{next_number:06d}"

    return Case.objects.create(
        case_number=case_number,
        created_by=created_by,
        **validated_data,
    )