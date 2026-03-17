"use client";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import HeroBanner from "@/components/HeroBanner";
import SectionNav from "@/components/SectionNav";
import SellRebalanceSubNav from "@/components/SellRebalanceSubNav";

type ScenarioFund = {
  id: string;
  name: string;
  sell: number;
  glNet: number | null;
  estTax: number | null;
  isIra?: boolean;
};

type Scenario = {
  id: string;
  name: string;
  tag: string;
  funds: ScenarioFund[];
  stGains: number;
  ltGains: number;
  lossesHarvested: number;
  netTaxableGain: number;
  fedTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  note: string;
  noteColor: string;
  assetMix: {
    usEquity: { before: number; after: number; target: number };
    intlEquity: { before: number; after: number; target: number };
    fixedIncome: { before: number; after: number; target: number };
  };
  driftNote: string;
  driftOk: boolean;
};

const scenarios: Scenario[] = [
  {
    id: "a",
    name: "Scenario A - Minimize Tax",
    tag: "A",
    funds: [
      { id: "vtsax", name: "VTSAX", sell: 6000, glNet: 5247, estTax: 784 },
      { id: "vbtlx", name: "VBTLX", sell: 4000, glNet: -1684, estTax: -252 },
      { id: "vfiax", name: "VFIAX", sell: 0, glNet: null, estTax: null },
      { id: "vtiax", name: "VTIAX (IRA)", sell: 0, glNet: null, estTax: null, isIra: true },
    ],
    stGains: 21,
    ltGains: 5226,
    lossesHarvested: -1684,
    netTaxableGain: 3563,
    fedTax: 448,
    stateTax: 84,
    totalTax: 532,
    effectiveRate: 5.32,
    note: "↓ lowest achievable",
    noteColor: "text-[#007a00]",
    assetMix: {
      usEquity: { before: 62.6, after: 62.6, target: 65.0 },
      intlEquity: { before: 16.9, after: 17.1, target: 15.0 },
      fixedIncome: { before: 20.5, after: 20.3, target: 20.0 },
    },
    driftNote: "Minor drift improvement · US Equity remains 2.4% below target",
    driftOk: true,
  },
  {
    id: "b",
    name: "Scenario B - Rebalance priority",
    tag: "B",
    funds: [
      { id: "vtsax", name: "VTSAX", sell: 9000, glNet: 7870, estTax: 1177 },
      { id: "vbtlx", name: "VBTLX", sell: 1000, glNet: -421, estTax: -63 },
      { id: "vfiax", name: "VFIAX", sell: 0, glNet: null, estTax: null },
      { id: "vtiax", name: "VTIAX (IRA)", sell: 0, glNet: null, estTax: null, isIra: true },
    ],
    stGains: 31,
    ltGains: 7839,
    lossesHarvested: -421,
    netTaxableGain: 7449,
    fedTax: 936,
    stateTax: 178,
    totalTax: 1114,
    effectiveRate: 11.14,
    note: "costs $582 more than Scenario A",
    noteColor: "text-[#767676]",
    assetMix: {
      usEquity: { before: 62.6, after: 62.3, target: 65.0 },
      intlEquity: { before: 16.9, after: 17.1, target: 15.0 },
      fixedIncome: { before: 20.5, after: 20.6, target: 20.0 },
    },
    driftNote: "US Equity moves further from target · consider selling bonds instead",
    driftOk: false,
  },
];

function fmtGL(n: number | null) {
  if (n === null) return "—";
  const s = Math.abs(n).toLocaleString("en-US");
  if (n < 0) return `-$${s}`;
  if (n > 0) return `+$${s}`;
  return `$${s}`;
}

function fmtCurrency(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

type FundSellInputProps = {
  value: number;
  onChange: (v: number) => void;
};
function FundSellInput({ value, onChange }: FundSellInputProps) {
  const [val, setVal] = useState(`$${value.toLocaleString()}`);
  return (
    <input
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
        if (!isNaN(num)) onChange(num);
      }}
      className="border border-[#e0e0e0] rounded text-right text-[13px] font-bold text-[#040505] px-2 py-1 w-20 focus:border-[#1255cc] focus:outline-none focus:border-2"
    />
  );
}

type AssetBarProps = {
  usEquity: number;
  intlEquity: number;
  fixedIncome: number;
};
function AssetBar({ usEquity, intlEquity, fixedIncome }: AssetBarProps) {
  return (
    <div className="flex h-3 rounded overflow-hidden w-full">
      <div className="bg-[#1255cc]" style={{ width: `${usEquity}%` }} />
      <div className="bg-[#00a0a0]" style={{ width: `${intlEquity}%` }} />
      <div className="bg-[#b05000]" style={{ width: `${fixedIncome}%` }} />
      <div className="bg-[#e0e0e0] flex-1" />
    </div>
  );
}

export default function ScenarioAnalysisPage() {
  const [scenarioSells, setScenarioSells] = useState<Record<string, Record<string, number>>>({
    a: { vtsax: 6000, vbtlx: 4000, vfiax: 0, vtiax: 0 },
    b: { vtsax: 9000, vbtlx: 1000, vfiax: 0, vtiax: 0 },
  });

  const updateSell = (scenarioId: string, fundId: string, value: number) => {
    setScenarioSells((prev) => ({
      ...prev,
      [scenarioId]: { ...prev[scenarioId], [fundId]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <GlobalNav />
      <HeroBanner />
      <SectionNav />
      <SellRebalanceSubNav />

      <div className="bg-white pb-20">
        {/* Page header */}
        <div className="px-7 pt-5 pb-4 flex items-start justify-between border-b border-[#e0e0e0]">
          <div>
            <h1 className="text-[28px] font-bold text-[#040505]">Scenario Analysis</h1>
            <p className="text-[13px] text-[#767676] mt-0.5 flex items-center gap-2">
              Pre-filled from Recommendation · Edit any amount to recalculate
              <button className="text-[#1255cc] underline flex items-center gap-1">
                ↺ Reset to Recommendation
                <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
              </button>
            </p>
          </div>
          <div className="flex gap-2.5">
            <button className="border border-[#040505] rounded-full text-[12px] font-bold text-[#040505] px-5 h-9 whitespace-nowrap">
              Save All Scenarios
            </button>
            <Link
              href="/portfolio/sell-rebalance/confirmation"
              className="bg-[#040505] text-white font-bold text-[12px] px-5 h-9 rounded-full flex items-center whitespace-nowrap gap-1.5"
            >
              Execute Best Scenario
              <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">A</span>
            </Link>
          </div>
        </div>

        {/* Two-column scenarios */}
        <div className="grid grid-cols-2 divide-x divide-[#e0e0e0]">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="px-7 py-5">
              {/* Scenario header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-[#040505]">{scenario.name}</h2>
                <button className="text-[#767676]">⋮</button>
              </div>

              {/* Fund table */}
              <table className="w-full text-[13px] mb-4">
                <thead>
                  <tr className="border-b border-[#e0e0e0] text-[12px] font-semibold text-[#767676]">
                    <th className="text-left pb-2">Fund</th>
                    <th className="text-right pb-2">Sell</th>
                    <th className="text-right pb-2">
                      G/L
                      <span className="bg-[#b05000] text-white text-[9px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center ml-1">A</span>
                    </th>
                    <th className="text-right pb-2">Est. Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {scenario.funds.map((fund) => (
                    <tr key={fund.id} className="border-b border-[#e0e0e0]">
                      <td className="py-2.5 font-bold text-[#040505] text-[13px]">{fund.name}</td>
                      <td className="py-2.5 text-right">
                        <FundSellInput
                          value={scenarioSells[scenario.id][fund.id] ?? fund.sell}
                          onChange={(v) => updateSell(scenario.id, fund.id, v)}
                        />
                      </td>
                      <td className={`py-2.5 text-right font-bold text-[13px] ${fund.glNet === null ? "text-[#767676]" : fund.isIra ? "text-[#767676]" : fund.glNet >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                        {fund.isIra ? "N/A — IRA" : fmtGL(fund.glNet)}
                      </td>
                      <td className={`py-2.5 text-right font-bold text-[13px] ${fund.estTax === null ? "text-[#767676]" : fund.estTax <= 0 ? "text-[#007a00]" : "text-[#040505]"}`}>
                        {fund.estTax === null ? "—" : fund.estTax <= 0 ? fmtGL(fund.estTax) : fmtCurrency(fund.estTax)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="border-t-2 border-[#040505]">
                    <td className="py-2.5 font-bold text-[#040505]">Total</td>
                    <td className="py-2.5 text-right font-bold text-[#040505]">$10,000</td>
                    <td className={`py-2.5 text-right font-bold ${scenario.netTaxableGain >= 0 ? "text-[#007a00]" : "text-[#c8102e]"}`}>
                      +${scenario.netTaxableGain.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#040505]">${scenario.totalTax.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Tax breakdown */}
              <div className="border border-[#e0e0e0] rounded p-3 mb-4 text-[12px]">
                {[
                  { label: "ST Capital Gains", value: fmtGL(scenario.stGains), color: "text-[#007a00]" },
                  { label: "LT Capital Gains", value: fmtGL(scenario.ltGains), color: "text-[#007a00]" },
                  { label: "Losses Harvested", value: fmtGL(scenario.lossesHarvested), color: "text-[#007a00]" },
                  { label: "Net Taxable Gain", value: fmtCurrency(scenario.netTaxableGain), color: "text-[#040505]" },
                  { label: "Est. Federal Tax", value: fmtCurrency(scenario.fedTax), color: "text-[#040505]" },
                  { label: "Est. State Tax", value: fmtCurrency(scenario.stateTax), color: "text-[#040505]" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-1 border-b border-[#e0e0e0]/50">
                    <span className="text-[#040505]">{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-[#040505] mt-1">
                  <span className="font-bold text-[#040505] text-[14px]">Est. Total Tax</span>
                  <span className={`font-bold text-[14px] ${scenario.id === "a" ? "text-[#007a00]" : "text-[#040505]"}`}>
                    ${scenario.totalTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767676]">Effective Rate on Sale</span>
                  <span className={`font-bold ${scenario.id === "a" ? "text-[#007a00]" : "text-[#040505]"}`}>
                    {scenario.effectiveRate}%
                  </span>
                </div>
                {scenario.note && (
                  <p className={`text-[11px] mt-1.5 ${scenario.noteColor}`}>{scenario.note}</p>
                )}
              </div>

              {/* Asset mix impact */}
              <div className="text-[12px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#040505] text-[12px] uppercase tracking-wide">Asset Mix Impact</span>
                  <a href="#" className="text-[#1255cc] underline text-[11px]">▶ Fund detail</a>
                </div>
                <div className="mb-1">
                  <p className="text-[11px] text-[#767676] mb-0.5">Current after sale:</p>
                  <AssetBar
                    usEquity={scenario.assetMix.usEquity.after}
                    intlEquity={scenario.assetMix.intlEquity.after}
                    fixedIncome={scenario.assetMix.fixedIncome.after}
                  />
                </div>
                <div className="mb-2">
                  <p className="text-[11px] text-[#767676] mb-0.5">Target:</p>
                  <AssetBar
                    usEquity={scenario.assetMix.usEquity.target}
                    intlEquity={scenario.assetMix.intlEquity.target}
                    fixedIncome={scenario.assetMix.fixedIncome.target}
                  />
                </div>
                <div className="flex gap-3 text-[10px] text-[#767676] mb-3">
                  <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#1255cc] mr-1"></span>US Equity</span>
                  <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#00a0a0] mr-1"></span>Intl Equity</span>
                  <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#b05000] mr-1"></span>Fixed Income</span>
                </div>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-[10px] font-semibold text-[#767676] border-b border-[#e0e0e0]">
                      <th className="text-left pb-1">Asset Class</th>
                      <th className="text-right pb-1">Before</th>
                      <th className="text-right pb-1">After</th>
                      <th className="text-right pb-1">Target</th>
                      <th className="text-right pb-1">Diff.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "US Equity", color: "bg-[#1255cc]", ...scenario.assetMix.usEquity },
                      { label: "Intl Equity", color: "bg-[#00a0a0]", ...scenario.assetMix.intlEquity },
                      { label: "Fixed Income", color: "bg-[#b05000]", ...scenario.assetMix.fixedIncome },
                    ].map((row) => {
                      const diff = row.after - row.target;
                      return (
                        <tr key={row.label} className="border-b border-[#e0e0e0]/50">
                          <td className="py-1 flex items-center gap-1.5">
                            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${row.color}`} />
                            <span className={`font-bold ${row.color === "bg-[#1255cc]" ? "text-[#1255cc]" : row.color === "bg-[#00a0a0]" ? "text-[#00a0a0]" : "text-[#b05000]"}`}>{row.label}</span>
                          </td>
                          <td className="py-1 text-right text-[#040505]">{row.before}%</td>
                          <td className="py-1 text-right text-[#040505]">{row.after}%</td>
                          <td className="py-1 text-right text-[#040505]">{row.target}%</td>
                          <td className={`py-1 text-right font-bold ${diff > 0 ? "text-[#007a00]" : diff < 0 ? "text-[#c8102e]" : "text-[#040505]"}`}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className={`text-[11px] mt-2 ${scenario.driftOk ? "text-[#767676]" : "text-[#c8102e] font-bold"}`}>
                  Overall drift from target: {scenario.driftNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="px-7 py-3 text-[13px] text-[#767676] italic border-t border-[#e0e0e0]">
          Select a scenario to execute, or edit amounts above to create a custom scenario
        </p>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#040505] flex items-center justify-between h-14 px-7 z-40">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Link
            href="/portfolio/sell-rebalance/confirmation"
            className="bg-white text-[#040505] font-bold text-[13px] px-5 py-2 rounded-full whitespace-nowrap"
          >
            Execute Scenario A ← saves $582 in tax vs. Scenario B
          </Link>
          <Link
            href="/portfolio/sell-rebalance/confirmation"
            className="border border-white text-white font-bold text-[13px] px-5 py-2 rounded-full whitespace-nowrap"
          >
            Execute Scenario B · better rebalancing
          </Link>
        </div>
      </div>
    </div>
  );
}
