from fastapi import APIRouter
from state import app_state

router = APIRouter()

@router.get("/cache/debug")
def cache_debug(prefix:str=""):
    if len(prefix) == 0:
        return {"error": "prefix required"}
    
    cache = app_state["cache"]
    return cache.debug(prefix)
