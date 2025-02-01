export const mockTimetable = {
  1: [
    {
      end: "08:50",
      start: "08:00",
      subject: "",
    },
    {
      end: "09:40",
      start: "08:50",
      subject: "",
    },
    {
      end: "10:35",
      start: "09:45",
      subject: "",
    },
    {
      end: "11:30",
      start: "10:40",
      subject: "",
    },
    {
      end: "12:25",
      start: "11:35",
      subject: "",
    },
    {
      end: "13:20",
      start: "12:30",
      subject: "",
    },
    {
      end: "14:15",
      start: "13:25",
      subject: "",
    },
    {
      end: "15:10",
      start: "14:20",
      subject: "",
    },
    {
      end: "16:00",
      start: "15:10",
      subject: "",
    },
    {
      end: "16:50",
      start: "16:00",
      subject: "",
    },
  ],
  2: [
    {
      end: "08:50",
      start: "08:00",
      subject: "",
    },
    {
      end: "09:40",
      start: "08:50",
      subject: "",
    },
    {
      end: "10:35",
      start: "09:45",
      subject: "",
    },
    {
      end: "11:30",
      start: "10:40",
      subject: "",
    },
    {
      end: "12:25",
      start: "11:35",
      subject: "",
    },
    {
      end: "13:20",
      start: "12:30",
      subject: "",
    },
    {
      end: "14:15",
      start: "13:25",
      subject: "",
    },
    {
      end: "15:10",
      start: "14:20",
      subject: "",
    },
    {
      end: "16:00",
      start: "15:10",
      subject: "",
    },
    {
      end: "16:50",
      start: "16:00",
      subject: "",
    },
  ],
  3: [
    {
      end: "08:50",
      start: "08:00",
      subject: "",
    },
    {
      end: "09:40",
      start: "08:50",
      subject: "",
    },
    {
      end: "10:35",
      start: "09:45",
      subject: "",
    },
    {
      end: "11:30",
      start: "10:40",
      subject: "",
    },
    {
      end: "12:25",
      start: "11:35",
      subject: "",
    },
    {
      end: "13:20",
      start: "12:30",
      subject: "",
    },
    {
      end: "14:15",
      start: "13:25",
      subject: "",
    },
    {
      end: "15:10",
      start: "14:20",
      subject: "",
    },
    {
      end: "16:00",
      start: "15:10",
      subject: "",
    },
    {
      end: "16:50",
      start: "16:00",
      subject: "",
    },
  ],
  4: [
    {
      end: "08:50",
      start: "08:00",
      subject: "",
    },
    {
      end: "09:40",
      start: "08:50",
      subject: "",
    },
    {
      end: "10:35",
      start: "09:45",
      subject: "",
    },
    {
      end: "11:30",
      start: "10:40",
      subject: "",
    },
    {
      end: "12:25",
      start: "11:35",
      subject: "",
    },
    {
      end: "13:20",
      start: "12:30",
      subject: "",
    },
    {
      end: "14:15",
      start: "13:25",
      subject: "",
    },
    {
      end: "15:10",
      start: "14:20",
      subject: "",
    },
    {
      end: "16:00",
      start: "15:10",
      subject: "",
    },
    {
      end: "16:50",
      start: "16:00",
      subject: "",
    },
  ],
  5: [
    {
      end: "08:50",
      start: "08:00",
      subject: "",
    },
    {
      end: "09:40",
      start: "08:50",
      subject: "",
    },
    {
      end: "10:35",
      start: "09:45",
      subject: "",
    },
    {
      end: "11:30",
      start: "10:40",
      subject: "",
    },
    {
      end: "12:25",
      start: "11:35",
      subject: "",
    },
    {
      end: "13:20",
      start: "12:30",
      subject: "",
    },
    {
      end: "14:15",
      start: "13:25",
      subject: "",
    },
    {
      end: "15:10",
      start: "14:20",
      subject: "",
    },
    {
      end: "16:00",
      start: "15:10",
      subject: "",
    },
    {
      end: "16:50",
      start: "16:00",
      subject: "",
    },
  ],
};

export function checkSchedule(schedule) {
  const subjects = [
    ...new Set(
      Object.values(schedule)
        .flat()
        .filter((entry) => entry && entry.subject)
        .map((entry) => entry.subject)
        .sort()
    ),
  ];
  if (subjects.length > 0) {
    return true;
  } else {
    return false;
  }
}
