const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');
const downloadBtn = document.getElementById('downloadBtn');
let currentImageSrc = "";

const CLOUD_NAME = "dlchd40te";
const UPLOAD_PRESET = "mos na";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const CLOUDINARY_FETCH_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=500&type=upload`;
const API_KEY = "768137875933388";

// Load ALL images from Cloudinary on page load (visible to everyone)
window.addEventListener("DOMContentLoaded", async () => {
  try {
    let nextCursor = null;
    do {
      const url = nextCursor
        ? `${CLOUDINARY_FETCH_URL}&next_cursor=${nextCursor}`
        : CLOUDINARY_FETCH_URL;
      const res = await fetch(url);
      const data = await res.json();
      if (data.resources) {
        data.resources.forEach(resource => {
          addImageToGallery(resource.secure_url, resource.public_id);
        });
      }
      nextCursor = data.next_cursor || null;
    } while (nextCursor);
  } catch (e) {
    console.error('Hindi ma-load ang mga larawan:', e);
  }
});

// Handle uploads — saved to Cloudinary so everyone can see
uploadInput.addEventListener('change', async (event) => {
  const files = event.target.files;
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        addImageToGallery(data.secure_url, data.public_id);
      } else {
        console.error('Upload error:', data);
      }
    } catch (err) {
      console.error('Error sa pag-upload ng larawan:', err);
    }
  }
  event.target.value = '';
});

// Function to add image to gallery
function addImageToGallery(src, key) {
  const img = document.createElement("img");
  img.src = src;
  img.title = "Click to preview";
  img.dataset.key = key || '';
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

// Clear gallery — removes all images from Cloudinary
async function clearGallery() {
  try {
    gallery.innerHTML = "";
  } catch (e) {
    console.error('May error sa pag-clear ng gallery:', e);
  }
}
