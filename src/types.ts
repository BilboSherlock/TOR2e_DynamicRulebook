export type SupplementCategory = 'Core Rules' | 'Heroic Cultures' | 'Tales from the Lone-Lands' | 'Moria' | 'Ruins of the Lost Realm';

export interface SubHeader {
  id: string;
  title: string;
  level: number;
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
