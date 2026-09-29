# Git setup script
$ErrorActionPreference = "Continue"
$gitCmd = "git"

Write-Host "Initializing git repository..." -ForegroundColor Cyan
& $gitCmd --no-pager init

Write-Host "Configuring git user..." -ForegroundColor Cyan
& $gitCmd config user.name "Zaheer Abbas Orakzai"
& $gitCmd config user.email "zaheerabbasorakzai@users.noreply.github.com"

Write-Host "Adding files to staging..." -ForegroundColor Cyan
& $gitCmd --no-pager add .

Write-Host "Checking git status..." -ForegroundColor Cyan
& $gitCmd --no-pager status --short | Select-Object -First 20

Write-Host "Creating initial commit..." -ForegroundColor Cyan
& $gitCmd --no-pager commit -m "feat: initial commit - AI Failure Forensics Platform

- Complete 11-page React TypeScript observability platform
- Real-time trace ingestion with industry-specific patterns
- Root Cause Analysis with 75-95% confidence scoring
- Incident detection with severity classification
- Advanced analytics with heatmap/radar/trend charts
- Human review workflow and evaluation dataset mgmt
- Enhanced UI: glassmorphism, noise textures, 20+ CSS animations
- Tailwind v4 + Recharts + Framer Motion stack
- Vite production build ready (786KB / 212KB gzipped)
- Advanced GitHub README with badges and feature tables"

Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
& $gitCmd remote add origin "https://github.com/ZaheerAbbasOrakzai/ai-failure-forensic-tool.git" 2>&1

Write-Host "Renaming branch to main..." -ForegroundColor Cyan
& $gitCmd branch -M main 2>&1

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " Git setup complete! " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "To push to GitHub, run:" -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "NOTE: If the GitHub repo doesn't exist, create it first at:" -ForegroundColor Yellow
Write-Host "  https://github.com/new" -ForegroundColor White
Write-Host "  Repository name: ai-failure-forensic-tool" -ForegroundColor White
