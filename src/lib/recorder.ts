import { hidePluginWindow } from "./utils"
import {v4 as uuid} from 'uuid'

let videoTransferFileName: string | undefined
let mediaRecorder: MediaRecorder | undefined
export const StartRecording = (onSources:{
    screen: string,
    audio: string,
    id: string
})=>{
    hidePluginWindow(true);
    videoTransferFileName = `${uuid()}-${onSources?.id.slice(0,8)}.webm`;

    // Example: create a MediaRecorder from a stream (replace with your actual stream)
    const stream = new MediaStream(); // Replace with actual media stream
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start(1000)
}

export const onStopRecording = ()=> mediaRecorder?.stop()