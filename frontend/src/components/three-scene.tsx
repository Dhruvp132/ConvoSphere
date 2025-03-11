import { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei'
import { Vector3 } from 'three'

interface AnimatedSphereProps {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}

function AnimatedSphere({ position, color, speed, distort }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.2
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial 
        color={color} 
        attach="material" 
        distort={distort} 
        speed={0.5} 
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Group>(null)
  const particles = Array.from({ length: count }, () => ({
    position: new Vector3(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    ),
    color: `hsl(${Math.random() * 360}, 70%, 70%)`,
    size: Math.random() * 0.05 + 0.03
  }))
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function ThreeScene() {
  return (
    <Canvas className="w-full h-full" camera={{ position: [0, 0, 6], fov: 75 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <AnimatedSphere position={[-2.5, 0, 0]} color="#ff6b6b" speed={0.5} distort={0.4} />
      <AnimatedSphere position={[2.5, 0, 0]} color="#4ecdc4" speed={0.7} distort={0.6} />
      
      <Particles count={150} />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  )
}
