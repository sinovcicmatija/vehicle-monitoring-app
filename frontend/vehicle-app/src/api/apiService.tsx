import axios from "axios";
import { BACKEND_URL } from "./config";


const api = axios.create(
    {
        baseURL: `${BACKEND_URL}`,
        withCredentials: true
    }
);

export default api;