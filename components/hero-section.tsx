"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, MapPin } from "lucide-react"
import { AgentOrchestrationDiagram } from "@/components/system-architecture-diagram"

const roles = [
  "Software/AI Engineer",
  "AI Systems Architect",
  "ML Infrastructure Engineer",
  "Full-Stack Engineer",
]

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        55
      )
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2400)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length - 1)),
        30
      )
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, roleIndex])

  return (
    <section className="relative flex py-30  flex-col items-center justify-center overflow-hidden px-6">
      <div className="relative z-[2] mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center ">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <MapPin className="h-3 w-3 text-primary" />
            <span className="font-mono text-sm tracking-wide text-muted-foreground">
              Juan Manuel Ciro
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-2xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Building{" "}
            <span className="text-primary">intelligent systems</span>{" "}
            at scale
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 flex h-10 items-center"
          >
            <span className="font-mono text-base text-muted-foreground md:text-lg">
              {">"} {displayed}
              <span
                className="ml-0.5 inline-block w-[2px] bg-primary"
                style={{
                  animation: "blink 1s step-end infinite",
                  height: "1.1em",
                  verticalAlign: "text-bottom",
                }}
              />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Senior AI/ML Engineer with +9 years of experience building agentic AI systems and large-scale ML infrastructure.

            Currently leading the Agent Composer platform at Contextual AI, transforming RAG pipelines into modular multi-agent systems used in production.

            Co-author of 14 papers across NeurIPS, ICML, ACL and Nature.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=dOXuJdQAAAAJ"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              Google Scholar
            </a>
            <a
              href="https://www.linkedin.com/in/juanciro1/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative w-full min-w-0 max-w-2xl flex-shrink-0 lg:max-w-[700px]"
        >
          <AgentOrchestrationDiagram />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-[2] -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-[1px] bg-gradient-to-b from-muted-foreground/30 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}
