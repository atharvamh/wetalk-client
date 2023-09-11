import { getWithAuth, postWithAuth } from "./apiservice";

const apiurl = import.meta.env.VITE_SERVER_URL + "/api/v1/room/";

export const getConversations = async (roomId : string) => {
    const url = apiurl + `${roomId}/conversations`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}

export const saveUserMessage = async (payload : any) => {
    const url = apiurl + "savemessage";
    return await postWithAuth(url, payload).then(res => res.json()).catch(err => console.log(err));
}