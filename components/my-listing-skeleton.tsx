export function MyListingSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-40 h-40 bg-muted shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
            <div className="h-6 bg-muted rounded w-20" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="h-4 bg-muted rounded w-40" />
          <div className="h-9 bg-muted rounded w-40" />
        </div>
      </div>
    </div>
  )
}
