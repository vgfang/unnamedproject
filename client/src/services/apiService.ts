import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Backend base URL
});

export const getTest = async () => {
  try {
    const response = await api.get("test");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
