import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from models.course import Course
from models.enrolment import Enrolment
from models.assessment import Assessment
from core.security import get_password_hash

async def import_students(file_path: str, db: AsyncSession):
    df = pd.read_csv(file_path)
    # Expected columns: name, email, grade, section
    for _, row in df.iterrows():
        # Check if user exists
        result = await db.execute(select(User).filter(User.email == row['email']))
        user = result.scalars().first()
        if not user:
            user = User(
                name=row['name'],
                email=row['email'],
                role="student",
                grade=row.get('grade'),
                section=row.get('section')
            )
            db.add(user)
    await db.commit()

async def import_courses(file_path: str, db: AsyncSession):
    df = pd.read_csv(file_path)
    # Expected columns: course_name, grade, section, teacher_email
    for _, row in df.iterrows():
        # Find teacher
        result = await db.execute(select(User).filter(User.email == row['teacher_email']))
        teacher = result.scalars().first()
        teacher_id = teacher.id if teacher else None

        course = Course(
            course_name=row['course_name'],
            grade=row['grade'],
            section=row['section'],
            teacher_id=teacher_id,
            term=row.get('term', 'Term 1')
        )
        db.add(course)
    await db.commit()

async def import_enrolments(file_path: str, db: AsyncSession):
    df = pd.read_csv(file_path)
    # Expected columns: student_email, course_name
    for _, row in df.iterrows():
        # Find student
        student_res = await db.execute(select(User).filter(User.email == row['student_email']))
        student = student_res.scalars().first()
        
        # Find course (assuming unique name for simplicity, in real app need more robust matching)
        course_res = await db.execute(select(Course).filter(Course.course_name == row['course_name']))
        course = course_res.scalars().first()

        if student and course:
            enrolment = Enrolment(student_id=student.id, course_id=course.id)
            db.add(enrolment)
    await db.commit()
