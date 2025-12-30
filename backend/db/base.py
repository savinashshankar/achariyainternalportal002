"""
Import all models here for Alembic to detect them
"""
from db.base_class import Base

# Core entities
from models.school import School
from models.user import User
from models.class_section import ClassSection
from models.student_profile import StudentProfile
from models.teacher_profile import TeacherProfile
from models.principal_profile import PrincipalProfile

# Learning content
from models.course import Course
from models.curriculum_module import CurriculumModule
from models.content_item import ContentItem
from models.enrollment import Enrollment
from models.module_progress import ModuleProgress

# Assessment
from models.question_bank import QuestionBank
from models.question_option import QuestionOption
from models.quiz_config import QuizConfig
from models.quiz_attempt import QuizAttempt

# Gamification
from models.wallet_account import WalletAccount
from models.wallet_transaction import WalletTransaction
from models.badge import Badge
from models.user_badge import UserBadge

# Teacher features
from models.evidence_item import EvidenceItem

# Audit
from models.activity_log import ActivityLog

