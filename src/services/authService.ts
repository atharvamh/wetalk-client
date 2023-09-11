import jwtDecode from "jwt-decode";
import localStorageService from "./localStorageService";
import { logoutUser } from "./user";

const authService = {
    logout : async (uid : string) => {
        const response = await logoutUser(uid);
        return response;
    },

    removeCredentials : () => {
        localStorage.clear();
        location.reload();
    },

    checkTokenExpiry : (callback : () => void) => {
        const usertoken = localStorageService.get("x-token");
        const decodedToken : any = jwtDecode(usertoken);
        const expiry = decodedToken.exp * 1000;

        if(expiry < Date.now()){
            callback();
        }
    }
}

export default authService;