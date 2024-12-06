import React from 'react';
import { Event } from '../types/Event';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface CalendarViewProps {
  events: Event[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => 
    events.filter(event => 
      isSameDay(event.startDate, day) || isSameDay(event.endDate, day)
    );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-center mb-4">
          {format(today, 'MMMM yyyy')}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className="border rounded-lg p-2 min-h-[100px] bg-gray-50"
              >
                <div className="text-right text-gray-500 mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate"
                      style={{
                        backgroundColor: event.sentiment === 'positive' ? '#22c55e' :
                                       event.sentiment === 'negative' ? '#ef4444' :
                                       '#3b82f6',
                        color: 'white'
                      }}
                      title={`${event.title}\n${format(event.startDate, 'HH:mm')} - ${format(event.endDate, 'HH:mm')}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}