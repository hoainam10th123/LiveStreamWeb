export interface IUser {
    id: string;
    username: string;
    displayName: string;
    token: string;
}

export interface UserLogin {
    password: string;
    username: string;
}