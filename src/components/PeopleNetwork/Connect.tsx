import { useState, useEffect } from "react";
import { getOtherUsers } from "../../services/usernetwork";
import localStorageService from "../../services/localStorageService";
import { Dimmer, Grid, Loader } from "semantic-ui-react";
import { IUsersInNetwork } from "../../interfaces/peoplenetwork";
import UserCard from "./UserCard";
import MessageContainer from "../MessageContainer";

export default function Connect(){
    const [usersInNetwork, setusersInNetwork] = useState<IUsersInNetwork[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [toRequests, setToRequests] = useState<any>({});

    useEffect(() => {
        const currentUserId = localStorageService.get("_uid") ?? "";
        getOthers(currentUserId).then(response => {
            setusersInNetwork(response?.data?.users);
            setToRequests(response?.data?.requests?.requestStatus);
            setIsLoading(false);
        })
    },[])

    async function getOthers(id : string){
        const response = await getOtherUsers(id);
        return response;
    };

    return (
        <>
            <h4>Count of other users on WeTalk : {usersInNetwork.length}</h4>
            {
                isLoading ? 
                <Dimmer active>
                    <Loader inverted> Loading </Loader>
                </Dimmer> : 
                usersInNetwork?.length ? 
                <Grid columns={6} stackable>
                    {
                        usersInNetwork.map((item : IUsersInNetwork) => 
                            <Grid.Column key={item._id}>
                                <UserCard 
                                    data={item}
                                    isPending={toRequests && toRequests["to"] ? toRequests["to"][item._id] == 0 : undefined}
                                />
                            </Grid.Column>
                        )
                    }
                </Grid> : 
                <MessageContainer message="Already connected with all users" />
            }
        </>
    );
}