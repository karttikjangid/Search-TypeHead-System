# routes/search.py

import time
from fastapi import APIRouter
from state import app_state
from pydantic import BaseModel

router = APIRouter()

class SearchRequest(BaseModel):
    query: str

@router.post("/search")
def search(body: SearchRequest):
    query = body.query.strip().lower()

    app_state["batch"].add(query)

    now = time.time()
    trending = app_state.setdefault("trending", {})
    if query not in trending:
        trending[query] = []
    trending[query].append({"count": 1, "timestamp": now})
    cutoff = now - 24 * 3600
    trending[query] = [e for e in trending[query] if e["timestamp"] >= cutoff]

    return {"message": "Searched"}
