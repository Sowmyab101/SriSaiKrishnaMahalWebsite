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
    const response = await fetch("http://localhost:3000/website-booking", {
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

    height: 350,

    dateClick: function(info){

        document.getElementById("bookingdate").value =
            info.dateStr;

    }

});

calendar.render();
document.getElementById("calendarTiming")
.addEventListener("change", loadBookedDates);

async function loadBookedDates() {

    const selectedTiming =
        document.getElementById("calendarTiming").value;

    if (!selectedTiming) return;

    calendar.removeAllEvents();

    const snapshot =
        await getDocs(collection(db, "bookings"));

    snapshot.forEach((doc) => {

        const booking = doc.data();

        if (booking.timings === selectedTiming) {

            calendar.addEvent({
                start: booking.date,
                title: "Booked",
                color: "red"
            });

        }

    });

}