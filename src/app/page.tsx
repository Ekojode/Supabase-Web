import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TrustTicker from "@/components/TrustTicker";
import VibeCalculator from "@/components/VibeCalculator";
import ChillGrindToggle from "@/components/ChillGrindToggle";
import FAQ from "@/components/FAQ";
import WaitlistTicket from "@/components/WaitlistTicket";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <TrustTicker />
      <VibeCalculator />
      <ChillGrindToggle />
      <FAQ />
      <WaitlistTicket />

      {/* Footer Branding */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-4xl font-black italic tracking-tighter">SUBBY</div>
          <div className="flex gap-8 font-mono text-sm opacity-50 uppercase">
            <span>© 2026 Subby INC</span>
            <span>LAGOS, NIGERIA</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
