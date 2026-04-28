'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { apiFetch } from '@/lib/api';
import { Institution, Review } from '@/lib/types';

export default function HospitalProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [hospital, setHospital] = useState<Institution | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiFetch<Institution>(`/hospitals/${id}`),
      apiFetch<Review[]>(`/hospitals/${id}/reviews`),
    ])
      .then(([h, r]) => {
        setHospital(h);
        setReviews(r);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load hospital');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 text-lg">{error || 'Hospital not found'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const photos = hospital.photos || [];
  const doctors = hospital.doctors || [];
  const rating = Number(hospital.averageRating) || 0;

  const ratingCategories = [
    { label: 'Overall', value: Number(hospital.overallAvg) || 0 },
    { label: 'Cleanliness', value: Number(hospital.cleanlinessAvg) || 0 },
    { label: 'Staff Behaviour', value: Number(hospital.staffAvg) || 0 },
    { label: 'Wait Time', value: Number(hospital.waitTimeAvg) || 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm mb-5 inline-block"
      >
        ← Back
      </button>

      {/* Photo Carousel */}
      {photos.length > 0 ? (
        <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-100 h-64">
          <img
            src={photos[photoIndex]?.cloudinaryUrl}
            alt={photos[photoIndex]?.caption || hospital.name}
            className="w-full h-full object-cover"
          />
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === photoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex((p) => (p - 1 + photos.length) % photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={() => setPhotoIndex((p) => (p + 1) % photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 h-48 flex items-center justify-center">
          <span className="text-blue-400 text-5xl">🏥</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
            {hospital.isVerified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            📍 {hospital.address}, {hospital.city} — {hospital.pincode}
          </p>
          <p className="text-gray-500 text-sm mt-0.5">📞 {hospital.phone}</p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="flex items-center gap-2">
            <StarRating value={rating} size="lg" />
            <span className="text-xl font-bold text-gray-800">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-400">{hospital.totalReviews} reviews</span>
          {hospital.bookingLink && (
            <a
              href={hospital.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {hospital.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-white border border-gray-100 rounded-xl p-4">
          {hospital.description}
        </p>
      )}

      {/* Rating Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ratingCategories.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 w-32">{cat.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(cat.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8">
                  {cat.value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors */}
      {doctors.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.map((di) => (
              <div
                key={di.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {di.doctor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{di.doctor.name}</p>
                  <p className="text-xs text-gray-500">{di.doctor.specialty}</p>
                  <p className="text-xs text-gray-400">{di.doctor.experience} yrs exp</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          {isLoggedIn ? (
            <Link
              href={`/hospitals/${id}/review`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          ) : (
            <Link
              href="/auth"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Login to Review
            </Link>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium text-gray-800 text-sm">
                      {review.user?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <StarRating value={review.overallRating} size="sm" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>

                {review.reviewReplies && review.reviewReplies.length > 0 && (
                  <div className="mt-2 ml-4 pl-3 border-l-2 border-blue-200">
                    {review.reviewReplies.map((reply) => (
                      <div key={reply.id}>
                        <p className="text-xs font-medium text-blue-700">
                          {reply.adminUser?.name || 'Admin'} replied:
                        </p>
                        <p className="text-xs text-gray-600">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
