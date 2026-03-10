"use client"

import { motion } from "framer-motion"

const skillGroups = [
  {
    category: "Programming",
    skills: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js"],
  },
  {
    category: "Distributed Systems & Infra",
    skills: ["Temporal.io", "Docker", "Kubernetes", "GCP", "AWS", "Terraform"],
  },
  {
    category: "AI / ML",
    skills: ["LLM Systems", "RAG", "Agentic Workflows", "NLP", "Computer Vision", "ML Infrastructure"],
  },
  {
    category: "Observability",
    skills: ["Grafana", "Kibana", "Distributed Tracing", "Metrics", "Reliability Engineering"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function SkillsSection() {
  return (
    <section className="relative border-t border-border bg-secondary/50 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Toolkit
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Skills & Technologies
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={itemVariants}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="mb-4 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
