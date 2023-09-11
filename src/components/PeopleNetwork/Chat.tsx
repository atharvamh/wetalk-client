import { useEffect, useState } from "react";
import localStorageService from "../../services/localStorageService";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import MessageContainer from "../MessageContainer";
import { platformStyles } from "../../styles/platform";
import { chatStyles } from "../../styles/chat";
import UserPanel from "../ChatSubComponents/UserPanel";
import socket from "../../services/socket";
import ChatWindow from "../ChatSubComponents/ChatWindow";
import { toast } from "react-hot-toast";
import { getConversations } from "../../services/room";
import { IMessage } from "../../interfaces/messages";
import { getRooms } from "../../services/user";
import { IRooms } from "../../interfaces/rooms";

export default function ChatPanel(){
    const userId = localStorageService.get("_uid") ?? "";

    const [rooms, setRooms] = useState<IRooms[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentChatUserId, setCurrentChatUserId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isConversationLoading, setIsConversationLoading] = useState<boolean>(true);

    useEffect(() => {
        const chatuserId = localStorageService.get("chat_userId");
        setCurrentChatUserId(chatuserId);
        getRooms(userId).then((response : any) => {
            setRooms(response?.data);
            setIsLoading(false);
        });
    },[]);
    
    useEffect(() => {
        if(currentChatUserId){
            localStorageService.set("chat_userId", JSON.stringify(currentChatUserId));
            socket.emit("join-room", { room: `${currentChatUserId}-${userId}` });
            const roomId = `${currentChatUserId}-${userId}`

            getConversations(roomId).then((response) => {
                if(!response.isSuccess){
                    toast.error(response.message);
                }

                setMessages(response.data);
                setIsConversationLoading(false);

            }).catch(err => {
                console.log(err);
                setIsConversationLoading(false);
            });
        }
    },[currentChatUserId]);

    return (
        <>
            {
                isLoading ? 
                <Dimmer active>
                    <Loader inverted> Loading </Loader>
                </Dimmer> :
                rooms?.length ? 
                <div style={platformStyles.FlexContainer}>
                    <div style={{ flex: '30%', height: "inherit" }}>
                        <Segment style={chatStyles.Section}>
                            <UserPanel 
                                rooms={rooms} 
                                userId={userId} 
                                setCurrentChatUserId={setCurrentChatUserId}
                            />
                        </Segment>
                    </div>
                    <div style={{ flex: '70%', height : "inherit" }}>
                        <Segment style={chatStyles.Section}>
                            {
                                currentChatUserId ? 
                                <ChatWindow 
                                    userId={currentChatUserId}
                                    messages={messages}
                                    setMessages={setMessages}
                                    isDataLoading={isConversationLoading}
                                /> : 
                                <MessageContainer 
                                    iconName="beer" 
                                    message={"Click on a user to start your chat"} 
                                />
                            }
                        </Segment>
                    </div>
                </div>
                : 
                <>
                    <MessageContainer 
                        iconName="user plus" 
                        message={"Connect with people to start talking"} 
                    />
                </>
            }
        </>
    )
}