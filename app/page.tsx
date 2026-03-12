"use client"

import { SiteNav } from "@/components/site-nav"
import { HeroSection } from "@/components/hero-section"
import { MetricsStrip } from "@/components/metrics-strip"
import { CodeBlockHero } from "@/components/code-block-hero"
import { ExperienceSection } from "@/components/experience-section"
import { ExpertiseTabs } from "@/components/expertise-tabs"
import { PublicationsSection } from "@/components/publications-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteNav />
      <main>
        <HeroSection />
        <MetricsStrip />
        <CodeBlockHero />
        <ExperienceSection />
        <ExpertiseTabs />
        <PublicationsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
