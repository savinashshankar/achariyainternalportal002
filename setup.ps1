# Achariya Learning Portal - Quick Start Script
# Run this script to set up the POC

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Achariya Learning Portal - Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Docker
Write-Host "[1/6] Checking Docker..." -ForegroundColor Yellow
docker --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker found`n" -ForegroundColor Green

# Start Database
Write-Host "[2/6] Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose up -d db
Start-Sleep -Seconds 5
Write-Host "✅ Database started`n" -ForegroundColor Green

# Setup Backend
Write-Host "[3/6] Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment if not exists
if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

# Activate venv and install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt -q

Write-Host "✅ Backend setup complete`n" -ForegroundColor Green

# Run migrations (if alembic is set up)
Write-Host "[4/6] Setting up database schema..." -ForegroundColor Yellow
# Uncomment if you have migrations ready:
# alembic upgrade head

# Seed database
Write-Host "Seeding database with sample data..." -ForegroundColor Cyan
python db/seed_data.py

Write-Host "✅ Database seeded`n" -ForegroundColor Green

# Setup Frontend
Write-Host "[5/6] Setting up frontend..." -ForegroundColor Yellow
Set-Location ../frontend

if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies (this may take a few minutes)..." -ForegroundColor Cyan
   npm install
}

Write-Host "✅ Frontend setup complete`n" -ForegroundColor Green

# Instructions
Write-Host "[6/6] Setup Complete! 🎉`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================`n"

Write-Host "1. Start the backend server:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   uvicorn main:app --reload`n" -ForegroundColor White

Write-Host "2. In a new terminal, start the frontend:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "3. Access the application:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000/docs`n" -ForegroundColor White

Write-Host "4. Test with demo accounts:" -ForegroundColor Yellow
Write-Host "   Student: pranav.r@achariya.in" -ForegroundColor White
Write-Host "   Teacher: hari@achariya.in" -ForegroundColor White
Write-Host "   Principal: principal.school@achariya.in" -ForegroundColor White
Write-Host "   Admin: admin@achariya.in" -ForegroundColor White
Write-Host "   Password: any (not validated)`n" -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Happy testing! 🚀" -ForegroundColor Green

Set-Location ..
