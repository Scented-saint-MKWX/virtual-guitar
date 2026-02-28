/**
 * Advanced Configuration File
 * Customize these parameters to fine-tune the Virtual Air Guitar
 * 
 * Copy this file to 'config.custom.js' to override defaults
 */

const GUITAR_CONFIG = {
    // Canvas dimensions
    display: {
        width: 1280,
        height: 720,
        videoMirror: true  // Mirror video feed for intuitive hand positioning
    },

    // MediaPipe hand tracking settings
    mediaPipe: {
        maxNumHands: 2,
        modelComplexity: 1,        // 0 (fastest) to 1 (most accurate)
        minDetectionConfidence: 0.7,  // 0.0 to 1.0
        minTrackingConfidence: 0.6    // 0.0 to 1.0
    },

    // Guitar layout and positioning
    guitar: {
        position: {
            x: 100,                 // X offset from left edge
            yPercent: 0.65,         // Y position as percentage of height (0.65 = bottom 1/3)
        },
        dimensions: {
            width: 1080,
            height: 240,
            neckWidth: 700,         // Fretboard width
            bodyWidth: 380          // Guitar body width
        },
        frets: {
            count: 12,              // Number of frets
            spacing: 'linear'       // 'linear' or 'geometric' (future)
        },
        strings: {
            count: 6,
            spacing: 'even'         // Even spacing between strings
        }
    },

    // Collision detection parameters
    collision: {
        fingerRadius: 25,           // Radial hitbox size (pixels) for multi-string detection
        pinchThreshold: 0.08,       // 3D distance threshold for "press" detection (0.0-1.0)
        strumThreshold: 0.3,        // Velocity threshold for strumming (pixels/frame)
        percussionThreshold: 15,    // Wrist jerk threshold for percussion
        crossingTolerance: 15       // String crossing detection tolerance (pixels)
    },

    // Audio settings
    audio: {
        polyphony: 6,               // Maximum simultaneous notes
        sustainTime: 1.5,           // Note sustain/release time (seconds)
        masterVolume: 0.8,          // Master volume (0.0-1.0)
        sampleBaseURL: 'https://tonejs.github.io/audio/salamander/',
        
        // Available tunings
        tunings: {
            standard: {
                name: 'Standard E',
                notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
            },
            dropD: {
                name: 'Drop D',
                notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4']
            },
            dadgad: {
                name: 'DADGAD',
                notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']
            },
            halfStep: {
                name: 'Half Step Down',
                notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4']
            },
            openG: {
                name: 'Open G',
                notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4']
            }
        },
        defaultTuning: 'standard'
    },

    // Visual rendering settings
    rendering: {
        // Guitar colors
        colors: {
            neckFill: 'rgba(139, 69, 19, 0.7)',      // Saddle brown
            bodyFill: 'rgba(101, 67, 33, 0.7)',      // Darker brown
            soundHole: 'rgba(0, 0, 0, 0.6)',         // Black
            fretMarker: 'rgba(255, 255, 255, 0.3)',  // White
            
            strings: {
                inactive: 'rgba(200, 200, 200, 0.8)', // Light gray
                active: 'rgba(74, 222, 128, 0.9)'     // Green
            },
            
            hands: {
                landmark: 'rgba(0, 255, 255, 0.7)',   // Cyan
                fingertip: 'rgba(255, 255, 0, 0.9)',  // Yellow
                connection: 'rgba(0, 255, 255, 0.5)', // Cyan (transparent)
                hitbox: 'rgba(74, 222, 128, 0.5)'     // Green (transparent)
            }
        },
        
        // Line widths
        lineWidths: {
            fret: 3,
            stringInactive: 2,
            stringActive: 4,
            handConnection: 2,
            hitbox: 2
        },
        
        // Feature toggles
        showDebugInfo: true,        // Show FPS, hand status, velocity
        showHitboxes: true,         // Show radial hitboxes when pressing
        showFretMarkers: true,      // Show fret position markers
        showStringLabels: true      // Show note names next to strings
    },

    // Performance settings
    performance: {
        targetFPS: 60,
        enableObjectPooling: true,  // Reuse objects to reduce GC
        maxFrameTime: 33,           // Maximum frame time (ms) before throttling
        gcInterval: 5000            // Manual GC hint interval (ms) (experimental)
    },

    // Chord library (can be extended)
    chords: {
        // Format: [String 6, 5, 4, 3, 2, 1] (Low E to High E)
        // -1 = any/muted, 0 = open, 1+ = fret number
        library: {
            // Major chords
            'E Major': [0, 2, 2, 1, 0, 0],
            'F Major': [1, 3, 3, 2, 1, 1],
            'G Major': [3, 2, 0, 0, 0, 3],
            'A Major': [-1, 0, 2, 2, 2, 0],
            'B Major': [-1, 2, 4, 4, 4, 2],
            'C Major': [-1, 3, 2, 0, 1, 0],
            'D Major': [-1, -1, 0, 2, 3, 2],
            
            // Minor chords
            'E Minor': [0, 2, 2, 0, 0, 0],
            'F Minor': [1, 3, 3, 1, 1, 1],
            'G Minor': [3, 5, 5, 3, 3, 3],
            'A Minor': [-1, 0, 2, 2, 1, 0],
            'B Minor': [-1, 2, 4, 4, 3, 2],
            'C Minor': [-1, 3, 5, 5, 4, 3],
            'D Minor': [-1, -1, 0, 2, 3, 1],
            
            // Seventh chords
            'E7': [0, 2, 0, 1, 0, 0],
            'A7': [-1, 0, 2, 0, 2, 0],
            'D7': [-1, -1, 0, 2, 1, 2],
            'G7': [3, 2, 0, 0, 0, 1],
            'C7': [-1, 3, 2, 3, 1, 0],
            
            // Power chords (rock)
            'E5': [0, 2, 2, -1, -1, -1],
            'A5': [-1, 0, 2, 2, -1, -1],
            'D5': [-1, -1, 0, 2, 3, -1]
        }
    },

    // Experimental features
    experimental: {
        enableVibrato: false,       // Detect finger vibrato (future)
        enableBends: false,         // Detect string bends (future)
        enableSlides: false,        // Detect finger slides (future)
        enableHammerOns: false,     // Detect hammer-ons (future)
        enablePalmMuting: false,    // Detect palm muting (future)
        mlChordRecognition: false   // Use ML for chord detection (future)
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GUITAR_CONFIG;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.GUITAR_CONFIG = GUITAR_CONFIG;
}
