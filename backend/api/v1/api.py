"""
API Router - Combines all API endpoints
"""
from fastapi import APIRouter
from api.v1 import auth, students, teachers, principal, admin

api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students.router, prefix="/student", tags=["Student"])
api_router.include_router(teachers.router, prefix="/teacher", tags=["Teacher"])
api_router.include_router(principal.router, prefix="/principal", tags=["Principal"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
