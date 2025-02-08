
// src/js/audio.js
export function playReelSound() {
    const audio = new Audio("src/audio/reel.mp3");
    audio.play().catch(error => console.error("Reel sound failed to play:", error));
}

export function playWinSound() {
    const audio = new Audio("src/audio/win.mp3");
    audio.play().catch(error => console.error("Win sound failed to play:", error));
}

window.playReelSound = playReelSound;
window.playWinSound = playWinSound;