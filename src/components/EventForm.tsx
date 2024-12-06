import React, { useState, useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { PlusCircle, Save, Plus, X } from 'lucide-react';
import { EventSentiment, EventLink, Event } from '../types/Event';
import { format } from 'date-fns';

interface EventFormProps {
  event?: Event;
  onSubmit?: () => void;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const { addEvent, updateEvent } = useEventStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    lane: '',
    sentiment: 'neutral' as EventSentiment,
    links: [] as EventLink[],
  });

  const [newLink, setNewLink] = useState({
    type: 'jira' as EventLink['type'],
    url: '',
    title: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: format(event.startDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(event.endDate, "yyyy-MM-dd'T'HH:mm"),
        lane: event.lane,
        sentiment: event.sentiment || 'neutral',
        links: event.links || [],
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Please enter valid dates');
      return;
    }

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      startDate,
      endDate,
      lane: formData.lane,
      sentiment: formData.sentiment,
      links: formData.links,
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent({
        id: crypto.randomUUID(),
        ...eventData,
      });
    }
    
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      lane: '',
      sentiment: 'neutral',
      links: [],
    });

    onSubmit?.();
  };

  const handleAddLink = () => {
    if (!newLink.url || !newLink.title) {
      alert('Please fill in both URL and title for the link');
      return;
    }

    setFormData({
      ...formData,
      links: [...formData.links, { ...newLink }],
    });

    setNewLink({
      type: 'jira',
      url: '',
      title: '',
    });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="datetime-local"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lane</label>
        <input
          type="text"
          required
          value={formData.lane}
          onChange={(e) => setFormData({ ...formData, lane: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sentiment</label>
        <select
          value={formData.sentiment}
          onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as EventSentiment })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="neutral">Neutral</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
        <div className="space-y-2">
          {formData.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-600">{link.type}:</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                {link.title}
              </a>
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end">
          <select
            value={newLink.type}
            onChange={(e) => setNewLink({ ...newLink, type: e.target.value as EventLink['type'] })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="jira">JIRA</option>
            <option value="appDynamics">App Dynamics</option>
            <option value="loadRunner">Load Runner</option>
            <option value="confluence">Confluence</option>
          </select>
          <input
            type="url"
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Title"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {event ? <Save className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
          {event ? 'Save Changes' : 'Add Event'}
        </button>
      </div>
    </form>
  );
}