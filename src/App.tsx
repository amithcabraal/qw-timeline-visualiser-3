import React, { useState } from 'react';
import { Timeline } from './components/Timeline';
import { ImportExport } from './components/ImportExport';
import { Calendar, PlusCircle } from 'lucide-react';
import { AddEventDialog } from './components/AddEventDialog';

function App() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Event Timeline</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Event
            </button>
            <ImportExport />
          </div>
        </div>
        
        <Timeline />
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
      />
    </div>
  );
}

export default App;