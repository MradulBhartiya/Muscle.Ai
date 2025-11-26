'use client'
import { useEffect, useRef } from 'react';

export default function Webcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    }
  }, []);

  return (
    <div className="w-full h-full overflow-hidden rounded-xl bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
