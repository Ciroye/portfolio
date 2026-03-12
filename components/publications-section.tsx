"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Award } from "lucide-react"

const publications = [
  {
    venue: "NeurIPS 2024",
    title: "Best Paper Award (Co-author)",
    description:
      "Recognized for outstanding contribution to the field of machine learning evaluation and data-centric AI systems.",
    href: "https://neurips.cc/virtual/2024/oral/98025",
    highlight: true,
  },
  {
    venue: "Nature 2026",
    title: "Nature Publication",
    description:
      "Forthcoming publication in Nature on AI systems and their applications in scientific research.",
    href: "https://www.nature.com/articles/s41591-025-04074-y",
    highlight: false,
  },
  {
    venue: "ACM FAccT 2024",
    title: "Adversarial Nibbler: A Data-Centric Challenge",
    description:
      "Advancing fairness-aware and data-centric evaluation practices for modern machine learning systems.",
    href: "https://dl.acm.org/doi/abs/10.1145/3630106.3658913",
    highlight: false,
  },
  {
    venue: "CoNLL 2023 (ACL)",
    title: "BabyLM Challenge Proceedings",
    description:
      "Sample-efficient language modeling and robust evaluation methodologies for language model training.",
    href: "https://aclanthology.org/volumes/2023.conll-babylm/",
    highlight: false,
  },
  {
    venue: "NeurIPS 2021",
    title: "Data-Centric AI Workshop",
    description:
      "LSH methods for data deduplication in a Wikipedia artificial dataset",
    href: "https://www.datacentricai.org/neurips21/",
    highlight: false,
  },
  {
    venue: "ICML, NeurIPS, ACL",
    title: "14 Publications Total",
    description:
      "Spanning evaluation, NLP, computer vision, and AI systems across top-tier venues.",
    href: "https://scholar.google.com/citations?view_op=list_works&hl=en&user=dOXuJdQAAAAJ",
    highlight: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

export function PublicationsSection() {
  return (
    <section id="publications" className="relative px-6 py-8 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Research
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Selected Publications
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {publications.map((paper) => (
            <motion.a
              key={paper.title}
              variants={itemVariants}
              href={paper.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-foreground uppercase ${paper.highlight ? "bg-transparent" : "bg-secondary/50"}`}
                >
                  {paper.highlight && <Award className="h-3 w-3 text-primary" />}
                  {paper.venue}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-primary" />
              </div>

              <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {paper.title}
              </h3>

              <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
                {paper.description}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
