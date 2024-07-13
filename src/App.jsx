import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./Socket.jsx";
import MeetingRoom from "./components/MeetingRoom.jsx";
import Room from "./components/Room.jsx";
import Lobby from "./components/Lobby.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <SocketProvider>
            <Routes>
                <Route path="/" element={<Lobby />} />
                <Route path="/room/:roomId" element={<MeetingRoom />} />
            </Routes>
            <Toaster position="bottom-center" />
        </SocketProvider>
    );
};

export default App;
