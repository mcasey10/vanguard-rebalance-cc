export default function HeroBanner() {
  return (
    <div className="bg-[#c20029] relative h-[92px] overflow-hidden flex items-center px-7">
      {/* Decorative diagonal shape */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "linear-gradient(135deg, transparent 40%, #8b0000 40%, #8b0000 60%, transparent 60%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2/3"
        style={{
          background: "linear-gradient(to bottom left, #9b0020 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 flex-1">
        <p className="text-white/85 text-[14px]">Welcome back, Michael</p>
        <p className="text-white text-[32px] font-bold leading-tight">$580,745.29</p>
      </div>
      <div className="relative z-10 text-right text-[12px] text-white/85">
        <p>
          <span className="underline">Value as of:</span> February 19, 2026, 4:15 p.m., Eastern time
        </p>
        <p>
          <span className="underline">Last login:</span> February 19, 2026, 4:38 p.m., Eastern time
        </p>
      </div>
    </div>
  );
}
