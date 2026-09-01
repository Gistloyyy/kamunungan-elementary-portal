/* Paper Garden style: approval state is surfaced calmly as a school-office status, while the authenticated workspace stays protected behind Firebase profile rules. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth";
import { auth, ensureTeacherProfile, subscribeToTeacherProfile, type TeacherProfile } from "@/lib/firebase";

type AuthContextValue = { user: User | null; profile: TeacherProfile | null; loading: boolean; isApproved: boolean; isAdmin: boolean; signIn: (email: string, password: string) => Promise<void>; createAccount: (name: string, email: string, password: string) => Promise<void>; logOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, async (nextUser) => {
      unsubscribeProfile?.(); unsubscribeProfile = undefined;
      setUser(nextUser); setProfile(null); setLoading(true);
      if (!nextUser) { setLoading(false); return; }
      try {
        await ensureTeacherProfile(nextUser);
        unsubscribeProfile = subscribeToTeacherProfile(nextUser.uid, (nextProfile) => { setProfile(nextProfile); setLoading(false); }, () => setLoading(false));
      } catch { setLoading(false); }
    });
    return () => { unsubscribeProfile?.(); unsubscribeAuth(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, profile, loading,
    isApproved: profile?.status === "approved" || profile?.role === "admin",
    isAdmin: profile?.role === "admin",
    async signIn(email, password) { await signInWithEmailAndPassword(auth, email, password); },
    async createAccount(name, email, password) { const result = await createUserWithEmailAndPassword(auth, email, password); if (name.trim()) await updateProfile(result.user, { displayName: name.trim() }); await ensureTeacherProfile(result.user, name.trim()); },
    logOut: () => signOut(auth),
  }), [loading, profile, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
