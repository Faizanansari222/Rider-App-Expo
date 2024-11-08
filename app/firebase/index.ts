// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getFirestore,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBxq-H6DETp0Fq9Fxt2qMM5PlbcgbWljJE",
  authDomain: "rider-app-a8785.firebaseapp.com",
  projectId: "rider-app-a8785",
  storageBucket: "rider-app-a8785.appspot.com",
  messagingSenderId: "1023403641499",
  appId: "1:1023403641499:web:2d5ad561f27913aefe543e",
  measurementId: "G-F52T6WGM4B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

function addRideToDB(ride: any) {
  return addDoc(collection(db, "rides"), ride);
}

export {addRideToDB, db, onSnapshot,query, collection,  }