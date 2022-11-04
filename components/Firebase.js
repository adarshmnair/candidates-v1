import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import dotenv from 'dotenv'
dotenv.config()

// Initialize Firebase
const fireApp = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
export const db = getFirestore(fireApp)
