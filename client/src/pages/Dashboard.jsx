import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableForm from "../components/TimetableForm";
import Timetable from "../components/Timetable";
import axiosInstance from "../lib/axios";
import { getUniqueSubjects } from "../lib/utils";
import { mockTimetable } from "../data/data";
import { useToast } from "@/hooks/use-toast";
import EventBlock from "../components/EventBlock";
import SubjectBlock from "../components/SubjectBlock";
import SubjectInput from "../components/SubjectInput";
import LinksBackground from "../components/background";

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
    const uniqueSubjects = getUniqueSubjects(timetable);

    if (uniqueSubjects.length > 1) {
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
    } else {
      toast({
        variant: "destructive",
        title: "Please add your subjects to the table",
      });
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
    const uniqueSubjects = getUniqueSubjects(timetable);

    if (uniqueSubjects.length > 1) {
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
    } else {
      toast({
        variant: "destructive",
        title: "Please add your subjects to the timetable",
      });
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && subjectInput.trim()) {
      if (subjects.includes(subjectInput.trim())) {
        toast({
          variant: "destructive",
          title: "Subject already exists",
        });
        return;
      }

      setSubjects([...subjects, subjectInput.trim()].sort());
      setSubjectInput("");
    }
  };

  const removeSubject = (remove) => {
    const filtered = subjects.filter((subject) => subject !== remove);
    setSubjects(filtered);
  };

  useEffect(() => {
    setLoading(true);
    getTimetable();
    getDayOrder();
    getEnabled();
    setLoading(false);
  }, []);

  return (
    <div className="w-[95%] md:w-[80%] lg:w-[70%] min-h-screen flex flex-col gap-2 justify-start mx-auto items-center p-8">
      {/* <LinksBackground value={20} /> */}
      <h1 className="self-start font-semibold text-xl mb-4 select-none">
        Today's Day Order: {dayOrder === 0 ? "Holiday" : dayOrder}
      </h1>

      <EventBlock
        enabled={enabled}
        loading={loading}
        toggleEnabled={toggleEnabled}
        createCalendar={createCalendar}
      />

      <SubjectBlock subjects={subjects} removeSubject={removeSubject} />

      <SubjectInput
        subjectInput={subjectInput}
        handleEnter={handleEnter}
        setSubjectInput={setSubjectInput}
      />

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
            enabled={enabled}
            setEnabled={setEnabled}
            setLoading={setLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
