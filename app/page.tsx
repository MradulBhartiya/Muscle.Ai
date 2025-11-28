"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, Activity } from "lucide-react"; // icons

import MuscleAnatomy from "./component/Muscleanatomy";

const Webcam = dynamic(() => import("./component/webcam"), { ssr: false });
const UploadVideo = dynamic(() => import("./component/UploadVideo"), {
  ssr: false,
});
const Campage = dynamic(() => import("./component/campage"), { ssr: false });

// main = live/upload flow
// userPose = user's pivot points
// proPose = professional pivot points
// accuracy = accuracy & feedback
type Panel = "main" | "userPose" | "proPose" | "accuracy";

export default function Home() {
  const activeMuscles = ["body_low__Body_Low_SP_blinn1SG1_0"];

  const [order, setOrder] = useState<Panel[]>([
    "main",
    "userPose",
    "proPose",
    "accuracy",
  ]);

  const [livecam, setlivecam] = useState(false);
  const [uploadVideo, setuploadVideo] = useState(false);
  const [start, setstart] = useState(true);

  // mock accuracy values for now
  const [repAccuracy] = useState(82);
  const [currentRep] = useState(5);
  const [totalReps] = useState(10);

  const handleSwap = (idx: number) => {
    if (idx === 0) return;
    setOrder((prev) => {
      const arr = [...prev];
      [arr[0], arr[idx]] = [arr[idx], arr[0]];
      return arr;
    });
  };

  const topPanel = order[0];
  const bottomPanels = order.slice(1);

  return (
    <div className="h-screen w-screen bg-linear-to-br from-slate-400 via-blue-400 to-teal-400 text-slate-900 antialiased px-4 py-3">
      <div className="h-full w-full flex gap-4">
        {/* LEFT COLUMN */}
        <div className="h-full w-[55%] flex flex-col gap-4">
          {/* TOP BIG PANEL */}
          <motion.section
            layout
            onClick={() => handleSwap(0)}
            className="h-[52%] rounded-3xl bg-linear-to-br from-blue-200 via-blue-300 to-teal-300 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.25)] cursor-pointer"
          >
            <motion.div
              layout
              className="h-full w-full rounded-3xl bg-white/95 p-2 flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {/* Key makes content cross-fade when top panel changes */}
                <motion.div
                  key={topPanel}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-full h-full flex flex-col"
                >
                  {/* MAIN: Live / Upload */}
                  {topPanel === "main" && (
                    <div className="w-full h-full flex items-center justify-center">
                      {start && (
                        <Campage
                          setlivecam={setlivecam}
                          setuploadVideo={setuploadVideo}
                          setstart={setstart}
                        />
                      )}
                      {livecam && <Webcam />}
                      {uploadVideo && (
                        <UploadVideo
                          setuploadVideo={setuploadVideo}
                          setstart={setstart}
                          onSelect={(file: File) => console.log("File:", file)}
                        />
                      )}
                    </div>
                  )}

                  {/* USER PIVOT POINTS */}
                  {topPanel === "userPose" && (
                    <>
                      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Your Pivot Points
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Live skeleton view generated from your movement.
                      </p>
                      <div className="mt-4 flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                        {/* TODO: Replace with your canvas for USER keypoints */}
                        User pivot points canvas goes here
                      </div>
                    </>
                  )}

                  {/* PRO PIVOT POINTS */}
                  {topPanel === "proPose" && (
                    <>
                      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Pro Pivot Points
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Reference skeleton from a professional performing the
                        same exercise.
                      </p>
                      <div className="mt-4 flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                        {/* TODO: Replace with your canvas for PRO keypoints */}
                        Professional pivot points canvas goes here
                      </div>
                    </>
                  )}

                  {/* ACCURACY & FEEDBACK */}
                  {topPanel === "accuracy" && (
                    <>
                      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Accuracy & Feedback
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Comparison between your pivot points and the
                        professional’s pose.
                      </p>

                      {/* Main accuracy row */}
                      <div className="mt-5 flex items-end gap-6">
                        <div>
                          <div className="text-4xl md:text-5xl font-bold text-emerald-500">
                            {repAccuracy}%
                          </div>
                          <div className="mt-1 text-xs md:text-sm text-slate-500">
                            Overall form accuracy
                          </div>
                        </div>
                        <div className="text-xs md:text-sm text-slate-500">
                          Rep {currentRep} of {totalReps}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${repAccuracy}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full bg-emerald-500"
                        />
                      </div>

                      {/* Joint-wise feedback cards */}
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm">
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                          <div className="font-semibold text-emerald-700">
                            Upper Body
                          </div>
                          <p className="mt-1 text-emerald-700/80">
                            Good shoulder and elbow alignment.
                          </p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-3 py-2">
                          <div className="font-semibold text-amber-700">
                            Core
                          </div>
                          <p className="mt-1 text-amber-700/80">
                            Slight hip drop. Keep your core tight and body
                            straight.
                          </p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-3 py-2">
                          <div className="font-semibold text-rose-700">
                            Lower Body
                          </div>
                          <p className="mt-1 text-rose-700/80">
                            Knees drifting forward. Push hips back more.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* BOTTOM 3 CARDS */}
          <motion.section
            layout
            className="h-[48%] rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] p-3"
          >
            <div className="grid grid-cols-3 gap-2 h-full">
              {bottomPanels.map((panel, idx) => (
                <motion.button
                  key={panel}
                  layout
                  onClick={() => handleSwap(idx + 1)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full rounded-2xl 
                             border border-teal-500/40 
                             bg-linear-to-b from-teal-200/80 via-teal-300 to-teal-400 
                             px-5 py-4 text-left 
                             text-teal-900 
                             shadow-[0_6px_20px_rgba(0,0,0,0.10)]
                             hover:border-teal-600/70
                             transition-all duration-300"
                >
                  {/* ICON + TITLE */}
                  <div className="flex items-center gap-2 mb-1">
                    {panel === "userPose" && (
                      <User className="w-4 h-4 md:w-5 md:h-5 text-teal-900/80" />
                    )}
                    {panel === "proPose" && (
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-teal-900/80" />
                    )}
                    {panel === "accuracy" && (
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-teal-900/80" />
                    )}
                    <span className="text-sm md:text-base font-semibold">
                      {panel === "userPose" && "Your Pivot Points"}
                      {panel === "proPose" && "Pro Pivot Points"}
                      {panel === "accuracy" && "Accuracy & Feedback"}
                    </span>
                  </div>

                  {/* SUBTEXT */}
                  <p className="mt-1 text-[11px] md:text-xs font-normal text-teal-900/70">
                    {panel === "userPose" && "Live skeleton from your movement."}
                    {panel === "proPose" &&
                      "Reference pose from a professional."}
                    {panel === "accuracy" &&
                      "Compare both and get AI form feedback."}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.section>
        </div>

        {/* RIGHT COLUMN – ANATOMY VIEW */}
        <motion.div
          layout
          className="h-full flex-1 rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.20)] p-4 flex flex-col"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Muscle Anatomy View
            </h2>
            <span className="text-[11px] text-slate-400">
              Hover & rotate to explore
            </span>
          </div>
          <div className="flex-1 rounded-2xl bg-slate-200/80 border border-slate-300/60 overflow-hidden">
            <MuscleAnatomy activeMuscles={activeMuscles} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}