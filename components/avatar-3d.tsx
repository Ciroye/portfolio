"use client"

import { useRef, useState, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Sphere, RoundedBox, ContactShadows } from "@react-three/drei"
import { Physics, RigidBody, BallCollider, CuboidCollider } from "@react-three/rapier"
import type { Group, Mesh } from "three"
import type { RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

interface AvatarProps {
  isKicking: boolean
  onKickComplete: () => void
}

function AvatarCharacter({ isKicking, onKickComplete }: AvatarProps) {
  const groupRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftEyeRef = useRef<Group>(null)
  const rightEyeRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const kickProgress = useRef(0)

  const blinkState = useRef({ nextBlinkAt: 3, blinkStartedAt: -1 })

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Subtle body sway
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.005
    }

    // Head movement - looking around naturally
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.25) * 0.04
      headRef.current.rotation.x = Math.sin(t * 0.4) * 0.02
    }

    // Kick animation when triggered
    if (rightLegRef.current) {
      if (isKicking) {
        kickProgress.current += 0.08
        if (kickProgress.current < 0.3) {
          // Wind back
          rightLegRef.current.rotation.x = kickProgress.current * 1.2
        } else if (kickProgress.current < 0.6) {
          // Swing forward fast
          const p = (kickProgress.current - 0.3) / 0.3
          rightLegRef.current.rotation.x = 0.36 - p * 1.8
        } else if (kickProgress.current < 1.0) {
          // Return to rest
          const p = (kickProgress.current - 0.6) / 0.4
          rightLegRef.current.rotation.x = -1.44 + p * 1.44
        } else {
          rightLegRef.current.rotation.x = 0
          kickProgress.current = 0
          onKickComplete()
        }
      } else {
        // Idle leg movement
        rightLegRef.current.rotation.x = Math.sin(t * 0.5) * 0.02
      }
    }

    // Blinking
    const blink = blinkState.current
    if (blink.blinkStartedAt < 0 && t >= blink.nextBlinkAt) {
      blink.blinkStartedAt = t
    }
    if (blink.blinkStartedAt >= 0) {
      const progress = (t - blink.blinkStartedAt) / 0.12
      let scaleY: number
      if (progress < 0.5) {
        scaleY = 1 - progress * 2 * 0.92
      } else if (progress < 1) {
        scaleY = 0.08 + (progress - 0.5) * 2 * 0.92
      } else {
        scaleY = 1
        blink.blinkStartedAt = -1
        blink.nextBlinkAt = t + 2 + Math.random() * 3
      }
      if (leftEyeRef.current) leftEyeRef.current.scale.y = scaleY
      if (rightEyeRef.current) rightEyeRef.current.scale.y = scaleY
    }
  })

  // Colors matching your appearance
  const skinColor = "#e8b89d"
  const skinColorDark = "#d4a088"
  const hairColor = "#1a0a05"
  const hairHighlight = "#2a1510"
  const shirtColor = "#2d3748"
  const pantsColor = "#1a202c"
  const eyeColor = "#3d2414"
  const stubbleColor = "#1a0a05"

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* ── Torso ── */}
      <RoundedBox args={[0.9, 1.0, 0.48]} radius={0.2} position={[0, 0, 0]}>
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </RoundedBox>

      {/* Collar detail */}
      <mesh position={[0, 0.45, 0.18]}>
        <torusGeometry args={[0.15, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.16, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>

      {/* ── Head ── */}
      <group ref={headRef} position={[0, 1.08, 0]}>
        {/* Main head shape - slightly more angular/masculine */}
        <Sphere args={[0.44, 64, 64]}>
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </Sphere>

        {/* Jawline - more defined */}
        <mesh position={[0, -0.18, 0.06]}>
          <boxGeometry args={[0.52, 0.24, 0.38]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>

        {/* Chin */}
        <Sphere args={[0.18, 32, 32]} position={[0, -0.26, 0.12]}>
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </Sphere>

        {/* Cheekbones */}
        <Sphere args={[0.12, 24, 24]} position={[-0.28, -0.02, 0.18]}>
          <meshStandardMaterial color={skinColorDark} roughness={0.4} />
        </Sphere>
        <Sphere args={[0.12, 24, 24]} position={[0.28, -0.02, 0.18]}>
          <meshStandardMaterial color={skinColorDark} roughness={0.4} />
        </Sphere>

        {/* ── Hair — styled swept to the side ── */}
        {/* Base hair cap */}
        <mesh position={[0, 0.14, -0.02]}>
          <sphereGeometry args={[0.45, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>

        {/* Main volume — swept right with height */}
        <mesh position={[0.08, 0.32, 0.1]} rotation={[0.15, -0.2, -0.25]}>
          <capsuleGeometry args={[0.22, 0.22, 16, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.92} />
        </mesh>

        {/* Front sweep - prominent */}
        <mesh position={[0.18, 0.28, 0.22]} rotation={[0.35, -0.25, -0.4]}>
          <capsuleGeometry args={[0.12, 0.18, 12, 20]} />
          <meshStandardMaterial color={hairHighlight} roughness={0.9} />
        </mesh>

        {/* Top accent layer */}
        <mesh position={[-0.02, 0.38, 0.08]} rotation={[0.08, 0.05, 0.1]}>
          <capsuleGeometry args={[0.1, 0.16, 10, 18]} />
          <meshStandardMaterial color={hairHighlight} roughness={0.9} />
        </mesh>

        {/* Secondary sweep strand */}
        <mesh position={[0.22, 0.32, 0.15]} rotation={[0.2, -0.15, -0.32]}>
          <capsuleGeometry args={[0.08, 0.12, 10, 16]} />
          <meshStandardMaterial color={hairHighlight} roughness={0.88} />
        </mesh>

        {/* Side fade left - short */}
        <mesh position={[-0.34, 0.08, 0.04]} rotation={[0, 0.1, 0.5]}>
          <capsuleGeometry args={[0.1, 0.08, 10, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>

        {/* Side fade right - short */}
        <mesh position={[0.36, 0.08, 0.02]} rotation={[0, -0.1, -0.35]}>
          <capsuleGeometry args={[0.1, 0.06, 10, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>

        {/* Back coverage */}
        <mesh position={[0, 0.08, -0.2]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[0.42, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>

        {/* ── Eyes — more detailed ── */}
        <group position={[0, 0.06, 0.36]}>
          {/* Left eye */}
          <group ref={leftEyeRef} position={[-0.13, 0, 0]}>
            {/* Eye socket shadow */}
            <Sphere args={[0.075, 24, 24]} position={[0, 0, -0.02]}>
              <meshStandardMaterial color={skinColorDark} roughness={0.5} />
            </Sphere>
            <Sphere args={[0.065, 32, 32]}>
              <meshStandardMaterial color="#fafafa" roughness={0.1} />
            </Sphere>
            <Sphere args={[0.042, 24, 24]} position={[0, 0, 0.038]}>
              <meshStandardMaterial color={eyeColor} roughness={0.15} />
            </Sphere>
            <Sphere args={[0.024, 20, 20]} position={[0, 0, 0.055]}>
              <meshStandardMaterial color="#0a0a0a" roughness={0.02} />
            </Sphere>
            {/* Highlight */}
            <Sphere args={[0.01, 12, 12]} position={[0.018, 0.018, 0.065]}>
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
            </Sphere>
          </group>

          {/* Right eye */}
          <group ref={rightEyeRef} position={[0.13, 0, 0]}>
            <Sphere args={[0.075, 24, 24]} position={[0, 0, -0.02]}>
              <meshStandardMaterial color={skinColorDark} roughness={0.5} />
            </Sphere>
            <Sphere args={[0.065, 32, 32]}>
              <meshStandardMaterial color="#fafafa" roughness={0.1} />
            </Sphere>
            <Sphere args={[0.042, 24, 24]} position={[0, 0, 0.038]}>
              <meshStandardMaterial color={eyeColor} roughness={0.15} />
            </Sphere>
            <Sphere args={[0.024, 20, 20]} position={[0, 0, 0.055]}>
              <meshStandardMaterial color="#0a0a0a" roughness={0.02} />
            </Sphere>
            <Sphere args={[0.01, 12, 12]} position={[0.018, 0.018, 0.065]}>
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
            </Sphere>
          </group>
        </group>

        {/* Eyebrows - thicker and more defined */}
        <RoundedBox args={[0.13, 0.032, 0.018]} radius={0.008} position={[-0.13, 0.18, 0.38]} rotation={[0, 0, 0.08]}>
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.13, 0.032, 0.018]} radius={0.008} position={[0.13, 0.18, 0.38]} rotation={[0, 0, -0.08]}>
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </RoundedBox>

        {/* Nose - more defined bridge */}
        <mesh position={[0, -0.02, 0.4]}>
          <capsuleGeometry args={[0.025, 0.08, 12, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
        <Sphere args={[0.04, 24, 24]} position={[0, -0.08, 0.42]}>
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </Sphere>

        {/* Subtle smile */}
        <mesh position={[0, -0.16, 0.4]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.055, 0.012, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#c49080" roughness={0.5} />
        </mesh>

        {/* Facial hair - goatee/stubble area */}
        <mesh position={[0, -0.24, 0.28]}>
          <sphereGeometry args={[0.1, 32, 32, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.55]} />
          <meshStandardMaterial color={stubbleColor} roughness={0.98} transparent opacity={0.4} />
        </mesh>

        {/* Mustache area */}
        <RoundedBox args={[0.14, 0.025, 0.015]} radius={0.008} position={[0, -0.12, 0.4]} rotation={[0.25, 0, 0]}>
          <meshStandardMaterial color={stubbleColor} roughness={0.98} transparent opacity={0.35} />
        </RoundedBox>

        {/* Soul patch */}
        <mesh position={[0, -0.22, 0.36]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={stubbleColor} roughness={0.98} transparent opacity={0.45} />
        </mesh>

        {/* Left ear + earring */}
        <group position={[-0.44, 0.02, 0]}>
          <Sphere args={[0.075, 24, 24]}>
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </Sphere>
          {/* Silver stud earring */}
          <Sphere args={[0.025, 16, 16]} position={[0, -0.06, 0.02]}>
            <meshStandardMaterial color="#e8e8e8" metalness={0.98} roughness={0.02} />
          </Sphere>
        </group>

        {/* Right ear */}
        <Sphere args={[0.075, 24, 24]} position={[0.44, 0.02, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </Sphere>
      </group>

      {/* ── Arms ── */}
      {/* Left arm */}
      <group position={[-0.55, 0.08, 0]} rotation={[0.05, 0, 0.12]}>
        <RoundedBox args={[0.22, 0.6, 0.22]} radius={0.09} position={[0, -0.25, 0]}>
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </RoundedBox>
        {/* Hand */}
        <Sphere args={[0.09, 20, 20]} position={[0, -0.58, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </Sphere>
      </group>

      {/* Right arm */}
      <group position={[0.55, 0.08, 0]} rotation={[0.05, 0, -0.12]}>
        <RoundedBox args={[0.22, 0.6, 0.22]} radius={0.09} position={[0, -0.25, 0]}>
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </RoundedBox>
        <Sphere args={[0.09, 20, 20]} position={[0, -0.58, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </Sphere>
      </group>

      {/* ── Legs ── */}
      {/* Left leg — planted */}
      <group position={[-0.2, -0.62, 0]}>
        <RoundedBox args={[0.26, 0.7, 0.26]} radius={0.1} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={pantsColor} roughness={0.75} />
        </RoundedBox>
        {/* Shoe */}
        <RoundedBox args={[0.22, 0.12, 0.34]} radius={0.05} position={[0, -0.7, 0.05]}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </RoundedBox>
      </group>

      {/* Right leg — kicking (pivots at hip) */}
      <group ref={rightLegRef} position={[0.2, -0.62, 0]}>
        <RoundedBox args={[0.26, 0.7, 0.26]} radius={0.1} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={pantsColor} roughness={0.75} />
        </RoundedBox>
        <RoundedBox args={[0.22, 0.12, 0.34]} radius={0.05} position={[0, -0.7, 0.05]}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </RoundedBox>
      </group>
    </group>
  )
}

interface SoccerBallProps {
  ballRef: React.RefObject<RapierRigidBody | null>
}

function SoccerBall({ ballRef }: SoccerBallProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (ballRef.current && meshRef.current) {
      const pos = ballRef.current.translation()
      const rot = ballRef.current.rotation()
      meshRef.current.position.set(pos.x, pos.y, pos.z)
      meshRef.current.quaternion.set(rot.x, rot.y, rot.z, rot.w)
    }
  })

  return (
    <>
      <RigidBody
        ref={ballRef}
        position={[0.6, -0.85, 0.5]}
        colliders={false}
        restitution={0.7}
        friction={0.8}
        linearDamping={0.5}
        angularDamping={0.3}
      >
        <BallCollider args={[0.14]} />
      </RigidBody>

      <group ref={meshRef}>
        {/* Main ball */}
        <Sphere args={[0.14, 48, 48]}>
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </Sphere>
        {/* Pentagon pattern */}
        <mesh>
          <icosahedronGeometry args={[0.145, 0]} />
          <meshStandardMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
        </mesh>
      </group>
    </>
  )
}

function Ground() {
  return (
    <RigidBody type="fixed" position={[0, -1.7, 0]}>
      <CuboidCollider args={[10, 0.1, 10]} />
    </RigidBody>
  )
}

function Walls() {
  return (
    <>
      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 0, -3]}>
        <CuboidCollider args={[10, 10, 0.1]} />
      </RigidBody>
      {/* Front wall (invisible, just stops ball) */}
      <RigidBody type="fixed" position={[0, 0, 4]}>
        <CuboidCollider args={[10, 10, 0.1]} />
      </RigidBody>
      {/* Left wall */}
      <RigidBody type="fixed" position={[-5, 0, 0]}>
        <CuboidCollider args={[0.1, 10, 10]} />
      </RigidBody>
      {/* Right wall */}
      <RigidBody type="fixed" position={[5, 0, 0]}>
        <CuboidCollider args={[0.1, 10, 10]} />
      </RigidBody>
    </>
  )
}

interface SceneProps {
  isKicking: boolean
  onKickComplete: () => void
  ballRef: React.RefObject<RapierRigidBody | null>
}

function Scene({ isKicking, onKickComplete, ballRef }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 4, 2]} intensity={0.4} color="#b8d4e8" />
      <pointLight position={[0, 3, 4]} intensity={0.5} color="#f0f0ff" />

      <Physics gravity={[0, -9.81, 0]}>
        <AvatarCharacter isKicking={isKicking} onKickComplete={onKickComplete} />
        <SoccerBall ballRef={ballRef} />
        <Ground />
        <Walls />
      </Physics>

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.5}
        scale={8}
        blur={2}
        far={4}
      />

      <Environment preset="studio" />
    </>
  )
}

export function InteractiveAvatar() {
  const [isKicking, setIsKicking] = useState(false)
  const ballRef = useRef<RapierRigidBody>(null)

  const handleKick = useCallback(() => {
    if (isKicking) return

    setIsKicking(true)

    // Apply impulse to ball after kick animation winds up
    setTimeout(() => {
      if (ballRef.current) {
        // Random direction with upward arc
        const xForce = 2 + Math.random() * 3
        const yForce = 4 + Math.random() * 2
        const zForce = (Math.random() - 0.5) * 2

        ballRef.current.applyImpulse({ x: xForce, y: yForce, z: zForce }, true)
        ballRef.current.applyTorqueImpulse({ x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 }, true)
      }
    }, 280)
  }, [isKicking])

  const handleKickComplete = useCallback(() => {
    setIsKicking(false)
  }, [])

  const resetBall = useCallback(() => {
    if (ballRef.current) {
      ballRef.current.setTranslation({ x: 0.6, y: -0.85, z: 0.5 }, true)
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
  }, [])

  return (
    <div className="relative h-full min-h-[400px] w-full bg-gradient-to-b from-slate-100 to-slate-200">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onClick={handleKick}
        onKeyDown={(e) => {
          if (e.code === 'Space') {
            e.preventDefault()
            handleKick()
          }
        }}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene isKicking={isKicking} onKickComplete={handleKickComplete} ballRef={ballRef} />
        </Suspense>
      </Canvas>

      {/* UI Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={handleKick}
          disabled={isKicking}
          className="rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
        >
          ⚽ Kick Ball
        </button>
        <button
          onClick={resetBall}
          className="rounded-full bg-secondary px-6 py-4 text-lg font-semibold text-secondary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          Reset Ball
        </button>
      </div>

      {/* Instructions overlay */}
      <div className="absolute left-8 top-8 rounded-xl bg-background/80 p-4 shadow-lg backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-bold text-foreground">Controls</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Click anywhere to kick</li>
          <li>• Press SPACE to kick</li>
          <li>• Drag to rotate view</li>
          <li>• Scroll to zoom</li>
        </ul>
      </div>
    </div>
  )
}
