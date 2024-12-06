import { parse } from '@markwhen/parser';
import { Event } from '../types/Event';

export function eventsToMarkwhen(events: Event[]): string {
  return events.map(event => {
    const start = event.startDate.toISOString();
    const end = event.endDate.toISOString();
    return `${start} - ${end}: ${event.title} #${event.lane}${event.description ? '\n' + event.description : ''}`;
  }).join('\n\n');
}

export function markwhenToEvents(markwhenText: string): Event[] {
  try {
    const parsed = parse(markwhenText);
    const events: Event[] = [];

    parsed.events.forEach(event => {
      if (event.dateRangeIso && event.dateRangeIso.start && event.dateRangeIso.end) {
        const tags = event.tags || [];
        const lane = tags[0] || 'default';

        events.push({
          id: crypto.randomUUID(),
          title: event.text || 'Untitled Event',
          description: event.supplemental?.join('\n') || '',
          startDate: new Date(event.dateRangeIso.start),
          endDate: new Date(event.dateRangeIso.end),
          lane: lane.startsWith('#') ? lane.slice(1) : lane
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error parsing markwhen text:', error);
    return [];
  }
}