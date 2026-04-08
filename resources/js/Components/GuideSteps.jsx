/**
 * Turn `**label**` in a string into bold spans for step text.
 */
export function parseGuideBold(s) {
    const parts = String(s).split(/\*\*(.*?)\*\*/g);
    return (
        <span>
            {parts.map((part, j) =>
                j % 2 === 1 ? (
                    <strong key={j}>{part}</strong>
                ) : (
                    <span key={j}>{part}</span>
                ),
            )}
        </span>
    );
}

/**
 * Numbered step list for help guides. Steps may be strings with **bold** markers (use parseGuideBold) or React nodes.
 */
export default function GuideSteps({ steps }) {
    return (
        <ol className="mt-3 list-none space-y-3">
            {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 md:text-[15px]">
                    <span
                        className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/12 text-xs font-bold text-brand-primary"
                        aria-hidden
                    >
                        {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 leading-relaxed pt-0.5">{step}</span>
                </li>
            ))}
        </ol>
    );
}
