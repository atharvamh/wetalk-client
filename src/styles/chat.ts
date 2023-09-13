const Section : React.CSSProperties = {
    backgroundColor : "#e3e8f4", 
    borderRadius: '0.5em',
    height: "inherit",
    overflowY: "auto"
}

const ChatWindow : React.CSSProperties = {
    display: "flex",
    flexDirection : "column",
    height: "inherit"
}

const ChatBanner : React.CSSProperties = { 
    backgroundColor: '#111536', 
    color: '#fff', 
    textAlign: 'start',
    padding: "1em",
    borderTopLeftRadius : "0.5em",
    borderTopRightRadius : "0.5em",
    display: "flex",
    columnGap: "0.5em"
}

const ChatMessagesWrapper : React.CSSProperties = {
    background : "#fff",
    height: "inherit",
    padding: "1em",
    overflowY : "auto",
}

const ProfilePicture = (backgroundColor : string) : React.CSSProperties => {
    return {
        width: '40px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: "1px solid #111536"
    }
}

export const chatStyles = {
    Section : Section,
    ProfilePicture : ProfilePicture,
    ChatWindow : ChatWindow,
    ChatBanner : ChatBanner,
    ChatMessagesWrapper : ChatMessagesWrapper
}