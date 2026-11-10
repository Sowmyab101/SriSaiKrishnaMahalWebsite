
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBj0vfVWokM6qSBXVIyrNB-YZrOTMLANmM",
    authDomain: "myfirstproject-1cc9f.firebaseapp.com",
    projectId: "myfirstproject-1cc9f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// HTML elements
const tableBody = document.querySelector("#bookingTable tbody");
const upcomingEventsDiv = document.getElementById("upcomingEvents");


// -------------------------------------
// 1. REAL-TIME BOOKING COUNT & TABLE
// -------------------------------------

onSnapshot(
    collection(db, "bookings"),

    (snapshot) => {

        // Update total booking count
        document.getElementById("totalBookings").textContent =
            snapshot.size;

        let upcomingBookings = [];

        // Clear existing table
        tableBody.innerHTML = "";

        snapshot.forEach((doc) => {

            const data = doc.data();

            // Create table row safely
            const row = document.createElement("tr");

            const values = [
                data.name || "N/A",
                data.phone || "N/A",
                data.date || "N/A",
                data.timings || "N/A",
                data.email || "N/A"
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);


            // Check upcoming bookings
            if (data.date) {

                const bookingDate = new Date(data.date);
                const today = new Date();

                today.setHours(0, 0, 0, 0);
                bookingDate.setHours(0, 0, 0, 0);

                if (bookingDate >= today) {
                    upcomingBookings.push(data);
                }
            }

        });


        // Sort upcoming events
        upcomingBookings.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );


        // Display next 5 events
        const nextEvents = upcomingBookings.slice(0, 5);

        upcomingEventsDiv.innerHTML = "";

        if (nextEvents.length === 0) {

            upcomingEventsDiv.textContent =
                "No upcoming events found.";

        } else {

            nextEvents.forEach((event) => {

                const eventItem = document.createElement("div");
                eventItem.className = "event-item";

                const heading = document.createElement("h4");
                heading.textContent = event.name || "Guest";

                const details = [
                    `📅 ${event.date}`,
                    `🎉 ${event.eventType || "Event"}`,
                    `⏰ ${event.timings || "N/A"}`,
                    `📧 ${event.email || "N/A"}`
                ];

                eventItem.appendChild(heading);

                details.forEach((detail) => {
                    const p = document.createElement("p");
                    p.textContent = detail;
                    eventItem.appendChild(p);
                });

                upcomingEventsDiv.appendChild(eventItem);

            });

        }

    },

    (error) => {
        console.error("Booking listener error:", error);
    }
);


// -------------------------------------
// 2. REAL-TIME GALLERY IMAGE COUNT
// -------------------------------------

onSnapshot(
    collection(db, "gallery"),

    (snapshot) => {

        document.getElementById("galleryCount").textContent =
            snapshot.size;

        console.log("Gallery count updated:", snapshot.size);

    },

    (error) => {
        console.error("Gallery listener error:", error);
    }
);


// -------------------------------------
// 3. REAL-TIME FACILITIES IMAGE COUNT
// -------------------------------------

onSnapshot(
    collection(db, "facilities"),

    (snapshot) => {

        document.getElementById("facilitiesCount").textContent =
            snapshot.size;

        console.log("Facilities count updated:", snapshot.size);

    },

    (error) => {
        console.error("Facilities listener error:", error);
    }
);
