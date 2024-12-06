import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Event } from '../types/Event';
import { EditEventDialog } from './EditEventDialog';

export function EventTable() {
  const { events, removeEvent } = useEventStore();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const getSentimentColor = (sentiment: Event['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-gray-500">{event.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.lane}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(event.startDate, 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(event.endDate, 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentColor(event.sentiment)}`}>
                      {event.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      {event.links?.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {link.type}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          isOpen={true}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  );
}