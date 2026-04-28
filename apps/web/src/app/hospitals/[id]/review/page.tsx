'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StarInput } from '@/components/StarRating';
import { apiFetch } from '@/lib/api';
import { Institution } from '@/lib/types';

interface SubmitReviewDto {
  text: string;
  ratingOverall: number;
  ratingCleanliness: number;
  ratingStaffBehaviour: number;
  ratingWaitTime: number;
  hospitalId: string;
}

export default function SubmitReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [hospital, setHospital] = useState<Institution | null>(null);
  const [text, setText] = useState('');
  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingCleanliness, setRatingCleanliness] = useState(0);
  const [ratingStaff, setRatingStaff] = useState(0);
  const [ratingWaitTime, setRatingWaitTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace(`/auth?redirect=/hospitals/${id}/review`);
    }
  }, [id, router]);

  // Load hospital name
  useEffect(() => {
    if (!id) return;
    apiFetch<Institution>(`/hospitals/${id}`)
      .then(setHospital)
      .catch(console.error);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (ratingOverall === 0 || ratingCleanliness === 0 || ratingStaff === 0 || ratingWaitTime === 0) {
      setError('Please provide all 4 ratings.');
      return;
    }
    if (text.trim().length < 10) {
      setError('Review must be at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload: SubmitReviewDto = {
        text: text.trim(),
        ratingOverall,
        ratingCleanliness,
        ratingStaffBehaviour: ratingStaff,
        ratingWaitTime,
        hospitalId: id,
      };
      await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your review is pending approval and will be visible once approved.
        </p>
        <button
          onClick={() => router.push(`/hospitals/${id}`)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Back to Hospital
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm mb-5 inline-block"
      >
        ← Back
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Write a Review</h1>
        {hospital && (
          <p className="text-sm text-gray-500 mb-6">for {hospital.name}</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ratings */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Ratings</p>
            <StarInput label="Overall" value={ratingOverall} onChange={setRatingOverall} />
            <StarInput label="Cleanliness" value={ratingCleanliness} onChange={setRatingCleanliness} />
            <StarInput label="Staff Behaviour" value={ratingStaff} onChange={setRatingStaff} />
            <StarInput label="Wait Time" value={ratingWaitTime} onChange={setRatingWaitTime} />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience... (min. 10 characters)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{text.length} characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
