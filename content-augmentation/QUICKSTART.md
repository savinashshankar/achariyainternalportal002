# Quick Start Guide - Content Augmentation Service

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies
```powershell
cd E:\AntiGravity-Assets\content-augmentation
pip install -r requirements.txt
```

### Step 2: Verify Configuration
Check that `.env` file exists with all credentials.

### Step 3: Upload Test File
1. Go to Google Drive
2. Navigate to: `Achariya-Content/Course-001/Module-001/source/`
3. Upload a PDF file (e.g., a lecture PDF, study guide, etc.)
4. **Right-click the file** → **Get link** → Copy the **file ID** from URL

Example URL: `https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view`
File ID: `1a2B3c4D5e6F7g8H9i0J`

### Step 4: Run Content Generation
```powershell
python main.py 1a2B3c4D5e6F7g8H9i0J
```
*(Replace with your actual file ID)*

### Step 5: Wait for Completion
- Processing takes 15-30 minutes
- You'll see progress in the terminal
- Email sent to technicalhead@achariya.org when done

### Step 6: Check Results
Go to: `Achariya-Content/Course-001/Module-001/generated/`

You should see:
- ✅ `Module-001_avatar_video.mp4`
- ✅ `Module-001_audio.mp3`
- ✅ `Module-001_slides` (Google Slides)
- ✅ `Module-001_infographic.txt`
- ✅ `Module-001_explainer.mp4`
- ✅ `Module-001_whiteboard.mp4`
- ✅ `Module-001_simulator.html`

---

## 🎯 Complete Workflow

```
1. Upload PDF to /source/
2. Get file ID from Google Drive
3. Run: python main.py <FILE_ID>
4. Wait 15-30 minutes
5. Check /generated/ folder
6. Review content quality
```

---

## 📧 Email Notification

When processing completes, you'll receive email at:
**technicalhead@achariya.org**

Subject: "LMS POC Content - AutoPilot - Processed"

---

## ⚠️ Troubleshooting

**"Module not found" error:**
```powershell
pip install -r requirements.txt
```

**"Credentials error":**
- Check `service-account-key.json` exists
- Verify `.env` has correct path

**"No generated files":**
- Check terminal for errors
- Verify file ID is correct
- Check service account has access to Drive folder

---

## 🔄 Next Steps (Future)

- Add automatic webhook (no file ID needed)
- Enhance infographic generation
- Add more simulator templates
- Enable LMS auto-publishing

---

**Ready? Upload your first file and run the command!** 🚀
