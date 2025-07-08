import type { LoggedInUserDTO } from "./loggedInUserDTO";

export interface AuthResult {
    success: boolean;
    message: string;
    user?: LoggedInUserDTO;
}