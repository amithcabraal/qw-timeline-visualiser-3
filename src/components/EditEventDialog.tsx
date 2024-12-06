import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Event } from '../types/Event';
import { EventForm } from './EventForm';

interface EditEventDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEventDialog({ event, isOpen, onClose }: EditEventDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Event</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <EventForm event={event} onSubmit={onClose} />
        </div>
      </div>
    </div>
  );
}