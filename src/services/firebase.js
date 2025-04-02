// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Importar la autenticación
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj7n9DEY0jItP1djCpa9_4_oCERnU5hOY",
  authDomain: "proyecto-red-social-c0a7f.firebaseapp.com",
  projectId: "proyecto-red-social-c0a7f",
  storageBucket: "proyecto-red-social-c0a7f.appspot.com",
  messagingSenderId: "258122533877",
  appId: "1:258122533877:web:bdc0d11ce80f4eb8632ebc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Inicia la conexion con firestore y exporta la referancia de la base
export const db = getFirestore(app);
export const auth = getAuth(app);
const storage = getStorage(app);

export {storage}