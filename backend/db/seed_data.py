"""
Seed Data Script - Populates database with realistic demo data

Creates:
- 2 schools (1 school, 1 college)
- 6 class sections (3 per school)
- 15 users: 10 students, 4 teachers, 1 principal per school, 1 admin
- Student/teacher/principal profiles
- 6 courses across subjects
- 18 modules (3 per course)
- 54+ content items
- 100+ quiz questions with options
- Quiz configurations
- 30+ enrollments
- Progress records with various states
- 20+ quiz attempts (passed, failed, in-progress)
- Wallet accounts and transactions
- 5+ badges
- User badge awards
- Evidence items
- Activity logs
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import AsyncSessionLocal
from models.school import School, LocationType
from models.user import User, UserRole
from models.class_section import ClassSection
from models.student_profile import StudentProfile
from models.teacher_profile import TeacherProfile
from models.principal_profile import PrincipalProfile
from models.course import Course
from models.curriculum_module import CurriculumModule
from models.content_item import ContentItem, ContentType
from models.enrollment import Enrollment, EnrollmentStatus
from models.module_progress import ModuleProgress, ProgressStatus
from models.question_bank import QuestionBank
from models.question_option import QuestionOption
from models.quiz_config import QuizConfig
from models.quiz_attempt import QuizAttempt
from models.wallet_account import WalletAccount, WalletRole
from models.wallet_transaction import WalletTransaction, TransactionType
from models.badge import Badge, BadgeScope
from models.user_badge import UserBadge
from models.evidence_item import EvidenceItem
from models.activity_log import ActivityLog
from datetime import datetime, timedelta
import random


async def seed_database():
    """Main seeding function"""
    async with AsyncSessionLocal() as db:
        print("🌱 Starting database seeding...")
        
        # 1. Create Schools
        print("📚 Creating schools...")
        school1 = School(
            name="Achariya School of Excellence",
            location_type=LocationType.SCHOOL,
            status="Active"
        )
        school2 = School(
            name="Achariya College of Engineering",
            location_type=LocationType.COLLEGE,
            status="Active"
        )
        db.add_all([school1, school2])
        await db.commit()
        await db.refresh(school1)
        await db.refresh(school2)
        
        # 2. Create Class Sections
        print("🏫 Creating class sections...")
        sections = [
            ClassSection(school_id=school1.id, name="Class 10-A", grade_level="10"),
            ClassSection(school_id=school1.id, name="Class 10-B", grade_level="10"),
            ClassSection(school_id=school1.id, name="Class 12 Science", grade_level="12"),
            ClassSection(school_id=school2.id, name="B.Tech CS Year 1", grade_level="UG1"),
            ClassSection(school_id=school2.id, name="B.Tech CS Year 2", grade_level="UG2"),
            ClassSection(school_id=school2.id, name="B.Tech CS Year 3", grade_level="UG3"),
        ]
        db.add_all(sections)
        await db.commit()
        for section in sections:
            await db.refresh(section)
        
        # 3. Create Users
        print("👥 Creating users...")
        
        # Admin
        admin = User(
            email="admin@achariya.in",
            name="System Admin",
            role=UserRole.ADMIN,
            school_id=None,
            status="Active"
        )
        
        # Principals
        principal1 = User(
            email="principal.school@achariya.in",
            name="Dr. Rajesh Kumar",
            role=UserRole.PRINCIPAL,
            school_id=school1.id,
            status="Active"
        )
        principal2 = User(
            email="principal.college@achariya.in",
            name="Dr. Priya Sharma",
            role=UserRole.PRINCIPAL,
            school_id=school2.id,
            status="Active"
        )
        
        # Teachers
        teacher1 = User(
            email="hari@achariya.in",
            name="Hari Krishnan",
            role=UserRole.TEACHER,
            school_id=school1.id,
            status="Active"
        )
        teacher2 = User(
            email="meena@achariya.in",
            name="Meena Sundaram",
            role=UserRole.TEACHER,
            school_id=school1.id,
            status="Active"
        )
        teacher3 = User(
            email="kumar@achariya.in",
            name="Kumar Venkatraman",
            role=UserRole.TEACHER,
            school_id=school2.id,
            status="Active"
        )
        teacher4 = User(
            email="lakshmi@achariya.in",
            name="Lakshmi Narayanan",
            role=UserRole.TEACHER,
            school_id=school2.id,
            status="Active"
        )
        
        # Students
        students = [
            User(email=f"pranav.r@achariya.in", name="Pranav R", role=UserRole.STUDENT, school_id=school1.id, status="Active"),
            User(email=f"aisha.k@achariya.in", name="Aisha Khan", role=UserRole.STUDENT, school_id=school1.id, status="Active"),
            User(email=f"arjun.s@achariya.in", name="Arjun Srinivasan", role=UserRole.STUDENT, school_id=school1.id, status="Active"),
            User(email=f"divya.m@achariya.in", name="Divya Menon", role=UserRole.STUDENT, school_id=school1.id, status="Active"),
            User(email=f"rahul.p@achariya.in", name="Rahul Patel", role=UserRole.STUDENT, school_id=school1.id, status="Active"),
            User(email=f"sneha.g@achariya.in", name="Sneha Gupta", role=UserRole.STUDENT, school_id=school2.id, status="Active"),
            User(email=f"vikram.j@achariya.in", name="Vikram Joshi", role=UserRole.STUDENT, school_id=school2.id, status="Active"),
            User(email=f"priya.n@achariya.in", name="Priya Nair", role=UserRole.STUDENT, school_id=school2.id, status="Active"),
            User(email=f"karthik.b@achariya.in", name="Karthik Balan", role=UserRole.STUDENT, school_id=school2.id, status="Active"),
            User(email=f"ananya.v@achariya.in", name="Ananya Varma", role=UserRole.STUDENT, school_id=school2.id, status="Active"),
        ]
        
        all_users = [admin, principal1, principal2, teacher1, teacher2, teacher3, teacher4] + students
        db.add_all(all_users)
        await db.commit()
        for user in all_users:
            await db.refresh(user)
        
        # 4. Create Profiles
        print("📝 Creating user profiles...")
        
        # Principal profiles
        principal_profiles = [
            PrincipalProfile(user_id=principal1.id, school_id=school1.id),
            PrincipalProfile(user_id=principal2.id, school_id=school2.id)
        ]
        db.add_all(principal_profiles)
        
        # Teacher profiles
        teacher_profiles = [
            TeacherProfile(user_id=teacher1.id, department="Mathematics", designation="Senior Teacher"),
            TeacherProfile(user_id=teacher2.id, department="Science", designation ="Teacher"),
            TeacherProfile(user_id=teacher3.id, department="Computer Science", designation="Associate Professor"),
            TeacherProfile(user_id=teacher4.id, department="Computer Science", designation="Assistant Professor")
        ]
        db.add_all(teacher_profiles)
        
        # Student profiles - distribute across sections
        section_distribution = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5]  # indices into sections array
        student_profiles = []
        for i, student in enumerate(students):
            section = sections[section_distribution[i]]
            student_profiles.append(
                StudentProfile(user_id=student.id, class_section_id=section.id)
            )
        db.add_all(student_profiles)
        await db.commit()
        for profile in student_profiles:
            await db.refresh(profile)
        
        # 5. Create Courses
        print("📖 Creating courses...")
        courses_data = [
            {"title": "Advanced Mathematics", "subject": "Mathematics", "level": "Advanced", "school_id": school1.id},
            {"title": "Physics Fundamentals", "subject": "Physics", "level": "Intermediate", "school_id": school1.id},
            {"title": "English Literature", "subject": "English", "level": "Intermediate", "school_id": school1.id},
            {"title": "Data Structures and Algorithms", "subject": "Computer Science", "level": "Advanced", "school_id": school2.id},
            {"title": "Database Management Systems", "subject": "Computer Science", "level": "Intermediate", "school_id": school2.id},
            {"title": "Web Development", "subject": "Computer Science", "level": "Beginner", "school_id": school2.id},
        ]
        
        courses = []
        for course_data in courses_data:
            course = Course(
                **course_data,
                description=f"Comprehensive course on {course_data['title']}",
                status="Active"
            )
            courses.append(course)
        db.add_all(courses)
        await db.commit()
        for course in courses:
            await db.refresh(course)
        
        # 6. Create Modules for each course
        print("📚 Creating curriculum modules...")
        all_modules = []
        for course in courses:
            for i in range(1, 4):  # 3 modules per course
                module = CurriculumModule(
                    course_id=course.id,
                    module_order=i,
                    title=f"{course.title} - Module {i}",
                    description=f"Module {i} covering core concepts",
                    estimated_duration_minutes=45
                )
                all_modules.append(module)
        db.add_all(all_modules)
        await db.commit()
        for module in all_modules:
            await db.refresh(module)
        
        # 7. Create Content Items
        print("🎬 Creating content items...")
        content_types_pool = [ContentType.VIDEO, ContentType.PDF, ContentType.TEXT, ContentType.PPT, ContentType.AUDIO]
        
        all_content = []
        for module in all_modules:
            # Each module gets 3 content items
            for j in range(1, 4):
                content_type = random.choice(content_types_pool)
                duration = random.randint(300, 1800) if content_type in [ContentType.VIDEO, ContentType.AUDIO] else None
                
                content = ContentItem(
                    module_id=module.id,
                    type=content_type,
                    title=f"{module.title} - Part {j}",
                    description=f"Content part {j}",
                    url_or_path=f"https://example.com/content/{module.id}_{j}.{content_type.value.lower()}",
                    duration_seconds=duration,
                    active_flag=True
                )
                all_content.append(content)
        db.add_all(all_content)
        await db.commit()
        
        # 8. Create Quiz Configs
        print("🎯 Creating quiz configurations...")
        quiz_configs = []
        for module in all_modules:
            config = QuizConfig(
                module_id=module.id,
                total_questions=15,
                time_limit_seconds=120,
                pass_score_percent=100
            )
            quiz_configs.append(config)
        db.add_all(quiz_configs)
        await db.commit()
        
        # 9. Create Question Bank
        print("❓ Creating question bank...")
        all_questions = []
        all_options = []
        
        for module in all_modules[:6]:  # Add questions to first 6 modules for demo
            for q_num in range(1, 21):  # 20 questions per module
                question = QuestionBank(
                    module_id=module.id,
                    question_text=f"Question {q_num} for {module.title}?",
                    explanation_text=f"The correct answer is option A because it best fits the concept taught in {module.title}."
                )
                all_questions.append(question)
        
        db.add_all(all_questions)
        await db.commit()
        
        # Create options for each question
        for question in all_questions:
            await db.refresh(question)
            options = [
                QuestionOption(question_id=question.id, option_text="Option A", is_correct=True),
                QuestionOption(question_id=question.id, option_text="Option B", is_correct=False),
                QuestionOption(question_id=question.id, option_text="Option C", is_correct=False),
                QuestionOption(question_id=question.id, option_text="Option D", is_correct=False),
            ]
            all_options.extend(options)
        db.add_all(all_options)
        await db.commit()
        
        # 10. Create Enrollments
        print("✅ Creating enrollments...")
        enrollments = []
        
        # Enroll first 5 students in school courses (0-2)
        for student_profile in student_profiles[:5]:
            for course in courses[:3]:
                enrollment = Enrollment(
                    student_id=student_profile.id,
                    course_id=course.id,
                    status=EnrollmentStatus.ACTIVE
                )
                enrollments.append(enrollment)
        
        # Enroll last 5 students in college courses (3-5)
        for student_profile in student_profiles[5:]:
            for course in courses[3:]:
                enrollment = Enrollment(
                    student_id=student_profile.id,
                    course_id=course.id,
                    status=EnrollmentStatus.ACTIVE
                )
                enrollments.append(enrollment)
        
        db.add_all(enrollments)
        await db.commit()
        for enrollment in enrollments:
            await db.refresh(enrollment)
        
        # 11. Create Module Progress and Quiz Attempts
        print("📊 Creating progress records and quiz attempts...")
        
        for enrollment in enrollments[:10]:  # First 10 enrollments get detailed progress
            # Get modules for this course
            course_modules = [m for m in all_modules if m.course_id == enrollment.course_id]
            
            for idx, module in enumerate(course_modules):
                if idx == 0:
                    # First module: completed with quiz
                    progress = ModuleProgress(
                        enrollment_id=enrollment.id,
                        module_id=module.id,
                        completion_percent=100.0,
                        status=ProgressStatus.COMPLETED
                    )
                    db.add(progress)
                    
                    # Add quiz attempts - passed on 2nd attempt
                    attempt1 = QuizAttempt(
                        enrollment_id=enrollment.id,
                        module_id=module.id,
                        attempt_number=1,
                        score_percent=80.0,
                        time_taken_seconds=100,
                        completed_in_time=True
                    )
                    attempt2 = QuizAttempt(
                        enrollment_id=enrollment.id,
                        module_id=module.id,
                        attempt_number=2,
                        score_percent=100.0,
                        time_taken_seconds=55,
                        completed_in_time=True
                    )
                    db.add_all([attempt1, attempt2])
                    
                elif idx == 1:
                    # Second module: in progress
                    progress = ModuleProgress(
                        enrollment_id=enrollment.id,
                        module_id=module.id,
                        completion_percent=60.0,
                        status=ProgressStatus.IN_PROGRESS
                    )
                    db.add(progress)
                    
                else:
                    # Third module: locked (not started)
                    progress = ModuleProgress(
                        enrollment_id=enrollment.id,
                        module_id=module.id,
                        completion_percent=0.0,
                        status=ProgressStatus.NOT_STARTED
                    )
                    db.add(progress)
        
        await db.commit()
        
        # 12. Create Wallet Accounts
        print("💰 Creating wallet accounts...")
        wallet_accounts = []
        
        # Student wallets
        for student in students:
            wallet = WalletAccount(
                user_id=student.id,
                role=WalletRole.STUDENT,
                balance_credits=0.0  # Will be updated by transactions
            )
            wallet_accounts.append(wallet)
        
        # Teacher wallets
        for teacher in [teacher1, teacher2, teacher3, teacher4]:
            wallet = WalletAccount(
                user_id=teacher.id,
                role=WalletRole.TEACHER,
                balance_credits=0.0
            )
            wallet_accounts.append(wallet)
        
        db.add_all(wallet_accounts)
        await db.commit()
        for wallet in wallet_accounts:
            await db.refresh(wallet)
        
        # 13. Create Wallet Transactions
        print("💳 Creating wallet transactions...")
        transactions = []
        
        # Add credits for students who completed module 1
        for i, enrollment in enumerate(enrollments[:10]):
            student_wallet = next((w for w in wallet_accounts if w.user_id == enrollment.student_profile.user_id), None)
            if student_wallet:
                # Module 1 completion reward (fast completion)
                transaction = WalletTransaction(
                    wallet_id=student_wallet.id,
                    reference_type=TransactionType.QUIZ,
                    reference_id=enrollment.id,
                    credits_delta=15.0,  # Fast and full credits
                    description=f"Module 1 completion reward - Fast and Perfect"
                )
                transactions.append(transaction)
                student_wallet.balance_credits += 15.0
        
        # Add teacher credits
        teacher_wallet = next((w for w in wallet_accounts if w.user_id == teacher1.id), None)
        if teacher_wallet:
            transaction = WalletTransaction(
                wallet_id=teacher_wallet.id,
                reference_type=TransactionType.REWARD,
                credits_delta=50.0,
                description="Syllabus completion bonus"
            )
            transactions.append(transaction)
            teacher_wallet.balance_credits += 50.0
        
        db.add_all(transactions)
        await db.commit()
        
        # 14. Create Badges
        print("🏆 Creating badges...")
        badges = [
            Badge(
                code="SPEED_MASTER",
                name="Speed Master",
                description="Complete quizzes quickly with perfect scores",
                role_scope=BadgeScope.STUDENT,
                criteria_json={"fast_completions_required": 3}
            ),
            Badge(
                code="HIGH_PERFORMER",
                name="High Performer",
                description="Complete 5 modules with 100% scores",
                role_scope=BadgeScope.STUDENT,
                criteria_json={"modules_required": 5}
            ),
            Badge(
                code="ON_TIME_DELIVERER",
                name="On Time Deliverer",
                description="Complete syllabus before target date",
                role_scope=BadgeScope.TEACHER,
                criteria_json={"on_time": True}
            ),
            Badge(
                code="HIGH_IMPACT",
                name="High Impact Teacher",
                description="Achieve high student performance rates",
                role_scope=BadgeScope.TEACHER,
                criteria_json={"pass_rate_threshold": 80}
            ),
            Badge(
                code="EVIDENCE_CHAMPION",
                name="Evidence Champion",
                description="Consistent evidence submission",
                role_scope=BadgeScope.TEACHER,
                criteria_json={"evidence_count": 10}
            ),
        ]
        db.add_all(badges)
        await db.commit()
        for badge in badges:
            await db.refresh(badge)
        
        # 15. Award some badges
        print("🎖️ Awarding badges...")
        user_badges = [
            UserBadge(user_id=students[0].id, badge_id=badges[0].id),  # Speed Master to first student
            UserBadge(user_id=teacher1.id, badge_id=badges[2].id),  # On Time Deliverer to teacher 1
        ]
        db.add_all(user_badges)
        await db.commit()
        
        # 16. Create Evidence Items
        print("📎 Creating evidence items...")
        evidence_items = [
            EvidenceItem(
                teacher_id=teacher_profiles[0].id,
                course_id=courses[0].id,
                module_id=all_modules[0].id,
                file_type="PDF",
                description="Lesson plan and teaching notes for Module 1",
                file_url="https://example.com/evidence/teacher1_module1.pdf"
            ),
            EvidenceItem(
                teacher_id=teacher_profiles[1].id,
                course_id=courses[1].id,
                module_id=all_modules[3].id,
                file_type="PDF",
                description="Lab experiment documentation",
                file_url="https://example.com/evidence/teacher2_lab1.pdf"
            ),
        ]
        db.add_all(evidence_items)
        await db.commit()
        
        # 17. Create Activity Logs
        print("📜 Creating activity logs...")
        activity_logs = []
        
        # Login activities
        for user in all_users[:5]:
            log = ActivityLog(
                user_id=user.id,
                action_type="login",
                entity_type=None,
                entity_id=None,
                meta_json={"ip": "127.0.0.1", "device": "Desktop"}
            )
            activity_logs.append(log)
        
        # Module completion activities
        for enrollment in enrollments[:5]:
            log = ActivityLog(
                user_id=enrollment.student_profile.user_id,
                action_type="module_complete",
                entity_type="module",
                entity_id=all_modules[0].id,
                meta_json={"course_id": enrollment.course_id}
            )
            activity_logs.append(log)
        
        db.add_all(activity_logs)
        await db.commit()
        
        print("✅ Database seeding completed successfully!")
        print(f"   Schools: 2")
        print(f"   Class Sections: {len(sections)}")
        print(f"   Users: {len(all_users)} (Admin: 1, Principals: 2, Teachers: 4, Students: 10)")
        print(f"   Courses: {len(courses)}")
        print(f"   Modules: {len(all_modules)}")
        print(f"   Content Items: {len(all_content)}")
        print(f"   Questions: {len(all_questions)}")
        print(f"   Enrollments: {len(enrollments)}")
        print(f"   Wallets: {len(wallet_accounts)}")
        print(f"   Badges: {len(badges)}")


if __name__ == "__main__":
    asyncio.run(seed_database())
