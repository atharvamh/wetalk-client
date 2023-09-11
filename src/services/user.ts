import { getData, getWithAuth, patchWithAuth, postData } from "./apiservice";

const apiurl = import.meta.env.VITE_SERVER_URL + "/api/v1/user/";

interface ILoginUser{
    email: string,
    password: string
}

interface IRegisterUser extends ILoginUser{
    firstName: string,
    lastName: string,
}

export const registerUser = async (payload : IRegisterUser) => {
    const url = apiurl + "register";
    return await postData(url, payload).then(res => res.json()).catch(err => console.log(err))
}

export const loginUser = async (payload : ILoginUser) => {
    const url = apiurl + "login";
    return await postData(url, payload).then(res => res.json()).catch(err => console.log(err));
}

export const logoutUser = async(uid: string) => {
    const url = apiurl + `${uid}/logout`;
    return await getData(url).then(res => res.json()).catch(err => console.log(err));
}

export const getUserDetails = async(uid : string) => {
    const url = apiurl + `${uid}`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}

export const updateUserDetails = async(uid : string, payload : any) => {
    const url = apiurl + `${uid}`
    return await patchWithAuth(url, payload).then(res => res.json()).catch(err => console.log(err));
}

export const getRooms = async(userId : string) => {
    const url = apiurl + `${userId}/rooms`;
    return await getWithAuth(url).then(res => res.json()).catch(err => console.log(err));
}