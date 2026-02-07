// ===================
// Graphics / Gameplay Config  (GFX)
// ===================
// Central place to tweak every visual and gameplay attribute.
//
// Rendering uses LittleJS's native tile system:
//   tileIndex  – index into the spritesheet (-1 = solid color, no sprite)
//   tileSize   – source pixel size on the sheet (default 16×16)
//   color      – Color tint when using a sprite, or solid fill when tileIndex=-1
//   size       – world-unit size (1 = one tile = cameraScale pixels)

const GFX = {
    player: {
        tileIndex: 0,                               // idle sprite
        walkFrame: 1,                               // walk animation frame
        tileSize:  vec2(16),
        color:     new Color(1, 0.2, 0.2, 1),        // red (used for facing dots)
        drawSize:  vec2(1.25, 1.25),                      // 2× sprite dilation
        size:      vec2(0.5, 0.5),
        speed:     0.06,
        damping:   0.85,                            // velocity friction per frame
        velSmoothing: 0.6,                          // lerp weight for old velocity
        facing: {
            dotLen:  0.3,
            gapLen:  0.25,
            reach:   4,
            width:   .12,
            alpha:   .8,
        },
    },

    gun: {
        tileIndex: 7,                               // gun sprite
        tileSize:  vec2(16),
        size:      vec2(0.8, 0.8),                  // draw size in world units (2× to match player)
        offset:    0.1,                            // extra padding beyond player edge
        enemyOffset: 0.1,                          // extra padding beyond enemy edge (wider)
        centerOffset: vec2(0.4, 0.3),              // tip offset from sprite center: x=forward (along barrel), y=up (perp)
        perpDrop:  0.1,                            // perpendicular offset — shifts gun "below" barrel axis
    },

    bullet: {
        tileIndex: -1,
        tileSize:  vec2(16),
        color:     new Color(0.05, 0.05, 0.05, 1),
        size:      vec2(0.15, 0.15),
        speed:     12,
        life:      2,
        trail: {
            color:  new Color(0.05, 0.05, 0.05, 0.3),
            width:  .12,
            maxPts: 12,
            fade:   3,
        },
        homing: {
            perpWeight:   2,                        // perpendicular distance weight
            distWeight:   0.5,                      // forward distance weight
            rangeMin:     4,                        // strength starts fading here
            rangeFalloff: 4,                        // fades over this distance
            maxStrength:  0.025,                    // max curve per frame
        },
    },

    turret: {
        tileIndex:   2,
        tileSize:    vec2(16),
        color:       new Color(1, 0.35, 0.1, 1),
        drawSize:    vec2(1.25, 1.25),
        size:        vec2(0.72, 0.72),
        fireRate:    1.5,
        guideLen:    2.2,
        guideColor:  new Color(1, 0.35, 0.1, 0.5),
    },

    turretBullet: {
        tileIndex: -1,
        tileSize:  vec2(16),
        size:      vec2(0.22, 0.22),
        speed:     8,
        life:      5,
        color:     new Color(1, 0.2, 0, 1),
        trail: { color: new Color(1, 0.35, 0.1, .4) },
    },

    bossBullet: {
        tileIndex: -1,
        tileSize:  vec2(16),
        size:      vec2(0.22, 0.22),
        speed:     8,
        life:      2,
        color:     new Color(0.3, 0.85, 0.15, 1),
        trail:     { color: new Color(0.3, 0.85, 0.15, .3) },
    },

    boss: {
        tileIndex: 4,                               // boss frame 1
        frames:    [5, 6],                          // additional anim frames
        tileSize:  vec2(16),
        color:     new Color(0.9, 0.2, 0.2, 1),    // red (used for rain bullets)
        drawSize:  vec2(3, 3),                  // 4× sprite dilation
        size:      vec2(1.4, 1.4),
        hp:        12,
        fireRate:  1.8,
        dashSpeed: 0.10,                            // reduced from 0.25
        moveSpeed: 0.012,                           // ~1/3 of enemy walkSpeed (0.035)
        attacks: {
            rageSpeedScale: 1.5,
            flashMs:        80,
            machinegun: {
                arcOffset:   0.6,
                sweepArc:    1.8,
                interval:    0.12,
                baseBullets: 10,
                rageBullets: 8,
            },
            dash: {
                duration:       0.2,                // reduced from 0.4 — shorter lunge
                returnDuration: 0.6,
                returnSpeed:    0.06,
                shotgunCount:   7,
                shotgunSpread:  0.4,
            },
            sideRain: {
                interval:   0.3,
                baseWaves:  6,
                rageWaves:  6,
                speedMin:   4,
                speedRange: 2,
                spread:     0.7,
            },
        },
    },
};

const _F=s=>'bold '+s+'px Arial,sans-serif';

// ===================
// Engine
// ===================
const ENGINE = {
    canvasSize:  vec2(1280, 720),                   // landscape mobile
    cameraScale: 36,                            
    font:        "'Courier New',Courier,monospace",
};

// ===================
// Gameplay Tuning
// ===================
const GAMEPLAY = {
    reloadTime:           1.0,                        // seconds between shots
    slowMotion:           0.05,                     // timeScale when standing still
    moveThreshold:        0.01,                     // velocity above this = "moving"
    cameraSmoothing:      0.12,                     // lerp factor for camera follow
    levelTransitionDelay: 0.6,                      // seconds before next level
};

// ===================
// Shooting (player weapons)
// ===================
const SHOOTING = {
    buckshotSpread: 0.21,                           // ±radians for 3-bullet fan
    burstCount:     3,                              // bullets per burst
    burstDelay:     0.08,                           // seconds between burst bullets
};

// ===================
// Enemy Behaviour
// ===================
const ENEMY = {
    walkSpeed:      0.035,                          // world-units per tick
    repathInterval: 0.35,                           // seconds between BFS recalcs
    arriveDist:     1.2,                            // stop approaching when this close
    waypointSnap:   0.15,                           // waypoint reached threshold
};

// ===================
// Input / Joystick
// ===================
const INPUT = {
    joystickRadius: 60,                             // max knob distance (screen px)
    joystickDead:   8,                              // dead-zone radius (screen px)
    knobRatio:      0.35,                           // knob radius / base radius
    moveBaseColor:  new Color(1, 1, 1, .15),
    moveBaseStroke: new Color(1, 1, 1, .3),
    moveKnobColor:  new Color(1, 1, 1, .45),
    aimBaseColor:   new Color(.8, .15, .1, .25),
    aimBaseStroke:  new Color(.9, .2, .15, .55),
    aimKnobColor:   new Color(.85, .15, .1, .7),
};

// ===================
// HUD Layout
// ===================
const HUD = {
    bossBar: {
        width:      500,
        height:     18,
        y:          18,
        padding:    2,
    },
};

// ===================
// Screens & UI Layout
// ===================
const SCREENS = {
    intro: {
        duration:      2.8,                         // total intro length (s)
        zoomEnd:       1.8,                         // zoom-in phase ends here
        sizeMin:       10,                          // starting font size
        sizeMax:       120,                         // ending font size
        letterSpacing: '8px',
    },
    title: {
        titleSize:       80,
        titleOffsetY:    -80,
        titleSpacing:    '8px',
        btnWidth:        200,
        btnHeight:       60,
        btnOffsetY:      90,
        btnRadius:       12,
        btnColor:        new Color(1, .35, .25, .9),
        playSize:        36,
    },
    powerup: {
        cardWidth:       220,
        cardHeight:      200,
        cardGap:         40,
        cardOffsetY:     20,
        cardRadius:      14,
        headerSize:      40,
        headerY:         60,
        headerSpacing:   '6px',
        descSize:        14,
        descOffsetY:     145,
        hintSize:        14,
        hintPadBottom:   20,
        animStagger:     0.1,
        animFade:        0.3,
        animSlide:       30,
        selectedBg:      new Color(.35, .9, .35, .6),
        hoverBg:         new Color(.5, .5, .6, .55),
        defaultBg:       new Color(.22, .22, .3, .85),
        selectedBorder:  new Color(.6, 1, .6, 1),
        defaultBorder:   new Color(.7, .7, .8, .75),
        selectedBorderW: 4,
        defaultBorderW:  2.5,
        selectDelay:     400,                       // ms before transition
    },
};

// ===================
// Particles
// ===================
const PARTICLES = {
    shot: {
        emitSize:       0.1,
        emitTime:       0.3,
        emitRate:       120,
        emitConeAngle:  0.1,
        tileIndex:      -1,
        tileSize:       vec2(16),
        colorStartA:    new Color(1, 0.965, 0.784, 1),
        colorStartB:    new Color(1, 0.82, 0.4, 1),
        colorEndA:      new Color(1, 0.549, 0.259, 0),
        colorEndB:      new Color(1, 0.549, 0.259, 0),
        particleTime:   0.5,
        sizeStart:      0.25,
        sizeEnd:        0.1,
        speed:          0.05,
        angleSpeed:     0.05,
        damping:        0.9,
        angleDamping:   1,
        gravityScale:   0,
        particleCone:   0,
        fadeRate:        0.25,
        randomness:     0,
        collideTiles:   1,
        additive:       1,
        offset:         1.0,       // distance along dir to shift emitter from pos
    },
    death: {
        emitSize:       1,
        emitTime:       0.1,
        emitRate:       80,
        emitConeAngle:  3.14,
        tileIndex:      -1,
        tileSize:       vec2(16),
        colorStartA:    new Color(1, 0.863, 0.627, 1),
        colorStartB:    new Color(1, 0.863, 0.627, 1),
        colorEndA:      new Color(0.627, 0.471, 0.314, 0),
        colorEndB:      new Color(0.627, 0.471, 0.314, 0),
        particleTime:   0.25,
        sizeStart:      0.35,
        sizeEnd:        0.1,
        speed:          0.4,
        angleSpeed:     0.11,
        damping:        0.75,
        angleDamping:   0.92,
        gravityScale:   0.4,
        particleCone:   3.14,
        fadeRate:        0.3,
        randomness:     0.25,
        collideTiles:   0,
        additive:       1,
    },
};

const MUSIC_FILE = [
    [   // instruments
        [,0,77,,,.7,2,.41,,,,,,,,.06],
        [,0,43,.01,,.3,2,,,,,,,,,.02,.01],
        [,0,170,.003,,.008,,.97,-35,53,,,,,,.1],
        [.8,0,270,,,.12,3,1.65,-2,,,,,4.5,,.02],
        [,0,86,,,,,.7,,,,.5,,6.7,1,.05],
        [,0,41,,.05,.4,2,0,,,9,.01,,,,.08,.02],
        [,0,2200,,,.04,3,2,,,800,.02,,4.8,,.01,.1],
        [.3,0,16,,,.3,3],
    ],
    [   // patterns
        [   // pattern 0
            [1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],
            [3,1,22,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,24,,,,,,,,,,,,,,,,,,,,,,,,22,,22,,22,,,,],
            [5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],
            [,1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],
        ],
        [   // pattern 1
            [1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],
            [3,1,24,,,,,,,,27,,,,,,,,,,,,,,,,27,,,,24,,,,24,,,,,,,,27,,,,,,,,,,,,,,,,24,,24,,24,,,,],
            [5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],
            [,1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],
            [6,1,,,34,34,34,,,,,,34,34,,,,,34,,,,34,34,,,,,34,,,,34,,,,34,34,34,,,,,,34,,,,,,34,34,,,34,34,,,,,,,,,34,34],
            [4,1,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,],
        ],
        [   // pattern 2
            [1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,23,23,35,23,23,36,23,23,35,23,23,36,23,23,35,35,23,23,35,23,23,35,23,23,36,23,23,35,23,23,36,36],
            [5,-1,21,,,19,,,21,,,,,,,,,,21,,,19,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
            [3,1,24,,,24,,,24,,,,,,,,,,24,,,24,,,24,,,,24.75,24.5,24.26,24.01,24.01,24.01,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],
            [4,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,24.75,24.5,24.26,24.01,24.01,24.01,24.01,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],
            [7,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,23,,21,23,,35,,23,,21,23,,35,,35,,23,,21,23,,35,,21,23,,35,,21,23,,,],
            [6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,36,34,,33,34,34,36,31,36,34,,31,34,32,,33,36,34,,31,34,34,36,33,36,33,,31,,,],
        ],
        [   // pattern 3
            [1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29],
            [4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],
            [7,-1,21,,19,21,,33,,21,,19,21,,33,,33,,21,,19,21,,33,,21,,19,21,,33,,33,,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29],
            [2,1,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,],
            [6,1,,,36,,,,,,36,,36,,,,,,,,36,,,,,,36,,36,,,,,,,,36,,,,,,,,,,,,,,,,36,,,,,,36,,36,,,,,,],
            [3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,25,,,25,,,,,,,,25,,,,,,,,25,25,25,25],
        ],
        [   // pattern 4
            [1,-1,14,14,26,14,14,26,14,14,26,14,14,26,14,14,26,26,14,14,26,14,14,26,14,14,26,14,14,26,14,14,26,26,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,19,19,31,19,19,31,19,19,31,19,19,31,19,19,31,31],
            [4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,36,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],
            [7,-1,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,19,,19,19,31,19,19,31,19,,19,19,31,19,19,31],
            [2,1,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,],
            [3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],
            [6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,,,,,,34,,34,,,,,,,,34,,,,,,34,,34,,,,,,],
        ],
    ],
    [0,1,1,2,3,4,4],  // sequence
];