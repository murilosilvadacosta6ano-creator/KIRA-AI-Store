
export interface CardData {
  id: number;
  type: 'game' | 'claim' | 'nft' | 'staking' | 'quest' | 'ai';
  label: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  videoUrl?: string;
}

export interface CarouselProps {
  items: CardData[];
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview'
}

// RAWG API Types
export interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  metacritic: number;
  released: string;
  genres: { name: string }[];
  parent_platforms: { platform: { name: string, slug: string } }[];
  stores: { store: { id: number, name: string, slug: string, domain: string } }[];
}