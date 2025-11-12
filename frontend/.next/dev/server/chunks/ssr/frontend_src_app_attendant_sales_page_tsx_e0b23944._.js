module.exports = [
"[project]/frontend/src/app/attendant/sales/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddSale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AddSale() {
    const [fuels, setFuels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedFuel, setSelectedFuel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [pumpNumber, setPumpNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [receipt, setReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Load token from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
        fetchFuels();
    }, []);
    // Fetch fuel list
    const fetchFuels = async ()=>{
        try {
            const res = await fetch("http://localhost:5000/api/fuel", {
                credentials: "include"
            });
            const data = await res.json();
            setFuels(data);
        } catch (err) {
            console.error("Failed to fetch fuels", err);
        }
    };
    // Handle submit sale
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedFuel) return setMessage("Select a fuel type");
        const quantityNum = parseFloat(quantity);
        const amount = quantityNum * selectedFuel.pricePerLitre;
        try {
            const res = await fetch("http://localhost:5000/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    fuelTypeId: selectedFuel.id,
                    quantitySold: quantityNum,
                    totalAmount: amount,
                    pumpNumber: Number(pumpNumber)
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Sale recorded successfully!");
                setReceipt({
                    id: data.id,
                    fuelType: selectedFuel.name,
                    quantity: quantityNum,
                    pricePerLitre: selectedFuel.pricePerLitre,
                    amount,
                    pumpNumber: Number(pumpNumber),
                    date: new Date().toLocaleString()
                });
                setQuantity("");
                setPumpNumber("");
                fetchFuels(); // refresh stock
            } else {
                setMessage(data.message || "Failed to record sale");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error submitting sale");
        }
    };
    const printReceipt = ()=>{
        if (!receipt) return;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <html>
        <head><title>Receipt</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Petrol Station Receipt</h2>
          <p><strong>Date:</strong> ${receipt.date}</p>
          <p><strong>Fuel Type:</strong> ${receipt.fuelType}</p>
          <p><strong>Quantity:</strong> ${receipt.quantity} L</p>
          <p><strong>Price per Litre:</strong> $${receipt.pricePerLitre.toFixed(2)}</p>
          <p><strong>Amount:</strong> $${receipt.amount.toFixed(2)}</p>
          <p><strong>Pump Number:</strong> ${receipt.pumpNumber}</p>
          <hr>
          <h3>Total: $${receipt.amount.toFixed(2)}</h3>
          <p>Thank you for choosing our station!</p>
          <script>window.print();</script>
        </body>
        </html>
      `);
            printWindow.document.close();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Record New Sale"
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex flex-col gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        required: true,
                        value: selectedFuel?.id || "",
                        onChange: (e)=>{
                            const fuel = fuels.find((f)=>f.id === Number(e.target.value));
                            setSelectedFuel(fuel || null);
                        },
                        className: "border p-2 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Fuel Type"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            fuels.map((fuel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: fuel.id,
                                    children: [
                                        fuel.name,
                                        " — $",
                                        fuel.pricePerLitre.toFixed(2),
                                        " per L (",
                                        fuel.quantityInStock,
                                        "L left)"
                                    ]
                                }, fuel.id, true, {
                                    fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        placeholder: "Quantity (L)",
                        value: quantity,
                        onChange: (e)=>setQuantity(e.target.value),
                        required: true,
                        min: "0.1",
                        step: "0.1",
                        className: "border p-2 rounded"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        placeholder: "Pump Number",
                        value: pumpNumber,
                        onChange: (e)=>setPumpNumber(e.target.value),
                        required: true,
                        className: "border p-2 rounded"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    selectedFuel && quantity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-700 text-sm",
                        children: [
                            "Amount: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: [
                                    "$",
                                    (parseFloat(quantity) * selectedFuel.pricePerLitre).toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 168,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "bg-blue-600 text-white p-2 rounded",
                        children: "Add Sale"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-center text-gray-700",
                children: message
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 177,
                columnNumber: 19
            }, this),
            receipt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 border-t pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-bold text-lg mb-2",
                        children: "Receipt"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Fuel: ",
                            receipt.fuelType
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Quantity: ",
                            receipt.quantity,
                            " L"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Amount: $",
                            receipt.amount.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Date: ",
                            receipt.date
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: printReceipt,
                        className: "bg-green-600 text-white px-3 py-1 rounded mt-2",
                        children: "Print Receipt"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/app/attendant/sales/page.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=frontend_src_app_attendant_sales_page_tsx_e0b23944._.js.map