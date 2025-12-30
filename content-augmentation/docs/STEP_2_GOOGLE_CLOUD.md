# Step 2: Google Cloud Setup - Interactive Guide

## 🎯 What We'll Do

1. Create Google Cloud Project
2. Enable Required APIs
3. Create Service Account
4. Download Credentials
5. Get Gemini API Key

**Estimated time:** 15 minutes

---

## 📋 Step 2.1: Create Google Cloud Project

### Action 1: Open Google Cloud Console
1. Open your browser
2. Go to: https://console.cloud.google.com/
3. Sign in with your Google account

### Action 2: Create New Project
1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"NEW PROJECT"** button (top right of dialog)
3. Fill in:
   - **Project name:** `Achariya Content Augmentation`
   - **Organization:** (leave as-is or select your org)
   - **Location:** (leave as-is)
4. Click **"CREATE"**
5. Wait ~30 seconds for project creation

### Action 3: Note Your Project ID
- After creation, you'll see a **Project ID** (e.g., `achariya-content-augmentation-12345`)
- **IMPORTANT:** Copy this Project ID - you'll need it later
- Write it here: `_______________________________`

---

## 🔌 Step 2.2: Enable Required APIs

### Action 4: Navigate to APIs & Services
1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Or go directly to: https://console.cloud.google.com/apis/library

### Action 5: Enable Google Drive API
1. In the search box, type: `Google Drive API`
2. Click on **"Google Drive API"**
3. Click **"ENABLE"** button
4. Wait for it to enable (~10 seconds)

### Action 6: Enable Cloud Functions API
1. Click **"← APIs & Services"** (back arrow) to return to library
2. Search: `Cloud Functions API`
3. Click on it
4. Click **"ENABLE"**

### Action 7: Enable Cloud Storage API
1. Return to library
2. Search: `Cloud Storage API`
3. Click on it
4. Click **"ENABLE"**

### Action 8: Enable Vertex AI API (for Gemini)
1. Return to library
2. Search: `Vertex AI API`
3. Click on it
4. Click **"ENABLE"**

**✅ Checkpoint:** You should now have 4 APIs enabled

---

## 👤 Step 2.3: Create Service Account

### Action 9: Navigate to Service Accounts
1. In left sidebar: **"IAM & Admin"** → **"Service Accounts"**
2. Or go to: https://console.cloud.google.com/iam-admin/serviceaccounts

### Action 10: Create Service Account
1. Click **"+ CREATE SERVICE ACCOUNT"** (top of page)
2. Fill in:
   - **Service account name:** `content-augmentation-service`
   - **Service account ID:** (auto-filled, leave as-is)
   - **Description:** `Service account for automated content generation`
3. Click **"CREATE AND CONTINUE"**

### Action 11: Grant Roles
In the "Grant this service account access to project" section:

1. Click **"Select a role"** dropdown
2. Search and select: `Storage Admin`
3. Click **"+ ADD ANOTHER ROLE"**
4. Search and select: `Cloud Functions Developer`
5. Click **"+ ADD ANOTHER ROLE"**
6. Search and select: `Vertex AI User`
7. Click **"CONTINUE"**

### Action 12: Skip Optional Step
- Click **"DONE"** (skip the "Grant users access" step)

---

## 🔑 Step 2.4: Download Service Account Key

### Action 13: Create JSON Key
1. You should now see your service account in the list
2. Click on the **email address** of the service account you just created
3. Go to the **"KEYS"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"CREATE"**

### Action 14: Save the Key File
- A JSON file will download automatically
- **IMPORTANT:** Move this file to:
  ```
  E:\AntiGravity-Assets\content-augmentation\service-account-key.json
  ```
- **Security Note:** Never commit this file to Git (it's already in .gitignore)

### Action 15: Copy Service Account Email
- On the service account details page, copy the **email address**
- It looks like: `content-augmentation-service@project-id.iam.gserviceaccount.com`
- Write it here: `_______________________________`
- **You'll need this for Google Drive sharing in Step 3**

---

## 🤖 Step 2.5: Get Gemini API Key

### Action 16: Open Google AI Studio
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with the same Google account

### Action 17: Create API Key
1. Click **"Create API Key"**
2. Select your project: **"Achariya Content Augmentation"**
3. Click **"Create API key in existing project"**
4. Your API key will be displayed

### Action 18: Copy API Key
- Click the **copy icon** to copy the key
- **IMPORTANT:** Save this somewhere safe (you'll add it to .env file)
- Write it here: `_______________________________`

---

## ✅ Step 2 Complete! What You Should Have:

- [ ] Google Cloud Project created
- [ ] Project ID noted
- [ ] 4 APIs enabled (Drive, Functions, Storage, Vertex AI)
- [ ] Service account created
- [ ] Service account JSON key saved to: `E:\AntiGravity-Assets\content-augmentation\service-account-key.json`
- [ ] Service account email copied
- [ ] Gemini API key copied

---

## 🎯 Next: Step 3 - Google Drive Setup

Once you've completed all checkboxes above, let me know and we'll move to Step 3 (Google Drive folder setup).

**Reply with:** "Step 2 done" or "Ready for Step 3"

---

## 🆘 Troubleshooting

**Can't find APIs & Services?**
- Make sure you've selected the correct project (check dropdown at top)
- Try refreshing the page

**Service account creation fails?**
- Ensure you have Owner/Editor permissions on the project
- Try using a different browser

**Gemini API key not showing?**
- Make sure you selected the correct project
- Wait a few minutes and try again
- Check if Vertex AI API is enabled

**Need help?** Just ask and I'll guide you through any issues!
