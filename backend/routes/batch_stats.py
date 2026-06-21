from fastapi import APIRouter
from state import app_state

router = APIRouter()


@router.get("/batch/stats")
def batch_stats():
    return app_state["batch"].get_stats()
