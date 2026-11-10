import {
    db,
    collection,
    getDocs
} from "./firebase.js";

async function loadFacilities() {

    const container =
        document.getElementById("facilitiesContainer");

    container.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "facilities"));

    snapshot.forEach((doc) => {

        const facility = doc.data();

        container.innerHTML += `
            <div class="facility-card">

                <img src="${facility.imageUrl}" alt="${facility.name}">

                <div class="facility-info">

                    <h3>${facility.name}</h3>

                    <p>${facility.description}</p>

                </div>

            </div>
        `;
    });
}

loadFacilities();