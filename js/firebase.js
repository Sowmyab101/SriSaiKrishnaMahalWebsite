
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    query,
    where,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBj0vfVWokM6qSBXVIyrNB-YZrOTMLANmM",
    authDomain: "myfirstproject-1cc9f.firebaseapp.com",
    projectId: "myfirstproject-1cc9f"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services and functions
export {
    app,
    db,
    auth,
    collection,
    getDocs,
    addDoc,
    query,
    where,
    deleteDoc,
    updateDoc,
    doc,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};
