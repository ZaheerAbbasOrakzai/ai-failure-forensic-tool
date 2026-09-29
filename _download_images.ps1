# Download README screenshot images and commit them
$ErrorActionPreference = "Continue"
$git = "git"
$gh = "gh"

$imgDir = Join-Path (Get-Location) "docs" | Join-Path -ChildPath "screenshots"
if (-not (Test-Path $imgDir)) {
    New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
    Write-Host "Created directory: $imgDir" -ForegroundColor Green
} else {
    Write-Host "Directory exists: $imgDir" -ForegroundColor Cyan
}
Write-Host ""

$images = @(
    @{
        Name = "01-live-dashboard.png"
        Prompt = [Uri]::EscapeDataString("AI observability live dashboard dark theme with orange accents real-time charts pipeline metrics incident alerts glassmorphism design professional")
        Size = "landscape_16_9"
    },
    @{
        Name = "02-trace-waterfall-view.png"
        Prompt = [Uri]::EscapeDataString("AI pipeline trace waterfall view dark theme color-coded spans latency bars span details JSON panels professional UI")
        Size = "landscape_16_9"
    },
    @{
        Name = "03-analytics-dashboard.png"
        Prompt = [Uri]::EscapeDataString("AI pipeline analytics dashboard dark theme multiple charts radar chart bar charts heatmap gradient colors professional")
        Size = "landscape_16_9"
    },
    @{
        Name = "00-social-banner.png"
        Prompt = [Uri]::EscapeDataString("AI Failure Forensics Platform banner dark theme orange blue glowing circuit board pattern magnifying glass brain elements logo title Failure Forensics subtitle AI Pipeline Observability")
        Size = "landscape_16_9"
    }
)

Write-Host "Downloading $($images.Count) generated screenshot images..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray

$base = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image"
$successCount = 0
foreach ($img in $images) {
    $url = "$base`?prompt=$($img.Prompt)&image_size=$($img.Size)"
    $outPath = Join-Path $imgDir $img.Name
    Write-Host "  Fetching $($img.Name) ..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $outPath -TimeoutSec 60
        $sz = (Get-Item $outPath).Length
        $szKB = [math]::Round($sz / 1KB, 1)
        if ($sz -gt 2000) {
            Write-Host "    OK ($szKB KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "    WARNING: File seems small ($szKB KB) - may be placeholder" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""
Write-Host "Downloaded $successCount / $($images.Count) images." -ForegroundColor Yellow
Write-Host ""

Write-Host "Adding images to git..." -ForegroundColor Yellow
& $git --no-pager add docs/ 2>&1
Write-Host ""

Write-Host "Listing what is staged now:" -ForegroundColor Cyan
& $git --no-pager status --short docs/
Write-Host ""

Write-Host "Listing contents of $imgDir :" -ForegroundColor Cyan
Get-ChildItem $imgDir -File | Format-Table Name, @{L='KB';E={[math]::Round($_.Length/1KB,1)}} -AutoSize
