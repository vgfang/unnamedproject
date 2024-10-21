import { useEffect } from "react";

import * as apiService from "../services/apiService";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getTest();
      return data;
    };

    try {
      const result = fetchData();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
