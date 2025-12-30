# Step 3: Google Drive Setup - Interactive Guide

## 🎯 What We'll Do

1. Create folder structure in Google Drive
2. Share folder with service account
3. Get folder ID for configuration

**Estimated time:** 5 minutes

---

## 📁 Step 3.1: Create Folder Structure

### Action 1: Open Google Drive
1. Go to: https://drive.google.com/
2. Sign in with your Google account

### Action 2: Create Main Folder
1. Click **"+ New"** button (top left)
2. Select **"New folder"**
3. Name it: `Achariya-Content`
4. Click **"Create"**

### Action 3: Open the Folder
- Double-click on `Achariya-Content` to open it

### Action 4: Create Course Folder
Inside `Achariya-Content`:
1. Click **"+ New"** → **"New folder"**
2. Name it: `Course-001` (or your actual course code)
3. Click **"Create"**

### Action 5: Open Course Folder
- Double-click on `Course-001` to open it

### Action 6: Create Module Folder
Inside `Course-001`:
1. Click **"+ New"** → **"New folder"**
2. Name it: `Module-001` (or your actual module code)
3. Click **"Create"**

### Action 7: Open Module Folder
- Double-click on `Module-001` to open it

### Action 8: Create Source and Generated Folders
Inside `Module-001`:
1. Create folder: `source` (for uploaded files)
2. Create folder: `generated` (for AI-generated content)

**Final structure:**
```
Achariya-Content/
└── Course-001/
    └── Module-001/
        ├── source/
        └── generated/
```

---

## 🔗 Step 3.2: Share Folder with Service Account

### Action 9: Navigate to Main Folder
- Click on **"Achariya-Content"** in the breadcrumb at the top to go back to the main folder

### Action 10: Share the Folder
1. **Right-click** on `Achariya-Content` folder
2. Select **"Share"**

### Action 11: Add Service Account
In the "Share" dialog:

1. In the **"Add people and groups"** field, paste:
   ```
   content-augmentation-service@achariya-content-augmentation.iam.gserviceaccount.com
   ```

2. Press **Enter** or click the email when it appears

3. **Important:** Click the dropdown that says "Viewer" and change it to **"Editor"**

4. **Uncheck** the box that says "Notify people" (the service account doesn't need an email)

5. Click **"Share"** or **"Send"**

**✅ Checkpoint:** You should see the service account listed under "People with access"

---

## 🆔 Step 3.3: Get Folder ID

### Action 12: Open Achariya-Content Folder
- Double-click on `Achariya-Content` to open it

### Action 13: Copy Folder ID from URL
1. Look at the URL in your browser's address bar
2. It will look like:
   ```
   https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8
   ```
3. Copy the long string after `/folders/` - that's your **Folder ID**
4. It looks like: `1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8`

### Action 14: Save the Folder ID
- Write it down or paste it somewhere safe
- You'll need this for the `.env` configuration

**Example Folder ID:** `1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8`

---

## ✅ Step 3 Complete! What You Should Have:

- [ ] Created folder structure in Google Drive
- [ ] Shared `Achariya-Content` with service account
- [ ] Set service account permission to **Editor**
- [ ] Copied the Folder ID

---

## 💬 When Done, Reply With:

```
Step 3 done ✅
Folder ID: [paste your folder ID here]
```

---

## 📝 Optional: Create More Courses/Modules

You can repeat Actions 4-8 to create more courses and modules:

```
Achariya-Content/
├── Course-001/
│   ├── Module-001/
│   │   ├── source/
│   │   └── generated/
│   └── Module-002/
│       ├── source/
│       └── generated/
└── Course-002/
    └── Module-001/
        ├── source/
        └── generated/
```

But for now, one course and one module is enough for testing!

---

## 🆘 Troubleshooting

**Can't share with service account email?**
- Make sure you copied the full email correctly
- Check there are no extra spaces
- The email should end with `.iam.gserviceaccount.com`

**Can't find folder ID in URL?**
- Make sure you've opened the folder (not just selected it)
- The URL should contain `/folders/`
- If you see `/drive/u/0/`, open the folder by double-clicking it

**Need help?** Just ask and I'll guide you through any issues!
