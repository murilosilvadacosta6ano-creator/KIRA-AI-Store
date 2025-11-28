
import { RawgGame, CardData } from "../types";

const RAWG_API_KEY = "5c01036dabf9483783e7200d4bc08413";
const BASE_URL = "https://api.rawg.io/api/games";

// Generator for mock data to ensure Infinite Scroll works if API limit is hit
const generateMockGames = (page: number): RawgGame[] => {
  return Array.from({ length: 12 }).map((_, i) => {
    const id = (page - 1) * 12 + i;
    return {
      id: id,
      name: `CYBER PROTOCOL ${id + 1}`,
      background_image: `https://picsum.photos/seed/game${id}/800/450`,
      rating: 4.5,
      metacritic: 85 + Math.floor(Math.random() * 10),
      released: "2077-11-10",
      genres: [{ name: "Action" }, { name: "RPG" }],
      parent_platforms: [{ platform: { name: "PC", slug: "pc" } }],
      stores: [
        { store: { id: 1, name: "Steam", slug: "steam", domain: "store.steampowered.com" } },
        { store: { id: 2, name: "Epic Games", slug: "epic-games", domain: "epicgames.com" } }
      ]
    };
  });
};

export const fetchHeroGames = async (): Promise<CardData[]> => {
  try {
    // Fetch recent/popular games for the carousel
    // Using a reliable query for recent high-rated games to populate the hero section
    const url = `${BASE_URL}?key=${RAWG_API_KEY}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=5`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch hero games");
    
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((game: any) => ({
      id: game.id, // Keep original ID
      type: 'game',
      label: 'TRENDING',
      title: game.name,
      subtitle: game.released ? game.released.split('-')[0] : '2024',
      description: `Experience ${game.name}, a top-rated title now available on the K-AI network. immerse yourself in high-fidelity gameplay streamed directly to your interface.`,
      buttonText: 'PLAY NOW',
      imageUrl: game.background_image || 'https://via.placeholder.com/1200x800',
    }));
  } catch (error) {
    console.error("Hero Game Fetch Error:", error);
    return [];
  }
};

export const fetchGames = async (page: number = 1, signal?: AbortSignal): Promise<RawgGame[]> => {
  try {
    const url = `${BASE_URL}?key=${RAWG_API_KEY}&page=${page}&page_size=20&ordering=-metacritic&dates=2020-01-01,2025-12-31`;
    
    const response = await fetch(url, { 
      signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("RAWG API request failed");
    }

    const data = await response.json();
    
    // RAWG returns results in a 'results' array
    return Array.isArray(data.results) ? data.results : [];
  } catch (error: any) {
    if (error.name === 'AbortError') throw error;
    
    console.warn("API unavailable. Serving mock data.", error);
    
    // Fallback to Mock Data
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockGames(page);
  }
};