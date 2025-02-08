// src/js/reelManager.js
export const reelCount = 4;
export const reelImages = 10;
export const reelHeight = 80;
export const reelWidth = 100;
export const imageGap = 10;

export function createReels() {
    return Array.from({ length: reelCount }, (_, i) => ({
        position: Math.floor(Math.random() * reelImages) * (reelHeight + imageGap),
        speed: Math.random() * 40 + 20,
        spinning: false,
        stopAt: 0
    }));
}

export function drawReels(canvas, ctx, reels, images, reelSequences) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before drawing
    reels.forEach((reel, i) => {
        let x = i * (reelWidth + 28) + 10;
        for (let j = 0; j < reelImages + 2; j++) {
            let imgIndex = (Math.floor(reel.position / (reelHeight + imageGap)) + j) % reelImages;
            let y = (j * (reelHeight + imageGap)) - (reel.position % (reelHeight + imageGap)) - (reelHeight + imageGap);
            if (images[imgIndex]) {
                ctx.drawImage(images[imgIndex], x, y, reelWidth, reelHeight);
            }
        }
    });
}

export function updateReelPositions(reels, elapsedTime, spinDuration) {
    reels.forEach((reel, index) => {
        const progress = Math.min(elapsedTime / spinDuration, 1); // Ensure progress doesn't exceed 1
        const speed = 50 + index * 20;  // Each reel spins at a slightly different speed
        reel.position = (reel.position + speed * progress) % (reelImages * (reelHeight + imageGap));
    });
}
