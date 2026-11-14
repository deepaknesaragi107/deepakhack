"""API Router Aggregator."""
from fastapi import APIRouter
from app.api.v1.endpoints import health, scan_url, scan_message, history

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(scan_url.router, tags=["URL Scanner"])
api_router.include_router(scan_message.router, tags=["Message Scanner"])
api_router.include_router(history.router, tags=["Scan History"])

