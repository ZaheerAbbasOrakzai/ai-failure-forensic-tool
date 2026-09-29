# GitHub push script
$ErrorActionPreference = "Continue"
$gitCmd = "git"

Write-Host "================================================" -ForegroundColor Yellow
Write-Host " Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Verifying git remote..." -ForegroundColor Cyan
& $gitCmd --no-pager remote -v

Write-Host ""
Write-Host "Verifying current branch..." -ForegroundColor Cyan
& $gitCmd --no-pager branch --show-current

Write-Host ""
Write-Host "Checking log (last 3 commits)..." -ForegroundColor Cyan
& $gitCmd --no-pager log --oneline -n 3

Write-Host ""
Write-Host "Attempting push: git push -u origin main" -ForegroundColor Yellow
Write-Host "---------------------------------------------------------" -ForegroundColor Gray

$result = & $gitCmd push -u origin main 2>&1
$exitCode = $LASTEXITCODE

Write-Host "---------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

if ($exitCode -eq 0) {
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Push completed!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now live at:" -ForegroundColor Cyan
    Write-Host "  https://github.com/ZaheerAbbasOrakzai/ai-failure-forensic-tool" -ForegroundColor White
} else {
    Write-Host "================================================" -ForegroundColor Red
    Write-Host " Push encountered an issue." -ForegroundColor Red
    Write-Host " Exit code: $exitCode" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Command output:" -ForegroundColor Yellow
    $result | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "===== STEP-BY-STEP FIX =====" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. CREATE THE REPO FIRST (if not exists):" -ForegroundColor White
    Write-Host "   Go to: https://github.com/new" -ForegroundColor Cyan
    Write-Host "   - Owner: ZaheerAbbasOrakzai" -ForegroundColor White
    Write-Host "   - Repository name: ai-failure-forensic-tool" -ForegroundColor White
    Write-Host "   - Make it PUBLIC or PRIVATE (your choice)" -ForegroundColor White
    Write-Host "   - Do NOT check 'Initialize with README' (we already have one!)" -ForegroundColor Red
    Write-Host "   - Click: Create repository" -ForegroundColor White
    Write-Host ""
    Write-Host "2. AUTHENTICATE (if credentials required):" -ForegroundColor White
    Write-Host "   Option A: GitHub Personal Access Token" -ForegroundColor Cyan
    Write-Host "   - Create at: https://github.com/settings/tokens?type=beta" -ForegroundColor White
    Write-Host "   - Scopes: check 'repo' (full control)" -ForegroundColor White
    Write-Host "   - When prompted for password, PASTE the token instead" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Option B: Use GitHub CLI (easiest)" -ForegroundColor Cyan
    Write-Host "   - Install: https://cli.github.com/" -ForegroundColor White
    Write-Host "   - Run: gh auth login" -ForegroundColor White
    Write-Host "   - Then re-run the push" -ForegroundColor White
    Write-Host ""
    Write-Host "3. RUN THE PUSH MANUALLY:" -ForegroundColor White
    Write-Host "   Open a terminal in the project folder and run:" -ForegroundColor Cyan
    Write-Host "   cd 'c:\Users\abbas\Downloads\ai faiure forensic tool'" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor Green
    Write-Host ""
}
