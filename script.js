
let allBookings = [];
// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


// Loader Fade
window.addEventListener("load", function() {
  const loader = document.getElementById("loader");

  if(loader){
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 600);
  }

});


// Header Shrink On Scroll
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");

  if(header){
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

});


// Floating Contact Toggle
const toggle = document.querySelector(".contact-toggle");
const floating = document.querySelector(".floating-contact");

if(toggle && floating){
  toggle.addEventListener("click", () => {
      floating.classList.toggle("active");
  });
}


// ADMIN LOGIN
function login(){
  let Adminusername = document.getElementById("Adminusername").value;
  let password = document.getElementById("password").value;

  if(Adminusername === "admin" && password === "SriKrish#2026"){
    localStorage.setItem("adminLoggedIn","true");

    // ✅ Redirect to dashboard page
    window.location.href = "dashboard.html";
  }
  else{
    alert("Invalid Login");
  }
}


function logout(){
  localStorage.removeItem("adminLoggedIn");

  // ✅ Go back to login page
  window.location.href = "admin.html";
}


document.addEventListener("DOMContentLoaded", () => {

  // Booking Form
  

  // Load bookings into table
  

  // Booking count
  
  

  // Admin protection
  if (!localStorage.getItem("adminLoggedIn")) {
    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
      dashboard.style.display = "none";
    }
  }

});

function toggleFields() {

    const type =
        document.getElementById("uploadType").value;

    const facilitySection =
        document.getElementById("facilitySection");

    const gallerySection =
        document.getElementById("gallerySection");
    
    facilitySection.style.display = "none";
    gallerySection.style.display = "none";

    if(type === "facilities"){
        facilitySection.style.display = "block";
    }
    else if (type === "gallery"){
        gallerySection.style.display = "block";
    }
}



function uploadImage() {

    const file = document.getElementById("imageUpload").files[0];

    if(!file){
        alert("Select an image");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const type = document.getElementById("uploadType").value;

        const imageData = {
            image: e.target.result,
            type: type
        };

        if(type === "facilities"){
            imageData.name =
                document.getElementById("facilityName").value;

            imageData.description =
                document.getElementById("facilityDescription").value;
        }

        let images =
            JSON.parse(localStorage.getItem("galleryData")) || [];

        images.push(imageData);

        localStorage.setItem(
            "galleryData",
            JSON.stringify(images)
        );

        alert("🎉 Image uploaded successfully!");
        loadGalleryPreview();
        document.getElementById("imageUpload").value = "";
    };

    reader.readAsDataURL(file);
}

function loadGalleryPreview(){

    const container =
        document.getElementById("galleryPreview");

    if(!container) return;

    const images =
        JSON.parse(localStorage.getItem("galleryData")) || [];

    container.innerHTML = "";

    images.forEach((item,index)=>{

        // Show only gallery images
       

        container.innerHTML += `
        <div class="image-card">

            <img src="${item.image}" width="200">

            <div class="card-buttons">

                <button class="delete-btn"
                    onclick="deleteImage(${index})">
                    Delete
                </button>

            </div>

        </div>
        `;
    });
}


function loadFacilitiesAdmin() {

    const container =
        document.getElementById("facilityPreview");
    
    if(!container) return;

    const facilities =
        JSON.parse(localStorage.getItem("facilitiesData")) || [];

    container.innerHTML = "";

    facilities.forEach((facility,index)=>{

        container.innerHTML += `
        <div class="image-card">

            <img src="${facility.image}" width="200">

            <h3>${facility.name}</h3>

            <p>${facility.description}</p>

            <div class="card-buttons">

                <button class="edit-btn"
                    onclick="editFacility(${index})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteFacility(${index})">
                    Delete
                </button>

            </div>

        </div>
        `;
    });
}

function deleteImage(index){

    let images =
        JSON.parse(localStorage.getItem("galleryData")) || [];

    images.splice(index,1);

    localStorage.setItem(
        "galleryData",
        JSON.stringify(images)
    );

    loadGalleryPreview();
}

function deleteFacility(index){

    let facilities =
        JSON.parse(localStorage.getItem("facilitiesData")) || [];

    facilities.splice(index,1);

    localStorage.setItem(
        "facilitiesData",
        JSON.stringify(facilities)
    );

    loadFacilitiesAdmin();
}

function editFacility(index){

    let facilities =
        JSON.parse(localStorage.getItem("facilitiesData")) || [];

    let facility = facilities[index];

    const newName = prompt(
        "Edit Facility Name",
        facility.name
    );

    const newDescription = prompt(
        "Edit Description",
        facility.description
    );

    if(newName !== null && newDescription !== null){

        facility.name = newName;
        facility.description = newDescription;

        facilities[index] = facility;

        localStorage.setItem(
            "facilitiesData",
            JSON.stringify(facilities)
        );

        loadFacilitiesAdmin();
    }
}

function downloadExcel(){

  let table = document.getElementById("bookingTable");
  let rows = table.querySelectorAll("tr");

  let csv = [];

  rows.forEach(row => {
    let cols = row.querySelectorAll("th, td");
    let rowData = [];

    cols.forEach(col => {
      rowData.push(col.innerText);
    });

    csv.push(rowData.join(","));
  });

  let csvString = csv.join("\n");

  let blob = new Blob([csvString], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "bookings.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}

function addFacility() {

    const name =
        document.getElementById("facilityName").value;

    const description =
        document.getElementById("facilityDescription").value;

    

    const file =
        document.getElementById("facilityImage").files[0];

    if (!file) {
        alert("Select image");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        const facilities =
            JSON.parse(localStorage.getItem("facilitiesData")) || [];

        facilities.push({
            name: name,
            description: description,
            image: e.target.result
        });

        localStorage.setItem(
            "facilitiesData",
            JSON.stringify(facilities)
        );

        alert("Facility Added");
        loadFacilitiesAdmin();
    };

    reader.readAsDataURL(file);
}

window.onload = function() {

    if(document.getElementById("galleryPreview")){
        loadGalleryPreview();
    }

    if(document.getElementById("facilityPreview")){
        loadFacilitiesAdmin();
    }

    if(document.getElementById("uploadType")){
        toggleFields();
    }
};


// Reset function
function resetSearch() {

    document.getElementById("searchBooking").value = "";

    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach((row) => {
        row.style.display = "";
    });

}

