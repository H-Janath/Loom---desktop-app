import { onStopRecording, selectSources, StartRecording } from "@/lib/recorder"
import { cn, resizeWindow, videoRecordingTime } from "@/lib/utils"
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react"

const StudioTray = () => {
  let initialTime = new Date();
  const [onTimer, setOnTimer] = useState<string>('00:00:00')
  const [preview, setPreview] = useState(false)
  const [count, setCount] = useState(0)
  const [recording, setRecording] = useState(false)
  const videoElement = useRef<HTMLVideoElement | null>(null)
  const [onSources, setOnSources] = useState<
    | {
      screen: string
      id: string
      audio: string
      preset: 'HD' | 'SD'
      plan: 'PRO' | 'FREE'
    } | undefined>();

  const clearTime = () => {
    setOnTimer('00:00:00');
    setCount(0)
  }

  window.ipcRenderer.on('profile-recived', (event, payload) => {
    console.log(event)
    setOnSources(payload)
  })

  useEffect(()=>{
    resizeWindow(preview);
    return ()=> resizeWindow(preview)
  },[preview])

  useEffect(() => {
    let previewStream: MediaStream | null = null;

    const setupPreview = async () => {
      if (preview && onSources?.screen && videoElement.current) {
        const stream = await selectSources(onSources, videoElement);
        previewStream = stream ?? null;
      }
    };

    setupPreview();

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [preview, onSources]);


  useEffect(() => {
    if (!recording) return
    const recordTimeInterval = setInterval(() => {
      const time = count + (new Date().getTime() - initialTime.getTime());
      setCount(time)
      const recordingTime = videoRecordingTime(time)
      if (onSources?.plan === "FREE" && recordingTime.minute == '05') {
        setRecording(false)
        clearTime()
        onStopRecording()
      }
      setOnTimer(recordingTime.length);
      if (time <= 0) {
        setOnTimer('00:00:00');
        clearInterval(recordTimeInterval)
      }
    }, 1);
    return () => clearInterval(recordTimeInterval)
  }, [recording])

  console.log(onSources)

  return !onSources ? '' :
    <div className="flex flex-col justify-end gap-y-5 h-screen">
      {preview && (
        <video
          ref={videoElement}
          className={cn('w-6/12 border-2 self-end bg-white rounded-lg shadow-lg')}
          autoPlay
          muted
          playsInline
        />
      )}

      <div className="rounded-full flex justify-around items-center h-20 w-full border-2 bg-[#171717] draggable border-white/40">
        <div {...(onSources && {
          onClick: () => {
            setRecording(true);
            StartRecording(onSources)
          }
        })}
          className={cn("non-draggable rounded-full cursor-pointer relative hover:opacity-80", recording ? "bg-red-500 w-6 h-6" : 'bg-red-400 w-8 h-8')}>
          {recording && <span className="absolute -right-16 top-1/2 tranform -translate-y-1/2 text-white">
            {onTimer}
          </span>}
        </div>
        {!recording ? (
          <Pause
            className="non-dragable opacity-50"
            size={32}
            fill="white"
            stroke="none"
          />) :
          (
            <Square
              size={32}
              className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
              fill="white"
              onClick={() => {
                setRecording(false)
                clearTime()
                onStopRecording()
              }}
              stroke="white"
            />
          )}
        <Cast
          onClick={() => setPreview((prev) => !prev)}
          size={32}
          fill="white"
          className="non-draggable cursor-pointer hover:opacity-60"
          stroke="white"
        />
      </div>
    </div>
}

export default StudioTray