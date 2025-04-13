import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted/50 rounded-md animate-pulse",
            className
          )}
        />
      ))}
    </div>
  )
}