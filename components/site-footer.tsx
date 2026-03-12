"use client"

import { motion } from "framer-motion"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center"
      >
        <p className="font-mono text-xs tracking-widest text-muted-foreground/60 uppercase">
          Building intelligent systems at scale
        </p>

        <div className="flex items-center gap-8">
          <a
            href="https://www.linkedin.com/in/juanciro1/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=dOXuJdQAAAAJ"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Google Scholar
          </a>
          <a
            href="mailto:jmcirot@unal.edu.co"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Email
          </a>

        </div>
      </motion.div>
    </footer>
  )
}
