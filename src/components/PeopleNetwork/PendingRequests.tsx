import { useEffect, useState } from "react";
import localStorageService from "../../services/localStorageService";
import { acceptConnectionReq, getPendingRequests } from "../../services/usernetwork";
import { Dimmer, Grid, Loader } from "semantic-ui-react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import MessageContainer from "../MessageContainer";

export default function PendingRequests(){
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const currentUserId = localStorageService.get("_uid") ?? "";
        getPendingRequests(currentUserId).then(response => {
            setPendingRequests(response?.data);
            setIsLoading(false);
        })
    },[])

    async function acceptRequest(data : IUsersInNetwork) {
        const currentUserId = localStorageService.get("_uid") ?? "";

        if(!currentUserId){
            toast.error("Error finding clientId. Please login again");
            return;
        }

        const payload = {
            fromId : data._id,
            userId : currentUserId,
            fromFirstName: data.firstname,
            fromLastName: data.lastname,
        }

        const response = await acceptConnectionReq(JSON.stringify(payload));

        if(!response.isSuccess){
            toast.error("Error adding to your friends list");
            return;
        }

        toast.success(response.message);
        const temp = [...pendingRequests];
        const idx = temp.findIndex(x => x._id == data._id);
        if(idx !== -1){
            temp.splice(idx,1);
        }

        setPendingRequests(temp);
    }
 
    return (
        <>
            {
                isLoading ? 
                <Dimmer active>
                    <Loader inverted> Loading </Loader>
                </Dimmer> : 
                pendingRequests?.length ? 
                <Grid columns={6} stackable>
                    {
                        pendingRequests.map((item : IUsersInNetwork) => 
                            <Grid.Column key={item._id}>
                                <UserCard 
                                    data={item}
                                    shouldAccept={true}
                                    acceptRequest={acceptRequest}
                                />
                            </Grid.Column>
                        )
                    }
                </Grid> : 
                <MessageContainer 
                    iconName="clock"
                    message={"You don't have any pending connect requests"} 
                />
            }
        </>
    )
}