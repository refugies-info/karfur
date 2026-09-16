import { useEffect, useRef, useState } from "react";
import SearchMenuItem from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { LocationPopoverBody } from "./LocationPopoverBody";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  departments: string[];
  cities: string[];
  onChange: (departments: string[], cities: string[]) => void;
}

export const LocationFilter = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selection = useLocationSelection(props.departments, props.cities, props.onChange);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <SearchMenuItem onFocus={() => setIsOpen(true)} onChange={selection.onSearchInputChange} />

      {isOpen && (
        <div className="border-default-grey absolute inset-x-0 top-full z-50 mt-1 divide-y divide-solid rounded-lg border bg-white shadow-[0_4px_12px_0_rgba(0,0,18,0.16)]">
          <LocationPopoverBody {...selection} />
        </div>
      )}
    </div>
  );
};
