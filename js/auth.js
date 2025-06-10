// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxbReQ0eowOvCjIypf7xClkYmlBDVoL6Y",
  authDomain: "site-test-28e25.firebaseapp.com",
  projectId: "site-test-28e25",
  storageBucket: "site-test-28e25.firebasestorage.app",
  messagingSenderId: "840111898434",
  appId: "1:840111898434:web:a1d3666c629de7ce8c12db",
  measurementId: "G-0QF4TDR8V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Fonctions d’inscription et de connexion
function inscription(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function connexion(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function deconnexion() {
  return auth.signOut();
}
