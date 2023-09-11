export interface IRooms {
    _id : string,
    roomId: string,
    alternativeRoomId: string,
    members: Array<string>,
    isGroupChat: boolean,
    metadata: {
        lastmessage: string,
        lasttimestamp: Date,
    }
}

export interface IUpdatedLastMessage{
    room: string,
    message: string,
    timestamp: Date,
}