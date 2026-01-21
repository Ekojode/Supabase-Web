"use client";

const RECENT_WINS = [
    "Ola saved ₦14,000 on Adobe",
    "Chinedu joined Netflix Group #4092",
    "Fatima split Disney+ with 3 others",
    "Kazeem saved ₦8,500 on Spotify",
    "Sarah joined Starlink Group #552",
    "Ibrahim split Canva Pro"
];

export default function TrustTicker() {
    return (
        <div className="bg-subby-emerald border-y-3 border-black py-4 overflow-hidden mt-20">
            <div className="flex whitespace-nowrap animate-ticker">
                {[...RECENT_WINS, ...RECENT_WINS].map((text, i) => (
                    <div key={i} className="flex items-center mx-12">
                        <span className="text-xl md:text-2xl font-mono font-bold uppercase text-black">
                            {text}
                        </span>
                        <div className="w-12 h-[3px] bg-black ml-12" />
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }
      `}</style>
        </div>
    );
}
