
// --------------------------------------
// BOOKING PAGE - FIREBASE BACKEND API
// --------------------------------------

const API_URL = "https://mini-mahal-backend.onrender.com";

// --------------------------------------
// POPUP
// --------------------------------------

window.openPopup = function () {
    const popup = document.getElementById("popup");

    if (popup) {
        popup.style.display = "block";
    }
};

// --------------------------------------
// BOOKING FORM SUBMISSION
// --------------------------------------

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("username").value.trim();
        const phone = document.getElementById("userphone").value.trim();
        const eventType = document.getElementById("eventType").value;
        const date = document.getElementById("bookingdate").value;
        const timings = document.getElementById("timings").value;
        const email = document.getElementById("email").value.trim();

        // Validate fields
        if (!name || !phone || !eventType || !date || !timings || !email) {
            alert("Please fill all fields ❌");
            return;
        }

        const booking = {
            name,
            phone,
            eventType,
            date,
            timings,
            email
        };

        const submitButton = bookingForm.querySelector('[type="submit"]');

        try {

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }

            // Send booking to Render backend
            const response = await fetch(`${API_URL}/website-booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {

                if (response.status === 409) {
                    alert("This date and timing are already booked ❌");
                } else {
                    alert(result.message || "Error submitting booking ❌");
                }

                return;
            }

            if (result.emailSent) {
                alert("Booking Successful! Confirmation email sent ✅");
            } else {
                alert("Booking Successful! However, confirmation email could not be sent. Please contact the Mahal.");
            }

            bookingForm.reset();

            // Refresh calendar after successful booking
            loadBookedDates();

        } catch (error) {

            console.error("Booking submission error:", error);

            alert("Unable to connect to the booking server. Please try again.");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Book Now";
            }

        }

    });

}


// --------------------------------------
// FULLCALENDAR INITIALIZATION
// --------------------------------------

const calendarEl = document.getElementById("calendar");

let calendar = null;

if (calendarEl && typeof FullCalendar !== "undefined") {

    calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: "dayGridMonth",

        height: 400,

        dateClick: function (info) {

            const bookingDate = document.getElementById("bookingdate");

            if (bookingDate) {
                bookingDate.value = info.dateStr;
            }

        },

        datesSet: function () {

            loadBookedDates();

        }

    });

    calendar.render();

}


// --------------------------------------
// CALENDAR TIMING CHANGE
// --------------------------------------

const calendarTiming = document.getElementById("calendarTiming");

if (calendarTiming) {

    calendarTiming.addEventListener("change", loadBookedDates);

}


// --------------------------------------
// LOAD PUBLIC BOOKING AVAILABILITY
// --------------------------------------

async function loadBookedDates() {

    if (!calendar) return;

    const selectedTiming = calendarTiming?.value;

    calendar.removeAllEvents();

    if (!selectedTiming) return;

    try {

        const currentDate = calendar.getDate();

        const year = currentDate.getFullYear();

        const month = String(currentDate.getMonth() + 1).padStart(2, "0");

        const monthString = `${year}-${month}`;

        // Request public availability from Render
        const response = await fetch(
            `${API_URL}/public-availability?month=${monthString}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load availability");
        }

        // Store booked dates for selected timing
        const bookedDates = new Set(
            result.bookedSlots
                .filter(slot => slot.timings === selectedTiming)
                .map(slot => slot.date)
        );

        // Get number of days in current month
        const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

        // Today's date in local timezone
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // Display availability
        for (let day = 1; day <= daysInMonth; day++) {

            const date = new Date(year, currentDate.getMonth(), day);

            const dateStr =
                `${year}-${month}-${String(day).padStart(2, "0")}`;

            // Skip past dates
            if (date < today) {
                continue;
            }

            if (bookedDates.has(dateStr)) {

                // BOOKED
                calendar.addEvent({
                    start: dateStr,
                    title: "🔴",
                    color: "transparent",
                    textColor: "#FF0000"
                });

            } else {

                // AVAILABLE
                calendar.addEvent({
                    start: dateStr,
                    title: "🟢",
                    color: "transparent",
                    textColor: "#25D366"
                });

            }

        }

    } catch (error) {

        console.error("Availability loading error:", error);

    }

}
