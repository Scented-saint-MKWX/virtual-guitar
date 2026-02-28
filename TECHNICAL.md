# Technical Architecture Documentation
## Virtual Air Guitar - Advanced Implementation

---

## 1. System Overview

### 1.1 Core Technologies
- **MediaPipe Hands**: Google's ML solution for 21-landmark hand tracking
- **Tone.js**: Web Audio framework with polyphonic sampling
- **Canvas API**: Multi-layer rendering system
- **WebRTC**: Camera access via `getUserMedia`

### 1.2 Data Flow Architecture
```
Camera Feed → MediaPipe → Landmark Detection → Collision Engine → Audio Synthesis
                                    ↓
                            Gesture Recognition → Chord Mapping
                                    ↓
                            Rendering Pipeline → Canvas Layers
```

---

## 2. Computer Vision Pipeline

### 2.1 MediaPipe Hand Landmarks
Each hand provides 21 3D landmarks (x, y, z):
- **x, y**: Normalized coordinates [0, 1]
- **z**: Relative depth from wrist (negative = closer to camera)

#### Key Landmarks
| Index | Name | Purpose |
|-------|------|---------|
| 0 | Wrist | Percussion detection, palm base |
| 4 | Thumb Tip | Pinch detection reference |
| 8 | Index Tip | Primary strumming finger |
| 12 | Middle Tip | Fretting (barre chords) |
| 16 | Ring Tip | Fretting |
| 20 | Pinky Tip | Fretting |

### 2.2 Hand Classification
Hands are classified based on their x-position in the frame:

```javascript
handCenterX = landmarks[9].x * frameWidth

if (handCenterX < frameWidth / 2) {
    // Left side = Fretting hand
    fretting.hand = landmarks
} else {
    // Right side = Strumming hand
    strumming.hand = landmarks
}
```

---

## 3. Advanced Collision Detection

### 3.1 Radial Hitbox Algorithm

**Problem**: Single-point collision fails to detect barre chords where one finger presses multiple strings.

**Solution**: Circular hitbox around each fingertip.

#### Mathematical Model
For a fingertip at position $(x_f, y_f)$ with radius $r$:

$$
\text{String } s \text{ is pressed if: } |y_f - y_s| < r
$$

Where:
- $y_f$ = Fingertip Y-coordinate
- $y_s$ = String Y-coordinate
- $r$ = `fingerRadius` (default: 25 pixels)

#### Implementation
```javascript
for (const string of this.guitar.strings) {
    const distance = Math.abs(tip.y - string.y);
    
    if (distance < this.collision.fingerRadius) {
        this.collision.activeStrings.add(string.index);
        this.collision.frettedPositions.set(string.index, fretIndex);
    }
}
```

### 3.2 Pinch Detection (Z-Axis Simulation)

**Challenge**: 2D webcams lack depth perception for "press" detection.

**Solution**: Measure 3D distance between fingertip and thumb. A small distance indicates a "pinch" gesture (pressing the fret).

#### 3D Distance Formula
$$
d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2 + (z_1 - z_2)^2}
$$

$$
\text{isPressing} = d < \theta_{pinch}
$$

Where $\theta_{pinch}$ = 0.08 (normalized units)

#### Code Implementation
```javascript
calculateDistance3D(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const distanceToThumb = this.calculateDistance3D(tip, thumb);
const isPinching = distanceToThumb < this.collision.pinchThreshold;
```

### 3.3 Fret Position Detection
Frets divide the guitar neck into spatial zones:

$$
\text{fretIndex} = \lfloor \frac{x_f - x_{neck}}{w_{fret}} \rfloor
$$

Where:
- $x_f$ = Fingertip X-coordinate
- $x_{neck}$ = Neck start X-position
- $w_{fret}$ = Width of each fret zone

---

## 4. Gesture Recognition

### 4.1 Velocity-Based Strumming

**Velocity Calculation** (Frame-to-frame delta):
$$
V = |y_t - y_{t-1}|
$$

**Trigger Condition**:
$$
\text{playNote} = (V > \theta_{strum}) \land (|y_{index} - y_{string}| < \epsilon)
$$

Where:
- $V$ = Velocity (pixels/frame)
- $\theta_{strum}$ = Strum threshold (default: 0.3)
- $\epsilon$ = Crossing tolerance (default: 15 pixels)

#### Implementation
```javascript
const velocity = Math.abs(currentIndexY - this.strumming.prevIndexY);

if (velocity < this.collision.strumThreshold) {
    return; // Not strumming fast enough
}

for (const string of this.guitar.strings) {
    const crossedString = Math.abs(index.y - string.y) < 15;
    
    if (crossedString) {
        this.playString(string.index, velocity);
    }
}
```

### 4.2 Percussion Detection (Jerk Measurement)

**Jerk** = Rate of change of acceleration:
$$
j_t = |a_t - a_{t-1}|
$$

Where acceleration $a_t \approx V_t$ (velocity as proxy)

**Percussion Trigger**:
$$
\text{kickDrum} = (j_t > \theta_{percussion}) \land \text{wristInBodyZone}
$$

#### Spatial Zone Check
```javascript
const inBodyZone = (
    wrist.x >= bodyZone.x &&
    wrist.x <= bodyZone.x + bodyZone.width &&
    wrist.y >= bodyZone.y &&
    wrist.y <= bodyZone.y + bodyZone.height
);
```

---

## 5. Audio Engine Architecture

### 5.1 Note Transposition Algorithm

Given a base note (e.g., `E2`) and fret position, calculate the transposed note:

$$
\text{semitones} = \text{fretIndex}
$$

$$
\text{newNote} = \text{transpose}(\text{baseNote}, \text{semitones})
$$

#### Chromatic Scale Mapping
```javascript
const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

transposeNote(baseNote, semitones) {
    const [noteName, octave] = parseNote(baseNote); // "E2" → ["E", 2]
    let noteIndex = notes.indexOf(noteName);
    let newOctave = octave;
    
    noteIndex += semitones;
    
    while (noteIndex >= 12) {
        noteIndex -= 12;
        newOctave++;
    }
    
    return notes[noteIndex] + newOctave;
}
```

**Example**:
- String: E2, Fret: 5 → A2
- String: B3, Fret: 3 → D4

### 5.2 Dynamic Velocity Mapping

Map strumming velocity to audio volume:

$$
\text{volume} = \min\left(\frac{V}{\theta_{strum}}, 1.0\right) \times 0.8
$$

This ensures:
- Minimum volume at threshold velocity
- Maximum volume (0.8) at high velocity
- No clipping

```javascript
const volume = Math.min(velocity / this.collision.strumThreshold, 1.0) * 0.8;
this.audio.sampler.triggerAttackRelease(note, '0.5', undefined, volume);
```

---

## 6. Chord Recognition System

### 6.1 Fingerprint Generation
Create a 6-element array representing fret positions:

```javascript
fingerprint = [fret6, fret5, fret4, fret3, fret2, fret1]
```

**Example** (E Major):
```
String 6: Open (0)    String 4: Fret 2
String 5: Fret 2      String 3: Fret 1
String 2: Open (0)    String 1: Open (0)

fingerprint = [0, 2, 2, 1, 0, 0]
```

### 6.2 Pattern Matching Algorithm
```javascript
matchChord(fingerprint) {
    for (const [name, pattern] of Object.entries(this.chords.library)) {
        let matches = true;
        
        for (let i = 0; i < 6; i++) {
            if (pattern[i] !== -1 && fingerprint[i] !== pattern[i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) return name;
    }
    
    return 'Custom';
}
```

**Pattern Syntax**:
- `-1`: Don't care (string can be any fret or muted)
- `0`: Open string
- `1+`: Specific fret number

### 6.3 Chord Library
| Chord | Pattern [6, 5, 4, 3, 2, 1] |
|-------|---------------------------|
| E Major | `[0, 2, 2, 1, 0, 0]` |
| A Major | `[-1, 0, 2, 2, 2, 0]` |
| D Major | `[-1, -1, 0, 2, 3, 2]` |
| G Major | `[3, 2, 0, 0, 0, 3]` |
| C Major | `[-1, 3, 2, 0, 1, 0]` |
| E Minor | `[0, 2, 2, 0, 0, 0]` |
| A Minor | `[-1, 0, 2, 2, 1, 0]` |
| D Minor | `[-1, -1, 0, 2, 3, 1]` |

---

## 7. Rendering Pipeline

### 7.1 Three-Layer Canvas System

**Layer Separation Benefits**:
1. Independent z-index control
2. Selective redrawing (only update changed layers)
3. Compositing effects (blend modes)
4. Performance optimization

**Render Order**:
```javascript
render() {
    clearAllLayers();
    
    // Layer 1: Video (background)
    renderVideoFeed();
    
    // Layer 2: Guitar UI (static after init)
    renderGuitar();
    
    // Layer 3: Hands (overlay effect)
    renderHands();
}
```

### 7.2 Video Mirroring Transform
```javascript
renderVideoFeed() {
    this.videoCtx.save();
    this.videoCtx.scale(-1, 1);  // Horizontal flip
    this.videoCtx.drawImage(this.results.image, -this.width, 0, this.width, this.height);
    this.videoCtx.restore();
}
```

This creates a "mirror" effect, making hand positioning intuitive.

---

## 8. Performance Optimizations

### 8.1 Object Pooling
Reuse coordinate objects to minimize garbage collection:

```javascript
// ❌ Bad: Creates new objects every frame
const tip = { x: lm.x * width, y: lm.y * height, z: lm.z };

// ✅ Good: Reuse existing objects
this.strumming.indexTip.x = lm.x * width;
this.strumming.indexTip.y = lm.y * height;
this.strumming.indexTip.z = lm.z;
```

### 8.2 Early Exit Conditions
```javascript
detectFretCollisions() {
    if (!this.fretting.hand || !this.fretting.landmarks) {
        this.collision.activeStrings.clear();
        return; // Early exit
    }
    
    // ... expensive collision logic
}
```

### 8.3 requestAnimationFrame Loop
Single 60fps loop handles all updates:
```javascript
animate() {
    requestAnimationFrame(() => this.animate());
    
    calculateFPS();
    render();
}
```

---

## 9. Tuning System Implementation

### 9.1 Frequency Offset Calculation
Tunings modify the base frequency of each string:

**Standard E**: `['E2', 'A2', 'D3', 'G3', 'B3', 'E4']`

**Drop D**: Lowers string 6 by 2 semitones
- String 6: E2 → D2 (−2 semitones = −2 frets)

**DADGAD**: Celtic tuning
- String 6: E2 → D2 (−2)
- String 5: A2 → A2 (0)
- String 4: D3 → D3 (0)
- String 3: G3 → G3 (0)
- String 2: B3 → A3 (−2)
- String 1: E4 → D4 (−2)

### 9.2 Runtime Tuning Change
```javascript
changeTuning(tuningName) {
    this.audio.stringNotes = this.audio.tunings[tuningName];
    
    for (let i = 0; i < this.guitar.strings.length; i++) {
        this.guitar.strings[i].note = this.audio.stringNotes[i];
    }
}
```

---

## 10. Future Enhancements

### 10.1 Machine Learning Chord Recognition
Replace pattern matching with trained neural network:
- **Input**: 126 features (21 landmarks × 6 coordinates)
- **Output**: Chord probability distribution
- **Model**: LSTM or Transformer for temporal context

### 10.2 Advanced Audio Effects
Implement Web Audio effect chains:
```javascript
// Distortion → Reverb → Output
source → distortion → reverb → destination
```

### 10.3 Latency Optimization
- **Target**: <50ms total latency (perceptually instant)
- **Current**: ~100-150ms (camera + processing + audio)
- **Solution**: WebAssembly for CV pipeline, Web Audio worklets

---

## 11. Mathematical Constants Reference

| Symbol | Name | Value | Unit |
|--------|------|-------|------|
| $r$ | Finger Radius | 25 | pixels |
| $\theta_{pinch}$ | Pinch Threshold | 0.08 | normalized |
| $\theta_{strum}$ | Strum Threshold | 0.3 | pixels/frame |
| $\theta_{percussion}$ | Percussion Threshold | 15 | acceleration units |
| $\epsilon$ | Crossing Tolerance | 15 | pixels |

---

## 12. System Constraints

### 12.1 Performance Targets
- **FPS**: 60fps stable
- **Latency**: <150ms end-to-end
- **CPU**: <40% on mid-range CPU
- **Memory**: <500MB RAM

### 12.2 Hardware Requirements
- **Camera**: 720p @ 30fps (minimum)
- **GPU**: Hardware-accelerated canvas rendering
- **Audio**: Web Audio API support (all modern browsers)

---

**Document Version**: 1.0  
**Last Updated**: February 25, 2026  
**Author**: Senior Embedded Systems Engineer
