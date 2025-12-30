"""
Configuration Service - Centralized business rules configuration
"""

class ConfigService:
    """
    Centralized configuration for business logic rules
    In production, these would be stored in database and editable via admin panel
    """
    
    # Quiz Configuration
    DEFAULT_QUIZ_QUESTIONS = 15
    DEFAULT_QUIZ_TIME_LIMIT_SECONDS = 120  # 2 minutes
    DEFAULT_PASS_SCORE_PERCENT = 100  # 100% required to pass
    MAX_QUIZ_ATTEMPTS = 3
    
    # Content Consumption
    CONTENT_COMPLETION_THRESHOLD_PERCENT = 90  # 90% viewed = completed
    
    # Wallet Credits Configuration
    # Credit slabs based on quiz performance
    CREDIT_FAST_AND_FULL = 15  # Y credits: 100% score, <= 60 seconds
    CREDIT_NORMAL_AND_FULL = 10  # X credits: 100% score, <= 120 seconds
    CREDIT_OTHER = 2  # Z credits: passed but not full accuracy or slower
    
    # Time thresholds for credit calculation
    FAST_COMPLETION_THRESHOLD_SECONDS = 60
    NORMAL_COMPLETION_THRESHOLD_SECONDS = 120
    
    # Badge criteria
    BADGE_HIGH_PERFORMER_MODULES = 5  # Complete 5 modules with full score
    BADGE_SPEED_MASTER_COUNT = 3  # Get fast credits 3 times
    BADGE_DEDICATED_LEARNER_DAYS = 7  # Active for 7 consecutive days
    
    # Teacher Credits
    TEACHER_CREDIT_SYLLABUS_COMPLETION = 50
    TEACHER_CREDIT_HIGH_STUDENT_PERFORMANCE = 30
    TEACHER_CREDIT_EVIDENCE_SUBMISSION = 10
    TEACHER_HIGH_PERFORMANCE_THRESHOLD = 80  # 80% students passed
    
    @classmethod
    def get_credit_for_quiz_attempt(cls, score_percent: float, time_taken_seconds: int, completed_in_time: bool) -> int:
        """
        Calculate credits based on quiz performance
        
        Args:
            score_percent: Score percentage (0-100)
            time_taken_seconds: Time taken in seconds
            completed_in_time: Whether quiz was completed within time limit
            
        Returns:
            Credits to award
        """
        if not completed_in_time:
            return 0
            
        if score_percent >= 100:
            if time_taken_seconds <= cls.FAST_COMPLETION_THRESHOLD_SECONDS:
                return cls.CREDIT_FAST_AND_FULL
            elif time_taken_seconds <= cls.NORMAL_COMPLETION_THRESHOLD_SECONDS:
                return cls.CREDIT_NORMAL_AND_FULL
            else:
                return cls.CREDIT_OTHER
        elif score_percent >= cls.DEFAULT_PASS_SCORE_PERCENT:
            return cls.CREDIT_OTHER
        else:
            return 0
    
    @classmethod
    def to_dict(cls) -> dict:
        """Return configuration as dictionary for API responses"""
        return {
            "quiz": {
                "default_questions": cls.DEFAULT_QUIZ_QUESTIONS,
                "default_time_limit_seconds": cls.DEFAULT_QUIZ_TIME_LIMIT_SECONDS,
                "default_pass_score_percent": cls.DEFAULT_PASS_SCORE_PERCENT,
                "max_attempts": cls.MAX_QUIZ_ATTEMPTS
            },
            "content": {
                "completion_threshold_percent": cls.CONTENT_COMPLETION_THRESHOLD_PERCENT
            },
            "credits": {
                "fast_and_full": cls.CREDIT_FAST_AND_FULL,
                "normal_and_full": cls.CREDIT_NORMAL_AND_FULL,
                "other": cls.CREDIT_OTHER,
                "fast_threshold_seconds": cls.FAST_COMPLETION_THRESHOLD_SECONDS,
                "normal_threshold_seconds": cls.NORMAL_COMPLETION_THRESHOLD_SECONDS
            },
            "teacher_credits": {
                "syllabus_completion": cls.TEACHER_CREDIT_SYLLABUS_COMPLETION,
                "high_student_performance": cls.TEACHER_CREDIT_HIGH_STUDENT_PERFORMANCE,
                "evidence_submission": cls.TEACHER_CREDIT_EVIDENCE_SUBMISSION
            }
        }


# Singleton instance
config_service = ConfigService()
