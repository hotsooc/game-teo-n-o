import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLvsd6CaY-b6ddGOFnlHvGo5Oc5PFxV2A",
  authDomain: "game-teo-nao.firebaseapp.com",
  projectId: "game-teo-nao",
  storageBucket: "game-teo-nao.firebasestorage.app",
  messagingSenderId: "464238434646",
  appId: "1:464238434646:web:5d0b4d5f27b5310c07def7",
  measurementId: "G-J4BNKFN5MX"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };