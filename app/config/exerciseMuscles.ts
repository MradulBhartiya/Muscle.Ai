// src/config/exerciseMuscles.ts
export type MuscleGroup =
  | "chest"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "back"
  | "core"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves";

export type ExerciseKey = "pushup" | "squat" | "plank";

export const exerciseMuscles: Record<
  ExerciseKey,
  { primary: MuscleGroup[]; secondary: MuscleGroup[] }
> = {
  pushup: {
    primary: ["chest", "triceps", "shoulders"],
    secondary: ["core"],
  },
  squat: {
    primary: ["quads", "glutes"],
    secondary: ["hamstrings", "calves", "core"],
  },
  plank: {
    primary: ["core"],
    secondary: ["shoulders", "glutes"],
  },
};
