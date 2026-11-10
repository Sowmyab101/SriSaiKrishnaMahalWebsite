import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBj0vfVWokM6qSBXVIyrNB-YZrOTMLANmM",
    authDomain: "myfirstproject-1cc9f.firebaseapp.com",
    projectId: "myfirstproject-1cc9f"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


  const tableBody = document.querySelector("#bookingTable tbody");

window.openPopup = function(){
  document.getElementById("popup").style.display = "block";
}

  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("username").value;
  const phone = document.getElementById("userphone").value
  const eventType = document.getElementById("eventType").value;
  const date = document.getElementById("bookingdate").value;
  const timings = document.getElementById("timings").value;
  const email = document.getElementById("email").value.trim();

  console.log("DEBUG:", name, phone, eventType, date, timings, email);

  // ✅ VALIDATION
  if (!name || !phone || !eventType || !date || !timings || !email) {
    alert("Please fill all fields ❌");
    return;
  }

  const booking = {
    name: name,
    phone: phone,
    eventType: eventType,
    date: date,
    timings: timings,
    email: email,
    createdAt: new Date()
  };

  try {
    // 🔍 CHECK IF DATE ALREADY BOOKED
    const q = query(
      collection(db, "bookings"),
      where("date", "==", date),
      where("timings", "==", timings)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("This date is already booked ❌");
      return;
    }

    // ✅ SAVE BOOKING
    await addDoc(collection(db, "bookings"), booking);
    // Send email notification
    const response = await fetch("https://mini-mahal-backend.onrender.com/website-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(booking)
});

const result = await response.json();

console.log(result);

    alert("Booking Successful ✅");
    document.getElementById("bookingForm").reset();

  } catch (error) {
    console.error(error);
    alert("Error submitting booking ❌");
  }
});

window.submitBooking = async function(){

  let bookingData = {

    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    date: document.getElementById("date").value,

    functionType: document.getElementById("functionType").value,

    timings: document.getElementById("timings").value,

    email: document.getElementById("email").value,

    createdAt: new Date()

  };

  // SAVE TO FIREBASE

  await addDoc(
    collection(db, "whatsappBookings"),
    bookingData
  );

  
  // OPEN WHATSAPP

  window.open(
    `https://wa.me/919000000?text=${encodedMessage}`,
    "_blank"
  );

}

const calendarEl = document.getElementById("calendar");

const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",

    height: 400,

    dateClick: function(info) {

        document.getElementById("bookingdate").value =
            info.dateStr;

    },

    datesSet: function() {

        // Reload availability whenever the user
        // moves to another month
        loadBookedDates();

    }

});

calendar.render();


document.getElementById("calendarTiming")
    .addEventListener("change", loadBookedDates);


async function loadBookedDates() {

    const selectedTiming =
        document.getElementById("calendarTiming").value;

    // Clear existing Available / Booked labels
    calendar.removeAllEvents();

    // User must select a timing first
    if (!selectedTiming) return;


    try {

        // Get all bookings from Firebase
        const snapshot =
            await getDocs(collection(db, "bookings"));


        // Store dates that are already booked
        const bookedDates = new Set();


        snapshot.forEach((doc) => {

            const booking = doc.data();

            if (booking.timings === selectedTiming) {

                bookedDates.add(booking.date);

            }

        });


        // Get the currently displayed month
        const currentDate = calendar.getDate();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();


        // Number of days in the current month
        const daysInMonth =
            new Date(year, month + 1, 0).getDate();


        // Today's date
        const today = new Date();

        today.setHours(0, 0, 0, 0);


        // Add Available / Booked status
        for (let day = 1; day <= daysInMonth; day++) {

            const date = new Date(year, month, day);

            const dateStr =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


            // Don't show "Available" for past dates
            if (date < today) {
                continue;
            }


            if (bookedDates.has(dateStr)) {

                // 🔴 BOOKED
                calendar.addEvent({
    start: dateStr,
    title: "🔴",
    color: "transparent",
    textColor: "#FF0000"
});

            } else {

                // 🟢 AVAILABLE
                calendar.addEvent({
    start: dateStr,
    title: "🟢",
    color: "transparent",
    textColor: "#25D366"
});

            }

        }

    } catch (error) {

        console.error(
            "Error loading booking availability:",
            error
        );

    }

}