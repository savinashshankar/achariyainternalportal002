# Personal OAuth Setup - One-Time Configuration

## 🎯 What This Does
Allows the system to upload files using YOUR Google Drive account (with your permissions).

**One-time setup:** ~10 minutes  
**Future use:** Automatic (no re-auth needed)

---

## 📝 Step 1: Create OAuth Credentials (5 min)

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials?project=achariya-content-augmentation

2. **Click "+ CREATE CREDENTIALS"** → Select **"OAuth client ID"**

3. **Configure consent screen** (if prompted):
   - User Type: **External**
   - App name: **Achariya Content Tool**
   - User support email: **your email**
   - Developer email: **your email**
   - Click **Save and Continue** (skip optional fields)
   - Add your email as test user
   - Click **Save and Continue**

4. **Create OAuth Client:**
   - Application type: **Desktop app**
   - Name: **Content Augmentation Desktop**
   - Click **CREATE**

5. **Download credentials:**
   - Click **DOWNLOAD JSON** on the created credential
   - Save as: `E:\AntiGravity-Assets\content-augmentation\oauth_credentials.json`

---

## 📝 Step 2: Run Authorization (2 min)

I'll create a simple script. You'll:
1. Run it once
2. Browser opens → Login with your Google account
3. Grant permissions
4. **Done!** Token saved for future use

---

## ✅ After Setup

The system will:
- Use your Drive storage (not service account)
- Upload files automatically
- Never ask for login again (token auto-refreshes)

---

**Ready to proceed?** Reply "Yes" and I'll create the auth script!
