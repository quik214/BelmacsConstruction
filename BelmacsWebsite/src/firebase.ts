// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_BCm9geOD8vanElhZ5D8tqn5tI2cJ8T8",
  authDomain: "belmacs1994.firebaseapp.com",
  projectId: "belmacs1994",
  storageBucket: "belmacs1994.appspot.com",
  messagingSenderId: "151567641645",
  appId: "1:151567641645:web:f45f9265503efb6bc8dca4",
  measurementId: "G-FZXFG5T9KE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// firestore
const db = getFirestore(app);

export { db, auth };