import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
