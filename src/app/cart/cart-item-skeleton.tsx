import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
    return (
        <Card className="overflow-hidden rounded-[28px] border-0 bg-white p-3 shadow-none">
            <div className="flex gap-3">
                <Skeleton className="size-[104px] shrink-0 rounded-[21px] bg-black/[0.08]" />

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/5 rounded-md bg-black/[0.08]" />
                        <Skeleton className="h-3 w-2/5 rounded-md bg-black/[0.08]" />
                    </div>

                    <div className="flex items-end justify-between gap-2">
                        <Skeleton className="h-4 w-16 rounded-md bg-black/[0.08]" />
                        <Skeleton className="h-9 w-24 rounded-full bg-black/[0.08]" />
                    </div>
                </div>
            </div>
        </Card>
    );
}