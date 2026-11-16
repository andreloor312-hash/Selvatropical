import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdCK9zUMR9C-a4uDegBvaiIQ9JkrmGmLk",
  authDomain: "todoesnatural-2fb6f.firebaseapp.com",
  projectId: "todoesnatural-2fb6f",
  storageBucket: "todoesnatural-2fb6f.firebasestorage.app",
  messagingSenderId: "96579651310",
  appId: "1:96579651310:web:0108ad272eddd919c6d5ff",
  measurementId: "G-J0GVM5J3SM"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);