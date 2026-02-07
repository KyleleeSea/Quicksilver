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
