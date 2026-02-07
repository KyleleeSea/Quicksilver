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
