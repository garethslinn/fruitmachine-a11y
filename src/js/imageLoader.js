// src/js/imageLoader.js
export function loadImages(imagePaths, basePath = "src/images/") {
    const images = [];
    imagePaths.forEach((src, index) => {
        images[index] = new Image();
        images[index].src = `${basePath}${src}`;
        images[index].onload = () => console.log(`Image loaded: ${images[index].src}`);
        images[index].onerror = () => console.error(`Failed to load image: ${images[index].src}`);
    });
    return images;
}
