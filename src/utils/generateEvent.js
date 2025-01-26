import createEventDateTime from "./timeConverter.js";

const generateEvent = (subject, startTime, endTime) => {
  const start = createEventDateTime(startTime);
  const end = createEventDateTime(endTime);

  return {
    summary: subject,
    location: "SRM",
    description: "Class",
    start: {
      dateTime: start,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: end,
      timeZone: "Asia/Kolkata",
    },
    reminders: {
      useDefault: false,
    },
  };
};

export default generateEvent;
