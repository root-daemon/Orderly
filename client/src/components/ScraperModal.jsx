"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "../lib/axios";

export function TimetableModal({
  email,
  password,
  handleEmailChange,
  setPassword,
  scrapeTimetable,
}) {
  const [open, setOpen] = useState(false);

  const handleScrapeTimetable = () => {
    scrapeTimetable();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="">Scrape Timetable</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scrape Timetable</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="col-span-4"
              placeholder="Academia Email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-4"
              placeholder="Academia Password"
            />
          </div>
        </div>

        <Button onClick={handleScrapeTimetable}>Scrape Timetable</Button>
      </DialogContent>
    </Dialog>
  );
}
