# Content Augmentation Service - Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- Python 3.10 or higher
- PostgreSQL 14 or higher
- Redis (for task queue)
- Google Cloud account
- HeyGen Pro account

---

## 🚀 Step 1: Initial Setup

### 1.1 Clone and Navigate
```bash
cd E:/AntiGravity-Assets/content-augmentation
```

### 1.2 Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🔑 Step 2: Google Cloud Setup

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project"
3. Name it: `achariya-content-augmentation`
4. Note the Project ID

### 2.2 Enable Required APIs
Enable these APIs in your project:
- Google Drive API
- Cloud Functions API
- Cloud Storage API
- Vertex AI API (for Gemini)

```bash
gcloud services enable drive.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

### 2.3 Create Service Account
1. Go to IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Name: `content-augmentation-service`
4. Grant roles:
   - Storage Admin
   - Cloud Functions Developer
   - Vertex AI User
5. Create and download JSON key
6. Save as: `E:/AntiGravity-Assets/content-augmentation/service-account-key.json`

### 2.4 Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key

---

## 📁 Step 3: Google Drive Setup

### 3.1 Create Folder Structure
Create this structure in your Google Drive:
```
/Achariya-Content/
  /Course-001/
    /Module-001/
      /source/
      /generated/
    /Module-002/
      /source/
      /generated/
```

### 3.2 Share with Service Account
1. Right-click on `/Achariya-Content/` folder
2. Click "Share"
3. Add the service account email (from step 2.3)
4. Give "Editor" permission

### 3.3 Get Folder ID
1. Open `/Achariya-Content/` folder
2. Copy the ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

---

## 🗄️ Step 4: Database Setup

### 4.1 Create PostgreSQL Database
```sql
CREATE DATABASE content_augmentation;
CREATE USER content_aug_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE content_augmentation TO content_aug_user;
```

### 4.2 Initialize Database
```bash
python -c "from database.connection import init_db; init_db()"
```

---

## ⚙️ Step 5: Configuration

### 5.1 Create .env File
```bash
cp .env.example .env
```

### 5.2 Fill in Environment Variables
Edit `.env` and add your values:

```env
# Database
DATABASE_URL=postgresql://content_aug_user:your_secure_password@localhost:5432/content_augmentation

# Google Cloud
GOOGLE_CLOUD_PROJECT=achariya-content-augmentation
GOOGLE_APPLICATION_CREDENTIALS=E:/AntiGravity-Assets/content-augmentation/service-account-key.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_3.3

# Gemini
GEMINI_API_KEY=your_gemini_api_key_from_step_2.4

# HeyGen
HEYGEN_API_KEY=your_heygen_api_key
HEYGEN_DEFAULT_AVATAR_ID=your_avatar_id
HEYGEN_DEFAULT_VOICE_ID=your_voice_id

# LMS (will set up later)
LMS_API_URL=http://localhost:8000/api
LMS_SERVICE_API_KEY=generate_random_key_here

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFICATION_FROM_EMAIL=noreply@achariya.com
```

---

## ✅ Step 6: Verify Setup

### 6.1 Test Database Connection
```bash
python -c "from database.connection import get_db_context; from database.models import ContentGeneration; print('Database OK!')"
```

### 6.2 Test Google Drive
```bash
python -c "from core.drive_client import drive_client; print(drive_client.get_file_metadata('your_test_file_id'))"
```

### 6.3 Test Gemini
```bash
python -c "from core.gemini_client import gemini_client; print(gemini_client.analyze_content('Test content'))"
```

### 6.4 Test HeyGen
```bash
python -c "from core.heygen_client import heygen_client; print('HeyGen client initialized')"
```

---

## 🎯 Next Steps

Once setup is complete:
1. Deploy Cloud Functions (webhook listeners)
2. Set up Celery workers
3. Test with sample content
4. Integrate with LMS

See `docs/DEPLOYMENT.md` for deployment instructions.

---

## 🆘 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure user has correct permissions

### Google Drive Permission Error
- Verify service account has access to folder
- Check GOOGLE_APPLICATION_CREDENTIALS path
- Ensure APIs are enabled

### Gemini API Error
- Verify API key is correct
- Check quota limits
- Ensure Vertex AI API is enabled

---

## 📞 Support

For issues, contact: support@achariya.com
