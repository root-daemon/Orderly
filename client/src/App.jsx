import { Button } from "@/components/ui/button";
import React from "react";
import axiosInstance from "./lib/axios";
import { useNavigate } from "react-router";

const App = () => {
  let navigate = useNavigate();

  const login = async () => {
    const { data } = await axiosInstance.get("/auth");
    window.location.href = data.data;
  };
  return (
    <div className="flex w-full min-h-screen ">
      <Button onClick={login}>Login</Button>
    </div>
  );
};

export default App;
