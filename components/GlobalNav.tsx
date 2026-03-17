"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalNav() {
  const pathname = usePathname();
  const isPortfolio = pathname.startsWith("/portfolio");

  return (
    <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="border-b border-[#e0e0e0] flex items-center justify-end px-2.5 h-[52px]">
        <button className="flex flex-col items-center gap-1 justify-center w-14 h-[52px] text-xs text-[#040505]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="9" r="6" stroke="#040505" strokeWidth="1.5"/><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="#040505" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Search
        </button>
        <button className="flex flex-col items-center gap-1 justify-center w-14 h-[52px] text-xs text-[#040505]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#040505" strokeWidth="1.5"/><line x1="11" y1="7" x2="11" y2="12" stroke="#040505" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11" cy="15" r="1" fill="#040505"/></svg>
          Support
        </button>
        <div className="relative flex flex-col items-center gap-1 justify-center w-14 h-[52px]">
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="13" rx="2" stroke="#040505" strokeWidth="1.5"/><path d="M3 9l8 5 8-5" stroke="#040505" strokeWidth="1.5"/></svg>
            <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">3</span>
          </div>
          <span className="text-[10px] text-[#040505]">Messages</span>
        </div>
        <button className="flex flex-col items-center gap-1 justify-center w-[62px] h-[52px] text-xs text-[#040505]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="3" width="14" height="17" rx="1.5" stroke="#040505" strokeWidth="1.5"/><line x1="7" y1="8" x2="15" y2="8" stroke="#040505" strokeWidth="1.2"/><line x1="7" y1="11" x2="15" y2="11" stroke="#040505" strokeWidth="1.2"/><line x1="7" y1="14" x2="12" y2="14" stroke="#040505" strokeWidth="1.2"/></svg>
          Documents
        </button>
        <button className="flex flex-col items-center gap-1 justify-center w-14 h-[52px] text-xs text-[#040505]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="4" stroke="#040505" strokeWidth="1.5"/><path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke="#040505" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Profile
        </button>
        <button className="flex flex-col items-center gap-1 justify-center w-14 h-[52px] text-xs text-[#040505]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4" stroke="#040505" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 15l4-4-4-4M19 11H9" stroke="#040505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Log off
        </button>
      </div>
      {/* Main nav bar */}
      <div className="flex items-start h-[52px]">
        <div className="border-r border-[#e0e0e0] flex items-center justify-center w-[69px] h-[52px] px-4">
          <div className="bg-[#c8102e] rounded-full w-9 h-9 flex items-center justify-center">
            <span className="text-white font-black italic text-lg leading-none">V</span>
          </div>
        </div>
        <div className="border-r border-[#e0e0e0] h-[52px] flex items-center px-3.5">
          <span className="text-[#767676] text-[13px] whitespace-nowrap">Personal investors</span>
        </div>
        <div className="flex items-start h-[52px]">
          {[
            { label: "Advice services", href: "#" },
            { label: "Dashboard", href: "#" },
            { label: "Portfolio ∨", href: "/portfolio/balances", match: "/portfolio" },
            { label: "Transact ∨", href: "#" },
            { label: "Products & services ∨", href: "#" },
            { label: "Resources & education ∨", href: "#" },
          ].map((item) => {
            const active = item.match ? pathname.startsWith(item.match) : false;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center h-[52px] px-3.5 pb-0.5 text-[13px] border-b-[3px] whitespace-nowrap ${
                  active
                    ? "font-bold text-[#040505] border-[#c8102e]"
                    : "font-normal text-[#040505] border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
