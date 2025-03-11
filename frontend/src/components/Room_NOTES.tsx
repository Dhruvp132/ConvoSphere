/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        pcr: RTCPeerConnection;
    }
}

import { Socket, io } from "socket.io-client";

const URL = "http://localhost:3000";

export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack
}: {
    name: string,
    localAudioTrack: MediaStreamTrack | null,
    localVideoTrack: MediaStreamTrack | null,
}) => {
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState<null | Socket>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingUser, setReceivingUser] = useState<string | null>(null);
    const [, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = io(URL);
        setSocket(socket);

        socket.emit("join", {name});
        //============== VERY IMPORTANT =================
        // We will be needing two RTCPeerConnection 
        // so here when we see the code the first pc is for sending the offer in the Frontend you will see that 
        // so in both the browser this pc will send the offer 
        // and when you go down in the code you will see another pc connection being made that for receiving the offer
        // so in the first pc we will be sending the offer and in the second pc we will be receiving the offer

        // This is for tellin the server that both the parties should send their offer 
        // what this will do is it will emit offer from the both the parties 
        socket.on('send-offer', async ({roomId}) => {
            console.log("sending offer");
            setLobby(false);
            // this pc is for sending the offer party1 localDescription(sdp)
            const pc = new RTCPeerConnection();

            setSendingPc(pc);
            if (localVideoTrack) {
                console.error("added tack");
                console.log(localVideoTrack)
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                console.error("added tack");
                console.log(localAudioTrack)
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = async (e) => {
                console.log("receiving ice candidate locally");
                if (e.candidate) {
                   socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    type: "sender",
                    roomId
                   })
                }
            }

            pc.onnegotiationneeded = async () => {
                console.log("on negotiation neeeded, sending offer");
                const sdp = await pc.createOffer();
                //@ts-ignore
                pc.setLocalDescription(sdp)
                socket.emit("offer", {
                    sdp,
                    roomId
                })
            }

            pc.oniceconnectionstatechange = () => {
                console.log("ICE connection state:", pc.iceConnectionState);
            }
        });

        socket.on("offer", async ({roomId, sdp: remoteSdp}) => {
            console.log("received offer");
            setLobby(false);
            const pc = new RTCPeerConnection();
            // the line await was missing here which was causing the error as it is being settted before received
            await pc.setRemoteDescription(remoteSdp)
            const sdp = await pc.createAnswer();
            //@ts-ignore
            await pc.setLocalDescription(sdp)
            const stream = new MediaStream();
            // this condition means if not null or undefined then set 
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }

            setRemoteMediaStream(stream);
            // trickle ice 
            setReceivingPc(pc);
            window.pcr = pc;

            pc.ontrack = () => {
                console.log("ontrack event triggered");
                // const track = e.track;
                // console.log("Track kind:", track.kind);
                // if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                //     //@ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track);
                //     console.log("Track added to remote video element");
                // } else {
                //     console.error("Remote video element or srcObject is not set");
                // }
                // remoteVideoRef?.current?.play().catch(error => {
                //     console.error("Error playing remote video:", error);
                // });
            }

            // pc.ontrack = (e) => {
                // console.error("inside ontrack");
                // const {track, type} = e;
                // if (type == 'audio') {
                //     // setRemoteAudioTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // } else {
                //     // setRemoteVideoTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // }
                // //@ts-ignore
                // remoteVideoRef?.current?.play();
            // }

            pc.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return;
                }
                console.log("on ice candidate on receiving seide");
                if (e.candidate) {
                   socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    type: "receiver",
                    roomId
                   })
                }
            }

            socket.emit("answer", {
                roomId,
                sdp: sdp
            });
            
            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track
                const track2 = pc.getTransceivers()[1].receiver.track
                console.log(track1);
                if (track1.kind === "video") {
                    setRemoteAudioTrack(track2)
                    setRemoteVideoTrack(track1)
                } else {
                    setRemoteAudioTrack(track1)
                    setRemoteVideoTrack(track2)
                }
                //@ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track1)
                //@ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track2)
                //@ts-ignore
                remoteVideoRef.current.play();
                // if (type == 'audio') {
                //     // setRemoteAudioTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // } else {
                //     // setRemoteVideoTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // }
                // //@ts-ignore
                // remoteVideoRef?.current?.play();
            }, 2000)
        });

        socket.on("answer", ({ sdp: remoteSdp, sendingUser }) => {
            setLobby(false);
            setReceivingUser(sendingUser);
            console.log(sendingUser)
            setSendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp)
                return pc;
            });
            console.log("loop closed");
        })

        socket.on("lobby", () => {
            setLobby(true);
        })

        socket.on("add-ice-candidate", ({candidate, type}) => {
            console.log("add ice candidate from remote");
            console.log({candidate, type})
            if (type == "sender") {
                setReceivingPc(pc => {
                    if (!pc) {
                        console.error("receicng pc nout found")
                    } else {
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingPc(pc => {
                    if (!pc) {
                        console.error("sending pc nout found")
                    } else {
                        // console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        })

        setSocket(socket)
        //puttint the socket in the dependency array will coz re-rendering of the component
        // not the change logic the change logic will work anyways 
    }, [name, localAudioTrack, localVideoTrack])

    const handleChange = () => {
        if (sendingPc) {
            sendingPc.close();
            setSendingPc(null);
        }
        if (receivingPc) {
            receivingPc.close();
            setReceivingPc(null);
        }
        socket?.emit("change", {name});
    };

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef])

    return <div>
        {lobby ?  `Hi ${name}` : null} 
        <h1>
            You are connected{receivingUser === "randomName" ? "" : ` with ${receivingUser}`}, Say hi!
        </h1>
        <div className="flex flex-row "> 
           <div className="p-4">
                <video autoPlay width={600} height={600} ref={localVideoRef} />
            </div> 
            <div className="p-4">
                <video autoPlay width={600} height={600} ref={remoteVideoRef} />
            </div>
        </div>
        {lobby ? "Waiting to connect you to someone" : null}

        <button onClick={handleChange}>Change</button>
    </div>
}
