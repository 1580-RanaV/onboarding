'use client';

export function SkeletonInput() {
  return (
    <div className="w-full h-10 bg-gray-200 rounded-sm animate-pulse" />
  );
}

export function SkeletonTextarea() {
  return (
    <div className="w-full h-24 bg-gray-200 rounded-sm animate-pulse" />
  );
}

export function SkeletonButton() {
  return (
    <div className="w-full h-10 bg-gray-200 rounded-sm animate-pulse" />
  );
}

export function SkeletonCard() {
  return (
    <div className="w-full p-4 border border-gray-200 rounded-sm bg-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-sm animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLabel() {
  return (
    <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
  );
}

