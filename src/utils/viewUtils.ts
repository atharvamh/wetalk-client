export const scrollToBottom = (element : React.MutableRefObject<HTMLDivElement | null>) => {
    if(element.current){
        element.current.scrollTop = element.current.scrollHeight;
    }
}