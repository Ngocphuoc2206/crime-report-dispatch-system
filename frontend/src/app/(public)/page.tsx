import { HeroSection } from "@/features/public-home/components/HeroSection";
import { LegalHelpSection } from "@/features/public-home/components/LegalHelpSection";
import { SecurityAlerts } from "@/features/public-home/components/SecurityAlerts";
import { TrustMetrics } from "@/features/public-home/components/TrustMetrics";

export default function PublicHomePage() {
  return (
    <>
      <HeroSection />

      <section className="bg-(--background) px-6 py-12 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[2fr_1fr]">
          <SecurityAlerts />
          <LegalHelpSection />
        </div>
      </section>

      <TrustMetrics />

      <div aria-hidden="true" className="h-28 bg-(--background) md:h-72" />
    </>
  );
}
