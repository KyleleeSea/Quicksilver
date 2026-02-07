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