import { useEffect, useRef } from "react";

export default function VideoTest() {
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Try to play manually
          setTimeout(() => {
            videoRef.current
              .play()
              .then(() => console.log("✅ Local camera video is playing"))
              .catch((err) => console.error("⛔ Cannot play video:", err));
          }, 300);
        }
      } catch (err) {
        console.error("❌ Error accessing camera/mic:", err);
      }
    })();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-96 w-auto border border-white"
      />
    </div>
  );
}
