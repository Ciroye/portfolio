"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Code,
  Image,
  Database,
  FileText,
  BarChart3,
  Cpu,
  Layers,
  Zap,
  Search,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"

type NodeType = "orchestrator" | "agent" | "context" | "output"

// Elegant palette drawn from the design-system chart tokens —
// they are already designed to harmonize with the page.
const TYPE_COLORS: Record<NodeType, string> = {
  orchestrator: "var(--chart-1)", // blue-slate
  context:      "var(--chart-2)", // teal
  agent:        "var(--chart-3)", // violet
  output:       "var(--chart-5)", // warm amber
}

interface Node {
  id: string
  label: string
  sub: string
  x: number
  y: number
  w: number
  h: number
  type: NodeType
  icon: LucideIcon
  status: "active" | "processing" | "idle"
  color: string
}

const NODES: Node[] = [
  {
    id: "input",
    label: "User Input",
    sub: "Multi-modal",
    x: 85,
    y: 38,
    w: 138,
    h: 62,
    type: "orchestrator",
    icon: MessageSquare,
    status: "active",
    color: TYPE_COLORS.orchestrator,
  },
  {
    id: "orchestrator",
    label: "Orchestrator",
    sub: "Agent Router",
    x: 348,
    y: 38,
    w: 148,
    h: 62,
    type: "orchestrator",
    icon: Brain,
    status: "processing",
    color: TYPE_COLORS.orchestrator,
  },
  {
    id: "memory",
    label: "Memory",
    sub: "Long-term",
    x: 628,
    y: 18,
    w: 124,
    h: 54,
    type: "context",
    icon: Database,
    status: "active",
    color: TYPE_COLORS.context,
  },
  {
    id: "knowledge",
    label: "Knowledge",
    sub: "RAG · Vectors",
    x: 628,
    y: 104,
    w: 124,
    h: 54,
    type: "context",
    icon: Layers,
    status: "active",
    color: TYPE_COLORS.context,
  },
  {
    id: "code-agent",
    label: "Code Agent",
    sub: "Generation",
    x: 42,
    y: 172,
    w: 132,
    h: 62,
    type: "agent",
    icon: Code,
    status: "processing",
    color: TYPE_COLORS.agent,
  },
  {
    id: "research-agent",
    label: "Research",
    sub: "Web · APIs",
    x: 238,
    y: 172,
    w: 122,
    h: 62,
    type: "agent",
    icon: Search,
    status: "idle",
    color: TYPE_COLORS.agent,
  },
  {
    id: "vision-agent",
    label: "Vision",
    sub: "Image Analysis",
    x: 428,
    y: 172,
    w: 122,
    h: 62,
    type: "agent",
    icon: Image,
    status: "processing",
    color: TYPE_COLORS.agent,
  },
  {
    id: "reasoning-agent",
    label: "Reasoning",
    sub: "Chain of Thought",
    x: 614,
    y: 172,
    w: 138,
    h: 62,
    type: "agent",
    icon: Cpu,
    status: "active",
    color: TYPE_COLORS.agent,
  },
  {
    id: "text-output",
    label: "Text",
    sub: "Streaming",
    x: 42,
    y: 308,
    w: 112,
    h: 60,
    type: "output",
    icon: FileText,
    status: "active",
    color: TYPE_COLORS.output,
  },
  {
    id: "code-output",
    label: "Code",
    sub: "Executable",
    x: 210,
    y: 308,
    w: 112,
    h: 60,
    type: "output",
    icon: Code,
    status: "processing",
    color: TYPE_COLORS.output,
  },
  {
    id: "image-output",
    label: "Images",
    sub: "Generated",
    x: 382,
    y: 308,
    w: 112,
    h: 60,
    type: "output",
    icon: Image,
    status: "idle",
    color: TYPE_COLORS.output,
  },
  {
    id: "data-output",
    label: "Data",
    sub: "Structured",
    x: 554,
    y: 308,
    w: 112,
    h: 60,
    type: "output",
    icon: BarChart3,
    status: "active",
    color: TYPE_COLORS.output,
  },
  {
    id: "actions-output",
    label: "Actions",
    sub: "Tool Calls",
    x: 726,
    y: 308,
    w: 112,
    h: 60,
    type: "output",
    icon: Zap,
    status: "processing",
    color: TYPE_COLORS.output,
  },
]

interface Edge {
  from: string
  to: string
}

const EDGES: Edge[] = [
  { from: "input", to: "orchestrator" },
  { from: "orchestrator", to: "memory" },
  { from: "orchestrator", to: "knowledge" },
  { from: "orchestrator", to: "code-agent" },
  { from: "orchestrator", to: "research-agent" },
  { from: "orchestrator", to: "vision-agent" },
  { from: "orchestrator", to: "reasoning-agent" },
  { from: "memory", to: "reasoning-agent" },
  { from: "knowledge", to: "research-agent" },
  { from: "code-agent", to: "code-output" },
  { from: "code-agent", to: "text-output" },
  { from: "research-agent", to: "text-output" },
  { from: "research-agent", to: "data-output" },
  { from: "vision-agent", to: "image-output" },
  { from: "vision-agent", to: "text-output" },
  { from: "reasoning-agent", to: "text-output" },
  { from: "reasoning-agent", to: "actions-output" },
  { from: "reasoning-agent", to: "data-output" },
]

const VIEWBOX_W = 900
const VIEWBOX_H = 410
const VIEWBOX = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNodeCenter(node: Node) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 }
}

/**
 * Resolves a CSS color value (including custom properties) to an rgb/rgba
 * string that the Canvas 2D API can consume directly.
 */
function resolveCSSColor(cssValue: string): string {
  if (typeof window === "undefined") return "rgb(150,150,200)"
  const probe = document.createElement("div")
  probe.style.cssText = `color:${cssValue};position:absolute;visibility:hidden`
  document.body.appendChild(probe)
  const resolved = window.getComputedStyle(probe).color
  document.body.removeChild(probe)
  return resolved || "rgb(150,150,200)"
}

/** Replaces the alpha channel in an rgb/rgba string. */
function withAlpha(rgbStr: string, alpha: number): string {
  const n = rgbStr.match(/[\d.]+/g)
  if (!n || n.length < 3) return `rgba(150,150,200,${alpha})`
  return `rgba(${n[0]},${n[1]},${n[2]},${alpha})`
}

/**
 * Evaluates a point at parameter t (0–1) along the same bezier / line path
 * that generateEdgePath produces for the SVG.
 */
function getPointOnEdge(from: Node, to: Node, t: number): { x: number; y: number } {
  const fc = getNodeCenter(from)
  const tc = getNodeCenter(to)
  let sx = fc.x, sy = fc.y, ex = tc.x, ey = tc.y

  if (Math.abs(fc.y - tc.y) < 40) {
    // Straight horizontal-ish line
    sx = from.x + from.w
    ex = to.x
    return { x: sx + (ex - sx) * t, y: sy + (ey - sy) * t }
  }

  if (tc.y > fc.y) { sy = from.y + from.h; ey = to.y }
  else              { sy = from.y;           ey = to.y + to.h }

  const midY = (sy + ey) / 2

  // Cubic bezier P0=(sx,sy) P1=(sx,midY) P2=(ex,midY) P3=(ex,ey)
  // Since P0.x=P1.x and P2.x=P3.x, the x component simplifies to:
  //   Bx(t) = sx·(1-t)²(1+2t) + ex·t²(3-2t)
  // Since P1.y=P2.y=midY, the y component simplifies to:
  //   By(t) = sy·(1-t)³ + midY·3t(1-t) + ey·t³
  const bx = sx * (1 - t) * (1 - t) * (1 + 2 * t) + ex * t * t * (3 - 2 * t)
  const by = sy * (1 - t) * (1 - t) * (1 - t) + midY * 3 * t * (1 - t) + ey * t * t * t
  return { x: bx, y: by }
}

function generateEdgePath(from: Node, to: Node): string {
  const start = getNodeCenter(from)
  const end = getNodeCenter(to)
  let startX = start.x, startY = start.y
  let endX = end.x, endY = end.y

  if (Math.abs(start.y - end.y) < 40) {
    startX = from.x + from.w
    endX = to.x
    return `M ${startX} ${start.y} L ${endX} ${end.y}`
  }

  if (end.y > start.y) { startY = from.y + from.h; endY = to.y }
  else                  { startY = from.y;           endY = to.y + to.h }

  const midY = (startY + endY) / 2
  return `M ${startX} ${startY} C ${startX} ${midY} ${endX} ${midY} ${endX} ${endY}`
}

// ─── Canvas particle renderer ────────────────────────────────────────────────

interface Dot {
  edgeIdx: number
  t: number       // 0–1 progress along the edge
  speed: number   // progress units / second
  r: number       // base radius in viewBox units
  rgb: string     // resolved rgb() string
  alpha: number   // peak opacity
  trail: { x: number; y: number }[]
  trailLen: number
}

function FlowCanvas({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Resolve colors once on mount (runs client-side only)
    const edgeRGB = edges.map((e) => {
      const fn = nodes.find((n) => n.id === e.from)
      return fn ? resolveCSSColor(fn.color) : "rgb(150,150,200)"
    })

    const edgePairs = edges.map((e) => ({
      from: nodes.find((n) => n.id === e.from)!,
      to:   nodes.find((n) => n.id === e.to)!,
    }))

    // One dot per edge, evenly staggered so they don't all start at the same position
    const dots: Dot[] = []
    edges.forEach((_, i) => {
      dots.push({
        edgeIdx: i,
        t:        i / edges.length,
        speed:    0.14 + Math.random() * 0.08,
        r:        1.6,
        rgb:      edgeRGB[i],
        alpha:    0.85,
        trail:    [],
        trailLen: 14,
      })
    })

    // Keep canvas buffer in sync with its CSS size
    const syncSize = () => {
      const bbox = canvas.getBoundingClientRect()
      canvas.width  = Math.round(bbox.width)
      canvas.height = Math.round(bbox.height)
    }
    syncSize()
    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)

    let raf = 0
    let prev = performance.now()

    const draw = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // SVG is w-full h-auto with viewBox 900×410, so it always fills width:
      //   scale = W / 900  and  offsetX = offsetY = 0
      const sc = W / VIEWBOX_W

      for (const d of dots) {
        const ep = edgePairs[d.edgeIdx]
        if (!ep.from || !ep.to) continue

        d.t = (d.t + d.speed * dt) % 1

        const pt = getPointOnEdge(ep.from, ep.to, d.t)
        const px = pt.x * sc
        const py = pt.y * sc

        d.trail.push({ x: px, y: py })
        if (d.trail.length > d.trailLen) d.trail.shift()

        // ── Trail ──────────────────────────────────────────────────────────
        const tl = d.trail.length
        for (let k = 1; k < tl; k++) {
          const frac = k / tl
          const tp   = d.trail[k]
          const r    = Math.max(d.r * sc * frac * 0.6, 0.4)
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, r, 0, Math.PI * 2)
          ctx.fillStyle = withAlpha(d.rgb, frac * frac * d.alpha * 0.5)
          ctx.fill()
        }

        // ── Glowing core ──────────────────────────────────────────────────
        const r = d.r * sc
        ctx.save()
        ctx.shadowBlur  = r * 6
        ctx.shadowColor = withAlpha(d.rgb, 0.9)
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = withAlpha(d.rgb, d.alpha)
        ctx.fill()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [nodes, edges])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

// ─── SVG sub-components ──────────────────────────────────────────────────────

function DataFlowEdge({
  edge,
  nodes,
  index,
  hoveredNode,
}: {
  edge: Edge
  nodes: Node[]
  index: number
  hoveredNode: string | null
}) {
  const fromNode = nodes.find((n) => n.id === edge.from)
  const toNode   = nodes.find((n) => n.id === edge.to)

  if (!fromNode || !toNode) return null

  const path          = generateEdgePath(fromNode, toNode)
  const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to || hoveredNode === null

  return (
    <motion.path
      d={path}
      fill="none"
      strokeWidth={isHighlighted ? 1 : 0.5}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: isHighlighted ? 0.3 : 0.08 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.04 }}
      style={{ stroke: isHighlighted ? fromNode.color : "var(--border)" }}
    />
  )
}

function NodeCard({
  node,
  isHovered,
  onHover,
  index,
}: {
  node: Node
  isHovered: boolean
  onHover: (id: string | null) => void
  index: number
}) {
  const Icon = node.icon

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {/* Card — transparent with a faint color tint so text stays readable */}
      <motion.rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx="8"
        ry="8"
        fill={node.color}
        fillOpacity={isHovered ? 0.08 : 0.04}
        strokeWidth={isHovered ? 1.5 : 1}
        pointerEvents="all"
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          stroke: node.color,
          strokeOpacity: isHovered ? 0.9 : 0.45,
          transformOrigin: `${node.x + node.w / 2}px ${node.y + node.h / 2}px`,
        }}
      />

      {/* Icon */}
      <foreignObject x={node.x + 10} y={node.y + 10} width={18} height={18}>
        <div
          style={{ color: node.color }}
          className="flex items-center justify-center"
        >
          <Icon size={14} />
        </div>
      </foreignObject>

      {/* Label */}
      <text
        x={node.x + 32}
        y={node.y + 22}
        className="fill-foreground text-[10px] font-semibold"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {node.label}
      </text>

      {/* Sub label */}
      <text
        x={node.x + 32}
        y={node.y + 36}
        className="fill-muted-foreground text-[9px]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {node.sub}
      </text>

      {/* Processing pulse dot */}
      {node.status === "processing" && (
        <motion.circle
          cx={node.x + node.w - 11}
          cy={node.y + 11}
          r="3"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ fill: node.color }}
        />
      )}
    </motion.g>
  )
}

function SectionLabel({
  x, y, label, delay,
}: {
  x: number; y: number; label: string; delay: number
}) {
  return (
    <motion.text
      x={x}
      y={y}
      className="fill-muted-foreground text-[8px] uppercase tracking-[0.18em]"
      style={{ fontFamily: "var(--font-mono)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 }}
      transition={{ duration: 0.5, delay }}
    >
      {label}
    </motion.text>
  )
}

// ─── Root component ──────────────────────────────────────────────────────────

export function AgentOrchestrationDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <div className="relative w-full overflow-hidden">
      {/* Canvas particle layer – sits on top of the SVG */}
      <FlowCanvas nodes={NODES} edges={EDGES} />

      <svg
        viewBox={VIEWBOX}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <SectionLabel x={85}  y={24}  label="Input"   delay={0.1} />
        <SectionLabel x={628} y={8}   label="Context" delay={0.2} />
        <SectionLabel x={42}  y={158} label="Agents"  delay={0.3} />
        <SectionLabel x={42}  y={294} label="Outputs" delay={0.4} />

        {/* Edges */}
        <g>
          {EDGES.map((edge, i) => (
            <DataFlowEdge
              key={`${edge.from}-${edge.to}`}
              edge={edge}
              nodes={NODES}
              index={i}
              hoveredNode={hoveredNode}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {NODES.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              onHover={setHoveredNode}
              index={i}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export { AgentOrchestrationDiagram as SystemArchitectureDiagram }
