import { cn } from "@/utils"

/** Indeterminate loading ring; pass a `border-*` class to recolour it. */
function Spinner({ className }: { className?: string }) {
  return <div className={cn("animate-spin rounded-full h-12 w-12 border-b-2 border-primary", className)} />
}

export { Spinner }
