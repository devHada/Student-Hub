import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCR3nu-dTkCYOXskrac2C9Aijh1EpZqGRk",
  authDomain: "student-hub-b790f.firebaseapp.com",
  projectId: "student-hub-b790f",
  storageBucket: "student-hub-b790f.firebasestorage.app",
  messagingSenderId: "922755929880",
  appId: "1:922755929880:web:5d946213fe27bab064706d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
