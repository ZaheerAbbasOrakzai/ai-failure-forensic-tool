# GitHub push via GitHub CLI
$ErrorActionPreference = "Continue"
$gh = "gh"
$git = "git"

Write-Host "================================================" -ForegroundColor Yellow
Write-Host "  GitHub CLI Auth & Push" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Checking GitHub CLI auth status..." -ForegroundColor Cyan
$result = & $gh auth status 2>&1
Write-Host $result
Write-Host ""

$repoName = "ai-failure-forensic-tool"
$owner = "ZaheerAbbasOrakzai"
$remoteUrl = "https://github.com/$owner/$repoName.git"

Write-Host "Step 2: Checking if the repo '$owner/$repoName' exists..." -ForegroundColor Cyan
$repoCheck = & $gh repo view "$owner/$repoName" 2>&1
$repoExit = $LASTEXITCODE
if ($repoExit -eq 0) {
    Write-Host "  ✅ Repo EXISTS on GitHub." -ForegroundColor Green
    Write-Host "  $($repoCheck | Select-Object -First 3)" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Repo NOT found on GitHub via gh." -ForegroundColor Red
    Write-Host "     Creating it automatically as PUBLIC repo..." -ForegroundColor Yellow
    
    $createCmd = & $gh repo create "$owner/$repoName" --public --description "Production-Grade AI Pipeline Observability Platform" --homepage "https://github.com/$owner/$repoName" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Repo created successfully!" -ForegroundColor Green
    } else {
        Write-Host "  Repo creation output:" -ForegroundColor Yellow
        $createCmd | ForEach-Object { Write-Host "    $_" }
        Write-Host ""
        Write-Host "  Trying with --source option and push (may work if already local)..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Step 3: Setting up git credential helper via gh (for auth)..." -ForegroundColor Cyan
& $gh auth setup-git 2>&1

Write-Host ""
Write-Host "Step 4: Verifying current remote and branch..." -ForegroundColor Cyan
& $git --no-pager remote -v
Write-Host "Branch: $( & $git --no-pager branch --show-current )"

Write-Host ""
Write-Host "Step 5: Attempting push via gh (gh repo sync-style or direct git push with gh creds)..." -ForegroundColor Yellow
Write-Host "---------------------------------------------------------" -ForegroundColor Gray

$pushResult = & $git push -u origin main 2>&1
$pushExit = $LASTEXITCODE

Write-Host "---------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

if ($pushExit -eq 0) {
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  🎉 PUSH SUCCESSFUL! 🎉" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is LIVE at:" -ForegroundColor Cyan
    Write-Host "  https://github.com/$owner/$repoName" -ForegroundColor White
    Write-Host ""
    Write-Host "Opening the repo page for you in a moment..." -ForegroundColor Cyan
    Start-Process "https://github.com/$owner/$repoName" 2>&1 | Out-Null
} else {
    Write-Host "Push exit code: $pushExit" -ForegroundColor Red
    Write-Host ""
    Write-Host "Command output:" -ForegroundColor Yellow
    $pushResult | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "===== FIX OPTIONS =====" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Log into GitHub CLI (interactive in a real terminal)" -ForegroundColor White
    Write-Host "  Open PowerShell/CMD as YOU and run:" -ForegroundColor Cyan
    Write-Host "    gh auth login" -ForegroundColor Green
    Write-Host "    (choose GitHub.com, HTTPS, Login with a web browser)" -ForegroundColor White
    Write-Host "  Then come back and re-run the push, or better, run manually:" -ForegroundColor White
    Write-Host "    cd 'c:\Users\abbas\Downloads\ai faiure forensic tool'" -ForegroundColor White
    Write-Host "    git push -u origin main" -ForegroundColor Green
    Write-Host ""
    Write-Host "Option 2: Manual push with PAT (classic way - works always)" -ForegroundColor White
    Write-Host "  Create token here: https://github.com/settings/tokens?type=beta" -ForegroundColor Cyan
    Write-Host "  Check 'repo' scope, Generate, then copy." -ForegroundColor White
    Write-Host "  Then run:" -ForegroundColor White
    Write-Host "    cd 'c:\Users\abbas\Downloads\ai faiure forensic tool'" -ForegroundColor White
    Write-Host "    `$user='ZaheerAbbasOrakzai'; `$token='YOUR_TOKEN_HERE';" -ForegroundColor White
    Write-Host "    git remote set-url origin \"https://`$user:`$token@github.com/$owner/$repoName.git\"" -ForegroundColor White
    Write-Host "    git push -u origin main" -ForegroundColor Green
}
