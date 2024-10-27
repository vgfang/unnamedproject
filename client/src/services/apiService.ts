import axios from "axios";
import { type User } from "../../../server/models/user";

const api = axios.create({
  baseURL: "/api", // Backend base URL
});

// add a request interceptor for jwt authenication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtAccess");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export const getTest = async () => {
  try {
    const response = await api.get("test");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithDiscord = async (code: string, redirectURI: string) => {
  try {
    const body = { code: code, redirectURI: redirectURI };
    return await api.post("auth/login-discord", body);
  } catch (error) {
    throw error;
  }
};

export const getProtected = async () => {
  try {
    const response = await api.get("protected");
    return response.data;
  } catch (error) {
    throw error;
  }
};
