import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimetableModal } from "../components/ScraperModal";
import { days, hours } from "../data/data";

export const Timetable = ({
  timetable,
  email,
  password,
  handleEmailChange,
  setPassword,
  scrapeTimetable,
  scrapeDisabled,
}) => {
  return (
    <div className="flex flex-col w-full mt-6  mx-auto overflow-x-auto bg-white">
      <Table className="shadow-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="border">Day</TableHead>
            {hours.map((hour, index) => (
              <TableHead className="border text-pretty py-6" key={index}>
                {hour}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day, dayIndex) => (
            <TableRow key={dayIndex}>
              <TableCell className="font-medium border min-w-20 py-2">
                {day}
              </TableCell>
              {hours.map((_, hourIndex) => {
                const slot = timetable[dayIndex + 1][hourIndex];
                return (
                  <TableCell className="border" key={hourIndex}>
                    {slot && (
                      <h1 className="font-semibold w-24 min-h-10 inline-flex justify-center items-center text-center">
                        {slot.subject.split(":")[0]}
                      </h1>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex my-4 justify-center items-center">
        <TimetableModal
          email={email}
          password={password}
          handleEmailChange={handleEmailChange}
          setPassword={setPassword}
          scrapeTimetable={scrapeTimetable}
          scrapeDisabled={scrapeDisabled}
        />
      </div>
    </div>
  );
};

export default Timetable;
