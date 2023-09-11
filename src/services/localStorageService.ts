const localStorageService = {
    get : (key : string) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },

    set : (key : string, value : string) => {
        localStorage.setItem(key, value);
    },

    remove : (key : string) => {
        localStorage.removeItem(key);
    }
}

export default localStorageService;