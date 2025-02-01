import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { days, hours } from "../data/data";
import axiosInstance from "../lib/axios";

export const TimetableForm = ({ subjects, timetable, setTimetable }) => {
  const handleInputChange = (dayOrder, index, value) => {
    const updatedTimetable = { ...timetable };
    updatedTimetable[dayOrder][index]["subject"] = value;
    setTimetable(updatedTimetable);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", { timetable });
    const data = await axiosInstance.post("/api/timetable", { timetable });
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto overflow-x-auto mt-4"
    >
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
          {days.map((day, dayIndex) => {
            const dayOrder = dayIndex + 1;
            return (
              <TableRow key={dayIndex}>
                <TableCell className="font-medium border w-24 py-6">
                  {day}
                </TableCell>
                {hours.map((_, hourIndex) => {
                  const currentSubject = timetable[dayOrder][hourIndex].subject;
                  return (
                    <TableCell className="border p-0" key={hourIndex}>
                      <Select
                        value={currentSubject === "None" ? "" : currentSubject}
                        onValueChange={(value) =>
                          handleInputChange(dayOrder, hourIndex, value)
                        }
                      >
                        <SelectTrigger className="w-full h-full border-0">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key={"None"} value={"None"}>-</SelectItem>
                          {subjects.length > 0 ? (
                            subjects
                              .filter((subject) => subject !== "None")
                              .map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))
                          ) : (
                            <p className="text-xs p-2">Add your subjects</p>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="w-full flex justify-center items-center">
        <Button type="submit" className="my-4">
          Save
        </Button>
      </div>
    </form>
  );
};

export default TimetableForm;
