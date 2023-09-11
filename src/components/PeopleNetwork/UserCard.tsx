import { Button, Card, Icon } from "semantic-ui-react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork";
import { firstLetterCaps } from "../../utils/stringUtils";
import { peopleNetworkStyles } from "../../styles/peoplenetwork";
import localStorageService from "../../services/localStorageService";
import toast from "react-hot-toast";
import { sendConnectionReq } from "../../services/usernetwork";
import { useState } from "react";
import { platformStyles } from "../../styles/platform";

interface IUserCard {
    data : IUsersInNetwork
    isPending?: boolean;
    shouldAccept?: boolean;
    acceptRequest?: (data : IUsersInNetwork) => void;
}

export default function UserCard ({ data, isPending, shouldAccept, acceptRequest } : IUserCard) {

    const [requestPending, setIsRequestPending] = useState<boolean>(isPending || false);

    async function sendConectionRequest(toId : string) {
        const currentUserId = localStorageService.get("_uid") ?? "";

        if(!currentUserId){
            toast.error("Error finding clientId. Please login again");
            return;
        }

        const payload = {
            fromId : currentUserId,
            toId : toId
        }

        const response = await sendConnectionReq(JSON.stringify(payload));
        
        if(!response.isSuccess){
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        setIsRequestPending(true);
    }


    return (
        <Card style={peopleNetworkStyles.CardWrapper}>
            <Card.Content style={peopleNetworkStyles.UserCard}>
                <div style={platformStyles.ImagePlaceHolder}>
                    {
                        data.firstname.charAt(0).toUpperCase() + 
                        data.lastname.charAt(0).toUpperCase() 
                    }
                </div>
                <div style={{ fontWeight : "bold" }}>{firstLetterCaps(data.firstname) + " " + firstLetterCaps(data.lastname)}</div>
                <div style={{ color : !data.isVerified ? "#ff4c60" : "#34c76e" }}>
                    {data.isVerified ? "Verified" : "Not Verified" }
                </div>
                {
                    shouldAccept && acceptRequest ? 
                    <Button primary onClick={() => acceptRequest(data)}>
                        <span>
                            <Icon name="check circle" />
                            <span>Accept</span>
                        </span>
                    </Button> : 
                    <Button primary onClick={() => sendConectionRequest(data._id)} disabled={requestPending}>
                        <span>
                            { 
                                requestPending ? 
                                <>
                                    <Icon name="time" />
                                    <span>Pending</span>
                                </> : 
                                <>
                                    <Icon name="add" />
                                    <span>Connect</span>
                                </> 
                            }
                        </span>
                    </Button>
                }
            </Card.Content>
        </Card>
    )
}