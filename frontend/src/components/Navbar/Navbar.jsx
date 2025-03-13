import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    updateLoginState();

    window.addEventListener("storage", updateLoginState);

    return window.removeEventListener("storage", updateLoginState);
  });

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="text-white flex items-center justify-between h-16">
      <div>
        <h1 className="">MeetMe</h1>
      </div>
      <div>
        {isLoggedIn ? (
          <button className="rounded-sm bg-red-600 p-2">Logout</button>
        ) : (
          <button>
            <button
              onClick={handleLogin}
              className="rounded-sm bg-blue-600 p-2"
            >
              Login/Sign up
            </button>
          </button>
        )}
      </div>
    </div>
  );
}
