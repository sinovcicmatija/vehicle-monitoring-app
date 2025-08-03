import type { CarDataDTO } from "../components/Util/carDataDTO";
import api from "../api/apiService";
import type { ServiceHistoryDTO } from "../components/Util/serviceHistoryDTO";
import type { ServiceEventDTO } from "../components/Util/serviceEventDTO";
import type { FollowedCarsDTO } from "../components/Util/followedCarsDTO";


export const getCarData = async (): Promise<CarDataDTO> => {

    try {
        var response = await api.get('Vehicle/decodevin');
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const getDtc = async (): Promise<string[]> => {

    try {
        var response = await api.get('Vehicle/dtc');
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

export const GetCarServiceHistory = async (vin: string): Promise<ServiceHistoryDTO[]> => {

    try {
        var response = await api.get(`Vehicle/getCarServiceHistory?vin=${vin}`);
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const SaveCarServiceEvent = async (serviceEvent: ServiceEventDTO) => {

    try {
        var response = await api.post("Vehicle/saveCarServiceEvent", serviceEvent);
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const GetFollowedCars = async (username: string): Promise<FollowedCarsDTO[]> => {

    try {
        var response = await api.get(`Vehicle/getFollowedCars?username=${username}`);
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const ConnectUserAndVehicle = async(username: string, vin: string) => {

    try {
        var response = await api.post(`Vehicle/connectUserAndVehicle?${username}&vin=${vin}`);
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const RemoveConnectionBetweenUserAndVehicle = async(username: string, vin: string) => {

    try {
        var response = await api.post(`Vehicle/removeConnectionBetweenUserAndVehicle?username=${username}&vin=${vin}`);
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}

export const GetServiceTypes = async (): Promise<string[]> => {

    try {
        var response = await api.get("Vehicle/getServiceTypes");
        return response.data;
    } catch (error: any) {
        throw new Error("Greška u komunikaciji s poslužiteljem");
    }
}