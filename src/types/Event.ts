export type EventSentiment = 'positive' | 'negative' | 'neutral';

export interface EventLink {
  type: 'jira' | 'appDynamics' | 'loadRunner' | 'confluence';
  url: string;
  title: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  lane: string;
  sentiment: EventSentiment;
  links: EventLink[];
  color?: string;
}