"""
Principal API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.session import get_db
from models.user import User, UserRole
from models.principal_profile import PrincipalProfile
from models.course import Course
from models.student_profile import StudentProfile
from models.teacher_profile import TeacherProfile
from api.v1.schemas import PrincipalDashboardSummary, CompletionByGrade, WeeklyActiveData, TopPerformer
from typing import List

router = APIRouter()


async def get_principal_by_email(email: str, db: AsyncSession):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.execute(
        select(PrincipalProfile).where(PrincipalProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Principal profile not found")
    
    return user, profile


@router.get("/dashboard", response_model=PrincipalDashboardSummary)
async def get_dashboard(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get principal dashboard summary"""
    user, profile = await get_principal_by_email(email, db)
    
    # Get total students in school
    result = await db.execute(
        select(func.count(StudentProfile.id))
        .join(User, User.id == StudentProfile.user_id)
        .where(User.school_id == profile.school_id)
    )
    total_students = result.scalar() or 0
    
    # Get total teachers
    result = await db.execute(
        select(func.count(TeacherProfile.id))
        .join(User, User.id == TeacherProfile.user_id)
        .where(User.school_id == profile.school_id)
    )
    total_teachers = result.scalar() or 0
    
    # Get total courses
    result = await db.execute(
        select(func.count(Course.id))
        .where(Course.school_id == profile.school_id)
    )
    total_courses = result.scalar() or 0
    
    return PrincipalDashboardSummary(
        total_students=total_students,
        total_teachers=total_teachers,
        total_courses=total_courses,
        average_completion=72.5
    )


@router.get("/completion-by-grade", response_model=List[CompletionByGrade])
async def get_completion_by_grade(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get completion percentage by grade"""
    user, profile = await get_principal_by_email(email, db)
    
    # For demo, return sample data
    return [
        CompletionByGrade(grade="10", completion_percent=75.0),
        CompletionByGrade(grade="12", completion_percent=80.0),
    ]


@router.get("/weekly-active", response_model=List[WeeklyActiveData])
async def get_weekly_active(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get weekly active students trend"""
    return [
        WeeklyActiveData(week="Week 1", active_students=45),
        WeeklyActiveData(week="Week 2", active_students=50),
        WeeklyActiveData(week="Week 3", active_students=48),
        WeeklyActiveData(week="Week 4", active_students=52),
    ]


@router.get("/top-performers", response_model=List[TopPerformer])
async def get_top_performers(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get top performing students"""
    user, profile = await get_principal_by_email(email, db)
    
    # Get students from this school
    result = await db.execute(
        select(User)
        .where(User.school_id == profile.school_id, User.role == UserRole.STUDENT)
        .limit(5)
    )
    students = result.scalars().all()
    
    return [
        TopPerformer(
            user_id=student.id,
            name=student.name,
            performance_index=90.0 + i
        )
        for i, student in enumerate(students)
    ]


@router.get("/courses")
async def get_courses(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all courses in school"""
    user, profile = await get_principal_by_email(email, db)
    
    result = await db.execute(
        select(Course).where(Course.school_id == profile.school_id)
    )
    courses = result.scalars().all()
    
    return [
        {
            "id": course.id,
            "title": course.title,
            "subject": course.subject,
            "total_enrollments": 15,
            "average_completion": 75.0
        }
        for course in courses
    ]


@router.get("/export")
async def export_summary(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Export summary data (returns download URL for POC)"""
    return {
        "download_url": "/exports/summary_2025.pdf",
        "format": "PDF",
        "generated_at": "2025-12-05T11:30:00"
    }
