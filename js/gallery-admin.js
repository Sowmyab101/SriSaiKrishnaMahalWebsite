
import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const API_URL = "https://mini-mahal-backend.onrender.com";

// --------------------------------------
// ADMIN AUTHENTICATION
// --------------------------------------

async function getAdminToken() {
    if (!auth.currentUser) {
        throw new Error("Admin login required. Please log in again.");
    }

    return await auth.currentUser.getIdToken();
}

// --------------------------------------
// BACKEND REQUEST
// --------------------------------------

async function adminRequest(path, method, body = null) {
    const token = await getAdminToken();

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(body ? { "Content-Type": "application/json" } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed.");
    }

    return result;
}

// --------------------------------------
// CREATE ACTION BUTTONS
// --------------------------------------

function createActionButton(text, className, onClick) {
    const button = document.createElement("button");

    button.textContent = text;
    button.className = className;
    button.type = "button";
    button.addEventListener("click", onClick);

    return button;
}

// --------------------------------------
// LOAD GALLERY
// --------------------------------------

window.loadGalleryPreview = async function () {
    const container = document.getElementById("galleryPreview");

    if (!container) {
        console.error("galleryPreview element not found in HTML.");
        return;
    }

    container.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "gallery"));

        if (snapshot.empty) {
            container.textContent = "No gallery images uploaded yet.";
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const card = document.createElement("div");
            card.className = "gallery-item admin-media-card";

            const image = document.createElement("img");
            image.src = data.imageUrl;
            image.alt = "Gallery Image";
            image.loading = "lazy";

            const content = document.createElement("div");
            content.className = "gallery-content";

            const actions = document.createElement("div");
            actions.className = "gallery-actions";

            const deleteButton = createActionButton(
                "Delete",
                "delete-btn",
                () => window.deleteImage(docSnap.id)
            );

            content.appendChild(actions);
            actions.appendChild(deleteButton);

            card.appendChild(image);
            card.appendChild(content);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Gallery loading error:", error);
        container.textContent = "Unable to load gallery images.";
    }
};

// --------------------------------------
// DELETE GALLERY IMAGE
// --------------------------------------

window.deleteImage = async function (id) {
    if (!confirm("Are you sure you want to delete this gallery image?")) {
        return;
    }

    try {
        await adminRequest(
            `/image/gallery/${encodeURIComponent(id)}`,
            "DELETE"
        );

        await window.loadGalleryPreview();

        alert("Gallery image deleted successfully.");

    } catch (error) {
        console.error("Gallery delete error:", error);
        alert(error.message);
    }
};

// --------------------------------------
// LOAD FACILITIES
// --------------------------------------

window.loadFacilitiesPreview = async function () {
    const container = document.getElementById("facilityPreview");

    if (!container) {
        console.error("facilityPreview element not found in HTML.");
        return;
    }

    container.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "facilities"));

        if (snapshot.empty) {
            container.textContent = "No facilities uploaded yet.";
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const card = document.createElement("div");
            card.className = "gallery-item admin-media-card";

            const image = document.createElement("img");
            image.src = data.imageUrl;
            image.alt = data.name || "Facility Image";
            image.loading = "lazy";

            const content = document.createElement("div");
            content.className = "gallery-content";

            const heading = document.createElement("h3");
            heading.textContent = data.name || "";

            const description = document.createElement("p");
            description.textContent = data.description || "";

            const actions = document.createElement("div");
            actions.className = "gallery-actions";

            const editButton = createActionButton(
                "Edit",
                "edit-btn",
                () => window.editFacility(
                    docSnap.id,
                    data.name || "",
                    data.description || ""
                )
            );

            const deleteButton = createActionButton(
                "Delete",
                "delete-btn",
                () => window.deleteFacility(docSnap.id)
            );

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            content.appendChild(heading);
            content.appendChild(description);
            content.appendChild(actions);

            card.appendChild(image);
            card.appendChild(content);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Facilities loading error:", error);
        container.textContent = "Unable to load facilities.";
    }
};

// --------------------------------------
// DELETE FACILITY
// --------------------------------------

window.deleteFacility = async function (id) {
    if (!confirm("Are you sure you want to delete this facility?")) {
        return;
    }

    try {
        await adminRequest(
            `/image/facilities/${encodeURIComponent(id)}`,
            "DELETE"
        );

        await window.loadFacilitiesPreview();

        alert("Facility deleted successfully.");

    } catch (error) {
        console.error("Facility delete error:", error);
        alert(error.message);
    }
};

// --------------------------------------
// EDIT FACILITY
// --------------------------------------

window.editFacility = async function (id, oldName, oldDescription) {
    const name = prompt("Facility Name:", oldName);

    if (name === null) return;

    const description = prompt("Facility Description:", oldDescription);

    if (description === null) return;

    if (!name.trim() || !description.trim()) {
        alert("Facility name and description cannot be empty.");
        return;
    }

    try {
        await adminRequest(
            `/facility/${encodeURIComponent(id)}`,
            "PATCH",
            {
                name: name.trim(),
                description: description.trim()
            }
        );

        await window.loadFacilitiesPreview();

        alert("Facility updated successfully.");

    } catch (error) {
        console.error("Facility update error:", error);
        alert(error.message);
    }
};

// --------------------------------------
// INITIALIZE
// --------------------------------------

window.addEventListener("load", () => {
    window.loadGalleryPreview();
    window.loadFacilitiesPreview();
});
