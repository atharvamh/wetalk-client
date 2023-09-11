import { getWithAuth, postWithAuth } from "./apiservice";

const apiurl = import.meta.env.VITE_SERVER_URL + "/api/v1/usernetwork/";

export const getOtherUsers = async (_id : string) => {
    const url = apiurl + `${_id}`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}

export const sendConnectionReq = async (payload : any) => {
    const url = apiurl + "connect";
    return await postWithAuth(url, payload).then(res => res.json()).catch(err => console.log(err));
}

export const acceptConnectionReq = async (payload : any) => {
    const url = apiurl + "accept";
    return await postWithAuth(url, payload).then(res => res.json()).catch(err => console.log(err));
}

export const getPendingRequests = async (_id : string) => {
    const url = apiurl + `${_id}/pending-requests`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}

export const getFriends = async (_id : string) => {
    const url = apiurl + `${_id}/friends`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}