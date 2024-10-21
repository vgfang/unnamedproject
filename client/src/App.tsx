import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthDiscord from "./pages/AuthDiscord";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/discord" element={<AuthDiscord />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
