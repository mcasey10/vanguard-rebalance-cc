"use client";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import HeroBanner from "@/components/HeroBanner";
import SectionNav from "@/components/SectionNav";
import SellRebalanceSubNav from "@/components/SellRebalanceSubNav";
import { brokerageFunds, autoSummary } from "@/lib/data";

function fmt(n: number | null, prefix = "$") {
  if (n === null) return "—";
  const abs = Math.abs(n);
  const s = abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (n < 0) return `-${prefix}${s}`;
  if (n > 0) return `+${prefix}${s}`;
  return `${prefix}${s}`;
}

function fmtSimple(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

export default function FundListAutoPage() {
  const [amount, setAmount] = useState("$10,000");

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <GlobalNav />
      <HeroBanner />
      <SectionNav />
      <SellRebalanceSubNav />

      <div className="bg-white">
        {/* Fund List Header */}
        <div className="px-7 pt-5 pb-3 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#040505]">Fund List</h1>
            <p className="text-[#767676] text-[13px] mt-0.5 flex items-center gap-1.5">
              Brokerage Account &nbsp; 72981482*&nbsp;·&nbsp; Amounts automatically optimized to minimize taxes
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">A</span>
            </p>
          </div>
          <div className="flex items-center gap-5">
            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#767676] uppercase tracking-wide">Fund selection:</span>
              <div className="bg-[#f0f0f0] border border-[#e0e0e0] rounded-full flex items-center p-0.5 h-8">
                <div className="bg-[#1255cc] rounded-full flex items-center justify-center h-[26px] px-3 text-white text-[12px] font-semibold whitespace-nowrap">
                  ⚡ Automated
                </div>
                <Link
                  href="/portfolio/sell-rebalance/manual"
                  className="rounded-full flex items-center justify-center h-[25px] px-4 text-[#767676] text-[12px] font-semibold whitespace-nowrap"
                >
                  Manual
                </Link>
              </div>
            </div>
            {/* View toggle */}
            <div className="border border-[#040505] rounded-full flex overflow-hidden h-[30px]">
              <button className="bg-[#040505] text-white text-[12px] font-semibold px-4 whitespace-nowrap">⊞ Table</button>
              <button className="bg-white text-[#040505] text-[12px] font-semibold px-4 whitespace-nowrap">⊟ Cards</button>
            </div>
            <button className="border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-4 h-[29px] whitespace-nowrap">
              Save Scenario
            </button>
          </div>
        </div>

        {/* Total Amount to Sell bar */}
        <div className="bg-[#eef4ff] border-b border-[#c0d0e8] px-7 py-4 flex items-center gap-4">
          <span className="text-[13px] font-bold text-[#1a3a5c] whitespace-nowrap">Total Amount to Sell:</span>
          <div className="flex items-center gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-2 border-[#1255cc] rounded text-right text-[16px] font-bold text-[#040505] px-3 py-1.5 w-32 h-10 focus:outline-none"
            />
            <button className="border border-[#040505] rounded text-[12px] font-bold text-[#040505] px-4 h-[29px] whitespace-nowrap">
              Recalculate
            </button>
          </div>
          <p className="text-[11px] text-[#767676] flex-1">
            The optimization engine will allocate this amount across your funds to minimize taxes while improving your portfolio balance.
          </p>
        </div>

        {/* Stats dark bar */}
        <div className="bg-[#040505] grid grid-cols-4 gap-0 px-6 py-4 border-b border-white/10">
          {[
            { label: "Sale Amount", value: "$10,000", sub: "Requested by you", color: "text-white" },
            { label: "Estimated Tax", value: "$511", sub: "After loss harvesting", color: "text-[#fc4]" },
            { label: "Eff. Tax Rate", value: "5.11%", sub: "vs 13.1% without optimization", color: "text-[#fc4]" },
            { label: "Rebalancing Impact", value: "Improved ←", sub: "US equity drift: 4.9% → 3.2%", color: "text-[#8fa]" },
          ].map((stat, i) => (
            <div key={i} className={`${i > 0 ? "border-l border-white/10 pl-5" : ""}`}>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-[18px] font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/40">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Advisory notices */}
        <div className="flex flex-col gap-3.5 px-7 py-3">
          {/* Wait 45 days notice */}
          <div className="bg-[#fff8f0] border-l-[3px] border-[#e07000] border-t border-r border-b border-[#e07000]/30 rounded-r px-4 py-3 flex gap-2.5">
            <span className="text-[18px] mt-0.5 flex-shrink-0">⏱</span>
            <div className="flex-1">
              <p className="text-[12px] text-[#3a2000] leading-snug">
                <strong>Waiting 45 days could save an additional $218 in taxes.</strong>{" "}
                <span className="text-[#5a3000]">
                  Two lots in VFIAX convert from short-term to long-term on April 4 and May 1, 2026. This recommendation avoids those lots — but if you can delay this sale by 45 days, you&apos;d save $218 more.
                </span>
              </p>
              <div className="flex gap-2 mt-2">
                <button className="border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-4 h-[29px] whitespace-nowrap">
                  Remind me in 40 days
                </button>
                <button className="text-[12px] font-bold text-[#1255cc] underline px-4 h-[29px] whitespace-nowrap">
                  Proceed with today&apos;s recommendation
                </button>
              </div>
            </div>
          </div>
          {/* Why this allocation */}
          <div className="bg-[#f8f8f8] border-l-4 border-[#1255cc] border border-[#e0e0e0] px-3.5 py-3">
            <p className="text-[12px] text-[#555] leading-snug">
              <em>
                <strong>Why this allocation:</strong> We recommend selling $6,000 from VTSAX and $4,000 from VBTLX. VTSAX is currently over your 32% US equity target by 4.9%, so selling reduces drift. VBTLX has an unrealized long-term loss of $4,210 — harvesting $1,820 of this loss offsets gains from VTSAX, reducing your estimated tax from $1,307 to $511.{" "}
              </em>
              <span className="inline-flex bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 items-center justify-center align-middle">A</span>
            </p>
          </div>
        </div>

        {/* Fund table */}
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#f2f2f2] border-b border-[#e0e0e0]">
              <th className="text-left font-semibold text-[12px] text-[#040505] px-3 py-2.5">
                <span className="flex items-center gap-1.5">
                  Fund
                  <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
                </span>
              </th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">Method</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">Recommended Sell</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">ST Gain/Loss</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">LT Gain/Loss</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">Est. Tax</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">Rebalancing</th>
              <th className="text-right font-semibold text-[12px] text-[#040505] px-3 py-2.5">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {brokerageFunds.map((fund, idx) => {
              const isDeemphasized = fund.recommendedSell === 0;
              return (
                <tr
                  key={fund.id}
                  className={`border-b border-[#e0e0e0] ${isDeemphasized ? "bg-[#f8f8f8]" : "bg-white"}`}
                >
                  <td className="px-3 py-3.5">
                    {isDeemphasized ? (
                      <div>
                        <p className="text-[#767676] text-[12px]">{fund.name}</p>
                        <p className="text-[#767676] text-[10px] tracking-wide">{fund.ticker} — not recommended</p>
                      </div>
                    ) : (
                      <div>
                        <a href="#" className="text-[#1255cc] underline font-bold text-[14px]">{fund.name}</a>
                        <p className="text-[#767676] text-[10px] tracking-wide">{fund.ticker} · {fund.shareClass}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <button className={`border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-4 h-[30px] whitespace-nowrap ${isDeemphasized ? "opacity-40" : ""}`}>
                      {fund.method} ▾
                    </button>
                  </td>
                  <td className="px-3 py-5 text-right font-bold text-[#040505]">
                    {isDeemphasized ? <span className="text-[#767676]">$0</span> : fmtSimple(fund.recommendedSell)}
                  </td>
                  <td className={`px-3 py-5 text-right font-bold ${fund.stGainOnSell === null ? "text-[#767676]" : fund.stGainOnSell >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                    {fund.stGainOnSell === null ? "—" : fmt(fund.stGainOnSell)}
                  </td>
                  <td className={`px-3 py-5 text-right font-bold ${fund.ltGainOnSell === null ? "text-[#767676]" : fund.ltGainOnSell >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                    {fund.ltGainOnSell === null ? "—" : fmt(fund.ltGainOnSell)}
                  </td>
                  <td className={`px-3 py-5 text-right ${fund.estTax === null ? "text-[#767676]" : fund.estTax <= 0 ? "text-[#007a00] font-bold" : "text-[#040505]"}`}>
                    {fund.estTax === null ? "—" : fund.estTax <= 0 ? fmt(fund.estTax) : fmtSimple(fund.estTax)}
                  </td>
                  <td className="px-3 py-5 text-right text-[13px]">
                    {fund.rebalancing ? (
                      <span>
                        <span className="text-[#007a00]">←</span>
                        <span className="text-[#040505]"> {fund.rebalancing.before}%→{fund.rebalancing.after}%</span>
                      </span>
                    ) : (
                      <span className="text-[#767676]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-5 text-right text-[11px] text-[#767676]">
                    {fund.rationale || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer actions */}
        <div className="border-t border-[#e0e0e0] flex items-center justify-between px-5 py-4">
          <Link href="/portfolio/balances" className="text-[#1255cc] underline font-bold text-[13px]">
            ← Back to Balances
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/portfolio/sell-rebalance/scenarios"
              className="text-[#1255cc] underline font-bold text-[13px] px-6 py-2.5 rounded-full"
            >
              Analyze Scenarios
            </Link>
            <Link
              href="/portfolio/sell-rebalance/confirmation"
              className="bg-[#040505] text-white font-bold text-[13px] px-6 py-2.5 rounded-full whitespace-nowrap"
            >
              Execute This Recommendation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
