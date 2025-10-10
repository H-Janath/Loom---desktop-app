import { useEffect, useRef } from 'react'

const WebCam = () => {
  
  const camElement = useRef<HTMLVideoElement | null>(null);

  const streamWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    if (camElement.current) {
      camElement.current.srcObject = stream;
      camElement.current.play()
    }
  }

  useEffect(() => {
    streamWebCam()
  }, [])

  return (
    <video
      ref={camElement}
      className="w-48 h-48 rounded-full object-cover border-4 border-white/40 shadow-lg aspect-video draggable"
    >
    </video>


  )
}

export default WebCam