import React, { useState, useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { 
  format, 
  addDays, 
  addWeeks, 
  addMonths, 
  eachHourOfInterval,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isSameDay,
  subDays,
  differenceInDays,
  addHours
} from 'date-fns';
import { TimelineControls } from './TimelineControls';
import { EventTable } from './EventTable';
import { Event } from '../types/Event';
import { CalendarView } from './CalendarView';

type TimeRange = '1day' | '3days' | '1week' | '2weeks' | '1month';

interface TimeLabel {
  date: Date;
  format: string;
  showDate: boolean;
}

export function Timeline() {
  const events = useEventStore((state) => state.events);
  const [timeRange, setTimeRange] = useState<TimeRange>('3days');
  const [view, setView] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [focusDate, setFocusDate] = useState(() => {
    if (events.length > 0) {
      const latestEvent = events.reduce((latest, event) => 
        event.endDate > latest.endDate ? event : latest
      );
      return latestEvent.endDate;
    }
    return new Date();
  });

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events.reduce((latest, event) => 
        event.endDate > latest.endDate ? event : latest
      );
      setFocusDate(latestEvent.endDate);
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No events to display. Add some events to see them on the timeline.</p>
      </div>
    );
  }

  const getTimeWindow = () => {
    const end = focusDate;
    let start;
    switch (timeRange) {
      case '1day':
        start = subDays(end, 1);
        break;
      case '3days':
        start = subDays(end, 3);
        break;
      case '1week':
        start = subDays(end, 7);
        break;
      case '2weeks':
        start = subDays(end, 14);
        break;
      case '1month':
        start = subDays(end, 30);
        break;
      default:
        start = subDays(end, 3);
    }
    return { start, end };
  };

  const getTimeLabels = (): TimeLabel[] => {
    const { start, end } = getTimeWindow();
    const daysDiff = differenceInDays(end, start);
    let labels: TimeLabel[] = [];

    if (daysDiff <= 1) {
      // Show hourly labels for 1-day view
      const hours = eachHourOfInterval({ start, end });
      labels = hours.map(hour => ({
        date: hour,
        format: 'HH:mm',
        showDate: hour.getHours() === 0 || hour === hours[0]
      }));
    } else if (daysDiff <= 3) {
      // Show labels every 6 hours for 3-day view
      let current = start;
      while (current <= end) {
        labels.push({
          date: current,
          format: 'HH:mm',
          showDate: current.getHours() === 0 || current === start
        });
        current = addHours(current, 6);
      }
    } else if (daysDiff <= 7) {
      // Show labels every 12 hours for 1-week view
      let current = start;
      while (current <= end) {
        labels.push({
          date: current,
          format: 'HH:mm',
          showDate: current.getHours() === 0 || current === start
        });
        current = addHours(current, 12);
      }
    } else if (daysDiff <= 14) {
      // Show daily labels for 2-week view
      const days = eachDayOfInterval({ start, end });
      labels = days.map(day => ({
        date: day,
        format: 'MMM d',
        showDate: true
      }));
    } else {
      // Show weekly labels for 1-month view
      const days = eachDayOfInterval({ start, end });
      labels = days.filter(day => day.getDay() === 0).map(day => ({
        date: day,
        format: 'MMM d',
        showDate: true
      }));
    }

    return labels;
  };

  const { start: timelineStart, end: timelineEnd } = getTimeWindow();
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
  const lanes = [...new Set(events.map((event) => event.lane))];
  const timeLabels = getTimeLabels();

  const getEventStyle = (event: Event) => {
    const left = ((event.startDate.getTime() - timelineStart.getTime()) / totalDuration) * 100;
    const width = ((event.endDate.getTime() - event.startDate.getTime()) / totalDuration) * 100;
    
    let backgroundColor;
    switch (event.sentiment) {
      case 'positive':
        backgroundColor = '#22c55e';
        break;
      case 'negative':
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#3b82f6';
    }

    return {
      left: `${Math.max(0, Math.min(100, left))}%`,
      width: `${Math.max(0.5, Math.min(100, width))}%`,
      backgroundColor,
      display: left > 100 || left + width < 0 ? 'none' : 'flex',
    };
  };

  const getLabelStyle = (date: Date) => {
    const left = ((date.getTime() - timelineStart.getTime()) / totalDuration) * 100;
    return {
      left: `${left}%`,
    };
  };

  if (view === 'list') {
    return (
      <div className="space-y-4">
        <TimelineControls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          view={view}
          onViewChange={setView}
        />
        <EventTable />
      </div>
    );
  }

  if (view === 'calendar') {
    return (
      <div className="space-y-4">
        <TimelineControls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          view={view}
          onViewChange={setView}
        />
        <CalendarView events={events} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TimelineControls
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        view={view}
        onViewChange={setView}
      />
      
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <div className="font-medium text-gray-700">Lanes</div>
            <div className="relative h-14 border-b border-gray-200">
              {/* Time labels */}
              {timeLabels.map((label, index) => (
                <div
                  key={label.date.getTime()}
                  className="absolute -bottom-1 transform -translate-x-1/2 flex flex-col items-center"
                  style={getLabelStyle(label.date)}
                >
                  <div className="h-2 w-px bg-gray-300" />
                  <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                    {label.showDate && (
                      <>
                        {format(label.date, 'MMM d, yyyy')}<br />
                      </>
                    )}
                    {format(label.date, label.format)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lanes and Events */}
          {lanes.map((lane) => (
            <div key={lane} className="grid grid-cols-[200px_1fr] gap-4 mb-4">
              <div className="py-2 font-medium text-gray-700">{lane}</div>
              <div className="relative h-12 bg-gray-50 rounded">
                {/* Vertical gridlines */}
                {timeLabels.map((label) => (
                  <div
                    key={label.date.getTime()}
                    className="absolute top-0 bottom-0 w-px bg-gray-100"
                    style={getLabelStyle(label.date)}
                  />
                ))}
                
                {/* Events */}
                {events
                  .filter((event) => event.lane === lane)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="absolute top-1 bottom-1 rounded px-2 text-white text-sm flex items-center overflow-hidden whitespace-nowrap transition-colors cursor-pointer"
                      style={getEventStyle(event)}
                      title={`${event.title}\n${format(event.startDate, 'MMM d, yyyy HH:mm')} - ${format(
                        event.endDate,
                        'MMM d, yyyy HH:mm'
                      )}\n${event.description || ''}`}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}