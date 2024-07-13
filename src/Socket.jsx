import React, { createContext, useMemo } from "react";
import { server } from "../constants/config";
import io from "socket.io-client";

const SocketContext = createContext();
const useSocket = () => React.useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(server, { withCredentials: true }), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, useSocket };
