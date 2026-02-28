# Download Required Libraries for Offline Use

## Instructions

Since your network is blocking CDN access, download these libraries manually:

### Step 1: Create Library Folders
```powershell
cd "d:\personal data\coding projects\guitar\virtual-guitar"
mkdir libs
mkdir libs\mediapipe
mkdir libs\tone
```

### Step 2: Download MediaPipe Files

**Option A: Using PowerShell (if you have internet but CDN is blocked)**
```powershell
# Download MediaPipe Hands
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js" -OutFile "libs\mediapipe\hands.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js" -OutFile "libs\mediapipe\camera_utils.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1620248257/drawing_utils.js" -OutFile "libs\mediapipe\drawing_utils.js"

# Download models (WASM files)
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands_solution_packed_assets.data" -OutFile "libs\mediapipe\hands_solution_packed_assets.data"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands_solution_simd_wasm_bin.wasm" -OutFile "libs\mediapipe\hands_solution_simd_wasm_bin.wasm"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands_solution_wasm_bin.wasm" -OutFile "libs\mediapipe\hands_solution_wasm_bin.wasm"
```

### Step 3: Download Tone.js
```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js" -OutFile "libs\tone\Tone.js"
```

### Step 4: Run the PowerShell Script
If the above commands don't work, I've created a download script. Run:
```powershell
.\download-libs.ps1
```

---

## Option B: Manual Download

If PowerShell download fails, manually download from these alternate sources:

1. **MediaPipe Hands**: 
   - Go to: https://unpkg.com/@mediapipe/hands@0.4/
   - Download: hands.js, hands_solution_packed_assets.data, *.wasm files
   - Save to: `libs\mediapipe\`

2. **MediaPipe Camera Utils**:
   - Go to: https://unpkg.com/@mediapipe/camera_utils@0.3/
   - Download: camera_utils.js
   - Save to: `libs\mediapipe\`

3. **MediaPipe Drawing Utils**:
   - Go to: https://unpkg.com/@mediapipe/drawing_utils@0.3/
   - Download: drawing_utils.js
   - Save to: `libs\mediapipe\`

4. **Tone.js**:
   - Go to: https://unpkg.com/tone@14.8.49/build/
   - Download: Tone.js
   - Save to: `libs\tone\`

---

## Verification

After downloading, your folder structure should look like:
```
virtual-guitar/
├── libs/
│   ├── mediapipe/
│   │   ├── hands.js
│   │   ├── camera_utils.js
│   │   ├── drawing_utils.js
│   │   ├── hands_solution_packed_assets.data
│   │   ├── hands_solution_simd_wasm_bin.wasm
│   │   └── hands_solution_wasm_bin.wasm
│   └── tone/
│       └── Tone.js
├── index.html
└── app.js
```

Run: `.\verify-libs.ps1` to check if all files are present.
