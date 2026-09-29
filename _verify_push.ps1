# VERIFY GITHUB STATE
$ErrorActionPreference = "Continue"
$git = "git"
$gh = "gh"

Write-Host "================================================" -ForegroundColor Yellow
Write-Host "  GIT + GITHUB FINAL STATE VERIFICATION" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1] Local git status:" -ForegroundColor Cyan
& $git --no-pager status
Write-Host ""

Write-Host "[2] Local file existence:" -ForegroundColor Cyan
$ss = "docs/screenshots"
if (Test-Path $ss) {
    Write-Host "  $ss directory EXISTS - listing:" -ForegroundColor Green
    Get-ChildItem $ss -File | ForEach-Object {
        $kb = [math]::Round($_.Length/1KB, 1)
        Write-Host "    - $($_.Name)  ($kb KB)" -ForegroundColor White
    }
} else {
    Write-Host "  $ss directory MISSING!" -ForegroundColor Red
}
Write-Host ""

Write-Host "[3] Last 5 local commits:" -ForegroundColor Cyan
& $git --no-pager log -5 --pretty=format:"%h | %ad | %<(50,trunc)%s" --date=short
Write-Host ""
Write-Host ""

Write-Host "[4] Latest commit details:" -ForegroundColor Cyan
$latestFiles = & $git --no-pager show --stat --oneline HEAD
$latestFiles | ForEach-Object { Write-Host "  $_" }
Write-Host ""

Write-Host "[5] Remote status + gh repo view:" -ForegroundColor Cyan
& $git remote -v
Write-Host ""

Write-Host "[6] Check if images exist in remote repo tree (via gh api):" -ForegroundColor Cyan
try {
    $treeCheck = & $gh api "repos/ZaheerAbbasOrakzai/ai-failure-forensic-tool/git/trees/main?recursive=1" 2>&1 | ConvertFrom-Json
    $docFiles = $treeCheck.tree | Where-Object { $_.path -like "docs*" -or $_.path -like "README*" }
    if ($docFiles) {
        Write-Host "  Remote docs/README files:" -ForegroundColor Green
        $docFiles | ForEach-Object {
            $szKB = if ($_.size) { [math]::Round($_.size/1KB,1) } else { "0" }
            Write-Host "    - $($_.path)  ($szKB KB)  [$($_.type)]" -ForegroundColor White
        }
    } else {
        Write-Host "  No docs/ files found on remote!" -ForegroundColor Red
    }
} catch {
    Write-Host "  API call failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "[7] Compare local vs remote HEAD hashes:" -ForegroundColor Cyan
$local = (& $git --no-pager rev-parse HEAD).Trim()
try {
    $remoteSha = (& $gh api "repos/ZaheerAbbasOrakzai/ai-failure-forensic-tool/commits/main" --jq .sha 2>&1).Trim()
    Write-Host "  Local  HEAD: $local" -ForegroundColor White
    Write-Host "  Remote HEAD: $remoteSha" -ForegroundColor White
    if ($local -eq $remoteSha) {
        Write-Host "  => MATCH (in sync)" -ForegroundColor Green
    } else {
        Write-Host "  => MISMATCH (NOT in sync!)" -ForegroundColor Red
        Write-Host "  RE-ADDING AND PUSHING NOW:" -ForegroundColor Yellow
        & $git add -A 2>&1
        & $git commit -m "chore: re-add missing image assets + README edits" --allow-empty 2>&1
        & $git --no-pager push origin main 2>&1
    }
} catch {
    Write-Host "  Could not check remote HEAD: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Write-Host "Done." -ForegroundColor Green
