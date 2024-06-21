export interface UserData {
    id: string;
    image?: string;
    permission: any;
    name: string;
    mobile: number;
    email: string;
    dateOfBirth: string;
    address?: string;
    isActive: boolean;
}

export interface User {
    message: string;
    data: UserData;
}

export interface UserContainer {
    user: User;
}
