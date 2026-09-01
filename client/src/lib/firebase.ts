/* Paper Garden style: this data layer stays quiet and dependable so the editorial school noticeboard remains the focus. */
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

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
export const storage = getStorage(app);

export async function uploadPostImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Please choose an image smaller than 5 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const imageRef = ref(storage, `post-images/${crypto.randomUUID()}.${extension}`);
  const task = uploadBytesResumable(imageRef, file, { contentType: file.type, cacheControl: "public,max-age=31536000" });
  return new Promise((resolve, reject) => {
    task.on("state_changed", (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)), reject, async () => {
      try { resolve(await getDownloadURL(task.snapshot.ref)); } catch (error) { reject(error); }
    });
  });
}

const configuredAdminEmail = String(import.meta.env.VITE_ADMIN_EMAIL || "admin@kamunungan.edu.ph").toLowerCase();

export async function ensureTeacherProfile(user: User, displayName?: string) {
  const profileRef = doc(db, "teacherProfiles", user.uid);
  const snapshot = await getDoc(profileRef);
  if (!snapshot.exists()) {
    const isAdmin = user.email?.toLowerCase() === configuredAdminEmail;
    await setDoc(profileRef, { uid: user.uid, displayName: displayName || user.displayName || user.email?.split("@")[0] || "Teacher", email: user.email || "", role: isAdmin ? "admin" : "teacher", status: isAdmin ? "approved" : "pending", createdAt: serverTimestamp() });
  }
}

export function subscribeToTeacherProfile(uid: string, onChange: (profile: TeacherProfile | null) => void, onError?: () => void) {
  return onSnapshot(doc(db, "teacherProfiles", uid), (snapshot) => {
    if (!snapshot.exists()) return onChange(null);
    const data = snapshot.data();
    onChange({ uid, displayName: String(data.displayName || "Teacher"), email: String(data.email || ""), role: (data.role || "teacher") as AccountRole, status: (data.status || "pending") as AccountStatus, createdAt: data.createdAt?.toMillis?.() });
  }, () => onError?.());
}

export async function listTeacherProfiles(): Promise<TeacherProfile[]> {
  const snapshot = await getDocs(query(collection(db, "teacherProfiles"), where("role", "==", "teacher")));
  return snapshot.docs.map((item) => { const data = item.data(); return { uid: item.id, displayName: String(data.displayName || "Teacher"), email: String(data.email || ""), role: "teacher", status: (data.status || "pending") as AccountStatus, createdAt: data.createdAt?.toMillis?.() }; });
}

export async function setTeacherApproval(uid: string, status: Exclude<AccountStatus, "pending">) {
  await updateDoc(doc(db, "teacherProfiles", uid), { status });
}

export async function uploadPostAttachment(file: File, onProgress?: (progress: number) => void): Promise<PostAttachment> {
  const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
  if (!allowed.includes(file.type)) throw new Error("Please choose a PDF, Word document, spreadsheet, or presentation.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Please choose a file smaller than 10 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const fileRef = ref(storage, `post-attachments/${crypto.randomUUID()}.${extension}`);
  const task = uploadBytesResumable(fileRef, file, { contentType: file.type, contentDisposition: `attachment; filename="${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}"` });
  const url = await new Promise<string>((resolve, reject) => task.on("state_changed", (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)), reject, async () => { try { resolve(await getDownloadURL(task.snapshot.ref)); } catch (error) { reject(error); } }));
  return { name: file.name, url, type: file.type, size: file.size };
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export type ContentKind = "announcement" | "activity";
export type GradeLevel = "All grades" | "Kindergarten" | "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6";
export type Subject = "School-wide" | "English" | "Mathematics" | "Science" | "Filipino" | "Araling Panlipunan" | "MAPEH";
export const gradeLevels: GradeLevel[] = ["All grades", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
export const subjects: Subject[] = ["School-wide", "English", "Mathematics", "Science", "Filipino", "Araling Panlipunan", "MAPEH"];

export type AccountStatus = "pending" | "approved" | "rejected";
export type AccountRole = "teacher" | "admin";
export type TeacherProfile = { uid: string; displayName: string; email: string; role: AccountRole; status: AccountStatus; createdAt?: number };
export type PostAttachment = { name: string; url: string; type: string; size: number };

export type SchoolPost = {
  id: string;
  kind: ContentKind;
  title: string;
  body: string;
  gradeLevel: GradeLevel;
  subject: Subject;
  dateLabel: string;
  dateValue: string;
  location?: string;
  authorName: string;
  authorId: string;
  createdAt?: number;
  attachments?: PostAttachment[];
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
  if (code.includes("storage/unauthorized") || code.includes("storage/unauthenticated")) {
    return "Your account needs administrator approval before it can upload files.";
  }
  if (code.includes("storage/canceled")) {
    return "The upload was canceled before it finished.";
  }
  if (code.includes("permission-denied")) {
    return "Firebase denied this action. Check your approval status and Firebase rules.";
  }
  return "Something went wrong. Please check your Firebase setup and try again.";
}
