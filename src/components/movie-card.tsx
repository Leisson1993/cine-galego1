import { Movie } from "@/types/movie";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{movie.rating}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genre.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};