// "use client";

// import { useEffect, useState } from "react";

// const images = Array.from({ length: 20 }, (_, i) => i + 1);

// export default function LoginImageMasonry() {
//     const [isSmall, setIsSmall] = useState(false);

//     useEffect(() => {
//         const media = window.matchMedia("(max-width: 389px)");

//         const update = () => setIsSmall(media.matches);

//         update();
//         media.addEventListener("change", update);

//         return () => media.removeEventListener("change", update);
//     }, []);

//     const columnCount = isSmall ? 3 : 4;

//     const columns = Array.from({ length: columnCount }, (_, columnIndex) =>
//         images.filter((_, index) => index % columnCount === columnIndex)
//     );

//     return (
//         <div className="relative w-full overflow-hidden">
//             {/* Top fade */}
//             <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#f1f2f3] to-transparent" />

//             {/* Bottom fade */}
//             <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#f1f2f3] to-transparent" />

//             <div className="grid h-[75dvh] w-full grid-cols-3 gap-2 min-[390px]:grid-cols-4">
//                 {columns.map((column, columnIndex) => {
//                     const reverse = columnIndex % 2 === 1;

//                     return (
//                         <div
//                             key={`${columnCount}-${columnIndex}`}
//                             className="min-w-0 overflow-hidden"
//                         >
//                             <div
//                                 className={
//                                     reverse
//                                         ? "animate-masonry-up flex flex-col gap-2"
//                                         : "animate-masonry-down flex flex-col gap-2"
//                                 }
//                             >
//                                 {[...column, ...column].map((image, index) => (
//                                     <div
//                                         key={`${image}-${index}`}
//                                         className="w-full shrink-0 overflow-hidden rounded-xl"
//                                     >
//                                         <img
//                                             src={`/site/${image}.jpg`}
//                                             alt=""
//                                             className="block aspect-[3/4] w-full object-cover"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <style jsx>{`
//                 @keyframes masonryDown {
//                     from {
//                         transform: translateY(-50%);
//                     }

//                     to {
//                         transform: translateY(0);
//                     }
//                 }

//                 @keyframes masonryUp {
//                     from {
//                         transform: translateY(0);
//                     }

//                     to {
//                         transform: translateY(-50%);
//                     }
//                 }

//                 .animate-masonry-down {
//                     animation: masonryDown 28s linear infinite;
//                 }

//                 .animate-masonry-up {
//                     animation: masonryUp 28s linear infinite;
//                 }
//             `}</style>
//         </div>
//     );
// }









"use client";

import { useEffect, useState } from "react";

const images = Array.from({ length: 20 }, (_, i) => i + 1);

export default function LoginImageMasonry() {
    const [isSmall, setIsSmall] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    useEffect(() => {
        const media = window.matchMedia("(max-width: 389px)");

        const update = () => setIsSmall(media.matches);

        update();
        media.addEventListener("change", update);

        return () => media.removeEventListener("change", update);
    }, []);

    const columnCount = isSmall ? 3 : 4;

    const columns = Array.from({ length: columnCount }, (_, columnIndex) =>
        images.filter((_, index) => index % columnCount === columnIndex)
    );

    const handleImageLoad = (image: number) => {
        setLoadedImages((prev) => {
            const next = new Set(prev);
            next.add(image);
            return next;
        });
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Top fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#f1f2f3] to-transparent" />

            {/* Bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#f1f2f3] to-transparent" />

            <div className="grid h-[75dvh] w-full grid-cols-3 gap-2 min-[390px]:grid-cols-4">
                {columns.map((column, columnIndex) => {
                    const reverse = columnIndex % 2 === 1;

                    return (
                        <div
                            key={`${columnCount}-${columnIndex}`}
                            className="min-w-0 overflow-hidden"
                        >
                            <div
                                className={
                                    reverse
                                        ? "animate-masonry-up flex flex-col gap-2"
                                        : "animate-masonry-down flex flex-col gap-2"
                                }
                            >
                                {[...column, ...column].map((image, index) => {
                                    const isLoaded = loadedImages.has(image);

                                    return (
                                        <div
                                            key={`${image}-${index}`}
                                            className="relative w-full shrink-0 overflow-hidden rounded-xl"
                                        >
                                            {/* Placeholder */}
                                            {!isLoaded && (
                                                <div className="absolute inset-0 animate-placeholder bg-black/[0.08]" />
                                            )}

                                            <img
                                                src={`/site/${image}.jpg`}
                                                alt=""
                                                loading="eager"
                                                decoding="async"
                                                onLoad={() => handleImageLoad(image)}
                                                className={`block aspect-[3/4] w-full object-cover transition-opacity duration-300 ${isLoaded
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes masonryDown {
                    from {
                        transform: translateY(-50%);
                    }

                    to {
                        transform: translateY(0);
                    }
                }

                @keyframes masonryUp {
                    from {
                        transform: translateY(0);
                    }

                    to {
                        transform: translateY(-50%);
                    }
                }

                @keyframes placeholderBlink {
                    0%,
                    100% {
                        opacity: 0.45;
                    }

                    50% {
                        opacity: 0.15;
                    }
                }

                .animate-masonry-down {
                    animation: masonryDown 28s linear infinite;
                    will-change: transform;
                }

                .animate-masonry-up {
                    animation: masonryUp 28s linear infinite;
                    will-change: transform;
                }

                .animate-placeholder {
                    animation: placeholderBlink 1.2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
