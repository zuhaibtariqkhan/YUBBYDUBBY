"use client";

export default function Marquee() {
    const items = [
        "YUBBY DUBBY STUDIO",
        "PREMIUM STREETWEAR",
        "LIMITED EDITION DROPS",
        "WORLDWIDE SHIPPING",
        "REDEFINE YOUR STYLE",
    ];

    // Duplicate items for seamless infinite loop
    const repeated = [...items, ...items, ...items, ...items];

    return (
        <section className="relative bg-brand-green text-brand-black py-4 overflow-hidden select-none">
            <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
                {repeated.map((text, i) => (
                    <span key={i} className="flex items-center gap-8">
                        <span className="font-heading text-sm md:text-base font-black uppercase tracking-[0.3em]">
                            {text}
                        </span>
                        <span className="text-black/40 text-lg">✦</span>
                    </span>
                ))}
            </div>
        </section>
    );
}
