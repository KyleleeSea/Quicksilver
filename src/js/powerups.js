

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
