import React from 'react';
import { useEventStore } from '../store/eventStore';
import { Download, Upload } from 'lucide-react';

export function ImportExport() {
  const { events, importEvents } = useEventStore();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedEvents = JSON.parse(content);
          
          // Validate and transform events
          const validEvents = importedEvents.filter((event: any) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            
            return (
              event.title &&
              event.lane &&
              !isNaN(startDate.getTime()) &&
              !isNaN(endDate.getTime()) &&
              endDate > startDate
            );
          }).map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            id: event.id || crypto.randomUUID(),
            sentiment: event.sentiment || 'neutral',
            links: event.links || [],
          }));

          if (validEvents.length !== importedEvents.length) {
            alert('Some events were skipped due to invalid data');
          }

          if (validEvents.length > 0) {
            importEvents(validEvents);
          }
        } catch (error) {
          console.error('Error importing events:', error);
          alert('Error importing events. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    if (events.length === 0) {
      alert('No events to export');
      return;
    }

    const exportData = JSON.stringify(events, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4">
      <div>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import JSON
        </label>
      </div>
      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </button>
    </div>
  );
}