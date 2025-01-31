import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
