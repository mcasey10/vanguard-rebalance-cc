import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import HeroBanner from "@/components/HeroBanner";
import SectionNav from "@/components/SectionNav";
import SellRebalanceSubNav from "@/components/SellRebalanceSubNav";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <GlobalNav />
      <HeroBanner />
      <SectionNav />
      <SellRebalanceSubNav />

      <div className="bg-white px-7 pt-8 pb-10 flex flex-col gap-5">
        {/* Success banner */}
        <div className="border-2 border-[#007a00] bg-[#f0fff0] rounded flex items-start gap-5 px-8 py-7">
          <span className="text-[40px] text-[#040505] leading-none mt-0.5">✓</span>
          <div className="flex-1">
            <h2 className="text-[20px] font-bold text-[#007a00]">Order Submitted Successfully</h2>
            <p className="text-[14px] text-[#555] mt-1">
              Your sell orders have been placed. Funds will be available within 1–2 business days.
            </p>
          </div>
          <div className="text-right text-[12px] text-[#767676]">
            <p>Submitted: February 19, 2026, 4:52 p.m. ET</p>
            <p>
              Confirmation: <strong>#VG-2026-0219-8821</strong>
            </p>
          </div>
        </div>

        {/* Orders and tax summary side by side */}
        <div className="flex gap-5">
          {/* Orders Placed */}
          <div className="flex-1 border border-[#e0e0e0] rounded overflow-hidden">
            <div className="bg-[#040505] px-4 py-2.5">
              <h3 className="text-white font-bold text-[13px]">Orders Placed</h3>
            </div>
            <table className="w-full text-[13px]">
              <thead className="bg-[#f2f2f2]">
                <tr>
                  {["Fund", "Sell Amount", "Method", "Est. Shares", "Order #"].map((h, i) => (
                    <th
                      key={h}
                      className={`font-bold px-3 py-2 border-b border-[#e0e0e0] ${i === 0 ? "text-left" : "text-right"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    ticker: "VTSAX",
                    name: "Total Stock Market Index · Admiral",
                    sell: "$6,000",
                    method: "MinTax",
                    shares: "≈7.64",
                    order: "8821-A",
                  },
                  {
                    ticker: "VBTLX",
                    name: "Total Bond Market · Admiral",
                    sell: "$4,000",
                    method: "FIFO",
                    shares: "≈43.08",
                    order: "8821-B",
                  },
                ].map((row) => (
                  <tr key={row.ticker} className="border-b border-[#e0e0e0]">
                    <td className="px-3 py-3">
                      <p className="font-bold text-[13px]">{row.ticker}</p>
                      <p className="text-[11px] text-[#767676]">{row.name}</p>
                    </td>
                    <td className="px-3 py-3 text-right font-bold">{row.sell}</td>
                    <td className="px-3 py-3 text-right">{row.method}</td>
                    <td className="px-3 py-3 text-right">{row.shares}</td>
                    <td className="px-3 py-3 text-right font-mono text-[11px]">{row.order}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Summary — Optimized */}
          <div className="flex-1 border border-[#e0e0e0] rounded overflow-hidden">
            <div className="bg-[#1a7a1a] px-4 py-2.5">
              <h3 className="text-white font-bold text-[13px]">Tax Summary — Optimized</h3>
            </div>
            <div className="px-4 py-4 text-[13px]">
              {[
                { label: "Total Sale Amount", value: "$10,000", bold: false, color: "text-[#040505]" },
                { label: "ST Capital Gains", value: "+$21", bold: true, color: "text-[#007a00]" },
                { label: "LT Capital Gains", value: "+$5,226", bold: true, color: "text-[#007a00]" },
                { label: "Losses Harvested", value: "−$1,684", bold: false, color: "text-[#007a00]" },
                { label: "Net Taxable Gain", value: "$3,563", bold: false, color: "text-[#040505]" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between py-1.5 border-b border-[#e0e0e0]"
                >
                  <span>{row.label}</span>
                  <span className={`${row.bold ? "font-bold" : ""} ${row.color}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b-2 border-[#040505] mt-1">
                <span className="font-bold text-[16px]">Est. Total Tax</span>
                <span className="font-bold text-[16px] text-[#007a00]">$532</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#767676]">Effective Rate on Sale</span>
                <span className="font-bold text-[#007a00]">5.32%</span>
              </div>
              <div className="bg-[#f0fff0] rounded p-2.5 mt-3">
                <p className="text-[11px] text-[#1a5c1a]">
                  <strong>You saved $582</strong> compared to selling without tax optimization
                  (13.07% → 5.32% effective rate). Loss harvesting from VBTLX offset gains from
                  VTSAX.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Rebalancing Impact */}
        <div className="border border-[#e0e0e0] rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0]">
            <h3 className="font-bold text-[13px]">Portfolio Rebalancing Impact</h3>
          </div>
          <div className="px-4 py-4 flex gap-4">
            {[
              {
                label: "US Equity (before → after)",
                value: "65.0% → 62.6%",
                note: "2.4% below 65% target",
                noteColor: "text-[#c8102e] font-bold",
              },
              {
                label: "Intl Equity (before → after)",
                value: "16.9% → 17.1%",
                note: "2.1% above 15% target",
                noteColor: "text-[#007a00] font-bold",
              },
              {
                label: "Fixed Income (before → after)",
                value: "20.5% → 20.3%",
                note: "0.3% above 20% target",
                noteColor: "text-[#767676]",
              },
            ].map((item) => (
              <div key={item.label} className="flex-1 bg-[#f2f2f2] rounded p-3 text-center">
                <p className="text-[12px] text-[#767676]">{item.label}</p>
                <p className="text-[16px] font-bold text-[#040505] mt-1">{item.value}</p>
                <p className={`text-[11px] mt-0.5 ${item.noteColor}`}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="border border-[#e0e0e0] rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0]">
            <h3 className="font-bold text-[13px]">What Happens Next</h3>
          </div>
          <div className="px-4 py-4">
            {[
              {
                step: 1,
                done: true,
                title: "Order submitted",
                sub: "Today, Feb 19 · 4:52 p.m. ET · Confirmation #VG-2026-0219-8821",
              },
              {
                step: 2,
                done: false,
                title: "Orders executed at market close",
                sub: "Today, Feb 19 · 4:00 p.m. ET (already past market close — executes Feb 20)",
              },
              {
                step: 3,
                done: false,
                title: "Trade settles (T+1)",
                sub: "Feb 20, 2026 · Proceeds credited to settlement fund",
              },
              {
                step: 4,
                done: false,
                title: "Available for withdrawal or reinvestment",
                sub: "Feb 21, 2026 · 1099-B tax form will be available in Documents by Jan 31, 2027",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 min-h-[48px]">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full w-7 h-7 flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${
                      item.done ? "bg-[#007a00] text-white" : "bg-[#e0e0e0] text-[#555]"
                    }`}
                  >
                    {item.step}
                  </div>
                  {i < 3 && <div className="w-0.5 flex-1 bg-[#e0e0e0] mt-1" />}
                </div>
                <div className="pt-1 pb-4">
                  <p className="font-bold text-[13px] text-[#040505]">{item.title}</p>
                  <p className="text-[12px] text-[#767676]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/portfolio/balances"
            className="bg-[#040505] text-white font-bold text-[13px] px-6 py-2.5 rounded-full whitespace-nowrap"
          >
            ← Return to Portfolio
          </Link>
          <button className="border border-[#040505] text-[#040505] font-bold text-[13px] px-6 py-2.5 rounded-full whitespace-nowrap">
            Download Confirmation PDF
          </button>
          <button className="border border-[#040505] text-[#040505] font-bold text-[13px] px-6 py-2.5 rounded-full whitespace-nowrap">
            View Order Status
          </button>
          <button className="text-[#1255cc] underline font-bold text-[13px] px-4 py-2.5 rounded-full whitespace-nowrap">
            Start another transaction
          </button>
        </div>
      </div>
    </div>
  );
}
