import { isBefore, startOfDay } from "date-fns";
import { useCallback, useMemo } from "react";
import type { CalendarEvent } from "@/types/calendar";

export function useWeekViewCalculations(
  date: Date,
  events: CalendarEvent[],
  showPastDates: boolean,
  startOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
) {
  const weekDays = useMemo(() => {
    const weekDaysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const startIdx = startOfWeek
      ? weekDaysMap.indexOf(startOfWeek.trim().toLowerCase())
      : 1;
    const todayIdx = date.getDay();
    const diff = (todayIdx - startIdx + 7) % 7;
    const startOfWeekDate = new Date(date);
    startOfWeekDate.setDate(date.getDate() - diff);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeekDate);
      day.setDate(startOfWeekDate.getDate() + i);
      return day;
    });
  }, [date, startOfWeek]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const fullDayEvents = useMemo(
    () => events.filter((event) => event.isFullDay),
    [events]
  );

  const isPastDate = useCallback(
    (day: Date) => {
      return (
        !showPastDates && isBefore(startOfDay(day), startOfDay(new Date()))
      );
    },
    [showPastDates]
  );

  const getEventsForHourAndDay = useCallback(
    (hour: number, day: Date) =>
      events.filter(
        (event) =>
          !event.isFullDay &&
          new Date(event.start).getHours() === hour &&
          new Date(event.start).getDate() === day.getDate()
      ),
    [events]
  );

  return {
    weekDays,
    hours,
    fullDayEvents,
    isPastDate,
    getEventsForHourAndDay,
  };
}
