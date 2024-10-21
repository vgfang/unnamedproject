import { useEffect } from "react";

import * as apiService from "../services/apiService";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getTest();
      console.log(data);
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
