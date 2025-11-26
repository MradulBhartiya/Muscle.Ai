// src/components/RealisticAnatomy.tsx
"use client";

import React from "react";
import { exerciseMuscles, ExerciseKey, MuscleGroup } from "../config/exerciseMuscles";

type Props = {
  exercise: ExerciseKey;
};

const muscleImageMap: Record<MuscleGroup, string> = {
  chest: "/anatomy/chest.png",
  shoulders: "/anatomy/shoulders.png",
  triceps: "/anatomy/triceps.png",
  biceps: "/anatomy/biceps.png",
  back: "/anatomy/back.png",
  core: "/anatomy/core.png",
  quads: "/anatomy/quads.png",
  hamstrings: "/anatomy/hamstrings.png",
  glutes: "/anatomy/glutes.png",
  calves: "/anatomy/calves.png",
};

const RealisticAnatomy: React.FC<Props> = ({ exercise }) => {
  const config = exerciseMuscles[exercise];
  const allActive = [...config.primary, ...config.secondary];

  const isPrimary = (m: MuscleGroup) => config.primary.includes(m);
  const isSecondary = (m: MuscleGroup) => config.secondary.includes(m);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* LEFT: image stack */}
      <div className="relative w-56 aspect-[3/5]">
        {/* base grey anatomy */}
        <img
          src="/anatomy/msl.jpg"
          alt="Muscle anatomy"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* overlays for muscles */}
        {(Object.keys(muscleImageMap) as MuscleGroup[]).map((muscle) => {
          if (!allActive.includes(muscle)) return null;
          const opacity = isPrimary(muscle) ? 1 : 0.6;

          return (
            <img
              key={muscle}
              src={muscleImageMap[muscle]}
              alt={muscle}
              style={{ opacity }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          );
        })}
      </div>

      {/* RIGHT: labels */}
      <div className="space-y-2 max-w-xs">
        <h2 className="text-lg font-semibold capitalize">
          Muscles used – {exercise}
        </h2>
        <div>
          <p className="text-sm font-semibold">Primary (bright red)</p>
          <p className="text-sm">
            {config.primary.join(", ")}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Secondary (faded red)</p>
          <p className="text-sm">
            {config.secondary.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealisticAnatomy;