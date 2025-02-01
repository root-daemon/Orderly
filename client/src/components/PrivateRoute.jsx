import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import axiosInstance from "../lib/axios";
import Navbar from "./Navbar";
import useAuthenticate from "../hooks/useAuthenticate";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);

  const authenticated = useAuthenticate();

  useEffect(() => {
    if (authenticated == true || authenticated == false) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authenticated]);

  if (loading)
    return (
      <div className="flex w-full min-h-screen justify-center items-center">
        Loading
      </div>
    );

  return authenticated ? (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
