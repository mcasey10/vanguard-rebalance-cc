"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Dashboard", href: "#" },
  { label: "Balances", href: "/portfolio/balances" },
  { label: "Holdings", href: "#" },
  { label: "Sell & Rebalance", href: "/portfolio/sell-rebalance" },
  { label: "Activity", href: "#" },
  { label: "Performance", href: "#" },
  { label: "Portfolio Watch", href: "#" },
];

export default function SectionNav() {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-[#e0e0e0] flex items-start pl-7 h-[41px]">
      {tabs.map((tab) => {
        const active =
          tab.href !== "#" &&
          (pathname === tab.href || (tab.href === "/portfolio/sell-rebalance" && pathname.startsWith("/portfolio/sell-rebalance")));
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex items-start h-[41px] px-3.5 py-3 text-[14px] border-b-2 whitespace-nowrap ${
              active
                ? "font-bold text-[#040505] border-[#c8102e]"
                : "font-normal text-[#040505] border-transparent"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
