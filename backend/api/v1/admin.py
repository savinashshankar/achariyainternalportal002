"""
Admin API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.session import get_db
from models.course import Course
from models.curriculum_module import CurriculumModule
from models.content_item import ContentItem, ContentType
from models.user import User, UserRole
from models.student_profile import StudentProfile
from models.teacher_profile import TeacherProfile
from models.question_bank import QuestionBank
from models.question_option import QuestionOption
from models.activity_log import ActivityLog
from services.config_service import config_service
from api.v1.schemas import (
    CourseCreate, CourseUpdate, ModuleCreate, ContentCreate,
    UserCreate, QuestionCreate, ConfigUpdate
)
from typing import List, Optional

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    """Get admin dashboard overview"""
    # Get totals
    result = await db.execute(select(func.count(User.id)))
    total_users = result.scalar() or 0
    
    result = await db.execute(select(func.count(Course.id)))
    total_courses = result.scalar() or 0
    
    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_modules": 0,
        "total_questions": 0
    }


# Course Management
@router.get("/courses")
async def get_courses(db: AsyncSession = Depends(get_db)):
    """Get all courses"""
    result = await db.execute(select(Course))
    courses = result.scalars().all()
    
    return [
        {
            "id": course.id,
            "title": course.title,
            "subject": course.subject,
            "level": course.level,
            "status": course.status
        }
        for course in courses
    ]


@router.post("/courses")
async def create_course(
    course_data: CourseCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new course"""
    course = Course(
        school_id=course_data.school_id,
        title=course_data.title,
        description=course_data.description,
        subject=course_data.subject,
        level=course_data.level,
        status="Active"
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    
    return {"success": True, "course_id": course.id}


@router.put("/courses/{course_id}")
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a course"""
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course_data.title:
        course.title = course_data.title
    if course_data.description:
        course.description = course_data.description
    if course_data.subject:
        course.subject = course_data.subject
    if course_data.level:
        course.level = course_data.level
    if course_data.status:
        course.status = course_data.status
    
    await db.commit()
    
    return {"success": True}


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Archive a course"""
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.status = "Archived"
    await db.commit()
    
    return {"success": True}


# Module Management
@router.get("/course/{course_id}/modules")
async def get_modules(
    course_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get modules for a course"""
    result = await db.execute(
        select(CurriculumModule)
        .where(CurriculumModule.course_id == course_id)
        .order_by(CurriculumModule.module_order)
    )
    modules = result.scalars().all()
    
    return [
        {
            "id": module.id,
            "title": module.title,
            "order": module.module_order,
            "estimated_duration_minutes": module.estimated_duration_minutes
        }
        for module in modules
    ]


@router.post("/modules")
async def create_module(
    module_data: ModuleCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new module"""
    module = CurriculumModule(
        course_id=module_data.course_id,
        module_order=module_data.module_order,
        title=module_data.title,
        description=module_data.description,
        estimated_duration_minutes=module_data.estimated_duration_minutes
    )
    db.add(module)
    await db.commit()
    await db.refresh(module)
    
    return {"success": True, "module_id": module.id}


# Content Management
@router.get("/module/{module_id}/content")
async def get_content(
    module_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get content items for a module"""
    result = await db.execute(
        select(ContentItem).where(ContentItem.module_id == module_id)
    )
    content_items = result.scalars().all()
    
    return [
        {
            "id": item.id,
            "type": item.type.value,
            "title": item.title,
            "url_or_path": item.url_or_path
        }
        for item in content_items
    ]


@router.post("/content")
async def create_content(
    content_data: ContentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create new content item"""
    content = ContentItem(
        module_id=content_data.module_id,
        type=ContentType[content_data.type],
        title=content_data.title,
        description=content_data.description,
        url_or_path=content_data.url_or_path,
        duration_seconds=content_data.duration_seconds,
        active_flag=True
    )
    db.add(content)
    await db.commit()
    await db.refresh(content)
    
    return {"success": True, "content_id": content.id}


# User Management
@router.get("/users")
async def get_users(
    role: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all users, optionally filtered by role"""
    query = select(User)
    if role:
        query = query.where(User.role == UserRole[role.upper()])
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    return [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
            "status": user.status
        }
        for user in users
    ]


@router.post("/users")
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new user"""
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=UserRole[user_data.role.upper()],
        school_id=user_data.school_id,
        status="Active"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Create profile based on role
    if user.role == UserRole.STUDENT and user_data.class_section_id:
        from models.class_section import ClassSection
        profile = StudentProfile(
            user_id=user.id,
            class_section_id=user_data.class_section_id
        )
        db.add(profile)
    elif user.role == UserRole.TEACHER:
        profile = TeacherProfile(
            user_id=user.id,
            department=user_data.department,
            designation=user_data.designation
        )
        db.add(profile)
    
    await db.commit()
    
    return {"success": True, "user_id": user.id}


# Question Bank Management
@router.get("/module/{module_id}/questions")
async def get_questions(
    module_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get questions for a module"""
    result = await db.execute(
        select(QuestionBank).where(QuestionBank.module_id == module_id)
    )
    questions = result.scalars().all()
    
    questions_list = []
    for question in questions:
        result = await db.execute(
            select(QuestionOption).where(QuestionOption.question_id == question.id)
        )
        options = result.scalars().all()
        
        questions_list.append({
            "id": question.id,
            "question_text": question.question_text,
            "explanation_text": question.explanation_text,
            "options": [
                {
                    "id": opt.id,
                    "text": opt.option_text,
                    "is_correct": opt.is_correct
                }
                for opt in options
            ]
        })
    
    return questions_list


@router.post("/questions")
async def create_question(
    question_data: QuestionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new question with options"""
    question = QuestionBank(
        module_id=question_data.module_id,
        question_text=question_data.question_text,
        explanation_text=question_data.explanation_text
    )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    
    # Add options
    for option_data in question_data.options:
        option = QuestionOption(
            question_id=question.id,
            option_text=option_data["text"],
            is_correct=option_data.get("is_correct", False)
        )
        db.add(option)
    
    await db.commit()
    
    return {"success": True, "question_id": question.id}


# Configuration
@router.get("/config")
async def get_config():
    """Get current configuration"""
    return config_service.to_dict()


@router.put("/config")
async def update_config(config_data: ConfigUpdate):
    """Update configuration (for POC, this just returns success)"""
    return {"success": True, "message": "Configuration updated"}


# Activity Logs
@router.get("/activity-logs")
async def get_activity_logs(
    user_id: Optional[int] = None,
    action_type: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get activity logs with optional filters"""
    query = select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit)
    
    if user_id:
        query = query.where(ActivityLog.user_id == user_id)
    if action_type:
        query = query.where(ActivityLog.action_type == action_type)
    
    result = await db.execute(query)
    logs = result.scalars().all()
    
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action_type": log.action_type,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "created_at": log.created_at
        }
        for log in logs
    ]
