const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');
const downloadBtn = document.getElementById('downloadBtn');
let currentImageSrc = "";

// Helper: get ALL keys with pagination (no limit)
async function getAllKeys(prefix) {
  let allKeys = [];
  let cursor = null;
  while (true) {
    const res = await window.storage.list(prefix, false, { cursor, limit: 1000 });
    if (!res || !res.keys) break;
    allKeys = allKeys.concat(res.keys);
    if (!res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return allKeys;
}

// Load saved images from persistent storage on page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const allKeys = await getAllKeys('img:');
    allKeys.sort();
    for (const key of allKeys) {
      const res = await window.storage.get(key);
      if (res && res.value) addImageToGallery(res.value, key);
    }
  } catch (e) {
    console.error('Hindi ma-load ang mga naka-save na larawan:', e);
  }
});

// Handle uploads
uploadInput.addEventListener('change', async (event) => {
  const files = event.target.files;
  for (const file of files) {
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgSrc = e.target.result;
        const key = 'img:' + Date.now() + '_' + Math.random().toString(36).slice(2);
        try {
          await window.storage.set(key, imgSrc);
          addImageToGallery(imgSrc, key);
        } catch (err) {
          console.error('Error sa pag-save ng larawan:', err);
        }
        resolve();
      };
      reader.readAsDataURL(file);
    });
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

// Clear gallery (reset persistent storage)
async function clearGallery() {
  try {
    const allKeys = await getAllKeys('img:');
    for (const key of allKeys) await window.storage.delete(key);
    gallery.innerHTML = "";
  } catch (e) {
    console.error('May error sa pag-clear ng gallery:', e);
  }
}
