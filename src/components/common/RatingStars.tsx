import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  size = 14,
  showText = true,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant select-none" dir="ltr">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-amber-100 text-amber-200'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="font-semibold text-primary text-[12px]">{rating.toFixed(1)}</span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-on-surface-muted text-[11px]">({reviewsCount})</span>
      )}
    </div>
  );
};
