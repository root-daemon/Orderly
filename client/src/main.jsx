import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Layout from "./pages/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<App />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
