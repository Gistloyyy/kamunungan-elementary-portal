/* Paper Garden style: asymmetric editorial noticeboard, warm paper surfaces, ink-blue structure, and purposeful marigold actions. */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CalendarDays, ChevronRight, Clock3, MapPin, Menu, Pin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { subscribeToPosts, starterPosts } from "@/lib/posts";
import type { SchoolPost } from "@/lib/firebase";

function NoticeSlip({ post, featured = false }: { post: SchoolPost; featured?: boolean }) {
  return (
    <article className={`notice-slip ${featured ? "notice-slip--featured" : ""} ${post.kind === "activity" ? "notice-slip--activity" : "notice-slip--announcement"}`}>
      <div className="notice-slip__edge" aria-hidden="true" />
      <div className="notice-slip__meta">
        <span className="eyebrow">{post.kind === "activity" ? "Activity" : "Announcement"}</span>
        <span className="notice-slip__date">{post.dateLabel}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div className="notice-slip__footer">
        {post.location ? <span><MapPin size={14} /> {post.location}</span> : <span><Pin size={14} /> {post.authorName}</span>}
        {featured && <ArrowUpRight size={18} aria-hidden="true" />}
      </div>
    </article>
  );
}

export default function Home() {
  const [posts, setPosts] = useState<SchoolPost[]>(starterPosts);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => subscribeToPosts(setPosts, () => undefined), []);

  const announcements = useMemo(() => posts.filter((post) => post.kind === "announcement"), [posts]);
  const activities = useMemo(() => posts.filter((post) => post.kind === "activity"), [posts]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" aria-label="Kamunungan Elementary School home"><BrandMark /></Link>
          <button className="mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Main navigation">
            <a href="#notices" onClick={() => setMenuOpen(false)}>Notices</a>
            <a href="#activities" onClick={() => setMenuOpen(false)}>Activities</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>Our school</a>
            <Link href="/access" className="nav-login" onClick={() => setMenuOpen(false)}>Teacher sign in <ArrowUpRight size={15} /></Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-section__wash" aria-hidden="true" />
          <div className="hero-section__inner">
            <div className="hero-copy">
              <div className="field-label hero-reveal"><span className="field-mark" /> Kamunungan · School year 2026</div>
              <h1 className="hero-reveal hero-reveal--delay-1">The week ahead,<br /><em>in one clear place.</em></h1>
              <p className="hero-lede hero-reveal hero-reveal--delay-2">A shared noticeboard for learners, families, and the teachers who make every day count.</p>
              <div className="hero-actions hero-reveal hero-reveal--delay-3">
                <a className="button button--marigold" href="#notices">Read the latest <ArrowUpRight size={17} /></a>
                <a className="text-link" href="#about">What we value <ChevronRight size={16} /></a>
              </div>
            </div>
            <div className="hero-art-wrap hero-reveal hero-reveal--delay-2">
              <div className="hero-art-note"><span>From our<br />school garden</span><Sparkles size={17} /></div>
              <img className="hero-art" src="/manus-storage/kamunungan-hero_97590149.jpg" alt="A sunny elementary school courtyard with a teacher sharing a notice" />
              <div className="hero-board" aria-label="Latest notices">
                <div className="hero-board__label"><span className="field-mark field-mark--clay" /> Latest on the board</div>
                {posts.slice(0, 2).map((post) => <div className="hero-board__slip" key={`hero-${post.id}`}><span>{post.dateLabel}</span><strong>{post.title}</strong><small>{post.kind}</small></div>)}
              </div>
              <div className="hero-art-caption"><span className="caption-line" /> Learning grows here.</div>
            </div>
          </div>
          <div className="hero-bottom-note"><span>Scroll to browse</span><span className="scroll-line" /></div>
        </section>

        <section className="noticeboard-section" id="notices">
          <div className="section-inner noticeboard-layout">
            <div className="section-intro">
              <div className="field-label"><span className="field-mark field-mark--clay" /> On the noticeboard</div>
              <h2>News worth<br /><em>passing on.</em></h2>
              <p>Important notes from the school office, written for the people who keep our community moving.</p>
              <a className="text-link" href="#activities">See the activity calendar <ChevronRight size={16} /></a>
            </div>
            <div className="announcement-stack">
              {announcements.slice(0, 2).map((post, index) => <NoticeSlip key={post.id} post={post} featured={index === 0} />)}
            </div>
          </div>
        </section>

        <section className="activities-section" id="activities">
          <div className="section-inner activities-layout">
            <div className="activities-copy">
              <div className="field-label"><span className="field-mark field-mark--green" /> Mark the calendar</div>
              <h2>Small moments.<br /><em>Big belonging.</em></h2>
              <p>From the library corner to the garden beds, there is always another way to learn together.</p>
              <div className="calendar-stamp"><CalendarDays size={20} /><span><strong>{activities.length || 0}</strong> activities<br />on the board</span></div>
            </div>
            <div className="activities-list">
              {activities.slice(0, 3).map((post, index) => (
                <article className="activity-row" key={post.id}>
                  <div className="activity-row__number">0{index + 1}</div>
                  <div className="activity-row__main"><span className="eyebrow">{post.dateLabel}</span><h3>{post.title}</h3><p>{post.location || post.body}</p></div>
                  <Clock3 className="activity-row__icon" size={20} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="community-section" id="about">
          <div className="community-inner">
            <div className="community-art-wrap"><img src="/manus-storage/kamunungan-community_ce8b3182.jpg" alt="Children and a teacher learning together during a school garden activity" /><span className="image-pin">A place to grow</span></div>
            <div className="community-copy"><div className="field-label"><span className="field-mark" /> Our school</div><h2>Every child brings<br /><em>something bright.</em></h2><p>Kamunungan Elementary School is a place for steady foundations, open questions, and the confidence to try again. This is where families and teachers meet in the middle.</p><div className="signature-line"><span className="signature-dash" /> <span>Curious minds · Kind hands · Shared ground</span></div></div>
          </div>
        </section>

        <section className="teacher-cta-section">
          <div className="teacher-cta-inner"><div><div className="field-label field-label--light"><span className="field-mark field-mark--yellow" /> For teachers</div><h2>Post an update<br /><em>families can act on.</em></h2><p>Keep the noticeboard moving with one simple workspace for announcements and activities.</p><Link className="button button--cream" href="/access">Open the teacher desk <ArrowUpRight size={17} /></Link></div><img src="/manus-storage/kamunungan-teacher-desk_897ea2e8.jpg" alt="A teacher's desk with a notebook and school activity folders" /></div>
        </section>
      </main>

      <footer className="site-footer"><div className="site-footer__inner"><BrandMark compact /><span>Made for the people who make school feel like home.</span><span className="footer-year">Kamunungan Elementary School</span></div></footer>
    </div>
  );
}
