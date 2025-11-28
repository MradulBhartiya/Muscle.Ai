"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

type MuscleId = string;        // or your union type

type MuscleAnatomyProps = {
  activeMuscles: MuscleId[];
};

/* ------------ MODEL ------------ */

function AnatomyModel({ activeMuscles }: { activeMuscles: string[] }) {
  const { scene } = useGLTF("/models/anatomy.glb") as unknown as {
    scene: THREE.Group;
  };

  useEffect(() => {
    console.log("---- GLB NODES ----");
    scene.traverse((node: any) => {
      if (node.isMesh) {
        console.log(node.name);
      }
    });
  }, [scene]);

  // 1) scale & position once
  useEffect(() => {
    scene.scale.set(0.4, 0.4, 0.4);        // bigger
    scene.position.set(0, -0.6, 0);   // lift body up into center
  }, [scene]);

  // 2) base white + highlight active muscles
  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;       // <-- casts shadow
        node.receiveShadow = true;    // <-- can receive shadow too

        const mat = node.material as THREE.MeshStandardMaterial | undefined;
        if (mat) {
          // remove original texture so color actually shows
          // @ts-ignore
          if (mat.map) mat.map = null;

          mat.color = new THREE.Color("#ffffff");    // pure white body
          mat.emissive = new THREE.Color("#000000");
          mat.roughness = 0.5;
          mat.metalness = 0;
        }
      }
    });

    // highlight selected muscles in red
    activeMuscles.forEach((name) => {
      const muscle = scene.getObjectByName(name);
      if (muscle && (muscle as any).material) {
        const mat = (muscle as any).material as THREE.MeshStandardMaterial;
        mat.color.set("#ff3333");
        mat.emissive.set("#551111");
        mat.roughness = 0.4;
      }
    });
  }, [activeMuscles, scene]);

  return <primitive object={scene} />;
}

/* ------------ MAIN COMPONENT ------------ */

export default function MuscleAnatomy({ activeMuscles }: { activeMuscles: string[] }) {
  return (
    <div className="w-full h-full">
      <Canvas className="rounded-xl"
        shadows                                      // <-- enable renderer shadows
        camera={{ position: [0, 1.4, 2.6], fov: 35 }} // closer & tighter
      >
        <color attach="background" args={["#e5e7eb"]} />

        <ambientLight intensity={0.7} />

        {/* main light that produces shadows */}
        <directionalLight
          castShadow                                  // <-- this light casts shadows
          position={[6, 8, 5]}
          intensity={1.4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-4, 4, 2]} intensity={0.5} />
        <directionalLight position={[0, 4, -4]} intensity={0.4} />

        <AnatomyModel activeMuscles={activeMuscles} />

        {/* HARD FLOOR that receives shadows */}
        <mesh
          receiveShadow                               // <-- floor receives shadows
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.9, 0]}                     // adjust slightly if feet clip
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e8e9eb" />
        </mesh>

        {/* SOFT CONTACT SHADOW for a nice glow under the feet */}
        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.4}
          width={12}
          height={12}
          blur={2.5}
          far={6}
          smooth
        />

        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.15}
          minDistance={2.2}
          maxDistance={3.6}
        />
      </Canvas>
    </div>
  );
}