import { cn } from "@/lib/utils";

export function LoadingPlaceholder() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Thumbnail placeholder */}
      <div className="w-full h-64 bg-gray-200 rounded-lg" />
      
      {/* Title placeholder */}
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      
      {/* Info placeholders */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      
      {/* Description placeholder */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4 bg-white rounded-lg shadow-md overflow-hidden", className)}>
      {/* Thumbnail placeholder */}
      <div className="w-full h-48 bg-gray-200" />
      
      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
