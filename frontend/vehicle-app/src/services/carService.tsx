import type { CarDataDTO } from "../components/Util/carDataDTO";
import api from "../api/apiService";


export const getCarData = async (): Promise<CarDataDTO> => {

    try {
        var response = await api.get('Vehicle/decodevin');
        return response.data;
    } catch(error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}