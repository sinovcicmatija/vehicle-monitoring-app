import type { CarDataDTO } from "../components/Util/carDataDTO";
import api from "../api/apiService";


export const getCarData = async (): Promise<CarDataDTO> => {

    try {
        var response = await api.get('Vehicle/decodevin');
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const startCarDataTransfer = async () => {

    try {
        await api.get('Vehicle/startLiveStream')
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");

    }
}

export const stopCarDataTransfer = async () => {

    try {
        await api.get('Vehicle/stopLiveStream')
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");

    }
}