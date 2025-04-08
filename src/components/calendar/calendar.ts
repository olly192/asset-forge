import {
    differenceInDays,
    eachDayOfInterval,
    endOfMonth,
    isSameDay,
    parseISO,
    startOfDay,
    startOfMonth,
    type EachDayOfIntervalResult, format
} from "date-fns";

export type CalendarEvent = {
    id: string,
    start: string;
    end: string;
    title: string;
    assetIds: string[];
}

export type CalendarEventPos = CalendarEvent & {
    position: number;
    isMultiDay: boolean;
}

export type CalendarCell = {
    day: number;
    currentMonth: boolean;
    date: Date;
}

// https://github.com/lramos33/big-calendar/blob/main/src/calendar/helpers.ts#L113
export function getCalendarCells(selectedDate: Date): CalendarCell[] {
    const currentYear: number = selectedDate.getFullYear();
    const currentMonth: number = selectedDate.getMonth();

    const getDaysInMonth: (year: number, month: number) => number
        = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth: (year: number, month: number) => number
        = (year: number, month: number) => new Date(year, month, 0).getDay();

    const daysInMonth: number = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth: number = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInPrevMonth: number = getDaysInMonth(currentYear, currentMonth - 1);
    const totalDays: number = firstDayOfMonth + daysInMonth;

    const prevMonthCells: CalendarCell[] = Array.from({ length: firstDayOfMonth }, (_: any, i: number) => ({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
    }));

    const currentMonthCells: CalendarCell[] = Array.from({ length: daysInMonth }, (_: any, i: number) => ({
        day: i + 1,
        currentMonth: true,
        date: new Date(currentYear, currentMonth, i + 1),
    }));

    const nextMonthCells: CalendarCell[] = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_: any, i: number) => ({
        day: i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i + 1),
    }));

    return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

// https://github.com/lramos33/big-calendar/blob/main/src/calendar/helpers.ts#L146
export function calculateMonthEventPositions(events: CalendarEvent[], selectedDate: Date): Record<string, number> {
    let singleDayEvents: CalendarEvent[] = events.filter((event: CalendarEvent) => {
        return format(event.start, "yyyy-MM-dd") === format(event.end, "yyyy-MM-dd");
    });
    let multiDayEvents: CalendarEvent[] = events.filter((event: CalendarEvent) => {
        return format(event.start, "yyyy-MM-dd") !== format(event.end, "yyyy-MM-dd");
    })

    const monthStart: Date = startOfMonth(selectedDate);
    const monthEnd: Date = endOfMonth(selectedDate);

    const eventPositions: { [key: string]: number } = {};
    const occupiedPositions: { [key: string]: boolean[] } = {};

    eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day: Date) => {
        occupiedPositions[day.toISOString()] = [false, false, false];
    });

    const sortedEvents: CalendarEvent[] = [
        ...multiDayEvents.sort((a: CalendarEvent, b: CalendarEvent) => {
            const aDuration: number = differenceInDays(parseISO(a.end), parseISO(a.start));
            const bDuration: number = differenceInDays(parseISO(b.end), parseISO(b.start));
            return bDuration - aDuration || parseISO(a.start).getTime() - parseISO(b.start).getTime();
        }),
        ...singleDayEvents.sort(
            (a: CalendarEvent, b: CalendarEvent) => parseISO(a.start).getTime() - parseISO(b.start).getTime()
        ),
    ];

    sortedEvents.forEach((event: CalendarEvent) => {
        const eventStart: Date = parseISO(event.start);
        const eventEnd: Date = parseISO(event.end);
        const eventDays: EachDayOfIntervalResult<{ start: Date, end: Date }, undefined> = eachDayOfInterval({
            start: eventStart < monthStart ? monthStart : eventStart,
            end: eventEnd > monthEnd ? monthEnd : eventEnd,
        });

        let position: number = -1;

        for (let i: number = 0; i < 3; i++) {
            if (eventDays.every((day: Date) => {
                const dayPositions: boolean[] = occupiedPositions[startOfDay(day).toISOString()];
                return dayPositions && !dayPositions[i];
            })) {
                position = i;
                break;
            }
        }

        if (position !== -1) {
            eventDays.forEach((day: Date) => {
                const dayKey: string = startOfDay(day).toISOString();
                occupiedPositions[dayKey][position] = true;
            });
            eventPositions[event.id] = position;
        }
    });

    return eventPositions;
}

// https://github.com/lramos33/big-calendar/blob/main/src/calendar/helpers.ts#L200
export function getMonthCellEvents(date: Date, events: CalendarEvent[], eventPositions: Record<string, number>): CalendarEventPos[] {
    const eventsForDate: CalendarEvent[] = events.filter((event: CalendarEvent) => {
        const eventStart: Date = parseISO(event.start);
        const eventEnd: Date = parseISO(event.end);
        return (date >= eventStart && date <= eventEnd) || isSameDay(date, eventStart) || isSameDay(date, eventEnd);
    });

    return eventsForDate.map((event: CalendarEvent) => ({
        ...event,
        position: eventPositions[event.id] ?? -1,
        isMultiDay: event.start !== event.end,
    })).sort((a: CalendarEventPos, b: CalendarEventPos) => {
        if (a.isMultiDay && !b.isMultiDay) return -1;
        if (!a.isMultiDay && b.isMultiDay) return 1;
        return a.position - b.position;
    });
}