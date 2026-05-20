const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentImageSrc = "";

// Handle uploads
uploadInput.addEventListener('change', (event) => {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.title = "Click to preview";

      // Open modal on click
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = e.target.result;
        currentImageSrc = e.target.result;
      });

      gallery.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

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
