import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import axiosInstance from "../lib/axios";

const PrivateRoute = () => {
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

  if (loading) return <div>Loading</div>;

  return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
