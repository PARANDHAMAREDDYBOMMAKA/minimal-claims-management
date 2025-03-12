export interface JwtPayload {
    email: string;
    sub: string;
    role: string;
}

export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: string;
}