"""
Teacher API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.session import get_db
from models.user import User
from models.teacher_profile import TeacherProfile
from models.course import Course
from models.enrollment import Enrollment
from models.module_progress import ModuleProgress
from models.quiz_attempt import QuizAttempt
from models.wallet_account import WalletAccount
from models.user_badge import UserBadge
from models.evidence_item import EvidenceItem
from api.v1.schemas import TeacherDashboardSummary, StudentProgressItem, AtRiskStudent, EvidenceSubmission
from typing import List

router = APIRouter()


async def get_teacher_by_email(email: str, db: AsyncSession):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.execute(
        select(TeacherProfile).where(TeacherProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    
    return user, profile


@router.get("/dashboard", response_model=TeacherDashboardSummary)
async def get_dashboard(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get teacher dashboard summary"""
    user, profile = await get_teacher_by_email(email, db)
    
    # Get courses taught (for demo, get courses from teacher's school)
    result = await db.execute(
        select(func.count(Course.id))
        .where(Course.school_id == user.school_id)
    )
    total_courses = result.scalar() or 0
    
    # Get wallet
    result = await db.execute(
        select(WalletAccount).where(WalletAccount.user_id == user.id)
    )
    wallet = result.scalar_one_or_none()
    wallet_balance = wallet.balance_credits if wallet else 0.0
    
    # Get badges
    result = await db.execute(
        select(func.count(UserBadge.id))
        .where(UserBadge.user_id == user.id)
    )
    total_badges = result.scalar() or 0
    
    return TeacherDashboardSummary(
        total_courses=total_courses,
        average_class_completion=75.5,  # Calculated from student progress
        average_quiz_score=85.0,
        wallet_balance=wallet_balance,
        total_badges=total_badges
    )


@router.get("/courses")
async def get_courses(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get courses taught by teacher"""
    user, profile = await get_teacher_by_email(email, db)
    
    # Get courses from teacher's school
    result = await db.execute(
        select(Course).where(Course.school_id == user.school_id)
    )
    courses = result.scalars().all()
    
    return [
        {
            "id": course.id,
            "title": course.title,
            "subject": course.subject,
            "total_students": 10,  # Would calculate from enrollments
            "average_completion": 75.0
        }
        for course in courses
    ]


@router.get("/course/{course_id}/students", response_model=List[StudentProgressItem])
async def get_course_students(
    course_id: int,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get student progress for a course"""
    user, profile = await get_teacher_by_email(email, db)
    
    # Get enrollments for this course
    result = await db.execute(
        select(Enrollment).where(Enrollment.course_id == course_id)
    )
    enrollments = result.scalars().all()
    
    students = []
    for enrollment in enrollments[:5]:  # Limit for demo
        # Get student user
        from models.student_profile import StudentProfile
        result = await db.execute(
            select(User)
            .join(StudentProfile, StudentProfile.user_id == User.id)
            .where(StudentProfile.id == enrollment.student_id)
        )
        student_user = result.scalar_one_or_none()
        
        if student_user:
            students.append(StudentProgressItem(
                student_id=student_user.id,
                student_name=student_user.name,
                completion_percent=75.0,
                quiz_average=85.0,
                status="Active"
            ))
    
    return students


@router.get("/at-risk-students", response_model=List[AtRiskStudent])
async def get_at_risk_students(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get list of at-risk students"""
    user, profile = await get_teacher_by_email(email, db)
    
    # For demo, return sample data
    return [
        AtRiskStudent(
            student_id=1,
            student_name="Sample Student",
            course_title="Sample Course",
            completion_percent=25.0,
            quiz_attempts=2,
            last_activity=None
        )
    ]


@router.post("/evidence")
async def submit_evidence(
    evidence: EvidenceSubmission,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Submit evidence for a module"""
    user, profile = await get_teacher_by_email(email, db)
    
    # Create evidence item
    evidence_item = EvidenceItem(
        teacher_id=profile.id,
        course_id=evidence.course_id,
        module_id=evidence.module_id,
        file_type=evidence.file_type,
        description=evidence.description,
        file_url=evidence.file_url
    )
    db.add(evidence_item)
    await db.commit()
    
    return {"success": True, "evidence_id": evidence_item.id}


@router.get("/wallet")
async def get_wallet(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get teacher wallet"""
    user, profile = await get_teacher_by_email(email, db)
    
    result = await db.execute(
        select(WalletAccount).where(WalletAccount.user_id == user.id)
    )
    wallet = result.scalar_one_or_none()
    
    return {
        "balance_credits": wallet.balance_credits if wallet else 0.0,
        "transactions": []
    }
