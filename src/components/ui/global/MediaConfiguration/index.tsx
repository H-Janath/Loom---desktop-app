import { SourceDevicesState } from "@/hooks/useMediaResources"

type Props = {
  state: SourceDevicesState
  user: | ({
    subscription: {
      plan: 'PRO' | 'FREE'
    } | null
    studio: {
      id: string
      screen: string | null
      mic: string | null
      camera: string | null
      preset: 'HD' | 'SD'
      userId: string | null
    } | null
  } & {
    id: string
    email: string
    firstname: string | null
    lastname: string | null
    createdAt: Date
    clerkId: string
  })
  | null
}
const MediaConfiguration = ({state,user}: Props) => {

  
  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
        
        </form>
  )
}

export default MediaConfiguration