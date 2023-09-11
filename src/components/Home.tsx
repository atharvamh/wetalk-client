import { useEffect, useState } from "react";
import PeopleNetwork from "./PeopleNetwork/PeopleNetwork";
import socket from "../services/socket";

export default function Home(){

    const [chatsessionId, setChatSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if(!socket.connected){
            socket.connect();
        }

        socket.on("connected", (res : any) => {
            const sessionId = res["socketId"];
            setChatSessionId(sessionId);
        })

        return () => {
            socket.disconnect();
        }
    },[])

    return (
        <>
            <PeopleNetwork sessionId={chatsessionId}/>
        </>
    )
}