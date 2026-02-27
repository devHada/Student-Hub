import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// signup with email and password
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// login with email and password
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// logout
export const logOut = () => {
  return signOut(auth);
};

// google login
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
