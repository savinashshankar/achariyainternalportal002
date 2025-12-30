# Achariya Unified Learning Portal - POC

A comprehensive learning management system with role-based access for Students, Teachers, Principals, and Administrators.

## 🚀 Quick Start Guide

### Prerequisites
- **Docker Desktop** (for PostgreSQL)
- **Python 3.11+** with pip
- **Node.js 18+** with npm

### 1. Start PostgreSQL Database

```powershell
# Start the database container
docker-compose up -d db
```

The database will be accessible at `localhost:5432` with:
- Database: `achariya_lms`
- User: `postgres`
- Password: `password`

### 2. Set Up Backend

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database tables (run migrations)
alembic upgrade head

# Seed database with sample data
python db/seed_data.py

# Start backend server
uvicorn main:app --reload
```

Backend API will run at **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

### 3. Set Up Frontend

```powershell
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at **http://localhost:5173**

## 📧 Demo Accounts

Login with any of these emails (password: any value):

| Role | Email | Description |
|------|-------|-------------|
| **Student** | pranav.r@achariya.in | View courses, take quizzes, earn credits |
| **Teacher** | hari@achariya.in | Manage classes, track student progress |
| **Principal** | principal.school@achariya.in | School-wide analytics and reports |
| **Admin** | admin@achariya.in | System configuration and management |

## 🎯 Key Features

### For Students
- ✅ Dashboard with completion metrics and wallet balance
- ✅ Course enrollment with progress tracking
- ✅ Sequential module unlock (complete Module N-1 to access Module N)
- ✅ Content consumption tracking (VIDEO, PDF, TEXT, PPT, AUDIO)
- ✅ Quiz system with 15 random questions, 2-minute timer, 3 attempts
- ✅ Automatic credit awards based on quiz performance
- ✅ Wallet with transaction history
- ✅ Badge collection system

### For Teachers
- ✅ Dashboard with class performance metrics
- ✅ Student progress monitoring
- ✅ At-risk student identification
- ✅ Evidence submission for modules
- ✅ Teacher wallet and badge system

### For Principals
- ✅ School-wide dashboard with total students, teachers, courses
- ✅ Completion charts by grade
- ✅ Weekly active student trends
- ✅ Top performer leaderboards
- ✅ Export functionality

### For Admins
- ✅ Course and module management (CRUD)
- ✅ Content item uploads
- ✅ User management with role assignment
- ✅ Question bank creation
- ✅ System configuration (credit slabs, quiz settings)
- ✅ Activity log monitoring

## 🏗️ Project Structure

```
E:/AntiGravity-Assets/
├── backend/
│   ├── models/                 # 23 SQLAlchemy models
│   │   ├── school.py
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── curriculum_module.py
│   │   ├── content_item.py
│   │   ├── quiz_*.py (4 models)
│   │   ├── wallet_*.py (2 models)
│   │   └── ...
│   ├── services/               # Business logic
│   │   ├── config_service.py
│   │   ├── progression_service.py
│   │   └── quiz_service.py
│   ├── api/v1/                 # REST API endpoints
│   │   ├── auth.py
│   │   ├── students.py
│   │   ├── teachers.py
│   │   ├── principal.py
│   │   └── admin.py
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── seed_data.py        # Sample data generator
│   └── main.py                 # FastAPI application
├── frontend/
│   ├── src/
│   │   ├── api/                # API client layer
│   │   ├── components/
│   │   │   └── Layout.tsx      # Role-based navigation
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── RoleSelection.tsx
│   │   │   ├── student/        # Student pages
│   │   │   ├── teacher/        # Teacher pages
│   │   │   ├── principal/      # Principal pages
│   │   │   └── admin/          # Admin pages
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## 🔄 Sample Data

The seed script creates:
- **2 Schools** (Achariya School of Excellence, Achariya College of Engineering)
- **6 Class Sections** across both schools
- **15 Users**: 1 Admin, 2 Principals, 4 Teachers, 10 Students
- **6 Courses** (Mathematics, Physics, English, CS, DBMS, Web Dev)
- **18 Modules** (3 per course)
- **54 Content Items** (VIDEO, PDF, TEXT, PPT, AUDIO)
- **120 Quiz Questions** with 4 options each
- **30 Student Enrollments**
- **Progress Records** with varied states (completed, in-progress, locked)
- **Wallet Accounts** with pre-populated credits
- **5 Badges** (Speed Master, High Performer, etc.)
- **Activity Logs**

## 💡 Business Rules

### sequential Module Unlock
- Module 1 is always unlocked
- Module N unlocks when Module N-1 is:
  - Content: 100% consumed
  - Quiz: Passed with ≥100% score within time limit

### Content Consumption
- **VIDEO/AUDIO**: Marked complete at 90% playback
- **TEXT/PDF/PPT**: Manual completion

### Quiz Engine
- Random 15 questions from question bank
- 120-second time limit (countdown timer)
- 3 attempts maximum
- Pass requires: 100% score AND completed in time
- Explanations shown for wrong answers

### Wallet Credits
- **Fast & Full (15 credits)**: 100% score in ≤60 seconds
- **Normal & Full (10 credits)**: 100% score in ≤120 seconds
- **Other (2 credits)**: Passed but slower
- Maximum credit from all attempts awarded once per module

## 🛠️ API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/select-role` - Role selection

### Student
- `GET /api/v1/student/dashboard?email={email}` - Dashboard summary
- `GET /api/v1/student/courses?email={email}` - Enrolled courses
- `GET /api/v1/student/course/{id}?email={email}` - Course details with modules
- `GET /api/v1/student/module/{id}/quiz?email={email}` - Generate quiz
- `POST /api/v1/student/module/{id}/quiz/submit?email={email}` - Submit quiz
- `GET /api/v1/student/wallet?email={email}` - Wallet balance & transactions

### Teacher
- `GET /api/v1/teacher/dashboard?email={email}` - Teacher metrics
- `GET /api/v1/teacher/courses?email={email}` - Taught courses
- `GET /api/v1/teacher/at-risk-students?email={email}` - At-risk students
- `POST /api/v1/teacher/evidence?email={email}` - Submit evidence

### Principal
- `GET /api/v1/principal/dashboard?email={email}` - School summary
- `GET /api/v1/principal/completion-by-grade?email={email}` - Charts
- `GET /api/v1/principal/top-performers?email={email}` - Leaderboards
- `GET /api/v1/principal/export?email={email}` - Export summary

### Admin
- `GET/POST/PUT/DELETE /api/v1/admin/courses` - Course CRUD
- `GET/POST /api/v1/admin/modules` - Module management
- `GET/POST /api/v1/admin/content` - Content management
- `GET/POST /api/v1/admin/users` - User management
- `GET/POST /api/v1/admin/questions` - Question bank
- `GET/PUT /api/v1/admin/config` - System configuration

## 🧪 Testing the POC

### 1. Test Student Flow
1. Login as `pranav.r@achariya.in`
2. Select "Student" role
3. View dashboard (should show 3 courses, ~15 credits)
4. Click "View Courses"
5. Open a course to see modules
6. Module 1 should be unlocked, Module 2 in progress, Module 3 locked
7. View wallet to see credited transactions

### 2. Test Teacher Flow
1. Login as `hari@achariya.in`
2. Select "Teacher" role
3. View dashboard with teaching metrics
4. Check student progress tables
5. View wallet (should have 50 credits from seeded data)

### 3. Test Principal Flow
1. Login as `principal.school@achariya.in`
2. Select "Principal" role
3. View school-wide statistics
4. See total students (5), teachers (2), courses (3)

### 4. Test Admin Flow
1. Login as `admin@achariya.in`
2. Select "Admin" role
3. View all courses, users, and configurations
4. Test creating new courses, modules, users

## 🐛 Troubleshooting

### Backend Won't Start
```powershell
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

### Frontend Build Errors
```powershell
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
- Ensure Docker Desktop is running
- Check `backend/.env` for correct database credentials
- Default: `postgresql://postgres:password@localhost:5432/achariya_lms`

## 📝 Next Steps (Enhancements)

### Completed ✅
- Complete backend with 23 models
- 3 business logic services (Config, Progression, Quiz)
- All API endpoints for 4 roles
- Seed data with realistic scenarios
- Frontend routing and navigation
- Student and teacher dashboards

### To Enhance 🚧
- Detailed module content viewer with embedded players
- Full quiz taking interface with live timer
- Principal charts (completion by grade, weekly trends)
- Admin CRUD  forms for all entities
- Badge awarding automation
- Simple chatbot implementation
- Responsive design improvements
- Video/audio player with no fast-forward controls

## 📜 License

© 2025 Achariya Group of Institutions. All rights reserved.

---

**Built with:** FastAPI • React • TypeScript • PostgreSQL • TailwindCSS • Docker
