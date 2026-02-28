# Contributing to Virtual Air Guitar

Thank you for considering contributing to Virtual Air Guitar! This document provides guidelines and instructions for contributing.

---

## 🎯 Ways to Contribute

### 1. Report Bugs 🐛
If you find a bug:
- Check if it's already reported in [Issues](https://github.com/yourusername/virtual-air-guitar/issues)
- Create a new issue with:
  - Clear title
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser/OS information
  - Screenshots/videos if applicable

### 2. Suggest Features 💡
Have an idea?
- Check the [Roadmap](ROADMAP.md) first
- Open an issue with:
  - Feature description
  - Use case/benefit
  - Possible implementation approach
  - Visual mockups (optional)

### 3. Submit Code 🔧
Ready to code?
- Pick an issue labeled `good first issue` or `help wanted`
- Comment that you're working on it
- Follow the development setup below
- Submit a Pull Request

### 4. Improve Documentation 📚
Documentation is crucial:
- Fix typos
- Add examples
- Clarify confusing sections
- Translate to other languages

### 5. Test & Provide Feedback 🧪
- Test pre-release versions
- Try edge cases
- Report performance issues
- Suggest UX improvements

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 14+ (for local server)
- Modern browser (Chrome 90+ recommended)
- Webcam
- Git

### Initial Setup
```powershell
# Fork the repository on GitHub first

# Clone your fork
git clone https://github.com/YOUR_USERNAME/virtual-air-guitar.git
cd virtual-air-guitar

# Add upstream remote
git remote add upstream https://github.com/original/virtual-air-guitar.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow
```powershell
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Test your changes
npm start  # Open http://localhost:8080

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## 📝 Coding Standards

### JavaScript Style
- Use ES6+ features (const/let, arrow functions, destructuring)
- No semicolons (ASI style)
- 4 spaces indentation
- Meaningful variable names (no single letters except for loops)
- Add JSDoc comments for functions

#### Good Example
```javascript
/**
 * Calculate 3D distance between two points
 * @param {Object} p1 - First point with x, y, z coordinates
 * @param {Object} p2 - Second point with x, y, z coordinates
 * @returns {number} Distance in pixels
 */
calculateDistance3D(p1, p2) {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const dz = (p1.z || 0) - (p2.z || 0)
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
```

#### Bad Example
```javascript
// ❌ No documentation, unclear names, var usage
function calcDist(a, b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
}
```

### Code Organization
- Group related functions together
- Keep functions focused (single responsibility)
- Extract magic numbers to constants
- Use meaningful section comments

```javascript
// ========== COLLISION DETECTION ==========

const FINGER_RADIUS = 25
const PINCH_THRESHOLD = 0.08

detectFretCollisions() {
    // Implementation
}
```

### Performance Guidelines
- Avoid creating objects in hot loops
- Reuse objects when possible (object pooling)
- Use early returns to skip unnecessary work
- Profile performance-critical sections

```javascript
// ✅ Good: Early return, object reuse
processHands(results) {
    if (!results.multiHandLandmarks) {
        return  // Early exit
    }
    
    // Reuse existing object
    this.strumming.indexTip.x = landmark.x * this.width
    this.strumming.indexTip.y = landmark.y * this.height
}

// ❌ Bad: Always runs, creates new objects
processHands(results) {
    const data = results.multiHandLandmarks || []
    data.forEach(landmark => {
        const tip = { x: landmark.x * width, y: landmark.y * height }  // New object!
        // ...
    })
}
```

---

## 🧪 Testing

### Manual Testing Checklist
Before submitting a PR, test:

- [ ] Hand tracking works in good lighting
- [ ] Hand tracking degrades gracefully in poor lighting
- [ ] Both hands detected and classified correctly
- [ ] Fretting detection accurate on all frets
- [ ] Strumming triggers notes reliably
- [ ] Chord recognition works for common chords
- [ ] Percussion detection triggers kick drum
- [ ] Tuning changes apply correctly
- [ ] FPS stays above 55 (60 target)
- [ ] No console errors
- [ ] Works in Chrome, Edge, Firefox

### Browser Testing
Test your changes in:
- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (if available)

### Performance Testing
Monitor these metrics:
- **FPS**: Should stay at 60 (55+ acceptable)
- **Latency**: From gesture to sound (< 150ms)
- **Memory**: Check for leaks (open DevTools Memory tab)
- **CPU**: Should be < 50% on mid-range CPU

---

## 📋 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build/tooling changes

### Examples
```
feat(audio): add distortion effect

Implemented a waveshaper distortion effect with adjustable drive parameter.
Uses Tone.js Distortion node with custom curve.

Closes #42
```

```
fix(collision): prevent false positives in fret detection

Added minimum confidence threshold to reduce false triggers
when hands move quickly across the fretboard.

Fixes #38
```

```
docs(readme): update installation instructions

Added troubleshooting section and improved clarity
of setup steps.
```

---

## 🔀 Pull Request Process

### Before Submitting
1. ✅ Test your changes thoroughly
2. ✅ Update documentation if needed
3. ✅ Add comments to complex code
4. ✅ Check for console errors
5. ✅ Ensure 60 FPS performance
6. ✅ Test in multiple browsers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- Tested in: Chrome, Edge, Firefox
- FPS: 60
- Manual tests: [list tests performed]

## Screenshots
[If applicable]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex sections
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested thoroughly
```

### Review Process
1. Maintainer reviews your PR
2. Feedback provided (if needed)
3. You address feedback
4. Approved and merged!

---

## 🏗️ Project Structure

```
virtual-air-guitar/
├── index.html          # Main application
├── app.js              # Core application logic
├── config.js           # Configuration file
├── demo.html           # Demo and tutorial page
├── package.json        # Dependencies
├── README.md           # Main documentation
├── QUICKSTART.md       # Quick start guide
├── TECHNICAL.md        # Technical documentation
├── ROADMAP.md          # Future development plans
├── CHANGELOG.md        # Version history
└── CONTRIBUTING.md     # This file
```

### Key Files to Know

**app.js**: Main application class
- `VirtualAirGuitar` class
- MediaPipe integration
- Collision detection
- Audio engine
- Rendering pipeline

**config.js**: Configuration constants
- Adjustable parameters
- Tuning definitions
- Chord library

**index.html**: UI structure
- Canvas layers
- Control panel
- Visual feedback

---

## 🎨 Design Guidelines

### Visual Consistency
- Use the existing color scheme
- Maintain the three-layer canvas system
- Keep UI minimal and non-intrusive
- Ensure high contrast for accessibility

### User Experience
- **Responsive**: UI should respond within 100ms
- **Forgiving**: Allow for hand tracking imperfections
- **Informative**: Provide clear visual feedback
- **Intuitive**: Actions should match real guitar playing

### Accessibility
- High contrast mode support
- Keyboard navigation (where applicable)
- Screen reader friendly (for UI elements)
- Clear error messages

---

## 🐛 Debugging Tips

### Enable Debug Mode
```javascript
// In app.js, set:
this.settings.showDebug = true
```

This displays:
- Hand detection status
- Velocity values
- FPS counter
- Active strings

### Browser DevTools
- **Console**: Check for errors and debug logs
- **Performance**: Profile frame rate and bottlenecks
- **Network**: Monitor sample loading
- **Memory**: Watch for memory leaks

### Common Issues

**Hand not detected**
```javascript
// Check MediaPipe confidence
console.log(results.multiHandedness[0].score)
// Should be > 0.7
```

**Low FPS**
```javascript
// Check frame time
console.log(this.perf.deltaTime)
// Should be ~16ms for 60 FPS
```

**Audio not playing**
```javascript
// Check if sampler loaded
console.log(this.audio.initialized)
// Should be true
```

---

## 🌟 Feature Request Guidelines

### Good Feature Requests Include:

1. **Clear Use Case**
   - Who will use this?
   - What problem does it solve?
   - How often will it be used?

2. **Technical Feasibility**
   - Possible with current tech stack?
   - Performance impact?
   - Browser compatibility?

3. **User Benefit**
   - How does it improve the experience?
   - What's the priority level?
   - Any alternatives considered?

### Example
```markdown
## Feature: Vibrato Detection

**Use Case**: Guitarists want to add expressive pitch modulation to sustained notes.

**Implementation**: 
- Track fingertip oscillation on Y-axis
- Apply pitch LFO when oscillation detected
- Adjustable depth/speed parameters

**Benefit**: 
- More realistic guitar expression
- Matches real guitar technique
- Minimal performance impact (just tracking one point)

**Priority**: Medium (nice-to-have for v1.2)
```

---

## 📖 Documentation Guidelines

### Code Comments
```javascript
// ✅ Good: Explains WHY
// Use radial hitbox instead of point collision
// to detect barre chords where one finger 
// presses multiple strings simultaneously
for (const string of this.guitar.strings) {
    const distance = Math.abs(tip.y - string.y)
    if (distance < this.collision.fingerRadius) {
        // String is within hitbox
    }
}

// ❌ Bad: States the obvious
// Loop through strings
for (const string of this.guitar.strings) {
    // Get distance
    const distance = Math.abs(tip.y - string.y)
    // Check if less than radius
    if (distance < this.collision.fingerRadius) {
        // Do something
    }
}
```

### Markdown Formatting
- Use headers (h1-h6) for hierarchy
- Code blocks with syntax highlighting
- Tables for structured data
- Lists for sequential information
- Bold for emphasis, not ALL CAPS

---

## 🤝 Community Guidelines

### Be Respectful
- Constructive feedback only
- No harassment or discrimination
- Assume good intentions
- Help newcomers

### Be Patient
- Reviews take time
- Not all PRs will be merged
- Discussions may be lengthy
- Learning is a process

### Be Collaborative
- Share knowledge
- Credit others' work
- Accept feedback gracefully
- Celebrate successes together

---

## 📄 Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/yourusername/virtual-air-guitar/discussions)
- Join our [Discord](#) (coming soon)
- Email: your.email@example.com

---

**Thank you for contributing! 🎸🎵**

Every contribution, no matter how small, helps make Virtual Air Guitar better for everyone.
