import { useEffect } from "react";

import * as apiService from "../services/apiService";
import * as toastService from "../services/toastService";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getTest();
      toastService.info(data.toString());
      return data;
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
