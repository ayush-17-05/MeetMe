import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import peer from "../../service/peer";

export default function Call() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const toggleMic = () => {
    const audioTracks = localStreamRef.current?.getAudioTracks();
    if (audioTracks && audioTracks.length > 0) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      setMicOn(audioTracks[0].enabled);
    }
  };

  const toggleCam = () => {
    const videoTracks = localStreamRef.current?.getVideoTracks();
    if (videoTracks && videoTracks.length > 0) {
      videoTracks[0].enabled = !videoTracks[0].enabled;
      setCamOn(videoTracks[0].enabled);
    }
  };

  const socket = useSocket();

  // ✅ Assign remote stream to video element once
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, []);

  // ✅ Get local stream only once and add tracks
  useEffect(() => {
    (async () => {
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peer.peer.addTrack(track, stream);
        });
      }
    })();
  }, []);

  // ✅ Handle user joined
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`User with email: ${email} joined room. Socket ID: ${id}`);
    setRemoteSocketId(id);
  }, []);

  // ✅ Handle incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`📞 Incoming call from ${from}`);

      let stream = localStreamRef.current;

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }

      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans: answer });
    },
    [socket]
  );

  // ✅ Handle call accepted
  const handleCallAccepted = useCallback(async ({ ans }) => {
    console.log("✅ Call accepted");
    await peer.setRemoteAns(ans);
  }, []);

  // ✅ Handle incoming ICE candidates
  useEffect(() => {
    socket.on("ice:candidate", ({ candidate }) => {
      peer.addIceCandidate(candidate);
    });

    return () => {
      socket.off("ice:candidate");
    };
  }, [socket]);

  // ✅ Send ICE candidates
  useEffect(() => {
    peer.onIceCandidate((candidate) => {
      if (remoteSocketId) {
        socket.emit("ice:candidate", { to: remoteSocketId, candidate });
      }
    });
  }, [remoteSocketId, socket]);

  // ✅ Handle remote track
  useEffect(() => {
    peer.onTrack((event) => {
      console.log("📡 onTrack event fired");

      const incomingStream = event.streams[0];
      const tracks = incomingStream?.getTracks() || [event.track];

      tracks.forEach((track) => {
        console.log("➕ Adding remote track:", track);
        remoteStreamRef.current.addTrack(track);
      });

      // Force play in case autoplay doesn't work
      setTimeout(() => {
        remoteVideoRef.current
          ?.play()
          .catch((err) =>
            console.error("🔴 Error playing remote video:", err.message)
          );
      }, 300);
    });
  }, []);

  // ✅ Set up socket listeners
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  // ✅ Make call once remote ID is known
  useEffect(() => {
    if (remoteSocketId && localStreamRef.current) {
      (async () => {
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
      })();
    }
  }, [remoteSocketId, socket]);

  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        className="absolute left-0 top-0 h-full w-full object-cover bg-black"
        autoPlay
        playsInline
      />

      {/* Local Video */}
      <video
        ref={localVideoRef}
        className="absolute bottom-5 right-5 h-32 w-32 rounded-lg border-2 border-gray-400 shadow-lg scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />

      {/* Controls */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-4">
        <button
          onClick={toggleMic}
          className="rounded-full bg-gray-700 p-3 text-white transition hover:bg-gray-600"
        >
          {micOn ? "🎙️" : "🔇"}
        </button>
        <button
          onClick={toggleCam}
          className="rounded-full bg-gray-700 p-3 text-white transition hover:bg-gray-600"
        >
          {camOn ? "📷" : "🚫"}
        </button>
        <button className="rounded-full bg-red-600 p-3 transition hover:bg-red-500">
          📞
        </button>
      </div>
    </div>
  );
}
