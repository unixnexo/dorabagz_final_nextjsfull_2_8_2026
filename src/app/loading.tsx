// "use client";

// import Image from "next/image";

// export default function Loading() {
//     return (
//         <main
//             dir="rtl"
//             className="fixed inset-0 z-[9999] bg-[#f1f2f3]"
//         >
//             <div className="mx-auto flex min-h-dvh w-full max-w-[500px] flex-col items-center justify-center px-6">
//                 <div className="relative size-[190px]">
//                     <Image
//                         src="/site/Baymax_GIF.gif"
//                         alt="Loading"
//                         fill
//                         priority
//                         // unoptimized
//                         className="object-contain"
//                     />
//                 </div>

//                 <div className="mt-2 text-center">
//                     <h1 className="text-[17px] font-semibold text-[#171717]">
//                         یه لحظه صبر کن...
//                     </h1>

//                     <p className="mt-1.5 text-[13px] text-black/45">
//                         داریم همه‌ چیز رو آماده می‌کنیم
//                     </p>
//                 </div>

//                 <div className="mt-6 h-1.5 w-24 overflow-hidden rounded-full bg-black/[0.06]">
//                     <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-[#282E30]" />
//                 </div>
//             </div>
//         </main>
//     );
// }









"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <motion.main
            dir="rtl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-[2px]"
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative size-10"
            >
                <div className="absolute inset-0 rounded-full border-[3px] border-black/[0.08]" />

                <motion.div
                    className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#282E30]"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 0.8,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </motion.main>
    );
}

