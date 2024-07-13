import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../Socket";
import peer from "../../service/peer.js";
import {
    CALLING,
    CALL_ACCEPTED,
    INCOMING_CALL,
    ROOM_JOINED,
} from "../../constants/events.js";

function VideoCall(props) {
    const socket = useSocket();

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [remoteSocketId, setRemoteSocketId] = useState(props.remoteSocketId);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const handleCallUser = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
        } catch (err) {
            console.error("Error getting user media:", err);
            // Handle the error appropriately
        }
    }, [remoteSocketId, socket]);

    const handleUserJoined = async ({ username, id }) => {
        // console.log(`Username ${username} joined room`);
        // setRemoteSocketId(id);
        // console.log("Setting local stream", localVideoRef.current);
        // const localStream = await navigator.mediaDevices.getUserMedia({
        //     video: true,
        //     audio: false,
        // });
        // setMyStream(localStream);
        // if (localVideoRef.current) {
        //     console.log("Setting local stream", localVideoRef.current);
        //     localVideoRef.current.srcObject = localStream;
        // }
        // const offer = await peer.getOffer();
        // socket.emit(CALLING, { to: remoteSocketId, offer });
    };

    /* create offer - discarded
        const createOffer = async () => {
            const connection = new RTCPeerConnection(servers);
            setPeerConnection(connection);

            const stream = new MediaStream();
            setRemoteStream(stream);

            myStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, myStream);
            });

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };

            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    client.sendMessageToPeer(
                        {
                            text: JSON.stringify({
                                type: "candidate",
                                candidate: event.candidate,
                            }),
                        },
                        MemberId
                    );
                }
            };

            let offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        };
    */

    const handleIncomingCall = async ({ from, offer }) => {
        // setRemoteSocketId(from);
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     video: true,
        //     audio: false,
        // });
        // setMyStream(stream);
        // console.log("Incoming Call", from, offer);
        // const ans = await peer.getAnswer(offer);
        // socket.emit(CALL_ACCEPTED, { to: from, ans });
    };

    const handleCallAccepted = async ({ from, ans }) => {
        // peer.setLocalDescription(ans);
        // console.log("Call Accepted!");
        // sendStreams();
    };

    useEffect(() => {
        // socket.on(ROOM_JOINED, handleUserJoined);
        // socket.on(INCOMING_CALL, handleIncomingCall);
        // socket.on(CALL_ACCEPTED, handleCallAccepted);

        return () => {
            // socket.off(ROOM_JOINED, handleUserJoined);
            // socket.off(INCOMING_CALL, handleIncomingCall);
            // socket.off(CALL_ACCEPTED, handleCallAccepted);
        };
    }, [socket]);

    return (
        <div className="flex flex-col h-full space-y-2 ">
            {/* Top Buttons */}
            <div className="flex justify-between w-full">
                <button className="bg-red-500 rounded m-1 p-2">Exit</button>
                <button className="bg-gray-600 rounded m-1 p-2">
                    Copy Room Id
                </button>
            </div>

            <div className="flex flex-col justify-center items-center flex-grow w-full">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    className="bg-black h-1/2 w-full p-1"
                ></video>
                <br />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="bg-black h-1/2 w-full p-1"
                ></video>
            </div>

            {/* <div>{myStream ? <ReactPlayer /> : <div>User</div>}</div>
            <div>Item 3</div> */}
            <div className="flex items-center justify-evenly w-full">
                <button className="bg-blue-500 rounded m-2 p-2">MIC</button>
                <button className="bg-blue-500 rounded m-2 p-2">CAMERA</button>
            </div>

            <button
                className="bg-gray-600 rounded m-2 p-2"
                onClick={handleCallUser}
            >
                Call
            </button>
        </div>
    );
}

export default VideoCall;

// return (
//     <div className="flex flex-col h-full justify-between items-center">
//         {/* Top Buttons */}
//         <div className="flex items-center justify-between w-full p-4">
//             <button className="bg-red-500 rounded m-2 p-2">Exit</button>
//             <button className="bg-gray-600 rounded m-2 p-2">
//                 Copy Room Id
//             </button>
//         </div>

//         {/* Middle Section */}
// <div className="flex flex-col justify-center items-center flex-grow w-full">
//     <div className="bg-blue-500 h-1/2 w-full m-2 p-2">User</div>
//     <div className="bg-blue-500 h-1/2 w-full m-2 p-2">User</div>
// </div>

//         {/* Bottom Buttons */}
//         <div className="flex items-center justify-between w-full p-4">
//             <button className="bg-blue-500 rounded m-2 p-2">MIC</button>
//             <button className="bg-blue-500 rounded m-2 p-2">CAMERA</button>
//         </div>
//     </div>
// );
