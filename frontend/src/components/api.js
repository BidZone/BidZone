import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
};