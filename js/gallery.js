import {
    db,
    collection,
    getDocs
} from "./firebase.js";

async function loadGallery() {

    const container =
        document.getElementById("galleryContainer");

    container.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "gallery"));

    snapshot.forEach((doc) => {

        const item = doc.data();

        container.innerHTML += `
            <div class="gallery-card">
                <img src="${item.imageUrl}" alt="Gallery Image">
            </div>
        `;
    });

}

loadGallery();