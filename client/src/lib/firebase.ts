/* Paper Garden style: this data layer stays quiet and dependable so the editorial school noticeboard remains the focus. */
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWKE9-C3i978wWQpl4LsXQZp4HPGw_oVI",
  authDomain: "kamunungan-es.firebaseapp.com",
  projectId: "kamunungan-es",
  storageBucket: "kamunungan-es.firebasestorage.app",
  messagingSenderId: "427161946185",
  appId: "1:427161946185:web:6bef58f161d3405159d798",
  measurementId: "G-Y4XXV1F8RN",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export type ContentKind = "announcement" | "activity";

export type SchoolPost = {
  id: string;
  kind: ContentKind;
  title: string;
  body: string;
  dateLabel: string;
  dateValue: string;
  location?: string;
  authorName: string;
  authorId: string;
  createdAt?: number;
};

export function friendlyFirebaseError(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
    return "That email and password do not match. Please try again.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "An account already exists with that email. Try signing in instead.";
  }
  if (code.includes("auth/weak-password")) {
    return "Please choose a password with at least 6 characters.";
  }
  if (code.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (code.includes("auth/popup-closed-by-user")) {
    return "The sign-in window was closed before it finished.";
  }
  if (code.includes("permission-denied")) {
    return "Firebase denied this action. Check your Firestore rules and try again.";
  }
  return "Something went wrong. Please check your Firebase setup and try again.";
}
