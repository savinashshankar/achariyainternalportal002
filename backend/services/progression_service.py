"""
Progression Service - Sequential module unlock logic
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.module_progress import ModuleProgress, ProgressStatus
from models.curriculum_module import CurriculumModule
from models.quiz_attempt import QuizAttempt
from models.enrollment import Enrollment
from services.config_service import config_service
from typing import List, Dict, Optional


class ProgressionService:
    """
    Handles sequential module unlock logic and progression rules
    """
    
    @staticmethod
    async def is_module_unlocked(
        db: AsyncSession,
        enrollment_id: int,
        module_id: int
    ) -> bool:
        """
        Check if a module is unlocked for a student
        
        Rules:
        - First module is always unlocked
        - Subsequent modules unlock when previous module is completed
        - Completed = 100% content consumption + passed quiz
        """
        # Get the module to check its order
        result = await db.execute(
            select(CurriculumModule).where(CurriculumModule.id == module_id)
        )
        current_module = result.scalar_one_or_none()
        
        if not current_module:
            return False
            
        # First module is always unlocked
        if current_module.module_order == 1:
            return True
            
        # Get the previous module
        result = await db.execute(
            select(CurriculumModule).where(
                CurriculumModule.course_id == current_module.course_id,
                CurriculumModule.module_order == current_module.module_order - 1
            )
        )
        previous_module = result.scalar_one_or_none()
        
        if not previous_module:
            return False
            
        # Check if previous module is completed
        result = await db.execute(
            select(ModuleProgress).where(
                ModuleProgress.enrollment_id == enrollment_id,
                ModuleProgress.module_id == previous_module.id
            )
        )
        previous_progress = result.scalar_one_or_none()
        
        if not previous_progress:
            return False
            
        return previous_progress.status == ProgressStatus.COMPLETED
    
    @staticmethod
    async def get_available_modules(
        db: AsyncSession,
        enrollment_id: int,
        course_id: int
    ) -> List[Dict]:
        """
        Get list of modules with their unlock status
        
        Returns:
            List of modules with unlock status and progress
        """
        # Get all modules for the course
        result = await db.execute(
            select(CurriculumModule)
            .where(CurriculumModule.course_id == course_id)
            .order_by(CurriculumModule.module_order)
        )
        modules = result.scalars().all()
        
        # Get all progress records for this enrollment
        result = await db.execute(
            select(ModuleProgress)
            .where(ModuleProgress.enrollment_id == enrollment_id)
        )
        progress_records = {p.module_id: p for p in result.scalars().all()}
        
        module_list = []
        for module in modules:
            # Check if unlocked
            is_unlocked = await ProgressionService.is_module_unlocked(db, enrollment_id, module.id)
            
            progress = progress_records.get(module.id)
            
            module_list.append({
                "id": module.id,
                "title": module.title,
                "description": module.description,
                "order": module.module_order,
                "estimated_duration_minutes": module.estimated_duration_minutes,
                "is_unlocked": is_unlocked,
                "status": progress.status.value if progress else ProgressStatus.NOT_STARTED.value,
                "completion_percent": progress.completion_percent if progress else 0.0
            })
            
        return module_list
    
    @staticmethod
    async def check_and_complete_module(
        db: AsyncSession,
        enrollment_id: int,
        module_id: int
    ) -> bool:
        """
        Check if module can be marked as completed based on:
        1. Content consumption = 100%
        2. Latest quiz attempt passed (score >= 100%, completed in time)
        
        Returns:
            True if module was marked as completed, False otherwise
        """
        # Get module progress
        result = await db.execute(
            select(ModuleProgress).where(
                ModuleProgress.enrollment_id == enrollment_id,
                ModuleProgress.module_id == module_id
            )
        )
        progress = result.scalar_one_or_none()
        
        if not progress:
            return False
            
        # Check content consumption
        if progress.completion_percent < 100.0:
            return False
            
        # Get latest quiz attempt
        result = await db.execute(
            select(QuizAttempt)
            .where(
                QuizAttempt.enrollment_id == enrollment_id,
                QuizAttempt.module_id == module_id
            )
            .order_by(QuizAttempt.attempt_datetime.desc())
        )
        latest_attempt = result.first()
        
        if not latest_attempt:
            return False
            
        attempt = latest_attempt[0]
        
        # Check if passed
        passed = (
            attempt.score_percent >= config_service.DEFAULT_PASS_SCORE_PERCENT and
            attempt.completed_in_time
        )
        
        if passed and progress.status != ProgressStatus.COMPLETED:
            progress.status = ProgressStatus.COMPLETED
            await db.commit()
            return True
            
        return False
    
    @staticmethod
    async def unlock_next_module(
        db: AsyncSession,
        enrollment_id: int,
        current_module_id: int
    ) -> Optional[int]:
        """
        Unlock the next module after completing current module
        
        Returns:
            ID of next module if it exists and was unlocked, None otherwise
        """
        # Get current module
        result = await db.execute(
            select(CurriculumModule).where(CurriculumModule.id == current_module_id)
        )
        current_module = result.scalar_one_or_none()
        
        if not current_module:
            return None
            
        # Get next module
        result = await db.execute(
            select(CurriculumModule).where(
                CurriculumModule.course_id == current_module.course_id,
                CurriculumModule.module_order == current_module.module_order + 1
            )
        )
        next_module = result.scalar_one_or_none()
        
        if not next_module:
            return None  # No more modules
            
        # Create progress record if not exists
        result = await db.execute(
            select(ModuleProgress).where(
                ModuleProgress.enrollment_id == enrollment_id,
                ModuleProgress.module_id == next_module.id
            )
        )
        progress = result.scalar_one_or_none()
        
        if not progress:
            progress = ModuleProgress(
                enrollment_id=enrollment_id,
                module_id=next_module.id,
                status=ProgressStatus.NOT_STARTED,
                completion_percent=0.0
            )
            db.add(progress)
            await db.commit()
            
        return next_module.id


progression_service = ProgressionService()
