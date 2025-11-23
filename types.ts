export interface GlossaryTerm {
  term: string;
  definition: string;
}

export enum AppView {
  MANUAL = 'MANUAL',
  GLOSSARY = 'GLOSSARY',
  PLAYGROUND = 'PLAYGROUND',
  RECIPES = 'RECIPES'
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  description: string;
  narrative: string;
  input: string;
  query: string;
}
