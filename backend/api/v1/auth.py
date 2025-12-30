"""
Authentication API endpoints - Simplified for POC
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from models.user import User
from api.v1.schemas import LoginRequest, RoleSelectionRequest, AuthResponse
import secrets

router = APIRouter()


@router.post("/login", response_model=dict)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Demo login - accepts any email/password for POC
    Returns user info without role selection
    """
    # For POC, just check if user exists by email
    result = await db.execute(
        select(User).where(User.email == request.email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        # Create a demo message
        raise HTTPException(
            status_code=404,
            detail="User not found. Try: admin@achariya.in, pranav.r@achariya.in, hari@achariya.in, principal.school@achariya.in"
        )
    
    # Return user info (role will be selected in next step for demo)
    return {
        "success": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
            "school_id": user.school_id
        }
    }


@router.post("/select-role", response_model=AuthResponse)
async def select_role(
    request: RoleSelectionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    POC role selection - in production this would validate against user's actual role
    For demo, allows selecting any role
    """
    # For POC, just return a token
    # In production, validate that selected role matches user's role
    
    return AuthResponse(
        user_id=1,  # Dummy
        email="demo@achariya.in",
        name="Demo User",
        role=request.role,
        school_id=None,
        token=secrets.token_urlsafe(32)
    )


@router.get("/me")
async def get_current_user():
    """
    Get current user info (simplified for POC)
    """
    return {
        "id": 1,
        "email": "demo@achariya.in",
        "name": "Demo User",
        "role": "Student"
    }
