export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string[];
  rating: number;
  duration: string;
  image: string;
  description: string;
  trailer?: string;
  director: string;
  cast: string[];
}

export interface MovieCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration?: string;
  link: string;
  alternativeLinks?: string[];
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Series extends Omit<Movie, 'duration'> {
  type: 'series' | 'anime';
  seasons: Season[];
  totalSeasons: number;
  totalEpisodes: number;
}