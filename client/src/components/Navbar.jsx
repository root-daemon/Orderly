import { Github } from "lucide-react";
import { CalendarDays } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import useAuthenticate from "../hooks/useAuthenticate";
import { login, logout } from "../lib/auth";
import { Link } from "react-router";

const Navbar = () => {
  const authenticated = useAuthenticate();

  return (
    <nav className="flex  sm:flex-row justify-between w-full h-fit py-3 px-4 sm:px-[5%] md:px-[10%] lg:px-[20%] border-b gap-4 sm:gap-0">
      <Link className="flex justify-center items-center gap-2" to={"/"}>
        <CalendarDays className="h-6 w-6 md:h-7 md:w-7" />
        <h1 className="text-xl md:text-2xl font-medium select-none">Orderly</h1>
      </Link>
      <div className="flex justify-center items-center gap-4">
        <Button className="w-fit select-none bg-black hover:bg-black/80">
          <Link to={import.meta.env.VITE_PUBLIC_GITHUB_URL}>
            <Github className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          onClick={authenticated ? logout : login}
          className="w-fit font-light select-none"
        >
          {authenticated ? "Logout" : "Get Started"}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
