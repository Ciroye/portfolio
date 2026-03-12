"use client"

import { motion } from "framer-motion"

const metrics = [
  { value: "+9 yrs", label: "Engineering Experience" },
  { value: "200K+", label: "Monthly Requests Handled" },
  { value: "14", label: "Research Publications" },
  { value: "99.98%", label: "System Reliability" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function MetricsStrip() {
  return (
    <section className="relative border-y border-border bg-secondary/50 px-6 py-16 md:px-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-4"
      >
        {metrics.map((m) => (
          <motion.div key={m.label} variants={itemVariants} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {m.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
