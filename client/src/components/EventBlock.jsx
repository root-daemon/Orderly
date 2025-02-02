import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EventBlock = ({ enabled, loading, toggleEnabled, createCalendar }) => {
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
      <Button
        onClick={createCalendar}
        className="select-none"
        disabled={loading}
      >
        Manual Trigger
      </Button>
    </div>
  );
};

export default EventBlock;
