// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage';

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// PASTE API KEY HERE

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// firestore
const db = getFirestore(app);

// cloud firestore
const storage = getStorage(app);

export { db, auth, storage };
