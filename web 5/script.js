
// Array of travel images
const images = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"
];

// Current image index
let currentIndex = 0;

// Display gallery images
const gallery = document.getElementById("gallery");

images.forEach((image, index) => {
    const img = document.createElement("img");

    img.src = image;
    img.alt = "Travel destination";

    img.onclick = function() {
        openSlide(index);
    };

    gallery.appendChild(img);
});

// Open slideshow
function openSlide(index) {
    currentIndex = index;

    document.getElementById("slideshow").style.display = "flex";

    showImage();
}

// Display selected image
function showImage() {
    document.getElementById("slideImage").src =
        images[currentIndex];
}

// Next image
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;

    showImage();
}

// Previous image
function previousImage() {
    currentIndex =
        (currentIndex - 1 + images.length) % images.length;

    showImage();
}

// Close slideshow
function closeSlide() {
    document.getElementById("slideshow").style.display = "none";
}

