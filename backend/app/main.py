"""
ForgeWatch AI - FastAPI Application Main Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas import HealthResponse
from backend.app.registry import get_all_studies_status
from backend.app.api.routes_studies import router as studies_router
from backend.app.api.routes_comparison import router as comparison_router
from backend.app.api.routes_prediction import router as prediction_router

app = FastAPI(
    title="ForgeWatch AI Research Platform API",
    description="Multi-student comparative machine learning platform for industrial equipment condition monitoring.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(studies_router)
app.include_router(comparison_router)
app.include_router(prediction_router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    statuses = get_all_studies_status()
    completed = [s_id for s_id, s_data in statuses.items() if s_data["status"] == "completed"]
    pending = [s_id for s_id, s_data in statuses.items() if s_data["status"] == "pending"]
    
    return HealthResponse(
        status="healthy",
        service="ForgeWatch AI Backend",
        version="1.0.0",
        completed_studies=completed,
        pending_studies=pending
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
