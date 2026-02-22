"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";

const fallbackPosts = [
    { id: 1, image: "/prod-hoodie.png", link: "https://instagram.com/yubby.dubby" },
    { id: 2, image: "/prod-cargo.png", link: "https://instagram.com/yubby.dubby" },
    { id: 3, image: "/prod-tee.png", link: "https://instagram.com/yubby.dubby" },
    { id: 4, image: "/prod-jacket.png", link: "https://instagram.com/yubby.dubby" },
    { id: 5, image: "/create-your-own.png", link: "https://instagram.com/yubby.dubby" },
    { id: 6, image: "/prod-hoodie.png", link: "https://instagram.com/yubby.dubby" },
    { id: 7, image: "/prod-cargo.png", link: "https://instagram.com/yubby.dubby" },
    { id: 8, image: "/prod-tee.png", link: "https://instagram.com/yubby.dubby" },
];

export default function SocialGrid() {
    const [posts, setPosts] = useState(fallbackPosts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInstagram() {
            try {
                const res = await fetch("/api/instagram");
                if (res.ok) {
                    const liveData = await res.json();
                    if (liveData && liveData.length > 0) {
                        setPosts(liveData.slice(0, 8)); // display up to 8 posts max
                    }
                }
            } catch (error) {
                console.error("Error fetching live Instagram grid:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInstagram();
    }, []);

    return (
        <section className="py-20 bg-brand-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div>
                    <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter text-brand-white">
                        Join The <span className="text-brand-green italic drop-shadow-[0_0_15px_rgba(177,243,16,0.5)]">Syndicate</span>
                    </h2>
                    <p className="text-gray-400 mt-4 max-w-md font-sans text-sm md:text-base">
                        Tag @yubby.dubby to be featured on our official grid.
                    </p>
                </div>
                <a
                    href="https://instagram.com/yubby.dubby"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-black bg-brand-green font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all duration-300 text-sm"
                >
                    <Instagram size={18} />
                    Follow Us
                </a>
            </div>

            {/* Responsive Grid: 2 cols on mobile, 4 on tablet/desktop */}
            <div className={`w-full grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 transition-opacity duration-1000 ${loading ? "opacity-50" : "opacity-100"}`}>
                {posts.map((post, index) => (
                    <motion.a
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="relative aspect-square group overflow-hidden bg-white/5 cursor-pointer block"
                    >
                        {/* Image */}
                        <Image
                            src={post.image}
                            alt={`Instagram post ${post.id}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-all duration-700 md:grayscale group-hover:grayscale-0 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileHover={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="text-white flex flex-col items-center"
                            >
                                <Instagram size={32} className="text-brand-white mb-2" />
                            </motion.div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
