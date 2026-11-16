
import { auth } from "./firebase.js";

const API_URL = "https://mini-mahal-backend.onrender.com";

async function getAdminToken() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Please log in as administrator.");
    }

    return await user.getIdToken();
}

async function sendUpload(formData) {
    const token = await getAdminToken();

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed.");
    }

    return result;
}

window.uploadImage = async function () {
    const file = document.getElementById("imageUpload").files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "gallery");

    try {
        await sendUpload(formData);

        alert("Gallery image uploaded successfully!");

        document.getElementById("imageUpload").value = "";

        if (window.loadGalleryPreview) {
            await window.loadGalleryPreview();
        }

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

window.addFacility = async function () {
    const name = document.getElementById("facilityName").value.trim();
    const description = document.getElementById("facilityDescription").value.trim();
    const file = document.getElementById("facilityImage").files[0];

    if (!name || !description || !file) {
        alert("Please fill all facility details and select an image.");
        return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("type", "facilities");
    formData.append("name", name);
    formData.append("description", description);

    try {
        await sendUpload(formData);

        alert("Facility added successfully!");

        document.getElementById("facilityName").value = "";
        document.getElementById("facilityDescription").value = "";
        document.getElementById("facilityImage").value = "";

        if (window.loadFacilitiesPreview) {
            await window.loadFacilitiesPreview();
        }

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};
