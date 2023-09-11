interface ITextMessage {
    sameSender : boolean,
    text : string,
    timestamp : string
}

export default function TextMessage({ sameSender, text, timestamp } : ITextMessage){
    return (
        <div style={{ display: "flex", flexDirection : "column", 
            alignItems : sameSender ? "flex-end" : "flex-start"  }}>
            <div
                style={{
                    backgroundColor: sameSender ? '#e3e8f4' : '#437eeb',
                    borderRadius: '0.6em',
                    width: "fit-content",
                    color: sameSender ? "#000" : "#fff",
                    padding: "0.5em 1em",
                    textAlign: "left"
                }}
            >
                <div>{text}</div>
            </div>
            <div style={{ textAlign: 'start', fontSize: '0.8em' }}>
                {timestamp}
            </div>
        </div>
    )
}