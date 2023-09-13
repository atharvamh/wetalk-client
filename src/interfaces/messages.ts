export interface IMessage{
    sender: string,
    timestamp: number,
    message: string,
}

export interface IUserMessage extends IMessage{
    roomId: string
}