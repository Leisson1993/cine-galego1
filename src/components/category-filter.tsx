import { MovieCategory } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: MovieCategory[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            onClick={() => onCategoryChange(category.slug)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};