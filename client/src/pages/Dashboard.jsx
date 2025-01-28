import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import TimetableForm from "../components/TimetableForm";
import axiosInstance from "../lib/axios";
import Timetable from "../components/Timetable";
import { useState } from "react";

const Dashboard = () => {
  const [timetable, setTimetable] = useState([]);

  const verifyUser = async () => {
    const result = await axiosInstance.get("/auth/verify");
    // console.log(result);
  };

  const getTimetable = async () => {
    const { data } = await axiosInstance.get("/api/timetable");
    console.log(data.data.timetable);
    setTimetable(data.data.timetable);
  };

  useEffect(() => {
    verifyUser();
    getTimetable();
  }, []);

  const logout = async () => {
    const result = await axiosInstance.get("/auth/logout");
    console.log(result);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Button onClick={verifyUser}>verify</Button>

      <Button onClick={logout}>Logout</Button>
      <Button onClick={getTimetable}>Get Timetbale</Button>
      <Timetable timetable={timetable} />
      <TimetableForm />
    </div>
  );
};

export default Dashboard;
