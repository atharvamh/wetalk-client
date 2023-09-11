const cookieService = {
    set : (name: string, value: string, hoursToExpire: number) => {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (hoursToExpire * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};httpOnly=true;Secure=true;SameSite=None;path=/`;
    },

    get : (name : string) => {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(";");

        for(let i = 0; i < cookies.length; i++){
            let cookie = cookies[i].trim();
            if(cookie.indexOf(cookieName) == 0){
                return cookie.substring(cookieName.length, cookie.length); // extracting the cookie value;
            }
        }

        return null;
    },

    remove : (name: string) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    }
}

export default cookieService;