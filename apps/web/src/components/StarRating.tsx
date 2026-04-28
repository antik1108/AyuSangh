'use client';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ value, max = 5, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
  const filled = Math.round(value);

  return (
    <span className={`${sizeClass} inline-flex gap-0.5`} aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < filled ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );
}

interface StarInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export function StarInput({ label, value, onChange }: StarInputProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 w-36">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
            aria-label={`${star} star`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
