# Verify Library Files
# Checks if all required libraries have been downloaded

Write-Host "🔍 Verifying Library Files..." -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

$allPresent = $true

# Check MediaPipe files
$mediapipeFiles = @(
    "libs\mediapipe\hands.js",
    "libs\mediapipe\camera_utils.js",
    "libs\mediapipe\drawing_utils.js",
    "libs\mediapipe\hands_solution_packed_assets.data",
    "libs\mediapipe\hands_solution_simd_wasm_bin.wasm",
    "libs\mediapipe\hands_solution_wasm_bin.wasm"
)

Write-Host "MediaPipe Files:" -ForegroundColor Yellow
foreach ($file in $mediapipeFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "  ✓ $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (MISSING)" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""

# Check Tone.js
Write-Host "Tone.js:" -ForegroundColor Yellow
if (Test-Path "libs\tone\Tone.js") {
    $size = (Get-Item "libs\tone\Tone.js").Length
    $sizeKB = [math]::Round($size / 1KB, 2)
    Write-Host "  ✓ libs\tone\Tone.js ($sizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ libs\tone\Tone.js (MISSING)" -ForegroundColor Red
    $allPresent = $false
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Green

if ($allPresent) {
    Write-Host "✓ All libraries present!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now open: http://localhost:8080/index-offline.html" -ForegroundColor Cyan
} else {
    Write-Host "✗ Some libraries are missing!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run: .\download-libs.ps1" -ForegroundColor Yellow
    Write-Host "Or manually download missing files (see DOWNLOAD_LIBS.md)" -ForegroundColor Yellow
}

Write-Host ""
