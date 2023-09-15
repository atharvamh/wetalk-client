import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input, List } from "semantic-ui-react";
import { chatStyles } from "../../styles/chat";
import { colors, colorsLength } from "../../utils/constants/colors";
import { IMember, IRooms } from "../../interfaces/rooms";
import localStorageService from "../../services/localStorageService";
import MessageContainer from "../MessageContainer";

interface IUserPanel{
    rooms: IRooms[],
    userId: string,
    setCurrentChatRoomId: Dispatch<SetStateAction<string | undefined>>;
    setCurrentChatUserId: Dispatch<SetStateAction<string | undefined>>;
}

export default function UserPanel({ rooms, userId, setCurrentChatRoomId, setCurrentChatUserId } : IUserPanel){
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const [mappedMembers, setMappedMembers] = useState<IMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<IMember[]>([]);

    useEffect(() => {
        const members = rooms.map(room => {
            const friend = room.members.filter(x => x.userId != userId)[0];
            return {
                roomId : room._id,
                firstname : friend.firstname,
                lastname : friend.lastname,
                userId : friend.userId
            }
        });

        setMappedMembers(members);
        setFilteredMembers(members);
    },[rooms]);

    useEffect(() => {
        let filteredValues = [];
        
        if(searchValue){
            filteredValues = [...mappedMembers].filter(x => 
                x.firstname.toLowerCase().includes(searchValue) ||
                x.lastname.toLowerCase().includes(searchValue)
            );
        }

        else{
            filteredValues = [...mappedMembers];
        }

        setFilteredMembers(filteredValues);
    },[searchValue]);

    const updateCurrentChatRoom = (item : IMember) => {
        setCurrentChatUserId(item.userId);
        localStorageService.set("chatuser_id", JSON.stringify(item.userId));
        setCurrentChatRoomId(item.roomId);
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Input
                    icon='search'
                    iconPosition='left'
                    placeholder='Search friends'
                    style={{ flex: '1' }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.currentTarget.value)}
                />
            </div>
            <div  style={{ padding: "1em 0em" }}>
                <List divided relaxed>
                    {
                        searchValue && !filteredMembers?.length ? 
                        <MessageContainer message="No results found"/> : <></>
                    }
                    {
                        filteredMembers.map((item, index) => (
                            <List.Item key={`user-${item.firstname}-${index}`} style={{ padding: '1.5em 1em', background: "#fff", cursor: "pointer" }}
                                onClick={() => updateCurrentChatRoom(item)}>
                                <div style={{ display : "flex", alignItems : "center", justifyContent : "start", columnGap : "8px" }}>
                                    <div style={chatStyles.ProfilePicture(colors[index % colorsLength])}>
                                        <span>
                                            { item.firstname.charAt(0).toUpperCase() + item.lastname.charAt(0).toUpperCase() }
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", rowGap : "4px", textAlign: "start", width: "100%" }}>
                                        <div style={{ display : "flex", columnGap : "4px", alignItems: "center" }}>
                                            <div>{item.firstname + " " + item.lastname}</div>
                                        </div>
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