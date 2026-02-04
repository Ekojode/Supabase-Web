import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import BrowseGroups from "@/components/BrowseGroups";
import VibeCalculator from "@/components/VibeCalculator";
import FAQ from "@/components/FAQ";
import WaitlistTicket from "@/components/WaitlistTicket";
import SubbBayLogo from "@/components/SubbBayLogo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <BrowseGroups />
      <VibeCalculator />
      <FAQ />
      <WaitlistTicket />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <SubbBayLogo size="md" />
              </div>
              <p className="text-[#3A5369]/70 max-w-sm text-sm leading-relaxed">
                The smart way to share subscriptions. <br />
                Split costs, not passwords.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-[#1A1A2E] mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm text-[#3A5369]/70">
                <li><a href="#how-it-works" className="hover:text-[#4CBBB9] transition-colors">How it Works</a></li>
                <li><a href="#browse" className="hover:text-[#4CBBB9] transition-colors">Browse Groups</a></li>
                <li><a href="#pricing" className="hover:text-[#4CBBB9] transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#1A1A2E] mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-sm text-[#3A5369]/70">
                <li><a href="#" className="hover:text-[#4CBBB9] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#4CBBB9] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#4CBBB9] transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#3A5369]/40 font-medium">
              © 2026 Subb Bay Inc.
            </div>
            <div className="text-sm text-[#3A5369]/40 font-medium flex items-center gap-2">
              <span>Lagos, NG</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>Built with 💚</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
