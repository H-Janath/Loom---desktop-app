import { useMediaResources } from "@/hooks/useMediaResources";
import { fetchUserProfile } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import MediaConfiguration from "../MediaConfiguration";

const Widget = () => {
    const { user } = useUser();

    const [profile, setProfile] = useState<{
        status: number
        user:
        | ({
            subscription: {
                plan: 'PRO' | 'FREE'
            } | null
            studio: {
                id: string
                screen: string | null
                mic: string | null
                preset: 'HD' | 'SD'
                camera: string | null
                userId: string | null
            } | null
        } & {
            id: string
            email: string
            firstname: string
            lastname: string
            createdAt: Date
            clerkId: string
        }) | null
    } | null>(null);

    const {state, fetchMediaResources} = useMediaResources();

    console.log(state)

    useEffect(()=>{
        if(user && user.id){
            fetchUserProfile(user.id).then ((p)=>setProfile(p))
        }
    },[user])


    return (
        <div className="p-5">
            <ClerkLoading>
                <div className="h-full flex jutify-center items-center">
                    <Loader />
                </div>
            </ClerkLoading>
            <SignedIn>
                {profile?(
                    <MediaConfiguration 
                        state={state}
                        user ={profile?.user}
                    />
                ): (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader color="#fff"/>
                    </div>
                ) }
            </SignedIn>
        </div>
    )
}

export default Widget