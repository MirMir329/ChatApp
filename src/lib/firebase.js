import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCDEfaUi7HDRircaLXPchBeZzsLD-zKOjQ",
  authDomain: "reactchattester.firebaseapp.com",
  projectId: "reactchattester",
  storageBucket: "reactchattester.firebasestorage.app",
  messagingSenderId: "482405942620",
  appId: "1:482405942620:web:7e953ac3b743a7a4566d99",
  measurementId: "G-PS6DTD8125"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()