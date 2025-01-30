import { DateTime } from "luxon";

const createEventDateTime = (sessionStart, timeZone = "Asia/Kolkata") => {
  const currentDate = DateTime.now().setZone(timeZone).toFormat("yyyy-MM-dd");

  return `${currentDate}T${sessionStart}:00+05:30`;
};

export default createEventDateTime;
