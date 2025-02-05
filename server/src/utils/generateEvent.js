import createEventDateTime from "./timeConverter.js";

const generateEvent = (subject, startTime, endTime, specificDate) => {
  const start = createEventDateTime(startTime, specificDate);
  const end = createEventDateTime(endTime, specificDate);

  return {
    summary: subject,
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
    extendedProperties: {
      private: {
        generated_by: "Orderly",
      },
    },
  };
};

export default generateEvent;
