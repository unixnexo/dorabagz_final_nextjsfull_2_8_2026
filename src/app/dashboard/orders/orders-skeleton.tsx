export function OrdersSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div key={item} className="h-[142px] animate-pulse rounded-[25px] bg-white" />
            ))}
        </div>
    );
}