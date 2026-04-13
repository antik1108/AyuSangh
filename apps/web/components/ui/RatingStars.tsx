import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingStarsProps) {
  const starSize = size === "sm" ? 12 : 16;

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={starSize}
          className={cn(
            i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
