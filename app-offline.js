/**
 * Virtual Air Guitar - Advanced Computer Vision + Web Audio
 * Senior Embedded Systems Engineer Implementation
 * 
 * Architecture:
 * - MediaPipe Hands for landmark detection
 * - Tone.js for polyphonic audio synthesis
 * - Three-layer canvas rendering system
 * - Advanced collision detection with radial hitboxes
 */

class VirtualAirGuitar {
    constructor() {
        // Canvas layers
        this.videoCanvas = document.getElementById('video-canvas');
        this.guitarCanvas = document.getElementById('guitar-canvas');
        this.handsCanvas = document.getElementById('hands-canvas');
        
        this.videoCtx = this.videoCanvas.getContext('2d');
        this.guitarCtx = this.guitarCanvas.getContext('2d');
        this.handsCtx = this.handsCanvas.getContext('2d');

        // Canvas dimensions
        this.width = 1280;
        this.height = 720;

        // MediaPipe
        this.hands = null;
        this.camera = null;
        this.results = null;

        // Hand tracking data (reuse objects to minimize GC)
        this.fretting = {
            hand: null,
            landmarks: [],
            fingertips: [4, 8, 12, 16, 20], // Thumb, Index, Middle, Ring, Pinky
            thumb: null,
            palmBase: null
        };

        this.strumming = {
            hand: null,
            landmarks: [],
            indexTip: null,
            wrist: null,
            prevIndexY: 0,
            prevWristAccel: 0,
            velocity: 0
        };

        // Guitar configuration
        this.guitar = {
            x: 100,
            y: this.height * 0.65, // Bottom 1/3rd of frame
            width: 1080,
            height: 240,
            neckWidth: 700,
            bodyWidth: 380,
            numFrets: 12,
            numStrings: 6,
            strings: [],
            frets: [],
            bodyZone: null
        };

        // Collision detection parameters
        this.collision = {
            fingerRadius: 25, // Radial hitbox for multi-string detection
            pinchThreshold: 0.08, // Normalized distance threshold
            strumThreshold: 0.3, // Velocity threshold
            percussionThreshold: 15, // Wrist jerk threshold
            activeStrings: new Set(),
            frettedPositions: new Map() // Map<stringIndex, fretIndex>
        };

        // Audio configuration
        this.audio = {
            sampler: null,
            initialized: false,
            tunings: {
                standard: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
                dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
                dadgad: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
                halfStep: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4']
            },
            currentTuning: 'standard',
            stringNotes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
        };

        // Chord detection
        this.chords = {
            current: '--',
            library: this.initChordLibrary()
        };

        // Performance tracking
        this.perf = {
            fps: 0,
            lastTime: performance.now(),
            frameCount: 0,
            deltaTime: 0
        };

        // Settings
        this.settings = {
            sensitivity: 5,
            strumThreshold: 0.3,
            showDebug: true
        };

        this.init();
    }

    async init() {
        console.log('🎸 Initializing Virtual Air Guitar...');
        
        // Initialize UI handlers
        this.initUIHandlers();
        
        // Initialize audio engine
        await this.initAudioEngine();
        
        // Initialize MediaPipe Hands
        await this.initMediaPipe();
        
        // Initialize guitar layout
        this.initGuitarLayout();
        
        // Start render loop
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        document.getElementById('status').textContent = '✓ Ready to Rock!';
    }

    async initAudioEngine() {
        console.log('🔊 Initializing Tone.js Audio Engine...');
        
        // Create polyphonic sampler with 6-voice polyphony
        this.audio.sampler = new Tone.Sampler({
            urls: {
                'E2': 'E2.mp3',
                'A2': 'A2.mp3',
                'D3': 'D3.mp3',
                'G3': 'G3.mp3',
                'B3': 'B3.mp3',
                'E4': 'E4.mp3'
            },
            release: 1.5,
            baseUrl: 'https://tonejs.github.io/audio/salamander/',
            onload: () => {
                console.log('✓ Audio samples loaded');
                this.audio.initialized = true;
            }
        }).toDestination();

        // Set polyphony to 6 for simultaneous string playback
        this.audio.sampler.options.polyphony = 6;
    }

    async initMediaPipe() {
        console.log('👐 Initializing MediaPipe Hands...');
        
        this.hands = new Hands({
            locateFile: (file) => {
                return `libs/mediapipe/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.6
        });

        this.hands.onResults((results) => {
            this.results = results;
            this.processHands(results);
        });

        // Initialize camera
        const video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);

        this.camera = new Camera(video, {
            onFrame: async () => {
                await this.hands.send({ image: video });
            },
            width: this.width,
            height: this.height
        });

        this.camera.start();
        console.log('✓ Camera started');
    }

    initGuitarLayout() {
        const g = this.guitar;
        const fretSpacing = g.neckWidth / g.numFrets;
        const stringSpacing = g.height / (g.numStrings + 1);

        // Initialize strings (y-positions)
        for (let i = 0; i < g.numStrings; i++) {
            this.guitar.strings.push({
                index: i,
                y: g.y + stringSpacing * (i + 1),
                note: this.audio.stringNotes[i]
            });
        }

        // Initialize frets (x-positions)
        for (let i = 0; i <= g.numFrets; i++) {
            this.guitar.frets.push({
                index: i,
                x: g.x + fretSpacing * i
            });
        }

        // Define body zone for percussion detection
        this.guitar.bodyZone = {
            x: g.x + g.neckWidth,
            y: g.y,
            width: g.bodyWidth,
            height: g.height
        };
    }

    initUIHandlers() {
        // Tuning selector
        document.getElementById('tuning-select').addEventListener('change', (e) => {
            this.audio.currentTuning = e.target.value;
            this.audio.stringNotes = this.audio.tunings[e.target.value];
            // Update string notes
            for (let i = 0; i < this.guitar.strings.length; i++) {
                this.guitar.strings[i].note = this.audio.stringNotes[i];
            }
            console.log(`🎵 Tuning changed to: ${e.target.value.toUpperCase()}`);
        });

        // Sensitivity slider
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            this.settings.sensitivity = parseInt(e.target.value);
            document.getElementById('sensitivity-value').textContent = e.target.value;
        });

        // Strum threshold slider
        document.getElementById('strum-threshold').addEventListener('input', (e) => {
            this.settings.strumThreshold = parseFloat(e.target.value);
            this.collision.strumThreshold = this.settings.strumThreshold;
            document.getElementById('strum-value').textContent = e.target.value;
        });

        // Calibrate button
        document.getElementById('calibrate-btn').addEventListener('click', () => {
            this.calibratePosition();
        });
    }

    calibratePosition() {
        console.log('🎯 Calibrating guitar position...');
        // Future: Allow user to adjust guitar position
        alert('Calibration feature - Future implementation');
    }

    processHands(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            return;
        }

        // Reset hand data
        this.fretting.hand = null;
        this.strumming.hand = null;

        // Assign hands based on position (left = fretting, right = strumming)
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const landmarks = results.multiHandLandmarks[i];
            const handedness = results.multiHandedness[i].label;
            
            // Calculate hand center x-position
            const handCenterX = landmarks[9].x * this.width;

            if (handCenterX < this.width / 2) {
                // Left side = Fretting hand
                this.fretting.hand = handedness;
                this.fretting.landmarks = landmarks;
                this.updateFrettingData(landmarks);
            } else {
                // Right side = Strumming hand
                this.strumming.hand = handedness;
                this.strumming.landmarks = landmarks;
                this.updateStrummingData(landmarks);
            }
        }

        // Process collision detection
        this.detectFretCollisions();
        this.detectStrumming();
        this.detectPercussion();
    }

    updateFrettingData(landmarks) {
        // Store thumb position for pinch detection
        this.fretting.thumb = {
            x: landmarks[4].x * this.width,
            y: landmarks[4].y * this.height,
            z: landmarks[4].z
        };

        // Store palm base
        this.fretting.palmBase = {
            x: landmarks[0].x * this.width,
            y: landmarks[0].y * this.height,
            z: landmarks[0].z
        };
    }

    updateStrummingData(landmarks) {
        // Index fingertip (landmark 8)
        const currentIndexY = landmarks[8].y * this.height;
        
        this.strumming.indexTip = {
            x: landmarks[8].x * this.width,
            y: currentIndexY,
            z: landmarks[8].z
        };

        // Calculate velocity (change in Y position)
        this.strumming.velocity = Math.abs(currentIndexY - this.strumming.prevIndexY);
        this.strumming.prevIndexY = currentIndexY;

        // Wrist position for percussion
        this.strumming.wrist = {
            x: landmarks[0].x * this.width,
            y: landmarks[0].y * this.height,
            z: landmarks[0].z
        };
    }

    detectFretCollisions() {
        if (!this.fretting.hand || !this.fretting.landmarks) {
            this.collision.activeStrings.clear();
            this.collision.frettedPositions.clear();
            return;
        }

        this.collision.activeStrings.clear();
        this.collision.frettedPositions.clear();

        const landmarks = this.fretting.landmarks;
        const thumb = this.fretting.thumb;

        // Check each fingertip
        for (const tipIndex of this.fretting.fingertips) {
            const tip = {
                x: landmarks[tipIndex].x * this.width,
                y: landmarks[tipIndex].y * this.height,
                z: landmarks[tipIndex].z
            };

            // Pinch detection - is finger pressing down?
            const distanceToThumb = this.calculateDistance3D(tip, thumb);
            const isPinching = distanceToThumb < this.collision.pinchThreshold;

            if (!isPinching) continue;

            // Find which fret this finger is on
            let fretIndex = -1;
            for (let i = 0; i < this.guitar.frets.length - 1; i++) {
                const fret = this.guitar.frets[i];
                const nextFret = this.guitar.frets[i + 1];
                
                if (tip.x >= fret.x && tip.x < nextFret.x) {
                    fretIndex = i;
                    break;
                }
            }

            if (fretIndex === -1) continue;

            // Radial hitbox detection - check all strings within radius
            for (const string of this.guitar.strings) {
                const distance = Math.abs(tip.y - string.y);
                
                if (distance < this.collision.fingerRadius) {
                    this.collision.activeStrings.add(string.index);
                    this.collision.frettedPositions.set(string.index, fretIndex);
                }
            }
        }

        // Update chord detection
        this.detectChord();
    }

    detectStrumming() {
        if (!this.strumming.hand || !this.strumming.indexTip) {
            return;
        }

        const index = this.strumming.indexTip;
        const velocity = this.strumming.velocity;

        // Check if velocity exceeds threshold
        if (velocity < this.collision.strumThreshold) {
            return;
        }

        // Check which strings are being crossed
        for (const string of this.guitar.strings) {
            const crossedString = Math.abs(index.y - string.y) < 15;
            
            if (crossedString) {
                this.playString(string.index, velocity);
            }
        }
    }

    detectPercussion() {
        if (!this.strumming.hand || !this.strumming.wrist) {
            return;
        }

        const wrist = this.strumming.wrist;
        const bodyZone = this.guitar.bodyZone;

        // Check if wrist is in body zone
        const inBodyZone = (
            wrist.x >= bodyZone.x &&
            wrist.x <= bodyZone.x + bodyZone.width &&
            wrist.y >= bodyZone.y &&
            wrist.y <= bodyZone.y + bodyZone.height
        );

        if (!inBodyZone) {
            this.strumming.prevWristAccel = 0;
            return;
        }

        // Calculate acceleration (jerk)
        const currentAccel = this.strumming.velocity;
        const jerk = Math.abs(currentAccel - this.strumming.prevWristAccel);
        this.strumming.prevWristAccel = currentAccel;

        // Trigger kick drum on high jerk
        if (jerk > this.collision.percussionThreshold) {
            this.playPercussion();
        }
    }

    playString(stringIndex, velocity = 1.0) {
        if (!this.audio.initialized) return;

        const string = this.guitar.strings[stringIndex];
        const fretIndex = this.collision.frettedPositions.get(stringIndex) || 0;

        // Calculate note based on fret position
        const baseNote = string.note;
        const note = this.transposeNote(baseNote, fretIndex);

        // Velocity mapping (0.3 -> 1.0 mapped to 0.3 -> 1.0 volume)
        const volume = Math.min(velocity / this.collision.strumThreshold, 1.0) * 0.8;

        // Play with Tone.js
        this.audio.sampler.triggerAttackRelease(note, '0.5', undefined, volume);
        
        console.log(`🎵 String ${stringIndex}: ${note} (Fret ${fretIndex}, Vol ${volume.toFixed(2)})`);
    }

    playPercussion() {
        if (!this.audio.initialized) return;
        
        // Simulate kick drum with low E
        this.audio.sampler.triggerAttackRelease('E1', '0.2', undefined, 0.9);
        console.log('🥁 Percussion hit!');
    }

    transposeNote(baseNote, semitones) {
        const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        const noteMatch = baseNote.match(/([A-G][b#]?)(\d+)/);
        
        if (!noteMatch) return baseNote;
        
        const noteName = noteMatch[1];
        const octave = parseInt(noteMatch[2]);
        
        let noteIndex = notes.indexOf(noteName);
        let newOctave = octave;
        
        noteIndex += semitones;
        
        while (noteIndex >= 12) {
            noteIndex -= 12;
            newOctave++;
        }
        
        while (noteIndex < 0) {
            noteIndex += 12;
            newOctave--;
        }
        
        return notes[noteIndex] + newOctave;
    }

    detectChord() {
        if (this.collision.frettedPositions.size === 0) {
            this.chords.current = '--';
            return;
        }

        // Create fingerprint of current fret positions
        const fingerprint = [];
        for (let i = 0; i < 6; i++) {
            fingerprint.push(this.collision.frettedPositions.get(i) || 0);
        }

        // Match against chord library
        const chordName = this.matchChord(fingerprint);
        this.chords.current = chordName;
    }

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

    initChordLibrary() {
        // Format: [String 6, 5, 4, 3, 2, 1] (Low E to High E)
        // -1 = don't care, 0 = open, 1+ = fret number
        return {
            'E Major': [0, 2, 2, 1, 0, 0],
            'A Major': [-1, 0, 2, 2, 2, 0],
            'D Major': [-1, -1, 0, 2, 3, 2],
            'G Major': [3, 2, 0, 0, 0, 3],
            'C Major': [-1, 3, 2, 0, 1, 0],
            'E Minor': [0, 2, 2, 0, 0, 0],
            'A Minor': [-1, 0, 2, 2, 1, 0],
            'D Minor': [-1, -1, 0, 2, 3, 1]
        };
    }

    calculateDistance3D(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = (p1.z || 0) - (p2.z || 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // ========== RENDERING ==========

    animate() {
        requestAnimationFrame(() => this.animate());

        // Calculate FPS
        const currentTime = performance.now();
        this.perf.deltaTime = currentTime - this.perf.lastTime;
        this.perf.frameCount++;
        
        if (this.perf.deltaTime >= 1000) {
            this.perf.fps = Math.round(this.perf.frameCount * 1000 / this.perf.deltaTime);
            this.perf.frameCount = 0;
            this.perf.lastTime = currentTime;
            document.getElementById('fps').textContent = `FPS: ${this.perf.fps}`;
        }

        this.render();
    }

    render() {
        // Clear all canvases
        this.videoCtx.clearRect(0, 0, this.width, this.height);
        this.guitarCtx.clearRect(0, 0, this.width, this.height);
        this.handsCtx.clearRect(0, 0, this.width, this.height);

        // Layer 1: Render video feed (mirrored)
        this.renderVideoFeed();

        // Layer 2: Render guitar UI
        this.renderGuitar();

        // Layer 3: Render hand landmarks (over guitar)
        this.renderHands();

        // Update chord display
        document.getElementById('chord-display').textContent = this.chords.current;
    }

    renderVideoFeed() {
        if (!this.results || !this.results.image) return;

        // Mirror the video horizontally
        this.videoCtx.save();
        this.videoCtx.scale(-1, 1);
        this.videoCtx.drawImage(this.results.image, -this.width, 0, this.width, this.height);
        this.videoCtx.restore();
    }

    renderGuitar() {
        const ctx = this.guitarCtx;
        const g = this.guitar;

        // Draw guitar neck
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.fillRect(g.x, g.y, g.neckWidth, g.height);

        // Draw frets
        ctx.strokeStyle = 'rgba(192, 192, 192, 0.8)';
        ctx.lineWidth = 3;
        for (const fret of this.guitar.frets) {
            ctx.beginPath();
            ctx.moveTo(fret.x, g.y);
            ctx.lineTo(fret.x, g.y + g.height);
            ctx.stroke();
        }

        // Draw strings
        for (let i = 0; i < this.guitar.strings.length; i++) {
            const string = this.guitar.strings[i];
            const isActive = this.collision.activeStrings.has(i);
            
            ctx.strokeStyle = isActive ? 'rgba(74, 222, 128, 0.9)' : 'rgba(200, 200, 200, 0.8)';
            ctx.lineWidth = isActive ? 4 : 2;
            
            ctx.beginPath();
            ctx.moveTo(g.x, string.y);
            ctx.lineTo(g.x + g.neckWidth, string.y);
            ctx.stroke();

            // String labels
            ctx.fillStyle = 'white';
            ctx.font = '12px monospace';
            ctx.fillText(string.note, g.x - 30, string.y + 4);
        }

        // Draw guitar body
        const body = this.guitar.bodyZone;
        ctx.fillStyle = 'rgba(101, 67, 33, 0.7)';
        ctx.fillRect(body.x, body.y, body.width, body.height);
        
        // Draw sound hole
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(body.x + body.width / 2, body.y + body.height / 2, 40, 0, Math.PI * 2);
        ctx.fill();

        // Fret markers
        const markers = [3, 5, 7, 9, 12];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (const marker of markers) {
            if (marker < this.guitar.frets.length) {
                const fret = this.guitar.frets[marker];
                const prevFret = this.guitar.frets[marker - 1];
                const markerX = (fret.x + prevFret.x) / 2;
                ctx.beginPath();
                ctx.arc(markerX, g.y + g.height / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    renderHands() {
        if (!this.results || !this.results.multiHandLandmarks) return;

        const ctx = this.handsCtx;

        for (const landmarks of this.results.multiHandLandmarks) {
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                [0, 5], [5, 6], [6, 7], [7, 8], // Index
                [0, 9], [9, 10], [10, 11], [11, 12], // Middle
                [0, 13], [13, 14], [14, 15], [15, 16], // Ring
                [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
                [5, 9], [9, 13], [13, 17] // Palm
            ];

            for (const [start, end] of connections) {
                const startLm = landmarks[start];
                const endLm = landmarks[end];
                
                ctx.beginPath();
                ctx.moveTo(this.width - startLm.x * this.width, startLm.y * this.height);
                ctx.lineTo(this.width - endLm.x * this.width, endLm.y * this.height);
                ctx.stroke();
            }

            // Draw landmarks
            for (let i = 0; i < landmarks.length; i++) {
                const lm = landmarks[i];
                const x = this.width - lm.x * this.width;
                const y = lm.y * this.height;

                // Fingertips highlighted
                const isFingertip = [4, 8, 12, 16, 20].includes(i);
                ctx.fillStyle = isFingertip ? 'rgba(255, 255, 0, 0.9)' : 'rgba(0, 255, 255, 0.7)';
                
                ctx.beginPath();
                ctx.arc(x, y, isFingertip ? 8 : 5, 0, Math.PI * 2);
                ctx.fill();

                // Draw radial hitbox for fingertips on fretting hand
                if (isFingertip && this.fretting.landmarks === landmarks) {
                    const thumb = this.fretting.thumb;
                    const tip = { x: lm.x * this.width, y: lm.y * this.height, z: lm.z };
                    const distanceToThumb = this.calculateDistance3D(tip, thumb);
                    const isPinching = distanceToThumb < this.collision.pinchThreshold;

                    if (isPinching) {
                        ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(x, y, this.collision.fingerRadius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
        }

        // Debug info
        if (this.settings.showDebug) {
            ctx.fillStyle = 'white';
            ctx.font = '12px monospace';
            ctx.fillText(`Fretting Hand: ${this.fretting.hand || 'None'}`, 10, this.height - 60);
            ctx.fillText(`Strumming Hand: ${this.strumming.hand || 'None'}`, 10, this.height - 40);
            ctx.fillText(`Velocity: ${this.strumming.velocity.toFixed(2)}`, 10, this.height - 20);
        }
    }
}

// Initialize the application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const app = new VirtualAirGuitar();
    window.app = app; // Expose for debugging
});
