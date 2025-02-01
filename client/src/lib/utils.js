import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getUniqueSubjects(schedule) {
  return [
    "None",
    ...new Set(
      Object.values(schedule)
        .flat()
        .filter((entry) => entry && entry.subject)
        .map((entry) => entry.subject)
        .sort()
    ),
  ];
}
