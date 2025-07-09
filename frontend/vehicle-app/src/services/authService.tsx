import api from "../api/apiService";
import type { AuthResult } from "../components/Util/authResult";
import type { LoginUserDTO } from "../components/Util/loginUserDTO";
import type { RegisterUserDTO } from "../components/Util/registerUserDTO";



export const loginUser = async (dto: LoginUserDTO): Promise<AuthResult> => {

    try {
        var response = await api.post('Auth/loginuser', dto);
        return response.data;
    }
    catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška u komunikaciji s poslužiteljem");
        }
    }
}

export const registerUser = async (dto: RegisterUserDTO): Promise<AuthResult> => {
    try {
        var response = await api.post('Auth/registeruser', dto);
        return response.data;
    }
    catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška u komunikaciji s poslužiteljem");
        }
    }
}






