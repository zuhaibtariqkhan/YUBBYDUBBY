import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";

export default function CreateYourOwnPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 mt-8">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-oswald uppercase font-black text-center tracking-tighter mb-4 text-brand-black dark:text-brand-white">
                        Create Your Own
                    </h1>
                    <p className="text-center text-brand-darkGray max-w-2xl mx-auto text-sm md:text-base uppercase tracking-widest font-semibold">
                        Custom Design Platform
                    </p>
                    <p className="text-center text-brand-darkGray/60 max-w-2xl mx-auto mt-2 text-xs">
                        (Upload functionality and customizable products will be integration here)
                    </p>
                </header>

                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Upload/Design Section Placeholder */}
                    <section className="bg-brand-darkGray/5 rounded-xl border-2 border-dashed border-brand-darkGray/20 p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-full bg-brand-darkGray/10 animate-pulse flex items-center justify-center">
                            <span className="text-brand-darkGray/50 font-oswald text-xs uppercase tracking-widest">Icon</span>
                        </div>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest mb-4">
                            Upload Your Design
                        </h2>
                        <p className="text-brand-darkGray max-w-md mx-auto mb-8">
                            This area will contain the interface for users to upload their graphics, select product types, and place their designs.
                        </p>
                        <button className="px-8 py-4 bg-brand-darkGray/20 text-brand-darkGray/50 font-oswald uppercase tracking-widest text-sm cursor-not-allowed">
                            Upload Placeholder
                        </button>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
