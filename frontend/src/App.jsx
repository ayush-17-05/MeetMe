import Call from "./components/Call/Call";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import VideoTest from "./components/VideoTest.jsx/VideoTest";

export default function App() {
  return (
    <div className="w-full h-screen bg-slate-900">
      <Router>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/call/:roomId" element={<Call />} />
          </Routes>
        </SocketProvider>
      </Router>
      {/* <VideoTest /> */}
    </div>
  );
}
