import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonView() {
  return (
    <div className="flex flex-col w-screen max-w-screen-xl h-screen gap-5">
      <Skeleton className="h-[125px] rounded-xl w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
      <Skeleton className="h-[125px] rounded-xl w-full" />
      <Skeleton className="h-[125px] rounded-xl w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
      <Skeleton className="h-[125px] rounded-xl w-full" />
    </div>
  );
}
