const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');

// Handle image uploads
uploadInput.addEventListener('change', (event) => {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result; // Local preview
      img.title = "Click to download HD";

      // HD download on click
      img.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = e.target.result;
        link.download = file.name;
        link.click();
      });

      gallery.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});
