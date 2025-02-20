export default interface IServerRequest {
    token: (string | null);
    type: ("cashier"|"display");
}