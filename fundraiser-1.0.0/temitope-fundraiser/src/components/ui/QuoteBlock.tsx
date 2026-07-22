/**
 * Oversized pull-quote block — full-bleed saturated brand panel with a huge
 * quotation glyph. Breaks up content sections and injects color contrast.
 */
export function QuoteBlock({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role?: string;
}) {
  return (
    <figure className="rounded-2xl bg-navy px-6 py-10 sm:px-10 sm:py-12 text-white m-0">
      <span
        className="block font-display text-6xl leading-none opacity-70 mb-4 select-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <blockquote className="m-0 mb-6 text-[clamp(1.25rem,4.5vw,1.625rem)] font-medium leading-[1.3]">
        {quote}
      </blockquote>
      <figcaption className="text-sm font-bold">
        {name}
        {role && <span className="font-normal opacity-80"> · {role}</span>}
      </figcaption>
    </figure>
  );
}

export default QuoteBlock;
