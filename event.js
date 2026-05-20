const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentImageSrc = "";

// Load saved images from LocalStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
  savedImages.forEach(src => {
    addImageToGallery(src);
  });
});

// Handle uploads
uploadInput.addEventListener('change', (event) => {
  const files = event.target.files;
  const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      addImageToGallery(imgSrc);

      // Save to LocalStorage
      savedImages.push(imgSrc);
      localStorage.setItem("galleryImages", JSON.stringify(savedImages));
    };
    reader.readAsDataURL(file);
  }
});

// Function to add image to gallery
function addImageToGallery(src) {
  const img = document.createElement("img");
  img.src = src;
  img.title = "Click to preview";

  img.addEventListener("click", (ev) => {
    ev.preventDefault();
    modal.style.display = "block";
    modalImg.src = src;
    currentImageSrc = src;
  });

  gallery.appendChild(img);
}

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Download button
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = currentImageSrc;
  link.download = "downloaded_image.png";
  link.click();
});
