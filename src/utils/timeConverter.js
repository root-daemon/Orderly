const createEventDateTime = (sessionStart, timeZoneOffset = "+05:30") => {
  const currentDate = new Date().toISOString().split("T")[0];
  return `${currentDate}T${sessionStart}:00${timeZoneOffset}`;
};

export default createEventDateTime;
