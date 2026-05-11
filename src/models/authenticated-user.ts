export interface AuthenticatedUser {
    fullName: string;
    firstName: string;
    lastName: String
    username: string;
    email: string;
    picture: string;
    roles: string[];
    permissions: string[];
}