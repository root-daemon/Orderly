"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EventBlock = ({ enabled, loading, toggleEnabled, createCalendar }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-center items-center gap-2.5">
        <span className="text-base font-medium select-none text-[#2979db]">
          Automated Events
        </span>
        <Switch
          checked={enabled}
          key={enabled}
          disabled={loading}
          onCheckedChange={toggleEnabled}
          className="ml-1"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>?</TooltipTrigger>
            <TooltipContent className="max-w-36">
              <p>
                Once enabled, your Google Calendar will update daily at midnight
                with your class schedule for that day order.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="select-none" disabled={loading}>
            Manual Trigger
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90%] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manual Calendar Update</DialogTitle>
            <DialogDescription className="text-start">
              Are you sure you want to manually add today's classes to your
              Google Calendar?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your Google Calendar will be updated at midnight every day. If your
            calendar hasn't been updated, use the manual trigger.
          </p>

          <p className="text-sm text-muted-foreground">
            Also make sure to enable automated events!
          </p>
          <DialogFooter>
            <Button
              onClick={() => {
                createCalendar();
                setOpen(false);
              }}
            >
              Update Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventBlock;
