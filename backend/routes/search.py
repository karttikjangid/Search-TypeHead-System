# routes/search.py

from fastapi import APIRouter
from state import app_state
from pydantic import BaseModel

router = APIRouter()

class SearchRequest(BaseModel):
    query: str

@router.post("/search")
def search(body: SearchRequest):
    query = body.query.strip().lower()

    counts = app_state["counts"]       # get the dict
    if query not in counts:
        counts[query] = 0              # initialize if first time
    counts[query] += 1                 # increment

    return {"message": "Searched"}