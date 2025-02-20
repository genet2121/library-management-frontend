
export default interface IServerResponse {
    status: ("online"|"incoming"|"new_user"|"online_users"|"user_disconnected"|"error");
    data: any;
    from?: any;
}