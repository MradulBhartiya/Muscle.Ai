import type { Dispatch, SetStateAction } from "react";

export default function Campage({
  setlivecam,
  setuploadVideo,
  setstart,
}: {
  setlivecam: Dispatch<SetStateAction<boolean>>;
  setuploadVideo: Dispatch<SetStateAction<boolean>>;
  setstart: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="h-full w-full rounded-2xl flex justify-center items-center bg-gray-100 shadow-inner">
      <div className="text-black flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold tracking-wide">
          Live cam or Upload a video?
        </h1>

        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => {
              setlivecam(true);
              setuploadVideo(false); // turn upload off
              setstart(false);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
            >
            Live Cam
          </button>

          <button
            type="button"
            onClick={() => {
                setuploadVideo(true);
                setlivecam(false); // turn livecam off
                setstart(false);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
