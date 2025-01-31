"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const days = ["DO 1", "DO 2", "DO 3", "DO 4", "DO 5"];
const hours = [
  "08:00 - 08:50",
  "08:50 - 09:40",
  "09:45 - 10:35",
  "10:40 - 11:30",
  "11:35 - 12:25",
  "12:30 - 13:20",
  "13:25 - 14:15",
  "14:20 - 15:10",
  "15:10 - 16:00",
  "16:00 - 16:50",
];

export default function Timetable({ timetable }) {
  if (!timetable || Object.keys(timetable).length === 0) {
    return <div></div>;
  }

  return (
    <div className="flex w-full mx-auto py-10 ">
      <Table className="shadow-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] border">Time</TableHead>
            {days.map((day, index) => (
              <TableHead className="border text-center" key={index}>
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours.map((hour, hourIndex) => (
            <TableRow key={hourIndex}>
              <TableCell className="font-medium border">{hour}</TableCell>
              {days.map((_, dayIndex) => {
                const slot = timetable[dayIndex + 1]
                  ? timetable[dayIndex + 1][hourIndex]
                  : null;
                return (
                  <TableCell className="border" key={dayIndex}>
                    {slot && (
                      <div className="text-center">
                        <div className="font-semibold">{slot.subject}</div>
                        {/* <div className="text-xs text-gray-500">
                          {slot.start} - {slot.end}
                        </div> */}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
