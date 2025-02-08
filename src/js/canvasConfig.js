// src/js/canvasConfig.js
export const canvas = document.getElementById("slotCanvas");
export const ctx = canvas.getContext("2d");

export function adjustCanvasResolution() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = 500 * scale;
    canvas.height = 300 * scale;
    ctx.scale(scale, scale);
}

