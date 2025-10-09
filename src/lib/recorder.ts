import { hidePluginWindow } from "./utils"
import { v4 as uuid } from 'uuid'
import io from 'socket.io-client'

let videoTransferFileName: string | undefined
let mediaRecorder: MediaRecorder | undefined
let userId: string
const socket = io(import.meta.env.VITE_SOCKET_URL as string)
export const StartRecording = (onSources: {
    screen: string,
    audio: string,
    id: string
}) => {
    hidePluginWindow(true);
    videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;

    // Example: create a MediaRecorder from a stream (replace with your actual stream)
    const stream = new MediaStream(); // Replace with actual media stream
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start(1000)
}

export const onStopRecording = () => mediaRecorder?.stop()


// const stopRecording = ()=>{
//     hidePluginWindow(false);
//     socket.emit("process-video",{
//         filename: videoTransferFileName,
//         userId,
//     })
// }

export const onDataAvailable = (e: BlobEvent) => {
    socket.emit("video-chunks", {
        chunks: e.data,
        filename: videoTransferFileName,
    })
}


export const selectSources = async (
  onSources: {
    screen: string
    audio: string
    id: string
    preset: 'HD' | 'SD'
  },
  videoElement: React.RefObject<HTMLVideoElement>
): Promise<MediaStream | undefined> => {
  if (onSources?.screen && onSources?.id) {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: onSources.screen,
          minWidth: onSources.preset === 'HD' ? 1920 : 1200,
          maxWidth: onSources.preset === 'HD' ? 1920 : 1200,
          minHeight: onSources.preset === 'HD' ? 1080 : 720,
          maxHeight: onSources.preset === 'HD' ? 1080 : 720,
          frameRate: 30,
        },
      },
    };

    const screenStream = await navigator.mediaDevices.getUserMedia(constraints);

    // Optional: capture system audio device
    let audioStream: MediaStream | null = null;
    if (onSources.audio) {
      audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId: { exact: onSources.audio } },
      });
    }

    // Combine audio + video
    const combinedStream = new MediaStream([
      ...screenStream.getTracks(),
      ...(audioStream ? audioStream.getTracks() : []),
    ]);

    // Attach to <video> element for preview
    if (videoElement?.current) {
      videoElement.current.srcObject = screenStream; // only video stream for preview
      await videoElement.current.play();
    }

    // Return combined stream for reuse in recording
    return combinedStream;
  }
};
