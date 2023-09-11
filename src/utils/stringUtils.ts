export function firstLetterCaps (str : string) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

export function swapId (input : string) {
    if(typeof(input) == "string"){
        const parts = input.split("-");
        return `${parts[1]}-${parts[0]}`;
    }

    return null;
}