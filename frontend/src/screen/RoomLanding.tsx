"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { UserIcon, VideoIcon } from "lucide-react"
import { Room } from "../components/Room"

// import { io } from "socket.io-client";
// const socket = io("http://localhost:3000");

export const RoomLanding = () => {
  const [name, setName] = useState("")
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null)
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [joined, setJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCam = async () => {
    try {
      setIsLoading(true)
      const stream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      const audioTrack = stream.getAudioTracks()[0]
      const videoTrack = stream.getVideoTracks()[0]
      setLocalAudioTrack(audioTrack)
      setlocalVideoTrack(videoTrack)

      if (!videoRef.current) {
        return
      }

      videoRef.current.srcObject = new MediaStream([videoTrack])
      videoRef.current.play()
      setError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access your camera and microphone. Please check your permissions.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam()
    }
  }, [videoRef])

  const handleJoin = () => {
    setJoined(true)
    // if(!name) setName("randomName")
    // socket.emit("join", { name });
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-600">Get Matched with New People</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Have meaningful conversations about life, career, and love with people worldwide.
          </p>
        </motion.div>

        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <VideoIcon className="h-5 w-5 text-indigo-600" />
              <span>Camera Preview</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
                  <p className="text-red-500 text-center">{error}</p>
                </div>
              )}

              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline></video>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center w-full gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Enter your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
              />
            </div>

            <Button
              onClick={handleJoin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
              disabled={isLoading}
            >
              Start Chatting
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2">
              By joining, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-center text-gray-600"
        >
          <p>
            Need help?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Contact support
            </a>
          </p>
        </motion.div>
      </div>
    )
  }

  return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}

