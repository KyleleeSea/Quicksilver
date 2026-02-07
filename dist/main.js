// @ts-nocheck
/*
    LittleJS - Release Build
    MIT License - Copyright 2021 Frank Force
    
    - This file is used for release builds in place of engineDebug.js
    - Debug functionality will be disabled to lower size and increase performance
*/

'use strict';

const showWatermark = 0;
const godMode = 0;
const debug = 0;
// const debugOverlay = 0;
// const debugPhysics = 0;
// const debugParticles = 0;
// const debugRaycast = 0;
// const debugGamepads = 0;
// const debugMedals = 0;

// debug commands are automatically removed from the final build
// const ASSERT          = ()=> {}
// const debugInit       = ()=> {}
// const debugUpdate     = ()=> {}
// const debugRender     = ()=> {}
// const debugRect       = ()=> {}
// const debugCircle     = ()=> {}
// const debugPoint      = ()=> {}
// const debugLine       = ()=> {}
// const debugAABB       = ()=> {}
// const debugText       = ()=> {}
// const debugClear      = ()=> {}
// const debugSaveCanvas = ()=> {}
/**
 * LittleJS Utility Classes and Functions
 * <br> - General purpose math library
 * <br> - Vector2 - fast, simple, easy 2D vector class
 * <br> - Color - holds a rgba color with some math functions
 * <br> - Timer - tracks time automatically
 * @namespace Utilities
 */

'use strict';

/** A shortcut to get Math.PI
 *  @const
 *  @memberof Utilities */
const PI = Math.PI;

/** Returns absoulte value of value passed in
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const abs = (a)=> a < 0 ? -a : a;

/** Returns lowest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const min = (a, b)=> a < b ?  a : b;

/** Returns highest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const max = (a, b)=> a > b ?  a : b;

/** Returns the sign of value passed in (also returns 1 if 0)
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const sign = (a)=> a < 0 ? -1 : 1;

/** Returns first parm modulo the second param, but adjusted so negative numbers work as expected
 *  @param {Number} dividend
 *  @param {Number} [divisor=1]
 *  @return {Number}
 *  @memberof Utilities */
const mod = (a, b=1)=> ((a % b) + b) % b;

/** Clamps the value beween max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const clamp = (v, min=0, max=1)=> v < min ? min : v > max ? max : v;

/** Returns what percentage the value is between max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const percent = (v, min=0, max=1)=> max-min ? clamp((v-min) / (max-min)) : 0;

/** Linearly interpolates the percent value between max and min
 *  @param {Number} percent
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const lerp = (p, min=0, max=1)=> min + clamp(p) * (max-min);

/** Applies smoothstep function to the percentage value
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const smoothStep = (p)=> p * p * (3 - 2 * p);

/** Returns the nearest power of two not less then the value
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const nearestPowerOfTwo = (v)=> 2**Math.ceil(Math.log2(v));

/** Returns true if two axis aligned bounding boxes are overlapping 
 *  @param {Vector2} pointA  - Center of box A
 *  @param {Vector2} sizeA   - Size of box A
 *  @param {Vector2} pointB  - Center of box B
 *  @param {Vector2} [sizeB] - Size of box B
 *  @return {Boolean}        - True if overlapping
 *  @memberof Utilities */
const isOverlapping = (pA, sA, pB, sB)=> abs(pA.x - pB.x)*2 < sA.x + sB.x & abs(pA.y - pB.y)*2 < sA.y + sB.y;

/** Returns an oscillating wave between 0 and amplitude with frequency of 1 Hz by default
 *  @param {Number} [frequency=1] - Frequency of the wave in Hz
 *  @param {Number} [amplitude=1] - Amplitude (max height) of the wave
 *  @param {Number} [t=time]      - Value to use for time of the wave
 *  @return {Number}              - Value waving between 0 and amplitude
 *  @memberof Utilities */
const wave = (frequency=1, amplitude=1, t=time)=> amplitude/2 * (1 - Math.cos(t*frequency*2*PI));

/** Formats seconds to mm:ss style for display purposes 
 *  @param {Number} t - time in seconds
 *  @return {String}
 *  @memberof Utilities */
// const formatTime = (t)=> (t/60|0)+':'+(t%60<10?'0':'')+(t%60|0);

///////////////////////////////////////////////////////////////////////////////

/** Random global functions
 *  @namespace Random */

/** Returns a random value between the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const rand = (a=1, b=0)=> b + (a-b)*Math.random();

/** Returns a floored random value the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const randInt = (a=1, b=0)=> rand(a,b)|0;

/** Randomly returns either -1 or 1
 *  @return {Number}
 *  @memberof Random */
const randSign = ()=> (rand(2)|0) * 2 - 1;

/** Returns a random Vector2 within a circular shape
 *  @param {Number} [radius=1]
 *  @param {Number} [minRadius=0]
 *  @return {Vector2}
 *  @memberof Random */
const randInCircle = (radius=1, minRadius=0)=> radius > 0 ? randVector(radius * rand(minRadius / radius, 1)**.5) : new Vector2;

/** Returns a random Vector2 with the passed in length
 *  @param {Number} [length=1]
 *  @return {Vector2}
 *  @memberof Random */
const randVector = (length=1)=> new Vector2().setAngle(rand(2*PI), length);

/** Returns a random color between the two passed in colors, combine components if linear
 *  @param {Color}   [colorA=new Color(1,1,1,1)]
 *  @param {Color}   [colorB=new Color(0,0,0,1)]
 *  @param {Boolean} [linear]
 *  @return {Color}
 *  @memberof Random */
const randColor = (cA = new Color, cB = new Color(0,0,0,1), linear)=>
    linear ? cA.lerp(cB, rand()) : new Color(rand(cA.r,cB.r),rand(cA.g,cB.g),rand(cA.b,cB.b),rand(cA.a,cB.a));

/** The seed used by the randSeeded function, should not be 0
 *  @memberof Random */
let randSeed = 1;

/** Returns a seeded random value between the two values passed in using randSeed
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
// const randSeeded = (a=1, b=0)=>
// {
//     randSeed ^= randSeed << 13; randSeed ^= randSeed >>> 17; randSeed ^= randSeed << 5; // xorshift
//     return b + (a-b) * abs(randSeed % 1e9) / 1e9;
// }

///////////////////////////////////////////////////////////////////////////////

/** 
 * Create a 2d vector, can take another Vector2 to copy, 2 scalars, or 1 scalar
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 * @example
 * let a = vec2(0, 1); // vector with coordinates (0, 1)
 * let b = vec2(a);    // copy a into b
 * a = vec2(5);        // set a to (5, 5)
 * b = vec2();         // set b to (0, 0)
 * @memberof Utilities
 */
const vec2 = (x=0, y)=> x.x == undefined ? new Vector2(x, y == undefined? x : y) : new Vector2(x.x, x.y);

/** 
 * 2D Vector object with vector math library
 * <br> - Functions do not change this so they can be chained together
 * @example
 * let a = new Vector2(2, 3); // vector with coordinates (2, 3)
 * let b = new Vector2;       // vector with coordinates (0, 0)
 * let c = vec2(4, 2);        // use the vec2 function to make a Vector2
 * let d = a.add(b).scale(5); // operators can be chained
 */
class Vector2
{
    /** Create a 2D vector with the x and y passed in, can also be created with vec2()
     *  @param {Number} [x=0] - X axis location
     *  @param {Number} [y=0] - Y axis location */
    constructor(x=0, y=0)
    {
        /** @property {Number} - X axis location */
        this.x = x;
        /** @property {Number} - Y axis location */
        this.y = y;
    }

    /** Returns a new vector that is a copy of this
     *  @return {Vector2} */
    copy() { return new Vector2(this.x, this.y); }

    /** Returns a copy of this vector plus the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }

    /** Returns a copy of this vector minus the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    subtract(v) {  return new Vector2(this.x - v.x, this.y - v.y); }

    /** Returns a copy of this vector times the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    multiply(v) {  return new Vector2(this.x * v.x, this.y * v.y); }

    /** Returns a copy of this vector divided by the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    divide(v) {  return new Vector2(this.x / v.x, this.y / v.y); }

    /** Returns a copy of this vector scaled by the vector passed in
     *  @param {Number} scale
     *  @return {Vector2} */
    scale(s) {  return new Vector2(this.x * s, this.y * s); }

    /** Returns the length of this vector
     * @return {Number} */
    length() { return this.lengthSquared()**.5; }

    /** Returns the length of this vector squared
     * @return {Number} */
    lengthSquared() { return this.x**2 + this.y**2; }

    /** Returns the distance from this vector to vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    distance(v) { return this.distanceSquared(v)**.5; }

    /** Returns the distance squared from this vector to vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    distanceSquared(v) { return (this.x - v.x)**2 + (this.y - v.y)**2; }

    /** Returns a new vector in same direction as this one with the length passed in
     * @param {Number} [length=1]
     * @return {Vector2} */
    normalize(length=1) { const l = this.length(); return l ? this.scale(length/l) : new Vector2(0, length); }

    /** Returns a new vector clamped to length passed in
     * @param {Number} [length=1]
     * @return {Vector2} */
    clampLength(length=1) { const l = this.length(); return l > length ? this.scale(length/l) : this; }

    /** Returns the dot product of this and the vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    dot(v) {  return this.x*v.x + this.y*v.y; }

    /** Returns the cross product of this and the vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    //cross(v) {  return this.x*v.y - this.y*v.x; }

    /** Returns the angle of this vector, up is angle 0
     * @return {Number} */
    angle() { return Math.atan2(this.x, this.y); }

    /** Sets this vector with angle and length passed in
     * @param {Number} [angle=0]
     * @param {Number} [length=1] */
    setAngle(a=0, length=1) { this.x = length*Math.sin(a); this.y = length*Math.cos(a); return this; }

    /** Returns copy of this vector rotated by the angle passed in
     * @param {Number} angle
     * @return {Vector2} */
    rotate(a) { const c = Math.cos(a), s = Math.sin(a); return new Vector2(this.x*c-this.y*s, this.x*s+this.y*c); }

    /** Returns the integer direction of this vector, corrosponding to multiples of 90 degree rotation (0-3)
     * @return {Number} */
    direction() { return abs(this.x) > abs(this.y) ? this.x < 0 ? 3 : 1 : this.y < 0 ? 2 : 0; }

    /** Returns a copy of this vector that has been inverted
     * @return {Vector2} */
    invert() { return new Vector2(this.y, -this.x); }

    /** Returns a copy of this vector with each axis floored
     * @return {Vector2} */
    floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }

    /** Returns the area this vector covers as a rectangle
     * @return {Number} */
    area() { return abs(this.x * this.y); }

    /** Returns a new vector that is p percent between this and the vector passed in
     * @param {Vector2} vector
     * @param {Number}  percent
     * @return {Vector2} */
    lerp(v, p) {  return this.add(v.subtract(this).scale(clamp(p))); }

    /** Returns true if this vector is within the bounds of an array size passed in
     * @param {Vector2} arraySize
     * @return {Boolean} */
    arrayCheck(arraySize) { return this.x >= 0 && this.y >= 0 && this.x < arraySize.x && this.y < arraySize.y; }

    /** Returns this vector expressed as a string
     * @param {float} digits - precision to display
     * @return {String} */
    // toString(digits=3) 
    // { return `(${(this.x<0?'':' ') + this.x.toFixed(digits)},${(this.y<0?'':' ') + this.y.toFixed(digits)} )`; }
}

///////////////////////////////////////////////////////////////////////////////

/** 
 * Color object (red, green, blue, alpha) with some helpful functions
 * @example
 * let a = new Color;             // white
 * let b = new Color(1, 0, 0);    // red
 * let c = new Color(0, 0, 0, 0); // transparent black
 */
class Color
{
    /** Create a color with the components passed in, white by default
     *  @param {Number} [red=1]
     *  @param {Number} [green=1]
     *  @param {Number} [blue=1]
     *  @param {Number} [alpha=1] */
    constructor(r=1, g=1, b=1, a=1)
    {
        /** @property {Number} - Red */
        this.r = r;
        /** @property {Number} - Green */
        this.g = g;
        /** @property {Number} - Blue */
        this.b = b;
        /** @property {Number} - Alpha */
        this.a = a;
    }

    /** Returns a new color that is a copy of this
     * @return {Color} */
    copy() { return new Color(this.r, this.g, this.b, this.a); }

    /** Returns a copy of this color plus the color passed in
     * @param {Color} color
     * @return {Color} */
    add(c) { return new Color(this.r+c.r, this.g+c.g, this.b+c.b, this.a+c.a); }

    /** Returns a copy of this color minus the color passed in
     * @param {Color} color
     * @return {Color} */
    subtract(c) { return new Color(this.r-c.r, this.g-c.g, this.b-c.b, this.a-c.a); }

    /** Returns a copy of this color times the color passed in
     * @param {Color} color
     * @return {Color} */
    // multiply(c) { return new Color(this.r*c.r, this.g*c.g, this.b*c.b, this.a*c.a); }

    /** Returns a copy of this color divided by the color passed in
     * @param {Color} color
     * @return {Color} */
    // divide(c) { return new Color(this.r/c.r, this.g/c.g, this.b/c.b, this.a/c.a); }

    /** Returns a copy of this color scaled by the value passed in, alpha can be scaled separately
     * @param {Number} scale
     * @param {Number} [alphaScale=scale]
     * @return {Color} */
    scale(s, a=s) { return new Color(this.r*s, this.g*s, this.b*s, this.a*a); }

    /** Returns a copy of this color clamped to the valid range between 0 and 1
     * @return {Color} */
    // clamp() { return new Color(clamp(this.r), clamp(this.g), clamp(this.b), clamp(this.a)); }

    /** Returns a new color that is p percent between this and the color passed in
     * @param {Color}  color
     * @param {Number} percent
     * @return {Color} */
    lerp(c, p) { return this.add(c.subtract(this).scale(clamp(p))); }

    /** Sets this color given a hue, saturation, lightness, and alpha
     * @param {Number} [hue=0]
     * @param {Number} [saturation=0]
     * @param {Number} [lightness=1]
     * @param {Number} [alpha=1]
     * @return {Color} */
    // setHSLA(h=0, s=0, l=1, a=1)
    // {
    //     const q = l < .5 ? l*(1+s) : l+s-l*s, p = 2*l-q,
    //         f = (p, q, t)=>
    //             (t = ((t%1)+1)%1) < 1/6 ? p+(q-p)*6*t :
    //             t < 1/2 ? q :
    //             t < 2/3 ? p+(q-p)*(2/3-t)*6 : p;
                
    //     this.r = f(p, q, h + 1/3);
    //     this.g = f(p, q, h);
    //     this.b = f(p, q, h - 1/3);
    //     this.a = a;
    //     return this;
    // }

    /** Returns this color expressed in hsla format
     * @return {Array} */
    // getHSLA()
    // {
    //     const r = this.r;
    //     const g = this.g;
    //     const b = this.b;
    //     const a = this.a;
    //     const max = Math.max(r, g, b);
    //     const min = Math.min(r, g, b);
    //     const l = (max + min) / 2;
        
    //     let h = 0, s = 0;
    //     if (max != min)
    //     {
    //         let d = max - min;
    //         s = l > .5 ? d / (2 - max - min) : d / (max + min);
    //         if (r == max)
    //             h = (g - b) / d + (g < b ? 6 : 0);
    //         else if (g == max)
    //             h = (b - r) / d + 2;
    //         else if (b == max)
    //             h =  (r - g) / d + 4;
    //     }

    //     return [h / 6, s, l, a];
    // }

    /** Returns a new color that has each component randomly adjusted
     * @param {Number} [amount=.05]
     * @param {Number} [alphaAmount=0]
     * @return {Color} */
    // mutate(amount=.05, alphaAmount=0) 
    // {
    //     return new Color
    //     (
    //         this.r + rand(amount, -amount),
    //         this.g + rand(amount, -amount),
    //         this.b + rand(amount, -amount),
    //         this.a + rand(alphaAmount, -alphaAmount)
    //     ).clamp();
    // }

    /** Returns this color expressed as an CSS color value
     * @return {String} */
    toString()      
    { 
        return `rgb(${this.r*255|0},${this.g*255|0},${this.b*255|0},${this.a})`; 
    }
    
    /** Returns this color expressed as 32 bit integer RGBA value
     * @return {Number} */
    rgbaInt()  
    {
        return (this.r*255|0) + (this.g*255<<8) + (this.b*255<<16) + (this.a*255<<24); 
    }

    /** Set this color from a hex code
     * @param {String} hex - html hex code
     * @return {Color} */
    // setHex(hex)
    // {
    //     const fromHex = (a)=> parseInt(hex.slice(a,a+2), 16)/255;
    //     this.r = fromHex(1);
    //     this.g = fromHex(3),
    //     this.b = fromHex(5);
    //     this.a = 1;
    //     return this;
    // }

    /** Returns this color expressed as a hex code
     * @return {String} */
    getHex()
    {
        const toHex = (c)=> ((c=c*255|0)<16 ? '0' : '') + c.toString(16);
        return '#' + toHex(this.r) + toHex(this.g) + toHex(this.b);
    }
}

///////////////////////////////////////////////////////////////////////////////

/**
 * Timer object tracks how long has passed since it was set
 * @example
 * let a = new Timer;    // creates a timer that is not set
 * a.set(3);             // sets the timer to 3 seconds
 *
 * let b = new Timer(1); // creates a timer with 1 second left
 * b.unset();            // unsets the timer
 */
class Timer
{
    /** Create a timer object set time passed in
     *  @param {Number} [timeLeft] - How much time left before the timer elapses in seconds */
    constructor(timeLeft) { this.time = timeLeft == undefined ? undefined : time + timeLeft; this.setTime = timeLeft; }

    /** Set the timer with seconds passed in
     *  @param {Number} [timeLeft=0] - How much time left before the timer is elapsed in seconds */
    set(timeLeft=0) { this.time = time + timeLeft; this.setTime = timeLeft; }

    /** Unset the timer */
    unset() { this.time = undefined; }

    /** Returns true if set
     * @return {Boolean} */
    isSet() { return this.time != undefined; }

    /** Returns true if set and has not elapsed
     * @return {Boolean} */
    active() { return time <= this.time; }

    /** Returns true if set and elapsed
     * @return {Boolean} */
    elapsed() { return time > this.time; }

    /** Get how long since elapsed, returns 0 if not set (returns negative if currently active)
     * @return {Number} */
    get() { return this.isSet()? time - this.time : 0; }

    /** Get percentage elapsed based on time it was set to, returns 0 if not set
     * @return {Number} */
    // getPercent() { return this.isSet()? percent(this.time - time, this.setTime, 0) : 0; }
    
    /** Returns this timer expressed as a string
     * @return {String} */
    // toString() { if (debug) { return this.unset() ? 'unset' : Math.abs(this.get()) + ' seconds ' + (this.get()<0 ? 'before' : 'after' ); } }
}
/**
 * LittleJS Engine Settings
 * @namespace Settings
 */

'use strict';

///////////////////////////////////////////////////////////////////////////////
// Display settings

/** The max size of the canvas, centered if window is larger
 *  @type {Vector2} 
 *  @default
 *  @memberof Settings */
let canvasMaxSize = vec2(1920, 1200);

/** Fixed size of the canvas, if enabled canvas size never changes
 * - you may also need to set mainCanvasSize if using screen space coords in startup
 *  @type {Vector2} 
 *  @default
 *  @memberof Settings */
let canvasFixedSize = vec2();

/** Disables anti aliasing for pixel art if true
 *  @default
 *  @memberof Settings */
const cavasPixelated = 1;

/** Default font used for text rendering
 *  @default
 *  @memberof Settings */
let fontDefault = 'arial';

///////////////////////////////////////////////////////////////////////////////
// Tile sheet settings

/** Default size of tiles in pixels
 *  @type {Vector2} 
 *  @default
 *  @memberof Settings */
let tileSizeDefault = vec2(16);

/** Prevent tile bleeding from neighbors in pixels
 *  @default
 *  @memberof Settings */
let tileFixBleedScale = .3;

///////////////////////////////////////////////////////////////////////////////
// Object settings

/** Default size of objects
 *  @type {Vector2} 
 *  @default
 *  @memberof Settings */
let objectDefaultSize = vec2(1);

/** Enable physics solver for collisions between objects
 *  @default
 *  @memberof Settings */
let enablePhysicsSolver = 1;

/** Default object mass for collison calcuations (how heavy objects are)
 *  @default
 *  @memberof Settings */
let objectDefaultMass = 1;

/** How much to slow velocity by each frame (0-1)
 *  @default
 *  @memberof Settings */
let objectDefaultDamping = .99;

/** How much to slow angular velocity each frame (0-1)
 *  @default
 *  @memberof Settings */
let objectDefaultAngleDamping = .99;

/** How much to bounce when a collision occurs (0-1)
 *  @default
 *  @memberof Settings */
let objectDefaultElasticity = 0;

/** How much to slow when touching (0-1)
 *  @default
 *  @memberof Settings */
let objectDefaultFriction = .8;

/** Clamp max speed to avoid fast objects missing collisions
 *  @default
 *  @memberof Settings */
let objectMaxSpeed = 1;

/** How much gravity to apply to objects along the Y axis, negative is down
 *  @default
 *  @memberof Settings */
let gravity = 0;

/** Scales emit rate of particles, useful for low graphics mode (0 disables particle emitters)
 *  @default
 *  @memberof Settings */
let particleEmitRateScale = 1;

///////////////////////////////////////////////////////////////////////////////
// Camera settings

/** Position of camera in world space
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let cameraPos = vec2();

/** Scale of camera in world space
 *  @default
 *  @memberof Settings */
let cameraScale = max(tileSizeDefault.x, tileSizeDefault.y);

///////////////////////////////////////////////////////////////////////////////
// WebGL settings

/** Enable webgl rendering, webgl can be disabled and removed from build (with some features disabled)
 *  @default
 *  @memberof Settings */
const glEnable = 0;

/** Fixes slow rendering in some browsers by not compositing the WebGL canvas
 *  @default
 *  @memberof Settings */
const glOverlay = 0;

///////////////////////////////////////////////////////////////////////////////
// Input settings

/** Should gamepads be allowed
 *  @default
 *  @memberof Settings */
const gamepadsEnable = 0;

/** If true, the dpad input is also routed to the left analog stick (for better accessability)
 *  @default
 *  @memberof Settings */
const gamepadDirectionEmulateStick = 0;

/** If true the WASD keys are also routed to the direction keys (for better accessability)
 *  @default
 *  @memberof Settings */
let inputWASDEmulateDirection = 1;

/** True if touch gamepad should appear on mobile devices
 *  <br> - Supports left analog stick, 4 face buttons and start button (button 9)
 *  <br> - Must be set by end of gameInit to be activated
 *  @default
 *  @memberof Settings */
let touchGamepadEnable = 0;

/** True if touch gamepad should be analog stick or false to use if 8 way dpad
 *  @default
 *  @memberof Settings */
let touchGamepadAnalog = 0;

/** Size of virutal gamepad for touch devices in pixels
 *  @default
 *  @memberof Settings */
let touchGamepadSize = 80;

/** Transparency of touch gamepad overlay
 *  @default
 *  @memberof Settings */
let touchGamepadAlpha = .3;

/** Allow vibration hardware if it exists
 *  @default
 *  @memberof Settings */
const vibrateEnable = 0;

///////////////////////////////////////////////////////////////////////////////
// Audio settings

/** Volume scale to apply to all sound, music and speech
 *  @default
 *  @memberof Settings */
let soundVolume = .5;

/** All audio code can be disabled and removed from build
 *  @default
 *  @memberof Settings */
const soundEnable = 1;

/** Default range where sound no longer plays
 *  @default
 *  @memberof Settings */
const soundDefaultRange = 30;

/** Default range percent to start tapering off sound (0-1)
 *  @default
 *  @memberof Settings */
let soundDefaultTaper = .7;

///////////////////////////////////////////////////////////////////////////////
// Medals settings

// /** How long to show medals for in seconds
//  *  @default
//  *  @memberof Settings */
// let medalDisplayTime = 5;

// /** How quickly to slide on/off medals in seconds
//  *  @default
//  *  @memberof Settings */
// let medalDisplaySlideTime = .5;

// /** Width of medal display
//  *  @default
//  *  @memberof Settings */
// let medalDisplayWidth = 640;

// /** Height of medal display
//  *  @default
//  *  @memberof Settings */
// let medalDisplayHeight = 80;

// /** Size of icon in medal display
//  *  @default
//  *  @memberof Settings */
// let medalDisplayIconSize = 50;
/*
    LittleJS - The Tiny JavaScript Game Engine That Can!
    MIT License - Copyright 2021 Frank Force

    Engine Features
    - Object oriented system with base class engine object
    - Base class object handles update, physics, collision, rendering, etc
    - Engine helper classes and functions like Vector2, Color, and Timer
    - Super fast rendering system for tile sheets
    - Sound effects audio with zzfx and music with zzfxm
    - Input processing system with gamepad and touchscreen support
    - Tile layer rendering and collision system
    - Particle effect system
    - Medal system tracks and displays achievements
    - Debug tools and debug rendering system
    - Call engineInit() to start it up!
*/

'use strict';

/** Name of engine */
const engineName = 'LittleJS';

/** Version of engine */
const engineVersion = '1.3.8';

/** Frames per second to update objects
 *  @default */
const frameRate = 60;

/** How many seconds each frame lasts, engine uses a fixed time step
 *  @default 1/60 */
const timeDelta = 1/frameRate;

/** Array containing all engine objects */
let engineObjects = [];

/** Array containing only objects that are set to collide with other objects this frame (for optimization) */
let engineObjectsCollide = [];

/** Current update frame, used to calculate time */
let frame = 0;

/** Current engine time since start in seconds, derived from frame */
let time = 0;

/** Actual clock time since start in seconds (not affected by pause or frame rate clamping) */
let timeReal = 0;

/** Is the game paused? Causes time and objects to not be updated. */
const paused = 0;

// Engine internal variables not exposed to documentation
let frameTimeLastMS = 0, frameTimeBufferMS = 0, tileImageSize, tileImageFixBleed;

// Engine stat tracking, if showWatermark is true
let averageFPS, drawCount;

// css text used for elements created by engine
const styleBody = 'margin:0;overflow:hidden;background:#000' +
    ';touch-action:none;user-select:none;-webkit-user-select:none;-moz-user-select:none';
const styleCanvas = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)';

///////////////////////////////////////////////////////////////////////////////

/** Start up LittleJS engine with your callback functions
 *  @param {Function} gameInit        - Called once after the engine starts up, setup the game
 *  @param {Function} gameUpdate      - Called every frame at 60 frames per second, handle input and update the game state
 *  @param {Function} gameUpdatePost  - Called after physics and objects are updated, setup camera and prepare for render
 *  @param {Function} gameRender      - Called before objects are rendered, draw any background effects that appear behind objects
 *  @param {Function} gameRenderPost  - Called after objects are rendered, draw effects or hud that appear above all objects
 *  @param {String} [tileImageSource] - Tile image to use, everything starts when the image is finished loading
 */
function engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, tileImageSource)
{
    // init engine when tiles load or fail to load
    tileImage.onerror = tileImage.onload = ()=>
    {
        // save tile image info
        tileImageFixBleed = vec2(tileFixBleedScale).divide(tileImageSize = vec2(tileImage.width, tileImage.height));
        // debug && (tileImage.onload=()=>ASSERT(1)); // tile sheet can not reloaded

        // setup html
        document.body.style = styleBody;
        document.body.appendChild(mainCanvas = document.createElement('canvas'));
        mainContext = mainCanvas.getContext('2d');
        mainCanvas.style = styleCanvas;

        // init stuff and start engine
        //debugInit();
        //glInit();

        // create overlay canvas for hud to appear above gl canvas
        document.body.appendChild(overlayCanvas = document.createElement('canvas'));
        overlayContext = overlayCanvas.getContext('2d');
        overlayCanvas.style = styleCanvas;
        
        gameInit();
        //touchGamepadCreate();
        engineUpdate();
    };

    // main update loop
    const engineUpdate = (frameTimeMS=0)=>
    {
        // update time keeping
        let frameTimeDeltaMS = frameTimeMS - frameTimeLastMS;
        frameTimeLastMS = frameTimeMS;
        // if (debug || showWatermark)
        //     averageFPS = lerp(.05, averageFPS || 0, 1e3/(frameTimeDeltaMS||1));
        // if (debug)
        //     frameTimeDeltaMS *= keyIsDown(107) ? 5 : keyIsDown(109) ? .2 : 1; // +/- to speed/slow time
        // timeReal += frameTimeDeltaMS / 1e3;
        frameTimeBufferMS = min(frameTimeBufferMS + !paused * frameTimeDeltaMS, 50); // clamp incase of slow framerate

        // if (canvasFixedSize.x)
        // {
        //     // clear set fixed size
        //     overlayCanvas.width  = mainCanvas.width  = canvasFixedSize.x;
        //     overlayCanvas.height = mainCanvas.height = canvasFixedSize.y;
            
        //     // fit to window by adding space on top or bottom if necessary
        //     const aspect = innerWidth / innerHeight;
        //     const fixedAspect = mainCanvas.width / mainCanvas.height;
        //     mainCanvas.style.width  = overlayCanvas.style.width  = aspect < fixedAspect ? '100%' : '';
        //     mainCanvas.style.height = overlayCanvas.style.height = aspect < fixedAspect ? '' : '100%';
        //     // if (glCanvas)
        //     // {
        //     //     glCanvas.style.width  = mainCanvas.style.width;
        //     //     glCanvas.style.height = mainCanvas.style.height;
        //     // }
        // }
        // else
        // {
        //     // clear and set size to same as window
             overlayCanvas.width  = mainCanvas.width  = min(innerWidth,  canvasMaxSize.x);
             overlayCanvas.height = mainCanvas.height = min(innerHeight, canvasMaxSize.y);
        // }
        
        // save canvas size
        mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

        // if (paused)
        // {
        //     // do post update even when paused
        //     inputUpdate();
        //     debugUpdate();
        //     gameUpdatePost();
        //     inputUpdatePost();
        // }
        // else
        // {
        //     // apply time delta smoothing, improves smoothness of framerate in some browsers
            let deltaSmooth = 0;
            if (frameTimeBufferMS < 0 && frameTimeBufferMS > -9)
            {
                // force an update each frame if time is close enough (not just a fast refresh rate)
                deltaSmooth = frameTimeBufferMS;
                frameTimeBufferMS = 0;
            }
            
            // update multiple frames if necessary in case of slow framerate
            for (;frameTimeBufferMS >= 0; frameTimeBufferMS -= 1e3 / frameRate)
            {
                // update game and objects
                inputUpdate();
                gameUpdate();
                engineObjectsUpdate();

                // do post update
                // debugUpdate();
                gameUpdatePost();
                inputUpdatePost();
            }

            // add the time smoothing back in
            frameTimeBufferMS += deltaSmooth;
        // }
        
        // render sort then render while removing destroyed objects
        enginePreRender();
        gameRender();
        engineObjects.sort((a,b)=> a.renderOrder - b.renderOrder);
        for (const o of engineObjects)
            o.destroyed || o.render();
        gameRenderPost();
        //medalsRender();
        //touchGamepadRender();
        //debugRender();
        //glCopyToContext(mainContext);

        // if (showWatermark)
        // {
        //     // update fps
        //     overlayContext.textAlign = 'right';
        //     overlayContext.textBaseline = 'top';
        //     overlayContext.font = '1em monospace';
        //     overlayContext.fillStyle = '#000';
        //     const text = engineName + ' ' + 'v' + engineVersion + ' / ' 
        //         + drawCount + ' / ' + engineObjects.length + ' / ' + averageFPS.toFixed(1)
        //         + ' ' + (glEnable ? 'GL' : '2D') ;
        //     overlayContext.fillText(text, mainCanvas.width-3, 3);
        //     overlayContext.fillStyle = '#fff';
        //     overlayContext.fillText(text, mainCanvas.width-2, 2);
        //     drawCount = 0;
        // }

        requestAnimationFrame(engineUpdate);
    }

    // set tile image source to load the image and start the engine
    tileImageSource ? tileImage.src = tileImageSource : tileImage.onload();
}

// called by engine to setup render system
function enginePreRender()
{
    // save canvas size
    mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

    // disable smoothing for pixel art
    mainContext.imageSmoothingEnabled = !cavasPixelated;

    // setup gl rendering if enabled
    //glPreRender(mainCanvas.width, mainCanvas.height, cameraPos.x, cameraPos.y, cameraScale);
}

///////////////////////////////////////////////////////////////////////////////

/** Calls update on each engine object (recursively if child), removes destroyed objects, and updated time */
function engineObjectsUpdate()
{
    // get list of solid objects for physics optimzation
    engineObjectsCollide = engineObjects.filter(o=>o.collideSolidObjects);

    // recursive object update
    const updateObject = (o)=>
    {
        if (!o.destroyed)
        {
            o.update();
            for (const child of o.children)
                updateObject(child);
        }
    }
    for (const o of engineObjects)
        o.parent || updateObject(o);

    // remove destroyed objects
    engineObjects = engineObjects.filter(o=>!o.destroyed);

    // increment frame and update time
    time = ++frame / frameRate;
}

/** Destroy and remove all objects */
function engineObjectsDestroy()
{
    for (const o of engineObjects)
        o.parent || o.destroy();
    engineObjects = engineObjects.filter(o=>!o.destroyed);
}

/** Triggers a callback for each object within a given area
 *  @param {Vector2} [pos]                 - Center of test area
 *  @param {Number} [size]                 - Radius of circle if float, rectangle size if Vector2
 *  @param {Function} [callbackFunction]   - Calls this function on every object that passes the test
 *  @param {Array} [objects=engineObjects] - List of objects to check */
function engineObjectsCallback(pos, size, callbackFunction, objects=engineObjects)
{
    if (!pos) // all objects
    {
        for (const o of objects)
            callbackFunction(o);
    }
    else if (size.x != undefined)  // bounding box test
    {
        for (const o of objects)
            isOverlapping(pos, size, o.pos, o.size) && callbackFunction(o);
    }
    else  // circle test
    {
        const sizeSquared = size*size;
        for (const o of objects)
            pos.distanceSquared(o.pos) < sizeSquared && callbackFunction(o);
    }
}
/*
    LittleJS Object System
*/

'use strict';

/** 
 * LittleJS Object Base Object Class
 * <br> - Base object class used by the engine
 * <br> - Automatically adds self to object list
 * <br> - Will be updated and rendered each frame
 * <br> - Renders as a sprite from a tilesheet by default
 * <br> - Can have color and addtive color applied
 * <br> - 2d Physics and collision system
 * <br> - Sorted by renderOrder
 * <br> - Objects can have children attached
 * <br> - Parents are updated before children, and set child transform
 * <br> - Call destroy() to get rid of objects
 * <br>
 * <br>The physics system used by objects is simple and fast with some caveats...
 * <br> - Collision uses the axis aligned size, the object's rotation angle is only for rendering
 * <br> - Objects are guaranteed to not intersect tile collision from physics
 * <br> - If an object starts or is moved inside tile collision, it will not collide with that tile
 * <br> - Collision for objects can be set to be solid to block other objects
 * <br> - Objects may get pushed into overlapping other solid objects, if so they will push away
 * <br> - Solid objects are more performance intensive and should be used sparingly
 * @example
 * // create an engine object, normally you would first extend the class with your own
 * const pos = vec2(2,3);
 * const object = new EngineObject(pos); 
 */
class EngineObject
{
    /** Create an engine object and adds it to the list of objects
     *  @param {Vector2} [position=new Vector2()]    - World space position of the object
     *  @param {Vector2} [size=objectDefaultSize]    - World space size of the object
     *  @param {Number}  [tileIndex=-1]              - Tile to use to render object (-1 is untextured)
     *  @param {Vector2} [tileSize=tileSizeDefault]  - Size of tile in source pixels
     *  @param {Number}  [angle=0]                   - Angle the object is rotated by
     *  @param {Color}   [color]                     - Color to apply to tile when rendered
     *  @param {Number}  [renderOrder=0]             - Objects sorted by renderOrder before being rendered
     */
    constructor(pos=vec2(), size=objectDefaultSize, tileIndex=-1, tileSize=tileSizeDefault, angle=0, color, renderOrder=0)
    {
        // set passed in params
        // ASSERT(pos && pos.x != undefined && size.x != undefined); // ensure pos and size are vec2s

        /** @property {Vector2} - World space position of the object */
        this.pos = pos.copy();
        /** @property {Vector2} - World space width and height of the object */
        this.size = size;
        /** @property {Vector2} - Size of object used for drawing, uses size if not set */
        this.drawSize;
        /** @property {Number}  - Tile to use to render object (-1 is untextured) */
        this.tileIndex = tileIndex;
        /** @property {Vector2} - Size of tile in source pixels */
        this.tileSize = tileSize;
        /** @property {Number}  - Angle to rotate the object */
        this.angle = angle;
        /** @property {Color}   - Color to apply when rendered */
        this.color = color;
        /** @property {Color}   - Additive color to apply when rendered */
        this.additiveColor;

        // set object defaults
        /** @property {Number} [mass=objectDefaultMass]                 - How heavy the object is, static if 0 */
        this.mass         = objectDefaultMass;
        /** @property {Number} [damping=objectDefaultDamping]           - How much to slow down velocity each frame (0-1) */
        this.damping      = objectDefaultDamping;
        /** @property {Number} [angleDamping=objectDefaultAngleDamping] - How much to slow down rotation each frame (0-1) */
        this.angleDamping = objectDefaultAngleDamping;
        /** @property {Number} [elasticity=objectDefaultElasticity]     - How bouncy the object is when colliding (0-1) */
        this.elasticity   = objectDefaultElasticity;
        /** @property {Number} [friction=objectDefaultFriction]         - How much friction to apply when sliding (0-1) */
        this.friction     = objectDefaultFriction;
        /** @property {Number} [gravityScale=1]                         - How much to scale gravity by for this object */
        this.gravityScale = 1;
        /** @property {Number} [renderOrder=0]                          - Objects are sorted by render order */
        this.renderOrder = renderOrder;
        /** @property {Vector2} [velocity=new Vector2()]                - Velocity of the object */
        this.velocity = new Vector2();
        /** @property {Number} [angleVelocity=0]                        - Angular velocity of the object */
        this.angleVelocity = 0;

        // init other internal object stuff
        this.spawnTime = time;
        this.children = [];
        this.collideTiles = 1;

        // add to list of objects
        engineObjects.push(this);
    }
    
    /** Update the object transform and physics, called automatically by engine once each frame */
    update()
    {
        const parent = this.parent;
        if (parent)
        {
            // copy parent pos/angle
            this.pos = this.localPos.multiply(vec2(parent.getMirrorSign(),1)).rotate(-parent.angle).add(parent.pos);
            this.angle = parent.getMirrorSign()*this.localAngle + parent.angle;
            return;
        }

        // limit max speed to prevent missing collisions
        this.velocity.x = clamp(this.velocity.x, -objectMaxSpeed, objectMaxSpeed);
        this.velocity.y = clamp(this.velocity.y, -objectMaxSpeed, objectMaxSpeed);

        // apply physics
        const oldPos = this.pos.copy();
        this.pos.x += this.velocity.x = this.damping * this.velocity.x;
        this.pos.y += this.velocity.y = this.damping * this.velocity.y + gravity * this.gravityScale;
        this.angle += this.angleVelocity *= this.angleDamping;

        // physics sanity checks
        //ASSERT(this.angleDamping >= 0 && this.angleDamping <= 1);
        //ASSERT(this.damping >= 0 && this.damping <= 1);

        if (!enablePhysicsSolver || !this.mass) // do not update collision for fixed objects
            return;

        const wasMovingDown = this.velocity.y < 0;
        if (this.groundObject)
        {
            // apply friction in local space of ground object
            const groundSpeed = this.groundObject.velocity ? this.groundObject.velocity.x : 0;
            this.velocity.x = groundSpeed + (this.velocity.x - groundSpeed) * this.friction;
            this.groundObject = 0;
            //debugOverlay && debugPhysics && debugPoint(this.pos.subtract(vec2(0,this.size.y/2)), '#0f0');
        }

        if (this.collideSolidObjects)
        {
            // check collisions against solid objects
            const epsilon = 1e-3; // necessary to push slightly outside of the collision
            for (const o of engineObjectsCollide)
            {
                // non solid objects don't collide with eachother
                if (!this.isSolid & !o.isSolid || o.destroyed || o.parent || o == this)
                    continue;

                // check collision
                if (!isOverlapping(this.pos, this.size, o.pos, o.size))
                    continue;

                // pass collision to objects
                if (!this.collideWithObject(o) | !o.collideWithObject(this))
                    continue;

                if (isOverlapping(oldPos, this.size, o.pos, o.size))
                {
                    // if already was touching, try to push away
                    const deltaPos = oldPos.subtract(o.pos);
                    const length = deltaPos.length();
                    const pushAwayAccel = .001; // push away if already overlapping
                    const velocity = length < .01 ? randVector(pushAwayAccel) : deltaPos.scale(pushAwayAccel/length);
                    this.velocity = this.velocity.add(velocity);
                    if (o.mass) // push away if not fixed
                        o.velocity = o.velocity.subtract(velocity);
                        
                    // debugOverlay && debugPhysics && debugAABB(this.pos, this.size, o.pos, o.size, '#f00');
                    continue;
                }

                // check for collision
                const sizeBoth = this.size.add(o.size);
                const smallStepUp = (oldPos.y - o.pos.y)*2 > sizeBoth.y + gravity; // prefer to push up if small delta
                const isBlockedX = abs(oldPos.y - o.pos.y)*2 < sizeBoth.y;
                const isBlockedY = abs(oldPos.x - o.pos.x)*2 < sizeBoth.x;
                
                if (smallStepUp || isBlockedY || !isBlockedX) // resolve y collision
                {
                    // push outside object collision
                    this.pos.y = o.pos.y + (sizeBoth.y/2 + epsilon) * sign(oldPos.y - o.pos.y);
                    if (o.groundObject && wasMovingDown || !o.mass)
                    {
                        // set ground object if landed on something
                        if (wasMovingDown)
                            this.groundObject = o;

                        // bounce if other object is fixed or grounded
                        this.velocity.y *= -this.elasticity;
                    }
                    else if (o.mass)
                    {
                        // inelastic collision
                        const inelastic = (this.mass * this.velocity.y + o.mass * o.velocity.y) / (this.mass + o.mass);

                        // elastic collision
                        const elastic0 = this.velocity.y * (this.mass - o.mass) / (this.mass + o.mass)
                            + o.velocity.y * 2 * o.mass / (this.mass + o.mass);
                        const elastic1 = o.velocity.y * (o.mass - this.mass) / (this.mass + o.mass)
                            + this.velocity.y * 2 * this.mass / (this.mass + o.mass);

                        // lerp betwen elastic or inelastic based on elasticity
                        const elasticity = max(this.elasticity, o.elasticity);
                        this.velocity.y = lerp(elasticity, inelastic, elastic0);
                        o.velocity.y = lerp(elasticity, inelastic, elastic1);
                    }
                }
                if (!smallStepUp && (isBlockedX || !isBlockedY)) // resolve x collision
                {
                    // push outside collision
                    this.pos.x = o.pos.x + (sizeBoth.x/2 + epsilon) * sign(oldPos.x - o.pos.x);
                    if (o.mass)
                    {
                        // inelastic collision
                        const inelastic = (this.mass * this.velocity.x + o.mass * o.velocity.x) / (this.mass + o.mass);

                        // elastic collision
                        const elastic0 = this.velocity.x * (this.mass - o.mass) / (this.mass + o.mass)
                            + o.velocity.x * 2 * o.mass / (this.mass + o.mass);
                        const elastic1 = o.velocity.x * (o.mass - this.mass) / (this.mass + o.mass)
                            + this.velocity.x * 2 * this.mass / (this.mass + o.mass);

                        // lerp betwen elastic or inelastic based on elasticity
                        const elasticity = max(this.elasticity, o.elasticity);
                        this.velocity.x = lerp(elasticity, inelastic, elastic0);
                        o.velocity.x = lerp(elasticity, inelastic, elastic1);
                    }
                    else // bounce if other object is fixed
                        this.velocity.x *= -this.elasticity;
                }
                // debugOverlay && debugPhysics && debugAABB(this.pos, this.size, o.pos, o.size, '#f0f');
            }
        }
        if (this.collideTiles)
        {
            // check collision against tiles
            if (tileCollisionTest(this.pos, this.size, this))
            {
                // if already was stuck in collision, don't do anything
                // this should not happen unless something starts in collision
                if (!tileCollisionTest(oldPos, this.size, this))
                {
                    // test which side we bounced off (or both if a corner)
                    const isBlockedY = tileCollisionTest(new Vector2(oldPos.x, this.pos.y), this.size, this);
                    const isBlockedX = tileCollisionTest(new Vector2(this.pos.x, oldPos.y), this.size, this);
                    if (isBlockedY || !isBlockedX)
                    {
                        // set if landed on ground
                        this.groundObject = wasMovingDown;

                        // bounce velocity
                        this.velocity.y *= -this.elasticity;

                        // adjust next velocity to settle on ground
                        const o = (oldPos.y - this.size.y/2|0) - (oldPos.y - this.size.y/2);
                        if (o < 0 && o > this.damping * this.velocity.y + gravity * this.gravityScale) 
                            this.velocity.y = this.damping ? (o - gravity * this.gravityScale) / this.damping : 0;

                        // move to previous position
                        this.pos.y = oldPos.y;
                    }
                    if (isBlockedX)
                    {
                        // move to previous position and bounce
                        this.pos.x = oldPos.x;
                        this.velocity.x *= -this.elasticity;
                    }
                }
            }
        }
    }
       
    /** Render the object, draws a tile by default, automatically called each frame, sorted by renderOrder */
    render()
    {
        // default object render
        drawTile(this.pos, this.drawSize || this.size, this.tileIndex, this.tileSize, this.color, this.angle, this.mirror, this.additiveColor);
    }
    
    /** Destroy this object, destroy it's children, detach it's parent, and mark it for removal */
    destroy()             
    { 
        if (this.destroyed)
            return;
        
        // disconnect from parent and destroy chidren
        this.destroyed = 1;
        this.parent && this.parent.removeChild(this);
        for (const child of this.children)
            child.destroy(child.parent = 0);
    }
    
    /** Called to check if a tile collision should be resolved
     *  @param {Number}  tileData - the value of the tile at the position
     *  @param {Vector2} pos      - tile where the collision occured
     *  @return {Boolean}         - true if the collision should be resolved */
    collideWithTile(tileData, pos)        { return tileData > 0; }
    
    /** Called to check if a tile raycast hit
     *  @param {Number}  tileData - the value of the tile at the position
     *  @param {Vector2} pos      - tile where the raycast is
     *  @return {Boolean}         - true if the raycast should hit */
    collideWithTileRaycast(tileData, pos) { return tileData > 0; }

    /** Called to check if a tile raycast hit
     *  @param {EngineObject} object - the object to test against
     *  @return {Boolean}            - true if the collision should be resolved
     */
    collideWithObject(o)              { return 1; }

    /** How long since the object was created
     *  @return {Number} */
    getAliveTime()                    { return time - this.spawnTime; }

    /** Apply acceleration to this object (adjust velocity, not affected by mass)
     *  @param {Vector2} acceleration */
    applyAcceleration(a)              { if (this.mass) this.velocity = this.velocity.add(a); }

    /** Apply force to this object (adjust velocity, affected by mass)
     *  @param {Vector2} force */
    applyForce(force)	              { this.applyAcceleration(force.scale(1/this.mass)); }
    
    /** Get the direction of the mirror
     *  @return {Number} -1 if this.mirror is true, or 1 if not mirrored */
    getMirrorSign() { return this.mirror ? -1 : 1; }

    /** Attaches a child to this with a given local transform
     *  @param {EngineObject} child
     *  @param {Vector2}      [localPos=new Vector2]
     *  @param {Number}       [localAngle=0] */
    // addChild(child, localPos=vec2(), localAngle=0)
    // {
    //     //ASSERT(!child.parent && !this.children.includes(child));
    //     this.children.push(child);
    //     child.parent = this;
    //     child.localPos = localPos.copy();
    //     child.localAngle = localAngle;
    // }

    // /** Removes a child from this one
    //  *  @param {EngineObject} child */
    // removeChild(child)
    // {
    //     //ASSERT(child.parent == this && this.children.includes(child));
    //     this.children.splice(this.children.indexOf(child), 1);
    //     child.parent = 0;
    // }

    /** Set how this object collides
     *  @param {boolean} [collideSolidObjects=0] - Does it collide with solid objects
     *  @param {boolean} [isSolid=0]             - Does it collide with and block other objects (expensive in large numbers)
     *  @param {boolean} [collideTiles=1]        - Does it collide with the tile collision */
    setCollision(collideSolidObjects=0, isSolid=0, collideTiles=1)
    {
        //ASSERT(collideSolidObjects || !isSolid); // solid objects must be set to collide

        this.collideSolidObjects = collideSolidObjects;
        this.isSolid = isSolid;
        this.collideTiles = collideTiles;
    }

    toString() // debug code we can turn off
    {
        // if (debug)
        // {
            let text = 'type = ' + this.constructor.name;
            if (this.pos.x || this.pos.y)
                text += '\npos = ' + this.pos;
            if (this.velocity.x || this.velocity.y)
                text += '\nvelocity = ' + this.velocity;
            if (this.size.x || this.size.y)
                text += '\nsize = ' + this.size;
            if (this.angle)
                text += '\nangle = ' + this.angle.toFixed(3);
            if (this.color)
                text += '\ncolor = ' + this.color;
            return text;
        }
    // }
}
/** 
 * LittleJS Drawing System
 * <br> - Hybrid with both Canvas2D and WebGL available
 * <br> - Super fast tile sheet rendering with WebGL
 * <br> - Can apply rotation, mirror, color and additive color
 * <br> - Many useful utility functions
 * <br>
 * <br>LittleJS uses a hybrid rendering solution with the best of both Canvas2D and WebGL.
 * <br>There are 3 canvas/contexts available to draw to...
 * <br> - mainCanvas - 2D background canvas, non WebGL stuff like tile layers are drawn here.
 * <br> - glCanvas - Used by the accelerated WebGL batch rendering system.
 * <br> - overlayCanvas - Another 2D canvas that appears on top of the other 2 canvases.
 * <br>
 * <br>The WebGL rendering system is very fast with some caveats...
 * <br> - The default setup supports only 1 tile sheet, to support more call glCreateTexture and glSetTexture
 * <br> - Switching blend modes (additive) or textures causes another draw call which is expensive in excess
 * <br> - Group additive rendering together using renderOrder to mitigate this issue
 * <br>
 * <br>The LittleJS rendering solution is intentionally simple, feel free to adjust it for your needs!
 * @namespace Draw
 */

'use strict';

/** Tile sheet for batch rendering system
 *  @type {Image}
 *  @memberof Draw */
const tileImage = new Image();

/** The primary 2D canvas visible to the user
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let mainCanvas;

/** 2d context for mainCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let mainContext;

/** A canvas that appears on top of everything the same size as mainCanvas
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let overlayCanvas;

/** 2d context for overlayCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let overlayContext;

/** The size of the main canvas (and other secondary canvases) 
 *  @type {Vector2}
 *  @memberof Draw */
let mainCanvasSize = vec2();

/** Convert from screen to world space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} screenPos
 *  @return {Vector2}
 *  @memberof Draw */
const screenToWorld = (screenPos)=>
{
    // ASSERT(mainCanvasSize.x && mainCanvasSize.y, 'mainCanvasSize is invalid');
    return screenPos.add(vec2(.5)).subtract(mainCanvasSize.scale(.5)).multiply(vec2(1/cameraScale,-1/cameraScale)).add(cameraPos);
}

/** Convert from world to screen space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} worldPos
 *  @return {Vector2}
 *  @memberof Draw */
const worldToScreen = (worldPos)=>
{
    // ASSERT(mainCanvasSize.x && mainCanvasSize.y, 'mainCanvasSize is invalid');
    return worldPos.subtract(cameraPos).multiply(vec2(cameraScale,-cameraScale)).add(mainCanvasSize.scale(.5)).subtract(vec2(.5));
}

/** Draw textured tile centered in world space, with color applied if using WebGL
 *  @param {Vector2} pos                                - Center of the tile in world space
 *  @param {Vector2} [size=new Vector2(1,1)]            - Size of the tile in world space, width and height
 *  @param {Number}  [tileIndex=-1]                     - Tile index to use, negative is untextured
 *  @param {Vector2} [tileSize=tileSizeDefault]         - Tile size in source pixels
 *  @param {Color}   [color=new Color(1,1,1)]           - Color to modulate with
 *  @param {Number}  [angle=0]                          - Angle to rotate by
 *  @param {Boolean} [mirror=0]                         - If true image is flipped along the Y axis
 *  @param {Color}   [additiveColor=new Color(0,0,0,0)] - Additive color to be applied
 *  @param {Boolean} [useWebGL=glEnable]                - Use accelerated WebGL rendering
 *  @memberof Draw */
function drawTile(pos, size=vec2(1), tileIndex=-1, tileSize=tileSizeDefault, color=new Color, angle=0, mirror, 
    additiveColor=new Color(0,0,0,0), useWebGL=glEnable)
{
    // showWatermark && ++drawCount;
    // if (glEnable && useWebGL)
    // {
    //     if (tileIndex < 0 || !tileImage.width)
    //     {
    //         // if negative tile index or image not found, force untextured
    //         glDraw(pos.x, pos.y, size.x, size.y, angle, 0, 0, 0, 0, 0, color.rgbaInt()); 
    //     }
    //     else
    //     {
    //         // calculate uvs and render
    //         const cols = tileImageSize.x / tileSize.x |0;
    //         const uvSizeX = tileSize.x / tileImageSize.x;
    //         const uvSizeY = tileSize.y / tileImageSize.y;
    //         const uvX = (tileIndex%cols)*uvSizeX, uvY = (tileIndex/cols|0)*uvSizeY;
            
    //         glDraw(pos.x, pos.y, mirror ? -size.x : size.x, size.y, angle, 
    //             uvX + tileImageFixBleed.x, uvY + tileImageFixBleed.y, 
    //             uvX - tileImageFixBleed.x + uvSizeX, uvY - tileImageFixBleed.y + uvSizeY, 
    //             color.rgbaInt(), additiveColor.rgbaInt()); 
    //     }
    // }
    // else
    {
        // normal canvas 2D rendering method (slower)
        drawCanvas2D(pos, size, angle, mirror, (context)=>
        {
            if (tileIndex < 0)
            {
                // if negative tile index, force untextured
                context.fillStyle = color;
                context.fillRect(-.5, -.5, 1, 1);
            }
            else
            {
                // calculate uvs and render
                const cols = tileImageSize.x / tileSize.x |0;
                const sX = (tileIndex%cols)*tileSize.x   + tileFixBleedScale;
                const sY = (tileIndex/cols|0)*tileSize.y + tileFixBleedScale;
                const sWidth  = tileSize.x - 2*tileFixBleedScale;
                const sHeight = tileSize.y - 2*tileFixBleedScale;
                context.globalAlpha = color.a; // only alpha is supported
                context.drawImage(tileImage, sX, sY, sWidth, sHeight, -.5, -.5, 1, 1);
            }
        });
    }
}

/** Draw colored rect centered on pos
 *  @param {Vector2} pos
 *  @param {Vector2} [size=new Vector2(1,1)]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawRect(pos, size, color, angle, useWebGL)
{
    drawTile(pos, size, -1, tileSizeDefault, color, angle, 0, 0, useWebGL);
}

/** Draw textured tile centered on pos in screen space
 *  @param {Vector2} pos                        - Center of the tile
 *  @param {Vector2} [size=new Vector2(1,1)]    - Size of the tile
 *  @param {Number}  [tileIndex=-1]             - Tile index to use, negative is untextured
 *  @param {Vector2} [tileSize=tileSizeDefault] - Tile size in source pixels
 *  @param {Color}   [color=new Color]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [mirror=0]
 *  @param {Color}   [additiveColor=new Color(0,0,0,0)]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
// function drawTileScreenSpace(pos, size=vec2(1), tileIndex, tileSize, color, angle, mirror, additiveColor, useWebGL)
// {
//     drawTile(screenToWorld(pos), size.scale(1/cameraScale), tileIndex, tileSize, color, angle, mirror, additiveColor, useWebGL);
// }

// /** Draw colored rectangle in screen space
//  *  @param {Vector2} pos
//  *  @param {Vector2} [size=new Vector2(1,1)]
//  *  @param {Color}   [color=new Color(1,1,1)]
//  *  @param {Number}  [angle=0]
//  *  @param {Boolean} [useWebGL=glEnable]
//  *  @memberof Draw */
// function drawRectScreenSpace(pos, size, color, angle, useWebGL)
// {
//     drawTileScreenSpace(pos, size, -1, tileSizeDefault, color, angle, 0, 0, useWebGL);
// }

/** Draw colored line between two points
 *  @param {Vector2} posA
 *  @param {Vector2} posB
 *  @param {Number}  [thickness=.1]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawLine(posA, posB, thickness=.1, color, useWebGL=glEnable)
{
    const halfDelta = vec2((posB.x - posA.x)/2, (posB.y - posA.y)/2);
    const size = vec2(thickness, halfDelta.length()*2);
    drawRect(posA.add(halfDelta), size, color, halfDelta.angle(), useWebGL);
}

/** Draw directly to a 2d canvas context in world space
 *  @param {Vector2}  pos
 *  @param {Vector2}  size
 *  @param {Number}   angle
 *  @param {Boolean}  mirror
 *  @param {Function} drawFunction
 *  @param {CanvasRenderingContext2D} [context=mainContext]
 *  @memberof Draw */
function drawCanvas2D(pos, size, angle, mirror, drawFunction, context = mainContext)
{
    // create canvas transform from world space to screen space
    pos = worldToScreen(pos);
    size = size.scale(cameraScale);
    context.save();
    context.translate(pos.x+.5|0, pos.y+.5|0);
    context.rotate(angle);
    context.scale(mirror ? -size.x : size.x, size.y);
    drawFunction(context);
    context.restore();
}

/** Enable normal or additive blend mode
 *  @param {Boolean} [additive=0]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function setBlendMode(additive, useWebGL=glEnable)
{
    // if (glEnable && useWebGL)
    //     glSetBlendMode(additive);
    // else
        mainContext.globalCompositeOperation = additive ? 'lighter' : 'source-over';
}

/** Draw text on overlay canvas in screen space
 *  Automatically splits new lines into rows
 *  @param {String}  text
 *  @param {Vector2} pos
 *  @param {Number}  [size=1]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Number}  [lineWidth=0]
 *  @param {Color}   [lineColor=new Color(0,0,0)]
 *  @param {String}  [textAlign='center']
 *  @memberof Draw */
function drawTextScreen(text, pos, size=1, color=new Color, lineWidth=0, lineColor=new Color(0,0,0), textAlign='center', font=fontDefault)
{
    overlayContext.fillStyle = color;
    overlayContext.lineWidth = lineWidth;
    overlayContext.strokeStyle = lineColor;
    overlayContext.textAlign = textAlign;
    overlayContext.font = size + 'px '+ font;
    overlayContext.textBaseline = 'middle';
    overlayContext.lineJoin = 'round';

    pos = pos.copy();
    (text+'').split('\n').forEach(line=>
    {
        lineWidth && overlayContext.strokeText(line, pos.x, pos.y);
        overlayContext.fillText(line, pos.x, pos.y);
        pos.y += size;
    });
}

/** Draw text on overlay canvas in world space
 *  Automatically splits new lines into rows
 *  @param {String}  text
 *  @param {Vector2} pos
 *  @param {Number}  [size=1]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Number}  [lineWidth=0]
 *  @param {Color}   [lineColor=new Color(0,0,0)]
 *  @param {String}  [textAlign='center']
 *  @memberof Draw */
function drawText(text, pos, size=1, color, lineWidth, lineColor, textAlign, font)
{
    drawTextScreen(text, worldToScreen(pos), size*cameraScale, color, lineWidth*cameraScale, lineColor, textAlign, font);
}

///////////////////////////////////////////////////////////////////////////////

/** 
 * Font Image Object - Draw text on a 2D canvas by using characters in an image
 * <br> - 96 characters (from space to tilde) are stored in an image
 * <br> - Uses a default 8x8 font if none is supplied
 * <br> - You can also use fonts from the main tile sheet
 * @example
 * // use built in font
 */

///////////////////////////////////////////////////////////////////////////////
// Fullscreen mode

/** Returns true if fullscreen mode is active
 *  @return {Boolean}
 *  @memberof Draw */
const isFullscreen =()=> document.fullscreenElement;

/** Toggle fullsceen mode
 *  @memberof Draw */
function toggleFullscreen()
{
    if (isFullscreen())
    {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
    }
    else
    {
        if (document.body.webkitRequestFullScreen)
            document.body.webkitRequestFullScreen();
        else if (document.body.mozRequestFullScreen)
            document.body.mozRequestFullScreen();
    }
}
/** 
 * LittleJS Input System
 * <br> - Tracks key down, pressed, and released
 * <br> - Also tracks mouse buttons, position, and wheel
 * <br> - Supports multiple gamepads
 * <br> - Virtual gamepad for touch devices with touchGamepadSize
 * @namespace Input
 */

'use strict';

/** Returns true if device key is down
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyIsDown = (key, device=0)=> inputData[device] && inputData[device][key] & 1 ? 1 : 0;

/** Returns true if device key was pressed this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasPressed = (key, device=0)=> inputData[device] && inputData[device][key] & 2 ? 1 : 0;

/** Returns true if device key was released this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasReleased = (key, device=0)=> inputData[device] && inputData[device][key] & 4 ? 1 : 0;

/** Clears all input
 *  @memberof Input */
const clearInput = ()=> inputData = [[]];

/** Returns true if mouse button is down
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseIsDown = keyIsDown;

/** Returns true if mouse button was pressed
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasPressed = keyWasPressed;

/** Returns true if mouse button was released
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasReleased = keyWasReleased;

/** Mouse pos in world space
 *  @type {Vector2}
 *  @memberof Input */
let mousePos = vec2();

/** Mouse pos in screen space
 *  @type {Vector2}
 *  @memberof Input */
let mousePosScreen = vec2();

/** Mouse wheel delta this frame
 *  @memberof Input */
let mouseWheel = 0;

/** Returns true if user is using gamepad (has more recently pressed a gamepad button)
 *  @memberof Input */
let isUsingGamepad = 0;

/** Prevents input continuing to the default browser handling (false by default)
 *  @memberof Input */
let preventDefaultInput = 0;

// /** Returns true if gamepad button is down
//  *  @param {Number} button
//  *  @param {Number} [gamepad=0]
//  *  @return {Boolean}
//  *  @memberof Input */
// let gamepadIsDown = (button, gamepad=0)=> keyIsDown(button, gamepad+1);

// /** Returns true if gamepad button was pressed
//  *  @param {Number} button
//  *  @param {Number} [gamepad=0]
//  *  @return {Boolean}
//  *  @memberof Input */
// let gamepadWasPressed = (button, gamepad=0)=> keyWasPressed(button, gamepad+1);

// /** Returns true if gamepad button was released
//  *  @param {Number} button
//  *  @param {Number} [gamepad=0]
//  *  @return {Boolean}
//  *  @memberof Input */
// let gamepadWasReleased = (button, gamepad=0)=> keyWasReleased(button, gamepad+1);

// /** Returns gamepad stick value
//  *  @param {Number} stick
//  *  @param {Number} [gamepad=0]
//  *  @return {Vector2}
//  *  @memberof Input */
// const gamepadStick = (stick,  gamepad=0)=> stickData[gamepad] ? stickData[gamepad][stick] || vec2() : vec2();

///////////////////////////////////////////////////////////////////////////////
// Input update called by engine

// store input as a bit field for each key: 1 = isDown, 2 = wasPressed, 4 = wasReleased
// mouse and keyboard are stored together in device 0, gamepads are in devices > 0
let inputData = [[]];

function inputUpdate()
{
    // clear input when lost focus (prevent stuck keys)
    document.hasFocus() || clearInput();

    // update mouse world space position
    mousePos = screenToWorld(mousePosScreen);
}

function inputUpdatePost()
{
    // clear input to prepare for next frame
    for (const deviceInputData of inputData)
    for (const i in deviceInputData)
        deviceInputData[i] &= 1;
    mouseWheel = 0;
}

///////////////////////////////////////////////////////////////////////////////
// Keyboard event handlers

onkeydown = (e)=>
{
    // if (debug && e.target != document.body) return;
    e.repeat || (inputData[isUsingGamepad = 0][remapKeyCode(e.keyCode)] = 3);
    preventDefaultInput && e.preventDefault();
}
onkeyup = (e)=>
{
    // if (debug && e.target != document.body) return;
    inputData[0][remapKeyCode(e.keyCode)] = 4;
}
const remapKeyCode = (c)=> inputWASDEmulateDirection ? c==87?38 : c==83?40 : c==65?37 : c==68?39 : c : c;

///////////////////////////////////////////////////////////////////////////////
// Mouse event handlers

onmousedown = (e)=> {inputData[isUsingGamepad = 0][e.button] = 3; onmousemove(e); e.button && e.preventDefault();}
onmouseup   = (e)=> inputData[0][e.button] = inputData[0][e.button] & 2 | 4;
onmousemove = (e)=> mousePosScreen = mouseToScreen(e);
onwheel = (e)=> e.ctrlKey || (mouseWheel = sign(e.deltaY));
oncontextmenu = (e)=> !1; // prevent right click menu

// convert a mouse or touch event position to screen space
const mouseToScreen = (mousePos)=>
{
    if (!mainCanvas)
        return vec2(); // fix bug that can occur if user clicks before page loads

    const rect = mainCanvas.getBoundingClientRect();
    return vec2(mainCanvas.width, mainCanvas.height).multiply(
        vec2(percent(mousePos.x, rect.left, rect.right), percent(mousePos.y, rect.top, rect.bottom)));
}

///////////////////////////////////////////////////////////////////////////////
// Gamepad input

// const stickData = [];
// function gamepadsUpdate()
// {
//     if (touchGamepadEnable && touchGamepadTimer.isSet())
//     {
//         // read virtual analog stick
//         const sticks = stickData[0] || (stickData[0] = []);
//         sticks[0] = vec2(touchGamepadStickLeft.x, -touchGamepadStickLeft.y); // flip vertical
//         // right stick
//         sticks[1] = vec2(touchGamepadStickRight.x, -touchGamepadStickRight.y); // flip vertical
//
//         // read virtual gamepad buttons
//         const data = inputData[1] || (inputData[1] = []);
//         for (let i=10; i--;)
//         {
//             const j = i == 3 ? 2 : i == 2 ? 3 : i; // fix button locations
//             data[j] = touchGamepadButtons[i] ? 1 + 2*!gamepadIsDown(j,0) : 4*gamepadIsDown(j,0);
//         }
//     }
//
//     if (!gamepadsEnable || !navigator.getGamepads || !document.hasFocus() && !debug)
//         return;
//
//     // poll gamepads
//     const gamepads = navigator.getGamepads();
//     for (let i = gamepads.length; i--;)
//     {
//         // get or create gamepad data
//         const gamepad = gamepads[i];
//         const data = inputData[i+1] || (inputData[i+1] = []);
//         const sticks = stickData[i] || (stickData[i] = []);
//
//         if (gamepad)
//         {
//             // read clamp dead zone of analog sticks
//             const deadZone = .3, deadZoneMax = .8;
//             const applyDeadZone = (v)=> 
//                 v >  deadZone ?  percent( v, deadZone, deadZoneMax) : 
//                 v < -deadZone ? -percent(-v, deadZone, deadZoneMax) : 0;
//
//             // read analog sticks
//             for (let j = 0; j < gamepad.axes.length-1; j+=2)
//                 sticks[j>>1] = vec2(applyDeadZone(gamepad.axes[j]), applyDeadZone(-gamepad.axes[j+1])).clampLength();
//             
//             // read buttons
//             for (let j = gamepad.buttons.length; j--;)
//             {
//                 const button = gamepad.buttons[j];
//                 data[j] = button.pressed ? 1 + 2*!gamepadIsDown(j,i) : 4*gamepadIsDown(j,i);
//                 isUsingGamepad |= !i && button.pressed;
//                 touchGamepadEnable && touchGamepadTimer.unset(); // disable touch gamepad if using real gamepad
//             }
//
//             if (gamepadDirectionEmulateStick)
//             {
//                 // copy dpad to left analog stick when pressed
//                 const dpad = vec2(gamepadIsDown(15,i) - gamepadIsDown(14,i), gamepadIsDown(12,i) - gamepadIsDown(13,i));
//                 if (dpad.lengthSquared())
//                     sticks[0] = dpad.clampLength();
//             }
//         }
//     }
// }

///////////////////////////////////////////////////////////////////////////////
// Touch input

/** True if a touch device has been detected
 *  @const {boolean}
 *  @memberof Input */
const isTouchDevice = window.ontouchstart !== undefined;

// try to enable touch mouse
if (isTouchDevice)
{
    // handle all touch events the same way
    let wasTouching, hadTouchInput;
    ontouchstart = ontouchmove = ontouchend = (e)=>
    {
        e.button = 0; // all touches are left click

        // check if touching and pass to mouse events
        const touching = e.touches.length;
        if (touching)
        {
            hadTouchInput || zzfx(0, hadTouchInput=1) ; // fix mobile audio, force it to play a sound the first time

            // set event pos and pass it along
            e.x = e.touches[0].clientX;
            e.y = e.touches[0].clientY;
            wasTouching ? onmousemove(e) : onmousedown(e);
        }
        else if (wasTouching)
            onmouseup(e);

        // set was touching
        wasTouching = touching;

        // prevent normal mouse events from being called
        return !e.cancelable;
    }
}

///////////////////////////////////////////////////////////////////////////////
// touch gamepad, virtual on screen gamepad emulator for touch devices

// touch input internal variables
// let touchGamepadTimer = new Timer,
//     touchGamepadButtons = [],
//     touchGamepadStickLeft = vec2(),
//     touchGamepadStickRight = vec2();

// create the touch gamepad, called automatically by the engine
// function touchGamepadCreate()
// {
//     if (!touchGamepadEnable || !isTouchDevice)
//         return;
//
//     ontouchstart = ontouchmove = ontouchend = (e)=> 
//     {
//         if (!touchGamepadEnable)
//             return;
//
//         // clear touch gamepad input
//         touchGamepadStickLeft = vec2();
//         touchGamepadStickRight = vec2();
//         touchGamepadButtons = [];
//             
//         const touching = e.touches.length;
//         if (touching)
//         {
//             touchGamepadTimer.isSet() || zzfx(0) ; // fix mobile audio, force it to play a sound the first time
//
//             // set that gamepad is active
//             isUsingGamepad = 1;
//             touchGamepadTimer.set();
//
//             // if (paused)
//             // {
//             //     // touch anywhere to press start when paused
//             //     touchGamepadButtons[9] = 1;
//             //     return;
//             // }
//         }
//
//         // get center of left and right sides
//         const stickCenterLeft = vec2(touchGamepadSize, mainCanvasSize.y-touchGamepadSize);
//         const stickCenterRight = mainCanvasSize.subtract(vec2(touchGamepadSize, touchGamepadSize));
//         // const buttonCenter = mainCanvasSize.subtract(vec2(touchGamepadSize, touchGamepadSize));
//         // const startCenter = mainCanvasSize.scale(.5);
//
//         // check each touch point
//         for (const touch of e.touches)
//         {
//             const touchPos = mouseToScreen(vec2(touch.clientX, touch.clientY));
//             if (touchPos.distance(stickCenterLeft) < touchGamepadSize)
//             {
//                 // virtual analog stick
//                 // if (touchGamepadAnalog)
//                 touchGamepadStickLeft = touchPos.subtract(stickCenterLeft).scale(2 / touchGamepadSize).clampLength();
//                 touchGamepadButtons[0] = 1;
//                 // else
//                 // {
//                 //     // 8 way dpad
//                 //     const angle = touchPos.subtract(stickCenter).angle();
//                 //     touchGamepadStick.setAngle((angle * 4 / PI + 8.5 | 0) * PI / 4);
//                 // }
//             }
//             if (touchPos.distance(stickCenterRight) < touchGamepadSize) {
//                 touchGamepadStickRight = touchPos.subtract(stickCenterRight).scale(2 / touchGamepadSize).clampLength();
//                 touchGamepadButtons[1] = 1;
//             }
//             // else if (touchPos.distance(buttonCenter) < touchGamepadSize)
//             // {
//             //     // virtual face buttons
//             //     const button = touchPos.subtract(buttonCenter).direction();
//             //     touchGamepadButtons[button] = 1;
//             // }
//             // else if (touchPos.distance(startCenter) < touchGamepadSize)
//             // {
//             //     // virtual start button in center
//             //     touchGamepadButtons[9] = 1;
//             // }
//         }
//     }
// }

// render the touch gamepad, called automatically by the engine
// function touchGamepadRender()
// {
//     if (!touchGamepadEnable || !touchGamepadTimer.isSet())
//         return;
//     
//     // fade off when not touching or paused
//     const alpha = percent(touchGamepadTimer.get(), 4, 3);
//     if (!alpha || paused)
//         return;
//
//     // setup the canvas
//     overlayContext.save();
//     overlayContext.globalAlpha = alpha*touchGamepadAlpha;
//     overlayContext.strokeStyle = '#fff';
//     overlayContext.lineWidth = 3;
//
//     // draw left analog stick
//     overlayContext.fillStyle = touchGamepadStickLeft.lengthSquared() > 0 ? '#fff' : '#000';
//     overlayContext.beginPath();
//
//     const leftCenter = vec2(touchGamepadSize, mainCanvasSize.y-touchGamepadSize);
//     overlayContext.arc(leftCenter.x, leftCenter.y, touchGamepadSize/2, 0, 9);
//     overlayContext.fill();
//     overlayContext.stroke();
//     
//     // draw right analog stick
//     const rightCenter = vec2(mainCanvasSize.x-touchGamepadSize, mainCanvasSize.y-touchGamepadSize);
//     overlayContext.fillStyle = touchGamepadStickRight.lengthSquared() > 0 ? '#fff' : '#000';
//     overlayContext.beginPath();
//     overlayContext.arc(rightCenter.x, rightCenter.y, touchGamepadSize/2, 0, 9);
//     overlayContext.fill();
//     overlayContext.stroke();
//
//     // set canvas back to normal
//     overlayContext.restore();
// }
/** 
 * LittleJS Audio System
 * <br> - <a href=https://killedbyapixel.github.io/ZzFX/>ZzFX Sound Effects</a>
 * <br> - <a href=https://keithclark.github.io/ZzFXM/>ZzFXM Music</a>
 * <br> - Caches sounds and music for fast playback
 * <br> - Can attenuate and apply stereo panning to sounds
 * <br> - Ability to play mp3, ogg, and wave files
 * <br> - Speech synthesis wrapper functions
 */

'use strict';

/** 
 * Sound Object - Stores a zzfx sound for later use and can be played positionally
 * <br>
 * <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 * @example
 * // create a sound
 * const sound_example = new Sound([.5,.5]);
 * 
 * // play the sound
 * sound_example.play();
 */
class Sound
{
    /** Create a sound object and cache the zzfx samples for later use
     *  @param {Array}  zzfxSound - Array of zzfx parameters, ex. [.5,.5]
     *  @param {Number} [range=soundDefaultRange] - World space max range of sound, will not play if camera is farther away
     *  @param {Number} [taper=soundDefaultTaper] - At what percentage of range should it start tapering off
     */
    constructor(zzfxSound, range=soundDefaultRange, taper=soundDefaultTaper)
    {
        if (!soundEnable) return;

        /** @property {Number} - World space max range of sound, will not play if camera is farther away */
        this.range = range;

        /** @property {Number} - At what percentage of range should it start tapering off */
        this.taper = taper;

        // get randomness from sound parameters
        this.randomness = zzfxSound[1] || 0;
        zzfxSound[1] = 0;

        // generate sound now for fast playback
        this.cachedSamples = zzfxG(...zzfxSound);
    }

    /** Play the sound
     *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
     *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
     *  @param {Number}  [pitch=1] - How much to scale pitch by (also adjusted by this.randomness)
     *  @param {Number}  [randomnessScale=1] - How much to scale randomness
     *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
     */
    play(pos, volume=1, pitch=1, randomnessScale=1)
    {
        if (!soundEnable) return;

        let pan = 0;
        if (pos)
        {
            const range = this.range;
            if (range)
            {
                // apply range based fade
                const lengthSquared = cameraPos.distanceSquared(pos);
                if (lengthSquared > range*range)
                    return; // out of range

                // attenuate volume by distance
                volume *= percent(lengthSquared**.5, range, range*this.taper);
            }

            // get pan from screen space coords
            pan = worldToScreen(pos).x * 2/mainCanvas.width - 1;
        }

        // play the sound
        const playbackRate = pitch + pitch * this.randomness*randomnessScale*rand(-1,1);
        return playSamples([this.cachedSamples], volume, playbackRate, pan);
    }

    /** Play the sound as a note with a semitone offset
     *  @param {Number}  semitoneOffset - How many semitones to offset pitch
     *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
     *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
     *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
     */
    playNote(semitoneOffset, pos, volume=1)
    {
        if (!soundEnable) return;

        return this.play(pos, volume, 2**(semitoneOffset/12), 0);
    }
}

/**
 * Music Object - Stores a zzfx music track for later use
 * <br>
 * <br><b><a href=https://keithclark.github.io/ZzFXM/>Create music with the ZzFXM tracker.</a></b>
 * @example
 * // create some music
 * const music_example = new Music(
 * [
 *     [                         // instruments
 *       [,0,400]                // simple note
 *     ], 
 *     [                         // patterns
 *         [                     // pattern 1
 *             [                 // channel 0
 *                 0, -1,        // instrument 0, left speaker
 *                 1, 0, 9, 1    // channel notes
 *             ], 
 *             [                 // channel 1
 *                 0, 1,         // instrument 1, right speaker
 *                 0, 12, 17, -1 // channel notes
 *             ]
 *         ],
 *     ],
 *     [0, 0, 0, 0], // sequence, play pattern 0 four times
 *     90            // BPM
 * ]);
 * 
 * // play the music
 * music_example.play();
 */
class Music
{
    /** Create a music object and cache the zzfx music samples for later use
     *  @param {Array} zzfxMusic - Array of zzfx music parameters
     */
    constructor(zzfxMusic)
    {
        if (!soundEnable) return;

        this.cachedSamples = zzfxM(...zzfxMusic);
    }

    /** Play the music
     *  @param {Number}  [volume=1] - How much to scale volume by
     *  @param {Boolean} [loop=1] - True if the music should loop when it reaches the end
     *  @return {AudioBufferSourceNode} - The audio node, can be used to stop sound later
     */
    play(volume = 1, loop = 1)
    {
        if (!soundEnable) return;

        this.source = playSamples(this.cachedSamples, volume, 1, 0, loop);
        return this.source;
    }

    /** Set the volume of the currently playing music
     *  @param {Number} volume - How much to scale volume by
     */
    setVolume(volume)
    {
        if (this.source && this.source.gainNode)
            this.source.gainNode.gain.value = soundVolume * volume;
    }
}

/** Get frequency of a note on a musical scale
 *  @param {Number} semitoneOffset - How many semitones away from the root note
 *  @param {Number} [rootNoteFrequency=220] - Frequency at semitone offset 0
 *  @return {Number} - The frequency of the note
 *  @memberof Audio */
const getNoteFrequency = (semitoneOffset, rootFrequency=220)=> rootFrequency * 2**(semitoneOffset/12); 

///////////////////////////////////////////////////////////////////////////////

/** Audio context used by the engine
 *  @memberof Audio */
let audioContext;

/** Play cached audio samples with given settings
 *  @param {Array}   sampleChannels - Array of arrays of samples to play (for stereo playback)
 *  @param {Number}  [volume=1] - How much to scale volume by
 *  @param {Number}  [rate=1] - The playback rate to use
 *  @param {Number}  [pan=0] - How much to apply stereo panning
 *  @param {Boolean} [loop=0] - True if the sound should loop when it reaches the end
 *  @return {AudioBufferSourceNode} - The audio node of the sound played
 *  @memberof Audio */
function playSamples(sampleChannels, volume=1, rate=1, pan=0, loop=0) 
{
    if (!soundEnable) return;

    // create audio context
    if (!audioContext)
        audioContext = new (window.AudioContext||webkitAudioContext);

    // fix stalled audio
    audioContext.resume();

    // create buffer and source
    const buffer = audioContext.createBuffer(sampleChannels.length, sampleChannels[0].length, zzfxR), 
        source = audioContext.createBufferSource();

    // copy samples to buffer and setup source
    sampleChannels.forEach((c,i)=> buffer.getChannelData(i).set(c));
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.loop = loop;

    // create and connect gain node (createGain is more widley spported then GainNode construtor)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundVolume*volume;
    gainNode.connect(audioContext.destination);

    // connect source to gain
    (
        window.StereoPannerNode ? // create pan node if possible
        source.connect(new StereoPannerNode(audioContext, {'pan':clamp(pan, -1, 1)}))
        : source
    )
    .connect(gainNode);

    // play and return sound
    source.start();
    source.gainNode = gainNode;
    return source;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 by Frank Force

/** Generate and play a ZzFX sound
 *  <br>
 *  <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 *  @param {Array} zzfxSound - Array of ZzFX parameters, ex. [.5,.5]
 *  @return {Array} - Array of audio samples
 *  @memberof Audio */
const zzfx = (...zzfxSound) => playSamples([zzfxG(...zzfxSound)]);

/** Sample rate used for all ZzFX sounds
 *  @default 44100
 *  @memberof Audio */
const zzfxR = 44100; 

/** Generate samples for a ZzFX sound
 *  @memberof Audio */
function zzfxG
(
    // parameters
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0
)
{
    // init parameters
    let PI2 = PI*2, startSlide = slide *= 500 * PI2 / zzfxR / zzfxR, b=[],
        startFrequency = frequency *= (1 + randomness*rand(-1,1)) * PI2 / zzfxR,
        t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;
        
    // scale by sample rate
    attack = attack * zzfxR + 9; // minimum attack to prevent pop
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;

    // generate waveform
    for (length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s)
    {
        if (!(++c%(bitCrush*100|0)))                      // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?         // wave shape
                Math.sin((t%PI2)**3) :                    // 4 noise
                max(min(Math.tan(t),1),-1):               // 3 tan
                1-(2*t/PI2%2+2)%2:                        // 2 saw
                1-4*abs(Math.round(t/PI2)-t/PI2):         // 1 triangle
                Math.sin(t);                              // 0 sin
                
            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(abs(s)**shapeCurve) *            // curve 0=square, 2=pointy
                volume * soundVolume * (                  // envelope
                i < attack ? i/attack :                   // attack
                i < attack + decay ?                      // decay
                1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                i < attack  + decay + sustain ?           // sustain
                sustainVolume :                           // sustain volume
                i < length - delay ?                      // release
                (length - i - delay)/release *            // release falloff
                sustainVolume :                           // release volume
                0);                                       // post release
 
            s = delay ? s/2 + (delay > i ? 0 :            // delay
                (i<length-delay? 1 : (length-i)/delay) *  // release delay 
                b[i-delay|0]/2) : s;                      // sample delay
        }

        f = (frequency += slide += deltaSlide) *          // frequency
            Math.cos(modulation*tm++);                    // modulation
        t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2);     // noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // reset pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }
    
    return b;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFX Music Renderer v2.0.3 by Keith Clark and Frank Force

/** Generate samples for a ZzFM song with given parameters
 *  @param {Array} instruments - Array of ZzFX sound paramaters
 *  @param {Array} patterns - Array of pattern data
 *  @param {Array} sequence - Array of pattern indexes
 *  @param {Number} [BPM=125] - Playback speed of the song in BPM
 *  @returns {Array} - Left and right channel sample data
 *  @memberof Audio */
function zzfxM(instruments, patterns, sequence, BPM = 125) 
{
  let instrumentParameters;
  let i;
  let j;
  let k;
  let note;
  let sample;
  let patternChannel;
  let notFirstBeat;
  let stop;
  let instrument;
  let attenuation;
  let outSampleOffset;
  let isSequenceEnd;
  let sampleOffset = 0;
  let nextSampleOffset;
  let sampleBuffer = [];
  let leftChannelBuffer = [];
  let rightChannelBuffer = [];
  let channelIndex = 0;
  let panning = 0;
  let hasMore = 1;
  let sampleCache = {};
  let beatLength = zzfxR / BPM * 60 >> 2;

  // for each channel in order until there are no more
  for (; hasMore; channelIndex++) {

    // reset current values
    sampleBuffer = [hasMore = notFirstBeat = outSampleOffset = 0];

    // for each pattern in sequence
    sequence.forEach((patternIndex, sequenceIndex) => {
      // get pattern for current channel, use empty 1 note pattern if none found
      patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

      // check if there are more channels
      hasMore |= !!patterns[patternIndex][channelIndex];

      // get next offset, use the length of first channel
      nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;
      // for each beat in pattern, plus one extra if end of sequence
      isSequenceEnd = sequenceIndex == sequence.length - 1;
      for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {

        // <channel-note>
        note = patternChannel[i];

        // stop if end, different instrument or new note
        stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
            instrument != (patternChannel[0] || 0) | note | 0;

        // fill buffer with samples for previous beat, most cpu intensive part
        for (j = 0; j < beatLength && notFirstBeat;

            // fade off attenuation at end of beat if stopping note, prevents clicking
            j++ > beatLength - 99 && stop ? attenuation += (attenuation < 1) / 99 : 0
        ) {
          // copy sample to stereo buffers with panning
          sample = (1 - attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
          leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
          rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
        }

        // set up for next note
        if (note) {
          // set attenuation
          attenuation = note % 1;
          panning = patternChannel[1] || 0;
          if (note |= 0) {
            // get cached sample
            sampleBuffer = sampleCache[
              [
                instrument = patternChannel[sampleOffset = 0] || 0,
                note
              ]
            ] = sampleCache[[instrument, note]] || (
                // add sample to cache
                instrumentParameters = [...instruments[instrument]],
                instrumentParameters[2] *= 2 ** ((note - 12) / 12),

                // allow negative values to stop notes
                note > 0 ? zzfxG(...instrumentParameters) : []
            );
          }
        }
      }

      // update the sample offset
      outSampleOffset = nextSampleOffset;
    });
  }

  return [leftChannelBuffer, rightChannelBuffer];
}
/** 
 * LittleJS Tile Layer System
 * <br> - Caches arrays of tiles to off screen canvas for fast rendering
 * <br> - Unlimted numbers of layers, allocates canvases as needed
 * <br> - Interfaces with EngineObject for collision
 * <br> - Collision layer is separate from visible layers
 * <br> - It is recommended to have a visible layer that matches the collision
 * <br> - Tile layers can be drawn to using their context with canvas2d
 * <br> - Drawn directly to the main canvas without using WebGL
 * @namespace TileCollision
 */

'use strict';

/** The tile collision layer array, use setTileCollisionData and getTileCollisionData to access
 *  @memberof TileCollision */
let tileCollision = [];

/** Size of the tile collision layer
 *  @type {Vector2} 
 *  @memberof TileCollision */
let tileCollisionSize = vec2();

/** Clear and initialize tile collision
 *  @param {Vector2} size
 *  @memberof TileCollision */
function initTileCollision(size)
{
    tileCollisionSize = size;
    tileCollision = [];
    for (let i=tileCollision.length = tileCollisionSize.area(); i--;)
        tileCollision[i] = 0;
}

/** Set tile collision data
 *  @param {Vector2} pos
 *  @param {Number}  [data=0]
 *  @memberof TileCollision */
const setTileCollisionData = (pos, data=0)=>
    pos.arrayCheck(tileCollisionSize) && (tileCollision[(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

/** Get tile collision data
 *  @param {Vector2} pos
 *  @return {Number}
 *  @memberof TileCollision */
const getTileCollisionData = (pos)=>
    pos.arrayCheck(tileCollisionSize) ? tileCollision[(pos.y|0)*tileCollisionSize.x+pos.x|0] : 0;

/** Check if collision with another object should occur
 *  @param {Vector2}      pos
 *  @param {Vector2}      [size=new Vector2(1,1)]
 *  @param {EngineObject} [object]
 *  @return {Boolean}
 *  @memberof TileCollision */
function tileCollisionTest(pos, size=vec2(), object)
{
    const minX = max(pos.x - size.x/2|0, 0);
    const minY = max(pos.y - size.y/2|0, 0);
    const maxX = min(pos.x + size.x/2, tileCollisionSize.x);
    const maxY = min(pos.y + size.y/2, tileCollisionSize.y);
    for (let y = minY; y < maxY; ++y)
    for (let x = minX; x < maxX; ++x)
    {
        const tileData = tileCollision[y*tileCollisionSize.x+x];
        if (tileData && (!object || object.collideWithTile(tileData, new Vector2(x, y))))
            return 1;
    }
}

/** Return the center of tile if any that is hit (this does not return the exact hit point)
 *  @param {Vector2}      posStart
 *  @param {Vector2}      posEnd
 *  @param {EngineObject} [object]
 *  @return {Vector2}
 *  @memberof TileCollision */
// function tileCollisionRaycast(posStart, posEnd, object)
// {
//     // test if a ray collides with tiles from start to end
//     // todo: a way to get the exact hit point, it must still register as inside the hit tile
//     posStart = posStart.floor();
//     posEnd = posEnd.floor();
//     const posDelta = posEnd.subtract(posStart);
//     const dx = abs(posDelta.x),  dy = -abs(posDelta.y);
//     const sx = sign(posDelta.x), sy = sign(posDelta.y);
//     let e = dx + dy;
//
//     for (let x = posStart.x, y = posStart.y;;)
//     {
//         const tileData = getTileCollisionData(vec2(x,y));
//         if (tileData && (object ? object.collideWithTileRaycast(tileData, new Vector2(x, y)) : tileData > 0))
//         {
//             // debugRaycast && debugLine(posStart, posEnd, '#f00',.02, 1);
//             // debugRaycast && debugPoint(new Vector2(x+.5, y+.5), '#ff0', 1);
//             return new Vector2(x+.5, y+.5);
//         }
//
//         // update Bresenham line drawing algorithm
//         if (x == posEnd.x & y == posEnd.y) break;
//         const e2 = 2*e;
//         if (e2 >= dy) e += dy, x += sx;
//         if (e2 <= dx) e += dx, y += sy;
//     }
//     // debugRaycast && debugLine(posStart, posEnd, '#00f',.02, 1);
// }

///////////////////////////////////////////////////////////////////////////////
// Tile Layer Rendering System

/**
 * Tile layer data object stores info about how to render a tile
 * @example
 * // create tile layer data with tile index 0 and random orientation and color
 * const tileIndex = 0;
 * const direction = randInt(4)
 * const mirror = randInt(2);
 * const color = randColor();
 * const data = new TileLayerData(tileIndex, direction, mirror, color);
 */
class TileLayerData
{
    /** Create a tile layer data object, one for each tile in a TileLayer
     *  @param {Number}  [tile]                   - The tile to use, untextured if undefined
     *  @param {Number}  [direction=0]            - Integer direction of tile, in 90 degree increments
     *  @param {Boolean} [mirror=0]               - If the tile should be mirrored along the x axis
     *  @param {Color}   [color=new Color(1,1,1)] - Color of the tile */
    constructor(tile, direction=0, mirror=0, color=new Color)
    {
        /** @property {Number}  - The tile to use, untextured if undefined */
        this.tile      = tile;
        /** @property {Number}  - Integer direction of tile, in 90 degree increments */
        this.direction = direction;
        /** @property {Boolean} - If the tile should be mirrored along the x axis */
        this.mirror    = mirror;
        /** @property {Color}   - Color of the tile */
        this.color     = color;
    }

    /** Set this tile to clear, it will not be rendered */
    clear() { this.tile = this.direction = this.mirror = 0; color = new Color; }
}

/**
 * Tile layer object - cached rendering system for tile layers
 * <br> - Each Tile layer is rendered to an off screen canvas
 * <br> - To allow dynamic modifications, layers are rendered using canvas 2d
 * <br> - Some devices like mobile phones are limited to 4k texture resolution
 * <br> - So with 16x16 tiles this limits layers to 256x256 on mobile devices
 * @extends EngineObject
 * @example
 * // create tile collision and visible tile layer
 * initTileCollision(vec2(200,100));
 * const tileLayer = new TileLayer();
 */
class TileLayer extends EngineObject
{
	/** Create a tile layer object
    *  @param {Vector2} [position=new Vector2()]   - World space position
    *  @param {Vector2} [size=tileCollisionSize]   - World space size
    *  @param {Vector2} [tileSize=tileSizeDefault] - Size of tiles in source pixels
    *  @param {Vector2} [scale=new Vector2(1,1)]   - How much to scale this layer when rendered
    *  @param {Number}  [renderOrder=0]            - Objects sorted by renderOrder before being rendered
    */
	constructor(pos, size=tileCollisionSize, tileSize=tileSizeDefault, scale=vec2(1), renderOrder=0)
    {
        super(pos, size, -1, tileSize, 0, undefined, renderOrder);

        /** @property {HTMLCanvasElement}        - The canvas used by this tile layer */
        this.canvas = document.createElement('canvas');
        /** @property {CanvasRenderingContext2D} - The 2D canvas context used by this tile layer */
        this.context = this.canvas.getContext('2d');
        /** @property {Vector2}                  - How much to scale this layer when rendered */
        this.scale = scale;
        /** @property {Boolean} [isOverlay=0]    - If true this layer will render to overlay canvas and appear above all objects */
        this.isOverlay;

        // init tile data
        this.data = [];
        for (let j = this.size.area(); j--;)
            this.data.push(new TileLayerData());
    }
    
    /** Set data at a given position in the array 
     *  @param {Vector2}       position   - Local position in array
     *  @param {TileLayerData} data       - Data to set
     *  @param {Boolean}       [redraw=0] - Force the tile to redraw if true */
    setData(layerPos, data, redraw)
    {
        if (layerPos.arrayCheck(this.size))
        {
            this.data[(layerPos.y|0)*this.size.x+layerPos.x|0] = data;
            redraw && this.drawTileData(layerPos);
        }
    }
    
    /** Get data at a given position in the array 
     *  @param {Vector2} layerPos - Local position in array
     *  @return {TileLayerData} */
    getData(layerPos)
    { return layerPos.arrayCheck(this.size) && this.data[(layerPos.y|0)*this.size.x+layerPos.x|0]; }
    
    // Tile layers are not updated
    update() {}

	// do nothing
	render() { }

    // Render the tile layer, called automatically by the engine
    renderNow()
    {
        // ASSERT(mainContext != this.context); // must call redrawEnd() after drawing tiles

        // flush and copy gl canvas because tile canvas does not use webgl
//        glEnable && !glOverlay && !this.isOverlay && glCopyToContext(mainContext);
        
        // draw the entire cached level onto the canvas
        const pos = worldToScreen(this.pos.add(vec2(0,this.size.y*this.scale.y)));
        (this.isOverlay ? overlayContext : mainContext).drawImage
        (
            this.canvas, pos.x, pos.y,
            cameraScale*this.size.x*this.scale.x, cameraScale*this.size.y*this.scale.y
        );
    }

    /** Draw all the tile data to an offscreen canvas 
     *  - This may be slow in some browsers
    */
    redraw()
    {
        this.redrawStart(1);
        this.drawAllTileData();
        this.redrawEnd();
    }

    /** Call to start the redraw process
     *  @param {Boolean} [clear=0] - Should it clear the canvas before drawing */
    redrawStart(clear = 0)
    {
        if (clear)
        {
            // clear and set size
            this.canvas.width  = this.size.x * this.tileSize.x;
            this.canvas.height = this.size.y * this.tileSize.y;
        }

        // save current render settings
        this.savedRenderSettings = [mainCanvas, mainContext, cameraPos, cameraScale];

        // use normal rendering system to render the tiles
        mainCanvas = this.canvas;
        mainContext = this.context;
        cameraPos = this.size.scale(.5);
        cameraScale = this.tileSize.x;
        enginePreRender();
    }

    /** Call to end the redraw process */
    redrawEnd()
    {
        // ASSERT(mainContext == this.context); // must call redrawStart() before drawing tiles
        //glCopyToContext(mainContext, 1);
        //debugSaveCanvas(this.canvas);

        // set stuff back to normal
        [mainCanvas, mainContext, cameraPos, cameraScale] = this.savedRenderSettings;
    }

    /** Draw the tile at a given position
     *  @param {Vector2} layerPos */
    drawTileData(layerPos)
    {
        // first clear out where the tile was
        const pos = layerPos.floor().add(this.pos).add(vec2(.5));
        this.drawCanvas2D(pos, vec2(1), 0, 0, (context)=>context.clearRect(-.5, -.5, 1, 1));

        // draw the tile if not undefined
        const d = this.getData(layerPos);
        if (d.tile != undefined)
        {
            // ASSERT(mainContext == this.context); // must call redrawStart() before drawing tiles
            drawTile(pos, vec2(1), d.tile, this.tileSize, d.color, d.direction*PI/2, d.mirror);
        }
    }

    /** Draw all the tiles in this layer */
    drawAllTileData()
    {
        for (let x = this.size.x; x--;)
        for (let y = this.size.y; y--;)
             this.drawTileData(vec2(x,y));
    }

    /** Draw directly to the 2D canvas in world space (bipass webgl)
     *  @param {Vector2}  pos
     *  @param {Vector2}  size
     *  @param {Number}   [angle=0]
     *  @param {Boolean}  [mirror=0]
     *  @param {Function} drawFunction */
    drawCanvas2D(pos, size, angle=0, mirror, drawFunction)
    {
        const context = this.context;
        context.save();
        pos = pos.subtract(this.pos).multiply(this.tileSize);
        size = size.multiply(this.tileSize);
        context.translate(pos.x, this.canvas.height - pos.y);
        context.rotate(angle);
        context.scale(mirror ? -size.x : size.x, size.y);
        drawFunction(context);
        context.restore();
    }

    /** Draw a tile directly onto the layer canvas
     *  @param {Vector2} pos
     *  @param {Vector2} [size=new Vector2(1,1)]
     *  @param {Number}  [tileIndex=-1]
     *  @param {Vector2} [tileSize=tileSizeDefault]
     *  @param {Color}   [color=new Color(1,1,1)]
     *  @param {Number}  [angle=0]
     *  @param {Boolean} [mirror=0] */
    drawTile(pos, size=vec2(1), tileIndex=-1, tileSize=tileSizeDefault, color=new Color, angle, mirror)
    {
        this.drawCanvas2D(pos, size, angle, mirror, (context)=>
        {
            if (tileIndex < 0)
            {
                // untextured
                context.fillStyle = color;
                context.fillRect(-.5, -.5, 1, 1);
            }
            else
            {
                const cols = tileImage.width/tileSize.x;
                context.globalAlpha = color.a; // only alpha, no color, is supported in this mode
                context.drawImage(tileImage, 
					(tileIndex % cols) * tileSize.x, (tileIndex / cols | 0) * tileSize.y, 
                    tileSize.x, tileSize.y, -.5, -.5, 1, 1);
            }
        });
    }

    /** Draw a rectangle directly onto the layer canvas
     *  @param {Vector2} pos
     *  @param {Vector2} [size=new Vector2(1,1)]
     *  @param {Color}   [color=new Color(1,1,1)]
     *  @param {Number}  [angle=0] */
    drawRect(pos, size, color, angle) 
    { this.drawTile(pos, size, -1, 0, color, angle); }
}
/*
    LittleJS Particle System
    - Spawns particles with randomness from parameters
    - Updates particle physics
    - Fast particle rendering
*/

'use strict';

/**
 * Particle Emitter - Spawns particles with the given settings
 * @extends EngineObject
 * @example
 * // create a particle emitter
 * let pos = vec2(2,3);
 * let particleEmiter = new ParticleEmitter
 * (
 *     pos, 0, 1, 0, 500, PI,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
 *     0, vec2(16),                            // tileIndex, tileSize
 *     new Color(1,1,1),   new Color(0,0,0),   // colorStartA, colorStartB
 *     new Color(1,1,1,0), new Color(0,0,0,0), // colorEndA, colorEndB
 *     2, .2, .2, .1, .05,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
 *     .99, 1, 1, PI, .05,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
 *     .5, 1                // randomness, collide, additive, randomColorLinear, renderOrder
 * );
 */
class ParticleEmitter extends EngineObject
{
    /** Create a particle system with the given settings
     *  @param {Vector2} position           - World space position of the emitter
     *  @param {Number}  [angle=0]          - Angle to emit the particles
     *  @param {Number}  [emitSize=0]       - World space size of the emitter (float for circle diameter, vec2 for rect)
     *  @param {Number}  [emitTime=0]       - How long to stay alive (0 is forever)
     *  @param {Number}  [emitRate=100]     - How many particles per second to spawn, does not emit if 0
     *  @param {Number}  [emitConeAngle=PI] - Local angle to apply velocity to particles from emitter
     *  @param {Number}  [tileIndex=-1]     - Index into tile sheet, if <0 no texture is applied
     *  @param {Number}  [tileSize=tileSizeDefault]     - Tile size for particles
     *  @param {Color}   [colorStartA=new Color(1,1,1)] - Color at start of life 1, randomized between start colors
     *  @param {Color}   [colorStartB=new Color(1,1,1)] - Color at start of life 2, randomized between start colors
     *  @param {Color}   [colorEndA=new Color(1,1,1,0)] - Color at end of life 1, randomized between end colors
     *  @param {Color}   [colorEndB=new Color(1,1,1,0)] - Color at end of life 2, randomized between end colors
     *  @param {Number}  [particleTime=.5]      - How long particles live
     *  @param {Number}  [sizeStart=.1]         - How big are particles at start
     *  @param {Number}  [sizeEnd=1]            - How big are particles at end
     *  @param {Number}  [speed=.1]             - How fast are particles when spawned
     *  @param {Number}  [angleSpeed=.05]       - How fast are particles rotating
     *  @param {Number}  [damping=1]            - How much to dampen particle speed
     *  @param {Number}  [angleDamping=1]       - How much to dampen particle angular speed
     *  @param {Number}  [gravityScale=0]       - How much does gravity effect particles
     *  @param {Number}  [particleConeAngle=PI] - Cone for start particle angle
     *  @param {Number}  [fadeRate=.1]          - How quick to fade in particles at start/end in percent of life
     *  @param {Number}  [randomness=.2]        - Apply extra randomness percent
     *  @param {Boolean} [collideTiles=0]       - Do particles collide against tiles
     *  @param {Boolean} [additive=0]           - Should particles use addtive blend
     *  @param {Boolean} [randomColorLinear=1]  - Should color be randomized linearly or across each component
     *  @param {Number}  [renderOrder=0]        - Render order for particles (additive is above other stuff by default)
     */
    constructor
    ( 
        pos,
        angle,
        emitSize = 0,
        emitTime = 0,
        emitRate = 100,
        emitConeAngle = PI,
        tileIndex = -1,
        tileSize = tileSizeDefault,
        colorStartA = new Color,
        colorStartB = new Color,
        colorEndA = new Color(1,1,1,0),
        colorEndB = new Color(1,1,1,0),
        particleTime = .5,
        sizeStart = .1,
        sizeEnd = 1,
        speed = .1,
        angleSpeed = .05,
        damping = 1,
        angleDamping = 1,
        gravityScale = 0,
        particleConeAngle = PI,
        fadeRate = .1,
        randomness = .2, 
        collideTiles,
        additive,
        randomColorLinear = 1,
        renderOrder = additive ? 1e9 : 0
    )
    {
        super(pos, new Vector2, tileIndex, tileSize, angle, undefined, renderOrder);

        // emitter settings
        /** @property {Number} - World space size of the emitter (float for circle diameter, vec2 for rect) */
        this.emitSize = emitSize
        /** @property {Number} - How long to stay alive (0 is forever) */
        this.emitTime = emitTime;
        /** @property {Number} - How many particles per second to spawn, does not emit if 0 */
        this.emitRate = emitRate;
        /** @property {Number} - Local angle to apply velocity to particles from emitter */
        this.emitConeAngle = emitConeAngle;

        // color settings
        /** @property {Color} - Color at start of life 1, randomized between start colors */
        this.colorStartA = colorStartA;
        /** @property {Color} - Color at start of life 2, randomized between start colors */
        this.colorStartB = colorStartB;
        /** @property {Color} - Color at end of life 1, randomized between end colors */
        this.colorEndA   = colorEndA;
        /** @property {Color} - Color at end of life 2, randomized between end colors */
        this.colorEndB   = colorEndB;
        /** @property {Boolean} - Should color be randomized linearly or across each component */
        this.randomColorLinear = randomColorLinear;

        // particle settings
        /** @property {Number} - How long particles live */
        this.particleTime      = particleTime;
        /** @property {Number} - How big are particles at start */
        this.sizeStart         = sizeStart;
        /** @property {Number} - How big are particles at end */
        this.sizeEnd           = sizeEnd;
        /** @property {Number} - How fast are particles when spawned */
        this.speed             = speed;
        /** @property {Number} - How fast are particles rotating */
        this.angleSpeed        = angleSpeed;
        /** @property {Number} - How much to dampen particle speed */
        this.damping           = damping;
        /** @property {Number} - How much to dampen particle angular speed */
        this.angleDamping      = angleDamping;
        /** @property {Number} - How much does gravity effect particles */
        this.gravityScale      = gravityScale;
        /** @property {Number} - Cone for start particle angle */
        this.particleConeAngle = particleConeAngle;
        /** @property {Number} - How quick to fade in particles at start/end in percent of life */
        this.fadeRate          = fadeRate;
        /** @property {Number} - Apply extra randomness percent */
        this.randomness        = randomness;
        /** @property {Number} - Do particles collide against tiles */
        this.collideTiles      = collideTiles;
        /** @property {Number} - Should particles use addtive blend */
        this.additive          = additive;
        /** @property {Number} - If set the partile is drawn as a trail, stretched in the drection of velocity */
        // this.trailScale        = 0;

        // internal variables
        this.emitTimeBuffer    = 0;
    }
    
    /** Update the emitter to spawn particles, called automatically by engine once each frame */
    update()
    {
        // only do default update to apply parent transforms
        this.parent && super.update();

        // update emitter
        if (!this.emitTime || this.getAliveTime() <= this.emitTime)
        {
            // emit particles
            if (this.emitRate * particleEmitRateScale)
            {
                const rate = 1/this.emitRate/particleEmitRateScale;
                for (this.emitTimeBuffer += timeDelta; this.emitTimeBuffer > 0; this.emitTimeBuffer -= rate)
                    this.emitParticle();
            }
        }
        else
            this.destroy();

        // debugParticles && debugRect(this.pos, vec2(this.emitSize), '#0f0', 0, this.angle);
    }

    /** Spawn one particle
     *  @return {Particle} */
    emitParticle()
    {
        // spawn a particle
        const pos = this.emitSize.x != undefined ? // check if vec2 was used for size
            (new Vector2(rand(-.5,.5), rand(-.5,.5))).multiply(this.emitSize).rotate(this.angle) // box emitter
            : randInCircle(this.emitSize * .5);                                                  // circle emitter
        const particle = new Particle(this.pos.add(pos), this.tileIndex, this.tileSize, 
            this.angle + rand(this.particleConeAngle, -this.particleConeAngle));

        // randomness scales each paremeter by a percentage
        const randomness = this.randomness;
        const randomizeScale = (v)=> v + v*rand(randomness, -randomness);

        // randomize particle settings
        const particleTime = randomizeScale(this.particleTime);
        const sizeStart    = randomizeScale(this.sizeStart);
        const sizeEnd      = randomizeScale(this.sizeEnd);
        const speed        = randomizeScale(this.speed);
        const angleSpeed   = randomizeScale(this.angleSpeed) * randSign();
        const coneAngle    = rand(this.emitConeAngle, -this.emitConeAngle);
        const colorStart   = randColor(this.colorStartA, this.colorStartB, this.randomColorLinear);
        const colorEnd     = randColor(this.colorEndA,   this.colorEndB, this.randomColorLinear);

        // build particle settings
        particle.colorStart    = colorStart;
        particle.colorEndDelta = colorEnd.subtract(colorStart);
        particle.velocity      = (new Vector2).setAngle(this.angle + coneAngle, speed);
        particle.angleVelocity = angleSpeed;
        particle.lifeTime      = particleTime;
        particle.sizeStart     = sizeStart;
        particle.sizeEndDelta  = sizeEnd - sizeStart;
        particle.fadeRate      = this.fadeRate;
        particle.damping       = this.damping;
        particle.angleDamping  = this.angleDamping;
        particle.elasticity    = this.elasticity;
        particle.friction      = this.friction;
        particle.gravityScale  = this.gravityScale;
        particle.collideTiles  = this.collideTiles;
        particle.additive      = this.additive;
        particle.renderOrder   = this.renderOrder;
        // particle.trailScale    = this.trailScale;
        particle.mirror        = rand()<.5;

        // setup callbacks for particles
        particle.destroyCallback = this.particleDestroyCallback;
        this.particleCreateCallback && this.particleCreateCallback(particle);

        // return the newly created particle
        return particle;
    }

    // Particle emitters are not rendered, only the particles are
    render() {}
}

///////////////////////////////////////////////////////////////////////////////
/**
 * Particle Object - Created automatically by Particle Emitters
 * @extends EngineObject
 */
class Particle extends EngineObject
{
    /**
     * Create a particle with the given settings
     * @param {Vector2} position                   - World space position of the particle
     * @param {Number}  [tileIndex=-1]             - Tile to use to render, untextured if -1
     * @param {Vector2} [tileSize=tileSizeDefault] - Size of tile in source pixels
     * @param {Number}  [angle=0]                  - Angle to rotate the particle
     */
    constructor(pos, tileIndex, tileSize, angle) { super(pos, new Vector2, tileIndex, tileSize, angle); }

    /** Render the particle, automatically called each frame, sorted by renderOrder */
    render()
    {
        // modulate size and color
        const p = min((time - this.spawnTime) / this.lifeTime, 1);
        const radius = this.sizeStart + p * this.sizeEndDelta;
        const size = new Vector2(radius, radius);
        const fadeRate = this.fadeRate/2;
        const color = new Color(
            this.colorStart.r + p * this.colorEndDelta.r,
            this.colorStart.g + p * this.colorEndDelta.g,
            this.colorStart.b + p * this.colorEndDelta.b,
            (this.colorStart.a + p * this.colorEndDelta.a) * 
             (p < fadeRate ? p/fadeRate : p > 1-fadeRate ? (1-p)/fadeRate : 1)); // fade alpha

        // draw the particle
        this.additive && setBlendMode(1);
        // if (this.trailScale)
        // {
        //     // trail style particles
        //     const speed = this.velocity.length();
        //     const direction = this.velocity.scale(1/speed);
        //     const trailLength = speed * this.trailScale;
        //     size.y = max(size.x, trailLength);
        //     this.angle = direction.angle();
        //     drawTile(this.pos.add(direction.multiply(vec2(0,-trailLength/2))), size, this.tileIndex, this.tileSize, color, this.angle, this.mirror);
        // }
        // else
            drawTile(this.pos, size, this.tileIndex, this.tileSize, color, this.angle, this.mirror);
        this.additive && setBlendMode();
        // debugParticles && debugRect(this.pos, size, '#f005', 0, this.angle);

        if (p == 1)
        {
            // destroy particle when it's time runs out
            this.color = color;
            this.size = size;
            this.destroyCallback && this.destroyCallback(this);
            this.destroyed = 1;
        }
    }
}

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
// ===================
// 4×4 Block System — 2 bits per cell, 32 bits per block
// ===================
// Tile encoding: 0b00=floor1(8) 0b01=floor2(9) 0b10=wall1(10) 0b11=wall2(11)
// Row-major: bits 31-30 = cell(0,0), bits 1-0 = cell(3,3)
// Wall test: cell >= 2 (bit 1 set)

// Block 0: Open floor
//  . . . .    Block 1: Solid wall1
//  . . . .     W W W W
//  . . . .     W W W W
//  . . . .     W W W W
const B0=0,B1=0xAAAAAAAA;
// Block 2: Center pillar (2×2 wall1)
//  . . . .    Block 3: Checkerboard (floor1/floor2)
//  . W W .     . f . f
//  . W W .     f . f .
//  . . . .     . f . f
const B2=0x00282800,B3=0x11441144;
// Block 4: L-corner (wall1 top-left)
//  W W . .    Block 5: H-corridor (wall1 top+bottom)
//  W . . .     W W W W
//  . . . .     . . . .
//  . . . .     . . . .
const B4=0xA0800000,B5=0xAA0000AA;
// Block 6: Scatter (diagonal wall2 dots)
//  w . . .    Block 7: Mixed pillar (wall1+wall2 2×2)
//  . . w .     . . . .
//  . . . .     . W w .
//  . w . .     . w W .
const B6=0xC00C0030,B7=0x002C3800;

const BLOCKS=[B0,B1,B2,B3,B4,B5,B6,B7];

// Decode cell type (0-3) from a block bitmask at local row,col
function _cell(bv,r,c){return(bv>>>((15-(r*4+c))*2))&3}

// ===================
// Tutorial Level Definitions
// ===================
// Small arenas for the 4-step tutorial. Each has `tutorial: <step>` flag.
// Step 0: Move — empty room, pass after 1s movement
// Step 1: Shoot — 1 dummy enemy (doesn't fire), pass on kill
// Step 2: Dodge — 2 enemies fire, player can't shoot, pass after dodging 3 bullets
// Step 3: Combo — 1 enemy fires, kill it in 1 shot
const TUTORIAL_LEVELS = [
    { gw:4, gh:3, tutorial:0,
      blocks:[0,0,0,0, 0,0,0,0, 0,0,0,0],
      spawn:[8.5,5.5], enemies:[] },
    { gw:4, gh:3, tutorial:1,
      blocks:[0,0,0,0, 0,0,0,0, 0,0,0,0],
      spawn:[4.5,5.5], enemies:[[11.5,5.5],[8.5,8.5],[5.5,8.5]] },
    { gw:5, gh:3, tutorial:2,
      blocks:[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
      spawn:[10.5,5.5], enemies:[[4.5,9.5],[16.5,9.5]] },
    { gw:5, gh:3, tutorial:3,
      blocks:[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
      spawn:[10.5,5.5], enemies:[[16.5,5.5],[4.5,9.5],[16.5,9.5]] },
];

// ===================
// Level Definitions — block-based, coordinate spawns
// ===================
// gw/gh: grid in 4×4 blocks. blocks[]: row-major block indices.
// spawn:[x,y]  enemies:[[x,y,fireIdx,walks],...]  boss:[x,y]|null
const LEVEL_DEFINITIONS=[
    // {gw:6,gh:3, // Training Room (24×12)
    //  blocks:[0,0,0,0,0,0, 0,0,3,0,2,0, 0,0,0,0,0,0],
    //  spawn:[4.5,3.5],enemies:[[14.5,5.5]]},
    {gw:7,gh:3, // Crossfire Corridors (28×12)
     blocks:[0,0,0,0,0,0,0, 0,4,0,2,0,4,0, 0,0,0,3,0,0,0],
     spawn:[2.5,5.5],enemies:[[18.5,5.5],[14.5,9.5],[6.5,9.5],[22.5,9.5],[10.5,5.5]]},
    {gw:10,gh:6, // Final Showdown — Boss (40×24)
     blocks:[0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
     spawn:[6.5,5.5],enemies:[],boss:[20.5,12.5]},
];

// ===================
// Block → Tile Decoder
// ===================
function decodeLevelTiles(gw,gh,blocks){
    const w=gw*4,h=gh*4,walls=[],tileTypes=[];
    for(let x=0;x<w;x++)tileTypes[x]=[];
    for(let r=0;r<h;r++)for(let c=0;c<w;c++){
        const ty=h-1-r;
        let ct;
        if(r===0||r===h-1||c===0||c===w-1)ct=2;
        else{
            const bid=blocks[((r/4)|0)*gw+((c/4)|0)];
            ct=_cell(BLOCKS[bid],r%4,c%4);
        }
        tileTypes[c][ty]=ct;
        if(ct>=2)walls.push(vec2(c,ty));
    }
    return{walls,tileTypes,w,h};
}

// ===================
// Level Parser
// ===================
function parseLevelDefinition(level){
    const{gw,gh,blocks:bi}=level;
    const{walls,tileTypes,w,h}=decodeLevelTiles(gw,gh,bi);
    return{
        width:w,height:h,size:vec2(w,h),walls,tileTypes,
        enemies:(level.enemies||[]).map(e=>({pos:vec2(e[0],e[1])})),
        playerSpawn:vec2(level.spawn[0],level.spawn[1]),
        bossSpawn:level.boss?vec2(level.boss[0],level.boss[1]):null,
    };
}

// ===================
// Seeded PRNG (Mulberry32)
// ===================
function mulberry32(seed){
    let s=seed|0;
    return function(){
        s=s+0x6D2B79F5|0;
        let t=Math.imul(s^s>>>15,1|s);
        t=t+Math.imul(t^t>>>7,61|t)^t;
        return((t^t>>>14)>>>0)/4294967296;
    };
}

// ===================
// Infinite Level Generator
// ===================
let _proceduralCount=0;
const _IBLOCKS=[0,0,0,0,2,3,4,6,7]; // weighted interior blocks (no solid/corridor)

function _testWall(blocks,gw,w,h,cx,cy){
    if(cx<0||cy<0||cx>=w||cy>=h)return true;
    const r=h-1-cy,c=cx;
    if(r===0||r===h-1||c===0||c===w-1)return true;
    const bid=blocks[((r/4)|0)*gw+((c/4)|0)];
    return _cell(BLOCKS[bid],r%4,c%4)>=2;
}

function _clear(blocks,gw,w,h,cx,cy){
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)
        if(_testWall(blocks,gw,w,h,cx+dx,cy+dy))return false;
    return true;
}

function generateProceduralLevel(difficulty){
    difficulty=difficulty||1;
    _proceduralCount++;
    const rng=mulberry32(_proceduralCount*7919+difficulty*31);
    const ri=n=>(rng()*n)|0;
    const gw=min(6+((difficulty/2)|0),9),gh=min(3+((difficulty/3)|0),5);
    const w=gw*4,h=gh*4;
    const blocks=[];
    for(let by=0;by<gh;by++)for(let bx=0;bx<gw;bx++)
        blocks.push((bx===0||bx===gw-1||by===0||by===gh-1)?0:_IBLOCKS[ri(_IBLOCKS.length)]);
    // Ensure at least one wall block interior
    if(gw>2&&gh>2){
        let ok=false;
        for(let i=0;i<blocks.length;i++)if(blocks[i]!==0&&blocks[i]!==3){ok=true;break;}
        if(!ok)blocks[gw+1+ri(gw-2)]=_IBLOCKS[4+ri(_IBLOCKS.length-4)];
    }
    // Player spawn bottom-left with clearance
    let px=2,py=2;
    for(let a=0;a<50;a++){px=2+ri(4);py=2+ri(3);if(_clear(blocks,gw,w,h,px,py))break;}
    // Enemies scale with difficulty
    const cnt=min(2+difficulty,10),enemies=[];
    let att=0;
    while(enemies.length<cnt&&att++<300){
        const ex=2+ri(w-4),ey=2+ri(h-4);
        if(abs(ex-px)+abs(ey-py)<6)continue;
        if(!_clear(blocks,gw,w,h,ex,ey))continue;
        // Only spawn on B0 (open floor) blocks
        const br=((h-1-ey)/4)|0,bc=(ex/4)|0;
        if(blocks[br*gw+bc]!==0)continue;
        let ov=false;
        for(const e of enemies)if(abs(e[0]-ex)<2&&abs(e[1]-ey)<2){ov=true;break;}
        if(ov)continue;
        enemies.push([ex+.5,ey+.5]);
    }
    return{gw,gh,blocks,spawn:[px+.5,py+.5],enemies};
}

// ===================
// Shared Helpers
// ===================
const _GOLD = new Color(0.85, 0.65, 0.13, 1);
const _ACID = new Color(0.5, 1, 0.3, 0.6);
const _WHITE = new Color(1, 1, 1, 1);

/**
 * Compute gun sprite position, angle, and mirror for any entity.
 * @param {Vector2} ownerPos  - center of the entity
 * @param {Vector2} aimDir    - normalized facing/aim direction
 * @param {number}  halfDraw  - half of entity's drawSize (visual radius)
 * @param {number}  extra     - extra offset beyond edge (GFX.gun.offset or .enemyOffset)
 * @returns {{ gunPos: Vector2, tipPos: Vector2, angle: number, mirror: boolean }}
 */
function _gunTransform(ownerPos, aimDir, halfDraw, extra) {
    const g = GFX.gun;
    const orbitR = halfDraw + extra;
    const perp = vec2(aimDir.y, -aimDir.x);                 // 90° clockwise
    const anchor = ownerPos.add(perp.scale(g.perpDrop));
    const gunPos = anchor.add(aimDir.scale(orbitR));
    // tipPos: centerOffset.x along barrel, centerOffset.y perpendicular (up in world)
    const perpUp = vec2(-aimDir.y, aimDir.x);              // 90° counter-clockwise = up
    const mirror = aimDir.x < 0;
    const co = g.centerOffset;
    const tipPos = gunPos
        .add(aimDir.scale(co.x))
        .add(perpUp.scale(co.y * (mirror ? -1 : 1)));
    const a = Math.atan2(aimDir.y, aimDir.x);
    return { gunPos, tipPos, angle: -a - (mirror ? PI : 0), mirror };
}

/** Draw the gun sprite at the computed transform. */
function _drawGun(ownerPos, aimDir, halfDraw, extra) {
    const { gunPos, angle, mirror } = _gunTransform(ownerPos, aimDir, halfDraw, extra);
    drawTile(gunPos, GFX.gun.size, GFX.gun.tileIndex, GFX.gun.tileSize, new Color, angle, mirror);
}

/**
 * Spawn a player bullet plus muzzle flash particle & sound.
 * Centralizes the bullet+fx pattern used in main.js shooting code.
 */
function firePlayerBullet(origin, dir) {
    new Bullet(origin, dir);
    emitShotParticles(origin, dir, 0);
}

// ===================
// Game Objects
// ===================

class Player extends EngineObject {
    constructor(spawnPos) {
        const g = GFX.player;
        super(spawnPos.copy(), g.size, g.tileIndex, g.tileSize, 0, g.color);
        this.speed = getEffectivePlayerSpeed();
        this.velocity = vec2(0, 0);
        this.facing = vec2(1, 0);
        this.mass = 1;
        this.damping = 1;
        this.gravityScale = 0;
        this.setCollision(1, 1, 1);
    }
    update() {
        super.update();
        const halfX = this.size.x * 0.5;
        const halfY = this.size.y * 0.5;
        this.pos.x = clamp(this.pos.x, halfX, levelSize.x - halfX);
        this.pos.y = clamp(this.pos.y, halfY, levelSize.y - halfY);
        this.velocity = this.velocity.scale(GFX.player.damping);
    }

    /** Gun orbit radius — half the visual player size + gun config offset */
    get gunRadius() {
        return GFX.player.drawSize.x * 0.5 + GFX.gun.offset;
    }

    /** Normalized facing direction (safe fallback) */
    get aimDir() {
        return this.facing.length() > 0.001 ? this.facing.normalize() : vec2(1, 0);
    }

    /** World position of the gun tip (where bullets spawn) */
    get gunTip() {
        return _gunTransform(this.pos, this.aimDir, GFX.player.drawSize.x * 0.5, GFX.gun.offset).tipPos;
    }

    render() {
        // Animate: idle (tileIndex 0) vs walk (alternate 0 & walkFrame)
        const isMoving = this.velocity.length() > GAMEPLAY.moveThreshold;
        const tileIdx = isMoving
            ? GFX.player.tileIndex + ((time * 6 | 0) % 2) * GFX.player.walkFrame
            : GFX.player.tileIndex;
        const mirror = this.facing.x < 0;

        // Draw player sprite (2× dilation: drawSize from config, collision stays at size)
        drawTile(this.pos, GFX.player.drawSize, tileIdx, GFX.player.tileSize, new Color, 0, mirror);

        // Draw gun via shared helper (hidden when player can't shoot in tutorial)
        if (tutorialPhase !== 0 && tutorialPhase !== 2)
            _drawGun(this.pos, this.aimDir, GFX.player.drawSize.x * 0.5, GFX.gun.offset);
    }
}

class Bullet extends EngineObject {
    constructor(pos, dir, speed, color, fromPlayer = 1) {
        const g = fromPlayer ? GFX.bullet : GFX.turretBullet;
        super(pos.copy(), g.size, g.tileIndex, g.tileSize, 0, color ?? g.color ?? GFX.turret.color);
        this.direction = dir.normalize();
        this.speed     = speed  ?? (fromPlayer ? GFX.bullet.speed : g.speed);
        this.fromPlayer = fromPlayer;
        this.life      = g.life ?? GFX.bullet.life;
        this.damping = 1;
        this.gravityScale = 0;
        this.setCollision(1, 0, 1);
        // Trail
        const trailCfg = g.trail ?? GFX.bullet.trail;
        this.trail = { points: [], color: trailCfg.color };
        bulletTrails.push(this.trail);
    }
    update() {
        // Homing: curve toward the best target along line of fire
        if (this.fromPlayer && activeBuffs.homing) {
            const hc = GFX.bullet.homing;
            let bestTarget = null, bestScore = Infinity;
            const targets = [...turrets];
            if (boss && !boss.destroyed) targets.push(boss);
            for (const t of targets) {
                if (t.destroyed) continue;
                const toT = t.pos.subtract(this.pos);
                const dist = toT.length();
                if (dist < .01) continue;
                const ahead = toT.dot(this.direction);
                if (ahead < 0) continue;
                const perp = abs(toT.x * this.direction.y - toT.y * this.direction.x);
                const score = perp * hc.perpWeight + dist * hc.distWeight;
                if (score < bestScore) { bestScore = score; bestTarget = t; }
            }
            if (bestTarget) {
                const toT = bestTarget.pos.subtract(this.pos);
                const dist = toT.length();
                const strength = clamp(1 - (dist - hc.rangeMin) / hc.rangeFalloff, 0, 1) * hc.maxStrength;
                if (strength > 0) {
                    const desired = toT.normalize();
                    this.direction = this.direction.add(desired.scale(strength)).normalize();
                }
            }
        }
        this.velocity = this.direction.scale(this.speed * timeScale * timeDelta);
        super.update();
        // Record trail point
        if (this.trail.points.length >= GFX.bullet.trail.maxPts)
            this.trail.points.shift();
        this.trail.points.push({ pos: this.pos.copy(), alpha: 1 });
        this.life -= timeDelta * timeScale;
        if (this.life <= 0) this.destroy();
    }
    render() {
            // Negate angle: world Y-up → screen Y-down (drawRect rotates in screen space)
            const angle = -Math.atan2(this.direction.y, this.direction.x);
            if (this.fromPlayer) {
            // Elongated capsule aligned to flight direction
            const w = 0.30, h = 0.12;
            drawRect(this.pos, vec2(w, h), this.color, angle);
            // Gold tip at the nose, flush with the front edge
            const tipSize = h * 0.8;
            const nose = this.pos.add(this.direction.scale(w * 0.5));
            drawRect(nose, vec2(tipSize, tipSize), _GOLD, angle);
        } else {
            // Enemy: spinning diamond — slows with time dilation
            if (!this._spinAngle) this._spinAngle = 0;
            this._spinAngle += 8 * timeDelta * timeScale;
            const sz = 0.28;
            const g = GFX.turretBullet;
            // Outer glow ring
            drawRect(this.pos, vec2(sz * 1.6), new Color(1, 0.35, 0.1, .35), this._spinAngle);
            // Core diamond
            drawRect(this.pos, vec2(sz, sz), g.color || this.color, this._spinAngle);
        }
    }

    destroy() {
        if (this.destroyed) return;
        super.destroy();
    }
    collideWithTile(tileData, tilePos) {
        if (tileData > 0) {
            this.destroy();
            return 1;
        }
        return 0;
    }
    collideWithObject(o) {
        if (this.fromPlayer && o instanceof Turret) {
            this.destroy();
            emitDeathParticles(o.pos);
            playEnemyKillSound();
            o.destroy();
            reloadTimer = 0; // instant reload on hit
        }
        else if (this.fromPlayer && o instanceof Boss) {
            this.destroy();
            o.takeDamage(activeBuffs.homing ? 2 : 1);
            reloadTimer = 0; // instant reload on hit
        }
        else if (!this.fromPlayer && o instanceof Player) {
            this.destroy();
            emitDeathParticles(o.pos);
            killPlayer();
        }
        return 0;
    }
}

class TurretBullet extends Bullet {
    constructor(pos, dir, speedOverride) {
        super(pos, dir, speedOverride ?? GFX.turretBullet.speed, GFX.turret.color, 0);
        this._closestDist = Infinity; // track closest approach to player
    }
    update() {
        super.update();
        // Track closest approach to player for tutorial dodge detection
        if (player && tutorialPhase === 2) {
            const d = this.pos.subtract(player.pos).length();
            if (d < this._closestDist) this._closestDist = d;
        }
    }
    destroy() {
        // If this bullet got close to the player but didn't kill them, count as dodge
        if (tutorialPhase === 2 && this._closestDist < 3 && player && !restarting)
            tutorialDodgeCount++;
        super.destroy();
    }
}

class BossBullet extends Bullet {
    constructor(pos, dir, speed) {
        const g = GFX.bossBullet;
        super(pos, dir, speed ?? g.speed, g.color, 0);
        this.fromBoss = true;
        this._wobblePhase = this.pos.x * 3; // seed with position for variety
    }
    render() {
        // Wobbling acid glob — oval that squirms along perpendicular axis
        // Speed tied to timeScale so it slows with time dilation
        this._wobblePhase += 12 * timeDelta * timeScale;
        const angle = Math.atan2(this.direction.y, this.direction.x);
        const wobble = Math.sin(this._wobblePhase) * 0.06;
        const w = 0.26 + wobble;
        const h = 0.20 - wobble;
        drawRect(this.pos, vec2(w, h), this.color, angle);
        // Inner highlight for a "glossy blob" look
        drawRect(this.pos, vec2(w * 0.5, h * 0.5), _ACID, angle);
    }
}

function _slideMove(ent, step) {
    const s = ent.size;
    // Try full step
    const full = ent.pos.add(step);
    if (!tileCollisionTest(full, s)) { ent.pos = full; return true; }
    // Try X-only with margin push
    if (abs(step.x) > 0.0001) {
        const tryX = vec2(ent.pos.x + step.x, ent.pos.y);
        if (!tileCollisionTest(tryX, s)) { ent.pos = tryX; return true; }
    }
    // Try Y-only with margin push
    if (abs(step.y) > 0.0001) {
        const tryY = vec2(ent.pos.x, ent.pos.y + step.y);
        if (!tileCollisionTest(tryY, s)) { ent.pos = tryY; return true; }
    }
    return false;
}

// 8-directional BFS neighbours
const _BFS_DIRS = [
    vec2(1, 0), vec2(-1, 0), vec2(0, 1), vec2(0, -1),
    vec2(1, 1), vec2(-1, 1), vec2(1, -1), vec2(-1, -1),
];

/**
 * BFS pathfind on the tile collision grid.
 * Returns the next world-space waypoint the enemy should walk toward,
 * or null if no path exists / already at the goal.
 *
 * @param {Vector2} startWorld - enemy world position
 * @param {Vector2} goalWorld  - player world position
 * @returns {Vector2|null}     - next waypoint in world coords
 */
function _bfsNextWaypoint(startWorld, goalWorld) {
    // Convert world positions to tile coords (integer grid)
    const sx = startWorld.x | 0, sy = startWorld.y | 0;
    const gx = goalWorld.x  | 0, gy = goalWorld.y  | 0;
    const w  = tileCollisionSize.x | 0;
    const h  = tileCollisionSize.y | 0;

    if (sx === gx && sy === gy) return null; // already on goal tile

    // BFS with flat visited array keyed by (y * w + x)
    const visited = new Uint8Array(w * h);
    const queue   = [];     // each entry: { x, y, firstX, firstY }
    const startKey = sy * w + sx;
    visited[startKey] = 1;

    // Seed with neighbours of start
    for (const d of _BFS_DIRS) {
        const nx = sx + d.x, ny = sy + d.y;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        const key = ny * w + nx;
        if (visited[key]) continue;
        // For diagonal moves, both axis-aligned components must also be clear
        if (d.x !== 0 && d.y !== 0) {
            if (getTileCollisionData(vec2(sx + d.x, sy)) > 0) continue;
            if (getTileCollisionData(vec2(sx, sy + d.y)) > 0) continue;
        }
        if (getTileCollisionData(vec2(nx, ny)) > 0) continue;
        visited[key] = 1;
        if (nx === gx && ny === gy)
            return vec2(nx + 0.5, ny + 0.5); // first step IS the goal
        queue.push({ x: nx, y: ny, firstX: nx, firstY: ny });
    }

    let head = 0;
    while (head < queue.length) {
        const cur = queue[head++];
        for (const d of _BFS_DIRS) {
            const nx = cur.x + d.x, ny = cur.y + d.y;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const key = ny * w + nx;
            if (visited[key]) continue;
            // Diagonal: ensure corners aren't cutting through walls
            if (d.x !== 0 && d.y !== 0) {
                if (getTileCollisionData(vec2(cur.x + d.x, cur.y)) > 0) continue;
                if (getTileCollisionData(vec2(cur.x, cur.y + d.y)) > 0) continue;
            }
            if (getTileCollisionData(vec2(nx, ny)) > 0) continue;
            visited[key] = 1;
            if (nx === gx && ny === gy)
                return vec2(cur.firstX + 0.5, cur.firstY + 0.5);
            queue.push({ x: nx, y: ny, firstX: cur.firstX, firstY: cur.firstY });
        }
    }
    return null; // no path
}

class Turret extends EngineObject {
    constructor(pos) {
        const g = GFX.turret;
        super(pos.copy(), g.size, g.tileIndex, g.tileSize, 0, g.color);
        this.fireInterval = g.fireRate;
        this.fireCooldown = this.fireInterval;
        this.mass = 0;
        this.damping = 1;
        this.gravityScale = 0;
        this.setCollision(1, 1, 1);
        // Walking state
        this.waypoint = null;
        this.repathTimer = 0;
        this.stuckCount = 0;
    }

    render() {
        const frame = playerIsMoving
            ? GFX.turret.tileIndex + ((time * 4 | 0) % 2)
            : GFX.turret.tileIndex;
        const mirror = player && player.pos.x < this.pos.x;
        drawTile(this.pos, GFX.turret.drawSize, frame, GFX.turret.tileSize, new Color, 0, mirror);

        // Draw gun aimed toward the player (shared helper)
        if (player) {
            const dir = this.aimDir;
            _drawGun(this.pos, dir, GFX.turret.drawSize.x * 0.5, GFX.gun.enemyOffset);
        }
    }

    /** Normalized direction toward the player (safe fallback) */
    get aimDir() {
        if (!player) return vec2(1, 0);
        const d = player.pos.subtract(this.pos);
        return d.length() > 0.001 ? d.normalize() : vec2(1, 0);
    }

    /** World position of the gun tip (where bullets spawn) */
    get gunTip() {
        return _gunTransform(this.pos, this.aimDir, GFX.turret.drawSize.x * 0.5, GFX.gun.enemyOffset).tipPos;
    }

    update() {
        if (!player) return;

        // --- Walking behaviour (BFS pathfinding) ---
        {
            const distToPlayer = player.pos.subtract(this.pos).length();

            // Periodically recompute the BFS path
            this.repathTimer -= timeDelta * timeScale;
            if (this.repathTimer <= 0) {
                this.repathTimer = ENEMY.repathInterval;
                if (distToPlayer > ENEMY.arriveDist)
                    this.waypoint = _bfsNextWaypoint(this.pos, player.pos);
                else
                    this.waypoint = null;
            }

            // Move toward the current waypoint
            if (this.waypoint && distToPlayer > ENEMY.arriveDist) {
                const toWP = this.waypoint.subtract(this.pos);
                const wpDist = toWP.length();

                if (wpDist < ENEMY.waypointSnap) {
                    this.repathTimer = 0;
                    this.stuckCount = 0;
                } else {
                    const step = toWP.normalize().scale(ENEMY.walkSpeed * timeScale);
                    if (_slideMove(this, step)) {
                        this.stuckCount = 0;
                    } else {
                        this.stuckCount++;
                        this.repathTimer = 0; // force repath next frame
                        // Nudge toward tile center to un-wedge from corners
                        if (this.stuckCount > 2) {
                            const tc = vec2((this.pos.x | 0) + .5, (this.pos.y | 0) + .5);
                            const nudge = tc.subtract(this.pos).scale(.15);
                            _slideMove(this, nudge);
                        }
                    }
                }
            }
        }

        // --- Fire cooldown (respects timeScale) ---
        this.fireCooldown -= timeDelta * timeScale;
        if (this.fireCooldown > 0) return;
        this.fireCooldown = this.fireInterval;

        const dir = player.pos.subtract(this.pos);
        if (dir.length() <= 0.001) return;
        const normDir = dir.normalize();

        // --- Single shot ---
        const tip = this.gunTip;
        new TurretBullet(tip, normDir, this.bulletSpeed);
        emitShotParticles(tip, normDir);
        playShotSound(0.7);
    }
}

// DummyTurret — used in tutorial step 1.  Looks like a turret but never fires.
class DummyTurret extends Turret {
    constructor(pos) {
        super(pos);
        // Override: no firing, no movement
        this.fireCooldown = Infinity;
    }
    update() {
        // Completely stationary, no firing
    }
    render() {
        // Same as Turret but without the gun
        const frame = playerIsMoving
            ? GFX.turret.tileIndex + ((time * 4 | 0) % 2)
            : GFX.turret.tileIndex;
        const mirror = player && player.pos.x < this.pos.x;
        drawTile(this.pos, GFX.turret.drawSize, frame, GFX.turret.tileSize, new Color, 0, mirror);
    }
}

// ===================
// Boss
// ===================
const BOSS_MOVE_MACHINEGUN = 0;
const BOSS_MOVE_DASH       = 1;
const BOSS_MOVE_SIDERAIN   = 2;

class Boss extends EngineObject {
    constructor(pos) {
        const g = GFX.boss;
        super(pos.copy(), g.size, g.tileIndex, g.tileSize, 0, g.color);
        this.hp = g.hp;
        this.maxHp = g.hp;
        this.mass = 0;
        this.damping = 1;
        this.gravityScale = 0;
        this.setCollision(1, 1, 1);
        // Attack state
        this.baseFireRate = g.fireRate;
        this.attackCooldown = this.baseFireRate;
        this.currentMove = -1;
        this.moveTimer = 0;
        this.movePhase = 0;
        // Machine gun arc state
        this.arcAngle = 0;
        this.arcBullets = 0;
        // Dash state
        this.dashTarget = null;
        this.dashDir = vec2();
        // Side rain state
        this.sideRainTimer = 0;
        this.sideRainCount = 0;
        // Home position
        this.homePos = pos.copy();
        // Passive movement (slow follow)
        this.waypoint = null;
        this.repathTimer = 0;
        this.stuckCount = 0;
    }

    render() {
        // Pick frame based on current attack move:
        //   Dash (MOVE 1) → frame 4, Side rain (MOVE 2) → frame 6, otherwise → frame 5
        let frame;
        if (this.currentMove === BOSS_MOVE_DASH)
            frame = GFX.boss.tileIndex;       // 4
        else if (this.currentMove === BOSS_MOVE_SIDERAIN)
            frame = GFX.boss.frames[1];       // 6
        else
            frame = GFX.boss.frames[0];       // 5

        const mirror = player && player.pos.x < this.pos.x;

        // Squash & stretch bounce when player is moving (time-dilation effect)
        const baseSize = GFX.boss.drawSize;
        let drawSize, drawPos;
        if (playerIsMoving) {
            const s = Math.sin(time * 9) * 0.12;
            drawSize = vec2(baseSize.x - s, baseSize.y + s);
            drawPos  = vec2(this.pos.x, this.pos.y + s * 0.5);
        } else {
            drawSize = baseSize;
            drawPos  = this.pos;
        }

        drawTile(drawPos, drawSize, frame, GFX.boss.tileSize, this.color, 0, mirror);
    }

    // How angry the boss is (0 = full HP, 1 = dead)
    get rage() { return 1 - this.hp / this.maxHp; }

    // Attack speed multiplier: starts at 1, up to 2.5× at low HP
    get speedMul() { return 1 + this.rage * GFX.boss.attacks.rageSpeedScale; }

    getFireRate() { return this.baseFireRate / this.speedMul; }

    takeDamage(dmg) {
        this.hp = max(0, this.hp - dmg);
        // Hit feedback: particles + sound (same as enemy kill)
        emitDeathParticles(this.pos);
        playEnemyKillSound();
        // Flash white on hit
        this.color = _WHITE;
        setTimeout(() => {
            if (!this.destroyed) this.color = GFX.boss.color;
        }, GFX.boss.attacks.flashMs);
        if (this.hp <= 0) this.die();
    }

    die() {
        emitDeathParticles(this.pos);
        playEnemyKillSound();
        this.destroy();
    }

    startMove() {
        // Pick a random move different from last
        let pick;
        do { pick = randInt(3); } while (pick === this.currentMove);
        this.currentMove = pick;
        this.movePhase = 0;

        if (pick === BOSS_MOVE_MACHINEGUN) {
            // Spray arc of bullets toward player
            const toPlayer = player ? player.pos.subtract(this.pos).normalize() : vec2(1, 0);
            this.arcDir = toPlayer.rotate(-GFX.boss.attacks.machinegun.arcOffset);
            this.arcBullets = 0;
            this.moveTimer = 0;
        } else if (pick === BOSS_MOVE_DASH) {
            // Dash toward player then shotgun blast
            if (player) {
                this.dashTarget = player.pos.copy();
                this.dashDir = player.pos.subtract(this.pos).normalize();
            }
            this.moveTimer = 0;
        } else {
            // Side rain: bullets from edges
            this.sideRainTimer = 0;
            this.sideRainCount = 0;
            this.moveTimer = 0;
        }
    }

    update() {
        if (!player || this.destroyed) return;

        const dt = timeDelta * timeScale;

        // --- Passive movement: slowly follow the player via BFS ---
        this.repathTimer -= dt;
        if (this.repathTimer <= 0) {
            this.repathTimer = ENEMY.repathInterval;
            const dist = player.pos.subtract(this.pos).length();
            if (dist > ENEMY.arriveDist)
                this.waypoint = _bfsNextWaypoint(this.pos, player.pos);
            else
                this.waypoint = null;
        }
        if (this.waypoint) {
            const toWP = this.waypoint.subtract(this.pos);
            const wpDist = toWP.length();
            if (wpDist < ENEMY.waypointSnap) {
                this.repathTimer = 0;
                this.stuckCount = 0;
            } else {
                const step = toWP.normalize().scale(GFX.boss.moveSpeed * timeScale);
                if (_slideMove(this, step)) {
                    this.stuckCount = 0;
                } else {
                    this.stuckCount++;
                    this.repathTimer = 0;
                    if (this.stuckCount > 2) {
                        const tc = vec2((this.pos.x | 0) + .5, (this.pos.y | 0) + .5);
                        _slideMove(this, tc.subtract(this.pos).scale(.1));
                    }
                }
            }
        }
        // Update home position to current pos so return-from-dash goes to new spot
        this.homePos = this.pos.copy();

        // If no active move, wait for attack cooldown
        if (this.currentMove < 0) {
            this.attackCooldown -= dt;
            if (this.attackCooldown <= 0) {
                this.startMove();
                this.attackCooldown = this.getFireRate();
            }
            return;
        }

        // === MOVE 0: Machine gun arc ===
        if (this.currentMove === BOSS_MOVE_MACHINEGUN) {
            this.moveTimer += dt;
            const mg = GFX.boss.attacks.machinegun;
            const interval = mg.interval / this.speedMul;
            const totalBullets = mg.baseBullets + (this.rage * mg.rageBullets) | 0;
            if (this.moveTimer >= interval && this.arcBullets < totalBullets) {
                this.moveTimer -= interval;
                this.arcBullets++;
                const dir = this.arcDir.rotate((this.arcBullets / totalBullets) * mg.sweepArc);
                new BossBullet(this.pos, dir);
                emitShotParticles(this.pos, dir);
                playShotSound(0.65);
            }
            if (this.arcBullets >= totalBullets) {
                this.currentMove = -1;
                this.attackCooldown = this.getFireRate();
            }
        }

        // === MOVE 1: Dash + shotgun blast ===
        else if (this.currentMove === BOSS_MOVE_DASH) {
            this.moveTimer += dt;
            const dc = GFX.boss.attacks.dash;
            if (this.movePhase === 0) {
                const step = this.dashDir.scale(GFX.boss.dashSpeed * this.speedMul * timeScale);
                _slideMove(this, step);
                if (this.moveTimer > dc.duration || this.pos.subtract(this.dashTarget).length() < 1) {
                    this.movePhase = 1;
                    const toP = player.pos.subtract(this.pos).normalize();
                    const half = (dc.shotgunCount - 1) / 2;
                    for (let i = -half; i <= half; i++) {
                        const dir = toP.rotate(i * dc.shotgunSpread);
                        new BossBullet(this.pos, dir);
                        emitShotParticles(this.pos, dir);
                    }
                    playShotSound(0.7);
                    this.moveTimer = 0;
                }
            }
            else {
                const toHome = this.homePos.subtract(this.pos);
                if (toHome.length() > .2) {
                    const step = toHome.normalize().scale(dc.returnSpeed * timeScale);
                    _slideMove(this, step);
                }
                if (this.moveTimer > dc.returnDuration) {
                    this.currentMove = -1;
                    this.attackCooldown = this.getFireRate();
                }
            }
        }

        // === MOVE 2: Side rain ===
        else if (this.currentMove === BOSS_MOVE_SIDERAIN) {
            this.moveTimer += dt;
            const sr = GFX.boss.attacks.sideRain;
            const interval = sr.interval / this.speedMul;
            const totalWaves = sr.baseWaves + (this.rage * sr.rageWaves) | 0;
            this.sideRainTimer += dt;
            if (this.sideRainTimer >= interval && this.sideRainCount < totalWaves) {
                this.sideRainTimer -= interval;
                this.sideRainCount++;
                const y = rand(2, levelSize.y - 2);
                const speed = rand(sr.speedMin, sr.speedMin + sr.speedRange);
                const dirA = vec2(1, rand(-.5, .5) * sr.spread);
                const posA = vec2(2, y);
                new BossBullet(posA, dirA, speed);
                const y2 = rand(2, levelSize.y - 2);
                const dirB = vec2(-1, rand(-.5, .5) * sr.spread);
                const posB = vec2(levelSize.x - 2, y2);
                new BossBullet(posB, dirB, speed);
                emitShotParticles(posA, dirA);
                emitShotParticles(posB, dirB);
                playShotSound(0.65);
            }
            if (this.sideRainCount >= totalWaves) {
                this.currentMove = -1;
                this.attackCooldown = this.getFireRate();
            }
        }
    }
}

function killPlayer() {
    if (restarting) return;
    playPlayerDeathSound();
    restarting = true;
    screenFlashAlpha = 1;
    player && player.destroy();
    const delay = 350; // ms — enough for flash to play
    if (tutorialPhase >= 0) {
        setTimeout(() => loadTutorialStep(tutorialPhase), delay);
    } else if (predefinedLevelsBeaten) {
        setTimeout(() => {
            const procLevel = generateProceduralLevel(proceduralDifficulty);
            loadLevel(procLevel);
        }, delay);
    } else {
        setTimeout(() => loadLevel(currentLevelIndex), delay);
    }
}

// ===================
// Input — Joystick + Touch
// ===================
// Config lives in INPUT (consts.js)

// === Virtual Joystick State ===
let joystickActive  = false;
let joystickOrigin  = vec2();
let joystickKnob    = vec2();
let joystickDir     = vec2();
let joystickMag     = 0;

// === Aim Joystick State (right thumb) ===
let aimActive  = false;
let aimOrigin  = vec2();
let aimKnob    = vec2();
let aimDir     = vec2();
let aimMag     = 0;

// === Multi-touch tracking ===
let joystickTouchId = -1;  // left stick (move)
let aimTouchId      = -1;  // right stick (aim)
let shootPressed    = false;

// Helper: compute joystick direction & magnitude from a screen-space position
function updateJoystickFromScreenPos(sp) {
    const delta = sp.subtract(joystickOrigin);
    const dist  = delta.length();
    if (dist > INPUT.joystickDead) {
        joystickDir = delta.normalize();
        joystickMag = clamp((dist - INPUT.joystickDead) / (INPUT.joystickRadius - INPUT.joystickDead), 0, 1);
    } else {
        joystickDir = vec2();
        joystickMag = 0;
    }
    joystickKnob = joystickOrigin.add(
        dist > 0.001 ? delta.normalize(Math.min(dist, INPUT.joystickRadius)) : vec2()
    );
}

// Helper: compute aim joystick direction & magnitude
function updateAimFromScreenPos(sp) {
    const delta = sp.subtract(aimOrigin);
    const dist  = delta.length();
    if (dist > INPUT.joystickDead) {
        aimDir = delta.normalize();
        aimMag = clamp((dist - INPUT.joystickDead) / (INPUT.joystickRadius - INPUT.joystickDead), 0, 1);
    } else {
        aimDir = vec2();
        aimMag = 0;
    }
    aimKnob = aimOrigin.add(
        dist > 0.001 ? delta.normalize(Math.min(dist, INPUT.joystickRadius)) : vec2()
    );
}

function resetInputState() {
    joystickActive = false;
    joystickMag = 0;
    joystickTouchId = -1;
    aimActive = false;
    aimMag = 0;
    aimTouchId = -1;
    shootPressed = false;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
}

// Install raw multi-touch handlers (call once from gameInit)
function initTouchInput() {
    const getScreenPos = (t) => {
        const r = mainCanvas.getBoundingClientRect();
        return vec2(
            (t.clientX - r.left) * mainCanvas.width  / r.width,
            (t.clientY - r.top)  * mainCanvas.height / r.height
        );
    };
    const isRightHalf = (sp) => sp.x > mainCanvasSize.x * 0.5;

    document.addEventListener('touchstart', (e) => {
        // Title screen: any tap starts the game
        if (gameState === 'title') { startGame(); return; }
        // Powerup screen: forward tap position for card selection
        if (gameState === 'powerup') {
            for (const t of e.changedTouches) {
                const sp = getScreenPos(t);
                handlePowerupTap(sp.x, sp.y);
            }
            return;
        }
        if (gameState !== 'playing') return;
        for (const t of e.changedTouches) {
            const sp = getScreenPos(t);
            if (isRightHalf(sp) && aimTouchId < 0) {
                aimTouchId = t.identifier;
                aimActive  = true;
                aimOrigin  = sp;
                aimKnob    = sp;
                aimDir     = vec2();
                aimMag     = 0;
            } else if (!isRightHalf(sp) && joystickTouchId < 0) {
                joystickTouchId = t.identifier;
                joystickActive  = true;
                joystickOrigin  = sp;
                joystickKnob    = sp;
                joystickDir     = vec2();
                joystickMag     = 0;
            }
        }
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId)
                updateJoystickFromScreenPos(getScreenPos(t));
            if (t.identifier === aimTouchId)
                updateAimFromScreenPos(getScreenPos(t));
        }
    }, {passive: true});

    document.addEventListener('touchend', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId) {
                joystickTouchId = -1;
                joystickActive  = false;
                joystickMag     = 0;
            }
            if (t.identifier === aimTouchId) {
                if (aimMag > 0) shootPressed = true;
                aimTouchId = -1;
                aimActive  = false;
                aimMag     = 0;
            }
        }
    }, {passive: true});

    document.addEventListener('touchcancel', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId) {
                joystickTouchId = -1;
                joystickActive  = false;
                joystickMag     = 0;
            }
            if (t.identifier === aimTouchId) {
                aimTouchId = -1;
                aimActive  = false;
                aimMag     = 0;
            }
        }
    }, {passive: true});
}
// ===================
// Screens — Intro Animation & Title
// ===================
// Config lives in SCREENS (consts.js)
const _TITLE = 'QUICKSILVER';

function updateIntro() {
    if (stateTime >= SCREENS.intro.duration) {
        gameState = 'title';
        stateTime = 0;
    }
}

// Called each frame when gameState === 'title'
function updateTitle() {
    if (mouseWasPressed(0) || keyWasPressed(32) || keyWasPressed(13)) {
        startGame();
    }
}

// Render the intro cinematic (overlay)
function renderIntro() {
    const cx = mainCanvasSize.x / 2;
    const cy = mainCanvasSize.y / 2;
    const t = stateTime;
    const si = SCREENS.intro;

    drawRect(vec2(0), vec2(999), new Color(0, 0, 0));

    if (t < si.zoomEnd) {
        const p = t / si.zoomEnd;
        const sz = lerp(p * p, si.sizeMin, si.sizeMax);
        const a = clamp(p * 2, 0, 1);
        overlayContext.save();
        overlayContext.letterSpacing = si.letterSpacing;
        drawTextScreen(_TITLE, vec2(cx, cy), sz, new Color(1, 1, 1, a));
        overlayContext.restore();
    }
    else {
        const p = (t - si.zoomEnd) / (si.duration - si.zoomEnd);
        const a = 1 - p;
        const flash = Math.sin(p * PI * 6) * .3 * (1 - p);
        drawRect(vec2(0), vec2(999), new Color(1, .2, .1, max(0, flash)));
        overlayContext.save();
        overlayContext.letterSpacing = si.letterSpacing;
        drawTextScreen(_TITLE, vec2(cx, cy), si.sizeMax, new Color(1, 1 - p * .5, 1 - p * .5, a));
        overlayContext.restore();
    }
}

// Render the title screen with PLAY button (overlay)
function renderTitle() {
    const ctx = overlayContext;
    const cx = mainCanvasSize.x / 2;
    const cy = mainCanvasSize.y / 2;
    const t = stateTime;
    const st = SCREENS.title;
    const fadeIn = clamp(t / .5, 0, 1);

    drawRect(vec2(0), vec2(999), new Color(.08, .08, .1));

    // Title
    ctx.save();
    ctx.letterSpacing = st.titleSpacing;
    drawTextScreen(_TITLE, vec2(cx, cy + st.titleOffsetY), st.titleSize, new Color(1, 1, 1, fadeIn));
    ctx.restore();

    // PLAY button
    const pulse = .85 + .15 * Math.sin(t * 3);
    const btnW = st.btnWidth * pulse;
    const btnH = st.btnHeight * pulse;
    const btnY = cy + st.btnOffsetY;

    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.fillStyle = st.btnColor.toString();
    ctx.beginPath();
    ctx.roundRect(cx - btnW / 2, btnY - btnH / 2, btnW, btnH, st.btnRadius);
    ctx.fill();
    ctx.restore();

    drawTextScreen('PLAY', vec2(cx, btnY + 2), st.playSize, new Color(1, 1, 1, fadeIn));
}


// ===================
// Powerups
// ===================

// Powerup tiers: each tier is offered after a specific level.
// tier 0 → offered after level 1 (index 0), tier 1 → after level 2, etc.
const POWERUP_TIERS = [
    // === Tier 0: stat boosts ===
    [
        {
            ic: '+',
            desc: '-20% Reload',
            apply() { activeBuffs.reloadMul *= 0.80; },
        },
        {
            ic: '>',
            desc: '+10% Speed',
            apply() { activeBuffs.moveSpeedMul *= 1.10; },
        },
        {
            ic: '@',
            desc: '-3% Slow-mo',
            apply() { activeBuffs.slowScaleAdd -= 0.03; },
        },
    ],
    // === Tier 1: bullet modifiers ===
    [
        {
            ic: '*',
            desc: 'Homing Bullets',
            apply() { activeBuffs.homing = true; },
        },
        {
            ic: '#',
            desc: 'Buckshot',
            apply() { activeBuffs.buckshot = true; },
        },
        {
            ic: '!',
            desc: 'Triple Burst',
            apply() { activeBuffs.burst = true; },
        },
    ],
];

// Accumulated buffs — reset on new game, persist across levels
const DEFAULT_BUFFS = {

    moveSpeedMul:   1,
    reloadMul:      1,    // multiplier on RELOAD_TIME (lower = faster)
    slowScaleAdd:   0,    // added to SLOW_MOTION_SCALE
    homing:         false,
    buckshot:       false,
    burst:          false,
};
let activeBuffs = { ...DEFAULT_BUFFS };

function resetBuffs() {
    activeBuffs = { ...DEFAULT_BUFFS };
}

// === Effective stat helpers (called by objects/main) ===
function getEffectivePlayerSpeed() {
    return GFX.player.speed * activeBuffs.moveSpeedMul;
}
function getEffectiveSlowScale() {
    return max(0.02, GAMEPLAY.slowMotion + activeBuffs.slowScaleAdd);
}
function getEffectiveReloadTime() {
    return GAMEPLAY.reloadTime * activeBuffs.reloadMul;
}

// === Powerup selection screen state ===
let powerupChoices = [];    // 3 powerups to choose from
let powerupSelected = -1;   // index of selected choice (0-2), -1 = none
let powerupPendingLevel = 0; // which level to load after selection

// Pick 3 random from a tier
function preparePowerupChoices(tierIndex) {
    const tier = POWERUP_TIERS[tierIndex];
    if (!tier) return;
    // Shuffle and pick 3
    const shuffled = [...tier].sort(() => Math.random() - .5);
    powerupChoices = shuffled.slice(0, 3);
    powerupSelected = -1;
}

// Shared card layout calculation (avoids duplication between tap handler & renderer)
function _getCardLayout() {
    const pu = SCREENS.powerup;
    const cx = mainCanvasSize.x / 2;
    const cy = mainCanvasSize.y / 2;
    const totalW = powerupChoices.length * pu.cardWidth + (powerupChoices.length - 1) * pu.cardGap;
    return {
        cardW: pu.cardWidth, cardH: pu.cardHeight, gap: pu.cardGap,
        startX: cx - totalW / 2,
        cardY: cy - pu.cardHeight / 2 + pu.cardOffsetY,
        cx, cy,
    };
}

function handlePowerupTap(mx, my) {
    if (powerupSelected >= 0 || !powerupChoices.length) return;
    const { cardW, cardH, gap, startX, cardY } = _getCardLayout();
    for (let i = 0; i < powerupChoices.length; i++) {
        const cardX = startX + i * (cardW + gap);
        if (mx >= cardX && mx <= cardX + cardW && my >= cardY && my <= cardY + cardH) {
            selectPowerup(i);
            return;
        }
    }
}

function selectPowerup(i) {
    if (powerupSelected >= 0) return;
    powerupSelected = i;
    powerupChoices[i].apply();
    setTimeout(() => {
        gameState = 'playing';
        stateTime = 0;
        loadLevel(powerupPendingLevel);
    }, SCREENS.powerup.selectDelay);
}

// Called each frame when gameState === 'powerup'
function updatePowerup() {
    if (!powerupChoices.length) return;

    // Check for click/tap on a card (desktop / LittleJS mouse mapping)
    if (mouseWasPressed(0) && powerupSelected < 0) {
        handlePowerupTap(mousePosScreen.x, mousePosScreen.y);
    }

    // Keyboard shortcuts: 1, 2, 3
    if (powerupSelected < 0) {
        for (let i = 0; i < powerupChoices.length; i++) {
            if (keyWasPressed(49 + i)) {
                selectPowerup(i);
                return;
            }
        }
    }
}

// Render the powerup selection screen (overlay)
function renderPowerup() {
    const ctx = overlayContext;
    const t = stateTime;
    const pu = SCREENS.powerup;
    const { cardW, cardH, gap, startX, cardY, cx, cy } = _getCardLayout();
    const fadeIn = clamp(t / .4, 0, 1);

    drawRect(vec2(0), vec2(999), new Color(.1, .1, .14));

    // Header (bold via Canvas 2D)
    ctx.save();
    ctx.font = _F(pu.headerSize);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = pu.headerSpacing;
    ctx.fillStyle = `rgba(255,255,255,${fadeIn})`;
    ctx.fillText('UPGRADE', cx, pu.headerY);
    ctx.restore();

    for (let i = 0; i < powerupChoices.length; i++) {
        const pw = powerupChoices[i];
        const cardX = startX + i * (cardW + gap);
        const selected = powerupSelected === i;

        // Card slide-up animation
        const cardDelay = i * pu.animStagger;
        const cardFade = clamp((t - cardDelay) / pu.animFade, 0, 1);
        const slideY = (1 - cardFade) * pu.animSlide;

        ctx.save();
        ctx.globalAlpha = fadeIn * cardFade;

        const mx = mousePosScreen.x;
        const my = mousePosScreen.y;
        const hover = mx >= cardX && mx <= cardX + cardW &&
                      my >= cardY + slideY && my <= cardY + slideY + cardH;

        if (selected) {
            ctx.fillStyle = pu.selectedBg.toString();
        } else if (hover && powerupSelected < 0) {
            ctx.fillStyle = pu.hoverBg.toString();
        } else {
            ctx.fillStyle = pu.defaultBg.toString();
        }
        ctx.beginPath();
        ctx.roundRect(cardX, cardY + slideY, cardW, cardH, pu.cardRadius);
        ctx.fill();

        ctx.lineWidth = selected ? pu.selectedBorderW : pu.defaultBorderW;
        ctx.strokeStyle = selected
            ? pu.selectedBorder.toString()
            : pu.defaultBorder.toString();
        ctx.stroke();
        ctx.restore();

        // Icon character
        ctx.save();
        ctx.font = _F(60);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = fadeIn * cardFade;
        ctx.fillStyle = 'rgba(130,255,180,1)';
        ctx.fillText(pw.ic, cardX + cardW / 2, cardY + slideY + 80);
        ctx.restore();

        // Description (bold via Canvas 2D)
        ctx.save();
        ctx.font = _F(pu.descSize);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = fadeIn * cardFade;
        ctx.fillStyle = `rgba(220,220,220,1)`;
        ctx.fillText(pw.desc, cardX + cardW / 2, cardY + slideY + pu.descOffsetY);
        ctx.restore();

        // Keyboard hint
        drawTextScreen(`[${i + 1}]`, vec2(cardX + cardW / 2, cardY + slideY + cardH - pu.hintPadBottom), pu.hintSize,
            new Color(.65, .65, .65, fadeIn * cardFade * .7));
    }
}

// ===================
// HUD — Gameplay Overlay
// ===================
// Config lives in HUD & INPUT (consts.js)

// Reusable joystick overlay renderer
function _drawJoystick(ctx, origin, knob, baseColor, strokeColor, knobColor) {
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, INPUT.joystickRadius, 0, 7);
    ctx.fillStyle = baseColor.toString();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor.toString();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(knob.x, knob.y, INPUT.joystickRadius * INPUT.knobRatio, 0, 7);
    ctx.fillStyle = knobColor.toString();
    ctx.fill();
}

function renderHud() {
    const ctx = overlayContext;

    // Reload bar — top-left corner, screen space (scaled to fixed canvas)
    if (reloadTimer > 0 && player) {
        const fill = clamp(1 - reloadTimer / getEffectiveReloadTime(), 0, 1);
        const s = mainCanvasSize.x / 1280;  // scale factor relative to reference width
        const barW = 300 * s, barH = 20 * s;
        const bx = 20 * s, by = 20 * s;
        // Background
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(bx, by, barW, barH);
        // Fill
        const r = fill < .5 ? 255 : Math.round(255 * (1 - fill));
        const g = fill < .5 ? Math.round(200 * fill * 2) : 200;
        ctx.fillStyle = `rgba(${r},${g},60,0.8)`;
        ctx.fillRect(bx, by, barW * fill, barH);
        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, barW, barH);
        // Label
        ctx.save();
        ctx.font = _F(18*s);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText('RELOAD', bx, by + barH + 4 * s);
        ctx.restore();
    }
    
    // === Boss Health Bar (top center) ===
    if (boss && !boss.destroyed) {
        const bb = HUD.bossBar;
        const hpPct = clamp(boss.hp / boss.maxHp, 0, 1);
        const bW = bb.width, bH = bb.height;
        const bx = (mainCanvasSize.x - bW) / 2, by = bb.y;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bx - bb.padding, by - bb.padding, bW + bb.padding * 2, bH + bb.padding * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(bx, by, bW, bH);
        let r, g, b;
        if (hpPct > .5) {
            const t = (hpPct - .5) * 2;
            r = Math.round(255 * (1 - t));
            g = 200;
            b = 0;
        } else {
            const t = hpPct * 2;
            r = 255;
            g = Math.round(200 * t);
            b = 0;
        }
        ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
        ctx.fillRect(bx, by, bW * hpPct, bH);
    }

    // === Level label (top-right corner) ===
    {
        let label = '';
        if (tutorialPhase >= 0)
            label = 'TUTORIAL';
        else if (predefinedLevelsBeaten)
            label = 'INFINITE';
        else if (boss && !boss.destroyed)
            label = 'BOSS FIGHT';
        else
            label = 'LEVEL ' + (currentLevelIndex + 1);
        if (label) {
            const s = mainCanvasSize.x / 1280;
            ctx.save();
            ctx.font = _F(36*s);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.fillText(label, mainCanvasSize.x - 20 * s, 20 * s);
            ctx.restore();
        }
    }

    // Joystick overlays (using shared helper)
    if (joystickActive)
        _drawJoystick(ctx, joystickOrigin, joystickKnob, INPUT.moveBaseColor, INPUT.moveBaseStroke, INPUT.moveKnobColor);
    if (aimActive)
        _drawJoystick(ctx, aimOrigin, aimKnob, INPUT.aimBaseColor, INPUT.aimBaseStroke, INPUT.aimKnobColor);

    // === Tutorial HUD ===
    if (tutorialPhase >= 0) {
        const yPos = mainCanvasSize.y * 0.78;
        const cx = mainCanvasSize.x / 2;
        let displayText = TUTORIAL_TEXTS[tutorialPhase];
        let alpha = tutorialTextAlpha;

        // Bold outlined text via Canvas 2D (supports multi-line via \n)
        if (displayText && alpha > 0) {
            const lines = displayText.split('\n');
            const fontSize = lines.length > 1 ? 34 : 46;
            const lineH = fontSize * 1.25;
            const topY = yPos - (lines.length - 1) * lineH * 0.5;
            ctx.save();
            ctx.font = _F(fontSize);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            for (let li = 0; li < lines.length; li++) {
                const ly = topY + li * lineH;
                ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.85})`;
                ctx.lineWidth = 7;
                ctx.strokeText(lines[li], cx, ly);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillText(lines[li], cx, ly);
            }
            ctx.restore();
        }

        // Step 0: progress bar for movement
        if (tutorialPhase === 0 && tutorialMoveTimer > 0) {
            const fill = clamp(tutorialMoveTimer, 0, 1);
            const barW = 180, barH = 8;
            const bx = (mainCanvasSize.x - barW) / 2, by = yPos + 36;
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(bx, by, barW, barH);
            ctx.fillStyle = `rgba(255,255,255,${0.7 * alpha})`;
            ctx.fillRect(bx, by, barW * fill, barH);
        }

        // Step 2: survival timer bar (only after ready)
        if (tutorialPhase === 2 && tutorialReady && tutorialSurviveTimer > 0) {
            const fill = clamp(tutorialSurviveTimer / 2.5, 0, 1);
            const barW = 180, barH = 8;
            const bx = (mainCanvasSize.x - barW) / 2, by = yPos + 36;
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(bx, by, barW, barH);
            ctx.fillStyle = `rgba(255,255,255,0.7)`;
            ctx.fillRect(bx, by, barW * fill, barH);
        }
    }

    // === Screen flash (death / level transition) ===
    if (screenFlashAlpha > 0) {
        const a = clamp(screenFlashAlpha, 0, 1);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(0, 0, mainCanvasSize.x, mainCanvasSize.y);
    }
}

// === Audio unlock ===
// Chrome / Safari autoplay policy: AudioContext must be created or resumed
// during a *real* user-gesture event handler (click, touch, key).
// rAF callbacks and game-loop ticks do NOT count.
// We also play a tiny silent buffer so iOS Safari fully unlocks audio.
(function _initAudioUnlock() {
    const events = ['click', 'touchstart', 'touchend', 'keydown'];
    function unlock() {
        // Create context during gesture → starts 'running' immediately
        if (!audioContext)
            audioContext = new (window.AudioContext || webkitAudioContext);
        if (audioContext.state === 'suspended')
            audioContext.resume();

        // iOS Safari requires an actual buffer play to fully unlock
        try {
            const b = audioContext.createBuffer(1, 1, 22050);
            const s = audioContext.createBufferSource();
            s.buffer = b;
            s.connect(audioContext.destination);
            s.start();
        } catch(_) {}

        // Once running, remove all listeners
        if (audioContext.state === 'running') {
            events.forEach(e => document.removeEventListener(e, unlock, true));
        }
    }
    events.forEach(e => document.addEventListener(e, unlock, true));
})();

// ===================
// Music
// ===================
let gameMusic;
let musicVolumeCurrent = 0.3;

// === Level state ===
let levelTiles = vec2(1, 1);
let levelSize = vec2(1, 1);
let currentLevelData;
let currentLevelIndex = 0;

let player, turrets = [];
let boss = null;
let restarting = false;
let levelTransitioning = false;
let playerIsMoving = false;
let predefinedLevelsBeaten = false;  // true once the boss level is cleared
let proceduralDifficulty = 1;        // increases each procedural level

// === Tutorial state ===
let tutorialPhase = -1;           // -1 = not in tutorial, 0–3 = active step
let tutorialMoveTimer = 0;        // consecutive movement seconds (step 0)
let tutorialDodgeCount = 0;       // bullets dodged (step 2)
let tutorialShootDisabled = false;
let tutorialTextAlpha = 0;
let tutorialReady = false;
let tutorialSurviveTimer = 0;

// === Screen flash (death / level transition) ===
let screenFlashAlpha = 0;  // white flash overlay, fades each frame

// === Timers ===
let reloadTimer = 0;  // manual counter, affected by timeScale
let levelTransitionTimer = new Timer;

// === Bullet trail system ===
let bulletTrails = [];

// === Player burst queue ===
let burstQueue = 0;        // remaining burst bullets to fire
let burstTimer = 0;        // countdown to next burst bullet
let burstDir   = vec2();   // cached direction for the burst sequence

function emitShotParticles(pos, dir, offset) {
    const p = PARTICLES.shot;
    const o = offset ?? p.offset;
    const hasDir = dir && dir.length() > 0.001;
    const normDir = hasDir ? dir.normalize() : vec2(1, 0);
    const emitPos = pos.add(normDir.scale(o));
    new ParticleEmitter(
        emitPos, normDir.angle(),
        p.emitSize, p.emitTime, p.emitRate, p.emitConeAngle,
        p.tileIndex, p.tileSize,
        p.colorStartA, p.colorStartB, p.colorEndA, p.colorEndB,
        p.particleTime, p.sizeStart, p.sizeEnd, p.speed,
        p.angleSpeed, p.damping, p.angleDamping, p.gravityScale,
        p.particleCone, p.fadeRate, p.randomness,
        p.collideTiles, p.additive
    );
}

function playShotSound(volume = 1) {
    const pitch = lerp(clamp(timeScale, 0.18, 1), 0.65, 1);
    new Sound([2,.03,340,,,.13,1,.5,-7,-19.2,,,.06,,,,.15,.8,.05,,500]).play(undefined, volume, pitch, 1);
}

function playEnemyKillSound() {
    new Sound([.02,2,277,,.11,.2,1,,.1,,2050,.08,1,,,,.07,2,.03]).play();
}

function playPlayerDeathSound() {
    new Sound([.5,0,474,.03,.22,.19,1,.4,,,-181,.11,.03,,,,,.88,.28,,103]).play();
}

function emitDeathParticles(pos) {
    const p = PARTICLES.death;
    new ParticleEmitter(
        pos.copy(), 0,
        p.emitSize, p.emitTime, p.emitRate, p.emitConeAngle,
        p.tileIndex, p.tileSize,
        p.colorStartA, p.colorStartB, p.colorEndA, p.colorEndB,
        p.particleTime, p.sizeStart, p.sizeEnd, p.speed,
        p.angleSpeed, p.damping, p.angleDamping, p.gravityScale,
        p.particleCone, p.fadeRate, p.randomness,
        p.collideTiles, p.additive
    );
}

// === Time scale (Superhot) ===
let timeScale = 1;

// === Game State ===
// 'intro' → 'title' → 'playing' → 'powerup' → 'playing' …
let gameState = 'intro';
let stateTime = 0;

// ===================
// Level Loading
// ===================
/**
 * Load a level by index (predefined) or from a raw level definition object (procedural).
 * @param {number|object} indexOrDef - predefined level index, or a level def with { id, name, map }
 */
function loadLevel(indexOrDef) {
    if (typeof indexOrDef === 'object' && indexOrDef !== null) {
        // Procedural level definition passed directly
        currentLevelData = parseLevelDefinition(indexOrDef);
    } else {
        const maxIndex = LEVEL_DEFINITIONS.length - 1;
        currentLevelIndex = clamp(indexOrDef, 0, maxIndex) | 0;
        currentLevelData = parseLevelDefinition(LEVEL_DEFINITIONS[currentLevelIndex]);
    }

    engineObjectsDestroy();

    levelTiles = vec2(currentLevelData.width, currentLevelData.height);
    levelSize = currentLevelData.size.copy();

    initTileCollision(levelTiles);
    for (const wallTile of currentLevelData.walls)
        setTileCollisionData(wallTile, 1);

    player = new Player(currentLevelData.playerSpawn);
    cameraPos = player.pos.copy();
    turrets = currentLevelData.enemies.map(e => new Turret(e.pos));

    // Boss level
    boss = null;
    if (currentLevelData.bossSpawn)
        boss = new Boss(currentLevelData.bossSpawn);

    resetInputState();
    bulletTrails = [];
    timeScale = 1;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
    restarting = false;
    levelTransitioning = false;
    levelTransitionTimer.unset();
}

// ===================
// Tutorial Step Loader
// ===================
const TUTORIAL_TEXTS = [
    'Left stick to move',
    'Right stick to aim\nRelease to fire',
    'Time moves only when you move',
    'Destroy Goons',
];

function loadTutorialStep(step) {
    tutorialPhase = step;
    tutorialMoveTimer = 0;
    tutorialDodgeCount = 0;
    tutorialShootDisabled = (step === 0 || step === 2);
    tutorialTextAlpha = 0;
    tutorialSurviveTimer = 0;
    screenFlashAlpha = 0;
    tutorialReady = true;

    const def = TUTORIAL_LEVELS[step];
    const parsed = parseLevelDefinition(def);

    engineObjectsDestroy();
    levelTiles = vec2(parsed.width, parsed.height);
    levelSize = parsed.size.copy();
    initTileCollision(levelTiles);
    for (const wallTile of parsed.walls)
        setTileCollisionData(wallTile, 1);

    player = new Player(parsed.playerSpawn);
    cameraPos = player.pos.copy();

    // Step 1 uses DummyTurret (doesn't fire, stationary); steps 2 & 3 use real Turret
    if (step === 1) {
        turrets = parsed.enemies.map(e => new DummyTurret(e.pos));
    } else {
        turrets = parsed.enemies.map(e => new Turret(e.pos));
    }

    // Step 2: stationary, 1.5× fire rate, normal-speed bullets, fire immediately
    if (step === 2) {
        for (const t of turrets) {
            t.waypoint = null;
            t.repathTimer = Infinity;        // never repath → stationary
            t.fireInterval = GFX.turret.fireRate / 1.5;
            t.fireCooldown = 0;              // fire on first frame
        }
    }

    boss = null;
    currentLevelData = parsed;
    resetInputState();
    bulletTrails = [];
    timeScale = 1;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
    restarting = false;
    levelTransitioning = false;
    levelTransitionTimer.unset();
}

function advanceTutorial() {
    const next = tutorialPhase + 1;
    if (next < TUTORIAL_LEVELS.length) {
        loadTutorialStep(next);
    } else {
        // Tutorial complete — show first powerup, then level 0
        tutorialPhase = -1;
        tutorialShootDisabled = false;
        powerupPendingLevel = 0;
        preparePowerupChoices(0);
        gameState = 'powerup';
        stateTime = 0;
    }
}

function startGame() {
    gameState = 'playing';
    stateTime = 0;
    resetBuffs();
    predefinedLevelsBeaten = false;
    proceduralDifficulty = 1;
    // Begin with tutorial
    loadTutorialStep(0);

    // Start background music (must be triggered by user gesture)
    if (gameMusic) {
        gameMusic.play();
    }
}

// ===================
// Init
// ===================
async function gameInit() {
    canvasFixedSize = ENGINE.canvasSize;
    cameraScale = ENGINE.cameraScale;
    fontDefault = ENGINE.font;
    initTouchInput();

    gameMusic = new Music(MUSIC_FILE);
}

// ===================
// Update
// ===================
function gameUpdate() {
    stateTime += timeDelta;

    if (gameState === 'intro')   { updateIntro();   return; }
    if (gameState === 'title')   { updateTitle();    return; }
    if (gameState === 'powerup') { updatePowerup();  return; }

    // === Screen flash fade ===
    if (screenFlashAlpha > 0)
        screenFlashAlpha = max(0, screenFlashAlpha - timeDelta * 3.5);

    // === Gameplay ===
    if (restarting || !player) return;
    turrets = turrets.filter(t => !t.destroyed);

    // === Tutorial update ===
    if (tutorialPhase >= 0) {
        // Fade in tutorial text
        if (tutorialTextAlpha < 1)
            tutorialTextAlpha = min(1, tutorialTextAlpha + timeDelta * 2);
    }

    // Level transition: advance when all enemies + boss destroyed
    const bossAlive = boss && !boss.destroyed;
    if (!turrets.length && !bossAlive) {
        // Tutorial steps 1 & 3: enemy death IS the pass condition
        if (tutorialPhase === 1 || tutorialPhase === 3) {
            if (!levelTransitioning) {
                levelTransitioning = true;
                screenFlashAlpha = 1;
                levelTransitionTimer.set(0.35);
            }
            if (levelTransitionTimer.elapsed()) { advanceTutorial(); }
            return;
        }
        // Normal level transition (skip for tutorial steps 0 & 2 which have no/don't-clear enemies)
        if (tutorialPhase < 0) {
        if (!levelTransitioning) {
            levelTransitioning = true;
            screenFlashAlpha = 1;
            levelTransitionTimer.set(GAMEPLAY.levelTransitionDelay);
        }
        if (levelTransitionTimer.elapsed()) {
            // Check if we just beat the last predefined level (boss level)
            const isLastPredefined = currentLevelIndex === LEVEL_DEFINITIONS.length - 1;
            if (isLastPredefined) predefinedLevelsBeaten = true;

            if (predefinedLevelsBeaten) {
                // After boss: generate procedural levels
                const procLevel = generateProceduralLevel(proceduralDifficulty);
                proceduralDifficulty++;
                loadLevel(procLevel);
            } else {
                const nextLevel = currentLevelIndex + 1;
                const tier = currentLevelIndex + 1;  // tier 0 after tutorial, tier 1 after level 1…
                if (tier < POWERUP_TIERS.length) {
                    // Show powerup selection screen
                    powerupPendingLevel = nextLevel;
                    preparePowerupChoices(tier);
                    gameState = 'powerup';
                    stateTime = 0;
                } else {
                    loadLevel(nextLevel);
                }
            }
        }
            return;
        } // end if (tutorialPhase < 0)
    }

    // === Desktop mouse/keyboard fallback (disabled on touch devices) ===
    if (!isTouchDevice && joystickTouchId < 0 && aimTouchId < 0) {
        if (mouseWasPressed(0)) {
            joystickActive = true;
            joystickOrigin = mousePosScreen.copy();
            joystickKnob   = mousePosScreen.copy();
            joystickDir    = vec2();
            joystickMag    = 0;
        }
        if (joystickActive && mouseIsDown(0))
            updateJoystickFromScreenPos(mousePosScreen);
        if (mouseWasReleased(0)) {
            joystickActive = false;
            joystickMag    = 0;
        }
    }
    if (keyWasPressed(32) || keyWasPressed(88))
        shootPressed = true;

    // === Apply move joystick to player velocity ===
    if (joystickMag > 0) {
        const worldDir = vec2(joystickDir.x, -joystickDir.y);
        const targetVel = worldDir.scale(player.speed * joystickMag);
        const vs = GFX.player.velSmoothing;
        player.velocity = player.velocity.scale(vs).add(targetVel.scale(1 - vs));
    }

    // === Apply aim joystick to facing ===
    if (aimMag > 0) {
        const worldAim = vec2(aimDir.x, -aimDir.y);
        if (worldAim.length() > 0.001) player.facing = worldAim;
    }

    // Superhot time scale
    const moving = player.velocity.length() > GAMEPLAY.moveThreshold;
    playerIsMoving = moving;
    timeScale = moving ? 1 : getEffectiveSlowScale();
    // Tutorial step 1: no time dilation
    if (tutorialPhase === 1) timeScale = 1;

    // === Tutorial step-specific logic ===
    if (tutorialPhase === 0) {
        // Once transition started, always complete it even if player stops moving
        if (levelTransitioning) {
            if (levelTransitionTimer.elapsed()) advanceTutorial();
            return;
        }
        if (moving) tutorialMoveTimer += timeDelta;
        else        tutorialMoveTimer = 0;
        if (tutorialMoveTimer >= 1) {
            levelTransitioning = true;
            screenFlashAlpha = 1;
            levelTransitionTimer.set(0.35);
            return;
        }
    }
    if (tutorialPhase === 2) {
        // Make turrets stationary each frame (override any walk attempts)
        for (const t of turrets) { t.waypoint = null; t.repathTimer = Infinity; }
        // Pass after surviving 5 seconds once text reveal is done
        if (tutorialReady) {
            tutorialSurviveTimer += timeDelta * timeScale;
            if (tutorialSurviveTimer >= 2.5) {
                if (!levelTransitioning) {
                    levelTransitioning = true;
                    screenFlashAlpha = 1;
                    levelTransitionTimer.set(0.35);
                }
                if (levelTransitionTimer.elapsed()) advanceTutorial();
                return;
            }
        }
    }
    // Block shooting during tutorial step 2
    if (tutorialShootDisabled) shootPressed = false;

    // Dynamic music volume: softer when stationary, full when moving
    if (gameMusic) {
        const targetVol = moving ? 0.6 : 0.075;
        musicVolumeCurrent = lerp(0.05, musicVolumeCurrent, targetVol);
        gameMusic.setVolume(musicVolumeCurrent);
    }

    // === Reload (affected by timeScale) ===
    if (reloadTimer > 0)
        reloadTimer = max(0, reloadTimer - timeDelta * timeScale);

    // === Player burst queue processing ===
    if (burstQueue > 0) {
        burstTimer -= timeDelta * timeScale;
        if (burstTimer <= 0) {
            burstTimer = SHOOTING.burstDelay;
            burstQueue--;
            firePlayerBullet(player.gunTip, burstDir);
            playShotSound();
        }
    }

    // === Shooting ===
    const canShoot = reloadTimer <= 0 && burstQueue <= 0;
    if (shootPressed && canShoot) {
        reloadTimer = getEffectiveReloadTime();
        const shootDir = player.facing.length() ? player.facing : vec2(1, 0);
        const origin = player.gunTip;
        if (activeBuffs.buckshot) {
            const spread = SHOOTING.buckshotSpread;
            [shootDir,
             shootDir.rotate(spread),
             shootDir.rotate(-spread)
            ].forEach(d => firePlayerBullet(origin, d));
            playShotSound();
        } else if (activeBuffs.burst) {
            firePlayerBullet(origin, shootDir);
            playShotSound();
            burstDir = shootDir;
            burstQueue = SHOOTING.burstCount - 1;
            burstTimer = SHOOTING.burstDelay;
        } else {
            firePlayerBullet(origin, shootDir);
            playShotSound();
        }
    }
    shootPressed = false;
}

function gameUpdatePost() {
    if (gameState !== 'playing' || !player) return;

    // Smooth camera follow
    const smoothing = GAMEPLAY.cameraSmoothing;
    const target = player.pos;
    cameraPos = cameraPos.add(target.subtract(cameraPos).scale(smoothing));

    // Clamp so the camera never shows outside the level bounds.
    // Use mainCanvasSize (actual rendered canvas) for the viewport dimensions.
    const halfScreenW = mainCanvasSize.x / cameraScale * 0.5;
    const halfScreenH = mainCanvasSize.y / cameraScale * 0.5;

    // If the level is smaller than the viewport on an axis, just center it
    if (levelSize.x <= halfScreenW * 2)
        cameraPos.x = levelSize.x * 0.5;
    else
        cameraPos.x = clamp(cameraPos.x, halfScreenW, levelSize.x - halfScreenW);

    if (levelSize.y <= halfScreenH * 2)
        cameraPos.y = levelSize.y * 0.5;
    else
        cameraPos.y = clamp(cameraPos.y, halfScreenH, levelSize.y - halfScreenH);
}

// ===================
// Render
// ===================
function gameRender() {
    if (gameState !== 'playing') return;

    // Tile background and wall pass (spritesheet tiles)
    const tt = currentLevelData.tileTypes;
    for (let x = 0; x < levelTiles.x; x++)
    for (let y = 0; y < levelTiles.y; y++)
        drawTile(vec2(x + .5, y + .5), vec2(1), tt[x][y] + 8, vec2(16));

    // Dotted facing indicator (starts from gun tip, aligned with gun direction)
    // Hide when player has no gun (tutorial steps 0 & 2)
    if (player && tutorialPhase !== 0 && tutorialPhase !== 2) {
        const f = GFX.player.facing;
        const dir = player.aimDir;     // same direction the gun points
        const origin = player.gunTip;  // starts at barrel tip
        let d = 0;
        while (d < f.reach) {
            const a = origin.add(dir.scale(d));
            const b = origin.add(dir.scale(Math.min(d + f.dotLen, f.reach)));
            const alpha = 1 - d / f.reach;
            drawLine(a, b, f.width, GFX.player.color.scale(1, alpha * f.alpha));
            d += f.dotLen + f.gapLen;
        }
    }

    if (!player) return;

    // Turret aiming guides
    for (const turret of turrets) {
        const dir = player.pos.subtract(turret.pos);
        if (dir.length() <= 0.001) continue;
        drawLine(turret.pos, turret.pos.add(dir.normalize(GFX.turret.guideLen)), GFX.turret.guideColor);
    }

    // Bullet trails
    const tw = GFX.bullet.trail.width;
    const tf = GFX.bullet.trail.fade;
    for (let i = bulletTrails.length - 1; i >= 0; i--) {
        const trail = bulletTrails[i];
        let alive = false;
        for (let j = 1; j < trail.points.length; j++) {
            const p0 = trail.points[j - 1];
            const p1 = trail.points[j];
            if (p1.alpha <= 0) continue;
            alive = true;
            drawLine(p0.pos, p1.pos, tw, trail.color.scale(1, p1.alpha));
        }
        for (const p of trail.points)
            p.alpha -= timeDelta * tf;
        if (!alive) bulletTrails.splice(i, 1);
    }
}

function gameRenderPost() {
    if (gameState === 'intro')   { renderIntro();   return; }
    if (gameState === 'title')   { renderTitle();   return; }
    if (gameState === 'powerup') { renderPowerup();  return; }
    renderHud();
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 't.png');
