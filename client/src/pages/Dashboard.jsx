import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableForm from "../components/TimetableForm";
import Timetable from "../components/Timetable";
import axiosInstance from "../lib/axios";
import { getUniqueSubjects } from "../lib/utils";
import { mockTimetable } from "../data/data";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [timetable, setTimetable] = useState(mockTimetable);
  const [dayOrder, setDayOrder] = useState(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState(["None"]);
  const [enabled, setEnabled] = useState();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const getTimetable = async () => {
    const { data } = await axiosInstance.get("/api/timetable");
    const response = data.data.timetable;
    if (response) {
      setTimetable(data.data.timetable);
      const uniqueSubjects = getUniqueSubjects(data.data.timetable);
      setSubjects(uniqueSubjects);
    }
  };

  const getDayOrder = async () => {
    try {
      const { data } = await axiosInstance.get("/api/dayorder");
      if (data.success) {
        setDayOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching dayorder:", error);
    }
  };

  const createCalendar = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/calendar");
      if (data.success) {
        toast({
          title: "Added timetable to calendar",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding timetable to calendar", error);
      toast({
        variant: "destructive",
        title: "Could not add events to calendar",
      });
      setLoading(false);
    }
  };

  const getEnabled = async () => {
    try {
      const { data } = await axiosInstance.get("/api/job");
      if (data.success) {
        setEnabled(data.data.enabled);
      }
    } catch (error) {
      setEnabled(false);
      console.error("Error fetching job:", error);
    }
  };

  const toggleEnabled = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/api/job", {
        enabled: !enabled,
      });
      if (data.success) {
        toast({
          title: `Set automated events to ${data.data}`,
        });
        setEnabled(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error toggling  job:", error);
      toast({
        variant: "destructive",
        title: "Could not set automated events",
      });
      setEnabled(enabled);
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && subjectInput.trim()) {
      setSubjects((prevSubjects) => {
        return [...prevSubjects, subjectInput.trim()].sort();
      });
      setSubjectInput("");
    }
  };

  const removeSubject = (remove) => {
    const filtered = subjects.filter((subject) => subject !== remove);
    setSubjects(filtered);
  };

  useEffect(() => {
    getTimetable();
    getDayOrder();
    getEnabled();
  }, []);

  return (
    <div className="w-[95%] md:w-[80%] lg:w-[70%] min-h-screen flex flex-col gap-2 justify-start mx-auto items-center p-8">
      <h1 className="self-start font-semibold text-xl mb-4 select-none">
        Today's Day Order: {dayOrder === 0 ? "Holiday" : dayOrder}
      </h1>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-center items-center gap-4">
          <span className="text-base font-medium select-none text-[#2979db]">
            Automated Events
          </span>
          <Switch
            checked={enabled}
            key={enabled}
            disabled={loading}
            onCheckedChange={toggleEnabled}
          />
        </div>
        <Button
          onClick={createCalendar}
          className="select-none"
          disabled={loading}
        >
          Manual Trigger
        </Button>
      </div>

      <h1 className="self-start font-semibold text-xl mb-4 select-none">
        Your Subjects:
      </h1>
      <div className="flex flex-wrap justify-start items-start w-full gap-2 mb-4">
        {subjects.length > 1 ? (
          subjects.map((subject) =>
            subject === "None" ? (
              ""
            ) : (
              <span
                key={subject}
                className="bg-[#232323] text-white px-3 py-1.5 rounded-lg cursor-pointer select-none"
                onClick={() => {
                  removeSubject(subject);
                }}
              >
                {subject}
              </span>
            )
          )
        ) : (
          <p className="">You haven't added any subjects yet</p>
        )}
      </div>

      <div className="w-full mb-8">
        <Input
          value={subjectInput}
          onKeyDown={handleEnter}
          placeholder="Add your subjects (press enter to add)"
          type="text"
          onChange={(e) => setSubjectInput(e.target.value)}
          className="py-6 select-none"
        />
      </div>

      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="timetable" className="select-none">
            Your Timetable
          </TabsTrigger>
          <TabsTrigger value="form" className="select-none">
            Edit Timetable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timetable">
          <Timetable timetable={timetable} />
        </TabsContent>
        <TabsContent value="form">
          <TimetableForm
            subjects={subjects}
            timetable={timetable}
            setTimetable={setTimetable}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
