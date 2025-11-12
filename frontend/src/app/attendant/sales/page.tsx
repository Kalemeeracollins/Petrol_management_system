"use client";

import { useEffect, useState } from "react";

interface Fuel {
  id: number;
  name: string;
  pricePerLitre: number;
  quantityInStock: number;
}

interface Receipt {
  id: number;
  fuelType: string;
  quantity: number;
  pricePerLitre: number;
  amount: number;
  pumpNumber: number;
  date: string;
}

interface Sale {
  id: number;
  fuelType: {
    name: string;
    pricePerLitre: number;
  };
  quantitySold: number;
  totalAmount: number;
  pumpNumber: number;
  saleDate: string;
}

export default function AddSale() {
  const [fuels, setFuels] = useState<Fuel[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<Fuel | null>(null);
  const [quantity, setQuantity] = useState("");
  const [pumpNumber, setPumpNumber] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [token, setToken] = useState("");
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    fetchFuels();
    fetchSalesHistory();
  }, []);

  // Fetch fuel list
  const fetchFuels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fuel", {
        credentials: "include",
      });
      const data = await res.json();
      setFuels(data);
    } catch (err) {
      console.error("Failed to fetch fuels", err);
    }
  };

  // Fetch sales history
  const fetchSalesHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sales/my-sales", {
        credentials: "include",
      });
      const data = await res.json();
      setSalesHistory(data);
    } catch (err) {
      console.error("Failed to fetch sales history", err);
    }
  };

  // Handle submit sale
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFuel) return setMessage("Select a fuel type");
    const quantityNum = parseFloat(quantity);
    const amount = quantityNum * selectedFuel.pricePerLitre;

    try {
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          fuelTypeId: selectedFuel.id,
          quantitySold: quantityNum,
          totalAmount: amount,
          pumpNumber: Number(pumpNumber),
        }),
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
          date: new Date().toLocaleString(),
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

  const printReceipt = () => {
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

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Record New Sale</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          required
          value={selectedFuel?.id || ""}
          onChange={(e) => {
            const fuel = fuels.find((f) => f.id === Number(e.target.value));
            setSelectedFuel(fuel || null);
          }}
          className="border p-2 rounded"
        >
          <option value="">Select Fuel Type</option>
          {fuels.map((fuel) => (
            <option key={fuel.id} value={fuel.id}>
              {fuel.name} — ${fuel.pricePerLitre.toFixed(2)} per L ({fuel.quantityInStock}L left)
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity (L)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0.1"
          step="0.1"
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Pump Number"
          value={pumpNumber}
          onChange={(e) => setPumpNumber(e.target.value)}
          required
          className="border p-2 rounded"
        />

        {selectedFuel && quantity && (
          <p className="text-gray-700 text-sm">
            Amount: <strong>UGX.{(parseFloat(quantity) * selectedFuel.pricePerLitre).toFixed(2)}</strong>
          </p>
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Sale
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      {receipt && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-bold text-lg mb-2">Receipt</h2>
          <p>Fuel: {receipt.fuelType}</p>
          <p>Quantity: {receipt.quantity} L</p>
          <p>Amount: UGX.{receipt.amount.toFixed(2)}</p>
          <p>Date: {receipt.date}</p>
          <button
            onClick={printReceipt}
            className="bg-green-600 text-white px-3 py-1 rounded mt-2"
          >
            Print Receipt
          </button>
        </div>
      )}

      {/* Sales History Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sales History</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            {showHistory ? "Hide" : "Show"} History
          </button>
        </div>

        {showHistory && (
          <div className="space-y-3">
            {salesHistory.length === 0 ? (
              <p className="text-gray-500 text-center">No sales recorded yet.</p>
            ) : (
              salesHistory.map((sale) => (
                <div key={sale.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{sale.fuelType.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {sale.quantitySold} L | Pump: {sale.pumpNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(sale.saleDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">UGX.{sale.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        @ UGX.{sale.fuelType.pricePerLitre.toFixed(2)}/L
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
