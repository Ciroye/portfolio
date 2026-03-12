"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Code2, Brain, Workflow, Server, ChevronRight } from "lucide-react"

const tabs = [
  {
    id: "agents",
    label: "Agentic Systems",
    icon: Workflow,
    title: "Agentic AI Platforms",
    intro:
      "At Contextual AI, I lead the Agent Composer team -- designing modular, graph-based agent frameworks that convert RAG pipelines into scalable, observable distributed systems.",
    bullets: [
      {
        heading: "Architecture",
        text: "Domain-Driven Design with composable agent workflows enabling scalable composition across research, sales, and applied teams.",
      },
      {
        heading: "Orchestration",
        text: "Temporal-based orchestration improving evaluation success from 60% to 98% with 10x throughput scaling.",
      },
      {
        heading: "Observability",
        text: "Distributed logging, tracing, and metrics reducing MTTR and enabling data-driven reliability engineering.",
      },
    ],
    tags: ["Temporal.io", "DDD", "GraphQL", "gRPC", "Docker", "K8s"],
  },
  {
    id: "ml",
    label: "ML & Research",
    icon: Brain,
    title: "Applied ML & Research",
    intro:
      "Co-author of 14 papers across NeurIPS, ICML, ACL, and Nature Medicine. NeurIPS 2024 Best Paper co-author. My work spans evaluation, NLP, computer vision, and data-centric AI.",
    bullets: [
      {
        heading: "Evaluation",
        text: "Led Dynabench at MLCommons -- collaborative AI evaluation platform used by Google, Stanford, MIT, NVIDIA, and NASA.",
      },
      {
        heading: "Datasets",
        text: "Released People's Speech and MSWC datasets, broadly adopted including by OpenAI Whisper.",
      },
      {
        heading: "Data-Centric",
        text: "Large-scale multimodal data deduplication and cleaning pipelines improving dataset quality and research reproducibility.",
      },
    ],
    tags: ["PyTorch", "LLMs", "RAG", "NLP", "Computer Vision", "MLOps"],
  },
  {
    id: "fullstack",
    label: "Full-Stack",
    icon: Code2,
    title: "Full-Stack Engineering",
    intro:
      "End-to-end product delivery from data warehouse to user-facing dashboards. React, Next.js, Python, with deep experience in production systems.",
    bullets: [
      {
        heading: "Frontend",
        text: "React and Next.js architecture, design systems, performance optimization, and accessibility-first development.",
      },
      {
        heading: "Backend",
        text: "Python, API design, service boundaries, and stateful pipelines for production workloads.",
      },
      {
        heading: "Analytics",
        text: "End-to-end analytics platforms from data warehouse to leadership dashboards for operational intelligence.",
      },
    ],
    tags: ["React", "Next.js", "TypeScript", "Python", "PostgreSQL"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    icon: Server,
    title: "Distributed Systems & Infra",
    intro:
      "Production infrastructure at scale with strict SLAs, failure isolation, and comprehensive observability across cloud platforms.",
    bullets: [
      {
        heading: "Cloud",
        text: "GCP and AWS infrastructure, Kubernetes orchestration, and containerized deployment pipelines.",
      },
      {
        heading: "Reliability",
        text: "99.98% system reliability with failure isolation, circuit breakers, and SLA-driven engineering.",
      },
      {
        heading: "Monitoring",
        text: "Grafana, Kibana, distributed tracing, metrics, and reliability engineering for production systems.",
      },
    ],
    tags: ["Kubernetes", "Docker", "GCP", "AWS", "Grafana", "Terraform"],
  },
]

const skillGroups = [
  { category: "Programming", skills: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "SQL"] },
  { category: "Distributed Systems & Infra", skills: ["Temporal.io", "Docker", "Kubernetes", "GCP", "AWS", "Redis", "SSE", "WebSocket"] },
  { category: "AI / ML", skills: ["LLM Systems", "RAG", "Agentic Workflows", "NLP", "Computer Vision", "ML Infrastructure"] },
  { category: "Observability", skills: ["Grafana", "Kibana", "Distributed Tracing", "Metrics", "Reliability Engineering"] },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ExpertiseTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <section id="expertise" className="relative px-6 py-8 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Depth by Domain · Toolkit
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Technical Expertise & Skills
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Tab triggers */}
          <div className="mb-8 flex rounded-xl border border-border bg-secondary/60 overflow-hidden">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isFirst = index === 0
              const isLast = index === tabs.length - 1
              const roundedClass = isFirst && isLast
                ? "rounded-xl"
                : isFirst
                  ? "rounded-l-xl"
                  : isLast
                    ? "rounded-r-xl"
                    : ""
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group relative flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300",
                    roundedClass,
                    isActive
                      ? "text-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute inset-0 border border-primary/20",
                        "dark:bg-secondary/80",
                        roundedClass
                      )}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <active.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                    {active.title}
                  </h3>
                </div>

                <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
                  {active.intro}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {active.bullets.map((bullet, i) => (
                    <motion.div
                      key={bullet.heading}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="rounded-xl border border-border bg-secondary/40 p-5 transition-colors hover:bg-secondary/70"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono text-xs font-semibold tracking-wide text-primary uppercase">
                          {bullet.heading}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {bullet.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Skills & Technologies grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-4"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <motion.div
                  key={group.category}
                  variants={itemVariants}
                  className="rounded-xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/10"
                >
                  <h3 className="mb-3 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
