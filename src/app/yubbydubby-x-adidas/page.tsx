import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";

export default function AdidasCollabPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 mt-8">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-oswald uppercase font-black text-center tracking-tighter mb-4 text-brand-black dark:text-brand-white">
                        <span className="text-brand-green">YUBBY DUBBY</span> X ADIDAS
                    </h1>
                    <p className="text-center text-brand-darkGray max-w-2xl mx-auto text-sm md:text-base uppercase tracking-widest font-semibold">
                        Exclusive Collaboration Collection
                    </p>
                    <p className="text-center text-brand-darkGray/60 max-w-2xl mx-auto mt-2 text-xs">
                        (Products will be fetched dynamically here)
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Products Section Placeholder */}
                    <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center border border-brand-darkGray/20">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase text-center px-4">Collaboration Item<br />Placeholder</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
