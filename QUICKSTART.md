# Quick Start Guide
## Virtual Air Guitar - Get Playing in 5 Minutes

---

## Prerequisites
- Modern web browser (Chrome 90+, Edge 90+, or Firefox 88+)
- Webcam (720p or better recommended)
- Good lighting
- Node.js (optional, for local server)

---

## Option 1: Quick Start (No Installation)

### Step 1: Open the App
Simply open `index.html` in your browser by double-clicking it.

**Note**: Some browsers may block camera access from `file://` URLs. If this happens, use Option 2.

### Step 2: Allow Camera Access
When prompted, click "Allow" to grant camera permissions.

### Step 3: Position Yourself
- **Distance**: Sit 2-3 feet from camera
- **Lighting**: Ensure your hands are well-lit
- **Background**: Plain backgrounds work best
- **Hands**: Keep both hands visible in frame

### Step 4: Start Playing!
- **Left hand (or left side of frame)**: Fretting hand
- **Right hand (or right side of frame)**: Strumming hand

---

## Option 2: Local Server (Recommended)

### Step 1: Install Dependencies
```powershell
# Navigate to project folder
cd "d:\personal data\coding projects\guitar\virtual-guitar"

# Install dependencies (http-server)
npm install
```

### Step 2: Start Server
```powershell
npm start
```

This will:
1. Start a local HTTP server on port 8080
2. Automatically open the app in your default browser

### Step 3: Access the App
If it doesn't open automatically, navigate to:
```
http://localhost:8080
```

---

## Playing Your First Notes

### Basic Fretting (Left Hand)
1. Hold your left hand in front of the camera on the **left side** of the frame
2. Position your hand over the virtual guitar neck
3. **Pinch** your fingertips toward your thumb (as if pressing guitar strings)
4. Move your hand horizontally to change frets

**Tip**: The closer your fingertip gets to your thumb, the stronger the "press" detection.

### Basic Strumming (Right Hand)
1. Hold your right hand on the **right side** of the frame
2. Extend your index finger
3. Move it quickly **downward or upward** across the string zones
4. The faster you move, the louder the note

**Tip**: You should see green highlighted strings when your finger crosses them.

### Playing Your First Chord

#### E Major Chord
1. **Left Hand Setup**:
   - Index finger (Landmark 8): Press on fret 1, string 3
   - Middle finger (Landmark 12): Press on fret 2, string 5
   - Ring finger (Landmark 16): Press on fret 2, string 4
   
2. **Right Hand**: Strum downward across all strings

3. **Result**: You should see "E Major" appear in the chord display!

---

## Controls & Settings

### Tuning Selector
- **Standard E**: Default guitar tuning
- **Drop D**: Heavy metal tuning (low E → D)
- **DADGAD**: Celtic/folk tuning
- **Half Step Down**: Eb standard

### Sensitivity Slider (1-10)
- **Low (1-3)**: Requires very close pinch
- **Medium (4-7)**: Balanced (default: 5)
- **High (8-10)**: More forgiving detection

### Strum Threshold (0.1-1.0)
- **Low (0.1-0.2)**: Very sensitive, even slow movements trigger notes
- **Medium (0.3-0.5)**: Balanced (default: 0.3)
- **High (0.6-1.0)**: Requires fast strumming

---

## Visual Feedback

### Hand Landmarks
- **Yellow circles**: Fingertips (4, 8, 12, 16, 20)
- **Cyan circles**: Other landmarks
- **Cyan lines**: Hand skeleton connections
- **Green rings**: Active pinch detection (when pressing frets)

### Guitar UI
- **White strings**: Not pressed
- **Green strings**: Currently pressed
- **Brown area**: Guitar neck
- **Dark brown area**: Guitar body (percussion zone)

### Chord Display (Bottom Center)
Shows the currently detected chord:
- `E Major`, `A Minor`, etc.: Recognized chord
- `Custom`: Unrecognized finger pattern
- `--`: No fretting detected

---

## Tips for Best Experience

### 1. Optimize Lighting
✅ **Good**:
- Face a window or lamp
- Even lighting on both hands
- No harsh shadows

❌ **Bad**:
- Backlit (light behind you)
- Dim lighting
- One hand in shadow

### 2. Camera Positioning
✅ **Good**:
- Camera at chest height
- Hands clearly separated left/right
- Full hand visible (wrist to fingertips)

❌ **Bad**:
- Camera too low/high
- Hands overlapping in center
- Fingers cut off at frame edge

### 3. Hand Positioning
✅ **Fretting Hand**:
- Keep in left half of frame
- Fingertips pointing toward strings
- Visible pinch motion

✅ **Strumming Hand**:
- Keep in right half of frame
- Index finger extended
- Clear up/down motion

### 4. Performance
- Close unnecessary browser tabs
- Use Chrome/Edge for best performance
- Check FPS counter (aim for 55-60 FPS)

---

## Troubleshooting Quick Fixes

### "No camera detected"
- Check if another app is using the camera
- Refresh the page and allow permissions
- Try a different browser

### "Hand not detected"
1. Ensure adequate lighting
2. Move hands into frame
3. Try simpler hand poses

### "Notes not playing"
1. **Click anywhere on the page** (required to start audio)
2. Check console for error messages (F12)
3. Wait for "Audio samples loaded" message

### "Low FPS (< 30)"
1. Reduce video quality in your camera settings
2. Lower sensitivity slider
3. Close background apps

### "Strum not detected"
1. Increase strum threshold slider
2. Move finger **faster** across strings
3. Ensure right hand is on right side of frame

---

## Advanced Techniques

### Barre Chords
1. Use your **index finger** to press multiple strings at once
2. The radial hitbox will detect all strings within range
3. Example: F Major barre chord at fret 1

### Percussion (Drum Sounds)
1. Position your **wrist** over the guitar body (dark brown area)
2. Make a quick **jerk motion** (like hitting a drum)
3. You'll hear a kick drum sound

### Palm Muting
Currently not implemented, but planned for future versions.

---

## Keyboard Shortcuts (Future)

| Key | Action |
|-----|--------|
| `Space` | Toggle pause |
| `R` | Reset calibration |
| `D` | Toggle debug mode |
| `1-4` | Quick tuning change |

---

## Next Steps

1. **Practice basic chords**: E, A, D, G, C
2. **Experiment with tunings**: Try Drop D for heavier sound
3. **Try percussion**: Hit the body zone with your wrist
4. **Record your session**: Use browser screen recording

---

## Common Chord Shapes

### E Major
```
e|---0---
B|---0---
G|---1---
D|---2---
A|---2---
E|---0---
```
Fingers: Index on fret 1 (G string), Middle on fret 2 (A string), Ring on fret 2 (D string)

### A Major
```
e|---0---
B|---2---
G|---2---
D|---2---
A|---0---
E|---X---
```
Fingers: Index, Middle, Ring all on fret 2 (strings 2, 3, 4)

### D Major
```
e|---2---
B|---3---
G|---2---
D|---0---
A|---X---
E|---X---
```
Fingers: Index on fret 2 (G string), Middle on fret 2 (e string), Ring on fret 3 (B string)

### G Major
```
e|---3---
B|---0---
G|---0---
D|---0---
A|---2---
E|---3---
```
Fingers: Index on fret 2 (A string), Middle on fret 3 (Low E), Ring on fret 3 (High e)

---

## Need Help?

### Check the Logs
Open browser console (F12) to see detailed debugging information:
- Hand detection status
- Note trigger events
- Audio sample loading
- FPS metrics

### Common Console Messages
- `✓ Camera started`: Camera initialized successfully
- `✓ Audio samples loaded`: Tone.js ready
- `🎵 String X: Note`: Note was played
- `🥁 Percussion hit!`: Drum triggered

---

**Happy Playing! 🎸🎵**

*Remember: The virtual guitar is designed to be intuitive. Don't overthink it—just move your hands like you're playing a real guitar!*
