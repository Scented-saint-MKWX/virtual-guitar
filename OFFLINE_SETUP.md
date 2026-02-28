# 🎸 Virtual Air Guitar - Offline Setup Complete!

## Quick Start (3 Steps)

### Step 1: Download Libraries
Run this in PowerShell:
```powershell
cd "d:\personal data\coding projects\guitar\virtual-guitar"
.\download-libs.ps1
```

This will download all required libraries to the `libs/` folder.

---

### Step 2: Verify Download
```powershell
.\verify-libs.ps1
```

You should see all green checkmarks (✓).

---

### Step 3: Launch the App
Make sure your Python server is still running (http://localhost:8080), then open:

```
http://localhost:8080/index-offline.html
```

---

## If Download Script Fails

The download script uses `unpkg.com` as the CDN source. If it still fails:

### Option A: Try Alternative Sources
Edit `download-libs.ps1` and replace URLs if needed.

### Option B: Use Simple Guitar (No Libraries)
Open the mouse-controlled version that works without any downloads:
```
http://localhost:8080/simple-guitar.html
```

This version:
- ✅ Works immediately (no downloads needed)
- ✅ Uses mouse instead of camera
- ✅ Generates sound with Web Audio API
- ❌ No hand tracking

---

## Troubleshooting

### "Cannot download from unpkg.com"
Your network may be blocking ALL external domains. In this case:
1. Use a phone hotspot temporarily
2. Use a different network/VPN
3. Download files manually on another computer and transfer via USB

### "WASM files missing"
MediaPipe requires WASM files for the ML model. Without them, hand tracking won't work.
These are the critical files:
- `hands_solution_packed_assets.data` (largest file, ~13MB)
- `hands_solution_simd_wasm_bin.wasm`
- `hands_solution_wasm_bin.wasm`

### "Tone.js not loading"
If only Tone.js fails, you can:
1. Try downloading from: https://tonejs.github.io/build/Tone.js
2. Use simple-guitar.html which doesn't need Tone.js

---

## File Structure After Setup

```
virtual-guitar/
├── libs/                    ← NEW: Downloaded libraries
│   ├── mediapipe/
│   │   ├── hands.js
│   │   ├── camera_utils.js
│   │   ├── drawing_utils.js
│   │   └── *.wasm files
│   └── tone/
│       └── Tone.js
├── index-offline.html       ← NEW: Offline version
├── app-offline.js           ← NEW: Offline app code
├── simple-guitar.html       ← Fallback (mouse control)
├── download-libs.ps1        ← Download script
├── verify-libs.ps1          ← Verification script
└── ... (other files)
```

---

## Expected File Sizes

To verify your downloads are complete:

| File | Size |
|------|------|
| hands.js | ~150 KB |
| camera_utils.js | ~15 KB |
| drawing_utils.js | ~8 KB |
| hands_solution_packed_assets.data | ~13 MB |
| hands_solution_simd_wasm_bin.wasm | ~5 MB |
| hands_solution_wasm_bin.wasm | ~5 MB |
| Tone.js | ~500 KB |

**Total**: ~24 MB

---

## Next Steps After Setup

1. ✅ Open http://localhost:8080/index-offline.html
2. ✅ Allow camera permissions
3. ✅ Position your hands and play!

Need help? Check the main README.md for usage instructions.

---

**Status**: If all libraries downloaded successfully, you now have a **fully offline** Virtual Air Guitar! 🎸
