import { JourneyPath, MapLocationMarker } from '../types';

export const JOURNEY_MARKERS: MapLocationMarker[] = [
  {
    id: 'adventure-phase-event',
    name: 'Adventure Phase Event',
    category: 'settlement',
    coords: { x: 86.9, y: 62.9 },
    mapId: 'shire',
    isJourneyOnly: true,
    minZoom: 0.2,
    regionName: 'Marish / Old Forest Border',
    eventDate: "'Trewsday' 10th July T.A 2965",
    dangerLevel: 'Perilous',
    isPlayerVisible: false,
    description: 'A key Adventure Phase narrative encounter location featuring critical decision points: taking a dangerous shortcut, splitting the party, facing a Warg attack, or meeting Rori.',
    bookSource: { bookTitle: 'TftLL', pageNumber: 'p. 24' },
    tags: ['Adventure Phase', 'Shortcut', 'Split Party', 'Warg Attack', 'Rori Meeting', 'Red Diamond'],
  },
];

export const DEFAULT_JOURNEYS: JourneyPath[] = [
  {
    id: 'journey-buckland-standelf',
    title: 'Company Journey: Bucklebury to Standelf',
    status: 'active',
    startDate: '10th July T.A 2965',
    description: 'The Company set out from Bucklebury & Brandy Hall, traversed the Marish border where they encountered an Adventure Phase Event, and arrived safely at Standelf.',
    waypoints: [
      {
        id: 'wp-1',
        name: 'Bucklebury & Brandy Hall',
        mapId: 'shire',
        markerId: 'bucklebury-brandy-hall',
        date: '10th July T.A 2965',
        note: 'Departure from Bucklebury Ferry and Brandy Hall',
      },
      {
        id: 'wp-2',
        name: 'Adventure Phase Event Site',
        mapId: 'shire',
        markerId: 'adventure-phase-event',
        date: '10th July T.A 2965',
        note: 'Key narrative decision point (Shortcut / Split Party / Warg Attack / Rori Meeting)',
      },
      {
        id: 'wp-3',
        name: 'Standelf',
        mapId: 'shire',
        markerId: 'standelf',
        date: 'Present Location',
        note: 'Current position of the Fellowship along the High Hay in Buckland',
        isCurrentLocation: true,
      },
    ],
    tags: ['Buckland', 'Adventure Event', 'Standelf', 'The Shire'],
  },
];
