import { useState } from 'react';

/**
 * Shows a screenshot when the file exists under public/images/user-guides/.
 * If the file is missing, shows a dashed placeholder with the expected path for contributors.
 */
export default function GuideScreenshot({ path, caption }) {
    const [missing, setMissing] = useState(false);
    const src = `/images/user-guides/${path}`;

    return (
        <figure className="my-4">
            <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{caption}</figcaption>
            {!missing ? (
                <img
                    src={src}
                    alt={caption}
                    className="max-h-72 w-full rounded-xl border border-slate-200 object-contain object-left shadow-sm"
                    onError={() => setMissing(true)}
                />
            ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-medium text-slate-700">Screenshot placeholder</p>
                    <p className="mt-2 text-xs text-slate-500">
                        Add your image at{' '}
                        <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[11px]">
                            public/images/user-guides/{path}
                        </code>
                    </p>
                </div>
            )}
        </figure>
    );
}
