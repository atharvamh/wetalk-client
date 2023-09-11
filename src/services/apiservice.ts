import localStorageService from "./localStorageService"

export const postData = async (url : string, _payload: any) => {
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        },
        body: JSON.stringify(_payload)
    })
}

export const getData = async (url : string) => {
    return await fetch(url, {
        method: "GET"
    })
}

export const getWithAuth = async (url : string) => {
    const token = localStorageService.get("x-token") ?? "";
    return await fetch(url, {
        method: "GET",
        headers: {
            "x-access-token" : token,
        }
    })
}

export const postWithAuth = async(url : string, _payload : any) => {
    const token = localStorageService.get("x-token") ?? "";
    return await fetch(url, {
        method : "POST",
        headers : {
            "x-access-token" : token,
            "Content-Type": "application/json; charset=utf-8"
        },
        body: _payload,
    });
}

export const patchWithAuth = async(url : string, _payload : any) => {
    const token = localStorageService.get("x-token") ?? "";
    return await fetch(url, {
        method : "PATCH",
        headers : {
            "x-access-token" : token,
            "Content-Type": "application/json; charset=utf-8"
        },
        body: _payload,
    });
}