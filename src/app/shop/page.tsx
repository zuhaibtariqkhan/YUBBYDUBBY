import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";

export default function ShopPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-oswald uppercase font-bold text-center tracking-wider mb-4">
                        Shop All
                    </h1>
                    <p className="text-center text-brand-darkGray max-w-2xl mx-auto">
                        Browse our complete collection. (Products will be fetched dynamically here)
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Men's Section Placeholder */}
                    <section>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-6 border-b border-brand-darkGray/20 pb-2">
                            Men&apos;s
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase">Product Placeholder</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Women's Section Placeholder */}
                    <section>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-6 border-b border-brand-darkGray/20 pb-2">
                            Women&apos;s
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase">Product Placeholder</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Kid's Section Placeholder */}
                    <section>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-6 border-b border-brand-darkGray/20 pb-2">
                            Kid&apos;s
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase">Product Placeholder</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Home & Living Section Placeholder */}
                    <section>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-6 border-b border-brand-darkGray/20 pb-2">
                            Home & Living
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase">Product Placeholder</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Accessories Section Placeholder */}
                    <section>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-6 border-b border-brand-darkGray/20 pb-2">
                            Accessories
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-brand-darkGray/10 animate-pulse rounded-md flex items-center justify-center">
                                    <span className="text-xs text-brand-darkGray/50 font-oswald tracking-widest uppercase">Product Placeholder</span>
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
