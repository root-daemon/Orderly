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
import { useToast } from "@/hooks/use-toast";
import { getUniqueSubjects } from "../lib/utils";
export const TimetableForm = ({
  subjects,
  timetable,
  setTimetable,
  enabled,
  setEnabled,
  setLoading,
}) => {
  const { toast } = useToast();

  const handleInputChange = (dayOrder, index, value) => {
    const subject = value === "None" ? "" : value;
    const updatedTimetable = { ...timetable };
    updatedTimetable[dayOrder][index]["subject"] = subject;
    setTimetable(updatedTimetable);
  };

  const handleSubmit = async (e) => {
    const uniqueSubjects = getUniqueSubjects(timetable);

    if (uniqueSubjects.length > 1) {
      e.preventDefault();
      try {
        setLoading(true);
        const { data } = await axiosInstance.post("/api/timetable", {
          timetable,
        });
        if (data.success) {
          const { data } = await axiosInstance.post("/api/job", {
            enabled: true,
          });
          if (data.success) {
            toast({
              title: "Updated Timetable",
              description: "Your Google Calendar will update tomorrow at 12am",
            });
          }
          setEnabled(data.data);
          setLoading(false);
        } else {
          toast({
            variant: "destructive",
            title: "Could not update timetable",
          });
          setEnabled(enabled);
          setLoading(false);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Could not update timetable",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title:
          "Cannot save empty timetable, You can switch off automated events if you need to",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto flex flex-col  overflow-x-auto mt-6 bg-white"
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
                <TableCell className="font-medium border min-w-20 py-6">
                  {day}
                </TableCell>
                {hours.map((_, hourIndex) => {
                  const currentSubject = timetable[dayOrder][hourIndex].subject;
                  return (
                    <TableCell className="border py-2 min-w-20" key={hourIndex}>
                      <Select
                        value={currentSubject === "None" ? "" : currentSubject}
                        onValueChange={(value) =>
                          handleInputChange(dayOrder, hourIndex, value)
                        }
                      >
                        <SelectTrigger className="max-w-24 border-0">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key={"None"} value={"None"}>
                            -
                          </SelectItem>
                          {subjects.length > 0 ? (
                            subjects
                              .filter((subject) => subject !== "None")
                              .map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject.split(":")[0]}
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
        <Button type="submit" className="my-4 text-base text-white px-10 py-4">
          Save
        </Button>
      </div>
    </form>
  );
};

export default TimetableForm;
