// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUb3LKoqx9Og2GfcHP4ekZf3JgW8MBe4E",
  authDomain: "filmgo-microservice-69402.firebaseapp.com",
  projectId: "filmgo-microservice-69402",
  storageBucket: "filmgo-microservice-69402.firebasestorage.app",
  messagingSenderId: "633617189632",
  appId: "1:633617189632:web:db12e139ef30588a8e81e5",
  measurementId: "G-BYK77Q5Z21",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
