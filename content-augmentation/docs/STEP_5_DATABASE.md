# Step 5: Database Setup - Interactive Guide

## 🎯 What We'll Do

1. Install PostgreSQL (if not already installed)
2. Create database
3. Test connection

**Estimated time:** 5-10 minutes

---

## 📦 Step 5.1: Check if PostgreSQL is Installed

### Action 1: Check Installation

Open **PowerShell** or **Command Prompt** and run:
```powershell
psql --version
```

**If you see a version number (e.g., `psql (PostgreSQL) 14.x`):**
- ✅ PostgreSQL is installed - skip to Step 5.2

**If you get an error:**
- ❌ PostgreSQL not installed - continue to install it

---

## 💿 Step 5.1b: Install PostgreSQL (If Needed)

### Action 2: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"**
3. Choose the latest version (PostgreSQL 16 or 15)
4. Download the Windows x86-64 installer

### Action 3: Run Installer

1. Run the downloaded `.exe` file
2. Click **"Next"** through the welcome screens
3. **Installation Directory:** Leave default
4. **Components:** Select all (PostgreSQL Server, pgAdmin 4, Command Line Tools)
5. **Data Directory:** Leave default
6. **Password:** Create a password for the `postgres` superuser
   - **IMPORTANT:** Remember this password! Write it down.
7. **Port:** Leave as `5432` (default)
8. **Locale:** Leave default
9. Click **"Next"** then **"Install"**
10. Wait for installation to complete (~5 minutes)

---

## 🗄️ Step 5.2: Create Database

### Action 4: Open pgAdmin or psql

**Option A: Using pgAdmin (GUI - Easier)**
1. Open **pgAdmin 4** from Start Menu
2. Enter the password you created during installation
3. Expand **"Servers"** → **"PostgreSQL"**
4. Right-click on **"Databases"** → **"Create"** → **"Database"**
5. **Database name:** `content_augmentation`
6. Click **"Save"**

**Option B: Using Command Line**
1. Open **PowerShell** or **Command Prompt**
2. Run:
   ```powershell
   psql -U postgres
   ```
3. Enter your PostgreSQL password
4. In the psql prompt, run:
   ```sql
   CREATE DATABASE content_augmentation;
   \q
   ```

---

## 🔐 Step 5.3: Create Database User (Optional but Recommended)

### Action 5: Create Dedicated User

**In pgAdmin:**
1. Right-click **"Login/Group Roles"** → **"Create"** → **"Login/Group Role"**
2. **Name:** `content_aug_user`
3. Go to **"Definition"** tab → **Password:** `YourSecurePassword123!`
4. Go to **"Privileges"** tab → Check **"Can login?"**
5. Click **"Save"**
6. Right-click on `content_augmentation` database → **"Properties"**
7. Go to **"Security"** tab → **"Add"** → Select `content_aug_user` → **Privileges:** All
8. Click **"Save"**

**Or via Command Line:**
```sql
psql -U postgres
CREATE USER content_aug_user WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE content_augmentation TO content_aug_user;
\q
```

---

## ✅ Step 5.4: Test Connection

### Action 6: Test Database Connection

**Using Command Line:**
```powershell
psql -U postgres -d content_augmentation
```

If you created a dedicated user:
```powershell
psql -U content_aug_user -d content_augmentation
```

Enter the password when prompted.

If you see `content_augmentation=#` prompt, success! ✅

Type `\q` to exit.

---

## ✅ Step 5 Complete! What You Should Have:

- [ ] PostgreSQL installed
- [ ] Database `content_augmentation` created
- [ ] (Optional) User `content_aug_user` created
- [ ] Connection tested successfully

---

## 💬 When Done, Reply With:

```
Step 5 done ✅
Database: content_augmentation
User: postgres (or content_aug_user if created)
Password: [your password - keep it safe!]
```

---

## 🆘 Troubleshooting

**psql: command not found**
- PostgreSQL not in PATH
- Restart your terminal/PowerShell after installation
- Or use full path: `C:\Program Files\PostgreSQL\15\bin\psql.exe`

**Password authentication failed**
- Double-check the password you set during installation
- Try resetting the postgres user password

**Connection refused**
- PostgreSQL service not running
- Start it from Services (Windows+R → `services.msc` → find PostgreSQL → Start)

**Port already in use**
- Another database using port 5432
- Either stop that service or use a different port during installation

**Need help?** Just ask and I'll guide you through!
