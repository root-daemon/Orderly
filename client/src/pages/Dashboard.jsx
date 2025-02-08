import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableForm from "../components/TimetableForm";
import Timetable from "../components/Timetable";
import axiosInstance from "../lib/axios";
import { getUniqueSubjects } from "../lib/utils";
import { mockTimetable } from "../data/data";
import { useToast } from "@/hooks/use-toast";
import EventBlock from "../components/EventBlock";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [timetable, setTimetable] = useState(mockTimetable);
  const [dayOrder, setDayOrder] = useState(null);
  const [subjects, setSubjects] = useState(["None"]);
  const [enabled, setEnabled] = useState();
  const [loading, setLoading] = useState(false);
  const [scrapeDisabled, setScrapeDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
      });
    }
  };

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

  const scrapeTimetable = async () => {
    setLoading(true);
    if (scrapeDisabled || (email.length >= 1 && password.length >= 1)) {
      try {
        const { data } = await axiosInstance.post("/api/scrape", {
          email,
          password,
        });
        if (data.success) {
          toast({
            title: "Scraped timetable from Academia",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error scraping timetable from academia", error);
        toast({
          variant: "destructive",
          title: "Could not scrape timetable from academia",
        });
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please enter both email and password",
      });
    }
  };

  const getAcademiaEmail = async () => {
    try {
      const { data } = await axiosInstance.get("/api/academia-email");
      if (data.success && data.data.academiaEmail) {
        setEmail(data.data.academiaEmail);
        setScrapeDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const deleteCookies = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/delete-cookies");
      if (data.success) {
        toast({
          title: `Logged out of Academia`,
        });
        setEnabled(data.data);
        setScrapeDisabled(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging out", error);
      toast({
        variant: "destructive",
        title: "Could not log out events",
      });
      setEnabled(enabled);
      setLoading(false);
      setScrapeDisabled(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    getTimetable();
    getDayOrder();
    getEnabled();
    setLoading(false);
    getAcademiaEmail();
  }, []);

  return (
    <div className="w-[95%] md:w-[80%] lg:w-[75%] min-h-screen flex flex-col gap-2 justify-start mx-auto items-center p-8">
      <Spinner loading={loading} />
      <h1 className="self-start font-semibold text-xl mb-4 select-none">
        Today's Day Order: {dayOrder === 0 ? "Holiday" : dayOrder}
      </h1>

      <EventBlock
        enabled={enabled}
        loading={loading}
        toggleEnabled={toggleEnabled}
        createCalendar={createCalendar}
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
          <Timetable
            timetable={timetable}
            email={email}
            password={password}
            handleEmailChange={handleEmailChange}
            setPassword={setPassword}
            scrapeTimetable={scrapeTimetable}
            scrapeDisabled={scrapeDisabled}
            deleteCookies={deleteCookies}
          />
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
