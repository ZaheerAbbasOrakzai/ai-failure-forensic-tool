Write-Host "Starting setup..." -ForegroundColor Green
Set-Location "c:\Users\abbas\Downloads\ai faiure forensic tool"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan

Write-Host "Node version: $(node --version)" -ForegroundColor Yellow
Write-Host "NPM version: $(npm --version)" -ForegroundColor Yellow

Write-Host "Installing dependencies..." -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" install --no-audit --no-fund 2>&1
Write-Host "Dependencies installed!" -ForegroundColor Green

Write-Host "Running typecheck..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" run typecheck 2>&1
Write-Host "Typecheck complete!" -ForegroundColor Green

Write-Host "Running build..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" run build 2>&1
Write-Host "Build complete!" -ForegroundColor Green
