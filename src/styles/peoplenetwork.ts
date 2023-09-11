const UserCard : React.CSSProperties = {
    background : "#e3e8f4",
    color : "#000",
    display : "flex",
    flexDirection : "column",
    alignItems : "center",
    justifyContent : "start",
    rowGap: "8px",
    borderRadius: "0.5em"
}

const CardWrapper : React.CSSProperties = {
    borderRadius: "0.5em",
}

const FriendsItemContent : React.CSSProperties = {
    display : "flex", 
    alignItems: "center",
    color : "#000",
    justifyContent: "center", 
    columnGap : "8px",
    background : "#e3e8f4",
    padding: "1rem",
    borderRadius: "0.4em",
}

const FriendsItem : React.CSSProperties = {
    borderRadius : "0.4em",
    color: "#fff",
    border: "1px solid #9ca3af"
}

const FlexColumnRowGap : React.CSSProperties = { 
    display : "flex", 
    alignItems : 'center', 
    justifyContent : 'center', 
    flexDirection : "column", 
    rowGap : "16px" 
}

const Banner : React.CSSProperties = { 
    display : "flex",
    alignItems: "center",
    padding: "0em 1em",
    justifyContent: "center", 
    columnGap: "8px"
}

const Segment : React.CSSProperties = {
    height: "100%",
    borderRadius: "0.5em"
}

const lastActivity : React.CSSProperties = { fontSize: "8px", color : "grey" }

export const peopleNetworkStyles = {
    UserCard : UserCard,
    FriendsItem: FriendsItem,
    FriendsItemContent : FriendsItemContent,
    FlexColumnRowGap : FlexColumnRowGap,
    Segment: Segment,
    CardWrapper: CardWrapper,
    Banner: Banner,
    LastActivity : lastActivity
}