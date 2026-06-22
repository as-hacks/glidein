import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const PaperPlane = () => {
  const groupRef = useRef();
  const animGroupRef = useRef();

  const planeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Left wing
      0, 0, 2,     // Nose
      -1.5, 0.5, -2, // Left tail tip
      0, -0.5, -1, // Bottom center back
      
      // Right wing
      0, 0, 2,     // Nose
      0, -0.5, -1, // Bottom center back
      1.5, 0.5, -2,  // Right tail tip

      // Left inner fold
      0, 0, 2,     // Nose
      0, -0.5, -1, // Bottom center back
      0, 0.8, -1.8,  // Top center back

      // Right inner fold
      0, 0, 2,     // Nose
      0, 0.8, -1.8,  // Top center back
      0, -0.5, -1, // Bottom center back
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useEffect(() => {
    if (!animGroupRef.current) return;
    
    // Intro sequence: Start massive, covering screen, and fly away into position
    // Camera is at [0, 0, 8]. We start at z=6.5, very close.
    gsap.fromTo(animGroupRef.current.position, 
      { z: 7, x: -1, y: 0 }, 
      { z: 0, x: 0, y: 0, duration: 2.5, ease: 'power4.inOut' }
    );
    
    gsap.fromTo(animGroupRef.current.rotation, 
      { y: Math.PI / 1.5, x: -Math.PI / 3, z: Math.PI / 2 }, 
      { y: 0, x: 0, z: 0, duration: 2.5, ease: 'power4.inOut' }
    );
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Dynamic flying path: bobbing, swaying, banking (continuous loop)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.4; 
      groupRef.current.position.x = Math.sin(t * 0.8) * 1.2;     
      
      groupRef.current.rotation.z = Math.sin(t * 0.8) * -0.4; 
      groupRef.current.rotation.x = Math.cos(t * 1.5) * 0.15; 
    }
  });

  return (
    <group ref={animGroupRef}>
      <group ref={groupRef}>
        <mesh geometry={planeGeometry} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#ffffff" 
            side={THREE.DoubleSide} 
            roughness={0.1} 
            metalness={0.2} 
          />
        </mesh>
      </group>
    </group>
  );
};

export default PaperPlane;
