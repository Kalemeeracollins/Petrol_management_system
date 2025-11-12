module.exports = [
"[project]/frontend/src/app/attendant/shifts/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/attendant-shifts/page.tsx
__turbopack_context__.s([
    "default",
    ()=>AttendantShiftsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/context/auth-context.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
;
;
function AttendantShiftsPage() {
    const { user, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!token) return; // prevent fetching if not logged in
        const fetchShifts = async ()=>{
            try {
                const res = await fetch("http://localhost:5000/api/shifts/my-shifts?upcoming=true", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch shifts");
                const data = await res.json();
                setShifts(data);
            } catch (err) {
                console.error(err);
            } finally{
                setLoading(false);
            }
        };
        fetchShifts();
    }, [
        token
    ]);
    const handleStartShift = async (shiftId)=>{
        try {
            const res = await fetch(`http://localhost:5000/api/shifts/start/${shiftId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to start shift");
            const updated = await res.json();
            setShifts((prev)=>prev.map((s)=>s.id === shiftId ? {
                        ...s,
                        status: "IN_PROGRESS"
                    } : s));
        } catch (err) {
            console.error(err);
        }
    };
    const handleEndShift = async (shiftId)=>{
        try {
            const res = await fetch(`http://localhost:5000/api/shifts/end/${shiftId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to end shift");
            const updated = await res.json();
            setShifts((prev)=>prev.map((s)=>s.id === shiftId ? {
                        ...s,
                        status: "COMPLETED"
                    } : s));
        } catch (err) {
            console.error(err);
        }
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: "Loading shifts..."
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
        lineNumber: 87,
        columnNumber: 23
    }, this);
    if (!shifts.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: "No shifts found"
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
        lineNumber: 88,
        columnNumber: 30
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4",
        children: shifts.map((shift)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold",
                        children: [
                            shift.shiftType,
                            " Shift"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Date: ",
                            shift.scheduledDate
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Time: ",
                            shift.scheduledStartTime,
                            " - ",
                            shift.scheduledEndTime
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Status: ",
                            shift.status
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Pump: ",
                            shift.assignedPump || "N/A"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    shift.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                        onClick: ()=>handleStartShift(shift.id),
                        children: "Start Shift"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 103,
                        columnNumber: 13
                    }, this),
                    shift.status === "IN_PROGRESS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                        onClick: ()=>handleEndShift(shift.id),
                        children: "End Shift"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                        lineNumber: 106,
                        columnNumber: 13
                    }, this)
                ]
            }, shift.id, true, {
                fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/attendant/shifts/page.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=frontend_src_app_attendant_shifts_page_tsx_23c1986c._.js.map