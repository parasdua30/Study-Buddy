import React, { useCallback, useEffect, useState } from "react";
import VideoCall from "./VideoCall";
import CodeEditor from "./CodeEditor";
import WhiteBoard from "./WhiteBoard";
import Options from "./Options";
import { useSocket } from "../Socket";
import { useNavigate, useParams } from "react-router-dom";
import peer from "../../service/peer";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../redux/reducers/user";
// import { setRemoteSocketId } from "../redux/reducers/user";

function MeetingRoom() {
    const socket = useSocket();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState("whiteboard");
    const myName = useSelector((state) => state.user.username);
    const [message, setMessage] = useState("");

    // Connection Purposes
    // const remoteSocketId = useSelector((state) => state.user.remoteSocketId);
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleLeaveRoom = useCallback(() => {
        navigate("/");
    }, [navigate]);

    // Person who joined room
    const handleUserJoined = useCallback(({ username, id }) => {
        console.log(`User: ${username} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);

            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    // telling other person about what i am using.
    useEffect(() => {
        if (selectedOption === "whiteboard") {
            socket.emit("using:whiteboard", { fellowUsername: myName });
        } else if (selectedOption === "editor") {
            socket.emit("using:editor", { fellowUsername: myName });
        }
    }, [selectedOption]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener(
                "negotiationneeded",
                handleNegoNeeded
            );
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    const handleWhiteBoardIndicator = useCallback(({ fellowUsername }) => {
        setMessage(`${fellowUsername} is using whiteboard`);
        // socket.emit("using:whiteboard", { fellowUsername: myName });
    }, []);

    const handleEditorIndicator = useCallback(({ fellowUsername }) => {
        setMessage(`${fellowUsername} is using editor`);
        // socket.emit("using:editor", { fellowUsername: myName });
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        // whiteboard
        socket.on("fellow:using:whiteboard", handleWhiteBoardIndicator);
        socket.on("fellow:using:editor", handleEditorIndicator);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);

            // whiteboard
            socket.off("fellow:using:whiteboard", handleWhiteBoardIndicator);
            socket.off("fellow:using:editor", handleEditorIndicator);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="h-screen flex flex-row">
                {/* // Left Side */}
                <div className="bg-gray-800 h-5/5 w-1/5 rounded-lg border border-white text-white m-3">
                    <div className="flex flex-col h-full space-y-2 ">
                        {/* Top Buttons */}
                        <div className="flex justify-between w-full">
                            <button
                                className="bg-red-600 rounded m-1 p-2 transition-colors duration-300 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-white border border-white"
                                onClick={handleLeaveRoom}
                            >
                                Exit
                            </button>
                            <button
                                className="bg-gray-600 rounded m-1 p-2 transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white border border-white"
                                onClick={() =>
                                    navigator.clipboard.writeText(params.roomId)
                                }
                            >
                                Copy Room Id
                            </button>
                        </div>

                        {/* Video Call */}
                        <h4>
                            {remoteSocketId ? "Connected" : "No one in room"}
                        </h4>
                        {myStream && (
                            <button
                                className="bg-gray-600 rounded m-2 p-2"
                                onClick={sendStreams}
                            >
                                Send Video Stream
                            </button>
                        )}
                        {remoteSocketId && (
                            <button
                                className="bg-gray-600 rounded m-2 p-2"
                                onClick={handleCallUser}
                            >
                                CALL
                            </button>
                        )}

                        <div className="flex flex-col items-center justify-evenly w-full">
                            {myStream && (
                                <>
                                    <h1>My Stream</h1>
                                    <ReactPlayer
                                        playing
                                        // muted
                                        height="250px"
                                        width="250px"
                                        url={myStream}
                                        style={{ transform: "scaleX(-1)" }}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-center justify-evenly w-full">
                            {remoteStream && (
                                <>
                                    <h1>Remote Stream</h1>
                                    <ReactPlayer
                                        playing
                                        // muted
                                        height="250px"
                                        width="250px"
                                        url={remoteStream}
                                        style={{ transform: "scaleX(-1)" }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Bottom Options */}
                        {/* <div className="fixed bottom-0 left-0 p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.6)] ">
                            <Options
                                selectedOption={selectedOption}
                                onDataReceived={handleOptionClick}
                            />
                        </div> */}
                    </div>
                </div>

                {/* // Right Side */}

                {/* // Right Side */}
                {/* {selectedOption === "both" && (
                    <div className="w-4/5 flex flex-row">
                        <div className="bg-gray-800 w-1/2 rounded-lg border border-white text-white mt-3 mb-3 mr-3">
                            <Editor />
                        </div>
                        <div className="bg-gray-800 w-1/2 rounded-lg border border-white text-white mt-3 mb-3 mr-3">
                            <WhiteBoard />
                        </div>
                    </div>
                )} */}
                {selectedOption === "editor" && (
                    <div className="bg-gray-800 w-4/5 rounded-lg border border-white text-white mt-3 mb-3 mr-3 relative">
                        <CodeEditor />
                        {message && (
                            <div className="absolute bottom-2 right-2 text-white">
                                <p className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                                    {message}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {selectedOption === "whiteboard" && (
                    <div className="bg-gray-800 w-4/5 rounded-lg border border-white text-white mt-3 mb-3 mr-3 relative">
                        <WhiteBoard />
                        {message && (
                            <div className="absolute bottom-2 right-2 text-white">
                                <p className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                                    {message}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MeetingRoom;

// Right Side
// <div className="w-full h-full flex flex-col">
//     {/* // Options */}
//     <Options
//         selectedOption={selectedOption}
//         onDataReceived={handleOptionClick}
//     />

//     {/* // Right Side */}
//     {selectedOption === "both" && (
//         <div className="w-full h-full flex flex-row">
//             <div className="bg-gray-800 w-1/2 rounded-lg border border-white text-white mt-3 mb-3 mr-3">
//                 <Editor />
//             </div>
//             <div className="bg-gray-800 w-1/2 rounded-lg border border-white text-white mt-3 mb-3 mr-3">
//                 <WhiteBoard />
//             </div>
//         </div>
//     )}
//     {selectedOption === "editor" && (
//         <div className="bg-gray-800 w-full h-full rounded-lg border border-white text-white mt-3 mb-3 mr-3">
//             <Editor />
//         </div>
//     )}
//     {selectedOption === "whiteboard" && (
//         <div className="bg-gray-800 w-full h-full rounded-lg border border-white text-white mt-3 mb-3 mr-3">
//             <WhiteBoard />
//         </div>
//     )}
// </div>;
