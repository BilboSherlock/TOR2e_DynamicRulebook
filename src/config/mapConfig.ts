import { MapMarkerCategory } from '../types';

export interface MapGlobalConfig {
  /**
   * Default primary map to open when map component loads.
   * Options: 'shire' | 'eriador'
   */
  defaultPrimaryMap: 'shire' | 'eriador';

  /**
   * Navigation and access restrictions for regional/world maps.
   */
  mapNavigation: {
    /**
     * Disable Eriador World Map for players (!isLoreMasterMode).
     * When true, only LoreMasters can access the Eriador World Map.
     */
    disableEriadorForPlayers: boolean;

    /**
     * Disable The Shire Regional Map for players (!isLoreMasterMode).
     * When true, only LoreMasters can access The Shire Regional Map.
     */
    disableShireForPlayers: boolean;

    /**
     * Disable Eriador World Map globally for all users.
     */
    disableEriadorGlobally: boolean;

    /**
     * Disable The Shire Regional Map globally for all users.
     */
    disableShireGlobally: boolean;

    /**
     * Message shown in toast notification when a user clicks a restricted map button.
     */
    restrictedMapMessage: string;
  };

  /**
   * Global map canvas viewport & render options.
   */
  renderConfig: {
    originalWidthPx: number;
    originalHeightPx: number;
    displayBaseWidthPx: number;
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    markerBaseScale: number;
    maxDragClickThresholdPx: number;
  };

  /**
   * Regional Shire Map configuration.
   */
  shireMapConfig: {
    enabled: boolean;
    id: string;
    title: string;
    subtitle: string;
    position: {
      xMin: number;
      yMin: number;
      widthPct: number;
      heightPct: number;
    };
    overlay: {
      defaultOpacity: number;
      hoverOpacity: number;
      imageWidthPct: number;
      imageHeightPct: number;
      imageLeftPct: number;
      imageTopPct: number;
      clipTopPct: number;
      clipLeftPct: number;
      clipRightPct: number;
      clipBottomPct: number;
      objectFit: string;
      objectPosition: string;
    };
    minFocusZoom: number;
    maxFocusZoom: number;
  };

  /**
   * Fellowship Journey trail options.
   */
  journeyConfig: {
    /**
     * Default state of the journey trail toggle on map load.
     */
    defaultShowJourneysOnMap: boolean;
    /**
     * Color of the journey path line.
     */
    lineColor: string;
    /**
     * Color of the parchment contrast halo underlying the trail dots.
     */
    haloColor: string;
    /**
     * Dot spacing gap along the SVG path line.
     */
    dotGap: number;
  };

  /**
   * Category-level marker visibility toggles.
   * Setting a category to false hides all markers in that category from the map.
   */
  markerCategoryVisibility: Record<MapMarkerCategory, boolean>;

  /**
   * Default category filter selected in the filter UI on map load.
   */
  defaultCategoryFilter: MapMarkerCategory | 'all';

  /**
   * Enable/disable LoreMaster point picker & inspection tools.
   */
  allowPointPicker: boolean;
}

export const MAP_GLOBAL_CONFIG: MapGlobalConfig = {
  // Default map to load on initial map load ('shire' opens by default)
  defaultPrimaryMap: 'shire',

  mapNavigation: {
    // Disable Eriador World Map for players (requires LoreMaster mode)
    disableEriadorForPlayers: true,
    disableShireForPlayers: false,
    disableEriadorGlobally: false,
    disableShireGlobally: false,
    restrictedMapMessage: 'Eriador World Map is restricted to LoreMasters.',
  },

  renderConfig: {
    originalWidthPx: 6000,
    originalHeightPx: 3872,
    displayBaseWidthPx: 2000,
    minZoom: 0.2,
    maxZoom: 3.5,
    zoomStep: 0.3,
    markerBaseScale: 2 / 3,
    maxDragClickThresholdPx: 8,
  },

  shireMapConfig: {
    enabled: true,
    id: 'the-shire',
    title: 'The Shire Regional Map',
    subtitle: 'Westfarthing, Hobbiton, Bywater & Brandywine Borders',
    position: {
      xMin: 47.4,
      yMin: 33.7,
      widthPct: 13.5,
      heightPct: 16.217,
    },
    overlay: {
      defaultOpacity: 1,
      hoverOpacity: 1,
      imageWidthPct: 94,
      imageHeightPct: 98,
      imageLeftPct: 0,
      imageTopPct: 0,
      clipTopPct: 0,
      clipLeftPct: 0,
      clipRightPct: 0,
      clipBottomPct: 0,
      objectFit: 'fill',
      objectPosition: 'top left',
    },
    minFocusZoom: 2.2,
    maxFocusZoom: 4.5,
  },

  journeyConfig: {
    defaultShowJourneysOnMap: true,
    lineColor: '#8B2626',
    haloColor: '#FAF2E1',
    dotGap: 0.6,
  },

  // Toggle individual marker categories on or off globally
  markerCategoryVisibility: {
    settlement: true,
    region: true,
    ruin: true,
    landmark: true,
    hazard: true,
    culture: true,
  },

  defaultCategoryFilter: 'all',

  allowPointPicker: true,
};
