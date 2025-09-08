import { CalendarEvent, SpecialDay } from "./calendar";

export interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  showPastDates?: boolean;
  handleEventClick?: (e: React.MouseEvent, event: CalendarEvent) => void;
  isLoading?: boolean;
  specialDays?: SpecialDay[];
  startOfWeek?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}

export interface WeekHeaderProps {
  weekDays: Date[];
  currentDate: Date;
  isPastDate: (date: Date) => boolean;
  isSpecialDay: boolean;
  specialDayContent?: SpecialDay;
}

export interface FullDayEventsWeekViewProps {
  events: CalendarEvent[];
  onEventClick?: (e: React.MouseEvent, event: CalendarEvent) => void;
}
