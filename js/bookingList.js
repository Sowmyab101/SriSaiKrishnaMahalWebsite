import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
  querySnapshot.forEach((bookingDoc) => {

  const data = bookingDoc.data();
  const bookingId = bookingDoc.id;


  allBookings.push({
    id: bookingId,
    ...data
});

  const row = `
  <tr>
    <td>${data.name || "N/A"}</td>
    <td>${data.phone || "N/A"}</td>
    <td>${data.date || "N/A"}</td>
    <td>${data.timings || "N/A"}</td>
    <td>${data.eventType || "N/A"}</td>
    <td>${data.email || "N/A"}</td>

    <td>
      <button class="edit-btn" onclick="editBooking('${bookingId}')">
        <i class="fas fa-edit"></i>
        Edit
      </button>

      <button class="delete-btn" onclick="deleteBooking('${bookingId}')">
        <i class="fas fa-trash"></i> 
        Delete
      </button>
    </td>
  </tr>
  `;

  tableBody.innerHTML += row;
});



  } catch (error) {
    console.error(error);
    alert("Error loading bookings");
  }


  window.deleteBooking = async function(id) {

  const confirmDelete =
    confirm("Delete this booking?");

  if (!confirmDelete) return;

  await deleteDoc(doc(db, "bookings", id));

  alert("Booking deleted successfully");

  location.reload();
};

//Edit function
window.editBooking = async function(id) {

  const choice = prompt(
`What do you want to edit?

1 - Name
2 - Phone
3 - Date
4 - Timings
5 - Event Type
6 - Email ID`
  );

  let updateData = {};

  switch(choice){

    case "1":
      updateData.name =
        prompt("Enter new name:");
      break;

    case "2":
      updateData.phone =
        prompt("Enter new phone number:");
      break;

    case "3":
      updateData.date =
        prompt("Enter new date (YYYY-MM-DD):");
      break;

    case "4":
      updateData.timings =
        prompt("Enter new timing:");
      break;

    case "5":
      updateData.eventType =
        prompt("Enter new event type:");
      break;
    case "6":
      updateData.email = 
       prompt("Enter the new Email ID");
      break;

    default:
      alert("Invalid choice");
      return;
  }

  await updateDoc(
    doc(db, "bookings", id),
    updateData
  );

  alert("Booking updated successfully");

  location.reload();
};


document.getElementById("searchBooking")
.addEventListener("keyup", function () {

    const searchText =
        this.value.toLowerCase();

    const rows =
        document.querySelectorAll("#tableBody tr");

    rows.forEach((row) => {

        const text =
            row.textContent.toLowerCase();

        if (text.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});