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