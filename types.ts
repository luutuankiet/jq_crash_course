export interface GlossaryTerm {
  term: string;
  definition: string;
}

export enum AppView {
  HOME = 'HOME',
  MANUAL = 'MANUAL',
  PLAYGROUND = 'PLAYGROUND',
  RECIPES = 'RECIPES'
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  description: string;
  narrative: string;
  hint?: string;
  input: string;
  query: string;
}
