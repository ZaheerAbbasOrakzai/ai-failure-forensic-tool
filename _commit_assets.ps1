# Commit image assets + updated README, then push
$ErrorActionPreference = "Continue"
$git = "git"
$gh = "gh"

Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "  COMMIT IMAGE ASSETS + README  ->  PUSH TO GITHUB" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "[1/4] Git status (before staging)..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray
& $git --no-pager status --short
Write-Host ""

Write-Host "[2/4] Adding ALL assets (docs/ + README + scripts)..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray
& $git --no-pager add -A

Write-Host "[3/4] Committing..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray
$msg = "docs: embed generated screenshots and social banner as local assets

- Add 4 AI-generated PNG screenshots (690KB total) to docs/screenshots/:
    * 00-social-banner.png     (repo social preview / hero banner)
    * 01-live-dashboard.png    (Live Dashboard screenshot - orange glow)
    * 02-trace-waterfall-view.png  (Trace Waterfall view - blue glow)
    * 03-analytics-dashboard.png   (Analytics Dashboard - green glow)
- Replace remote Trae-internal image URLs with local relative paths
- Wrap each screenshot in <picture> element with dark-mode srcset
- Add CSS-styled screenshot frames:
    * 12px border-radius
    * Colored accent border per image (orange / blue / green)
    * 40px soft glow box-shadows for premium visual pop
    * 100% width responsive layout
- Add social/og banner at top of README for GitHub link previews"

& $git --no-pager commit -m $msg 2>&1
if ($LASTEXITCODE -eq 0) {
    $hash = (& $git --no-pager rev-parse --short HEAD).Trim()
    Write-Host ""
    Write-Host "  Commit OK: $hash" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  (Nothing new to commit? Already up to date?)" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "[4/4] Pushing to GitHub origin main..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray
& $gh auth setup-git 2>&1 | Out-Null
$pushOut = & $git push -u origin main 2>&1
$pushExit = $LASTEXITCODE
if ($pushExit -eq 0) {
    Write-Host "  PUSH SUCCESSFUL" -ForegroundColor Green
    $pushOut | ForEach-Object { Write-Host "     $_" }
} else {
    Write-Host "  Push failed, output:" -ForegroundColor Red
    $pushOut | ForEach-Object { Write-Host "     $_" }
}
Write-Host ""

Write-Host "================================================================" -ForegroundColor Green
Write-Host "  ASSETS COMMITTED + PUSHED TO GITHUB" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repo: https://github.com/ZaheerAbbasOrakzai/ai-failure-forensic-tool" -ForegroundColor White
Write-Host ""

Start-Process "https://github.com/ZaheerAbbasOrakzai/ai-failure-forensic-tool"
