export type SupplementCategory = 'Core Rules' | 'Heroic Cultures' | 'Tales from the Lone-Lands' | 'Moria' | 'Ruins of the Lost Realm' | 'Starter Set' | 'Session Prep';

export type ViewMode = 'toc' | 'heroic-cultures' | 'reader' | 'map';

export type MapMarkerCategory = 'settlement' | 'region' | 'ruin' | 'landmark' | 'hazard' | 'culture';

export interface SubLocationItem {
  id: string;
  name: string;
  category?: MapMarkerCategory;
  bookSource?: {
    bookTitle: string;
    pageNumber?: string;
    citation?: string;
  };
  description?: string;
  dangerLevel?: 'Safe' | 'Guarded' | 'Wild' | 'Perilous' | 'Shadow';
  tags?: string[];
}

export interface MapLocationMarker {
  id: string;
  name: string;
  elvishName?: string;
  category: MapMarkerCategory;
  coords: { x: number; y: number }; // percentage 0-100
  mapId?: 'shire' | 'eriador';
  isJourneyOnly?: boolean;
  minZoom?: number; // minimum zoom level to display marker smoothly
  description: string;
  regionName: string;
  eventDate?: string; // e.g. "'Trewsday' 10th July T.A 2965"
  dangerLevel?: 'Safe' | 'Guarded' | 'Wild' | 'Perilous' | 'Shadow';
  isPlayerVisible?: boolean; // Controls visibility in Player View (when Loremaster mode is OFF).
  cultureRef?: string;
  chapterRef?: {
    chapterId: string;
    sectionId: string;
    title: string;
  };
  bookSource?: {
    bookTitle: string;
    pageNumber?: string;
    citation?: string;
  };
  tags?: string[];
  subLocations?: SubLocationItem[];
}

export interface SubHeader {
  id: string;
  title: string;
  level: number;
}

export interface JourneyWaypoint {
  id: string;
  name: string;
  coords?: { x: number; y: number };
  mapId?: 'shire' | 'eriador';
  markerId?: string;
  date?: string;
  note?: string;
  isCurrentLocation?: boolean;
}

export interface JourneyPath {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'archived';
  startDate?: string;
  description?: string;
  waypoints: JourneyWaypoint[];
  tags?: string[];
}

export interface RuleSection {
  id: string;
  title: string;
  summary?: string;
  content: string; // Markdown content
  level?: number;
  subHeaders?: SubHeader[];
}

export interface RuleChapter {
  id: string;
  number: number;
  title: string;
  supplement: SupplementCategory;
  description: string;
  iconName?: string;
  sections: RuleSection[];
}

