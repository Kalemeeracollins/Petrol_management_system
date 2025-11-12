module.exports = [
"[project]/Desktop/petrol_station/frontend/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/petrol_station/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/petrol_station/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/petrol_station/frontend/src/context/auth-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (loading) return; // Wait for auth state to load
        if (!isAuthenticated || !user) {
            router.push("/login");
            return;
        }
        // Redirect based on role
        switch(user.role){
            case "ADMIN":
                router.push("/admin/dashboard");
                break;
            case "ATTENDANT":
                router.push("/attendant/dashboard");
                break;
            case "SUPPLIER":
                router.push("/supplier/dashboard");
                break;
            default:
                router.push("/login");
        }
    }, [
        isAuthenticated,
        user,
        loading,
        router
    ]);
    return null // No visible content while redirecting
    ;
}
}),
];

//# sourceMappingURL=Desktop_petrol_station_frontend_src_app_page_tsx_04e754e0._.js.map