// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwSL9ScNWUU38oiigJjaOTy2rlYLE5nEM",
  authDomain: "website-dd62c.firebaseapp.com",
  projectId: "website-dd62c",
  storageBucket: "website-dd62c.appspot.com",
  messagingSenderId: "357148193426",
  appId: "1:357148193426:web:60d9211424050540822c4b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
export { storage, db };
