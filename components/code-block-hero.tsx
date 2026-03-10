"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const codeLines = [
  { indent: 0, text: "const juan = {", color: "text-foreground" },
  { indent: 1, text: 'role: "Technical Lead / Staff AI Engineer",', color: "text-primary" },
  { indent: 1, text: 'location: "Medellin, Colombia",', color: "text-primary" },
  { indent: 1, text: "stack: [", color: "text-foreground" },
  { indent: 2, text: '"React", "Next.js", "TypeScript", "Python",', color: "text-accent" },
  { indent: 2, text: '"PyTorch", "Temporal", "Kubernetes", "LLMs"', color: "text-accent" },
  { indent: 1, text: "],", color: "text-foreground" },
  { indent: 1, text: "publications: [", color: "text-foreground" },
  { indent: 2, text: '"NeurIPS (Best Paper)", "ICML", "ACL", "Nature"', color: "text-accent" },
  { indent: 1, text: "],", color: "text-foreground" },
  { indent: 1, text: "reliability: 99.98,", color: "text-primary" },
  { indent: 1, text: "monthlyRequests: 200_000,", color: "text-primary" },
  { indent: 1, text: "ships: true", color: "text-primary" },
  { indent: 0, text: "}", color: "text-foreground" },
]

export function CodeBlockHero() {
  return (
    <section className="relative px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl"
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
            <div className="h-3 w-3 rounded-full bg-green-400/60" />
            <span className="ml-3 font-mono text-xs text-muted-foreground/60">
              about.ts
            </span>
          </div>

          {/* Code content */}
          <div className="p-6">
            <pre className="font-mono text-sm leading-7">
              {codeLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                >
                  <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/30">
                    {i + 1}
                  </span>
                  <span style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
                    <span className={cn(line.color)}>{line.text}</span>
                  </span>
                </motion.div>
              ))}
            </pre>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
