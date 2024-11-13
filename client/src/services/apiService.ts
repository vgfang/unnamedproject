import axios from "axios";

import * as ToastService from "./toastService";

import { type User } from "../../../server/models/user";

const api = axios.create({
  baseURL: "/api", // Backend base URL
});

// add a request interceptor for adding jwt authenication if in localstorage
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

// showing toast response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // server responded with a status code outside of 2xx
      ToastService.error(
        error.response.data?.message || "Something went wrong",
      );
    } else if (error.request) {
      ToastService.error("Network error. Please try again later");
    } else {
      ToastService.error("An unexpected error occurred");
    }

    return Promise.reject(error); // continue rejecting the promise
  },
);

export const getTest = async () => {
  const response = await api.get("test");
  return response.data;
};

export const loginWithDiscord = async (code: string, redirectURI: string) => {
  const body = { code: code, redirectURI: redirectURI };
  return await api.post("auth/login-discord", body);
};

export const getProtected = async () => {
  const response = await api.get("protected");
  return response.data;
};

export const registerOrLoginUser = async (
  email: string,
  password: string,
  isLoggingIn: boolean,
) => {
  const body = { email: email, password: password };
  if (isLoggingIn) {
    return await api.post("auth/login-email", body);
  } else {
    return await api.post("auth/register-email", body);
  }
};
