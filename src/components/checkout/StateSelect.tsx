"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { getIndianStates } from "@/lib/india-locations";

interface StateSelectProps {
  value: string;
  onChange: (state: string) => void;
  error?: string;
  required?: boolean;
}

export default function StateSelect({
  value,
  onChange,
  error,
  required = true,
}: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const states = getIndianStates();

  // Filter states based on search query
  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (state: string) => {
    onChange(state);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
        State / Union Territory {required && "*"}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider flex items-center justify-between text-left transition-all ${
          error
            ? "border-red-500/50 text-red-300"
            : isOpen
            ? "border-brand-green bg-white/10 text-white"
            : value
            ? "border-white/10 text-white"
            : "border-white/10 text-gray-500"
        }`}
      >
        <span className="truncate">{value || "SELECT STATE / UT"}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-brand-green" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0e0e0e] border border-white/15 rounded-[var(--radius-card)] shadow-[0_15px_35px_rgba(0,0,0,0.85)] p-2 space-y-2 backdrop-blur-xl max-h-72 flex flex-col">
          {/* Search Input */}
          <div className="relative shrink-0 px-1 pt-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH STATE..."
              className="w-full h-9 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-xs uppercase font-mono tracking-wider text-white placeholder-gray-500 focus:outline-none focus:border-brand-green"
            />
          </div>

          {/* State List */}
          <div className="overflow-y-auto space-y-1 max-h-52 pr-1 custom-scrollbar">
            {filteredStates.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-gray-500 uppercase tracking-wider">
                No matching state found
              </div>
            ) : (
              filteredStates.map((state) => {
                const isSelected = value.toLowerCase() === state.toLowerCase();
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() => handleSelect(state)}
                    className={`w-full px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-md text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-brand-green/20 text-brand-green font-bold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{state}</span>
                    {isSelected && <Check size={14} className="text-brand-green shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
