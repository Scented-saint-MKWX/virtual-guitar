# Changelog
All notable changes to the Virtual Air Guitar project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-02-25

### 🎉 Initial Release

#### Added
- **Core Features**
  - MediaPipe Hands integration for real-time hand tracking
  - Dual-hand detection and classification (fretting vs strumming)
  - Three-layer canvas rendering system (video, guitar UI, hand landmarks)
  - Radial hitbox collision detection for barre chords
  - Pinch detection for press/release logic
  - 12-fret guitar neck with 6 strings
  - Velocity-based strumming detection
  - Percussion mode (wrist acceleration detection)

- **Audio System**
  - Tone.js polyphonic sampler integration
  - 6-voice polyphony for simultaneous notes
  - High-quality acoustic guitar samples
  - Dynamic velocity-to-volume mapping
  - Note transposition algorithm
  - Multiple tuning presets:
    - Standard E
    - Drop D
    - DADGAD
    - Half Step Down
    - Open G

- **Chord Recognition**
  - Real-time chord detection from fret patterns
  - Library of 20+ common chords:
    - Major chords (E, F, G, A, B, C, D)
    - Minor chords (Em, Fm, Gm, Am, Bm, Cm, Dm)
    - Seventh chords (E7, A7, D7, G7, C7)
    - Power chords (E5, A5, D5)
  - Visual chord display

- **User Interface**
  - Mirrored video feed for intuitive hand positioning
  - High-fidelity 2D guitar rendering
  - Real-time FPS counter
  - Control panel with:
    - Tuning selector
    - Sensitivity slider
    - Strum threshold adjustment
    - Calibration button (planned)
  - Visual feedback:
    - Hand landmarks with skeleton connections
    - Active string highlighting
    - Radial hitbox visualization
    - Chord name display

- **Performance Optimizations**
  - 60 FPS rendering with requestAnimationFrame
  - Object pooling to minimize garbage collection
  - Efficient spatial collision detection
  - Separate canvas layers for selective redrawing

- **Documentation**
  - Comprehensive README with feature overview
  - Technical architecture documentation (TECHNICAL.md)
  - Quick start guide (QUICKSTART.md)
  - Interactive demo page (demo.html)
  - Advanced configuration file (config.js)
  - Inline code comments and JSDoc

- **Developer Tools**
  - Debug mode with FPS and velocity display
  - Console logging for note events
  - Browser console debugging support
  - Package.json with server scripts

### Technical Details

#### Architecture
- **Canvas Resolution**: 1280x720
- **Frame Rate**: 60 FPS target
- **Latency**: < 150ms end-to-end
- **Hand Tracking**: 21 3D landmarks per hand
- **Collision Detection**: Radial hitbox (25px radius)
- **Pinch Threshold**: 0.08 normalized units
- **Strum Threshold**: 0.3 pixels/frame
- **Percussion Threshold**: 15 acceleration units

#### Dependencies
- MediaPipe Hands (v0.4+)
- Tone.js (v14.8.49)
- Modern browser with WebRTC support

#### Browser Support
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+ (limited testing)

### Known Issues
- [ ] Occasional hand tracking loss in low light
- [ ] Minor latency on slower machines
- [ ] Chord detection requires precise finger positioning
- [ ] No mobile device support yet

### Future Roadmap
See [ROADMAP.md] for planned features.

---

## [0.9.0] - 2026-02-20 (Internal Beta)

### Added
- Initial MediaPipe integration
- Basic guitar rendering
- Prototype collision detection
- Simple audio playback

### Changed
- Refactored rendering pipeline
- Improved hand classification logic

---

## [0.5.0] - 2026-02-15 (Prototype)

### Added
- Proof of concept
- Basic hand tracking
- Single-note playback

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-02-25 | Initial public release |
| 0.9.0 | 2026-02-20 | Internal beta testing |
| 0.5.0 | 2026-02-15 | Initial prototype |

---

## Release Notes Format

Each release will include:
- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

---

## Contributing to Changelog

When contributing, please update this changelog with:
1. Version number (following semver)
2. Release date
3. Clear description of changes
4. Category (Added/Changed/Fixed/etc.)

---

**Note**: This is a living document. Check back regularly for updates!
