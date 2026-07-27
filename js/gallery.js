function loadGallery() {

    const container =
        document.getElementById("galleryContainer");

    const images =
        JSON.parse(localStorage.getItem("galleryData")) || [];

    container.innerHTML = "";

    images.forEach(item => {

        container.innerHTML += `
            <div class="gallery-card">
                <img src="${item.image}" alt="Gallery Image">
            </div>
        `;
    });
}

loadGallery();