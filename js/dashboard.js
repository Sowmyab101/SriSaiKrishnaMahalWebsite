import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBj0vfVWokM6qSBXVIyrNB-YZrOTMLANmM",
    authDomain: "myfirstproject-1cc9f.firebaseapp.com",
    projectId: "myfirstproject-1cc9f"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


  const tableBody = document.querySelector("#bookingTable tbody");



  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));

    document.getElementById("totalBookings").textContent = querySnapshot.size;
    //document.getElementById("galleryCount").textContent = querySnapshot.size;

    const upcomingEventsDiv = document.getElementById("upcomingEvents");
    let upcomingBookings = [];

    

    // Clear table before adding rows
    tableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Booking table
        const row = `
        <tr>
            <td>${data.name || "N/A"}</td>
            <td>${data.phone || "N/A"}</td>
            <td>${data.date || "N/A"}</td>
            <td>${data.timings || "N/A"}</td>
            <td>${data.email || "N/A" } </td>
        </tr>
        `;

        tableBody.innerHTML += row;

        // Upcoming events
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

    // Sort nearest first
    upcomingBookings.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Show next 5 events
    const nextEvents = upcomingBookings.slice(0, 5);

    let eventsHTML = "";

    nextEvents.forEach((event) => {
        eventsHTML += `
            <div class="event-item">
                <h4>${event.name || "Guest"}</h4>
                <p>📅 ${event.date}</p>
                <p>🎉 ${event.eventType || "Event"}</p>
                <p>⏰ ${event.timings || "N/A"}</p>
                <p>📧 ${event.email || "N/A"}</p>
            </div>
        `;
    });

    upcomingEventsDiv.innerHTML =
        eventsHTML || "<p>No upcoming events found.</p>";

} catch (error) {
    console.error(error);
    alert("Error loading bookings");
}