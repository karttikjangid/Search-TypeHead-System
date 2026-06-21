from fastapi import APIRouter
from state import app_state

router = APIRouter()

@router.get("/debug/cache")
def cache_debug():
    counts = app_state.get("counts", {})
    return {"total_keys": len(counts), "counts": counts}
