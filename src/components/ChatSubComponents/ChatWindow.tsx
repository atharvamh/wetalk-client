import { Button, Grid, Input, Segment, Icon, Dimmer, Loader } from "semantic-ui-react";
import { chatStyles } from "../../styles/chat";
import { useEffect, useRef, useState } from "react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork";
import { firstLetterCaps } from "../../utils/stringUtils";
import OnlineIndicator from "../OnlineIndicator";
import socket from "../../services/socket";
import localStorageService from "../../services/localStorageService";
import { IMessage, IUserMessage } from "../../interfaces/messages";
import TextMessage from "./TextMessage";
import { getConversations, saveUserMessage } from "../../services/room";
import toast from "react-hot-toast";
import MessageContainer from "../MessageContainer";
import { scrollToBottom } from "../../utils/viewUtils";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getUserDetails } from "../../services/user";

interface IChatWindow{
    currentChatUserId : string,
    currentChatRoomId : string | undefined
}

export default function ChatWindow({ currentChatUserId, currentChatRoomId } : IChatWindow){
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const sendRef = useRef<any>(null);
    const [chatUser, setChatUser] = useState<IUsersInNetwork | undefined>(undefined);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const myUserId = localStorageService.get("_uid") ?? "";
    const [message, setMessage] = useState<string>("");
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [rtcActivityUid, setrtcActivityUid] = useState<string | null>(null);
    const [uEvent, setuEvent] = useState<string | null>(null);
    const [rtcLogoutTime, setRtcLogoutTime] = useState<Date | null>(null);
    const [isConversationLoading, setIsConversationLoading] = useState<boolean>(true);

    useEffect(() => {
        socket.on("user-message", (res : IUserMessage) => {
            const incomingMessage : IMessage = { sender : res.sender, timestamp : res.timestamp, message : res.message };
            if(res.roomId === currentChatRoomId){
                setMessages((prev) => [...prev, incomingMessage]);
            }
        })

        socket.on("logout-success", (res : any) => {
            setrtcActivityUid(res.userId);
            setuEvent(res.event);
            setRtcLogoutTime(res.timestamp);
        });

        socket.on("login-success", (res: any) => {
            setrtcActivityUid(res.userId);
            setuEvent(res.event);
            setRtcLogoutTime(null);
        })

        return () => {
            socket.off("user-message");
            socket.off("logout-success");
            socket.off("login-success");
        }
    },[currentChatRoomId])

    useEffect(() => {
        if(currentChatRoomId){
            localStorageService.set("chatroom_id", JSON.stringify(currentChatRoomId));
            socket.emit("join-room", { room: currentChatRoomId });

            getConversations(currentChatRoomId).then((response) => {
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
    },[currentChatRoomId]);

    useEffect(() => {
        setEmojiPickerVisible(false);
        getUserDetails(currentChatUserId).then((response) => {
            setRtcLogoutTime(null);
            setrtcActivityUid(null);
            setuEvent(null);
            setChatUser(response.data);
        })
    },[currentChatUserId]);

    useEffect(() => {
        scrollToBottom(chatContainerRef);
    }, [messages]);

    const toggleEmojiPicker = () => {
        setEmojiPickerVisible(!emojiPickerVisible);
    };

    const handleEmojiSelect = (emoji : any) => {
        setMessage((prev) => prev + emoji.native);
    };

    const handleClick = async () => {
        if(message?.trim()){
            setEmojiPickerVisible(false);
            const timestamp = Date.now();
            const umessage : IMessage = { sender : myUserId, timestamp : timestamp, message : message.trim() }
            const payload = { ...umessage, roomId : currentChatRoomId }

            socket.emit("send-message-to-room", payload);
            setMessage("");

            const saveMessageResponse = await saveUserMessage(JSON.stringify(payload));

            if(saveMessageResponse?.isSuccess && saveMessageResponse.isSuccess == false){
                toast.error("Error saving current message");
            }
        }
    }

    const handleKeyPress = (e : KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'Enter') {
            toggleEmojiPicker();
            return;
        }

        if(e.key === "Enter"){
            handleClick();
            return;
        } 
    }

    return (
        <div style={chatStyles.ChatWindow}>
            <div style={chatStyles.ChatBanner}>
                <OnlineIndicator 
                    isOnline={ rtcActivityUid === currentChatUserId ? (uEvent === "LOGIN") : chatUser?.isOnline} 
                    size="mini" 
                />
                <div style={{ fontWeight : "600" }}>
                    {firstLetterCaps(chatUser?.firstname || "") + " " + firstLetterCaps(chatUser?.lastname || "")}
                </div>
                {
                    uEvent !== "LOGIN" && (uEvent === "LOGOUT" || !chatUser?.isOnline) ? 
                    <div style={{ fontSize : "0.8em" }}>
                        Last Seen : {" "}
                        { 
                            rtcActivityUid === currentChatUserId && rtcLogoutTime != null ? new Date(rtcLogoutTime).toLocaleString() :
                            chatUser?.lastActivity != null ? new Date(chatUser.lastActivity).toLocaleString() : "N/A"
                        }
                    </div> : <></>
                }
            </div>
            <div style={chatStyles.ChatMessagesWrapper} ref={chatContainerRef}>
                {
                    isConversationLoading ? 
                    <Dimmer active>
                        <Loader inverted> Loading </Loader>
                    </Dimmer> :
                    messages?.length ? 
                    messages?.map((item) => 
                        <TextMessage 
                            sameSender={item.sender == myUserId}
                            timestamp={new Date(item.timestamp).toLocaleTimeString()}
                            text={item.message}
                            key={item.timestamp}
                        />
                    ) : 
                    <>
                        <MessageContainer
                            iconName="talk"
                            message={"Type a message to start your conversation :)"} 
                        />
                    </>
                }
            </div>
            <div>
                <Segment>
                    <Grid columns="equal">
                        <Grid.Column width={14}>
                            <Input 
                                fluid
                                action={
                                    <Button
                                        icon="smile outline"
                                        onClick={toggleEmojiPicker}
                                    />
                                }
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.currentTarget.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button primary fluid disabled={message.trim().length == 0} ref={sendRef} onClick={handleClick}>
                                <Icon name="send" />
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Segment>
                {
                    emojiPickerVisible && (
                    <Picker
                        onEmojiSelect={handleEmojiSelect}
                        data={data}
                        maxFrequentRows={1}
                        style={{ position : "absolute", top : 0, width : "100%" }}
                    />
                )}
            </div>
        </div>
    )
}