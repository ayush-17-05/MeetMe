import { useEffect, useRef } from "react";

export default function Call() {
  const localVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices", error);
      });
  }, []);
  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      <video
        className="absolute left-0 top-0 h-full w-full object-cover"
        autoPlay
        playsInline
      />

      <video
        ref={localVideoRef}
        className="absolute bottom-5 right-5 h-32 w-32 rounded-lg border-2 border-gray-400 shadow-lg scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-4">
        <button className="rounded-full bg-gray-700 p-3 text-white transition hover:bg-gray-600">
          🎙️
        </button>
        <button className="rounded-full bg-gray-700 p-3 text-white transition hover:bg-gray-600">
          📽️
        </button>
        <button className="rounded-full bg-red-600 p-3 transition hover:bg-red-500">
          📞
        </button>
      </div>
    </div>
  );
}
