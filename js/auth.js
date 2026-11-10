
import {
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "./firebase.js";

const ADMIN_UID = "3P67JQdgKndZydxkWmsNgdRWcEf1";

// Admin login
window.login = async function () {

    const email = document.getElementById("Adminemail").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");

    message.textContent = "";

    if (!email || !password) {
        message.textContent = "Enter your email and password.";
        return;
    }

    try {

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log("Logged-in UID:", result.user.uid);
        console.log("Expected admin UID:", ADMIN_UID);
        console.log("UID matches:", result.user.uid === ADMIN_UID);

        if (result.user.uid !== ADMIN_UID) {

            await signOut(auth);

            message.textContent = "You are not authorized to access admin.";

            return;
        }

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login error:", error);

        message.textContent = error.message;

    }
};


// Admin page protection
onAuthStateChanged(auth, async (user) => {

    const currentPage = window.location.pathname.split("/").pop();

    console.log("Auth state changed:", user ? user.uid : "No user");
    console.log("Current page:", currentPage);

    const adminPages = [
        "dashboard.html",
        "BookingsLists.html",
        "gallery-admin.html"
    ];

    if (!adminPages.includes(currentPage)) {
        return;
    }

    if (!user) {
        console.log("No authenticated user. Redirecting.");
        window.location.replace("admin.html");
        return;
    }

    if (user.uid !== ADMIN_UID) {
        console.log("UID mismatch. Signing out.");

        await signOut(auth);
        window.location.replace("admin.html");
    }
});

// Logout
window.logout = async function () {

    try {

        await signOut(auth);

        window.location.replace("admin.html");

    } catch (error) {

        console.error("Logout error:", error);

    }

};
