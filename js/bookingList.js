
import {
    auth,
    db,
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onAuthStateChanged
} from "./firebase.js";

const ADMIN_UID = "3P67JQdgKndZydxkWmsNgdRWcEf1";

let allBookings = [];

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchBooking");

// --------------------------------------
// LOAD BOOKINGS
// --------------------------------------

async function loadBookings() {
    try {
        tableBody.innerHTML = `
            <tr><td colspan="7">Loading bookings...</td></tr>
        `;

        const snapshot = await getDocs(collection(db, "bookings"));

        allBookings = snapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        }));

        console.log("Bookings loaded:", allBookings.length);

        applySearch();

    } catch (error) {
        console.error("Error loading bookings:", error);

        tableBody.innerHTML = `
            <tr><td colspan="7">Unable to load bookings. Check console.</td></tr>
        `;
    }
}

// --------------------------------------
// DISPLAY BOOKINGS
// --------------------------------------

function renderBookings(bookings) {
    tableBody.innerHTML = "";

    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="7">No bookings found.</td></tr>
        `;
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement("tr");

        const values = [
            booking.name || "N/A",
            booking.phone || "N/A",
            booking.date || "N/A",
            booking.timings || "N/A",
            booking.eventType || "N/A",
            booking.email || "N/A"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // ACTIONS COLUMN
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", () => {
            window.editBooking(booking.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            window.deleteBooking(booking.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

// --------------------------------------
// SEARCH BOOKINGS
// --------------------------------------

function applySearch() {
    const searchText = searchInput?.value.toLowerCase().trim() || "";

    const filteredBookings = allBookings.filter(booking => {
        return [
            booking.name,
            booking.phone,
            booking.date,
            booking.timings,
            booking.eventType,
            booking.email
        ].some(value =>
            String(value ?? "").toLowerCase().includes(searchText)
        );
    });

    renderBookings(filteredBookings);
}

if (searchInput) {
    searchInput.addEventListener("input", applySearch);
}

// --------------------------------------
// RESET SEARCH
// --------------------------------------

window.resetSearch = function () {
    if (searchInput) {
        searchInput.value = "";
    }

    renderBookings(allBookings);
};

// --------------------------------------
// EDIT BOOKING
// --------------------------------------

window.editBooking = async function (id) {
    const booking = allBookings.find(item => item.id === id);

    if (!booking) {
        alert("Booking not found.");
        return;
    }

    const fields = [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "date", label: "Date (YYYY-MM-DD)" },
        { key: "timings", label: "Timings" },
        { key: "eventType", label: "Event Type" },
        { key: "email", label: "Email ID" }
    ];

    const choice = prompt(
        "What do you want to edit?\n\n" +
        fields.map((field, index) =>
            `${index + 1} - ${field.label}`
        ).join("\n")
    );

    if (choice === null) return;

    const selectedField = fields[Number(choice) - 1];

    if (!selectedField) {
        alert("Invalid choice.");
        return;
    }

    const newValue = prompt(
        `Enter new ${selectedField.label}:`,
        booking[selectedField.key] || ""
    );

    if (newValue === null) return;

    const value = newValue.trim();

    if (!value) {
        alert("Value cannot be empty.");
        return;
    }

    if (selectedField.key === "date" &&
        !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        alert("Please enter the date in YYYY-MM-DD format.");
        return;
    }

    try {
        await updateDoc(doc(db, "bookings", id), {
            [selectedField.key]: value
        });

        alert("Booking updated successfully!");

        await loadBookings();

    } catch (error) {
        console.error("Booking update error:", error);
        alert("Unable to update booking.");
    }
};

// --------------------------------------
// DELETE BOOKING
// --------------------------------------

window.deleteBooking = async function (id) {
    const confirmed = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, "bookings", id));

        alert("Booking deleted successfully!");

        await loadBookings();

    } catch (error) {
        console.error("Booking deletion error:", error);
        alert("Unable to delete booking.");
    }
};

// --------------------------------------
// DOWNLOAD BOOKINGS AS CSV
// --------------------------------------

window.downloadExcel = function () {
    if (allBookings.length === 0) {
        alert("No bookings available to download.");
        return;
    }

    const headers = [
        "Name",
        "Phone",
        "Date",
        "Timings",
        "Event Type",
        "Email"
    ];

    const rows = allBookings.map(booking => [
        booking.name,
        booking.phone,
        booking.date,
        booking.timings,
        booking.eventType,
        booking.email
    ]);

    const escapeCSV = value =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
        headers,
        ...rows
    ].map(row =>
        row.map(escapeCSV).join(",")
    ).join("\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Krishna_Mahal_Bookings.csv";
    link.click();

    URL.revokeObjectURL(url);
};

// --------------------------------------
// ADMIN AUTHENTICATION
// --------------------------------------

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    if (user.uid !== ADMIN_UID) {
        alert("Unauthorized access.");
        return;
    }

    await loadBookings();
});
