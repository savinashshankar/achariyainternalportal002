"""
Quiz Service - Quiz generation, scoring, and validation
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models.question_bank import QuestionBank
from models.question_option import QuestionOption
from models.quiz_config import QuizConfig
from models.quiz_attempt import QuizAttempt
from models.module_progress import ModuleProgress
from services.config_service import config_service
from typing import List, Dict, Optional
import random


class QuizService:
    """
    Handles quiz generation, scoring, and validation logic
    """
    
    @staticmethod
    async def generate_quiz(
        db: AsyncSession,
        module_id: int
    ) -> Dict:
        """
        Generate a quiz for a module
        
        Steps:
        1. Get quiz config for module (or use defaults)
        2. Pull random questions from question bank
        3. Shuffle questions and options
        4. Return quiz data
        """
        # Get quiz config
        result = await db.execute(
            select(QuizConfig).where(QuizConfig.module_id == module_id)
        )
        quiz_config = result.scalar_one_or_none()
        
        if not quiz_config:
            # Use default config
            total_questions = config_service.DEFAULT_QUIZ_QUESTIONS
            time_limit = config_service.DEFAULT_QUIZ_TIME_LIMIT_SECONDS
            pass_score = config_service.DEFAULT_PASS_SCORE_PERCENT
        else:
            total_questions = quiz_config.total_questions
            time_limit = quiz_config.time_limit_seconds
            pass_score = quiz_config.pass_score_percent
            
        # Get all questions for this module
        result = await db.execute(
            select(QuestionBank)
            .where(QuestionBank.module_id == module_id)
        )
        all_questions = result.scalars().all()
        
        # Select random questions (up to total_questions)
        num_questions = min(len(all_questions), total_questions)
        selected_questions = random.sample(list(all_questions), num_questions)
        
        # Shuffle questions
        random.shuffle(selected_questions)
        
        # Build quiz structure
        quiz_questions = []
        for question in selected_questions:
            # Get options for this question
            result = await db.execute(
                select(QuestionOption)
                .where(QuestionOption.question_id == question.id)
            )
            options = result.scalars().all()
            
            # Shuffle options
            options_list = list(options)
            random.shuffle(options_list)
            
            quiz_questions.append({
                "question_id": question.id,
                "question_text": question.question_text,
                "options": [
                    {
                        "option_id": opt.id,
                        "option_text": opt.option_text
                    }
                    for opt in options_list
                ]
            })
            
        return {
            "module_id": module_id,
            "total_questions": num_questions,
            "time_limit_seconds": time_limit,
            "pass_score_percent": pass_score,
            "questions": quiz_questions
        }
    
    @staticmethod
    async def submit_and_score_quiz(
        db: AsyncSession,
        enrollment_id: int,
        module_id: int,
        answers: Dict[int, int],  # question_id -> selected_option_id
        time_taken_seconds: int
    ) -> Dict:
        """
        Score a quiz submission and create quiz attempt record
        
        Args:
            enrollment_id: Student enrollment ID
            module_id: Module ID
            answers: Dict mapping question_id to selected option_id
            time_taken_seconds: Time taken to complete quiz
            
        Returns:
            Dict with score, pass status, and explanations for wrong answers
        """
        # Get quiz config for time limit
        result = await db.execute(
            select(QuizConfig).where(QuizConfig.module_id == module_id)
        )
        quiz_config = result.scalar_one_or_none()
        time_limit = quiz_config.time_limit_seconds if quiz_config else config_service.DEFAULT_QUIZ_TIME_LIMIT_SECONDS
        pass_score_percent = quiz_config.pass_score_percent if quiz_config else config_service.DEFAULT_PASS_SCORE_PERCENT
        
        # Check if completed in time
        completed_in_time = time_taken_seconds <= time_limit
        
        # Score the quiz
        total_questions = len(answers)
        correct_count = 0
        explanations = []
        
        for question_id, selected_option_id in answers.items():
            # Get the question and all options
            result = await db.execute(
                select(QuestionBank).where(QuestionBank.id == question_id)
            )
            question = result.scalar_one_or_none()
            
            result = await db.execute(
                select(QuestionOption).where(QuestionOption.question_id == question_id)
            )
            options = result.scalars().all()
            
            # Find correct option and selected option
            correct_option = next((opt for opt in options if opt.is_correct), None)
            selected_option = next((opt for opt in options if opt.id == selected_option_id), None)
            
            if selected_option and correct_option and selected_option.id == correct_option.id:
                correct_count += 1
            else:
                # Add explanation for wrong answer
                explanations.append({
                    "question_text": question.question_text if question else "",
                    "selected_option": selected_option.option_text if selected_option else "",
                    "correct_option": correct_option.option_text if correct_option else "",
                    "explanation": question.explanation_text if question else ""
                })
        
        # Calculate score percentage
        score_percent = (correct_count / total_questions * 100) if total_questions > 0 else 0
        
        # Get current attempt number
        result = await db.execute(
            select(func.count(QuizAttempt.id))
            .where(
                QuizAttempt.enrollment_id == enrollment_id,
                QuizAttempt.module_id == module_id
            )
        )
        attempt_count = result.scalar() or 0
        attempt_number = attempt_count + 1
        
        # Create quiz attempt record
        quiz_attempt = QuizAttempt(
            enrollment_id=enrollment_id,
            module_id=module_id,
            attempt_number=attempt_number,
            score_percent=score_percent,
            time_taken_seconds=time_taken_seconds,
            completed_in_time=completed_in_time
        )
        db.add(quiz_attempt)
        await db.commit()
        await db.refresh(quiz_attempt)
        
        # Check if passed
        passed = score_percent >= pass_score_percent and completed_in_time
        
        # Check if module can be marked as completed
        if passed:
            from services.progression_service import progression_service
            await progression_service.check_and_complete_module(db, enrollment_id, module_id)
        
        return {
            "attempt_id": quiz_attempt.id,
            "attempt_number": attempt_number,
            "score_percent": score_percent,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "time_taken_seconds": time_taken_seconds,
            "completed_in_time": completed_in_time,
            "passed": passed,
            "pass_score_percent": pass_score_percent,
            "remaining_attempts": max(0, config_service.MAX_QUIZ_ATTEMPTS - attempt_number),
            "explanations": explanations
        }
    
    @staticmethod
    async def get_attempt_count(
        db: AsyncSession,
        enrollment_id: int,
        module_id: int
    ) -> int:
        """Get number of quiz attempts for a module"""
        result = await db.execute(
            select(func.count(QuizAttempt.id))
            .where(
                QuizAttempt.enrollment_id == enrollment_id,
                QuizAttempt.module_id == module_id
            )
        )
        return result.scalar() or 0
    
    @staticmethod
    async def can_take_quiz(
        db: AsyncSession,
        enrollment_id: int,
        module_id: int
    ) -> tuple[bool, str]:
        """
        Check if student can take quiz
        
        Returns:
            (can_take, reason)
        """
        # Check attempt count
        attempt_count = await QuizService.get_attempt_count(db, enrollment_id, module_id)
        
        if attempt_count >= config_service.MAX_QUIZ_ATTEMPTS:
            return False, f"Maximum attempts ({config_service.MAX_QUIZ_ATTEMPTS}) reached"
            
        # Check if all content is consumed
        result = await db.execute(
            select(ModuleProgress).where(
                ModuleProgress.enrollment_id == enrollment_id,
                ModuleProgress.module_id == module_id
            )
        )
        progress = result.scalar_one_or_none()
        
        if not progress or progress.completion_percent < 100.0:
            return False, "Please complete all content before taking the quiz"
            
        return True, "OK"


quiz_service = QuizService()
