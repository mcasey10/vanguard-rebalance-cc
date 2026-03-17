import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import HeroBanner from "@/components/HeroBanner";
import SectionNav from "@/components/SectionNav";
import { accounts } from "@/lib/data";

const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function BalancesPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <GlobalNav />
      <HeroBanner />
      <SectionNav />

      {/* Actions bar */}
      <div className="bg-white border-b border-[#e0e0e0] flex items-center justify-end gap-5 h-9 pr-7">
        <button className="text-[13px] text-[#040505]">Print</button>
        <button className="text-[13px] text-[#040505]">Download center</button>
      </div>

      {/* Customized view notice */}
      <div className="bg-white border-b border-[#e0e0e0] px-7 py-3">
        <p className="text-[13px] text-[#040505]">
          Visit{" "}
          <a href="#" className="text-[#1255cc] underline font-bold">
            customized view
          </a>{" "}
          to personalize the accounts you&apos;d like to display or hide.
        </p>
      </div>

      {/* Account list */}
      <div className="bg-white">
        {/* Summary row */}
        <div className="flex items-center justify-between px-7 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#767676] text-[18px]">◉</span>
            <span className="font-black text-[16px] text-[#040505]">Self-managed accounts</span>
          </div>
          <span className="text-[16px] text-[#040505]">{fmt(totalBalance)}</span>
        </div>

        {accounts.map((account) => (
          <div
            key={account.id}
            className="border-t border-[#e0e0e0] flex items-center justify-between px-7 py-4"
          >
            <div>
              <a href="#" className="text-[#1255cc] underline text-[14px]">
                {account.name} — {account.number}
              </a>
            </div>
            <div className="flex items-center gap-4">
              {account.canSell && (
                <Link
                  href="/portfolio/sell-rebalance"
                  className="border border-[#1255cc] text-[#1255cc] text-[11px] font-bold rounded-full px-2 py-1.5 flex items-center gap-1.5 opacity-55 hover:opacity-100 transition-opacity"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#1255cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Sell from this account
                </Link>
              )}
              <span className="text-[14px] text-[#040505] w-28 text-right">{fmt(account.balance)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
