'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
}

export default function StarRating({
  value,
  onChange,
  size = 18,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const isInteractive = typeof onChange === 'function';
  const activeRating = hoverRating !== null ? hoverRating : Math.round(value);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {stars.map((star) => {
        const isFilled = star <= activeRating;

        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && onChange(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating(null)}
            className={`${
              isInteractive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'
            } focus:outline-none`}
            aria-label={isInteractive ? `Rate ${star} out of 5 stars` : `${value} out of 5 stars`}
          >
            <Star
              style={{ width: `${size}px`, height: `${size}px` }}
              className={`transition-colors ${
                isFilled
                  ? 'text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                  : 'text-[#4b463d] fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
