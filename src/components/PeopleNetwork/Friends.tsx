import { useState, useEffect } from "react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork"
import localStorageService from "../../services/localStorageService";
import { getFriends } from "../../services/usernetwork";
import { Dimmer, Grid, Item, Loader } from "semantic-ui-react";
import { firstLetterCaps } from "../../utils/stringUtils";
import { peopleNetworkStyles } from "../../styles/peoplenetwork";
import MessageContainer from "../MessageContainer";
import { platformStyles } from "../../styles/platform";
import OnlineIndicator from "../OnlineIndicator";

const labelStyle = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '13%'
};

export default function Friends(){
    const [friends, setfriends] = useState<IUsersInNetwork[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const userId = localStorageService.get("_uid") ?? "";
        getFriends(userId).then((response) => {
            setfriends(response?.data);
            setIsLoading(false);
        });
    },[])

    return (
        <>
            {
                isLoading ? 
                <Dimmer active>
                    <Loader inverted> Loading </Loader>
                </Dimmer> : 
                friends?.length ? 
                <Grid columns={6} stackable>
                    {
                        friends.map((item : IUsersInNetwork) => 
                            <Grid.Column key={item._id}>
                                <Item style={peopleNetworkStyles.FriendsItem}>
                                    <OnlineIndicator 
                                        userStyle={labelStyle} 
                                        isOnline={item.isOnline} 
                                        showIcon={true} 
                                        showText={false} 
                                    />
                                    <Item.Content style={peopleNetworkStyles.FriendsItemContent}>
                                        <div style={platformStyles.ImagePlaceHolder}>
                                            {
                                                item.firstname.charAt(0).toUpperCase() + 
                                                item.lastname.charAt(0).toUpperCase() 
                                            }
                                        </div>
                                        <div>
                                            <div>
                                                {firstLetterCaps(item.firstname) + " " + firstLetterCaps(item.lastname)}
                                            </div>
                                            {
                                                !item.isOnline ? 
                                                <div style={peopleNetworkStyles.LastActivity}>
                                                    Last Seen : {" "}
                                                    { 
                                                        item.lastActivity != null ? new Date(item.lastActivity).toLocaleString() : "N/A"
                                                    }
                                                </div> : <></>
                                            }
                                        </div>
                                    </Item.Content>
                                </Item>
                            </Grid.Column>
                        )
                    }
                </Grid> : 
                <>
                    <MessageContainer 
                        iconName="user delete" 
                        message={"You are not connected with anyone at the moment"} 
                    />
                </>
            }
        </>
    )
}