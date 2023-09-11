const MessageContainerWrapper : React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    height: "inherit",
    flexDirection: "column"
}

const ImagePlaceHolder : React.CSSProperties = { 
    background : "#fff", 
    color : "#000", 
    padding : "1rem", 
    borderRadius : "0.3rem",
    border: "1px solid #000"
}

const FlexContainer : React.CSSProperties = {
    display : "flex",
    columnGap : "1em",
    height: "inherit"
}

const ContentWrapper : React.CSSProperties = {
    width: "100%",
    padding: "0.8em",
    height: "inherit"
}

export const platformStyles = {
    MessageContainerWrapper : MessageContainerWrapper,
    ImagePlaceHolder : ImagePlaceHolder,
    FlexContainer : FlexContainer,
    ContentWrapper : ContentWrapper
}