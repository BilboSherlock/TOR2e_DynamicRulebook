import { MapLocationMarker } from '../types';

export const ERIADOR_MARKERS: MapLocationMarker[] = [
  // --- CORE CULTURES & REGIONS ---
  {
    id: 'mithlond-grey-havens',
    name: 'Mithlond (Grey Havens)',
    elvishName: 'Mithlond',
    category: 'culture',
    coords: { x: 39.7, y: 41.9 },
    minZoom: 1.0,
    regionName: 'Lindon',
    dangerLevel: 'Safe',
    cultureRef: 'elves-of-lindon',
    chapterRef: {
      chapterId: '09-the-world',
      sectionId: 'lindon',
      title: 'The Gulf of Lhûn'
    },
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 194–196',
    },
    description: 'The ancient Elven port city at the mouth of the Gulf of Lhûn, governed by Círdan the Shipwright. From here, Elven white ships set sail across the Great Sea into the Uttermost West.',
    tags: ['Elves of Lindon', 'Círdan', 'White Ships', 'Gulf of Lhûn']
  },
  {
    id: 'caras-galadhon',
    name: 'Caras Galadhon (City of Trees)',
    elvishName: 'Caras Galadhon',
    category: 'culture',
    coords: { x: 96.5, y: 72.8 },
    minZoom: 1.2,
    regionName: 'Lothlórien',
    dangerLevel: 'Safe',
    cultureRef: 'elves-of-lothlorien',
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 210–214',
    },
    description: 'The great flet-city of the Galadhrim, capital of Lothlórien, ruled by Lord Celeborn and Lady Galadriel. Encircled by a green mound and golden mallorn trees, protected from the Shadow by the power of Nenya.',
    tags: ['Galadhrim', 'Galadriel', 'Celeborn', 'Golden Wood', 'Mallorn Trees', 'Nenya']
  },
  {
    id: 'fornost-erain',
    name: 'Fornost Erain',
    elvishName: 'Norbury of the Kings',
    category: 'ruin',
    coords: { x: 62.7, y: 29.4 },
    minZoom: 1.5,
    regionName: 'North Downs',
    dangerLevel: 'Perilous',
    chapterRef: {
      chapterId: '09-the-world',
      sectionId: 'north-downs',
      title: 'Deadman’s Dike'
    },
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. 42–46',
    },
    description: 'The ruined capital of Arthedain, known in modern times as Deadman’s Dike. A haunt of spectres and fell beasts where Kings of Arnor once held court before the fall to Angmar.',
    tags: ['Arnor Capital', 'Ghostly Ruin', 'Arthedain', 'North Downs']
  },
  {
    id: 'annuminas',
    name: 'Annúminas',
    elvishName: 'Annúminas',
    category: 'ruin',
    coords: { x: 53.9, y: 31.2 },
    minZoom: 1.5,
    regionName: 'Lake Evendim',
    dangerLevel: 'Wild',
    chapterRef: {
      chapterId: '09-the-world',
      sectionId: 'evendim',
      title: 'Lake Nenuial & Annúminas'
    },
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. 36–41',
    },
    description: 'The ancient first city of Arnor on the southern shore of Lake Evendim (Nenuial). Though silent and overgrown, its marble pillars and noble stonework whisper of ancient Numenorean splendour.',
    tags: ['First Capital', 'Lake Evendim', 'Numenor Heritage', 'Ancient Dúnedain']
  },
  {
    id: 'carn-dum',
    name: 'Carn Dûm',
    elvishName: 'Carn Dûm',
    category: 'hazard',
    coords: { x: 78.7, y: 6.2 },
    minZoom: 1.5,
    regionName: 'Angmar',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 202–205',
    },
    description: 'The sinister fortress capital of the Witch-king of Angmar in the far northern reaches of the Mountains of Angmar. A dark citadel of evil sorcery, Orc hordes, and dreadful memories.',
    tags: ['Witch-king', 'Angmar', 'Shadow Citadel', 'Northern Terror']
  },
  {
    id: 'barrow-downs',
    name: 'Barrow-downs (Tyrn Gorthad)',
    elvishName: 'Tyrn Gorthad',
    category: 'hazard',
    coords: { x: 63, y: 48 },
    minZoom: 1.8,
    regionName: 'Bree-land / Cardolan',
    dangerLevel: 'Shadow',
    chapterRef: {
      chapterId: '09-the-world',
      sectionId: 'barrow-downs',
      title: 'The Standing Stones'
    },
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 188–189',
    },
    description: 'Low treeless hills dotted with ancient burial mounds of Edain and Dúnedain kings. Infested by sinister Barrow-wights sent from Angmar, making it one of the dread places of Eriador.',
    tags: ['Barrow-wights', 'Standing Stones', 'Cardolan Burials', 'Shadow Hazard']
  },
  {
    id: 'trollshaws',
    name: 'The Trollshaws',
    category: 'hazard',
    coords: { x: 86.3, y: 40.6 },
    minZoom: 1.8,
    regionName: 'Rhudaur',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. 32–38',
    },
    description: 'Dense beech forests and rocky crags west of Rivendell. Infested by ferocious Stone-trolls and wild beasts that descend from the cold heights of the Coldfells.',
    tags: ['Stone-trolls', 'Dense Forest', 'Rhudaur', 'Coldfells Hazard']
  },
  {
    id: 'underhill',
    name: 'Underhill',
    category: 'settlement',
    coords: { x: 61.1, y: 43.3 },
    minZoom: 1.5,
    regionName: 'Bree-land / Shire Borders',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 183',
    },
    description: 'A historic hobbit settlement at the base of the hills, nestled near the eastern boundaries of the Shire and Bree-land.',
    tags: ['Underhill', 'Bree-land', 'Hobbit Settlement']
  },

  // --- ALL 44 ASSIGNED LANDMARKS ---

  {
    id: 'isle-of-the-mother',
    name: 'The Isle of the Mother',
    category: 'landmark',
    coords: { x: 11, y: 7.5 },
    minZoom: 1.5,
    regionName: 'Northern Sea / Icebay Shore',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A sacred, fog-shrouded isle off the far northwestern coast, worshipped by Lossoth tribes as a place of primeval earth spirit lore.',
    tags: ['Lossoth Lore', 'Sacred Island', 'Northern Sea', 'Fog-bound']
  },
  {
    id: 'palace-of-the-sea-birds',
    name: 'The Palace of the Sea-Birds',
    category: 'landmark',
    coords: { x: 16.2, y: 22.1 },
    minZoom: 1.5,
    regionName: 'Lindon Coast / Forlindon',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A soaring coastal sea-cliff crowned with white stone arches where thousands of gulls and sea-birds nest in harmony with the Elves of Forlindon.',
    tags: ['Elven Sea-arches', 'Forlindon', 'Gulls', 'Coastal Sanctuary']
  },
  {
    id: 'ost-breniellin',
    name: 'Ost Breniellin',
    category: 'landmark',
    coords: { x: 28.9, y: 11.2 },
    minZoom: 1.6,
    regionName: 'Northern Lindon',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'An ancient Elven watch-tower overlooking the northern bay, built during the early years of the Second Age by the followers of Gil-galad.',
    tags: ['Elven Watchtower', 'Gil-galad', 'Lindon Coast', 'White Stone']
  },
  {
    id: 'the-old-dwarf-mines',
    name: 'The Old Dwarf-mines',
    category: 'landmark',
    coords: { x: 32.3, y: 9 },
    minZoom: 1.6,
    regionName: 'Northern Ered Luin',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'Abandoned iron and silver mines in the northern Blue Mountains, abandoned after the First Age and now claimed by cave-creatures.',
    tags: ['Dwarf Mines', 'Ered Luin', 'Iron Works', 'Abandoned Tunnels']
  },
  {
    id: 'dwarf-halls-of-harmelt',
    name: 'The Dwarf-halls of Harmelt',
    category: 'landmark',
    coords: { x: 41.3, y: 69 },
    minZoom: 1.6,
    regionName: 'Southern Ered Luin',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A bustling dwarven underground hold in the southern Blue Mountains known for fine stonecrafting and copper smelting.',
    tags: ['Dwarves', 'Ered Luin', 'Copper Smelting', 'Underground Hold']
  },
  {
    id: 'the-white-towers',
    name: 'The White Towers (Elostirion)',
    elvishName: 'Emyn Beraid',
    category: 'landmark',
    coords: { x: 43.6, y: 45.6 },
    minZoom: 1.4,
    regionName: 'Tower Hills (Emyn Beraid)',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'Three ancient Elven towers built on the Tower Hills by Gil-galad for Elendil. The tallest, Elostirion, held the Master-palantír looking across the Sea to Tol Eressëa.',
    tags: ['Elostirion', 'Master Palantír', 'Tower Hills', 'Gil-galad', 'Elendil']
  },
  {
    id: 'the-tree-of-sorrow',
    name: 'The Tree of Sorrow',
    category: 'landmark',
    coords: { x: 44.6, y: 83.7 },
    minZoom: 1.6,
    regionName: 'Southern Coast / Cape of Eryn Vorn',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A gnarled petrified tree standing alone on a windswept sea-cliff, steeped in legend among the coastal fisher-folk.',
    tags: ['Petrified Tree', 'Coastal Legend', 'Fisher-folk', 'Windswept']
  },
  {
    id: 'isle-of-the-sorceress',
    name: 'The Isle of the Sorceress',
    category: 'landmark',
    coords: { x: 46.9, y: 27.6 },
    minZoom: 1.6,
    regionName: 'Lake Evendim',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A dark island in northern Lake Evendim shrouded in lingering dark sorcery from the fall of Arthedain.',
    tags: ['Lake Evendim', 'Dark Sorcery', 'Island Ruin', 'Shadow']
  },
  {
    id: 'the-star-of-the-mist',
    name: 'The Star of the Mist',
    category: 'landmark',
    coords: { x: 50.7, y: 58.4 },
    minZoom: 1.6,
    regionName: 'Brandywine Southern Reaches',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 223–231',
    },
    description: 'An ancient silver lighthouse tower standing amid river marshes where the Baranduin turns toward the sea.',
    tags: ['Lighthouse', 'Brandywine', 'River Marshes', 'Silver Tower']
  },
  {
    id: 'hill-of-gold',
    name: 'The Hill of Gold',
    category: 'landmark',
    coords: { x: 52.2, y: 28.3 },
    minZoom: 1.6,
    regionName: 'Hills of Evendim',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A sunlit grassy hill west of Lake Evendim, famed for brilliant golden wildflowers and ancient Dúnedain burial crowns.',
    tags: ['Evendim Hills', 'Golden Flowers', 'Dúnedain Barrows', 'Sunlit Hill']
  },
  {
    id: 'the-shrouded-islets',
    name: 'The Shrouded Isles',
    category: 'landmark',
    coords: { x: 52.6, y: 30.3 },
    minZoom: 1.6,
    regionName: 'Lake Evendim',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A cluster of small wooded islets in Lake Evendim often obscured by morning mists, once used as royal retreats by the Kings of Arnor.',
    tags: ['Lake Evendim', 'Mist Islands', 'Royal Retreat', 'Arnor Heritage']
  },
  {
    id: 'forgotten-hamlet-eskerdale',
    name: 'The Forgotten Hamlet of Eskerdale',
    category: 'landmark',
    coords: { x: 53.4, y: 18.5 },
    minZoom: 1.6,
    regionName: 'Northern Wilds',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'CR',
      pageNumber: 'p. 179',
    },
    description: 'A secluded vale of hardy rustic woodsmen living in timber cabins, hidden away from the troubles of the southern lands.',
    tags: ['Woodsmen', 'Hidden Hamlet', 'Timber Cabins', 'Northern Reaches']
  },
  {
    id: 'camp-of-the-lossoth',
    name: 'Camp of the Lossoth',
    category: 'landmark',
    coords: { x: 48.5, y: 7.2 },
    minZoom: 1.6,
    regionName: 'Icebay of Forochel Shore',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A seasonal bone-and-hide encampment of the Lossoth snow-dwellers on the icy shores of the northern sea.',
    tags: ['Lossoth', 'Snowmen', 'Arctic Camp', 'Icebay Shore']
  },
  {
    id: 'fields-of-slaughter',
    name: 'The Fields of Slaughter',
    category: 'landmark',
    coords: { x: 58.4, y: 28.2 },
    minZoom: 1.6,
    regionName: 'North Downs',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'An ancient battlefield between Fornost and Angmar where the final clash of the Northern Kingdom was fought; rusty weapons still litter the soil.',
    tags: ['Battlefield', 'Fornost War', 'Angmar War', 'Restless Dead']
  },
  {
    id: 'tandailin',
    name: 'Tandailin',
    category: 'landmark',
    coords: { x: 42.1, y: 34.8 },
    minZoom: 1.6,
    regionName: 'Ered Luin Foothills',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'An ancient Elven watch-mound overlooking the western approaches to the Gulf of Lhûn.',
    tags: ['Elven Watch', 'Ered Luin Foothills', 'Gulf Approaches']
  },
  {
    id: 'todden-ancient-tower',
    name: 'Todden & The Ancient Tower',
    category: 'landmark',
    coords: { x: 75.8, y: 84.5 },
    minZoom: 1.5,
    regionName: 'Dunland Foothills',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 46–49',
    },
    description: 'A rugged hill settlement in Dunland and its neighboring ancient spire. Contains multiple key site locations.',
    tags: ['Dunland', 'Ancient Tower', 'Hill Stronghold', 'Nested Landmark'],
    subLocations: [
      {
        id: 'todden-settlement',
        name: 'Todden',
        category: 'landmark',
        bookSource: {
          bookTitle: 'HotWW',
          pageNumber: 'p. 46–49',
        },
        dangerLevel: 'Wild',
        description: 'A secluded, fortified hill village in the rugged uplands of Dunland.',
        tags: ['Dunland', 'Hill Village', 'Dunlendings']
      },
      {
        id: 'the-ancient-tower',
        name: 'The Ancient Tower',
        category: 'landmark',
        bookSource: {
          bookTitle: 'HotWW',
          pageNumber: 'p. 50–54',
        },
        dangerLevel: 'Perilous',
        description: 'A black stone spire rising near Todden, filled with Second Age relics and dark sorcery.',
        tags: ['Black Spire', 'Ancient Relics', 'Sorcery']
      }
    ]
  },
  {
    id: 'lond-daer-queens-hall',
    name: 'Lond Daer & The Queen’s Hall',
    elvishName: 'Lond Daer Enedh',
    category: 'landmark',
    coords: { x: 59.8, y: 89 },
    minZoom: 1.4,
    regionName: 'Enedwaith / Gwathló Coast',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'The ancient Great Middle Haven established by Aldarion of Númenor, featuring the royal ruins of the Queen’s Hall.',
    tags: ['Númenor Haven', 'Aldarion', 'Shipyards', 'Queen’s Hall', 'Nested Landmark'],
    subLocations: [
      {
        id: 'lond-daer-haven',
        name: 'Lond Daer (Middle Haven)',
        category: 'landmark',
        bookSource: {
          bookTitle: 'RotLR',
          pageNumber: 'p. 78–82',
        },
        dangerLevel: 'Wild',
        description: 'The vast ancient timber port and shipyard built by Aldarion at the mouth of the Greyflood.',
        tags: ['Haven', 'Aldarion', 'Gwathló']
      },
      {
        id: 'the-queens-hall',
        name: 'The Queen’s Hall',
        category: 'landmark',
        bookSource: {
          bookTitle: 'RotLR',
          pageNumber: 'p. xxx',
        },
        dangerLevel: 'Perilous',
        description: 'The noble ruined audience hall of Númenorean royalty overlooking the tide-ripped estuary.',
        tags: ['Royal Chamber', 'Númenor Heritage', 'Ruins']
      }
    ]
  },
  {
    id: 'hyndas-house-at-wormhill',
    name: 'Hynda\'s House at Wormhill',
    category: 'landmark',
    coords: { x: 60.7, y: 65 },
    minZoom: 1.7,
    regionName: 'South-guard / Minhiriath',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A lone homestead and herb garden belonging to a wise herbalist and healer who aids travellers crossing the empty plains of Minhiriath.',
    tags: ['Healer', 'Homestead', 'Minhiriath', 'Safe Haven']
  },
  {
    id: 'tomb-of-the-admiral',
    name: 'The Tomb of the Admiral',
    category: 'landmark',
    coords: { x: 63.6, y: 78.3 },
    minZoom: 1.6,
    regionName: 'Enedwaith Coast',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 91–95',
    },
    description: 'An ancient sea-bitten barrow overlooking the Western Sea, resting place of a Númenorean naval commander from the Second Age.',
    tags: ['Númenor Barrow', 'Coastal Monument', 'Second Age', 'Sea Admiral']
  },
  {
    id: 'bree-land',
    name: 'Bree',
    elvishName: 'Bree',
    category: 'landmark',
    coords: { x: 66, y: 42.7 },
    minZoom: 1.0,
    regionName: 'Bree-land',
    dangerLevel: 'Guarded',
    cultureRef: 'men-of-bree',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'An ancient crossroads town clustered around Bree-hill, where Men and Hobbits dwell together in peace. Famous for The Prancing Pony inn, Bree stands as a vital sanctuary along the Great East Road.',
    tags: ['Men of Bree', 'Inn', 'Trade Crossroads', 'Prancing Pony']
  },
  {
    id: 'the-hidden-valley',
    name: 'The Hidden Valley',
    category: 'landmark',
    coords: { x: 69.4, y: 34.4 },
    minZoom: 1.6,
    regionName: 'Weather Hills',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A sheltered, secret glen among the Weather Hills where Ranger encampments hide from dark scouts.',
    tags: ['Rangers', 'Secret Glen', 'Weather Hills', 'Encampment']
  },
  {
    id: 'tharbad',
    name: 'Tharbad',
    category: 'landmark',
    coords: { x: 71.3, y: 67.8 },
    minZoom: 1.5,
    regionName: 'Enedwaith / Swanfleet',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'Once a bustling river port and fortress guarding the causeway over the Gwathló (Greyflood). Now ruined and marsh-choked, it remains a dangerous crossing point frequented by outlaws and marsh-creatures.',
    tags: ['Gwathló River', 'Broken Bridge', 'Marshes', 'Enedwaith Route']
  },
  {
    id: 'weathertop',
    name: 'Weathertop (Amon Sûl)',
    elvishName: 'Amon Sûl',
    category: 'landmark',
    coords: { x: 73, y: 41.6 },
    minZoom: 1.2,
    regionName: 'The Lone-lands',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'The highest hill of the Weather Hills, crowned by the shattered ruins of a great watchtower built by King Elendil. Once housing a Palantír, it now looms over the desolate Great East Road.',
    tags: ['Watchtower', 'Palantír Ruin', 'Weather Hills', 'Rangers']
  },
  {
    id: 'whitethorn-hay',
    name: 'Whitethorn Hay',
    category: 'landmark',
    coords: { x: 74.3, y: 56.3 },
    minZoom: 1.7,
    regionName: 'Mitheithel Marches',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A small palisaded farming hamlet surrounded by dense whitethorn hedges, keeping sheep and cattle safe from wolves.',
    tags: ['Farming Hamlet', 'Thorn Hedges', 'Mitheithel', 'Rustic']
  },
  {
    id: 'farrells-house-watchtower',
    name: 'Farrell\'s House & The Watchtower',
    category: 'landmark',
    coords: { x: 74.7, y: 40.8 },
    minZoom: 1.7,
    regionName: 'The Lone-lands',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A fortified stone watchtower and lodge along the East Road where Ranger lookouts keep vigil over the wilderness.',
    tags: ['Ranger Lodge', 'Watchtower', 'East Road', 'Vigil', 'Nested Landmark'],
    subLocations: [
      {
        id: 'farrells-house',
        name: 'Farrell’s House',
        category: 'landmark',
        bookSource: {
          bookTitle: 'TftLL',
          pageNumber: 'p. xxx',
        },
        dangerLevel: 'Guarded',
        description: 'A sturdy timber and stone homestead providing shelter to Rangers and weary roadfarers.',
        tags: ['Homestead', 'Ranger Haven']
      },
      {
        id: 'the-watchtower-lone-lands',
        name: 'The Watchtower',
        category: 'landmark',
        bookSource: {
          bookTitle: 'TftLL',
          pageNumber: 'p. xxx',
        },
        dangerLevel: 'Guarded',
        description: 'A tall stone observation spire adjoining Farrell’s House overlooking the East Road.',
        tags: ['Watchtower', 'Observation Spire']
      }
    ]
  },
  {
    id: 'hill-of-the-sleeper',
    name: 'The Hill of the Sleeper',
    category: 'landmark',
    coords: { x: 67.2, y: 52.4 },
    minZoom: 1.6,
    regionName: 'Cardolan Wilds',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'An eerie tumulus in the desolate plains of Cardolan where an ancient chieftain lies beneath enchanted stone.',
    tags: ['Tumulus', 'Cardolan', 'Enchanted Stone', 'Barrow Lore']
  },
  {
    id: 'rath-sereg',
    name: 'Rath Sereg',
    category: 'landmark',
    coords: { x: 78.4, y: 15.8 },
    minZoom: 1.6,
    regionName: 'Angmar Borders',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: '\'The Blood Pass\', a narrow, crimson-stained ravine leading into southern Angmar where dark sorcery still lingers in the cold stone.',
    tags: ['Angmar Pass', 'Blood Pass', 'Sorcery', 'Shadow Hazard']
  },
  {
    id: 'crow-hall',
    name: 'Crow Hall',
    category: 'landmark',
    coords: { x: 79.6, y: 86.5 },
    minZoom: 1.6,
    regionName: 'Enedwaith Foothills',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. xxx',
    },
    description: 'A fortified timber longhouse of Dunlendings and local hill-men, named for the dark ravens that roost atop its high wooden palisades.',
    tags: ['Hill-men', 'Dunlendings', 'Fortified Longhouse', 'Ravens']
  },
  {
    id: 'hill-of-fear',
    name: 'The Hill of Fear',
    category: 'landmark',
    coords: { x: 82, y: 3.8 },
    minZoom: 1.6,
    regionName: 'Northern Wastes',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A bleak basalt mound in the far north of Angmar where the Witch-king\'s spectres once gathered to summon fell dread over the realm of Arthedain.',
    tags: ['Angmar Dread', 'Barrow-spirits', 'Northern Wastes', 'Shadow']
  },
  {
    id: 'mount-gram',
    name: 'Mount Gram',
    category: 'landmark',
    coords: { x: 83.7, y: 19.9 },
    minZoom: 1.4,
    regionName: 'Mountains of Angmar / Ettenmoors',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'A mountain stronghold in northern Eriador inhabited by wild Goblin hordes. It was from Mount Gram that Golfimbul led an invasion of the Shire, defeated by Bullroarer Took.',
    tags: ['Goblins', 'Golfimbul', 'Northern Mountains', 'Hazard']
  },
  {
    id: 'fort-arlas',
    name: 'Fort Arlas',
    category: 'landmark',
    coords: { x: 82.6, y: 32.5 },
    minZoom: 1.6,
    regionName: 'Ettenmoors / Rhudaur',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'A ruined Dúnedain border fort built during the Wars of Arnor to watch against Troll incursions from the Ettenmoors.',
    tags: ['Dúnedain Fort', 'Border Watch', 'Ettenmoors', 'Ruin']
  },
  {
    id: 'eordscrafa',
    name: 'The Eordscrafta',
    category: 'landmark',
    coords: { x: 83.4, y: 84.2 },
    minZoom: 1.6,
    regionName: 'Southern Misty Mountains Foot',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 36–38',
    },
    description: 'A subterranean network of earth-caves and ancient caverns inhabited by sinister subterranean beasts and renegade outlaws.',
    tags: ['Earth Caves', 'Subterranean', 'Outlaws', 'Underground Hazard']
  },
  {
    id: 'the-hollow-wood',
    name: 'The Hollow Wood',
    category: 'landmark',
    coords: { x: 83.3, y: 43.8 },
    minZoom: 1.6,
    regionName: 'Trollshaws / Rhudaur',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'An ancient grove of massive hollow oaks and ancient pines south of the Trollshaws, where ancient spirits whisper in the rustling leaves.',
    tags: ['Ancient Oaks', 'Trollshaws Border', 'Hollow Trees', 'Sylvan Lore']
  },
  {
    id: 'the-ranger-haven',
    name: 'The Ranger-Haven',
    category: 'landmark',
    coords: { x: 71.2, y: 38.6 },
    minZoom: 1.6,
    regionName: 'The Lone-lands',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotLR',
      pageNumber: 'p. xxx',
    },
    description: 'A secret refuge hidden within a rocky hollow, equipped with cached supplies and armaments for Dúnedain patrols.',
    tags: ['Rangers', 'Secret Haven', 'Armament Cache', 'Lone-lands']
  },
  {
    id: 'isengard',
    name: 'Isengard (Angrenost)',
    elvishName: 'Angrenost',
    category: 'landmark',
    coords: { x: 83.7, y: 95.8 },
    minZoom: 1.4,
    regionName: 'Nan Curunír',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 12–16',
    },
    description: 'The ring-wall of Isengard surrounding Orthanc, the indestructible black tower of hard stone. Granted to Saruman the White by the Stewards of Gondor to guard the Gap of Rohan.',
    tags: ['Orthanc', 'Saruman', 'Ring-wall', 'Gap of Rohan']
  },
  {
    id: 'the-singing-stones',
    name: 'The Singing Stones',
    category: 'landmark',
    coords: { x: 89.4, y: 55.8 },
    minZoom: 1.6,
    regionName: 'Eregion',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A circle of carved Elven monoliths erected by Celebrimbor\'s jewel-smiths that hum melodiously when the night wind blows across Hollin.',
    tags: ['Eregion', 'Elven Monoliths', 'Celebrimbor', 'Musical Lore']
  },
  {
    id: 'deors-grave',
    name: 'Deor\'s Grave',
    category: 'landmark',
    coords: { x: 90.1, y: 53.7 },
    minZoom: 1.7,
    regionName: 'Eregion',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'TftLL',
      pageNumber: 'p. xxx',
    },
    description: 'A solitary grassy mound crowned with golden simbelmynë flowers, honoring an ancient hero of the Northmen who stood against the Shadow.',
    tags: ['Hero Burial', 'Northmen', 'Simbelmynë', 'Eregion']
  },
  {
    id: 'rivendell',
    name: 'Rivendell & The Vineyards of Glauria',
    elvishName: 'Imladris',
    category: 'landmark',
    coords: { x: 91.2, y: 42.1 },
    minZoom: 1.0,
    regionName: 'Rivendell Valley',
    dangerLevel: 'Safe',
    cultureRef: 'high-elves-of-rivendell',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'The hidden valley sanctuary of Elrond Half-elven and the sunny terraced vineyards of Glauria along its southern canyon walls.',
    tags: ['High Elves', 'Elrond', 'Healing', 'Sanctuary', 'Vineyards', 'Nested Landmark'],
    subLocations: [
      {
        id: 'rivendell-valley',
        name: 'Rivendell (Imladris)',
        category: 'landmark',
        bookSource: {
          bookTitle: 'RotTR',
          pageNumber: 'p. xxx',
        },
        dangerLevel: 'Safe',
        description: 'The Last Homely House East of the Sea, refuge of Elrond and the High Elves.',
        tags: ['Elrond', 'Last Homely House', 'Imladris']
      },
      {
        id: 'vineyards-of-glauria',
        name: 'The Vineyards of Glauria',
        category: 'landmark',
        bookSource: {
          bookTitle: 'RotTR',
          pageNumber: 'p. xxx',
        },
        dangerLevel: 'Safe',
        description: 'Terraced Elven vineyards producing golden wine along the cliffside slopes of Rivendell.',
        tags: ['Elven Wine', 'Terraced Slopes', 'Glauria']
      }
    ]
  },
  {
    id: 'the-wailing-hole',
    name: 'The Wailinghole',
    category: 'landmark',
    coords: { x: 91.9, y: 36 },
    minZoom: 1.7,
    regionName: 'Coldfells / Misty Mountains',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A deep, wind-scoured chasm in the Coldfells that emits an eerie, sorrowful wail whenever mountain gales blow through its craggy abysses.',
    tags: ['Chasm', 'Coldfells', 'Echoing Winds', 'Hazard']
  },
  {
    id: 'falls-of-nimrodel',
    name: 'The Falls of Nimrodel',
    elvishName: 'Nimrodel',
    category: 'landmark',
    coords: { x: 93.1, y: 69.7 },
    minZoom: 1.6,
    regionName: 'Lórien Border / Dimrill Dale',
    dangerLevel: 'Safe',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'The clear mountain stream flowing down from the Misty Mountains into Lorien, named after the Maiden Nimrodel whose voice was like falling water.',
    tags: ['Nimrodel', 'Waterfall', 'Silvan Elves', 'Clear Waters']
  },
  {
    id: 'the-winter-horn',
    name: 'The Winter-horn',
    category: 'landmark',
    coords: { x: 96.6, y: 39.6 },
    minZoom: 1.7,
    regionName: 'High Pass / Misty Mountains',
    dangerLevel: 'Perilous',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'A jagged mountain peak clad in eternal ice near the High Pass, serving as a landmark for travellers attempting the treacherous mountain crossing.',
    tags: ['Misty Mountains', 'Glacier Peak', 'High Pass', 'Icy Summit']
  },
  {
    id: 'house-of-chimneys',
    name: 'The House of Chimneys',
    category: 'landmark',
    coords: { x: 68.5, y: 46.2 },
    minZoom: 1.6,
    regionName: 'Lone-lands / South Downs',
    dangerLevel: 'Guarded',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 58–59',
    },
    description: 'A curious stone ruin with multiple towering chimneys rising above overgrown brambles, once a grand manor of Arthedain nobility.',
    tags: ['Stone Manor', 'Arthedain Noble', 'Chimneys', 'Ruins']
  },
  {
    id: 'ruins-of-dwarferry',
    name: 'The Ruins of Dwarferry',
    category: 'landmark',
    coords: { x: 72.8, y: 64.2 },
    minZoom: 1.6,
    regionName: 'Gwathló Valley / Swanfleet',
    dangerLevel: 'Wild',
    bookSource: {
      bookTitle: 'RotTR',
      pageNumber: 'p. xxx',
    },
    description: 'Ancient stone piers and dwarven masonry where heavy barges once crossed the river before Tharbad was built.',
    tags: ['Dwarf Masonry', 'Ferry Crossing', 'River Piers', 'Ruins']
  },
  {
    id: 'morgul-vale',
    name: 'The Morgul Vale',
    category: 'landmark',
    coords: { x: 88.5, y: 88.2 },
    minZoom: 1.6,
    regionName: 'Southern Wilderness',
    dangerLevel: 'Shadow',
    bookSource: {
      bookTitle: 'HotWW',
      pageNumber: 'p. 31–37',
    },
    description: 'A deadly, pale-glowing valley steeped in corrupt sorcery and wraith-lore along the far southern approaches.',
    tags: ['Corrupt Sorcery', 'Wraith-lore', 'Pale Valley', 'Shadow']
  }
];
