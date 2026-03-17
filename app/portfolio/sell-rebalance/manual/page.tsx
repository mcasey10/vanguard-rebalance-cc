"use client";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import HeroBanner from "@/components/HeroBanner";
import SectionNav from "@/components/SectionNav";
import SellRebalanceSubNav from "@/components/SellRebalanceSubNav";

type Fund = {
  id: string;
  name: string;
  ticker: string;
  shareClass: string;
  method: string;
  totalValue: number;
  stGL: number | null;
  ltGL: number | null;
  totalGL: number | null;
  sell: number;
  shares?: number | null;
  waitSave?: number | null;
  waitDays?: number | null;
  account?: string;
};

const taxableFunds: Fund[] = [
  {
    id: "vtsax",
    name: "Total Stock Mkt Index",
    ticker: "VTSAX",
    shareClass: "Admiral",
    method: "MinTax",
    totalValue: 312400,
    stGL: 35.30,
    ltGL: 68210,
    totalGL: 68245,
    sell: 9000,
    shares: 12.74,
  },
  {
    id: "vfiax",
    name: "500 Index Fund",
    ticker: "VFIAX",
    shareClass: "Admiral",
    method: "MinTax",
    totalValue: 218600,
    stGL: 38.46,
    ltGL: 26107,
    totalGL: 26146,
    sell: 0,
    shares: null,
    waitSave: 216,
    waitDays: 45,
  },
  {
    id: "vbtlx",
    name: "Total Bond Market",
    ticker: "VBTLX",
    shareClass: "Admiral",
    method: "FIFO",
    totalValue: 92893,
    stGL: null,
    ltGL: -4210,
    totalGL: -4210,
    sell: 1000,
    shares: 10.76,
  },
];

const iraFunds: Fund[] = [
  {
    id: "vtiax",
    name: "Total Intl Stock Index",
    ticker: "VTIAX",
    shareClass: "Admiral",
    method: "N/A",
    totalValue: 142800,
    stGL: null,
    ltGL: null,
    totalGL: null,
    sell: 0,
    account: "ira",
  },
  {
    id: "vbtlx-ira",
    name: "Total Bond Market",
    ticker: "VBTLX",
    shareClass: "Admiral",
    method: "N/A",
    totalValue: 80600,
    stGL: null,
    ltGL: null,
    totalGL: null,
    sell: 0,
    account: "ira",
  },
];

function fmtGL(n: number | null) {
  if (n === null) return "—";
  const s = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  if (n < 0) return `-$${s}`;
  if (n > 0) return `+$${s}`;
  return `$${s}`;
}

export default function FundListManualPage() {
  const [taxSells, setTaxSells] = useState<Record<string, string>>({
    vtsax: "$9,000",
    vfiax: "$0",
    vbtlx: "$1,000",
  });
  const [iraSells, setIraSells] = useState<Record<string, string>>({
    vtiax: "$0",
    "vbtlx-ira": "$0",
  });
  const [expandedLots, setExpandedLots] = useState<Record<string, boolean>>({});

  const toggleLots = (id: string) => setExpandedLots((p) => ({ ...p, [id]: !p[id] }));

  const taxTotal = 623893;

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <GlobalNav />
      <HeroBanner />
      <SectionNav />
      <SellRebalanceSubNav />

      <div className="bg-white pb-20">
        {/* Header */}
        <div className="px-7 pt-5 pb-3 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#040505]">Fund List</h1>
            <p className="text-[#767676] text-[13px] mt-0.5 flex items-center gap-1.5">
              Select amounts to sell from each fund · Tax impact updates in real time
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">A</span>
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#767676] uppercase tracking-wide">Fund selection:</span>
              <div className="bg-[#f0f0f0] border border-[#e0e0e0] rounded-full flex items-center p-0.5 h-8">
                <Link
                  href="/portfolio/sell-rebalance"
                  className="rounded-full flex items-center justify-center h-[25px] px-3 text-[#767676] text-[12px] font-semibold whitespace-nowrap"
                >
                  ⚡ Automated
                </Link>
                <div className="bg-[#1255cc] rounded-full flex items-center justify-center h-[26px] px-4 text-white text-[12px] font-semibold whitespace-nowrap">
                  Manual
                </div>
              </div>
            </div>
            <div className="border border-[#040505] rounded-full flex overflow-hidden h-[30px]">
              <button className="bg-[#040505] text-white text-[12px] font-semibold px-4 whitespace-nowrap">⊞ Table</button>
              <button className="bg-white text-[#040505] text-[12px] font-semibold px-4 whitespace-nowrap">⊟ Cards</button>
            </div>
            <button className="border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-4 h-[29px] whitespace-nowrap">
              Save Scenario
            </button>
          </div>
        </div>

        {/* Taxable account */}
        <div className="border-t border-[#e0e0e0]">
          <div className="bg-[#f2f2f2] flex items-center justify-between px-7 py-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#040505] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">TAXABLE</span>
              <span className="font-bold text-[13px] text-[#040505]">Joint Brokerage Account</span>
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
            </div>
            <span className="text-[12px] text-[#767676]">
              Total value: ${taxTotal.toLocaleString()} · 3 funds
            </span>
          </div>

          {/* Table headers */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-7 py-2 text-[12px] font-semibold text-[#040505] border-b border-[#e0e0e0]">
            <div className="flex items-center gap-1.5">
              Fund
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
            </div>
            <div className="text-center">Method</div>
            <div className="text-right">Total Value</div>
            <div className="text-right">ST Gain/Loss</div>
            <div className="text-right">LT Gain/Loss</div>
            <div className="text-right">Sell ($)
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center ml-1">A</span>
            </div>
            <div className="text-right">≈ Shares</div>
          </div>

          {taxableFunds.map((fund) => (
            <div key={fund.id}>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-7 py-3 border-b border-[#e0e0e0] items-center">
                <div>
                  <a href="#" className="text-[#1255cc] underline font-bold text-[14px]">{fund.name}</a>
                  <p className="text-[#767676] text-[11px]">{fund.ticker} · {fund.shareClass}</p>
                  {fund.method !== "N/A" && (
                    <p className="text-[#767676] text-[11px]">Method: {fund.method} {fund.waitSave && (
                      <span className="ml-2 bg-[#fff3cd] text-[#856404] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#ffc107]">⏱ WAIT & SAVE</span>
                    )}</p>
                  )}
                  {fund.waitSave && (
                    <p className="text-[11px] text-[#767676] mt-0.5 flex items-center gap-1">
                      2 ST lots convert to LT in 45–92 days · estimated savings: ${fund.waitSave}
                      <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
                    </p>
                  )}
                  <button
                    className="text-[11px] text-[#1255cc] underline mt-0.5"
                    onClick={() => toggleLots(fund.id)}
                  >
                    {expandedLots[fund.id] ? "▾ Hide lot details" : "▸ Show lot details"}
                  </button>
                </div>
                <div className="text-center">
                  <button className="border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-3 h-8 whitespace-nowrap">
                    {fund.method} ▾
                  </button>
                </div>
                <div className="text-right text-[13px] font-bold text-[#040505]">
                  ${fund.totalValue.toLocaleString()}
                </div>
                <div className={`text-right text-[13px] font-bold ${fund.stGL === null ? "text-[#767676]" : fund.stGL >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                  {fmtGL(fund.stGL)}
                </div>
                <div className={`text-right text-[13px] font-bold ${fund.ltGL === null ? "text-[#767676]" : fund.ltGL >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                  {fmtGL(fund.ltGL)}
                </div>
                <div className="flex justify-end">
                  <input
                    value={taxSells[fund.id] ?? "$0"}
                    onChange={(e) => setTaxSells((p) => ({ ...p, [fund.id]: e.target.value }))}
                    className="border border-[#e0e0e0] rounded text-right text-[13px] font-bold text-[#040505] px-2 py-1 w-24 focus:border-[#1255cc] focus:outline-none focus:border-2"
                  />
                </div>
                <div className="text-right text-[13px] text-[#040505]">
                  {fund.shares != null ? fund.shares.toFixed(2) : "—"}
                </div>
              </div>

              {/* Expanded lot details */}
              {expandedLots[fund.id] && (
                <div className="bg-[#f8f8f8] px-7 py-3 border-b border-[#e0e0e0]">
                  <div className="text-[11px]">
                    <div className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] font-bold text-[#040505] py-1.5 border-b border-[#e0e0e0]">
                      <div>Date Acquired</div>
                      <div className="text-right">Qty</div>
                      <div className="text-right">Cost/Share</div>
                      <div className="text-right">Total Cost</div>
                      <div className="text-right">Mkt Value</div>
                      <div className="text-right">ST Gain/Loss</div>
                      <div className="text-right">LT Gain/Loss</div>
                      <div className="text-right">% Gain</div>
                    </div>
                    {[
                      { date: "12/22/2025", term: "ST 307d", qty: 0.164, cost: 633.96, totalCost: 103.97, mktVal: 103.73, stGL: -0.24, ltGL: null, pct: -0.23 },
                      { date: "09/29/2025", term: "ST 223d", qty: 0.166, cost: 613.49, totalCost: 101.84, mktVal: 105.00, stGL: 3.16, ltGL: null, pct: 3.10 },
                      { date: "06/28/2024", term: "LT", qty: 0.261, cost: 504.44, totalCost: 131.66, mktVal: 165.09, stGL: null, ltGL: 33.43, pct: 25.39 },
                    ].map((lot, i) => (
                      <div key={i} className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] py-1.5 border-b border-[#e0e0e0]/50 text-[#040505]">
                        <div className="flex items-center gap-1.5">
                          {lot.date}
                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${lot.term.startsWith("LT") ? "bg-[#e8f5e9] text-[#007a00]" : "bg-[#fff3e0] text-[#b05000]"}`}>
                            {lot.term}
                          </span>
                        </div>
                        <div className="text-right">{lot.qty}</div>
                        <div className="text-right">${lot.cost.toFixed(2)}</div>
                        <div className="text-right">${lot.totalCost.toFixed(2)}</div>
                        <div className="text-right">${lot.mktVal.toFixed(2)}</div>
                        <div className={`text-right ${lot.stGL === null ? "text-[#767676]" : lot.stGL >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                          {lot.stGL === null ? "—" : fmtGL(lot.stGL)}
                        </div>
                        <div className={`text-right ${lot.ltGL === null ? "text-[#767676]" : lot.ltGL >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                          {lot.ltGL === null ? "—" : fmtGL(lot.ltGL)}
                        </div>
                        <div className={`text-right ${lot.pct >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                          {lot.pct >= 0 ? "+" : ""}{lot.pct.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                    <p className="text-[#767676] mt-1.5">... 48 more lots (dating to 2008) · <a href="#" className="text-[#1255cc] underline">Show all</a></p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* IRA account */}
        <div className="border-t border-[#e0e0e0] mt-2">
          <div className="bg-[#f2f2f2] flex items-center justify-between px-7 py-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#040505] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">TRAD IRA</span>
              <span className="font-bold text-[13px] text-[#040505]">Rollover IRA</span>
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
            </div>
            <span className="text-[12px] text-[#767676]">
              Total value: $223,400 · 2 funds · Withdrawals taxed as ordinary income
            </span>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] px-7 py-2 text-[12px] font-semibold text-[#040505] border-b border-[#e0e0e0]">
            <div>Fund</div>
            <div className="text-center">Method</div>
            <div className="text-right">Total Value</div>
            <div className="text-center italic text-[#767676]">Capital gains N/A — IRA withdrawals taxed as ordinary income</div>
            <div className="text-right">Sell ($)</div>
            <div className="text-right">≈ Shares</div>
          </div>

          {iraFunds.map((fund) => (
            <div key={fund.id} className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] px-7 py-3 border-b border-[#e0e0e0] items-center">
              <div>
                <a href="#" className="text-[#1255cc] underline font-bold text-[14px]">{fund.name}</a>
                <p className="text-[#767676] text-[11px]">{fund.ticker} · {fund.shareClass}</p>
              </div>
              <div className="text-center">
                <span className="text-[13px] text-[#767676]">N/A</span>
              </div>
              <div className="text-right text-[13px] font-bold text-[#040505]">
                ${fund.totalValue.toLocaleString()}
              </div>
              <div className="text-center text-[11px] text-[#767676] italic">
                Capital gains tracking not applicable in tax-advantaged accounts
              </div>
              <div className="flex justify-end">
                <input
                  value={iraSells[fund.id] ?? "$0"}
                  onChange={(e) => setIraSells((p) => ({ ...p, [fund.id]: e.target.value }))}
                  className="border border-[#e0e0e0] rounded text-right text-[13px] font-bold text-[#040505] px-2 py-1 w-24 focus:border-[#1255cc] focus:outline-none focus:border-2"
                />
              </div>
              <div className="text-right text-[13px] text-[#767676]">—</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom stats bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#040505] grid grid-cols-6 items-center h-14 px-7 z-40">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest">Total Sale</p>
          <p className="text-[16px] font-bold text-white">$10,000</p>
        </div>
        <div className="border-l border-white/10 pl-4">
          <p className="text-[9px] text-white/40 uppercase tracking-widest">ST Capital Gains</p>
          <p className="text-[16px] font-bold text-[#007a00]">$31</p>
        </div>
        <div className="border-l border-white/10 pl-4">
          <p className="text-[9px] text-white/40 uppercase tracking-widest">LT Capital Gains</p>
          <p className="text-[16px] font-bold text-[#007a00]">$7,839</p>
        </div>
        <div className="border-l border-white/10 pl-4">
          <p className="text-[9px] text-white/40 uppercase tracking-widest">Losses Harvested</p>
          <p className="text-[16px] font-bold text-[#c8102e]">−$421</p>
        </div>
        <div className="border-l border-white/10 pl-4">
          <p className="text-[9px] text-white/40 uppercase tracking-widest">Est. Total Tax</p>
          <p className="text-[16px] font-bold text-[#fc4]">$1,114</p>
        </div>
        <div className="border-l border-white/10 pl-4">
          <p className="text-[9px] text-white/40 uppercase tracking-widest">Eff. Tax Rate</p>
          <p className="text-[16px] font-bold text-[#fc4]">11.14%</p>
        </div>
        <div className="fixed bottom-0 right-0 flex items-center h-14 pr-5 gap-3">
          <Link
            href="/portfolio/sell-rebalance/scenarios"
            className="bg-white text-[#040505] font-bold text-[13px] px-5 py-2 rounded-full whitespace-nowrap"
          >
            Analyze Scenario →
          </Link>
        </div>
      </div>
    </div>
  );
}
