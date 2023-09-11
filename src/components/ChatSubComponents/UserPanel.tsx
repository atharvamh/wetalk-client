import { Dispatch, SetStateAction, useState } from "react";
import { Button, Input, List } from "semantic-ui-react";
import { chatStyles } from "../../styles/chat";
import { colors, colorsLength } from "../../utils/constants/colors";
import { IRooms } from "../../interfaces/rooms";

interface IUserPanel{
    rooms: IRooms[],
    userId: string,
    setCurrentChatUserId: Dispatch<SetStateAction<string | undefined>>;
}

export default function UserPanel({ rooms, userId, setCurrentChatUserId } : IUserPanel){
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

    const updateCurrentChatUser = (members: any[]) => {
        const otherMember = members.filter(x => x.userId !== userId)[0];
        setCurrentChatUserId(otherMember.userId);
    }

    const getRoomName = (members: any[], isGroupChat: boolean) : string => {
        if(!isGroupChat){
            const otherMember = members.filter(x => x.userId !== userId)[0];
            return otherMember ? otherMember?.firstname + " " + otherMember.lastname : "NA"
        }

        return "";
    }

    const getInitials = (members: any[], isGroupChat: boolean) : string => {
        if(!isGroupChat){
            const otherMember = members.filter(x => x.userId !== userId)[0];
            return otherMember ? 
                otherMember.firstname.charAt(0).toUpperCase() + otherMember.lastname.charAt(0).toUpperCase() : "NA";
        }

        return "";
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Input
                    icon='search'
                    iconPosition='left'
                    placeholder='Search'
                    style={{ flex: '1' }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.currentTarget.value)}
                />
                <Button
                    primary
                    content='New Group'
                    style={{ marginLeft: '10px' }}
                />
            </div>
            <div  style={{ padding: "1em 0em" }}>
                <List divided relaxed>
                    {
                        rooms.map((item, index) => (
                            <List.Item key={item._id} style={{ padding: '1.5em 1em', background: "#fff", cursor: "pointer" }}
                                onClick={() => updateCurrentChatUser(item.members)}>
                                <div style={{ display : "flex", alignItems : "start", justifyContent : "start", columnGap : "8px" }}>
                                    <div style={chatStyles.ProfilePicture(colors[index % colorsLength])}>
                                        <span>
                                            {
                                                getInitials(item.members, item.isGroupChat)
                                            }
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", rowGap : "4px", textAlign: "start", width: "100%" }}>
                                        <div style={{ display : "flex", columnGap : "4px", alignItems: "center" }}>
                                            <div>{getRoomName(item.members, item.isGroupChat)}</div>
                                        </div>
                                        {
                                            item.metadata.lastmessage ?
                                            <div style={{ display : "flex", alignItems: "center", justifyContent : "space-between" }}>
                                                <div style={{ fontSize: "0.8em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                    width: "75%" }}>
                                                    {
                                                        item.metadata.lastmessage 
                                                    }
                                                </div>
                                                <div style={{ fontSize : "0.8em" }}>
                                                    {
                                                        item.metadata.lasttimestamp ? new Date(item.metadata?.lasttimestamp).toLocaleTimeString() : "" 
                                                    }
                                                </div>
                                            </div> : <></>
                                        }
                                    </div>
                                </div>
                            </List.Item>
                        ))
                    }
                </List>
            </div>
        </div>
    )
}