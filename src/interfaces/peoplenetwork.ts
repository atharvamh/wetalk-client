export interface IUsersInNetwork {
    _id : string,
    firstname : string,
    lastname : string,
    isVerified : boolean,
    isOnline?: boolean,
    lastActivity: Date
}