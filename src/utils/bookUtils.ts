export const BOOK_TITLES_MAP: Record<string, string> = {
  'CR': 'Core Rules',
  'RotLR': 'Ruins of the Lost Realm',
  'RotTR': 'Realms of the Three Rings',
  'TftLL': 'Tales from the Lone-Lands',
  'TtDoD': 'Through the Doors of Durin',
  'HotWW': 'Hands of the White Wizard'
};

/**
 * Translates a backend Book ID or abbreviation into its official frontend full title.
 * Falls back to the provided string if no mapping exists.
 */
export function getFullBookTitle(bookIdOrTitle?: string): string {
  if (!bookIdOrTitle) return '';
  return BOOK_TITLES_MAP[bookIdOrTitle] || bookIdOrTitle;
}
