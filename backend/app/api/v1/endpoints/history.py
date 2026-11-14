"""Scan History Endpoint."""
from fastapi import APIRouter, Query
from app.schemas.scan import HistoryResponse
from app.services.history_store import history_store

router = APIRouter()

@router.get(
    "/history",
    response_model=HistoryResponse,
    summary="Get Recent Scan History",
    description="Returns recent scan audit logs with full threat breakdowns and risk metrics."
)
async def get_history_endpoint(limit: int = Query(default=20, ge=1, le=100)) -> HistoryResponse:
    items = history_store.get_all(limit=limit)
    return HistoryResponse(
        total=len(items),
        items=items
    )

