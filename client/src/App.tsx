import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthDiscord from "./pages/AuthDiscord";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/discord" element={<AuthDiscord />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
