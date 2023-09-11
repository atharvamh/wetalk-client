import { Button, Grid, Input, Segment, Icon, Dimmer, Loader } from "semantic-ui-react";
import { chatStyles } from "../../styles/chat";
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork";
import { firstLetterCaps, swapId } from "../../utils/stringUtils";
import OnlineIndicator from "../OnlineIndicator";
import socket from "../../services/socket";
import localStorageService from "../../services/localStorageService";
import { IMessage } from "../../interfaces/messages";
import TextMessage from "./TextMessage";
import { saveUserMessage } from "../../services/room";
import toast from "react-hot-toast";
import MessageContainer from "../MessageContainer";
import { scrollToBottom } from "../../utils/viewUtils";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getUserDetails } from "../../services/user";

interface IChatWindow{
    userId : string,
    messages: IMessage[],
    setMessages: Dispatch<SetStateAction<IMessage[]>>;
    isDataLoading: boolean
}

export default function ChatWindow({ userId, messages, setMessages,  isDataLoading } : IChatWindow){
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const sendRef = useRef<any>(null);
    const [chatUser, setChatUser] = useState<IUsersInNetwork | undefined>(undefined);
    const myUserId = localStorageService.get("_uid") ?? "";
    const [message, setMessage] = useState<string>("");
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [rtcActivityUid, setrtcActivityUid] = useState<string | null>(null);
    const [rtcLogoutTime, setRtcLogoutTime] = useState<Date | null>(null);

    useEffect(() => {
        socket.on("user-message", (res : IMessage) => {
            const incomingMessage : IMessage = { sender : res.sender, timestamp : res.timestamp, message : res.message };
            setMessages((prev) => [...prev, incomingMessage]);
        })

        socket.on("logout-success", (res : any) => {
            setrtcActivityUid(res.userId);
            setRtcLogoutTime(res.timestamp);
        });

        return () => {
            socket.off("user-message");
        }
    },[])

    useEffect(() => {
        setEmojiPickerVisible(false);
        getUserDetails(userId).then((response) => {
            setRtcLogoutTime(null);
            setrtcActivityUid(null);
            setChatUser(response.data);
        })
    },[userId]);

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
            const timestamp = Date.now();
            const roomId = swapId(`${userId}-${myUserId}`);

            socket.emit("send-message-to-room", { room : roomId, message : message.trim(), timestamp : timestamp });
            setMessage("");

            const usermessage : IMessage = { sender : myUserId, timestamp : timestamp, message : message.trim() };
            setMessages((prev) => [...prev, usermessage]);

            const payload = { ...usermessage, roomId : roomId }

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
                <OnlineIndicator isOnline={ rtcActivityUid === userId ? false : chatUser?.isOnline} size="mini" />
                <div style={{ fontWeight : "600" }}>
                    {firstLetterCaps(chatUser?.firstname || "") + " " + firstLetterCaps(chatUser?.lastname || "")}
                </div>
                {
                    !chatUser?.isOnline ? 
                    <div style={{ fontSize : "0.8em" }}>
                        Last Seen : {" "}
                        { 
                            rtcActivityUid === userId && rtcLogoutTime != null ? new Date(rtcLogoutTime).toLocaleString() :
                            chatUser?.lastActivity != null ? new Date(chatUser.lastActivity).toLocaleString() : "N/A"
                        }
                    </div> : <></>
                }
            </div>
            <div style={chatStyles.ChatMessagesWrapper} ref={chatContainerRef}>
                {
                    isDataLoading ? 
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