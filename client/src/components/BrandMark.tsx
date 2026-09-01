/* Paper Garden style: the mark is the small recurring ink-and-marigold field note that anchors every surface. */
const logoUrl = "/assets/kamunungan-logo.png";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand-lockup brand-lockup--compact" : "brand-lockup"}>
      <img className="brand-mark" src={logoUrl} alt="" aria-hidden="true" />
      <div className="brand-copy">
        <span className="brand-kicker">Public elementary school</span>
        <span className="brand-name">Kamunungan</span>
      </div>
    </div>
  );
}
