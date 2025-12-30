"""
Student API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.session import get_db
from models.user import User
from models.student_profile import StudentProfile
from models.enrollment import Enrollment
from models.course import Course
from models.curriculum_module import CurriculumModule
from models.module_progress import ModuleProgress, ProgressStatus
from models.content_item import ContentItem
from models.wallet_account import WalletAccount
from models.wallet_transaction import WalletTransaction
from models.user_badge import UserBadge
from models.badge import Badge
from models.activity_log import ActivityLog
from services.progression_service import progression_service
from services.quiz_service import quiz_service
from services.config_service import config_service
from api.v1.schemas import (
    DashboardSummary, CourseListItem, ModuleInfo, ContentItemInfo,
    QuizData, QuizSubmission, QuizResult, WalletInfo, WalletTransaction as WalletTransactionSchema,
    BadgeInfo, ContentTrackingRequest, ChatbotQuery, ChatbotResponse
)
from typing import List
from datetime import datetime

router = APIRouter()


# Helper to get student profile from user email
async def get_student_by_email(email: str, db: AsyncSession):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    return user, profile


@router.get("/dashboard")
async def get_dashboard(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get student dashboard summary"""
    user, profile = await get_student_by_email(email, db)
    
    # Get total active courses
    result = await db.execute(
        select(func.count(Enrollment.id))
        .where(Enrollment.student_id == profile.id)
    )
    total_courses = result.scalar() or 0
    
    # Get average completion
    result = await db.execute(
        select(func.avg(ModuleProgress.completion_percent))
        .join(Enrollment, Enrollment.id == ModuleProgress.enrollment_id)
        .where(Enrollment.student_id == profile.id)
    )
    avg_completion = result.scalar() or 0.0
    
    # Get wallet balance
    result = await db.execute(
        select(WalletAccount).where(WalletAccount.user_id == user.id)
    )
    wallet = result.scalar_one_or_none()
    wallet_balance = wallet.balance_credits if wallet else 0.0
    
    # Get total badges
    result = await db.execute(
        select(func.count(UserBadge.id))
        .where(UserBadge.user_id == user.id)
    )
    total_badges = result.scalar() or 0
    
    return DashboardSummary(
        total_active_courses=total_courses,
        average_completion_percent=round(avg_completion, 2),
        wallet_balance=wallet_balance,
        total_badges=total_badges
    )


@router.get("/courses", response_model=List[CourseListItem])
async def get_courses(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all enrolled courses for student"""
    user, profile = await get_student_by_email(email, db)
    
    # Get enrollments with courses
    result = await db.execute(
        select(Enrollment, Course)
        .join(Course, Course.id == Enrollment.course_id)
        .where(Enrollment.student_id == profile.id)
    )
    enrollments = result.all()
    
    courses = []
    for enrollment, course in enrollments:
        # Calculate completion for this course
        result = await db.execute(
            select(func.avg(ModuleProgress.completion_percent))
            .where(
                ModuleProgress.enrollment_id == enrollment.id
            )
        )
        completion = result.scalar() or 0.0
        
        courses.append(CourseListItem(
            id=course.id,
            title=course.title,
            subject=course.subject,
            level=course.level,
            completion_percent=round(completion, 2),
            status=enrollment.status.value
        ))
    
    return courses


@router.get("/course/{course_id}")
async def get_course_detail(
    course_id: int,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get course details with modules"""
    user, profile = await get_student_by_email(email, db)
    
    # Get enrollment
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == profile.id,
            Enrollment.course_id == course_id
        )
    )
    enrollment = result.scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Get course
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get modules with unlock status
    modules = await progression_service.get_available_modules(db, enrollment.id, course_id)
    
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "subject": course.subject,
        "level": course.level,
        "modules": modules
    }


@router.get("/module/{module_id}")
async def get_module_detail(
    module_id: int,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get module details with content items"""
    user, profile = await get_student_by_email(email, db)
    
    # Get module
    result = await db.execute(
        select(CurriculumModule).where(CurriculumModule.id == module_id)
    )
    module = result.scalar_one_or_none()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Get enrollment for this course
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == profile.id,
            Enrollment.course_id == module.course_id
        )
    )
    enrollment = result.scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    # Check if unlocked
    is_unlocked = await progression_service.is_module_unlocked(db, enrollment.id, module_id)
    
    # Get progress
    result = await db.execute(
        select(ModuleProgress).where(
            ModuleProgress.enrollment_id == enrollment.id,
            ModuleProgress.module_id == module_id
        )
    )
    progress = result.scalar_one_or_none()
    
    # Get content items
    result = await db.execute(
        select(ContentItem)
        .where(ContentItem.module_id == module_id, ContentItem.active_flag == True)
    )
    content_items = result.scalars().all()
    
    return {
        "id": module.id,
        "title": module.title,
        "description": module.description,
        "estimated_duration_minutes": module.estimated_duration_minutes,
        "is_unlocked": is_unlocked,
        "status": progress.status.value if progress else "NotStarted",
        "completion_percent": progress.completion_percent if progress else 0.0,
        "content_items": [
            ContentItemInfo(
                id=item.id,
                type=item.type.value,
                title=item.title,
                description=item.description,
                url_or_path=item.url_or_path,
                duration_seconds=item.duration_seconds
            )
            for item in content_items
        ]
    }


@router.post("/module/{module_id}/track")
async def track_content(
    module_id: int,
    request: ContentTrackingRequest,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Track content consumption progress"""
    user, profile = await get_student_by_email(email, db)
    
    # Get enrollment
    result = await db.execute(
        select(CurriculumModule).where(CurriculumModule.id == module_id)
    )
    module = result.scalar_one_or_none()
    
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == profile.id,
            Enrollment.course_id == module.course_id
        )
    )
    enrollment = result.scalar_one_or_none()
    
    # Get or create progress
    result = await db.execute(
        select(ModuleProgress).where(
            ModuleProgress.enrollment_id == enrollment.id,
            ModuleProgress.module_id == module_id
        )
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = ModuleProgress(
            enrollment_id=enrollment.id,
            module_id=module_id,
            completion_percent=0.0,
            status=ProgressStatus.IN_PROGRESS
        )
        db.add(progress)
    
    # Update progress
    progress.completion_percent = max(progress.completion_percent, request.progress_percent)
    if progress.completion_percent >= 100.0:
        progress.completion_percent = 100.0
    
    if progress.status == ProgressStatus.NOT_STARTED:
        progress.status = ProgressStatus.IN_PROGRESS
    
    await db.commit()
    
    return {"success": True, "completion_percent": progress.completion_percent}


@router.get("/module/{module_id}/quiz", response_model=QuizData)
async def generate_quiz(
    module_id: int,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Generate a quiz for a module"""
    user, profile = await get_student_by_email(email, db)
    
    # Get enrollment
    result = await db.execute(
        select(CurriculumModule).where(CurriculumModule.id == module_id)
    )
    module = result.scalar_one_or_none()
    
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == profile.id,
            Enrollment.course_id == module.course_id
        )
    )
    enrollment = result.scalar_one_or_none()
    
    # Check if can take quiz
    can_take, reason = await quiz_service.can_take_quiz(db, enrollment.id, module_id)
    if not can_take:
        raise HTTPException(status_code=400, detail=reason)
    
    # Generate quiz
    quiz_data = await quiz_service.generate_quiz(db, module_id)
    
    return QuizData(**quiz_data)


@router.post("/module/{module_id}/quiz/submit", response_model=QuizResult)
async def submit_quiz(
    module_id: int,
    submission: QuizSubmission,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Submit quiz answers and get results"""
    user, profile = await get_student_by_email(email, db)
    
    # Get enrollment
    result = await db.execute(
        select(CurriculumModule).where(CurriculumModule.id == module_id)
    )
    module = result.scalar_one_or_none()
    
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == profile.id,
            Enrollment.course_id == module.course_id
        )
    )
    enrollment = result.scalar_one_or_none()
    
    # Score quiz
    result = await quiz_service.submit_and_score_quiz(
        db,
        enrollment.id,
        module_id,
        submission.answers,
        submission.time_taken_seconds
    )
    
    # Award credits if passed
    if result["passed"]:
        credits = config_service.get_credit_for_quiz_attempt(
            result["score_percent"],
            result["time_taken_seconds"],
            result["completed_in_time"]
        )
        
        # Get or create wallet
        wallet_result = await db.execute(
            select(WalletAccount).where(WalletAccount.user_id == user.id)
        )
        wallet = wallet_result.scalar_one_or_none()
        
        if wallet and credits > 0:
            # Add transaction
            transaction = WalletTransaction(
                wallet_id=wallet.id,
                reference_type="Quiz",
                reference_id=result["attempt_id"],
                credits_delta=credits,
                description=f"Module quiz completion - {credits} credits"
            )
            wallet.balance_credits += credits
            db.add(transaction)
            await db.commit()
    
    return QuizResult(**result)


@router.get("/wallet", response_model=WalletInfo)
async def get_wallet(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get wallet balance and transaction history"""
    user, profile = await get_student_by_email(email, db)
    
    # Get wallet
    result = await db.execute(
        select(WalletAccount).where(WalletAccount.user_id == user.id)
    )
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        return WalletInfo(balance_credits=0.0, transactions=[])
    
    # Get transactions
    result = await db.execute(
        select(WalletTransaction)
        .where(WalletTransaction.wallet_id == wallet.id)
        .order_by(WalletTransaction.created_at.desc())
    )
    transactions = result.scalars().all()
    
    return WalletInfo(
        balance_credits=wallet.balance_credits,
        transactions=[
            WalletTransactionSchema(
                id=t.id,
                reference_type=t.reference_type.value,
                credits_delta=t.credits_delta,
                description=t.description,
                created_at=t.created_at
            )
            for t in transactions
        ]
    )


@router.get("/badges", response_model=List[BadgeInfo])
async def get_badges(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Get earned badges"""
    user, profile = await get_student_by_email(email, db)
    
    # Get user badges
    result = await db.execute(
        select(UserBadge, Badge)
        .join(Badge, Badge.id == UserBadge.badge_id)
        .where(UserBadge.user_id == user.id)
    )
    user_badges = result.all()
    
    return [
        BadgeInfo(
            id=badge.id,
            code=badge.code,
            name=badge.name,
            description=badge.description,
            awarded_on=user_badge.awarded_on
        )
        for user_badge, badge in user_badges
    ]


@router.post("/chatbot", response_model=ChatbotResponse)
async def chatbot_query(
    query: ChatbotQuery,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Simple chatbot for course queries
    For POC, returns a simple response
    """
    # Simple implementation - in production would use vector search
    return ChatbotResponse(
        answer=f"Based on the course content, here's what I found about your query: '{query.query}'...",
        snippets=[
            "Content snippet 1 related to your question",
            "Content snippet 2 with relevant information"
        ]
    )
