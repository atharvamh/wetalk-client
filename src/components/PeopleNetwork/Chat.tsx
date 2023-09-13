import { useEffect, useState } from "react";
import localStorageService from "../../services/localStorageService";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import MessageContainer from "../MessageContainer";
import { platformStyles } from "../../styles/platform";
import { chatStyles } from "../../styles/chat";
import UserPanel from "../ChatSubComponents/UserPanel";
import ChatWindow from "../ChatSubComponents/ChatWindow";
import { getRooms } from "../../services/user";
import { IRooms } from "../../interfaces/rooms";

export default function ChatPanel(){
    const userId = localStorageService.get("_uid") ?? "";

    const [rooms, setRooms] = useState<IRooms[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentChatUserId, setCurrentChatUserId] = useState<string | undefined>(undefined);
    const [currentChatRoomId, setCurrentChatRoomId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const chatRoomId = localStorageService.get("chatroom_id");
        const chatUserId = localStorageService.get("chatuser_id");
        setCurrentChatRoomId(chatRoomId);
        setCurrentChatUserId(chatUserId);

        getRooms(userId).then((response : any) => {
            setRooms(response?.data);
            setIsLoading(false);
        });
    },[]);

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
                                setCurrentChatRoomId={setCurrentChatRoomId}
                                setCurrentChatUserId={setCurrentChatUserId}
                            />
                        </Segment>
                    </div>
                    <div style={{ flex: '70%', height : "inherit" }}>
                        <Segment style={chatStyles.Section}>
                            {
                                currentChatUserId ? 
                                <ChatWindow 
                                    currentChatUserId={currentChatUserId}
                                    currentChatRoomId={currentChatRoomId}
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