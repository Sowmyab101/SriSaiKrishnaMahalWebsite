const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}


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







document.addEventListener("DOMContentLoaded", () => {


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



async function uploadImage() {

    const file = document.getElementById("imageUpload").files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("type", "gallery");

    try {

        const response = await fetch("https://mini-mahal-backend.onrender.com/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert("🎉 Image uploaded successfully!");
            console.log(result);

            // We'll replace this with a preview refresh later.
            document.getElementById("imageUpload").value = "";

        } else {
            alert(result.message);
        }

    } catch (err) {

        console.error(err);
        alert("Upload failed.");

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

async function addFacility() {

    const name = document.getElementById("facilityName").value.trim();

    const description = document.getElementById("facilityDescription").value.trim();

    const file = document.getElementById("facilityImage").files[0];

    if (!name) {
        alert("Please enter the facility name.");
        return;
    }

    if (!description) {
        alert("Please enter the facility description.");
        return;
    }

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("type", "facilities");
    formData.append("name", name);
    formData.append("description", description);

    try {

        const response = await fetch("https://mini-mahal-backend.onrender.com/upload", {

            method: "POST",
            body: formData

        });

        const result = await response.json();

        if (result.success) {

            alert("🎉 Facility added successfully!");

            // Clear form
            document.getElementById("facilityName").value = "";
            document.getElementById("facilityDescription").value = "";
            document.getElementById("facilityImage").value = "";

            // Refresh admin preview
            if (typeof loadFacilitiesPreview === "function") {
                loadFacilitiesPreview();
            }

        } else {

            alert(result.message);

        }

    } catch (err) {

        console.error(err);
        alert("Upload failed.");

    }

}

window.onload = function () {

    if (document.getElementById("uploadType")) {
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
