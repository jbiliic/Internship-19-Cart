export interface JwtPayload {
    id: number;
    isAdmin: boolean;
    iat?: number;
    exp?: number;
}