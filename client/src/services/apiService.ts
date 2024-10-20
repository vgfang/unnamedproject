import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Backend base URL
});

export const getTest = async () => {
  try {
    const response = await api.get("test");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithDiscord = async (code: string) => {
  try {
    const body = { code: code };
    return await api.post("auth/login-discord", body);
  } catch (error) {
    throw error;
  }
};
