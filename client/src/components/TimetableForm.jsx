import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockTimetable, timeSlots } from "../data/data";
import axiosInstance from "../lib/axios";

export const TimetableForm = () => {
  const [timetable, setTimetable] = useState(mockTimetable);

  const handleInputChange = (dayOrder, index, value, start, end) => {
    const updatedTimetable = { ...timetable };
    if (!updatedTimetable[dayOrder][index]) {
      updatedTimetable[dayOrder][index] = { subject: "", start: "", end: "" };
    }
    updatedTimetable[dayOrder][index]["subject"] = value;
    updatedTimetable[dayOrder][index]["start"] = start;
    updatedTimetable[dayOrder][index]["end"] = end;

    setTimetable(updatedTimetable);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", { timetable });
    const data = await axiosInstance.post("/api/timetable", { timetable });
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full  max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Timetable Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1">
            <TabsList className="grid w-full grid-cols-5 my-3">
              {Object.keys(timetable).map((dayOrder) => (
                <TabsTrigger key={dayOrder} value={dayOrder}>
                  DO {dayOrder}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.keys(timetable).map((dayOrder) => (
              <TabsContent key={dayOrder} value={dayOrder}>
                <Card>
                  <CardHeader>
                    <CardTitle>Day {dayOrder}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {timeSlots.map((slot, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm text-gray-500">
                            <p>{slot.start}</p>
                            <p>{slot.end}</p>
                          </div>
                          <Input
                            type="text"
                            placeholder="Subject"
                            value={timetable[dayOrder][index]?.subject || ""}
                            onChange={(e) =>
                              handleInputChange(
                                dayOrder,
                                index,
                                e.target.value,
                                slot.start,
                                slot.end
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Timetable</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default TimetableForm;
