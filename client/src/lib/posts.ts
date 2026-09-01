/* Paper Garden style: content helpers preserve a simple vocabulary—notice, activity, date, place—so the UI stays human and scannable. */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, type ContentKind, type PostAttachment, type SchoolPost } from "@/lib/firebase";

export const starterPosts: SchoolPost[] = [
  {
    id: "starter-1",
    kind: "announcement",
    title: "A new term, a shared promise",
    body: "We are ready to welcome every learner back with curious minds, kind hands, and room to grow. Please check the class schedules and bring a labeled water bottle.",
    gradeLevel: "All grades",
    subject: "School-wide",
    dateLabel: "Jun 03, 2026",
    dateValue: "2026-06-03",
    authorName: "School Office",
    authorId: "starter",
    createdAt: 3,
  },
  {
    id: "starter-2",
    kind: "activity",
    title: "Family reading morning",
    body: "Bring a favorite story and join us for a relaxed morning of shared reading, read-alouds, and bookmark-making.",
    gradeLevel: "All grades",
    subject: "English",
    dateLabel: "Jun 12, 2026",
    dateValue: "2026-06-12",
    location: "Library corner · 8:00 AM",
    authorName: "Grade 3 Team",
    authorId: "starter",
    createdAt: 2,
  },
  {
    id: "starter-3",
    kind: "activity",
    title: "Garden club: first planting",
    body: "Our young gardeners will prepare the herb beds and learn why small actions help a whole community thrive.",
    gradeLevel: "All grades",
    subject: "Science",
    dateLabel: "Jun 19, 2026",
    dateValue: "2026-06-19",
    location: "School garden · 3:30 PM",
    authorName: "Eco Club",
    authorId: "starter",
    createdAt: 1,
  },
];

export function subscribeToPosts(onChange: (posts: SchoolPost[]) => void, onError: () => void) {
  const postsQuery = query(collection(db, "posts"), orderBy("dateValue", "asc"));
  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        kind: (data.kind ?? "announcement") as ContentKind,
        title: String(data.title ?? "Untitled notice"),
        body: String(data.body ?? ""),
        gradeLevel: (data.gradeLevel ?? "All grades") as SchoolPost["gradeLevel"],
        subject: (data.subject ?? "School-wide") as SchoolPost["subject"],
        dateLabel: String(data.dateLabel ?? data.dateValue ?? "Date to be announced"),
        dateValue: String(data.dateValue ?? ""),
        location: data.location ? String(data.location) : undefined,
        authorName: String(data.authorName ?? "School Office"),
        authorId: String(data.authorId ?? ""),
        createdAt: data.createdAt?.toMillis?.() ?? undefined,
        attachments: Array.isArray(data.attachments) ? data.attachments.map((attachment: Record<string, unknown>) => ({ name: String(attachment.name || "Download file"), url: String(attachment.url || ""), type: String(attachment.type || "application/octet-stream"), size: Number(attachment.size || 0) })).filter((attachment: PostAttachment) => attachment.url) : undefined,
      } satisfies SchoolPost;
    });
    onChange(posts.length ? posts : starterPosts);
  }, () => {
    onError();
    onChange(starterPosts);
  });
}

export async function createPost(input: Omit<SchoolPost, "id" | "createdAt">) {
  await addDoc(collection(db, "posts"), { ...input, createdAt: serverTimestamp() });
}

export async function editPost(id: string, input: Partial<Omit<SchoolPost, "id" | "createdAt" | "authorId" | "authorName">>) {
  await updateDoc(doc(db, "posts", id), input);
}

export async function removePost(id: string) {
  await deleteDoc(doc(db, "posts", id));
}
