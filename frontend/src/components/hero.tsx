import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

function ConnectionSphere() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#4338ca"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>
      <mesh>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>
    </Float>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ConnectionSphere />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      <div ref={containerRef} className="container relative z-10 px-4 mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Connect. Converse. Grow.
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Engage in meaningful video conversations with people worldwide about life, career, and love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
              onClick={() => navigate("/room")}
            >
              Start Chatting Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg"
              onClick={() => {
                const featuresSection = document.getElementById("features")
                featuresSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-600"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

