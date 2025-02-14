"use client";

import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextAnimate } from "@/components/ui/text-animate";
import { GoogleIcon } from "./components/GoogleIcon";
import Safari from "@/components/ui/safari";
import image from "./assets/hero.png";
import useAuthenticate from "./hooks/useAuthenticate";
import { login } from "./lib/auth";
import LinksBackground from "./components/background";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const App = () => {
  const authenticated = useAuthenticate();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center w-full min-h-screen p-4 md:p-5 mb-20">
      <LinksBackground value={40} />
      <div className="flex flex-1 flex-col gap-4 justify-start mt-8 2xl:mt-16 items-center w-full h-full p-2">
        <InteractiveHoverButton className="w-fit my-2 md:my-2 select-none">
          <Link to={import.meta.env.VITE_PUBLIC_GITHUB_URL}>
            Free & Open Source
          </Link>
        </InteractiveHoverButton>
        <TextAnimate
          animation="slideUp"
          by="word"
          startOnView={false}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium select-none text-center"
        >
          Your Timetable, Always in Sync
        </TextAnimate>
        <TextAnimate
          animation="blurIn"
          as="h1"
          startOnView={false}
          className="text-base md:text-lg lg:text-xl w-full sm:w-[80%] md:w-[70%] lg:w-[50%] text-center font-normal select-none"
        >
          Orderly scrapes SRM Academia to fetch the current day order and
          seamlessly syncs your class schedule with Google Calendar. Just log in
          once, save your timetable and let Orderly handle the rest. Your
          calendar will update automatically every day.
        </TextAnimate>

        {authenticated ? (
          <Button
            className="w-fit flex gap-2 font-light select-none mt-2"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-fit flex gap-2 font-light select-none mt-2"
                  onClick={login}
                >
                  <GoogleIcon />
                  <p>Login with Google</p>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-white select-none max-w-64 text-center">
                <p>
                  Please disable cookie blockers/extensions for this website
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="w-full max-w-[1000px] mt-8 px-4">
          <Safari
            url="orderly.vercel.app"
            className="w-full h-auto"
            imageSrc={image}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
