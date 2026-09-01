/* Paper Garden style: access feels like opening the teacher desk—quiet, trustworthy, and supported by small handwritten-style cues. */
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, KeyRound, Loader2, Mail, UserRound } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyFirebaseError, signInWithGoogle } from "@/lib/firebase";

export default function Access() {
  const { user, signIn, createAccount } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (user) setLocation("/dashboard"); }, [setLocation, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWorking(true);
    try {
      if (mode === "signin") await signIn(email, password);
      else await createAccount(name, email, password);
      setLocation("/dashboard");
    } catch (caught) {
      setError(friendlyFirebaseError(caught));
    } finally {
      setWorking(false);
    }
  }

  async function googleAccess() {
    setError("");
    setWorking(true);
    try {
      await signInWithGoogle();
      setLocation("/dashboard");
    } catch (caught) {
      setError(friendlyFirebaseError(caught));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="access-page">
      <div className="access-page__topbar"><Link href="/"><BrandMark /></Link><Link className="back-link" href="/"><ArrowLeft size={15} /> Back to school home</Link></div>
      <div className="access-page__grid">
        <section className="access-story"><div className="field-label"><span className="field-mark field-mark--yellow" /> Teacher desk</div><h1>{mode === "signin" ? "A clear place to keep the school moving." : "Make the next note easy to find."}</h1><p>{mode === "signin" ? "Sign in to share announcements and activities with the Kamunungan community." : "Create your teacher account and start keeping families in the loop."}</p><div className="desk-promise"><div className="promise-line"><Check size={16} /><span>One workspace for every update</span></div><div className="promise-line"><Check size={16} /><span>Clear dates, places, and next steps</span></div><div className="promise-line"><Check size={16} /><span>Built for the rhythm of school life</span></div></div><div className="access-story__note">“The best notice is the one that helps a family know what to do next.”</div></section>
        <section className="access-panel"><div className="access-panel__tape" aria-hidden="true" /><div className="access-panel__margin"><span className="field-mark field-mark--yellow" /> Teacher access · Firebase protected</div><div className="access-panel__header"><span className="eyebrow">{mode === "signin" ? "Welcome back" : "New teacher account"}</span><h2>{mode === "signin" ? "Open the teacher desk" : "Create your account"}</h2><p>{mode === "signin" ? "Use your school email or Google account." : "Your Firebase account will be ready in a moment."}</p></div>
          <div className="access-tabs" role="tablist"><button className={mode === "signin" ? "is-active" : ""} onClick={() => { setMode("signin"); setError(""); }} role="tab" aria-selected={mode === "signin"}>Sign in</button><button className={mode === "signup" ? "is-active" : ""} onClick={() => { setMode("signup"); setError(""); }} role="tab" aria-selected={mode === "signup"}>Create account</button></div>
          <form className="access-form" onSubmit={submit}>
            {mode === "signup" && <label className="form-field"><span>Your name</span><div className="input-wrap"><UserRound size={17} /><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Maria Santos" autoComplete="name" /></div></label>}
            <label className="form-field"><span>Email address</span><div className="input-wrap"><Mail size={17} /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@school.edu.ph" autoComplete="email" /></div></label>
            <label className="form-field"><span>Password</span><div className="input-wrap"><KeyRound size={17} /><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button type="button" className="password-toggle" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button--marigold button--full" type="submit" disabled={working}>{working ? <Loader2 className="spin" size={17} /> : null}{mode === "signin" ? "Sign in to dashboard" : "Create teacher account"}<ArrowUpRight size={17} /></button>
          </form>
          <div className="or-divider"><span>or continue with</span></div><button className="google-button" type="button" onClick={googleAccess} disabled={working}><span className="google-g">G</span> Google account <ArrowUpRight size={16} /></button>
          <p className="access-footnote">By continuing, you agree to use this space for official Kamunungan school updates.</p>
        </section>
      </div>
    </div>
  );
}
