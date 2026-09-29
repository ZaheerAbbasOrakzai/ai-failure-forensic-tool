# Verify image files (are they placeholders?)
$ErrorActionPreference = "Continue"
$ss = Join-Path (Get-Location) "docs\screenshots"
Write-Host "Checking images in $ss..." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Gray

$files = Get-ChildItem $ss -File
foreach ($f in $files) {
    $md5 = (Get-FileHash -Algorithm MD5 -Path $f.FullName).Hash
    $sha = (Get-FileHash -Algorithm SHA1 -Path $f.FullName).Hash
    Write-Host ("  {0,-35}  {1,8} KB   MD5: {2}" -f $f.Name, [math]::Round($f.Length/1KB,1), $md5) -ForegroundColor Cyan
}
Write-Host ""
Write-Host "If all MD5 hashes match -> they are IDENTICAL placeholders (confirmed broken)." -ForegroundColor Yellow
Write-Host ""
