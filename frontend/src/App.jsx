import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MusicDetail from "./pages/MusicDetail.jsx";
import ArtistDashboard from "./pages/ArtistDashboard.jsx";
import UploadMusic from "./pages/UploadMusic.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3002", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // listen for the "play" event from the server
    newSocket.on("play", (data) => {
      const musicId = data.musicId;

      window.location.href = `/music/${musicId}`;
    })

    
  }, []);

  return (
    <div className="app-shell">
      <header className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/artist/dashboard">Artist Dashboard</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/music/:id" element={<MusicDetail />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route
            path="/artist/dashboard/upload-music"
            element={<UploadMusic />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
