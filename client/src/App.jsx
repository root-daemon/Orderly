import { Button } from "@/components/ui/button";
import React from "react";
import axiosInstance from "./lib/axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Github } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextAnimate } from "@/components/ui/text-animate";
import { GoogleIcon } from "./components/GoogleIcon";
import Safari from "@/components/ui/safari";
import image from "../public/hero.png";

const App = () => {
  const [authenticated, setAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   authenticated ? navigate("/dashboard") : "";
  // }, [authenticated]);

  const login = async () => {
    const { data } = await axiosInstance.get("/auth");
    window.location.href = data.data;
  };
  return (
    <div className="flex flex-col justify-center w-full min-h-screen p-5">
      {/* navbar */}
      <div className="flex justify-between w-full h-fit py-3  px-[20%] border-b">
        <div className="flex justify-center items-center gap-2">
          <CalendarDays className="h-7 w-7" />
          <h1 className="text-2xl font-medium select-none">Orderly</h1>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={login}
            className="w-fit select-none bg-black hover:bg-black/80"
          >
            <Github />
          </Button>
          <Button onClick={login} className="w-fit font-light select-none ">
            Get Started
          </Button>
        </div>
      </div>

      {/* Hero */}

      <div className="flex flex-1 flex-col gap-4 justify-start mt-24 items-center w-full h-full p-2 ">
        <InteractiveHoverButton className="w-fit my-6 select-none">
          Free & Open Source
        </InteractiveHoverButton>
        <TextAnimate
          animation="slideUp"
          by="word"
          className="text-6xl font-medium select-none"
        >
          Your Timetable, Always in Sync
        </TextAnimate>
        <TextAnimate
          animation="blurIn"
          as="h1"
          className="text-2xl w-[50%] text-center font-normal select-none"
        >
          Orderly scrapes Academia to fetch the current order and seamlessly
          syncs your class schedule with Google Calendar. Just log in once, save
          your timetable and let Orderly handle the rest. Your calendar will
          update automatically every day.
        </TextAnimate>

        <Button onClick={login} className="w-fit font-light select-none mt-4 ">
          <GoogleIcon></GoogleIcon>
          Login with Google
        </Button>

        <Safari
          url="orderly.vercel.app"
          className="w-[1000px]"
          imageSrc={image}
        />
      </div>
    </div>
  );
};

export default App;
