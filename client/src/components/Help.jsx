import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import subjects from "../assets/subjects.png";
import save from "../assets/save.png";
import trigger from "../assets/trigger.png";

const Help = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <HelpCircle className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to use Orderly</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ol className="list-decimal list-inside space-y-4">
            <li>Log in using your Google account.</li>
            <li>
              Add your subjects.
              <img
                src={subjects}
                alt="Add subjects"
                className="mt-2 w-full h-auto rounded-md"
              />
            </li>
            <li>
              Go to edit timetable and add your classes for each day order.
              <img
                src={save}
                alt="Edit timetable"
                className="mt-2 w-full h-auto rounded-md"
              />
            </li>
            <li>Save your timetable in the app.</li>
            <li>Enable automated events.</li>
            <li>
              Click "Manual Trigger" to add your schedule into Google Calendar
              the first time (Optional).
              <img
                src={trigger}
                alt="Manual trigger"
                className="mt-2 w-full h-auto rounded-md"
              />
            </li>
          </ol>
          <p className="text-base text-muted-foreground mt-4">
            Orderly will now scrape Academia daily at midnight and add your
            classes to your Google Calendar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Help;
