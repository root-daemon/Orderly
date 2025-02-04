import { DateTime } from "luxon";

const createEventDateTime = (
  sessionStart,
  specificDate,
  timeZone = "Asia/Kolkata"
) => {
  return `${specificDate}T${sessionStart}:00+05:30`;
};

export default createEventDateTime;
