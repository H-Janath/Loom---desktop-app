import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react"

export type SourceDevicesState = {
    displays?: {
        appIcon: null;
        display_Id: string,
        id: string,
        name: string,
        thumbnail: unknown[];
    }[];
    audioInputs?: {
        deviceId: string;
        kind: string;
        label: string;
        groupId: string
    }[];
    error: string | null
    isPending?: boolean
}

type DisplayDeviceActionProps = {
    type: "GET_DEVICES"
    payload: SourceDevicesState
}
export const useMediaResources = () => {
    const [state, action] = useReducer(
        (state: SourceDevicesState, action: DisplayDeviceActionProps) => {
            switch (action.type) {
                case 'GET_DEVICES':
                    return { ...state, ...action.payload }
                default:
                    return state

            }
        },
        {
            displays: [],
            audioInputs: [],
            error: null,
            isPending: false
        }
    )
    const fetchMediaResources = () => {
        action({ type: "GET_DEVICES", payload: { isPending: true, error: null } })
        getMediaSources().then((sources) => 
            action({
                type: "GET_DEVICES",
                payload: {
                    displays: sources.displays,
                    audioInputs: sources.audioInputs,
                    isPending: false,
                    error: null
                },
            })
        )
    }

    return { state, fetchMediaResources }

}