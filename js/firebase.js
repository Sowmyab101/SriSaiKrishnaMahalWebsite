

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, addDoc, collection, getDocs, query, where } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBj0vfVWokM6qSBXVIyrNB-YZrOTMLANmM",
    authDomain: "myfirstproject-1cc9f.firebaseapp.com",
    projectId: "myfirstproject-1cc9f"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);