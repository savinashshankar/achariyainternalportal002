"""
Pydantic schemas for API request/response models
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class RoleSelectionRequest(BaseModel):
    role: str  # Student, Teacher, Principal, Admin


class AuthResponse(BaseModel):
    user_id: int
    email: str
    name: str
    role: str
    school_id: Optional[int]
    token: str  # Dummy for POC


# Student Schemas
class DashboardSummary(BaseModel):
    total_active_courses: int
    average_completion_percent: float
    wallet_balance: float
    total_badges: int


class CourseListItem(BaseModel):
    id: int
    title: str
    subject: str
    level: Optional[str]
    completion_percent: float
    status: str


class ModuleInfo(BaseModel):
    id: int
    title: str
    description: Optional[str]
    order: int
    estimated_duration_minutes: Optional[int]
    is_unlocked: bool
    status: str
    completion_percent: float


class ContentItemInfo(BaseModel):
    id: int
    type: str
    title: str
    description: Optional[str]
    url_or_path: str
    duration_seconds: Optional[int]


class QuizQuestion(BaseModel):
    question_id: int
    question_text: str
    options: List[Dict[str, Any]]


class QuizData(BaseModel):
    module_id: int
    total_questions: int
    time_limit_seconds: int
    pass_score_percent: int
    questions: List[QuizQuestion]


class QuizSubmission(BaseModel):
    answers: Dict[int, int]  # question_id -> option_id
    time_taken_seconds: int


class QuizResult(BaseModel):
    attempt_id: int
    attempt_number: int
    score_percent: float
    correct_count: int
    total_questions: int
    time_taken_seconds: int
    completed_in_time: bool
    passed: bool
    pass_score_percent: int
    remaining_attempts: int
    explanations: List[Dict[str, str]]


class WalletTransaction(BaseModel):
    id: int
    reference_type: str
    credits_delta: float
    description: str
    created_at: datetime


class WalletInfo(BaseModel):
    balance_credits: float
    transactions: List[WalletTransaction]


class BadgeInfo(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    awarded_on: datetime


class ContentTrackingRequest(BaseModel):
    content_item_id: int
    progress_percent: float  # 0-100


class ChatbotQuery(BaseModel):
    course_id: int
    query: str


class ChatbotResponse(BaseModel):
    answer: str
    snippets: List[str]


# Teacher Schemas
class TeacherDashboardSummary(BaseModel):
    total_courses: int
    average_class_completion: float
    average_quiz_score: float
    wallet_balance: float
    total_badges: int


class StudentProgressItem(BaseModel):
    student_id: int
    student_name: str
    completion_percent: float
    quiz_average: float
    status: str


class AtRiskStudent(BaseModel):
    student_id: int
    student_name: str
    course_title: str
    completion_percent: float
    quiz_attempts: int
    last_activity: Optional[datetime]


class EvidenceSubmission(BaseModel):
    course_id: int
    module_id: Optional[int]
    file_type: str
    description: Optional[str]
    file_url: str


# Principal Schemas
class PrincipalDashboardSummary(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    average_completion: float


class CompletionByGrade(BaseModel):
    grade: str
    completion_percent: float


class WeeklyActiveData(BaseModel):
    week: str
    active_students: int


class TopPerformer(BaseModel):
    user_id: int
    name: str
    performance_index: float


# Admin Schemas
class CourseCreate(BaseModel):
    school_id: int
    title: str
    description: Optional[str]
    subject: str
    level: Optional[str]


class CourseUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    subject: Optional[str]
    level: Optional[str]
    status: Optional[str]


class ModuleCreate(BaseModel):
    course_id: int
    module_order: int
    title: str
    description: Optional[str]
    estimated_duration_minutes: Optional[int]


class ContentCreate(BaseModel):
    module_id: int
    type: str
    title: str
    description: Optional[str]
    url_or_path: str
    duration_seconds: Optional[int]


class UserCreate(BaseModel):
    email: str
    name: str
    role: str
    school_id: Optional[int]
    class_section_id: Optional[int]  # For students
    department: Optional[str]  # For teachers
    designation: Optional[str]  # For teachers


class QuestionCreate(BaseModel):
    module_id: int
    question_text: str
    explanation_text: Optional[str]
    options: List[Dict[str, Any]]  # [{"text": "...", "is_correct": bool}]


class ConfigUpdate(BaseModel):
    credit_fast_and_full: Optional[int]
    credit_normal_and_full: Optional[int]
    credit_other: Optional[int]
    fast_threshold_seconds: Optional[int]
    normal_threshold_seconds: Optional[int]
