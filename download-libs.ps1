# Download Libraries for Virtual Air Guitar
# Run this script to download all required libraries locally

Write-Host "🎸 Virtual Air Guitar - Library Downloader" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Create directories
Write-Host "Creating library directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "libs" | Out-Null
New-Item -ItemType Directory -Force -Path "libs\mediapipe" | Out-Null
New-Item -ItemType Directory -Force -Path "libs\tone" | Out-Null
Write-Host "✓ Directories created" -ForegroundColor Green
Write-Host ""

# Download MediaPipe Hands
Write-Host "Downloading MediaPipe Hands..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands.js" -OutFile "libs\mediapipe\hands.js"
    Write-Host "✓ hands.js downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download hands.js: $_" -ForegroundColor Red
}

# Download MediaPipe Camera Utils
Write-Host "Downloading MediaPipe Camera Utils..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js" -OutFile "libs\mediapipe\camera_utils.js"
    Write-Host "✓ camera_utils.js downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download camera_utils.js: $_" -ForegroundColor Red
}

# Download MediaPipe Drawing Utils
Write-Host "Downloading MediaPipe Drawing Utils..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/drawing_utils@0.3.1620248257/drawing_utils.js" -OutFile "libs\mediapipe\drawing_utils.js"
    Write-Host "✓ drawing_utils.js downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download drawing_utils.js: $_" -ForegroundColor Red
}

# Download MediaPipe WASM files
Write-Host "Downloading MediaPipe WASM files..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands_solution_packed_assets.data" -OutFile "libs\mediapipe\hands_solution_packed_assets.data"
    Write-Host "✓ hands_solution_packed_assets.data downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download WASM data: $_" -ForegroundColor Red
}

try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands_solution_simd_wasm_bin.wasm" -OutFile "libs\mediapipe\hands_solution_simd_wasm_bin.wasm"
    Write-Host "✓ hands_solution_simd_wasm_bin.wasm downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download SIMD WASM: $_" -ForegroundColor Red
}

try {
    Invoke-WebRequest -Uri "https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands_solution_wasm_bin.wasm" -OutFile "libs\mediapipe\hands_solution_wasm_bin.wasm"
    Write-Host "✓ hands_solution_wasm_bin.wasm downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download WASM bin: $_" -ForegroundColor Red
}

# Download Tone.js
Write-Host "Downloading Tone.js..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://unpkg.com/tone@14.8.49/build/Tone.js" -OutFile "libs\tone\Tone.js"
    Write-Host "✓ Tone.js downloaded" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to download Tone.js: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Download complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: .\verify-libs.ps1" -ForegroundColor White
Write-Host "2. Open: http://localhost:8080/index-offline.html" -ForegroundColor White
Write-Host ""
