# routes/trending.py

import time
from fastapi import APIRouter
from state import app_state

router = APIRouter()

WINDOW_HOURS = 24
GRAVITY = 1.5

def calculate_score(events: list, now: float) -> float:
    total = 0.0
    cutoff = now - WINDOW_HOURS * 3600
    for event in events:
        if event["timestamp"] >= cutoff:
            elapsed_hours = (now - event["timestamp"]) / 3600
            total += event["count"] / ((elapsed_hours + 2) ** GRAVITY)
    return total

@router.get("/trending")
def trending():
    now = time.time()
    trending_data = app_state.get("trending", {})
    
    scores = []
    for query, events in trending_data.items():
        score = calculate_score(events, now)
        if score > 0:
            scores.append({"query": query, "score": round(score, 4)})
    
    # sort by score descending, return top 10
    scores.sort(key=lambda x: x["score"], reverse=True)
    return {"trending": scores[:10]}