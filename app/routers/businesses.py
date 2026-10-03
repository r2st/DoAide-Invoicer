from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.business import Business
from app.models.user import User
from app.schemas.business import BusinessCreate, BusinessOut, BusinessUpdate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[BusinessOut])
def list_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[BusinessOut]:
    if current_user.plan != "ca":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Multi-client management requires CA plan",
        )
    clients = db.scalars(
        select(Business).where(Business.ca_user_id == current_user.id)
    ).all()
    return [BusinessOut.model_validate(c) for c in clients]


@router.post("", response_model=BusinessOut, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: BusinessCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BusinessOut:
    if current_user.plan != "ca":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Multi-client management requires CA plan",
        )
    client = Business(
        ca_user_id=current_user.id,
        name=payload.name,
        gstin=payload.gstin,
        state_code=payload.state_code,
        phone=payload.phone,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return BusinessOut.model_validate(client)


@router.put("/{client_id}", response_model=BusinessOut)
def update_client(
    client_id: int,
    payload: BusinessUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BusinessOut:
    client = db.scalar(
        select(Business).where(
            Business.id == client_id, Business.ca_user_id == current_user.id
        )
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)
    return BusinessOut.model_validate(client)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    client = db.scalar(
        select(Business).where(
            Business.id == client_id, Business.ca_user_id == current_user.id
        )
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
