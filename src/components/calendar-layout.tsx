import { motion } from "framer-motion";
import { Fragment, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getEventsForDate } from "@/utils/calendar-utils";
import { filterEvents } from "@/utils/event-filters";
import type {
  CalendarEvent,
  CalendarView,
  EventarProps,
  FilterColors,
} from "@/types/calendar";
import { SpinnerVariant } from "@/types/spinner.types";
import { DEFAULT_FILTER_COLORS } from "../constants/colors";
import { CalendarHeader } from "./calendar-header";
import { ErrorBoundary } from "./error-boundary";
import { DayEventsModal } from "./modals/day-events-modal";
import { EventViewModal } from "./modals/event-view-modal";
import { renderView } from "./render-view";

export function Eventar({
  events,
  navigation = true,
  views = ["day", "month"],
  defaultView = "month",
  yearRange,
  showPastDates = true,
  isLoading,
  error,
  spinnerComponent = SpinnerVariant.SQUARE,
  theme = "light",
  customEventViewer,
  defaultModalConfig,
  showAgenda = false,
  showClock = false,
  resources = [],
  specialDays = [],
  startOfWeek = "Sun"
}: EventarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useLocalStorage<string[]>(
    "eventar-selected-colors",
    []
  );
  const [selectedResource, setSelectedResource] = useLocalStorage<string>(
    "eventar-selected-resource",
    "all"
  );

  const currentYear = new Date().getFullYear().toString();

  if (yearRange?.length && !yearRange.includes(currentYear)) {
    throw new Error(`YearRange must include the current year (${currentYear})`);
  }

  const validYearRange = yearRange?.length
    ? [...yearRange].sort((a, b) => Number(a) - Number(b))
    : [currentYear];

  const [view, setView] = useLocalStorage<CalendarView>(
    "eventar-current-view",
    defaultView
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendaView, setAgendaView] = useLocalStorage<boolean>(
    "eventar-agenda-view",
    false
  );

  const availableColors: FilterColors[] = useMemo(() => {
    const resourceEvents =
      selectedResource === "all"
        ? events
        : events.filter((event) => event.resourceId === selectedResource);

    const validColors = resourceEvents
      .map((event) => event.color)
      .filter(
        (color) =>
          typeof color === "string" &&
          color.trim() !== "" &&
          color in DEFAULT_FILTER_COLORS
      )
      .map(
        (color) =>
          DEFAULT_FILTER_COLORS[color as keyof typeof DEFAULT_FILTER_COLORS]
      );

    return Array.from(new Set(validColors));
  }, [events, selectedResource]);

  const filteredEvents = filterEvents(events, {
    view,
    currentDate,
    selectedColors,
    selectedResource,
  });

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <Fragment>
      <div className={`${theme === "dark" ? "dark" : ""}`} id="eventar-wrapper">
        <div
          className="flex flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
          id="calendar-layout"
        >
          <CalendarHeader
            view={view}
            setView={setView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedColors={selectedColors}
            onColorToggle={handleColorToggle}
            navigation={navigation}
            showViewOptions={views}
            yearRange={validYearRange}
            availableColors={availableColors}
            showAgenda={showAgenda}
            agendaView={agendaView}
            handleAgendaView={() => setAgendaView(!agendaView)}
            showClock={showClock}
            resources={resources}
            selectedResource={selectedResource}
            onResourceChange={setSelectedResource}
          />
          <motion.main
            id="calendar-view"
            className="flex-1 p-4"
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorBoundary>
              {renderView({
                view,
                currentDate,
                filteredEvents,
                showPastDates,
                customEventViewer,
                isLoading,
                error,
                spinnerComponent,
                setSelectedDate,
                setIsDayModalOpen,
                setSelectedEvent,
                setIsEventModalOpen,
                agendaView,
                specialDays,
                startOfWeek
              })}
            </ErrorBoundary>
          </motion.main>
        </div>
      </div>

      {selectedDate && (
        <DayEventsModal
          date={selectedDate}
          events={getEventsForDate(selectedDate, events)}
          isOpen={isDayModalOpen}
          onClose={() => {
            setIsDayModalOpen(false);
            setSelectedDate(null);
          }}
        />
      )}

      {selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
          customComponent={customEventViewer}
          defaultModalConfig={defaultModalConfig}
        />
      )}
    </Fragment>
  );
}
