import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL
})
export const onCloseApp = () => window.ipcRenderer.send('closeApp');

export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpClient.get(`/auth/${clerkId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.data;
}

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke('getSources')
  const enumarateDevices = await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumarateDevices.filter((device) => device.kind === 'audioinput')
  return { displays, audioInputs }
}

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  presert: 'HD' | 'SD'
) => {
  const response = await httpClient.post(`/studio/${id}`, {
    screen, audio, presert
  },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  return response.data
}

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send('hide-plugin', { state })
}

export const videoRecordingTime = (ms: number) => {
  const second = Math.floor(ms / 1000 % 60)
    .toString()
    .padStart(2, '0')
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0')
  const hours = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, '0')
  return {length: `${hours}:${minute}:${second}`,minute}
}