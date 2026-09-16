// "use client";

// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { stopImpersonationAction } from "@/server/user/impersonation-actions";

// export function ImpersonationBannerClient() {
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     if (!mounted) return null;

//     return createPortal(
//         <div
//             dir="rtl"
//             style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 zIndex: 2147483647,
//                 padding: "10px 20px",
//                 background:
//                     "linear-gradient(135deg, #fff7d6 0%, #ffefad 50%, #ffe58a 100%)",
//                 borderBottom: "1px solid rgba(180, 130, 0, 0.25)",
//                 boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
//             }}
//         >
//             <div
//                 style={{
//                     maxWidth: "1400px",
//                     margin: "0 auto",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: "16px",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                         minWidth: 0,
//                     }}
//                 >
//                     {/* <div
//                         style={{
//                             width: "38px",
//                             height: "38px",
//                             flexShrink: 0,
//                             borderRadius: "12px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             background: "rgba(255, 255, 255, 0.75)",
//                             border: "1px solid rgba(180, 130, 0, 0.2)",
//                             fontSize: "19px",
//                         }}
//                     >
//                         👤
//                     </div> */}

//                     <div style={{ minWidth: 0 }}>
//                         <div
//                             style={{
//                                 fontSize: "13px",
//                                 fontWeight: 800,
//                                 color: "#7a5700",
//                                 marginBottom: "2px",
//                             }}
//                         >
//                             حالت مشاهده کاربر فعال است
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: "12px",
//                                 color: "#8a6a16",
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                             }}
//                         >
//                             شما در حال مشاهده حساب یک کاربر به‌عنوان ادمین هستید.
//                         </div>
//                     </div>
//                 </div>

//                 <form action={stopImpersonationAction}>
//                     <button
//                         type="submit"
//                         style={{
//                             border: "none",
//                             cursor: "pointer",
//                             whiteSpace: "nowrap",
//                             padding: "9px 16px",
//                             borderRadius: "10px",
//                             background: "#7a5700",
//                             color: "#fff",
//                             fontSize: "12px",
//                             fontWeight: 700,
//                             boxShadow: "0 2px 8px rgba(122, 87, 0, 0.25)",
//                             transition: "all 0.2s ease",
//                         }}
//                     >
//                         بازگشت به پنل ادمین
//                     </button>
//                 </form>
//             </div>
//         </div>,
//         document.body
//     );
// }










"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { stopImpersonationAction } from "@/server/user/impersonation-actions";

export function ImpersonationBannerClient() {
    const [mounted, setMounted] = useState(false);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        setMounted(true);

        const timer = window.setTimeout(() => {
            setExpanded(false);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div
            dir="rtl"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2147483647,
                transform: expanded
                    ? "translateY(0)"
                    : "translateY(calc(-100% + 18px))",
                transition: "transform 0.35s ease",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    pointerEvents: "auto",
                    padding: "10px 20px",
                    background:
                        "linear-gradient(135deg, #fff7d6 0%, #ffefad 50%, #ffe58a 100%)",
                    borderBottom: "1px solid rgba(180, 130, 0, 0.25)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                        }}
                    >
                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 800,
                                    color: "#7a5700",
                                    marginBottom: "2px",
                                }}
                            >
                                حالت مشاهده کاربر فعال است
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#8a6a16",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                شما در حال مشاهده حساب یک کاربر به‌عنوان ادمین هستید.
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexShrink: 0,
                        }}
                    >
                        {/* Collapse button */}
                        <button
                            type="button"
                            aria-label="بستن اعلان"
                            onClick={() => setExpanded(false)}
                            style={{
                                width: "34px",
                                height: "34px",
                                border: "1px solid rgba(122, 87, 0, 0.15)",
                                borderRadius: "9px",
                                background: "rgba(255, 255, 255, 0.55)",
                                color: "#7a5700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>

                        <form action={stopImpersonationAction}>
                            <button
                                type="submit"
                                style={{
                                    border: "none",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    padding: "9px 16px",
                                    borderRadius: "10px",
                                    background: "#7a5700",
                                    color: "#fff",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    boxShadow:
                                        "0 2px 8px rgba(122, 87, 0, 0.25)",
                                }}
                            >
                                بازگشت به پنل ادمین
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Handler */}
            {!expanded && (
                <button
                    type="button"
                    aria-label="نمایش اعلان مشاهده کاربر"
                    onClick={() => setExpanded(true)}
                    style={{
                        pointerEvents: "auto",
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "72px",
                        height: "18px",
                        border: "none",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        background: "#7a5700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                    }}
                >
                    <span
                        style={{
                            width: "28px",
                            height: "3px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.8)",
                        }}
                    />
                </button>
            )}
        </div>,
        document.body
    );
}

