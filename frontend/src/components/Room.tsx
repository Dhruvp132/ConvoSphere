/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react"
import { Button } from "../components/ui/button"
// import { Card } from "../components/ui/card"
// import { Mic, MicOff, Phone, Video, VideoOff, UserPlus, AArrowDown } from 'lucide-react'
// import { MicIcon, MicOffIcon, PhoneIcon, VideoIcon, VideoOffIcon, UserPlusIcon, ArrowDownIcon, LoaderCircle, Mic, MicOff } from 'lucide-react'
import { type Socket, io } from "socket.io-client"


declare global {
  interface Window {
    pcr: RTCPeerConnection
  }
}

const URL = "http://localhost:3000"

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string
  localAudioTrack: MediaStreamTrack | null
  localVideoTrack: MediaStreamTrack | null
}) => {
  const [lobby, setLobby] = useState(true)
  const [socket, setSocket] = useState<null | Socket>(null)
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null)
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null)
  const [receivingUser, setReceivingUser] = useState<string | null>(null)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null)
  const [, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null)
  const [, setRemoteMediaStream] = useState<MediaStream | null>(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // Use HTMLVideoElement for proper typing
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const socket = io(URL)
    setSocket(socket)

    socket.emit("join", { name })

    socket.on("send-offer", async ({ roomId }) => {
      console.log("sending offer")
      setLobby(false)
      // this pc is for sending the offer party1 localDescription(sdp)
      const pc = new RTCPeerConnection()

      setSendingPc(pc)
      if (localVideoTrack) {
        console.error("added track")
        console.log(localVideoTrack)
        pc.addTrack(localVideoTrack)
      }
      if (localAudioTrack) {
        console.error("added track")
        console.log(localAudioTrack)
        pc.addTrack(localAudioTrack)
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally")
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          })
        }
      }

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation needed, sending offer")
        const sdp = await pc.createOffer()
        //@ts-ignore
        pc.setLocalDescription(sdp)
        socket.emit("offer", {
          sdp,
          roomId,
        })
      }

      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState)
      }
    })

    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      console.log("received offer")
      setLobby(false)
      const pc = new RTCPeerConnection()
      // the line await was missing here which was causing the error as it is being settted before received
      await pc.setRemoteDescription(remoteSdp)
      const sdp = await pc.createAnswer()
      //@ts-ignore
      await pc.setLocalDescription(sdp)
      const stream = new MediaStream()
      // this condition means if not null or undefined then set
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }

      setRemoteMediaStream(stream)
      // trickle ice
      setReceivingPc(pc)
      window.pcr = pc

      pc.ontrack = () => {
        console.log("ontrack event triggered")
      }

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return
        }
        console.log("on ice candidate on receiving side")
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "receiver",
            roomId,
          })
        }
      }

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      })

      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track
        const track2 = pc.getTransceivers()[1].receiver.track
        console.log(track1)
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
        remoteVideoRef.current.play()
      }, 2000)
    })

    socket.on("answer", ({ sdp: remoteSdp, sendingUser }) => {
      setLobby(false)
      setReceivingUser(sendingUser)
      console.log(sendingUser)
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp)
        return pc
      })
      console.log("loop closed")
    })

    socket.on("lobby", () => {
      setLobby(true)
    })

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate from remote")
      console.log({ candidate, type })
      if (type == "sender") {
        setReceivingPc((pc) => {
          if (!pc) {
            console.error("receiving pc not found")
          } else {
            console.error(pc.ontrack)
          }
          pc?.addIceCandidate(candidate)
          return pc
        })
      } else {
        setSendingPc((pc) => {
          if (!pc) {
            console.error("sending pc not found")
          } else {
            // console.error(pc.ontrack)
          }
          pc?.addIceCandidate(candidate)
          return pc
        })
      }
    })

    setSocket(socket)

    // Cleanup function
    return () => {
      socket.disconnect()
      if (sendingPc) {
        sendingPc.close()
      }
      if (receivingPc) {
        receivingPc.close()
      }
    }
  }, [name, localAudioTrack, localVideoTrack])

  const handleChange = () => {
    setIsChanging(true)
    if (sendingPc) {
      sendingPc.close()
      setSendingPc(null)
    }
    if (receivingPc) {
      receivingPc.close()
      setReceivingPc(null)
    }
    socket?.emit("change", { name })
    setTimeout(() => {
      setIsChanging(false)
    }, 1000)
  }

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.enabled = !localAudioTrack.enabled
      setIsAudioMuted(!localAudioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.enabled = !localVideoTrack.enabled
      setIsVideoOff(!localVideoTrack.enabled)
    }
  }

  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      localVideoRef.current.srcObject = new MediaStream([localVideoTrack])
      localVideoRef.current.play().catch((err) => console.error("Error playing local video:", err))
    }
  }, [localVideoRef, localVideoTrack])

  return (
    <div className="min-h-screen bg-white flex flex-col">
        {/* Main content area */}
        <div className="flex-1 p-4 relative">
            {/* Status message */}
            {lobby && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center p-6 rounded-xl bg-white shadow-xl border border-indigo-100">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Finding someone for you...</h2>
                        <p className="text-indigo-500">We're connecting you with someone interesting to chat with</p>
                    </div>
                </div>
            )}
            
            {isChanging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center p-6 rounded-xl bg-white shadow-xl border border-indigo-100">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Finding a new match...</h2>
                        <p className="text-indigo-500">We're connecting you with someone else</p>
                    </div>
                </div>
            )}
            
            {/* Video container - 50/50 split */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Remote video */}
                <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden">
                    <video 
                        ref={remoteVideoRef} 
                        className="w-full h-[600px] object-cover"
                        playsInline
                    ></video>
                    {receivingUser && (
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg">
                            {receivingUser === "randomName" ? "Anonymous" : receivingUser}
                        </div>
                    )}
                    
                    {!lobby && !remoteVideoTrack && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <p className="text-indigo-600 text-xl">Connecting video...</p>
                        </div>
                    )}
                </div>
                
                {/* Local video */}
                <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden">
                    <video 
                        ref={localVideoRef} 
                        className="w-full h-[600px] object-cover"
                        muted
                        playsInline
                    ></video>
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg">
                        {name || "You"}
                    </div>
                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                            <p className="text-indigo-600 font-medium">Camera Off</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Connection status */}
        {!lobby && receivingUser && (
            <div className="bg-indigo-50 py-2 px-4 text-center">
                <p className="text-indigo-600 font-medium">
                    Connected with {receivingUser === "randomName" ? "Anonymous" : receivingUser}
                </p>
            </div>
        )}
        
        {/* Controls */}
        <div className="bg-white p-4 border-t border-gray-100 shadow-sm">
            <div className="flex justify-center gap-4">
            <Button 
                onClick={toggleAudio} 
                variant={isAudioMuted ? "destructive" : "outline"}
                size="lg"
                className={`rounded-full h-14 w-14 flex items-center justify-center ${!isAudioMuted ? "border-indigo-600 text-indigo-600" : ""}`}
            >
                {/* {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />} */}
                Mic
            </Button>

            <Button 
                onClick={toggleVideo} 
                variant={isVideoOff ? "destructive" : "outline"}
                size="lg"
                className={`rounded-full h-14 w-14 flex items-center justify-center ${!isVideoOff ? "border-indigo-600 text-indigo-600" : ""}`}
            >
                {/* {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />} */}
                Cam
            </Button>

            <Button 
                onClick={handleChange}
                variant="default"
                size="lg"
                className="rounded-full h-14 w-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                disabled={isChanging}
            >
                {/* <UserPlus size={24} /> */}
                Change
            </Button>

            </div>
        </div>
    </div>
)
}
