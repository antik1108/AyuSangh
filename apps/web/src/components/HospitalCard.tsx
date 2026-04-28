import Link from 'next/link';
import StarRating from './StarRating';
import { Institution } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  HOSPITAL: 'Hospital',
  CLINIC: 'Clinic',
  DIAGNOSTIC_CENTRE: 'Diagnostic Centre',
  NURSING_HOME: 'Nursing Home',
};

const TYPE_COLORS: Record<string, string> = {
  HOSPITAL: 'bg-blue-100 text-blue-700',
  CLINIC: 'bg-green-100 text-green-700',
  DIAGNOSTIC_CENTRE: 'bg-purple-100 text-purple-700',
  NURSING_HOME: 'bg-orange-100 text-orange-700',
};

interface HospitalCardProps {
  hospital: Institution;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const rating = Number(hospital.averageRating) || 0;
  const typeLabel = TYPE_LABELS[hospital.type] || hospital.type;
  const typeColor = TYPE_COLORS[hospital.type] || 'bg-gray-100 text-gray-700';

  return (
    <Link href={`/hospitals/${hospital.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{hospital.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${typeColor}`}>
            {typeLabel}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          📍 {hospital.city}
          {hospital.address && `, ${hospital.address}`}
        </p>

        <div className="flex items-center gap-2">
          <StarRating value={rating} size="sm" />
          <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({hospital.totalReviews} reviews)</span>
        </div>

        {hospital.isVerified && (
          <p className="text-xs text-green-600 mt-2 font-medium">✓ Verified</p>
        )}
      </div>
    </Link>
  );
}
