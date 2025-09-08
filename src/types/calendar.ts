import { SpinnerVariant } from "./spinner.types";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  meeting_id?: string | number;
  series_id?: string | number;
  description?: string;
  batch?: string;
  course?: string;
  duration?: number; // in hours, For example, 1.5 hours
  color?: "blue" | "green" | "yellow" | "purple" | "red";
  isFullDay?: boolean;
  status?: "confirmed" | "tentative" | "cancelled";
  location?: string;
  locationDetail?: string;
  meetingLink?: string;
  recurring?: boolean;
  additionalInfo?: string;
  resourceId?: string;
};

export type CalendarView = "year" | "month" | "week" | "day";

export type Resource = {
  id: string;
  name: string;
  type: string;
  color?: string;
  description?: string;
};

export type FilterColors = {
  label: string;
  value: string;
  bgClass: string;
};

export type DefaultModalConfig = {
  showModalHeaderStrip?: boolean;
  disableActionButton?: boolean;
  actionButtonName?: string;
  titleStyles?: string;
};

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface FilterPopoverProps {
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  colors: FilterColors[];
}

export interface EventarProps {
  events: CalendarEvent[];
  views: CalendarView[];
  isLoading: boolean;
  error: string;
  navigation?: boolean;
  defaultView?: CalendarView;
  yearRange?: string[];
  showPastDates?: boolean;
  spinnerComponent?: SpinnerVariant;
  theme?: "dark" | "light";
  customEventViewer?: (event: CalendarEvent) => JSX.Element;
  defaultModalConfig?: DefaultModalConfig;
  showAgenda?: boolean;
  showClock?: boolean;
  resources?: Resource[];
  specialDays?: SpecialDay[];
  startOfWeek?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}

export interface RenderViewProps {
  view: CalendarView;
  currentDate: Date;
  filteredEvents: CalendarEvent[];
  showPastDates: boolean;
  customEventViewer?: (event: CalendarEvent) => JSX.Element;
  isLoading: boolean;
  error: string;
  spinnerComponent: SpinnerVariant;
  setSelectedDate: (date: Date | null) => void;
  setIsDayModalOpen: (isOpen: boolean) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsEventModalOpen: (isOpen: boolean) => void;
  agendaView: boolean;
  specialDays: SpecialDay[];
  startOfWeek?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}

export interface CalendarHeaderProps {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  navigation?: boolean;
  showViewOptions: CalendarView[];
  yearRange: string[];
  availableColors: FilterColors[];
  showAgenda: boolean;
  agendaView: boolean;
  handleAgendaView?: (agendaView: boolean) => void;
  showClock: boolean;
  resources: Resource[];
  selectedResource: string;
  onResourceChange: (resourceId: string) => void;
}

export interface ViewOptionsProps {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  showViewOptions: CalendarView[];
}

export interface NavigationProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: string;
  availableYears: number[];
}

export interface SpecialDay {
  date: string;
  title: string;
  description: string;
  type: string;
}
