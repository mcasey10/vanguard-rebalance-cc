"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellRebalanceSubNav() {
  const pathname = usePathname();
  const isFundList = pathname === "/portfolio/sell-rebalance" || pathname.startsWith("/portfolio/sell-rebalance/manual");
  const isScenario = pathname.startsWith("/portfolio/sell-rebalance/scenarios");

  return (
    <div className="bg-white border-b border-[#e0e0e0] flex items-end justify-between pr-7 h-[39px]">
      <div className="flex items-start gap-1 pl-7">
        <Link
          href="/portfolio/sell-rebalance"
          className={`flex items-start h-[39px] px-0 pr-4 pt-2.5 pb-3 text-[14px] border-b-2 whitespace-nowrap ${
            isFundList ? "font-bold border-[#c8102e]" : "font-normal border-transparent"
          }`}
        >
          Fund List
        </Link>
        <Link
          href="/portfolio/sell-rebalance/scenarios"
          className={`flex items-start h-[39px] px-0 pr-4 pt-2.5 pb-3 text-[14px] border-b-2 whitespace-nowrap ${
            isScenario ? "font-bold border-[#c8102e]" : "font-normal border-transparent"
          }`}
        >
          Scenario Analysis
        </Link>
      </div>
      <div className="flex items-center gap-4 pb-1.5">
        <button className="text-[13px] text-[#040505]">Print</button>
        <button className="text-[13px] text-[#040505]">Page help ?</button>
      </div>
    </div>
  );
}
