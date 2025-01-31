import React from "react";
import { useState } from "react";
import axiosInstance from "../lib/axios";
import { useEffect } from "react";

const useAuthenticate = () => {
  const [authenticated, setAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/verify");
        setAuthenticated(data.success);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);
  return authenticated;
};

export default useAuthenticate;
