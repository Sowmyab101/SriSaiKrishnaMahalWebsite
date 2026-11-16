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
function toggleFields() {
    const type = document.getElementById("uploadType")?.value;

    const facilitySection = document.getElementById("facilitySection");
    const gallerySection = document.getElementById("gallerySection");

    if (!facilitySection || !gallerySection) return;

    facilitySection.style.display = "none";
    gallerySection.style.display = "none";

    if (type === "facilities") {
        facilitySection.style.display = "block";
    } else if (type === "gallery") {
        gallerySection.style.display = "block";
    }
}




function downloadExcel() {
    const table = document.getElementById("bookingTable");

    if (!table) {
        alert("Booking table not found.");
        return;
    }

    const rows = table.querySelectorAll("tr");
    const csv = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");

        const rowData = Array.from(cols).map(col => {
            const value = col.innerText.replace(/"/g, '""');
            return `"${value}"`;
        });

        csv.push(rowData.join(","));
    });

    const csvString = csv.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}

window.onload = function () {

    if (document.getElementById("uploadType")) {
        toggleFields();
    }

};


// Reset function
function resetSearch() {
    const searchInput = document.getElementById("searchBooking");

    if (searchInput) {
        searchInput.value = "";
    }

    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        row.style.display = "";
    });
}
