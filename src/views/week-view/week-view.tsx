import { FullDayEvents } from "@/views/week-view/full-day-events";
import { WeekHeader } from "@/views/week-view/week-header";
import { WeekViewSkeleton } from "@/views/week-view/week-view-skeleton";
import { format, getWeek } from "date-fns";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/error-boundary";
import { useWeekViewCalculations } from "@/hooks/use-week-view-calculations";
import { getEventBackgroundColorClass } from "@/utils/color-utils";
import { isSpecialDay } from "@/utils/date-utils";
import { WeekViewProps } from "@/types/week";

export function WeekView({
  date,
  events,
  showPastDates = true,
  handleEventClick,
  isLoading,
  specialDays,
  startOfWeek
}: WeekViewProps) {
  const { weekDays, hours, fullDayEvents, isPastDate } =
    useWeekViewCalculations(date, events, showPastDates, startOfWeek);

  if (isLoading) {
    return <WeekViewSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col space-y-4" id="week-view">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Week {getWeek(date)}</span>
        </div>

        <FullDayEvents events={fullDayEvents} onEventClick={handleEventClick} />

        <div className="flex-1 rounded-lg border">
          <WeekHeader
            weekDays={weekDays}
            currentDate={date}
            isPastDate={isPastDate}
            isSpecialDay={isSpecialDay(date, specialDays ?? [])}
            specialDayContent={specialDays?.find((day) =>
              isSpecialDay(date, [day])
            )}
          />

          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="sticky left-0 p-2 text-right text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 group-hover:font-medium transition-all">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`relative border-l min-h-[3rem] transition-all group/day ${
                      isPastDate(day)
                        ? "opacity-50 bg-zinc-100 dark:bg-zinc-800"
                        : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {events
                      .filter(
                        (event) =>
                          !event.isFullDay &&
                          new Date(event.start).getHours() === hour &&
                          new Date(event.start).getDate() === day.getDate()
                      )
                      .map((event, eventIndex, eventArray) => (
                        <motion.div
                          key={event.id}
                          className={`absolute left-0 right-0 mx-1 rounded-lg text-sm cursor-pointer ${
                            isPastDate(day)
                              ? "grayscale brightness-95 opacity-50"
                              : ""
                          } border shadow-sm hover:shadow-md transition-all duration-200`}
                          style={{
                            top: `${
                              (new Date(event.start).getMinutes() / 60) * 100
                            }%`,
                            height: `${
                              ((new Date(event.end).getTime() -
                                new Date(event.start).getTime()) /
                                (1000 * 60 * 60)) *
                              100
                            }%`,
                            transform:
                              eventArray.length > 1
                                ? `translateX(${eventIndex * 4}px) rotate(${
                                    eventIndex * 0.5
                                  }deg)`
                                : "none",
                            zIndex: eventArray.length - eventIndex,
                          }}
                        >
                          <div
                            onClick={(e) => {
                              if (!isPastDate(day))
                                handleEventClick?.(e, event);
                            }}
                            className={`${getEventBackgroundColorClass(
                              event.color
                            )} h-full rounded-lg p-1.5 relative group backdrop-blur-sm bg-opacity-90`}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            <div className="text-xs opacity-75">
                              {format(new Date(event.start), "HH:mm")} -{" "}
                              {format(new Date(event.end), "HH:mm")}
                            </div>

                            {/* Hover preview for stacked events */}
                            {eventIndex === 0 && eventArray.length > 1 && (
                              <div
                                className={`absolute ${
                                  dayIndex === weekDays.length - 1
                                    ? "right-full mr-2"
                                    : "left-full ml-2"
                                } top-0 invisible group-hover/day:visible opacity-0 group-hover/day:opacity-100 transition-all duration-200 hover:opacity-100 hover:visible z-50 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border p-2 gap-1`}
                              >
                                <div className="text-xs font-medium mb-1">
                                  Other events:
                                </div>
                                {eventArray.slice(1).map((event, i) => (
                                  <div
                                    key={i}
                                    onClick={(e) => {
                                      if (!isPastDate(day))
                                        handleEventClick?.(e, event);
                                    }}
                                    className={`text-xs py-1 px-0.5 border-t ${getEventBackgroundColorClass(
                                      event.color
                                    )}`}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
