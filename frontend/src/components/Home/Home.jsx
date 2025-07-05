import { useCallback, useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const email = localStorage.getItem("email");
  const socket = useSocket();
  const navigate = useNavigate();
  // console.log(socket);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // console.log("RoomID:", roomId);
      // console.log("Email:", email);
      socket.emit("room:join", { email, roomId });
    },
    [roomId, email, socket]
  );

  const handleJoinRoom = useCallback((data) => {
    const { email, roomId } = data;
    // console.log(email, roomId);
    navigate(`/call/${roomId}`);
  }, []);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="">
      <Navbar />
      <hr className="border-gray-400" />
      <div className="flex">
        <form onSubmit={handleSubmit} className="bg-red-500 w-3/5">
          <h1>JOIN A MEETING ROOM</h1>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <br />
          <button>Join</button>
        </form>
        <div className="bg-blue-500 w-2/5">
          <h1>CREATE A MEETING ROOM</h1>
          <button className="bg-white">Create</button>
        </div>
      </div>
    </div>
  );
}
