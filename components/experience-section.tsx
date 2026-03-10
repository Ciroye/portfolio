"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Calendar, ChevronRight, ExternalLink } from "lucide-react"

const experience = [
  {
    company: "Contextual AI",
    role: "Technical Lead Software/AI Engineer",
    period: "May 2024 - Present",
    type: "Current",
    description: "Leading the design and development of modular, graph-based agent frameworks for scalable AI composition.",
    highlights: [
      "Designed modular, graph-based agent framework using DDD, enabling scalable composition across research and sales teams",
      "Operated production agentic systems at scale: 200K+ monthly requests, 99.98% reliability with strict SLAs",
      "Migrated orchestration to Temporal, improving evaluation success from 60% to 98% and 10x throughput",
      "Built core platform modules (evaluation, query, feedback), accelerating internal developer velocity",
    ],
    tags: ["Agentic AI", "Temporal", "DDD", "Production ML"],
  },
  {
    company: "MLCommons / Factored AI",
    role: "Senior Software / ML Engineer",
    period: "Jan 2021 - May 2024",
    type: "3+ years",
    description: "Tech lead for Dynabench, the collaborative AI evaluation platform used by industry leaders.",
    highlights: [
      "Tech lead for Dynabench, collaborative AI evaluation platform used by Google, Stanford, MIT, NVIDIA, and NASA",
      "Released People's Speech and MSWC datasets, adopted by OpenAI Whisper",
      "Designed large-scale multimodal data deduplication and cleaning pipelines",
      "Collaborated with industry and academia to define evaluation benchmarks for modern ML systems",
    ],
    tags: ["Benchmarking", "Datasets", "Open Source", "NLP"],
  },
  {
    company: "Iluma Alliance",
    role: "ML Engineer / Software Engineer",
    period: "Jan 2019 - Jan 2021",
    type: "2 years",
    description: "Built end-to-end analytics platforms and ML solutions for manufacturing optimization.",
    highlights: [
      "Built end-to-end analytics platform from data warehouse to dashboards",
      "Led ML and computer vision initiatives improving factory workflows by 25%",
      "Developed order tracking and logistics systems supporting 1,000+ monthly transactions",
    ],
    tags: ["Computer Vision", "Analytics", "Data Engineering"],
  },
  {
    company: "Quantum Leap Data / Softytec",
    role: "ML Engineer / Software Engineer",
    period: "Jan 2017 - Jan 2019",
    type: "2 years",
    description: "Delivered predictive analytics and computer vision solutions for construction management.",
    highlights: [
      "Delivered predictive analytics reducing project planning errors by 20%",
      "Built construction management platform improving operational efficiency by 30%",
      "Developed computer-vision crack detection system achieving 95%+ accuracy",
    ],
    tags: ["Predictive Analytics", "Computer Vision", "Construction Tech"],
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <section id="experience" className="relative px-6 py-8 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Career
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Professional Experience
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            +9 years of experience building production ML systems, from early-stage startups to industry-defining platforms.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-4"
        >
          {experience.map((exp, index) => {
            const isExpanded = expandedIndex === index
            return (
              <motion.div
                key={exp.company}
                variants={itemVariants}
                className="group"
              >
                <motion.button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className={`w-full rounded-2xl border text-left transition-all duration-300 ${isExpanded
                    ? "border-primary/30 bg-card shadow-lg"
                    : "border-border bg-card/50 hover:border-border hover:bg-card hover:shadow-md"
                    }`}
                  layout
                >
                  <div className="p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${isExpanded ? "bg-primary/10" : "bg-secondary"
                          }`}>
                          <Building2 className={`h-5 w-5 transition-colors ${isExpanded ? "text-primary" : "text-muted-foreground"
                            }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{exp.company}</h3>
                          <p className="text-sm text-muted-foreground">{exp.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{exp.period}</span>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${index === 0
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                          }`}>
                          {exp.type}
                        </span>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-90" : ""
                          }`} />
                      </div>
                    </div>

                    {/* Mobile date */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{exp.period}</span>
                    </div>

                    {/* Description preview */}
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 border-t border-border pt-6">
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Key Achievements
                            </h4>
                            <ul className="grid gap-3 md:grid-cols-2">
                              {exp.highlights.map((highlight, hIndex) => (
                                <li
                                  key={hIndex}
                                  className="flex gap-3 rounded-lg bg-secondary/50 p-3 text-sm leading-relaxed text-foreground"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Tags */}
                            <div className="mt-6 flex flex-wrap gap-2">
                              {exp.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
