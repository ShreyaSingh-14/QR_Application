// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUxX4OIPxAnuuq4-bzs5KRr5KWPJFY-Aw",
  authDomain: "projectapp-2d0df.firebaseapp.com",
  projectId: "projectapp-2d0df",
  storageBucket: "projectapp-2d0df.firebasestorage.app",
  messagingSenderId: "129739364420",
  appId: "1:129739364420:web:c86c0456051ebe5c42c411",
  measurementId: "G-1VQ2JLJCDH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}) ;
export const db=getFirestore(app);
//using export will make it available to be used troughout the application