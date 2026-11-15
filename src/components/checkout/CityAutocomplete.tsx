"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Check, Plus } from "lucide-react";
import { searchCities, getCitiesForState } from "@/lib/india-locations";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
  error?: string;
  required?: boolean;
}

export default function CityAutocomplete({
  value,
  onChange,
  selectedState = "",
  onSelectState,
  error,
  required = true,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal input value when prop updates
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Compute suggestions:
  // If user typed something, search cities.
  // If user clicked input with empty text and a state is selected, show top cities in that state!
  const trimmedInput = inputValue.trim();
  const suggestions = trimmedInput.length > 0
    ? searchCities(trimmedInput, selectedState || undefined, 10)
    : selectedState
    ? getCitiesForState(selectedState).slice(0, 8).map((city) => ({ city, state: selectedState }))
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: string, stateName?: string) => {
    setInputValue(city);
    onChange(city);
    if (stateName && onSelectState && (!selectedState || selectedState !== stateName)) {
      onSelectState(stateName);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const item = suggestions[highlightedIndex];
        handleSelectCity(item.city, item.state);
      } else if (suggestions.length === 1) {
        handleSelectCity(suggestions[0].city, suggestions[0].state);
      } else if (trimmedInput.length >= 2) {
        // Accept user custom city if no suggestion highlighted
        handleSelectCity(trimmedInput, selectedState);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
        City / District {required && "*"}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const nextVal = e.target.value;
            setInputValue(nextVal);
            onChange(nextVal);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedState ? `CITIES IN ${selectedState.toUpperCase()}` : "TYPE YOUR CITY"}
          autoComplete="off"
          className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none transition-all ${
            error
              ? "border-red-500/50 text-red-300"
              : isOpen
              ? "border-brand-green bg-white/10 text-white"
              : value
              ? "border-white/10 text-white"
              : "border-white/10 text-gray-400"
          }`}
        />

        {value && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-green">
            <Check size={14} />
          </div>
        )}
      </div>

      {/* Autocomplete Suggestions Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0e0e0e] border border-white/15 rounded-[var(--radius-card)] shadow-[0_15px_35px_rgba(0,0,0,0.85)] p-2 space-y-1 backdrop-blur-xl max-h-72 overflow-y-auto custom-scrollbar">
          {suggestions.length > 0 ? (
            <>
              <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-500 border-b border-white/5">
                {selectedState ? `Recognized Cities in ${selectedState}` : "Suggested Cities"}
              </div>
              {suggestions.map((item, index) => {
                const isSelected = item.city.toLowerCase() === value.toLowerCase();
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={`${item.city}-${item.state}-${index}`}
                    type="button"
                    onClick={() => handleSelectCity(item.city, item.state)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider rounded-md text-left flex items-center justify-between transition-colors ${
                      isHighlighted || isSelected
                        ? "bg-brand-green/20 text-brand-green font-bold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={13} className="text-brand-green shrink-0" />
                      <span className="truncate">{item.city}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-sans tracking-normal ml-2 shrink-0">
                      {item.state}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="p-3 text-center space-y-2">
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                No matching city in {selectedState || "records"}
              </p>
              {trimmedInput.length >= 2 && (
                <button
                  type="button"
                  onClick={() => handleSelectCity(trimmedInput, selectedState)}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-brand-green/20 border border-white/10 hover:border-brand-green text-brand-green text-[10px] font-mono uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  Use &quot;{trimmedInput}&quot; as Delivery Town / Tehsil
                </button>
              )}
            </div>
          )}
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
