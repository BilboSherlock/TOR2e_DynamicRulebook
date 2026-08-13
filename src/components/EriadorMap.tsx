import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Compass,
  Search,
  X,
  BookOpen,
  Shield,
  ChevronRight,
  AlertTriangle,
  Castle,
  Home,
  Mountain,
  Trees,
  Crosshair,
  Copy,
  Sparkles,
  Map,
  Calendar,
  Eye,
  Route,
  Footprints,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Navigation,
  Edit2,
  Layers,
  Info,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import eriadorMapImg from '../content/maps/EriadorMap.webp';
import shireMapImg from '../content/maps/ShireRegionMap.jpg';
import { ERIADOR_MARKERS } from '../data/eriadorMapData';
import { DEFAULT_JOURNEYS, JOURNEY_MARKERS } from '../data/journeyData';
import { MapLocationMarker, MapMarkerCategory, SupplementCategory, JourneyPath, JourneyWaypoint } from '../types';
import { getFullBookTitle } from '../utils/bookUtils';
import { MAP_GLOBAL_CONFIG } from '../config/mapConfig';

export interface CustomMapMarker extends MapLocationMarker {
  mapTarget?: 'eriador' | 'shire';
  isCustom?: boolean;
}

// ============================================================================
// CENTRAL MAP CONFIGURATION (Re-exported from /src/config/mapConfig.ts)
// ============================================================================

export const MAP_RENDER_CONFIG = MAP_GLOBAL_CONFIG.renderConfig;
export const SHIRE_MAP_CONFIG = MAP_GLOBAL_CONFIG.shireMapConfig;

export const SHIRE_LOCAL_MARKERS: MapLocationMarker[] = [
  {
    id: 'breredon',
    name: 'Breredon',
    category: 'settlement',
    coords: { x: 88.6, y: 66.8 },
    minZoom: 0.2,
    regionName: 'Buckland',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in southern Buckland, situated on the high banks above the Brandywine River.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Buckland', 'Brandywine', 'Southern Buckland'],
  },
  {
    id: 'haysend',
    name: 'Haysend',
    category: 'settlement',
    coords: { x: 87.6, y: 69.8 },
    minZoom: 0.2,
    regionName: 'Buckland',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'The southern extremity of Buckland where the High Hay hedge meets the mouth of the Withywindle.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['High Hay', 'Withywindle', 'Buckland Border'],
  },
  {
    id: 'deephallow',
    name: 'Deephallow',
    category: 'settlement',
    coords: { x: 86.9, y: 72.3 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village near the confluence of the Withywindle and the Brandywine River in the South-Eastfarthing.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Eastfarthing', 'Withywindle', 'Brandywine'],
  },
  {
    id: 'rushey',
    name: 'Rushey',
    category: 'settlement',
    coords: { x: 85.0, y: 65.7 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A low-lying settlement in the Marish near the Brandywine River.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['The Marish', 'Eastfarthing', 'Lowlands'],
  },
  {
    id: 'standelf',
    name: 'Standelf',
    category: 'settlement',
    coords: { x: 87.2, y: 64.6 },
    minZoom: 0.2,
    regionName: 'Buckland',
    dangerLevel: 'Safe',
    isPlayerVisible: true,
    description: 'A small village in Buckland along the High Hay.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Buckland', 'High Hay'],
  },
  {
    id: 'bucklebury-brandy-hall',
    name: 'Bucklebury & Brandy Hall',
    category: 'settlement',
    coords: { x: 86.3, y: 58.3 },
    minZoom: 0.2,
    regionName: 'Buckland',
    dangerLevel: 'Safe',
    isPlayerVisible: true,
    description: 'The chief village of Buckland and sprawling ancestral smial of the Brandybuck family, located near the Bucklebury Ferry.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Brandybuck', 'Brandy Hall', 'Bucklebury Ferry', 'Master of Buckland'],
  },
  {
    id: 'stock',
    name: 'Stock',
    category: 'settlement',
    coords: { x: 83.2, y: 56.1 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A riverside village in the Eastfarthing, famous for brewing excellent beer at The Golden Perch inn.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Golden Perch', 'Eastfarthing', 'Stock Brook'],
  },
  {
    id: 'newbury-crickhollow',
    name: 'Newbury & Crickhollow',
    category: 'settlement',
    coords: { x: 86.6, y: 54.0 },
    minZoom: 0.2,
    regionName: 'Buckland',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'Northern Buckland settlements; Crickhollow features the quiet house purchased by Frodo Baggins before leaving the Shire.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Crickhollow', 'Frodo', 'Buckland', 'Newbury'],
  },
  {
    id: 'brandywine-bridge',
    name: 'The Brandywine Bridge',
    elvishName: 'Echor',
    category: 'settlement',
    coords: { x: 82.1, y: 50.1 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A grand three-arched stone bridge built by Arnor kings, where the Great East Road crosses the Baranduin.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Stone Arches', 'Baranduin', 'Arnor Heritage', 'Shire Border Gate'],
  },
  {
    id: 'whitfurrows',
    name: 'Whitfurrows',
    category: 'settlement',
    coords: { x: 74.3, y: 52.0 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village on the Great East Road in the Eastfarthing, surrounded by rich agricultural fields.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Eastfarthing', 'Great East Road', 'Farming'],
  },
  {
    id: 'budgeford',
    name: 'Budgeford',
    category: 'settlement',
    coords: { x: 75.2, y: 48.1 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village on the Water in Bridgefields, home to the Bolger family.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Bridgefields', 'Bolger Clan', 'Eastfarthing'],
  },
  {
    id: 'frogmorton',
    name: 'Frogmorton',
    category: 'settlement',
    coords: { x: 67.8, y: 51.7 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A low-lying village surrounded by marshes along the Great East Road, known for The Floating Log inn.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Eastfarthing', 'Floating Log Inn', 'Marshes', 'Great East Road'],
  },
  {
    id: 'three-farthing-stone',
    name: 'Three Farthing Stone',
    category: 'settlement',
    coords: { x: 56.8, y: 52.8 },
    minZoom: 0.2,
    regionName: 'Central Shire',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'An ancient stone pillar marking the point where the Westfarthing, Eastfarthing, and Southfarthing meet.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Center of Shire', 'Boundary Marker', 'Farthing Stone'],
  },
  {
    id: 'bywater',
    name: 'Bywater',
    category: 'settlement',
    coords: { x: 54.6, y: 52.2 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A cheerful village near Bywater Pool, home to The Green Dragon inn and the Great Mill.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Green Dragon', 'Bywater Pool', 'Inn', 'Westfarthing'],
  },
  {
    id: 'woodhall',
    name: 'Woodhall',
    category: 'settlement',
    coords: { x: 77.2, y: 61.4 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village tucked in the eastern hills near the Woody End in the Eastfarthing.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Woody End', 'Eastfarthing', 'Elven Wandering'],
  },
  {
    id: 'bag-end',
    name: 'Bag End',
    category: 'settlement',
    coords: { x: 50.9, y: 46.0 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'The luxurious hobbit-hole at the end of Bagshot Row atop Hobbiton Hill, home of Bilbo and Frodo Baggins.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 182' },
    tags: ['Bilbo', 'Frodo', 'Bagshot Row', 'The Hill'],
  },
  {
    id: 'hobbiton',
    name: 'Hobbiton',
    category: 'settlement',
    coords: { x: 50.9, y: 49.4 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'The iconic village along the Water, featuring the Party Tree, the Mill, and quiet hobbit-holes.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 182' },
    tags: ['Party Tree', 'The Mill', 'Westfarthing', 'The Water'],
  },
  {
    id: 'overhill',
    name: 'Overhill',
    category: 'settlement',
    coords: { x: 50.8, y: 43.8 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A quiet hamlet nestled north of Hobbiton Hill, home to rope-makers and rustic hobbit farmers.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['North of Hill', 'Westfarthing', 'Rustic Farms'],
  },
  {
    id: 'waymeet',
    name: 'Waymeet',
    category: 'settlement',
    coords: { x: 40.7, y: 53.6 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'An important crossroads village where the Great East Road meets the South-road to Michel Delving.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Crossroads', 'Great East Road', 'Westfarthing'],
  },
  {
    id: 'whitwell',
    name: 'Whitwell',
    category: 'settlement',
    coords: { x: 39.6, y: 61.0 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in the Tookland near Tuckborough.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Tookland', 'Westfarthing'],
  },
  {
    id: 'tookbank',
    name: 'Tookbank',
    category: 'settlement',
    coords: { x: 43.2, y: 61.8 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A hillside settlement in the Tookland.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Tookland', 'Tooks', 'Westfarthing'],
  },
  {
    id: 'tuckborough',
    name: 'Tuckborough',
    category: 'settlement',
    coords: { x: 48.6, y: 62.0 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'The ancestral home of the Took clan and residence of the Thain of the Shire at the Great Smials.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 182' },
    tags: ['Thain of the Shire', 'Took Clan', 'Great Smials', 'Pippin'],
  },
  {
    id: 'sparrows-rest',
    name: 'Sparrow\'s Rest',
    category: 'settlement',
    coords: { x: 41.6, y: 79.1 },
    minZoom: 0.2,
    regionName: 'Southfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A peaceful southern estate and quiet resting place in the Southfarthing.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 185' },
    tags: ['Southfarthing', 'Estate'],
  },
  {
    id: 'michel-delving',
    name: 'Michel Delving',
    category: 'settlement',
    coords: { x: 24.7, y: 61.1 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'The chief town and administrative capital of the Shire, home to the Mayor of Michel Delving, Shirriffs headquarters, and the Mathom-house.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 182' },
    tags: ['Shire Capital', 'Mayor', 'Mathom-house', 'Shirriffs'],
  },
  {
    id: 'little-delving',
    name: 'Little Delving',
    category: 'settlement',
    coords: { x: 25.3, y: 36.8 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A northern township in the Westfarthing, west of Needlehole.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Westfarthing', 'Northern Shire'],
  },
  {
    id: 'nobottle',
    name: 'Nobottle',
    category: 'settlement',
    coords: { x: 31.9, y: 30.3 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A secluded village in the northern hills of the Westfarthing.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northern Hills', 'Westfarthing'],
  },
  {
    id: 'tighfield',
    name: 'Tighfield',
    category: 'settlement',
    coords: { x: 22.3, y: 29.1 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A rustic village in the northwestern reaches of the Westfarthing, known for pottery and tile-making.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Pottery', 'Westfarthing', 'Tile-making'],
  },
  {
    id: 'gamwich',
    name: 'Gamwich',
    category: 'settlement',
    coords: { x: 17.3, y: 22.5 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'An ancient northwestern hamlet, origin of the Gamgee family line.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Gamgee Clan', 'Westfarthing', 'Ancestral Village'],
  },
  {
    id: 'needlehole',
    name: 'Needlehole',
    category: 'settlement',
    coords: { x: 39.0, y: 30.2 },
    minZoom: 0.2,
    regionName: 'Westfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A northern village near the marshes where the Water river flows south.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['The Water', 'Westfarthing', 'Northern Marshes'],
  },
  {
    id: 'scary',
    name: 'Scary',
    category: 'settlement',
    coords: { x: 71.9, y: 33.4 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in the Hills of Scary in the North-Eastfarthing, known for limestone quarries.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Hills of Scary', 'Quarries', 'Eastfarthing'],
  },
  {
    id: 'brockenbores',
    name: 'Brockenbores',
    category: 'settlement',
    coords: { x: 71.9, y: 33.4 },
    minZoom: 0.2,
    regionName: 'Eastfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in the Hills of Scary, surrounded by badger-burrows and old chalk smials.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Hills of Scary', 'Eastfarthing', 'Badger Burrows'],
  },
  {
    id: 'willowbottom',
    name: 'Willowbottom',
    category: 'settlement',
    coords: { x: 79.1, y: 76.9 },
    minZoom: 0.2,
    regionName: 'Southfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in the Southfarthing where the Withywindle approaches the marshes.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 185' },
    tags: ['Southfarthing', 'Withywindle', 'Willow Woods'],
  },
  {
    id: 'longbottom',
    name: 'Longbottom',
    category: 'settlement',
    coords: { x: 51.6, y: 89.2 },
    minZoom: 0.2,
    regionName: 'Southfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A warm, sheltered valley famous for cultivating the finest pipe-weed in Middle-earth (Longbottom Leaf, Old Toby, and Southern Star).',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 185' },
    tags: ['Pipe-weed', 'Old Toby', 'Tobold Hornblower', 'Southfarthing'],
  },
  {
    id: 'greenholm',
    name: 'Greenholm',
    category: 'settlement',
    coords: { x: 7.3, y: 73.3 },
    minZoom: 0.2,
    regionName: 'Far Downs',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A western border village in the Far Downs near the Westmarch.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Far Downs', 'Westmarch', 'Western Border'],
  },
  {
    id: 'long-cleeve',
    name: 'Long Cleeve',
    category: 'settlement',
    coords: { x: 27.9, y: 13.0 },
    minZoom: 0.2,
    regionName: 'Northfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A northern village in the Northfarthing, ancestral home of the North-Tooks.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northfarthing', 'North-Tooks'],
  },
  {
    id: 'kingsworthy',
    name: 'Kingsworthy',
    category: 'settlement',
    coords: { x: 49.0, y: 7.3 },
    minZoom: 0.2,
    regionName: 'Northfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A quiet northern hamlet near the old royal borders of Arnor.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northfarthing', 'Royal Border'],
  },
  {
    id: 'oatbarton',
    name: 'Oatbarton',
    category: 'settlement',
    coords: { x: 55.1, y: 23.6 },
    minZoom: 0.2,
    regionName: 'Northfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A major farming village in the Northfarthing, famed for oat fields and grain mills.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northfarthing', 'Oat Fields', 'Grain Mills'],
  },
  {
    id: 'dwaling',
    name: 'Dwaling',
    category: 'settlement',
    coords: { x: 67.8, y: 26.3 },
    minZoom: 0.2,
    regionName: 'Northfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A peaceful village in the Northfarthing hills.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northfarthing', 'Northern Hills'],
  },
  {
    id: 'hardbottle',
    name: 'Hardbottle',
    category: 'settlement',
    coords: { x: 71.7, y: 19.4 },
    minZoom: 0.2,
    regionName: 'Northfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A hardy village in the high northern hills of the Northfarthing, home to the Bracegirdle family.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Northfarthing', 'Bracegirdle Clan'],
  },
  {
    id: 'pincup',
    name: 'Pincup',
    category: 'settlement',
    coords: { x: 59.0, y: 66.9 },
    minZoom: 0.2,
    regionName: 'Southfarthing',
    dangerLevel: 'Safe',
    isPlayerVisible: false,
    description: 'A village in the Green Hill Country near the Tookland, known for its vineyards and south-facing smials.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 183' },
    tags: ['Southfarthing', 'Green Hill Country', 'Tookland'],
  },
  {
    id: 'bald-hill',
    name: 'Bald Hill',
    category: 'settlement',
    coords: { x: 95.0, y: 52.8 },
    minZoom: 0.2,
    regionName: 'Eastfarthing / Old Forest',
    dangerLevel: 'Wild',
    isPlayerVisible: false,
    description: 'A prominent treeless hill rising above the eastern canopy near the eaves of the Old Forest.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 184' },
    tags: ['Bald Hill', 'Old Forest', 'High Hill'],
  },
  {
    id: 'old-man-willow',
    name: 'Old Man Willow',
    category: 'settlement',
    coords: { x: 93.2, y: 62.7 },
    minZoom: 0.2,
    regionName: 'Old Forest / Withywindle',
    dangerLevel: 'Shadow',
    isPlayerVisible: false,
    description: 'An ancient, heart-rotten giant willow tree along the Withywindle in the Old Forest, wielding dark enchantments over lost travelers.',
    bookSource: { bookTitle: 'CR', pageNumber: 'p. 188' },
    tags: ['Old Forest', 'Withywindle', 'Ancient Willow', 'Shadow Hazard'],
  },
];

interface EriadorMapProps {
  isLoreMasterMode?: boolean;
  onSelectSupplement?: (supplement: SupplementCategory) => void;
  onNavigateToChapter?: (chapterId: string, sectionId: string) => void;
  onSelectHeroicCulture?: (cultureId: string) => void;
  activePrimaryMap?: 'eriador' | 'shire';
  onSwitchPrimaryMap?: (mapId: 'eriador' | 'shire') => void;
}

export const EriadorMap: React.FC<EriadorMapProps> = ({
  isLoreMasterMode = false,
  onSelectSupplement,
  onNavigateToChapter,
  onSelectHeroicCulture,
  activePrimaryMap: propActivePrimaryMap,
  onSwitchPrimaryMap: propOnSwitchPrimaryMap,
}) => {
  // Map viewport transform states
  const [zoom, setZoom] = useState<number>(0.55);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Dynamic aspect ratio state for active maps (height / width)
  const [eriadorAspectRatio, setEriadorAspectRatio] = useState<number>(3872 / 6000);
  const [shireAspectRatio, setShireAspectRatio] = useState<number>(3300 / 4257);

  // Keep tracking refs for zoom and position to guarantee accurate synchronous zoom calculations
  const zoomRef = useRef<number>(zoom);
  zoomRef.current = zoom;
  const positionRef = useRef<{ x: number; y: number }>(position);
  positionRef.current = position;

  // Map state notification toast
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Manually revealed marker IDs for players (toggled by Loremaster)
  const [revealedMarkerIds, setRevealedMarkerIds] = useState<Set<string>>(new Set());

  // Navigation accessibility check based on MAP_GLOBAL_CONFIG
  const isMapDisabled = useCallback(
    (mapId: 'eriador' | 'shire') => {
      const nav = MAP_GLOBAL_CONFIG.mapNavigation;
      if (mapId === 'eriador') {
        if (nav.disableEriadorGlobally) return true;
        if (!isLoreMasterMode && nav.disableEriadorForPlayers) return true;
      }
      if (mapId === 'shire') {
        if (nav.disableShireGlobally) return true;
        if (!isLoreMasterMode && nav.disableShireForPlayers) return true;
      }
      return false;
    },
    [isLoreMasterMode]
  );

  // Primary Map State: synced with props if provided, otherwise internal state
  const [internalActivePrimaryMap, setInternalActivePrimaryMap] = useState<'eriador' | 'shire'>(
    propActivePrimaryMap || MAP_GLOBAL_CONFIG.defaultPrimaryMap
  );

  const activePrimaryMap = propActivePrimaryMap !== undefined ? propActivePrimaryMap : internalActivePrimaryMap;

  const setActivePrimaryMap = useCallback(
    (mapId: 'eriador' | 'shire') => {
      setInternalActivePrimaryMap(mapId);
      propOnSwitchPrimaryMap?.(mapId);
    },
    [propOnSwitchPrimaryMap]
  );

  // Sync internal state if prop changes
  useEffect(() => {
    if (propActivePrimaryMap !== undefined && propActivePrimaryMap !== internalActivePrimaryMap) {
      setInternalActivePrimaryMap(propActivePrimaryMap);
    }
  }, [propActivePrimaryMap, internalActivePrimaryMap]);

  // Automatically adjust active map if current view becomes restricted due to mode toggle
  useEffect(() => {
    if (isMapDisabled(activePrimaryMap)) {
      const fallbackMap = activePrimaryMap === 'eriador' ? 'shire' : 'eriador';
      if (!isMapDisabled(fallbackMap)) {
        setActivePrimaryMap(fallbackMap);
      }
    }
  }, [isLoreMasterMode, activePrimaryMap, isMapDisabled, setActivePrimaryMap]);

  // Loremaster Point Picker & Inspection state
  const [isPointPickerActive, setIsPointPickerActive] = useState<boolean>(false);
  const [pickerCoords, setPickerCoords] = useState<{ x: number; y: number } | null>(null);

  // Journeys State Management
  const [journeys, setJourneys] = useState<JourneyPath[]>(() => {
    try {
      const saved = localStorage.getItem('tor_loremaster_journeys');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load journeys from localStorage', e);
    }
    return DEFAULT_JOURNEYS;
  });

  const [activeJourneyId, setActiveJourneyId] = useState<string>('journey-buckland-standelf');
  const [isJourneysPanelOpen, setIsJourneysPanelOpen] = useState<boolean>(false);
  const [showJourneysOnMap, setShowJourneysOnMap] = useState<boolean>(
    MAP_GLOBAL_CONFIG.journeyConfig.defaultShowJourneysOnMap
  );

  // New Journey Form State
  const [isCreatingJourney, setIsCreatingJourney] = useState<boolean>(false);
  const [newJourneyTitle, setNewJourneyTitle] = useState<string>('');
  const [newJourneyDesc, setNewJourneyDesc] = useState<string>('');
  const [newJourneyDate, setNewJourneyDate] = useState<string>('');

  // Save journeys to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tor_loremaster_journeys', JSON.stringify(journeys));
    } catch (e) {
      console.error('Failed to save journeys', e);
    }
  }, [journeys]);

  const activeJourney = useMemo(() => {
    return journeys.find((j) => j.id === activeJourneyId) || journeys[0] || null;
  }, [journeys, activeJourneyId]);

  // Combined pool of all markers across maps & journeys
  const allMapMarkers = useMemo(() => {
    return [...SHIRE_LOCAL_MARKERS, ...ERIADOR_MARKERS, ...JOURNEY_MARKERS];
  }, []);

  // Helper to dynamically resolve waypoint coordinates from an associated marker if not manually provided
  const getWaypointCoords = useCallback(
    (wp: JourneyWaypoint): { x: number; y: number } => {
      if (wp.coords) return wp.coords;
      if (wp.markerId) {
        const found = allMapMarkers.find((m) => m.id === wp.markerId);
        if (found) return found.coords;
      }
      return { x: 0, y: 0 };
    },
    [allMapMarkers]
  );

  // Add marker to active journey
  const handleAddMarkerToActiveJourney = useCallback((marker: MapLocationMarker) => {
    if (!activeJourneyId) return;
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== activeJourneyId) return j;
        const newWp: JourneyWaypoint = {
          id: `wp-${Date.now()}`,
          name: marker.name,
          mapId: activePrimaryMap,
          markerId: marker.id,
          date: 'Present Location',
          note: `Visited ${marker.name}`,
          isCurrentLocation: true,
        };
        const updatedWps = j.waypoints.map((wp) => ({ ...wp, isCurrentLocation: false }));
        return {
          ...j,
          waypoints: [...updatedWps, newWp],
        };
      })
    );
    setCopiedToast(`Added "${marker.name}" to Journey path`);
    setTimeout(() => setCopiedToast(null), 2500);
  }, [activeJourneyId, activePrimaryMap]);

  // Add picker coords as custom waypoint
  const handleAddPickerCoordsToJourney = useCallback(() => {
    if (!pickerCoords || !activeJourneyId) return;
    const wpName = prompt('Enter location name for waypoint:', `Waystation (${pickerCoords.x}%, ${pickerCoords.y}%)`);
    if (!wpName) return;

    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== activeJourneyId) return j;
        const newWp: JourneyWaypoint = {
          id: `wp-${Date.now()}`,
          name: wpName,
          coords: pickerCoords,
          mapId: activePrimaryMap,
          date: 'En Route',
          note: `Coordinates: X:${pickerCoords.x}%, Y:${pickerCoords.y}%`,
          isCurrentLocation: true,
        };
        const updatedWps = j.waypoints.map((wp) => ({ ...wp, isCurrentLocation: false }));
        return {
          ...j,
          waypoints: [...updatedWps, newWp],
        };
      })
    );
    setCopiedToast(`Added Waypoint "${wpName}" to Journey`);
    setTimeout(() => setCopiedToast(null), 2500);
  }, [pickerCoords, activeJourneyId, activePrimaryMap]);

  // Remove waypoint from journey
  const handleRemoveWaypoint = useCallback((journeyId: string, wpId: string) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== journeyId) return j;
        return {
          ...j,
          waypoints: j.waypoints.filter((w) => w.id !== wpId),
        };
      })
    );
  }, []);

  // Move waypoint order up or down
  const handleMoveWaypoint = useCallback((journeyId: string, index: number, direction: 'up' | 'down') => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== journeyId) return j;
        const waypoints = [...j.waypoints];
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= waypoints.length) return j;
        const temp = waypoints[index];
        waypoints[index] = waypoints[targetIdx];
        waypoints[targetIdx] = temp;
        return { ...j, waypoints };
      })
    );
  }, []);

  // Set current location waypoint
  const handleSetCurrentWaypoint = useCallback((journeyId: string, wpId: string) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== journeyId) return j;
        return {
          ...j,
          waypoints: j.waypoints.map((w) => ({
            ...w,
            isCurrentLocation: w.id === wpId,
          })),
        };
      })
    );
  }, []);

  // Create new journey
  const handleCreateNewJourney = useCallback(() => {
    if (!newJourneyTitle.trim()) return;
    const newJ: JourneyPath = {
      id: `journey-${Date.now()}`,
      title: newJourneyTitle.trim(),
      description: newJourneyDesc.trim() || 'A new fellowship journey across Middle-earth.',
      startDate: newJourneyDate.trim() || 'T.A. 2965',
      status: 'active',
      waypoints: [],
    };
    setJourneys((prev) => [...prev, newJ]);
    setActiveJourneyId(newJ.id);
    setNewJourneyTitle('');
    setNewJourneyDesc('');
    setNewJourneyDate('');
    setIsCreatingJourney(false);
    setCopiedToast(`Created journey: "${newJ.title}"`);
    setTimeout(() => setCopiedToast(null), 2500);
  }, [newJourneyTitle, newJourneyDesc, newJourneyDate]);

  // Delete journey
  const handleDeleteJourney = useCallback((journeyId: string) => {
    if (journeys.length <= 1) {
      alert('Cannot delete the last remaining journey.');
      return;
    }
    setJourneys((prev) => prev.filter((j) => j.id !== journeyId));
    if (activeJourneyId === journeyId) {
      const remaining = journeys.filter((j) => j.id !== journeyId);
      if (remaining.length > 0) setActiveJourneyId(remaining[0].id);
    }
  }, [journeys, activeJourneyId]);

  // Reset journeys to default
  const handleResetJourneys = useCallback(() => {
    setJourneys(DEFAULT_JOURNEYS);
    setActiveJourneyId(DEFAULT_JOURNEYS[0].id);
    setCopiedToast('Reset Journeys to Default Buckland -> Standelf path');
    setTimeout(() => setCopiedToast(null), 2500);
  }, []);

  const getMapAspectRatio = useCallback(() => {
    if (activePrimaryMap === 'shire') {
      return shireAspectRatio || (3300 / 4257);
    }
    return eriadorAspectRatio || (MAP_RENDER_CONFIG.originalHeightPx / MAP_RENDER_CONFIG.originalWidthPx);
  }, [activePrimaryMap, shireAspectRatio, eriadorAspectRatio]);

  // Calculate position that centers the map in the container viewport for a given zoom level
  const getCenteredPosition = useCallback((targetZoom: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width || window.innerWidth;
    const cHeight = rect.height || (window.innerHeight - 64);

    const mapBaseWidth = MAP_RENDER_CONFIG.displayBaseWidthPx;
    const mapBaseHeight = mapBaseWidth * getMapAspectRatio();

    const renderedWidth = mapBaseWidth * targetZoom;
    const renderedHeight = mapBaseHeight * targetZoom;

    return {
      x: Math.round((cWidth - renderedWidth) / 2),
      y: Math.round((cHeight - renderedHeight) / 2),
    };
  }, [getMapAspectRatio]);

  // Calculate dynamic fit zoom level so the full map is completely visible in container viewport
  const getFitZoom = useCallback(() => {
    if (!containerRef.current) return 0.55;
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width || window.innerWidth;
    const cHeight = rect.height || (window.innerHeight - 64);

    const mapBaseWidth = MAP_RENDER_CONFIG.displayBaseWidthPx;
    const mapBaseHeight = mapBaseWidth * getMapAspectRatio();

    // Leave a clean padding margin around the map
    const fitX = (cWidth * 0.95) / mapBaseWidth;
    const fitY = (cHeight * 0.95) / mapBaseHeight;

    const fitZoom = Math.min(fitX, fitY);
    return Math.max(0.2, Math.min(1.5, parseFloat(fitZoom.toFixed(2))));
  }, [getMapAspectRatio]);

  // Velocity tracking for soft drag drift & inertia
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDragPointRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Touch pinch-to-zoom tracking refs
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1.0);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MapMarkerCategory | 'all'>(
    MAP_GLOBAL_CONFIG.defaultCategoryFilter
  );
  const [selectedMarker, setSelectedMarker] = useState<MapLocationMarker | null>(null);
  const [selectedSubLocationId, setSelectedSubLocationId] = useState<string | null>(null);

  const mouseDownScreenRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Smoothly zoom toward viewport center
  const zoomToCenter = useCallback((targetZoom: number) => {
    const maxZ = MAP_RENDER_CONFIG.maxZoom;
    const clampedZoom = Math.max(MAP_RENDER_CONFIG.minZoom, Math.min(maxZ, targetZoom));
    const finalZoom = parseFloat(clampedZoom.toFixed(2));

    const currentZoom = zoomRef.current;
    const currentPos = positionRef.current;

    if (!containerRef.current || currentZoom <= 0 || currentZoom === finalZoom) {
      setZoom(finalZoom);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const scaleFactor = finalZoom / currentZoom;
    const newX = Math.round(cx - (cx - currentPos.x) * scaleFactor);
    const newY = Math.round(cy - (cy - currentPos.y) * scaleFactor);

    setZoom(finalZoom);
    setPosition({ x: newX, y: newY });
  }, []);

  // Zoom helpers
  const handleZoomIn = () => {
    const cur = zoomRef.current;
    const step = cur >= 6.0 ? 1.0 : (cur >= 2.5 ? 0.5 : MAP_RENDER_CONFIG.zoomStep);
    zoomToCenter(cur + step);
  };

  const handleZoomOut = () => {
    const cur = zoomRef.current;
    const step = cur >= 6.0 ? 1.0 : (cur >= 3.0 ? 0.5 : MAP_RENDER_CONFIG.zoomStep);
    zoomToCenter(cur - step);
  };

  const handleReset = useCallback(() => {
    const fit = getFitZoom();
    setZoom(fit);
    setPosition(getCenteredPosition(fit));
    setSelectedMarker(null);
    velocityRef.current = { x: 0, y: 0 };
  }, [getFitZoom, getCenteredPosition]);

  // Set default centered full view zoom on initial mount and resize or active map change
  useEffect(() => {
    const fit = getFitZoom();
    setZoom(fit);
    setPosition(getCenteredPosition(fit));

    const handleResize = () => {
      const newFit = getFitZoom();
      setZoom(newFit);
      setPosition(getCenteredPosition(newFit));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activePrimaryMap, getFitZoom, getCenteredPosition]);

  // Switch primary map state with permission enforcement
  const handleSwitchToShireMap = useCallback(() => {
    if (isMapDisabled('shire')) {
      setCopiedToast(MAP_GLOBAL_CONFIG.mapNavigation.restrictedMapMessage);
      setTimeout(() => setCopiedToast(null), 3000);
      return;
    }
    setActivePrimaryMap('shire');
    setSelectedMarker(null);
    setCopiedToast(`Switched to The Shire Regional Map`);
    setTimeout(() => setCopiedToast(null), 2200);
  }, [isMapDisabled]);

  const handleSwitchToEriadorMap = useCallback(() => {
    if (isMapDisabled('eriador')) {
      setCopiedToast(MAP_GLOBAL_CONFIG.mapNavigation.restrictedMapMessage);
      setTimeout(() => setCopiedToast(null), 3000);
      return;
    }
    setActivePrimaryMap('eriador');
    setSelectedMarker(null);
    setCopiedToast(`Switched to Eriador World Map`);
    setTimeout(() => setCopiedToast(null), 2200);
  }, [isMapDisabled]);

  // Reset camera view to full Eriador World Map
  const handleReturnToWorldMap = useCallback(() => {
    if (isMapDisabled('eriador')) {
      setCopiedToast(MAP_GLOBAL_CONFIG.mapNavigation.restrictedMapMessage);
      setTimeout(() => setCopiedToast(null), 3000);
      return;
    }
    setActivePrimaryMap('eriador');
    setSelectedMarker(null);
    setCopiedToast(`Reset to full Eriador World Map view`);
    setTimeout(() => setCopiedToast(null), 2200);
  }, [isMapDisabled]);

  // Mouse wheel zoom with dynamic Shire LOD support
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.85 : 1.18;
    zoomToCenter(zoom * factor);
  };

  // Dragging & Soft Drift Inertia Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    mouseDownScreenRef.current = { x: e.clientX, y: e.clientY };
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    lastDragPointRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastDragPointRef.current.time);
    const dx = e.clientX - lastDragPointRef.current.x;
    const dy = e.clientY - lastDragPointRef.current.y;

    // Smoothed velocity vector
    const instVx = (dx / dt) * 16;
    const instVy = (dy / dt) * 16;
    velocityRef.current = {
      x: velocityRef.current.x * 0.3 + instVx * 0.7,
      y: velocityRef.current.y * 0.3 + instVy * 0.7,
    };
    lastDragPointRef.current = { x: e.clientX, y: e.clientY, time: now };

    setPosition({
      x: Math.round(e.clientX - dragStartRef.current.x),
      y: Math.round(e.clientY - dragStartRef.current.y),
    });
  };

  const applyInertiaDrift = () => {
    setIsDragging(false);
    const vx = velocityRef.current.x;
    const vy = velocityRef.current.y;
    const speed = Math.hypot(vx, vy);

    if (speed > 0.8) {
      // Gentle glide factor
      const factor = Math.min(10, speed * 0.75);
      const driftX = (vx / speed) * factor * 12;
      const driftY = (vy / speed) * factor * 12;

      setPosition((prev) => ({
        x: Math.round(prev.x + driftX),
        y: Math.round(prev.y + driftY),
      }));
    }
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMouseUp = () => {
    if (isDragging) {
      applyInertiaDrift();
    }
  };

  // Touch drag & pinch-to-zoom support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
      lastDragPointRef.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
      velocityRef.current = { x: 0, y: 0 };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = dist / touchStartDistRef.current;
      const newZoom = touchStartZoomRef.current * scale;
      zoomToCenter(newZoom);
    } else if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const now = performance.now();
      const dt = Math.max(1, now - lastDragPointRef.current.time);
      const dx = touch.clientX - lastDragPointRef.current.x;
      const dy = touch.clientY - lastDragPointRef.current.y;

      const instVx = (dx / dt) * 16;
      const instVy = (dy / dt) * 16;
      velocityRef.current = {
        x: velocityRef.current.x * 0.3 + instVx * 0.7,
        y: velocityRef.current.y * 0.3 + instVy * 0.7,
      };
      lastDragPointRef.current = { x: touch.clientX, y: touch.clientY, time: now };

      setPosition({
        x: Math.round(touch.clientX - dragStartRef.current.x),
        y: Math.round(touch.clientY - dragStartRef.current.y),
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
    if (isDragging) {
      applyInertiaDrift();
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        setSelectedMarker(null);
        setSearchQuery('');
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset]);

  // Focus on specific marker
  const handleFocusMarker = (marker: MapLocationMarker) => {
    // Determine if marker belongs to Shire or Eriador
    const isShireMarker =
      marker.mapId === 'shire' ||
      SHIRE_LOCAL_MARKERS.some((m) => m.id === marker.id);
    if (isShireMarker && activePrimaryMap !== 'shire') {
      if (!isMapDisabled('shire')) {
        setActivePrimaryMap('shire');
      }
    } else if (!isShireMarker && activePrimaryMap !== 'eriador') {
      if (!isMapDisabled('eriador')) {
        setActivePrimaryMap('eriador');
      }
    }

    setSelectedMarker(marker);
    setSelectedSubLocationId(null);

    if (containerRef.current) {
      const targetZoom = isShireMarker
        ? Math.max(2.25, (marker.minZoom || 1.5) * 1.25)
        : Math.max(1.8, marker.minZoom || 1.5);
      setZoom(targetZoom);

      const rect = containerRef.current.getBoundingClientRect();
      const mapBaseWidth = MAP_RENDER_CONFIG.displayBaseWidthPx;
      const mapBaseHeight = mapBaseWidth * getMapAspectRatio();

      const focusX = marker.coords.x;
      const focusY = marker.coords.y;

      const offsetX = Math.round(rect.width / 2 - (focusX / 100) * mapBaseWidth * targetZoom);
      const offsetY = Math.round(rect.height / 2 - (focusY / 100) * mapBaseHeight * targetZoom);
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  const currentMapMarkers = useMemo(() => {
    const baseMarkers = activePrimaryMap === 'shire' ? SHIRE_LOCAL_MARKERS : ERIADOR_MARKERS;
    const matchingJourneyMarkers = JOURNEY_MARKERS.filter(
      (m) => (m.mapId || 'shire') === activePrimaryMap
    );
    return [...baseMarkers, ...matchingJourneyMarkers];
  }, [activePrimaryMap]);

  // Filtered markers mapped onto the active primary map
  const mapDisplayMarkers = useMemo(() => {
    return currentMapMarkers
      .map((marker) => {
        // Global marker category visibility toggle check
        if (MAP_GLOBAL_CONFIG.markerCategoryVisibility[marker.category] === false) {
          return null;
        }

        // If journey view is turned off, do NOT display journey-only markers
        if (!showJourneysOnMap && marker.isJourneyOnly) {
          return null;
        }

        // Check if marker is a waypoint in active journey
        const isJourneyPoint = activeJourney?.waypoints.some(
          (wp) => wp.markerId === marker.id || wp.name.toLowerCase() === marker.name.toLowerCase()
        );

        // A marker is visible to players if explicitly set (like Standelf & Bucklebury),
        // revealed by LoreMaster, OR part of a Journey WHEN journey view is ON
        const isPlayerVisible =
          marker.isPlayerVisible === true ||
          revealedMarkerIds.has(marker.id) ||
          (showJourneysOnMap && Boolean(isJourneyPoint));

        let isVisibleInCurrentMode = true;
        if (!isLoreMasterMode) {
          isVisibleInCurrentMode = isPlayerVisible;
        }

        if (!isVisibleInCurrentMode) return null;

        const categoryMatch = selectedCategory === 'all' || marker.category === selectedCategory;
        const queryClean = searchQuery.toLowerCase().trim();
        const subMatch =
          marker.subLocations &&
          marker.subLocations.some(
            (sub) =>
              sub.name.toLowerCase().includes(queryClean) ||
              (sub.description && sub.description.toLowerCase().includes(queryClean)) ||
              (sub.tags && sub.tags.some((t) => t.toLowerCase().includes(queryClean)))
          );

        const searchMatch =
          !queryClean ||
          marker.name.toLowerCase().includes(queryClean) ||
          (marker.elvishName && marker.elvishName.toLowerCase().includes(queryClean)) ||
          marker.regionName.toLowerCase().includes(queryClean) ||
          (marker.tags && marker.tags.some((t) => t.toLowerCase().includes(queryClean))) ||
          subMatch;

        if (!categoryMatch || !searchMatch) return null;

        return {
          ...marker,
          isPlayerVisible,
          isJourneyPoint: Boolean(isJourneyPoint),
          displayCoords: marker.coords,
          isVisibleOnCurrentMap: true,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);
  }, [currentMapMarkers, selectedCategory, searchQuery, isLoreMasterMode, revealedMarkerIds, activeJourney, showJourneysOnMap]);

  // Marker icon helper
  const getMarkerIcon = (category: MapMarkerCategory) => {
    switch (category) {
      case 'settlement':
        return <Home className="w-3.5 h-3.5" />;
      case 'culture':
        return <Shield className="w-3.5 h-3.5" />;
      case 'ruin':
        return <Castle className="w-3.5 h-3.5" />;
      case 'hazard':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'landmark':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'region':
        return <Trees className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  // Badge styles helper for danger level
  const getDangerBadgeStyle = (danger?: string) => {
    switch (danger) {
      case 'Safe':
        return 'bg-[#2E6F40] text-[#FAF5EB] border-[#1E4F2B]';
      case 'Guarded':
        return 'bg-[#2B5B84] text-[#FAF5EB] border-[#1B3F5E]';
      case 'Wild':
        return 'bg-[#B8860B] text-[#FAF5EB] border-[#8B6508]';
      case 'Perilous':
        return 'bg-[#A84200] text-[#FAF5EB] border-[#783000]';
      case 'Shadow':
        return 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010]';
      default:
        return 'bg-[#6B5748] text-[#FAF5EB] border-[#4A3B30]';
    }
  };

  // Derived state for selected marker / sublocation detail panel
  const activeSub = selectedMarker?.subLocations?.find((s) => s.id === selectedSubLocationId);
  const currentTitle = activeSub ? activeSub.name : selectedMarker?.name;
  const currentCategory = activeSub?.category || selectedMarker?.category;
  const currentDanger = activeSub?.dangerLevel || selectedMarker?.dangerLevel;
  const currentDesc = activeSub?.description || selectedMarker?.description;
  const currentBookSource = activeSub?.bookSource || selectedMarker?.bookSource;
  const currentTags = activeSub?.tags || selectedMarker?.tags;

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] bg-[#1A1614] overflow-hidden flex flex-col select-none">
      {/* Main Map Viewport Canvas */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 w-full h-full overflow-hidden bg-[#0F0D0C] touch-none cursor-${
          isDragging ? 'grabbing' : 'grab'
        }`}
      >
        {/* Floating Map Action Feedback Toast */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#181412]/95 text-[#FFD700] px-4 py-1.5 rounded-[2px] border border-[#FFD700]/60 shadow-2xl font-cinzel font-bold text-xs flex items-center gap-2 pointer-events-none"
            >
              <Compass className="w-4 h-4 text-[#FFD700]" />
              <span>{copiedToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transform Container holding Image and Overlay Markers */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => {
            const distMoved = Math.hypot(
              e.clientX - mouseDownScreenRef.current.x,
              e.clientY - mouseDownScreenRef.current.y
            );
            if (distMoved > MAP_RENDER_CONFIG.maxDragClickThresholdPx) return;

            if (isPointPickerActive || (isLoreMasterMode && e.shiftKey)) {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickY = e.clientY - rect.top;
              const xPct = Math.max(0, Math.min(100, parseFloat(((clickX / rect.width) * 100).toFixed(1))));
              const yPct = Math.max(0, Math.min(100, parseFloat(((clickY / rect.height) * 100).toFixed(1))));

              setPickerCoords({ x: xPct, y: yPct });
              const str = `coords: { x: ${xPct}, y: ${yPct} }`;
              navigator.clipboard?.writeText(str);
              setCopiedToast(`Inspected ${activePrimaryMap === 'shire' ? 'Shire' : 'Eriador'} Point: X: ${xPct}%, Y: ${yPct}% (Copied)`);
              setTimeout(() => setCopiedToast(null), 3000);
            }
          }}
          className="relative inline-block border-4 border-[#2A231F] shadow-2xl rounded-[2px] overflow-hidden"
        >
          {/* Target Pulse Crosshair Indicator when picking coordinates */}
          {pickerCoords && (
            <div
              style={{
                left: `${pickerCoords.x}%`,
                top: `${pickerCoords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-50 pointer-events-none flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#FFD700] animate-ping absolute bg-[#8E1616]/30" />
              <div className="w-5 h-5 rounded-full border-2 border-[#FFD700] bg-[#8E1616] text-[#FFD700] flex items-center justify-center font-bold text-[10px] shadow-lg">
                <Crosshair className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
            {/* Eriador World Map */}
            <img
              ref={imgRef}
              src={eriadorMapImg}
              alt="Eriador Map of Middle-earth"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0) {
                  setEriadorAspectRatio(img.naturalHeight / img.naturalWidth);
                }
              }}
              style={{
                imageRendering: 'auto',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                width: `${MAP_RENDER_CONFIG.displayBaseWidthPx}px`,
                display: activePrimaryMap === 'eriador' ? 'block' : 'none',
                opacity: activePrimaryMap === 'eriador' ? 1.0 : 0,
                transition: 'opacity 0.4s ease-in-out',
                pointerEvents: activePrimaryMap === 'eriador' ? 'auto' : 'none',
              }}
              className="max-w-none h-auto object-contain select-none"
              draggable={false}
            />

            {/* The Shire Regional Map */}
            <img
              src={shireMapImg}
              alt="The Shire Regional Map"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0) {
                  setShireAspectRatio(img.naturalHeight / img.naturalWidth);
                }
              }}
              style={{
                imageRendering: 'auto',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                width: `${MAP_RENDER_CONFIG.displayBaseWidthPx}px`,
                display: activePrimaryMap === 'shire' ? 'block' : 'none',
                opacity: activePrimaryMap === 'shire' ? 1.0 : 0,
                transition: 'opacity 0.4s ease-in-out',
                pointerEvents: activePrimaryMap === 'shire' ? 'auto' : 'none',
              }}
              className="max-w-none h-auto object-contain select-none"
              draggable={false}
            />

            {/* Floating Return Banner on Shire Map View */}
            {activePrimaryMap === 'shire' && (
              <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-[#181412]/90 backdrop-blur-md border border-[#D4AF37]/60 px-3 py-1.5 rounded shadow-xl text-[#E8DCC4] pointer-events-auto">
                <Trees className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span className="font-cinzel text-xs font-bold text-[#FFD700] hidden sm:inline">The Shire Regional View</span>
                <button
                  type="button"
                  onClick={handleSwitchToEriadorMap}
                  className="ml-1 px-2.5 py-1 bg-[#8E1616] hover:bg-[#A82222] text-[#FFD700] font-cinzel font-bold text-[11px] rounded border border-[#FFD700]/40 transition-colors cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Return to Eriador</span>
                </button>
              </div>
            )}

            {/* The Shire Regional Map Clickable Low-Impact Overlay Box (Only on Eriador World Map) */}
            {activePrimaryMap === 'eriador' && SHIRE_MAP_CONFIG.enabled && (
              <div
                style={{
                  position: 'absolute',
                  left: `${SHIRE_MAP_CONFIG.position.xMin}%`,
                  top: `${SHIRE_MAP_CONFIG.position.yMin}%`,
                  width: `${SHIRE_MAP_CONFIG.position.widthPct}%`,
                  height: `${SHIRE_MAP_CONFIG.position.heightPct}%`,
                  zIndex: 25,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const distMoved = Math.hypot(
                    e.clientX - mouseDownScreenRef.current.x,
                    e.clientY - mouseDownScreenRef.current.y
                  );
                  if (distMoved <= MAP_RENDER_CONFIG.maxDragClickThresholdPx) {
                    handleSwitchToShireMap();
                  }
                }}
                className="group absolute cursor-pointer rounded-[2px] border border-[#D4AF37]/35 hover:border-[#FFD700]/90 bg-transparent hover:bg-[#FFD700]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center justify-center p-1 overflow-hidden"
                title="The Shire Regional Map"
              >
                {/* Simple text 'The Shire' visible on hover only */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#181412]/90 text-[#FFD700] text-[11px] font-cinzel font-bold px-2.5 py-1 rounded border border-[#FFD700]/50 shadow-md whitespace-nowrap pointer-events-none">
                  The Shire
                </span>
              </div>
            )}

            {/* Interactive Dotted Journey Paths Overlay - Subtle & Elegant Red Ink Cartography */}
            {showJourneysOnMap && activeJourney && activeJourney.waypoints.length >= 2 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-15"
                viewBox={`0 0 100 ${100 * getMapAspectRatio()}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const aspect = getMapAspectRatio();
                  const wps = activeJourney.waypoints.filter(
                    (wp) => !wp.mapId || (wp.mapId as string) === activePrimaryMap || (wp.mapId as string) === 'all'
                  );
                  if (wps.length < 2) return null;

                  const pathData = wps
                    .map((wp, idx) => {
                      const c = getWaypointCoords(wp);
                      return `${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y * aspect}`;
                    })
                    .join(' ');

                  return (
                    <g key={activeJourney.id}>
                      {/* Parchment contrast undertone halo for small dots */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={MAP_GLOBAL_CONFIG.journeyConfig.haloColor}
                        strokeWidth="0.2"
                        strokeDasharray={`0.01, ${MAP_GLOBAL_CONFIG.journeyConfig.dotGap}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.7}
                      />
                      {/* Fine Aged Crimson Ink - Uniform Small Dots */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={MAP_GLOBAL_CONFIG.journeyConfig.lineColor}
                        strokeWidth="0.16"
                        strokeDasharray={`0.01, ${MAP_GLOBAL_CONFIG.journeyConfig.dotGap}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.95}
                      />
                      {/* Waypoint Connection Nodes - Perfectly Circular */}
                      {wps.map((wp) => {
                        const c = getWaypointCoords(wp);
                        const cx = c.x;
                        const cy = c.y * aspect;
                        return (
                          <g key={wp.id}>
                            {wp.isCurrentLocation ? (
                              <>
                                {/* Soft breathing halo around current party location */}
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="0.8"
                                  fill="none"
                                  stroke="#8B2626"
                                  strokeWidth="0.1"
                                  opacity="0.5"
                                  className="animate-pulse"
                                />
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="0.48"
                                  fill="#FAF2E1"
                                  stroke="#8B2626"
                                  strokeWidth="0.16"
                                />
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="0.24"
                                  fill="#8B2626"
                                />
                              </>
                            ) : (
                              <circle
                                cx={cx}
                                cy={cy}
                                r="0.32"
                                fill="#8B2626"
                                stroke="#FAF2E1"
                                strokeWidth="0.1"
                                opacity="0.9"
                              />
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Interactive Overlay Markers */}
                {mapDisplayMarkers.map((marker) => {
                  if (!marker.isVisibleOnCurrentMap) return null;

                  const reqZoom = (marker.minZoom || 1.0) * 0.4;
                  // Smooth marker fade based on zoom level distance
                  let markerOpacity = 1;
                  if (zoom < reqZoom) {
                    markerOpacity = Math.max(0.2, 1 - (reqZoom - zoom) * 2.5);
                  }
                  const isSelected = selectedMarker?.id === marker.id;

                  if (markerOpacity <= 0.05) return null;

                  return (
                    <div
                      key={marker.id}
                      style={{
                        left: `${marker.displayCoords.x}%`,
                        top: `${marker.displayCoords.y}%`,
                        opacity: markerOpacity,
                        // Inverse scale marker so icon size stays readable regardless of map zoom
                        transform: `translate(-50%, -50%) scale(${MAP_RENDER_CONFIG.markerBaseScale * Math.max(0.7, 1 / Math.sqrt(zoom))})`,
                      }}
                      className="absolute z-30 transition-opacity duration-300 pointer-events-none"
                    >
                      <div className="relative flex flex-col items-center pointer-events-auto">
                        <motion.button
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusMarker(marker);
                          }}
                          className={`group relative flex flex-col items-center cursor-pointer p-0.5 rounded-full transition-colors ${
                            isSelected
                              ? 'ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#1A1614] z-40'
                              : ''
                          }`}
                        >
                          {/* Marker Pin Icon Bubble - Centered on coords */}
                          {(() => {
                            const isRedDiamond = marker.id === 'adventure-phase-event' || marker.tags?.includes('Red Diamond');
                            return (
                              <div
                                className={`flex items-center justify-center shadow-lg transition-all ${
                                  marker.isJourneyPoint ? 'ring-2 ring-[#FFD700] ring-offset-1 ring-offset-[#1A1614]' : ''
                                } ${
                                  isRedDiamond
                                    ? 'w-6 h-6 rotate-45 rounded-[2px] bg-[#8B2626] border-2 border-[#FFD700] text-[#FFD700]'
                                    : 'w-7 h-7 rounded-full border-2'
                                } ${
                                  !isRedDiamond && marker.category === 'culture'
                                    ? 'bg-[#8E1616] text-[#FAF5EB] border-[#FFD700]'
                                    : !isRedDiamond && marker.category === 'settlement'
                                    ? 'bg-[#B8860B] text-[#FAF5EB] border-[#FAF3E0]'
                                    : !isRedDiamond && marker.category === 'hazard'
                                    ? 'bg-[#8E1616] text-[#FAF5EB] border-[#8E1616]'
                                    : !isRedDiamond
                                    ? 'bg-[#2B231D] text-[#FAF3E0] border-[#C8B693]'
                                    : ''
                                }`}
                              >
                                {isRedDiamond ? (
                                  <div className="w-1.5 h-1.5 rounded-[0.5px] bg-[#FFD700] shadow-2xs" />
                                ) : (
                                  <div className="flex items-center justify-center">
                                    {getMarkerIcon(marker.category)}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Marker Label Tag - Hidden until hovered over or selected */}
                          <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 rounded-[2px] font-cinzel font-bold text-[10px] sm:text-xs whitespace-nowrap shadow-xl border pointer-events-auto transition-all duration-200 flex flex-col items-center ${
                              isSelected
                                ? 'opacity-100 scale-105 z-40 bg-[#FFD700] text-[#1A1614] border-[#B8860B]'
                                : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 bg-[#FAF5EB]/95 text-[#28211D] border-[#C8B693] group-hover:bg-[#FAF5EB]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{marker.name}</span>
                              {marker.subLocations && (
                                <span className="text-[9px] font-mono bg-[#8E1616] text-[#FFD700] px-1 py-0.2 rounded font-bold">
                                  {marker.subLocations.length + 1} Sites
                                </span>
                              )}
                            </div>

                            {marker.subLocations && (
                              <div className="mt-1.5 pt-1.5 border-t border-[#B8860B]/40 flex flex-col gap-1 w-full text-left">
                                <span className="text-[9px] font-mono text-[#8E1616] font-bold uppercase tracking-wider">
                                  Expand Site Options:
                                </span>
                                {marker.subLocations.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFocusMarker(marker);
                                      setSelectedSubLocationId(sub.id);
                                    }}
                                    className="text-[10px] font-serif text-[#28211D] hover:text-[#8E1616] hover:underline flex items-center justify-between gap-2 cursor-pointer bg-[#F3E2C8]/50 hover:bg-[#F3E2C8] px-1.5 py-0.5 rounded border border-[#C8B693]/40"
                                  >
                                    <span className="font-bold">• {sub.name}</span>
                                    {isLoreMasterMode && sub.bookSource && (
                                      <span className="text-[8px] font-mono text-[#8E1616]">
                                        {getFullBookTitle(sub.bookSource.bookTitle)} {sub.bookSource.pageNumber}
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}

                            {isLoreMasterMode && marker.bookSource && !marker.subLocations && (
                              <span className="text-[9px] font-mono font-normal text-[#8E1616] bg-[#F3E2C8] px-1 py-0.2 rounded border border-[#B8860B]/50 mt-0.5">
                                📖 {getFullBookTitle(marker.bookSource.bookTitle)} {marker.bookSource.pageNumber && `(${marker.bookSource.pageNumber})`}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
        </div>

        {/* Floating Map Zoom & Control Buttons (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 bg-[#FAF3E0]/95 backdrop-blur-xs p-1.5 rounded-[2px] border-2 border-[#D8C8A8] shadow-md">
          {/* Fellowship Journey Trail Toggle Button */}
          <button
            type="button"
            onClick={() => setShowJourneysOnMap((prev) => !prev)}
            className={`p-2 rounded-[2px] transition-all cursor-pointer border flex items-center justify-center ${
              showJourneysOnMap
                ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs'
                : 'bg-[#EFE5CB] hover:bg-[#8E1616] hover:text-[#FAF5EB] text-[#5C4A3C] border-[#C8B693]'
            }`}
            title={showJourneysOnMap ? 'Hide Journey Trail' : 'Show Journey Trail'}
          >
            <Route className="w-4 h-4 text-[#FFD700]" />
          </button>
          <div className="h-px bg-[#D8C8A8] my-0.5" />
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-[2px] bg-[#EFE5CB] hover:bg-[#8E1616] hover:text-[#FAF5EB] text-[#8E1616] transition-colors cursor-pointer border border-[#C8B693]"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-[2px] bg-[#EFE5CB] hover:bg-[#8E1616] hover:text-[#FAF5EB] text-[#8E1616] transition-colors cursor-pointer border border-[#C8B693]"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-[2px] bg-[#EFE5CB] hover:bg-[#8E1616] hover:text-[#FAF5EB] text-[#8E1616] transition-colors cursor-pointer border border-[#C8B693]"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-mono text-center text-[#6B5748] font-bold pt-1 border-t border-[#D8C8A8]">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Floating LoreMaster Inspector Panel (Top Left) */}
        {isLoreMasterMode && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#2B1B17]/95 backdrop-blur-xs p-1.5 rounded-[2px] border border-[#FFD700]/60 shadow-md">
            <div className="hidden sm:flex items-center gap-1 px-1 text-[10px] font-cinzel font-bold text-[#FFD700]">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              <span>INSPECTOR:</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPointPickerActive((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-cinzel font-bold transition-all cursor-pointer border ${
                isPointPickerActive
                  ? 'bg-[#FFD700] text-[#1A1614] border-[#FFD700] shadow-md animate-pulse'
                  : 'bg-[#8E1616] text-[#FAF5EB] border-[#FFD700]/40 hover:bg-[#A82222]'
              }`}
              title="Click anywhere on map canvas to capture precise X,Y coordinates for backend code"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isPointPickerActive ? 'Point Picker (Active)' : 'Point Picker'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const width = MAP_RENDER_CONFIG.displayBaseWidthPx;
                const height = width * getMapAspectRatio();
                const centerX = Math.max(0, Math.min(100, parseFloat((((-position.x + 300) / (width * zoom)) * 100).toFixed(1))));
                const centerY = Math.max(0, Math.min(100, parseFloat((((-position.y + 200) / (height * zoom)) * 100).toFixed(1))));
                setPickerCoords({ x: centerX, y: centerY });
                const str = `coords: { x: ${centerX}, y: ${centerY} }`;
                navigator.clipboard?.writeText(str);
                setCopiedToast(`Copied Viewport Center Coords: ${str}`);
                setTimeout(() => setCopiedToast(null), 2500);
              }}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded text-[11px] font-cinzel font-bold bg-[#3D2C24] text-[#FFD700] hover:bg-[#523A30] border border-[#FFD700]/40 transition-colors cursor-pointer"
              title="Capture coordinates at center of map view"
            >
              <Compass className="w-3 h-3" />
              <span>Center Coords</span>
            </button>

            {pickerCoords && (
              <button
                type="button"
                onClick={() => setPickerCoords(null)}
                className="p-1 text-[#FFD700] hover:text-[#FAF5EB] transition-colors cursor-pointer"
                title="Clear inspected point"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Selected Marker Detail Card Drawer */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed sm:absolute bottom-0 inset-x-0 sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 z-30 w-full sm:w-80 md:w-96 max-h-[80vh] sm:max-h-none bg-[#FAF3E0] border-t-2 sm:border-2 border-[#D8C8A8] rounded-t-xl sm:rounded-[2px] shadow-2xl p-4 flex flex-col justify-between overflow-y-auto no-scrollbar"
            >
                <div>
                  {/* Mobile Drag Indicator Bar */}
                  <div className="w-10 h-1 bg-[#C8B693] rounded-full mx-auto mb-3 sm:hidden" />

                  {/* Header Title & Close */}
                  <div className="flex items-start justify-between gap-2 border-b-2 border-[#8E1616]/20 pb-2.5 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] bg-[#E8DCC2] text-[#8E1616] border border-[#C8B693]">
                          {currentCategory}
                        </span>
                        {currentDanger && (
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] border ${getDangerBadgeStyle(
                              currentDanger
                            )}`}
                          >
                            {currentDanger}
                          </span>
                        )}
                      </div>
                      <h3 className="font-cinzel font-bold text-lg text-[#8E1616] leading-tight">
                        {currentTitle}
                      </h3>
                      {!activeSub && selectedMarker.elvishName && (
                        <p className="font-fell italic text-xs text-[#6B5748]">
                          Sindarin: {selectedMarker.elvishName}
                        </p>
                      )}
                      {activeSub && (
                        <p className="font-serif italic text-xs text-[#8E1616]">
                          Nested within: {selectedMarker.name}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMarker(null);
                        setSelectedSubLocationId(null);
                      }}
                      className="p-1 rounded-[2px] text-[#8C7A6B] hover:text-[#8E1616] hover:bg-[#E8DCC2] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Nested Sub-Locations Selector Tabs */}
                  {selectedMarker.subLocations && selectedMarker.subLocations.length > 0 && (
                    <div className="mb-3 p-2 bg-[#EFE5CB] border-2 border-[#C8B693] rounded-[2px] shadow-2xs">
                      <div className="flex items-center justify-between gap-1 mb-1.5 border-b border-[#C8B693]/60 pb-1">
                        <p className="text-[10px] font-cinzel font-bold text-[#8E1616] uppercase flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-[#B8860B]" />
                          Landmark Site Options:
                        </p>
                        <span className="text-[9px] font-mono bg-[#8E1616] text-[#FFD700] px-1 py-0.2 rounded font-bold">
                          Nested
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedSubLocationId(null)}
                          className={`px-2 py-1 text-[11px] font-serif font-bold rounded-[2px] transition-all cursor-pointer border ${
                            selectedSubLocationId === null
                              ? 'bg-[#8E1616] text-[#FAF5EB] border-[#8E1616] shadow-2xs'
                              : 'bg-[#FAF5EB] text-[#5C4A3C] border-[#C8B693] hover:bg-[#E8DCC2]'
                          }`}
                        >
                          Main Complex
                        </button>
                        {selectedMarker.subLocations.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setSelectedSubLocationId(sub.id)}
                            className={`px-2 py-1 text-[11px] font-serif font-bold rounded-[2px] transition-all cursor-pointer border ${
                              selectedSubLocationId === sub.id
                                ? 'bg-[#8E1616] text-[#FAF5EB] border-[#8E1616] shadow-2xs'
                                : 'bg-[#FAF5EB] text-[#5C4A3C] border-[#C8B693] hover:bg-[#E8DCC2]'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Separate Adventure Phase Event Date Box (Positioned above Region) */}
                  {(selectedMarker.eventDate || selectedMarker.id === 'adventure-phase-event') && (
                    <div className="mb-2.5 p-2.5 bg-[#FAF3E0] border border-[#B8860B]/60 rounded-[2px] shadow-2xs flex items-center gap-2.5 text-xs font-serif text-[#8E1616]">
                      <Calendar className="w-4 h-4 text-[#B8860B] shrink-0" />
                      <div>
                        <span className="text-[10px] font-cinzel font-bold text-[#5C4A3C] uppercase block leading-none mb-0.5">
                          Adventure Phase Event Date:
                        </span>
                        <span className="text-xs font-cinzel text-[#8E1616] font-bold">
                          {selectedMarker.eventDate || "'Trewsday' 10th July T.A 2965"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Region Subtitle */}
                  <p className="text-xs font-serif font-bold text-[#28211D] mb-2 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#B8860B]" />
                    Region: <span className="font-normal text-[#5C4A3C]">{selectedMarker.regionName}</span>
                  </p>

                  {/* Main Lore Description */}
                  <div className="p-3 bg-[#FAF5EB] rounded-[2px] border border-[#D8C8A8] mb-3">
                    <p className="text-xs font-serif leading-relaxed text-[#28211D]">
                      {currentDesc}
                    </p>
                  </div>

                  {/* Loremaster Source & Page Citation Box */}
                  {currentBookSource && (
                    <div
                      className={`p-3 rounded-[2px] border mb-3 transition-all ${
                        isLoreMasterMode
                          ? 'bg-[#F3E2C8] border-[#B8860B] shadow-xs'
                          : 'bg-[#FAF5EB] border-[#D8C8A8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-[#B8860B]/30">
                        <div className="flex items-center gap-1.5 text-[#8E1616] font-cinzel font-bold text-xs">
                          <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
                          <span>Source Book & Page</span>
                        </div>
                        {isLoreMasterMode && (
                          <span className="text-[9px] font-mono bg-[#8E1616] text-[#FFD700] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Loremaster
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-serif text-[#28211D]">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#28211D]">📖 {getFullBookTitle(currentBookSource.bookTitle)}</span>
                          {currentBookSource.pageNumber && (
                            <span className="font-mono text-[11px] text-[#8E1616] bg-[#EFE5CB] px-1.5 py-0.2 rounded border border-[#C8B693]">
                              {currentBookSource.pageNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags list */}
                  {currentTags && currentTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {currentTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-serif bg-[#EFE5CB] text-[#5C4A3C] px-2 py-0.5 rounded-[2px] border border-[#D4C4A0]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dedicated Fellowship Journey Log & Events Box */}
                  {selectedMarker && activeJourney && (() => {
                    const matchingWps = activeJourney.waypoints.filter(
                      (wp) => wp.markerId === selectedMarker.id || wp.name.toLowerCase() === selectedMarker.name.toLowerCase()
                    );

                    if (matchingWps.length === 0) {
                      return (
                        <button
                          type="button"
                          onClick={() => handleAddMarkerToActiveJourney(selectedMarker)}
                          className="w-full mb-3 py-1.5 px-2 bg-[#2D1B18] hover:bg-[#3D2520] text-[#E5D2B8] rounded-[2px] font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 border border-[#8E2A2A]/80 transition-colors shadow-xs cursor-pointer"
                        >
                          <Route className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>Add Location to Active Journey ({activeJourney.title})</span>
                        </button>
                      );
                    }

                    return (
                      <div className="mb-3 p-3 bg-[#2A1D1A] text-[#FAF5EB] rounded-[2px] border-2 border-[#8B2626] shadow-md relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#8B2626]/80 pb-1.5 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-[#FFD700]" />
                            <h4 className="font-cinzel font-bold text-xs text-[#FFD700] uppercase tracking-wider m-0">
                              Fellowship Journey Log & Events
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-[#D4AF37] bg-[#1A1210] px-1.5 py-0.5 rounded border border-[#8B2626]/60">
                            {activeJourney.title}
                          </span>
                        </div>

                        {matchingWps.map((wp) => {
                          const stepIdx = activeJourney.waypoints.findIndex((w) => w.id === wp.id) + 1;
                          return (
                            <div key={wp.id} className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-serif flex-wrap gap-1">
                                <span className="font-cinzel font-bold text-[#E5D2B8] flex items-center gap-1.5">
                                  <span className="w-4.5 h-4.5 rounded-full bg-[#8B2626] text-[#FFD700] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#FFD700]/40">
                                    {stepIdx}
                                  </span>
                                  Stop {stepIdx} of {activeJourney.waypoints.length}: {wp.name}
                                </span>
                                {wp.isCurrentLocation ? (
                                  <span className="text-[10px] font-mono bg-[#8B2626] text-[#FFD700] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[#FFD700]/40 animate-pulse flex items-center gap-1">
                                    <Navigation className="w-3 h-3" /> Current Party Position
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-[#C8B693]">
                                    📅 {wp.date || 'Visited'}
                                  </span>
                                )}
                              </div>

                              {/* Journey Event Narrative */}
                              <div className="p-2.5 bg-[#1A1210] rounded border border-[#5C2320] text-xs font-serif text-[#E8DCC4] leading-relaxed">
                                <span className="text-[10px] font-cinzel font-bold text-[#FFD700] uppercase block mb-1">
                                  Event / Journey Note:
                                </span>
                                <p className="m-0 italic">"{wp.note || 'The company passed through this location during their journey.'}"</p>
                              </div>

                              {/* Controls */}
                              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                                {!wp.isCurrentLocation ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCurrentWaypoint(activeJourney.id, wp.id)}
                                    className="px-2.5 py-1 bg-[#8B2626] hover:bg-[#A82222] text-[#FFD700] font-cinzel font-bold text-[10px] rounded transition-colors cursor-pointer flex items-center gap-1 border border-[#FFD700]/40"
                                  >
                                    <Navigation className="w-3 h-3" />
                                    <span>Set as Current Position</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-serif italic text-[#70E082]">
                                    ✓ Active Fellowship Location
                                  </span>
                                )}

                                {isLoreMasterMode && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newNote = prompt('Update Journey Event Note for this stop:', wp.note || '');
                                        if (newNote !== null) {
                                          setJourneys((prev) =>
                                            prev.map((j) => {
                                              if (j.id !== activeJourney.id) return j;
                                              return {
                                                ...j,
                                                waypoints: j.waypoints.map((w) =>
                                                  w.id === wp.id ? { ...w, note: newNote } : w
                                                ),
                                              };
                                            })
                                          );
                                        }
                                      }}
                                      className="px-2 py-1 bg-[#3D2520] hover:bg-[#4D3028] text-[#FAF5EB] font-serif text-[10px] rounded transition-colors cursor-pointer flex items-center gap-1 border border-[#8B2626]/80"
                                    >
                                      <Edit2 className="w-3 h-3 text-[#FFD700]" />
                                      <span>Edit Event Note</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveWaypoint(activeJourney.id, wp.id)}
                                      className="px-2 py-1 bg-[#3D2520] hover:bg-[#5C2020] text-[#A8988A] hover:text-[#FF6B6B] font-serif text-[10px] rounded transition-colors cursor-pointer flex items-center gap-1 border border-[#8B2626]/80"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Remove</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                          {/* Loremaster Quick Action Controls Bar */}
                {isLoreMasterMode && selectedMarker && (
                  <div className="mt-2 pt-2 border-t border-[#B8860B]/40 flex flex-wrap gap-1.5 bg-[#F3E2C8]/70 p-2 rounded-[2px] border border-[#C8B693] mb-2">
                    <span className="w-full text-[10px] font-cinzel font-bold text-[#8E1616] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#B8860B]" /> Loremaster Inspection Controls:
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setRevealedMarkerIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(selectedMarker.id)) {
                            next.delete(selectedMarker.id);
                            setCopiedToast(`Hidden "${selectedMarker.name}" from Players`);
                          } else {
                            next.add(selectedMarker.id);
                            setCopiedToast(`Revealed "${selectedMarker.name}" to Players`);
                          }
                          setTimeout(() => setCopiedToast(null), 2200);
                          return next;
                        });
                      }}
                      className={`px-2 py-1 text-[10px] font-serif font-bold rounded-[2px] border transition-colors cursor-pointer flex items-center gap-1 ${
                        (selectedMarker.isPlayerVisible === true || revealedMarkerIds.has(selectedMarker.id))
                          ? 'bg-[#2E6F40] text-[#FAF5EB] border-[#1E4F2B] hover:bg-[#235832]'
                          : 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] hover:bg-[#A82222]'
                      }`}
                      title="Toggle visibility of this marker for Players (when Loremaster mode is OFF)"
                    >
                      <Eye className="w-3 h-3" />
                      <span>
                        {(selectedMarker.isPlayerVisible === true || revealedMarkerIds.has(selectedMarker.id))
                          ? 'Visible to Players (Click to Hide)'
                          : 'Hidden from Players (Click to Reveal)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const str = `coords: { x: ${selectedMarker.coords.x}, y: ${selectedMarker.coords.y} }`;
                        navigator.clipboard?.writeText(str);
                        setCopiedToast(`Copied: x: ${selectedMarker.coords.x}%, y: ${selectedMarker.coords.y}%`);
                        setTimeout(() => setCopiedToast(null), 2200);
                      }}
                      className="px-2 py-1 text-[10px] font-serif font-bold bg-[#FAF5EB] text-[#8E1616] hover:bg-[#E8DCC2] rounded-[2px] border border-[#C8B693] transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy percentage coordinates snippet"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Coords ({selectedMarker.coords.x}%, {selectedMarker.coords.y}%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const code = JSON.stringify(selectedMarker, null, 2);
                        navigator.clipboard?.writeText(code);
                        setCopiedToast(`Copied Full Code Object for "${selectedMarker.name}"`);
                        setTimeout(() => setCopiedToast(null), 2200);
                      }}
                      className="px-2 py-1 text-[10px] font-serif font-bold bg-[#FAF5EB] text-[#5C4A3C] hover:bg-[#E8DCC2] rounded-[2px] border border-[#C8B693] transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy full marker object representation for backend code"
                    >
                      <Copy className="w-3 h-3 text-[#8E1616]" />
                      <span>Copy Code Snippet</span>
                    </button>
                  </div>
                )}

                {/* Related Action Links */}
                <div className="space-y-2 pt-3 border-t border-[#D8C8A8]">
                  {selectedMarker.cultureRef && onSelectHeroicCulture && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectSupplement) onSelectSupplement('Heroic Cultures');
                        if (onSelectHeroicCulture) onSelectHeroicCulture(selectedMarker.cultureRef!);
                      }}
                      className="w-full py-2 px-3 bg-[#8E1616] text-[#FAF5EB] hover:bg-[#A82222] transition-colors rounded-[2px] font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>View Heroic Culture</span>
                    </button>
                  )}

                  {selectedMarker.chapterRef && onNavigateToChapter && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectSupplement) onSelectSupplement('Core Rules');
                        if (onNavigateToChapter)
                          onNavigateToChapter(
                            selectedMarker.chapterRef!.chapterId,
                            selectedMarker.chapterRef!.sectionId
                          );
                      }}
                      className="w-full py-2 px-3 bg-[#E8DCC2] hover:bg-[#E0D0AE] text-[#8E1616] transition-colors rounded-[2px] font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-[#C8B693]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read in Rulebook ({selectedMarker.chapterRef.title})</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Loremaster Point Inspection Overlay Card */}
      <AnimatePresence>
        {pickerCoords && isLoreMasterMode && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-5 left-5 z-40 bg-[#FAF3E0] border-2 border-[#8E1616] p-3.5 rounded-[2px] shadow-2xl max-w-sm w-full text-[#28211D] font-serif"
          >
            <div className="flex items-center justify-between border-b border-[#C8B693] pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-[#8E1616]" />
                <h4 className="font-cinzel font-bold text-xs text-[#8E1616] m-0 uppercase tracking-wider">
                  Map Point Inspector
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPickerCoords(null)}
                className="text-[#8C7A6B] hover:text-[#8E1616] cursor-pointer p-0.5"
                title="Close inspection box"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#5C4A3C]">Target Map Canvas:</span>
                <span className="font-mono bg-[#EFE5CB] px-2 py-0.5 rounded border border-[#C8B693] font-bold text-[#8E1616]">
                  {activePrimaryMap === 'shire' ? 'The Shire Regional Map' : 'Eriador World Map'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#EFE5CB] p-2 rounded border border-[#C8B693] font-mono font-bold text-xs">
                <span className="text-[#5C4A3C]">Captured Point:</span>
                <span className="text-[#8E1616]">X: {pickerCoords.x}% | Y: {pickerCoords.y}%</span>
              </div>

              <p className="text-[10px] text-[#6B5748] italic m-0">
                Copy formatted code snippets below to apply directly to backend data files (`eriadorMapData.ts` or `SHIRE_LOCAL_MARKERS`).
              </p>

              <div className="pt-1 grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const str = `coords: { x: ${pickerCoords.x}, y: ${pickerCoords.y} }`;
                    navigator.clipboard?.writeText(str);
                    setCopiedToast(`Copied: ${str}`);
                    setTimeout(() => setCopiedToast(null), 2200);
                  }}
                  className="w-full py-1.5 px-2 bg-[#8E1616] text-[#FAF5EB] hover:bg-[#A82222] font-cinzel font-bold text-xs rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-[#FFD700]/40 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Copy Coordinates Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const stub = `{
  id: 'location_${Date.now()}',
  name: 'New Location',
  category: 'landmark',
  coords: { x: ${pickerCoords.x}, y: ${pickerCoords.y} },
  regionName: '${activePrimaryMap === 'shire' ? 'Westfarthing' : 'Eriador'}',
  dangerLevel: 'Safe',
  description: 'Enter description text...',
},`;
                    navigator.clipboard?.writeText(stub);
                    setCopiedToast(`Copied Marker Code Stub to Clipboard`);
                    setTimeout(() => setCopiedToast(null), 2200);
                  }}
                  className="w-full py-1.5 px-2 bg-[#EFE5CB] text-[#5C4A3C] hover:bg-[#E8DCC2] font-serif font-bold text-xs rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-[#C8B693]"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8E1616]" />
                  <span>Copy Marker Object Code Stub</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
