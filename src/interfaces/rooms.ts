export interface IRooms {
    _id : string,
    members: Array<IMember>,
    isGroupChat: boolean,
    metadata: {
        lastmessage: string,
        lasttimestamp: Date,
    }
}

export interface IMember{
    roomId?: string,
    firstname: string,
    lastname: string,
    userId: string
}

export interface IUpdatedLastMessage{
    room: string,
    message: string,
    timestamp: Date,
}