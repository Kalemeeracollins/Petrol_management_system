(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddSale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/petrol_station/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/petrol_station/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AddSale() {
    _s();
    const [fuels, setFuels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedFuel, setSelectedFuel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [pumpNumber, setPumpNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [receipt, setReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [salesHistory, setSalesHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load token from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddSale.useEffect": ()=>{
            const savedToken = localStorage.getItem("token");
            if (savedToken) setToken(savedToken);
            fetchFuels();
            fetchSalesHistory();
        }
    }["AddSale.useEffect"], []);
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
    // Fetch sales history
    const fetchSalesHistory = async ()=>{
        try {
            const res = await fetch("http://localhost:5000/api/sales/my-sales", {
                credentials: "include"
            });
            const data = await res.json();
            setSalesHistory(data);
        } catch (err) {
            console.error("Failed to fetch sales history", err);
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
          <p><strong>Price per Litre:</strong> UGX.${receipt.pricePerLitre.toFixed(2)}</p>
          <p><strong>Amount:</strong> UGX.${receipt.amount.toFixed(2)}</p>
          <p><strong>Pump Number:</strong> ${receipt.pumpNumber}</p>
          <hr>
          <h3>Total: UGX.${receipt.amount.toFixed(2)}</h3>
          <p>Thank you for choosing our station!</p>
          <script>window.print();</script>
        </body>
        </html>
      `);
            printWindow.document.close();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Record New Sale"
            }, void 0, false, {
                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex flex-col gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        required: true,
                        value: selectedFuel?.id || "",
                        onChange: (e)=>{
                            const fuel = fuels.find((f)=>f.id === Number(e.target.value));
                            setSelectedFuel(fuel || null);
                        },
                        className: "border p-2 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Fuel Type"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            fuels.map((fuel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        placeholder: "Quantity (L)",
                        value: quantity,
                        onChange: (e)=>setQuantity(e.target.value),
                        required: true,
                        min: "0.1",
                        step: "0.1",
                        className: "border p-2 rounded"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        placeholder: "Pump Number",
                        value: pumpNumber,
                        onChange: (e)=>setPumpNumber(e.target.value),
                        required: true,
                        className: "border p-2 rounded"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    selectedFuel && quantity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-700 text-sm",
                        children: [
                            "Amount: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: [
                                    "UGX.",
                                    (parseFloat(quantity) * selectedFuel.pricePerLitre).toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 196,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "bg-blue-600 text-white p-2 rounded",
                        children: "Add Sale"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-center text-gray-700",
                children: message
            }, void 0, false, {
                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 205,
                columnNumber: 19
            }, this),
            receipt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 border-t pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-bold text-lg mb-2",
                        children: "Receipt"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Fuel: ",
                            receipt.fuelType
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Quantity: ",
                            receipt.quantity,
                            " L"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Amount: UGX.",
                            receipt.amount.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Date: ",
                            receipt.date
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: printReceipt,
                        className: "bg-green-600 text-white px-3 py-1 rounded mt-2",
                        children: "Print Receipt"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 border-t pt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold",
                                children: "Sales History"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowHistory(!showHistory),
                                className: "bg-gray-600 text-white px-3 py-1 rounded text-sm",
                                children: [
                                    showHistory ? "Hide" : "Show",
                                    " History"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    showHistory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: salesHistory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-center",
                            children: "No sales recorded yet."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                            lineNumber: 238,
                            columnNumber: 15
                        }, this) : salesHistory.map((sale)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded p-3 bg-gray-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold",
                                                    children: sale.fuelType.name
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: [
                                                        "Quantity: ",
                                                        sale.quantitySold,
                                                        " L | Pump: ",
                                                        sale.pumpNumber
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: [
                                                        "Date: ",
                                                        new Date(sale.saleDate).toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                            lineNumber: 243,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-green-600",
                                                    children: [
                                                        "UGX.",
                                                        sale.totalAmount.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$petrol_station$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: [
                                                        "@ UGX.",
                                                        sale.fuelType.pricePerLitre.toFixed(2),
                                                        "/L"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                            lineNumber: 252,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                    lineNumber: 242,
                                    columnNumber: 19
                                }, this)
                            }, sale.id, false, {
                                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                                lineNumber: 241,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/petrol_station/frontend/src/app/attendant/sales/page.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_s(AddSale, "Y6bf2ipuWe9rpmWJ9nKsaNnCfLU=");
_c = AddSale;
var _c;
__turbopack_context__.k.register(_c, "AddSale");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_petrol_station_frontend_src_app_attendant_sales_page_tsx_774b69f8._.js.map