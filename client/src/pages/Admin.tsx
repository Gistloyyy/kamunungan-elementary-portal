/* Paper Garden style: admin review is an ink-blue school-office ledger with paper account slips and restrained status colors. */
import { useEffect, useState } from "react";
import { Link, Redirect } from "wouter";
import { ArrowLeft, Check, Clock3, Loader2, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyFirebaseError, listTeacherProfiles, setTeacherApproval, type AccountStatus, type TeacherProfile } from "@/lib/firebase";

export default function Admin() {
  const { user, isAdmin, logOut } = useAuth();
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingUid, setWorkingUid] = useState("");
  useEffect(() => { if (!isAdmin) return; listTeacherProfiles().then(setProfiles).catch((error) => toast.error(friendlyFirebaseError(error))).finally(() => setLoading(false)); }, [isAdmin]);
  if (!user) return <Redirect to="/access" />;
  if (!isAdmin) return <Redirect to="/dashboard" />;
  async function updateStatus(profile: TeacherProfile, status: Exclude<AccountStatus, "pending">) { setWorkingUid(profile.uid); try { await setTeacherApproval(profile.uid, status); setProfiles((current) => current.map((item) => item.uid === profile.uid ? { ...item, status } : item)); toast.success(status === "approved" ? `${profile.displayName} can now publish.` : `${profile.displayName} was marked as rejected.`); } catch (error) { toast.error(friendlyFirebaseError(error)); } finally { setWorkingUid(""); } }
  async function logout() { await logOut(); }
  const pending = profiles.filter((profile) => profile.status === "pending");
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/"><BrandMark compact /></Link><div className="admin-sidebar__rule" /><span className="sidebar-label">Administrator</span><div className="admin-sidebar__active"><ShieldCheck size={17} /> Account approvals</div><div className="admin-sidebar__footer"><span>{user.email}</span><button onClick={logout}><LogOut size={15} /> Sign out</button><Link href="/dashboard"><ArrowLeft size={15} /> Teacher desk</Link></div></aside><main className="admin-main"><header className="admin-header"><div><span className="eyebrow">School office · access control</span><h1>Who can post?</h1><p>Review teacher accounts before they can publish on the public noticeboard.</p></div><div className="admin-header__count"><strong>{pending.length}</strong><span>awaiting review</span></div></header><section className="admin-panel"><div className="admin-panel__heading"><div><span className="field-label"><span className="field-mark field-mark--yellow" /> Teacher accounts</span><h2>Approval ledger</h2></div><span className="admin-panel__hint">{profiles.length} registered</span></div>{loading ? <div className="admin-loading"><Loader2 className="spin" size={20} /> Reading the ledger…</div> : profiles.length ? <div className="account-list">{profiles.map((profile) => <article className="account-card" key={profile.uid}><div className="account-card__avatar"><UserRound size={18} /></div><div className="account-card__copy"><strong>{profile.displayName}</strong><span>{profile.email}</span><small>Joined {profile.createdAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(profile.createdAt) : "recently"}</small></div><span className={`account-status account-status--${profile.status}`}>{profile.status === "pending" ? <Clock3 size={13} /> : profile.status === "approved" ? <Check size={13} /> : <X size={13} />}{profile.status}</span><div className="account-card__actions">{profile.status !== "approved" && <button className="button button--approve" disabled={workingUid === profile.uid} onClick={() => updateStatus(profile, "approved")}><Check size={15} /> Approve</button>}{profile.status !== "rejected" && <button className="icon-button icon-button--danger" disabled={workingUid === profile.uid} onClick={() => updateStatus(profile, "rejected")} aria-label={`Reject ${profile.displayName}`}><X size={16} /></button>}</div></article>)}</div> : <div className="admin-empty"><ShieldCheck size={24} /><h3>No teacher accounts yet.</h3><p>New teacher registrations will appear here for review.</p></div>}</section></main></div>;
}
