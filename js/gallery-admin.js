import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    addDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadGalleryPreview() {

    const container = document.getElementById("galleryPreview");

    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "gallery"));

    snapshot.forEach((document) => {

        const image = document.data();

        container.innerHTML += `

        <div class="image-card">

            <img src="${image.imageUrl}" width="200">

            <div class="gallery-actions">

        <button
            class="delete-btn"
            onclick="deleteImage('${document.id}')">

            🗑 Delete

        </button>

    </div>


        </div>

        `;

    });

}

window.deleteImage = async function(id){

    if(!confirm("Delete image?"))
        return;

    await deleteDoc(
        doc(db,"gallery",id)
    );

    loadGalleryPreview();

}

async function loadFacilitiesPreview(){

    const container =
        document.getElementById("facilityPreview");

    container.innerHTML="";

    const snapshot =
        await getDocs(collection(db,"facilities"));

    snapshot.forEach(document=>{

        const facility=document.data();

        container.innerHTML += `

        <div class="image-card">

            <img src="${facility.imageUrl}" width="200">

            <h3>${facility.name}</h3>

            <p>${facility.description}</p>

            <div class="gallery-actions">

        <button
            class="edit-btn"
            onclick="editFacility(
                '${document.id}',
                '${facility.name}',
                '${facility.description}'
            )">

            ✏️ Edit

        </button>

        <button
            class="delete-btn"
            onclick="deleteFacility('${document.id}')">

            🗑 Delete

        </button>

    </div>

        </div>

        `;

    });

}

window.deleteFacility = async function(id){

    if(!confirm("Delete Facility?"))
        return;

    await deleteDoc(
        doc(db,"facilities",id)
    );

    loadFacilitiesPreview();

}

window.editFacility = async function(
id,
oldName,
oldDescription
){

    const name =
        prompt("Facility Name",oldName);

    if(name===null)
        return;

    const description =
        prompt(
            "Description",
            oldDescription
        );

    if(description===null)
        return;

    await updateDoc(

        doc(db,"facilities",id),

        {

            name:name,

            description:description

        }

    );

    loadFacilitiesPreview();

}

window.addEventListener("load", () => {
    loadGalleryPreview();
    loadFacilitiesPreview();
});