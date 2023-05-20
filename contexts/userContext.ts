import { ProfileType } from "@/components/PostFormCard";
import { createContext } from "react";

export const userInitialState = {
    name: null,
    id: null,
    avatar: "https://w7.pngwing.com/pngs/686/219/png-transparent-youtube-user-computer-icons-information-youtube-hand-silhouette-avatar.png",
    created_at: null
}

export const UserContext:any = createContext({})
