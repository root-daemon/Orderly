import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import TimetableForm from "../components/TimetableForm";
import axiosInstance from "../lib/axios";
import Timetable from "../components/Timetable";
import { useState } from "react";

const Dashboard = () => {
  const [timetable, setTimetable] = useState([]);

  const getTimetable = async () => {
    const { data } = await axiosInstance.get("/api/timetable");
    setTimetable(data.data.timetable);
  };

  const createCalendar = async () => {
    const { data } = await axiosInstance.post("/api/calendar");
  };

  useEffect(() => {
    getTimetable();
  }, []);

  const logout = async () => {
    const result = await axiosInstance.get("/auth/logout");
    console.log(result);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Button onClick={logout}>Logout</Button>
      <Button onClick={createCalendar}>Create Calendar</Button>

      <Timetable timetable={timetable} />
      <TimetableForm />
    </div>
  );
};

export default Dashboard;
