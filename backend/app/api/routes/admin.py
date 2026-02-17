from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .users import require_role
from app.db.session import get_db


router = APIRouter(dependencies=[Depends(require_role("controller", "admin"))])


@router.post("/seed")
def trigger_seed(db: Session = Depends(get_db)) -> dict:
    # Import inside handler to avoid import at startup if file not present in some deployments
    from seed_train_data import seed_data
    seed_data()
    return {"ok": True}


@router.post("/simulate_quick")
def simulate_quick() -> dict:
    # Run a quick synthetic scenario to generate positions/logs dynamics
    from app.services.simulator import simulator_service
    scenario = {
        "name": "Quick Demo",
        "disruptions": [
            {"type": "delay", "start_ts": 0, "duration_seconds": 900, "section_id": "S1", "severity": "medium"},
            {"type": "platform_issue", "start_ts": 0, "duration_seconds": 600, "section_id": "S1", "severity": "low"},
        ],
    }
    res = simulator_service.run(scenario)
    return {"ok": True, "simulation_id": res.get("id")}


