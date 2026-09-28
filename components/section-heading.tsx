export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  id,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">
        <span className="section-number">{number}</span>
        {eyebrow}
      </p>
      <h2 id={id}>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
