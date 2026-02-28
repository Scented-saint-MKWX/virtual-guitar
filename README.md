# 🎸 Virtual Air Guitar

A high-performance web application that transforms hand gestures into guitar music using advanced Computer Vision (MediaPipe) and Web Audio API (Tone.js).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()

**[🚀 Launch Demo](demo.html)** | **[📖 Quick Start](QUICKSTART.md)** | **[🔬 Technical Docs](TECHNICAL.md)** | **[🗺️ Roadmap](ROADMAP.md)**

---

## 📑 Table of Contents
- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Usage](#-usage)
- [Technical Details](#-technical-details)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎥 Demo

![Virtual Air Guitar Banner](https://via.placeholder.com/1280x400/667eea/ffffff?text=Virtual+Air+Guitar+%F0%9F%8E%B8)

**Try it now**: Open [demo.html](demo.html) for an interactive tutorial, or jump straight to [index.html](index.html) to start playing!

---

## ✨ Features

### Advanced Computer Vision
- **MediaPipe Hands Integration**: Real-time hand tracking with 21 3D landmarks per hand
- **Dual-Hand Detection**: Separate tracking for fretting and strumming hands
- **60 FPS Performance**: Optimized rendering loop with `requestAnimationFrame`

### Intelligent Fret Detection
- **Radial Hitbox Collision**: Multi-string detection for barre chords
- **Pinch Detection**: Simulates finger pressure using 3D distance between fingertips and thumb
- **12-Fret Fretboard**: Full chromatic range across 6 strings

### Audio Synthesis
- **Tone.js Polyphonic Sampler**: High-quality acoustic guitar samples
- **6-Voice Polyphony**: Simultaneous multi-string playback
- **Multiple Tunings**: Standard E, Drop D, DADGAD, Half Step Down
- **Dynamic Velocity**: Volume responds to strumming speed

### Gesture Recognition
- **Velocity-Based Strumming**: Triggers notes when hand crosses string zones
- **Percussion Detection**: Wrist acceleration triggers kick drum samples
- **Chord Recognition**: Real-time chord identification from fret patterns

## 🏗️ Architecture

### Three-Layer Canvas System
```
Layer 3: Hand Landmarks (z-index: 3) - OVERLAY
Layer 2: Guitar UI (z-index: 2)
Layer 1: Video Feed (z-index: 1) - MIRRORED
```

### Collision Detection Algorithm

#### Radial Hitbox Detection
For each fingertip landmark (4, 8, 12, 16, 20):
1. Calculate 3D distance to thumb
2. If distance < `pinchThreshold`, finger is "pressing"
3. Check if fingertip is within fret boundaries (x-axis)
4. Apply radial hitbox (circle around fingertip)
5. All strings intersecting the hitbox are flagged as "active"

```javascript
// Pseudo-code
for (fingertip of [4, 8, 12, 16, 20]) {
    distance = sqrt((tip.x - thumb.x)² + (tip.y - thumb.y)² + (tip.z - thumb.z)²)
    
    if (distance < pinchThreshold) {
        fretIndex = getFretFromX(tip.x)
        
        for (string of allStrings) {
            if (abs(tip.y - string.y) < fingerRadius) {
                activeStrings.add(string)
                frettedPositions.set(string, fretIndex)
            }
        }
    }
}
```

#### Strumming Detection
```javascript
velocity = abs(currentIndexY - previousIndexY)

if (velocity > strumThreshold) {
    for (string of allStrings) {
        if (abs(indexTip.y - string.y) < crossingThreshold) {
            playString(string, velocity)
        }
    }
}
```

#### Percussion Detection
```javascript
jerk = abs(currentAcceleration - previousAcceleration)

if (wristInBodyZone && jerk > percussionThreshold) {
    triggerKickDrum()
}
```

## 🎮 Usage

## 🚀 Quick Start

### Option 1: Direct Open (Fastest)
1. Open `index.html` in Chrome/Edge
2. Allow camera permissions
3. Position your hands and start playing!

### Option 2: Local Server (Recommended)
```powershell
cd virtual-guitar
npm install
npm start
```
Access at: `http://localhost:8080`

**Need help?** See the [Quick Start Guide](QUICKSTART.md) for detailed instructions.

### Hand Positioning
- **Left Side of Frame**: Fretting hand (hold virtual guitar neck)
- **Right Side of Frame**: Strumming hand (strum across strings)

### Playing Notes
1. **Fretting**: Pinch fingertips to "press" strings at specific frets
2. **Strumming**: Move index finger quickly across string zones
3. **Chords**: Multiple fingers create chord shapes (E Major, A Minor, etc.)
4. **Percussion**: Strike the guitar body zone with your wrist

### Controls
- **Tuning Selector**: Switch between tuning presets
- **Sensitivity Slider**: Adjust collision detection radius
- **Strum Threshold**: Control strumming velocity trigger
- **Calibrate Button**: Future feature for position adjustment

## 🔧 Technical Details

### Dependencies
- **MediaPipe Hands** (v0.4+): Hand landmark detection
- **Tone.js** (v14.8+): Audio synthesis and sampling
- **Modern Browser**: WebRTC, Canvas API, Web Audio API

### Performance Optimizations
- Object pooling for landmark data (minimize GC)
- Single `requestAnimationFrame` loop
- Efficient collision detection with spatial partitioning
- Canvas layer separation (only redraw changed layers)

### Key Parameters
```javascript
collision: {
    fingerRadius: 25,          // Radial hitbox (pixels)
    pinchThreshold: 0.08,      // 3D distance threshold
    strumThreshold: 0.3,       // Velocity threshold
    percussionThreshold: 15    // Wrist jerk threshold
}
```

### Chord Library
Supports detection of:
- E Major, A Major, D Major, G Major, C Major
- E Minor, A Minor, D Minor
- Custom chord patterns

## 🎵 Tuning Systems

| Tuning | Strings (Low → High) |
|--------|---------------------|
| Standard E | E2, A2, D3, G3, B3, E4 |
| Drop D | D2, A2, D3, G3, B3, E4 |
| DADGAD | D2, A2, D3, G3, A3, D4 |
| Half Step Down | Eb2, Ab2, Db3, Gb3, Bb3, Eb4 |

## 🚀 Future Enhancements
- [ ] Machine learning chord recognition
- [ ] Custom tuning editor
- [ ] Recording and playback
- [ ] Multi-guitar effects (distortion, reverb)
- [ ] Mobile device support
- [ ] MIDI output
- [ ] Multi-user jam sessions

See [ROADMAP.md](ROADMAP.md) for the complete development roadmap.

---

## 📚 Documentation

### User Documentation
- **[Quick Start Guide](QUICKSTART.md)** - Get playing in 5 minutes
- **[Demo Page](demo.html)** - Interactive tutorial and feature showcase

### Technical Documentation
- **[Technical Architecture](TECHNICAL.md)** - In-depth algorithm documentation
- **[Configuration Guide](config.js)** - Advanced customization options
- **[Changelog](CHANGELOG.md)** - Version history and release notes

### Development
- **[Roadmap](ROADMAP.md)** - Future features and development plans
- **[Contributing](#-contributing)** - How to contribute to the project

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Open issues for bugs you encounter
2. **Suggest Features**: Share your ideas in GitHub issues
3. **Submit PRs**: Implement features from the roadmap
4. **Improve Docs**: Help us make documentation better
5. **Share**: Tell others about this project!

### Development Setup
```powershell
# Clone the repository
git clone https://github.com/yourusername/virtual-air-guitar.git

# Navigate to directory
cd virtual-air-guitar

# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Style
- Use ES6+ JavaScript features
- Follow existing code formatting
- Add JSDoc comments for functions
- Update documentation for new features

---

## 🎓 Learn More

### Technologies Used
- **[MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)** - Hand tracking ML model
- **[Tone.js](https://tonejs.github.io/)** - Web Audio framework
- **[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** - 2D rendering

### Research & Inspiration
- Computer vision for music interfaces
- Gesture-based musical instruments
- Real-time audio synthesis
- Human-computer interaction

---

## ⚠️ Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ⚠️ Limited Testing |
| Mobile | Any | ❌ Not Supported Yet |

---

## 🙏 Acknowledgments

- Google MediaPipe team for the amazing hand tracking technology
- Tone.js developers for the powerful audio framework
- Open source community for inspiration and support

---

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/virtual-air-guitar/issues)
- **Email**: your.email@example.com
- **Discord**: [Join our community](#) (coming soon)

---

## 📊 System Requirements
- **Camera**: 720p @ 30fps minimum
- **Browser**: Chrome 90+, Edge 90+, Firefox 88+
- **CPU**: Intel i5 or equivalent (for real-time CV)
- **RAM**: 4GB minimum

## 🐛 Troubleshooting

### Low FPS
- Reduce MediaPipe `modelComplexity` to 0
- Close other browser tabs
- Use better lighting for faster tracking

### No Sound
- Click anywhere on page to initialize audio context
- Check browser audio permissions
- Verify Tone.js samples loaded (check console)

### Hand Detection Issues
- Ensure adequate lighting
- Position hands clearly in frame
- Avoid busy backgrounds

## 📄 License
MIT License - Free for personal and commercial use

## 👨‍💻 Author
Senior Embedded Systems Engineer & Full-Stack Developer
Specializing in Computer Vision and Web Audio

---

**Made with ❤️ using MediaPipe and Tone.js**