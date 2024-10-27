import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as apiService from "../services/apiService";
import * as toastService from "../services/toastService";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getProtected();
        toastService.success("Successfully logged in");
        console.log(data);
      } catch (error) {
        toastService.error("Error validating auth token");
        return navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
