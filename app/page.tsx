"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

/**
 * Dynamically import heavy client-only components to avoid SSR errors.
 * Make sure Webcam and UploadVideo are pure client components (use navigator.mediaDevices or file inputs).
 */
// const Webcam = dynamic(() => import("./component/webcam"), { ssr: false });
const UploadVideo = dynamic(() => import("./component/UploadVideo"), { ssr: false });
const Campage = dynamic(() => import("./component/campage"), { ssr: false });

export default function Home() {
  let [livecam,setlivecam] = useState(false);
  let [uploadVideo,setuploadVideo] = useState(false); 
  let [start,setstart] = useState(true);

  return (
    <div className="flex bg-white h-screen w-screen p-3 gap-3">
      {/* Left pane */}
      <div className="h-full w-[50%] flex flex-col gap-3">
        {/* Top area: camp / webcam / upload */}
        <section className="h-[50%] rounded-xl p-3 flex justify-center items-start bg-linear-to-br from-blue-300 to-blue-500">
            {/* Main area */}
            <div className="h-full grow rounded-md bg-white/80 p-4 flex items-center justify-center">
              {start && <Campage setlivecam={setlivecam} setuploadVideo={setuploadVideo} setstart={setstart} />}
              {/* {livecam && <Webcam />} */}
              {uploadVideo && (
                <UploadVideo
                  setuploadVideo={setuploadVideo}
                  setstart={setstart}
                  onSelect={(file: File) => {
                    console.log("selected file:", file);
                    // optionally move to anatomy / analysis step
                  }}
                />
              )}
            </div>
        </section>

        {/* Bottom area: additional controls / info */}
        <section className="flex grow h-[50%] rounded-xl bg-pink-500 p-4">
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="rounded-lg bg-white/40 p-3">Stats / Controls</div>
            <div className="rounded-lg bg-white/40 p-3">Exercise timeline</div>
            <div className="rounded-lg bg-white/40 p-3">Tips / feedback</div>
          </div>
        </section>
      </div>

      {/* Right pane: anatomy / 3D model */}
      <aside className="grow rounded-xl p-3 flex items-center justify-center">
        {/* If you want to use the Sketchfab embed, use an iframe with proper camelCased props */}
        {/* Note: some attributes like 'allowFullScreen' should be camelCased in JSX */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-black">
          {/* Option A: Sketchfab iframe (works but limited control) */}
          <iframe
            title="Male Body 2 — Sketchfab"
            src="https://sketchfab.com/models/bf7eb5f7f2504f7bbdda4ab00a71e23c/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1&ui_hint=0"
            style={{ width: "100%", height: "100%", border: "0" }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            loading="lazy"
            referrerPolicy="no-referrer"
            // boolean props:
            allowFullScreen
          />
        </div>

        {/* Option B (preferred long-term): replace the iframe with your own Three.js / react-three-fiber glTF viewer
            — lets you programmatically highlight/ tint parts of the model.
            Example: import a glTF where each muscle group is a separate mesh and change material color on hover/selection.
        */}
      </aside>
    </div>
  );
}
