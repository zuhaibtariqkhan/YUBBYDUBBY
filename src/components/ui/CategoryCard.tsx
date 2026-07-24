"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  description?: string;
  countText?: string;
  onClick?: () => void;
}

export default function CategoryCard({
  name,
  image,
  href,
  description,
  countText,
  onClick
}: CategoryCardProps) {
  const CardContent = (
    <div className="group flex flex-col w-full bg-transparent border-0 p-0 text-current transition-all duration-300">
      {/* Category Image Container */}
      <div className="relative aspect-[4/5] w-full bg-neutral-900 rounded-[var(--radius-img)] overflow-hidden flex items-center justify-center">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={false}
        />
        
        {/* Very subtle border glow highlight on hover */}
        <div className="absolute inset-0 border border-white/5 rounded-[var(--radius-img)] z-10 pointer-events-none group-hover:border-brand-green/20 transition-colors duration-300" />
      </div>

      {/* Details below image */}
      <div className="flex flex-col mt-4 space-y-1 text-center">
        {/* Name */}
        <h3 className="font-heading font-bold text-sm md:text-base uppercase tracking-widest group-hover:text-brand-green transition-colors leading-tight">
          {name}
        </h3>

        {/* Description (subtle, if provided) */}
        {description && (
          <p className="text-[10px] text-gray-500 font-sans tracking-wide uppercase line-clamp-1">
            {description}
          </p>
        )}

        {/* Count/CTA indicator */}
        <span className="text-[9px] font-mono text-brand-green font-bold block pt-0.5 uppercase tracking-widest">
          {countText || "Explore →"}
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left cursor-pointer">
        {CardContent}
      </button>
    );
  }

  return (
    <Link href={href} className="w-full block">
      {CardContent}
    </Link>
  );
}
