import { canvas, ctx, adjustCanvasResolution } from "./canvasConfig.js";
import { playReelSound, playWinSound } from "./audio.js";
import { loadImages } from "./imageLoader.js";

import {
    reelCount,
    reelImages,
    reelHeight,
    reelWidth,
    imageGap,
    drawReels,
    createReels,
    updateReelPositions
} from "./reelManager.js";

const imagePaths = ["01.svg", "02.svg", "03.svg", "04.svg", "10.svg", "09.svg", "05.svg", "06.svg", "07.svg", "08.svg"];
const images = loadImages(imagePaths);

let reels = createReels();
let spinning = false;

adjustCanvasResolution();

document.getElementById("startButton").addEventListener("click", () => {
    if (!spinning) {
        playReelSound();
        spinReels(false);
    }
});

document.getElementById("winSpinButton").addEventListener("click", () => {
    if (!spinning) {
        playWinSound();
        spinReels(true);
    }
});

function spinReels(forceWin = false) {
    spinning = true;
    let spinDuration = 2000; // Adjust spin duration as needed
    const startTime = Date.now();

    function animate() {
        let elapsedTime = Date.now() - startTime;

        // Draw reels
        drawReels(canvas, ctx, reels, images, Array.from({ length: reelCount }, () => imagePaths));

        if (elapsedTime < spinDuration) {
            requestAnimationFrame(animate);  // Continue animation
        } else {
            spinning = false;  // Stop spinning after spin duration
        }
    }

    animate();
}
