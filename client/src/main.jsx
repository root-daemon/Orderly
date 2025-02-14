import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Layout from "./pages/Layout.jsx";
import { Toaster } from "@/components/ui/toaster";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
