import { playReelSound, playWinSound } from "./audio.js";
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

const canvas = document.getElementById("slotCanvas");
const ctx = canvas.getContext("2d");

// const reelCount = 4;
// const reelImages = 10;
// const reelHeight = 80;
// const reelWidth = 100;
// const imageGap = 10;
// const winLineY = 90;

const spinDurations = [600, 1200, 1800, 2400];

function adjustCanvasResolution() {
    const scale = window.devicePixelRatio || 1; // ✅ Get screen pixel ratio
    canvas.width = 500 * scale;
    canvas.height = 300 * scale;
    ctx.scale(scale, scale); // ✅ Scale drawing context to match
}

adjustCanvasResolution(); // ✅ Call when initializing

const imagePaths = [
    "01.svg", "02.svg", "03.svg", "04.svg", "10.svg",
    "09.svg", "05.svg", "06.svg",
    "07.svg", "08.svg"
];

const basePath = "src/images/";  // The base path for all images

const images = [];
imagePaths.forEach((src, index) => {
    images[index] = new Image();
    images[index].src = `${basePath}${src}`;  // Prepend the base path
    images[index].onload = () => {
        console.log(`Image loaded: ${images[index].src}`);
    };
    images[index].onerror = () => {
        console.error(`Failed to load image: ${images[index].src}`);
    };
});


let reelSequences = Array.from({ length: reelCount }, () => [...imagePaths]);

let reels = Array.from({ length: reelCount }, (_, i) => ({
    position: Math.floor(Math.random() * reelImages) * (reelHeight + imageGap),
    speed: Math.random() * 40 + 20,
    spinning: false,
    stopAt: 0
}));

let spinning = false;
let holdStatus = [false, false, false, false];

const startButton = document.getElementById("startButton");
const winSpinButton = document.getElementById("winSpinButton");
const cancelButton = document.getElementById("cancelButton");
const holdButtons = [
    document.getElementById("hold1"),
    document.getElementById("hold2"),
    document.getElementById("hold3"),
    document.getElementById("hold4")
];

function enableNudgeFeature() {
    holdButtons.forEach((button, index) => {
        button.disabled = false;
        button.classList.add("hold-flash");
        button.textContent = "Nudge";

        button.onclick = () => {
            if (nudgeCount > 0) {
                nudgeReel(index);
                nudgeCount--;
                button.classList.remove("hold-flash");
                button.classList.add("nudge-active");
                button.textContent = `Nudged`;
                button.disabled = true;

                if (nudgeCount === 0) {
                    resetHoldAndNudgeButtons();
                }
            }
        };
    });
}

function enableHoldFeature() {
    holdButtons.forEach((button, index) => {
        button.disabled = false;
        button.classList.add("hold-flash");
        button.textContent = "Hold";

        button.onclick = () => {
            holdStatus[index] = true;
            button.classList.remove("hold-flash");
            button.classList.add("hold-active");
            button.disabled = true;
        };
    });
}

function nudgeReel(reelIndex) {
    reels[reelIndex].position += reelHeight + imageGap;
    if (reels[reelIndex].position >= (reelImages * (reelHeight + imageGap))) {
        reels[reelIndex].position = 0;
    }
    drawReels();
}

function resetHoldButtons() {
    holdStatus.fill(false);
    holdButtons.forEach((button, index) => {
        button.disabled = true;
        button.classList.remove("hold-active", "hold-flash");
    });

    // **1 in 3 chance for holds to flash**
    if (Math.random() < 1 / 3) {
        holdButtons.forEach((button, index) => {
            button.disabled = false;
            button.classList.add("hold-flash");

            // ✅ Ensure clicking the button will "hold" the reel
            button.onclick = () => {
                holdStatus[index] = true;
                button.disabled = true;
                button.classList.remove("hold-flash");
                button.classList.add("hold-active");
            };
        });
    }
}


function getWinningSymbols() {
    let winningSymbols = reels.map((reel, i) => {
        let offset = Math.round(reel.position / (reelHeight + imageGap));
        let winningIndex = (offset + 2) % reelImages;
        return reelSequences[i][winningIndex];
    });
    console.log("🎉 Winning Symbols on the Win Line:", winningSymbols);
}
function getRandomNumber(numbers) {
    return numbers[Math.floor(Math.random() * numbers.length)];
}


function spinReels(forceWin = false) {
    spinning = true;
    const startTime = Date.now();
    holdButtons.forEach(button => button.classList.remove("hold-flash"));

    let winSymbol = null;
    let winIndex = null;

    // Determine the winning symbol before any reels spin
    if (forceWin) {
        // these numbers represent the different images.
        winIndex = getRandomNumber([1, 1, 8, 8, 9, 10])
        winSymbol = reelSequences[0][winIndex]; // Pick the symbol from reel 1
    }

    reels.forEach((reel, index) => {
        if (!holdStatus[index]) {
            reel.spinning = true;
            reel.speed = Math.random() * 50 + 50;
            reel.stopAt = startTime + spinDurations[index];

            if (forceWin && index < 3) {
                // Force reels 1, 2, and 3 to stop on the winning symbol
                reel.position = winIndex * (reelHeight + imageGap);
            }
        }
    });

    function animate() {
        let stillSpinning = false;
        const currentTime = Date.now();

        reels.forEach((reel, index) => {
            if (reel.spinning) {
                stillSpinning = true;
                let timeRemaining = reel.stopAt - currentTime;
                let totalSpinTime = spinDurations[index];

                if (timeRemaining < totalSpinTime * 0.1) reel.speed *= 0.80;
                else reel.speed *= 0.99;

                reel.position -= reel.speed;
                if (currentTime >= reel.stopAt) {
                    reel.spinning = false;
                    reel.speed = 0;
                    reel.position = Math.round(reel.position / (reelHeight + imageGap)) * (reelHeight + imageGap);

                    // Ensure reels 1, 2, and 3 stop on the forced win symbol
                    if (forceWin && index < 3) {
                        reel.position = winIndex * (reelHeight + imageGap);
                    }
                }
                if (reel.position < 0) reel.position = (reelImages - 1) * (reelHeight + imageGap);
            }
        });

        drawReels();

        if (stillSpinning) requestAnimationFrame(animate);
        else {
            spinning = false;
            getWinningSymbols();
            resetHoldButtons();
        }
    }

    animate();
}



startButton.addEventListener("click", () => {
    if (!spinning) {
        playReelSound();
        spinReels();
    }
});

winSpinButton.addEventListener("click", () => {
    if (!spinning) {
        // playWinSound();
        spinReels(true);
    }
});

cancelButton.addEventListener("click", resetHoldButtons);

setTimeout(drawReels, 200);