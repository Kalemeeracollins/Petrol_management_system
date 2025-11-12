"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, Search, Filter } from "lucide-react";

interface Sale {
  id: number;
  attendant?: { name: string; id: number };
  fuelType?: { name: string; id: number };
  quantitySold: number;
  totalAmount: number;
  pumpNumber: number;
  createdAt: string;
}

interface AttendantTotal {
  attendantId: number;
  totalQuantity: number;
  totalAmount: number;
  totalSales: number;
  attendant: { id: number; name: string };
}

type SortField = 'attendant' | 'fuelType' | 'quantitySold' | 'totalAmount' | 'pumpNumber' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<AttendantTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttendant, setSelectedAttendant] = useState<string>("");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Sort states
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const salesRes = await fetch("http://localhost:5000/api/sales/all", {
          credentials: "include",
        });
       

        const salesData = await salesRes.json();

        setSales(salesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique values for filters
  const uniqueAttendants = useMemo(() => {
    const attendants = sales
      .map(s => s.attendant)
      .filter((attendant, index, arr) =>
        attendant && arr.findIndex(a => a?.id === attendant.id) === index
      );
    return attendants;
  }, [sales]);

  const uniqueFuelTypes = useMemo(() => {
    const fuelTypes = sales
      .map(s => s.fuelType)
      .filter((fuelType, index, arr) =>
        fuelType && arr.findIndex(f => f?.id === fuelType.id) === index
      );
    return fuelTypes;
  }, [sales]);

  // Filtered and sorted sales
  const filteredAndSortedSales = useMemo(() => {
    let filtered = sales.filter(sale => {
      const matchesSearch = !searchTerm ||
        sale.attendant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.fuelType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.pumpNumber.toString().includes(searchTerm);

      const matchesAttendant = !selectedAttendant || sale.attendant?.id.toString() === selectedAttendant;
      const matchesFuelType = !selectedFuelType || sale.fuelType?.id.toString() === selectedFuelType;

      const saleDate = new Date(sale.createdAt);
      const matchesStartDate = !startDate || saleDate >= new Date(startDate);
      const matchesEndDate = !endDate || saleDate <= new Date(endDate + 'T23:59:59');

      return matchesSearch && matchesAttendant && matchesFuelType && matchesStartDate && matchesEndDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'attendant':
          aValue = a.attendant?.name || '';
          bValue = b.attendant?.name || '';
          break;
        case 'fuelType':
          aValue = a.fuelType?.name || '';
          bValue = b.fuelType?.name || '';
          break;
        case 'quantitySold':
          aValue = a.quantitySold;
          bValue = b.quantitySold;
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'pumpNumber':
          aValue = a.pumpNumber;
          bValue = b.pumpNumber;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sales, searchTerm, selectedAttendant, selectedFuelType, startDate, endDate, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAttendant("");
    setSelectedFuelType("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" title="Error">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sales Records</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and filter all fuel sales transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Attendant Filter */}
          <Select value={selectedAttendant} onChange={(e) => setSelectedAttendant(e.target.value)}>
            <option value="">All Attendants</option>
            {uniqueAttendants.map(attendant => (
              <option key={attendant?.id} value={attendant?.id}>
                {attendant?.name}
              </option>
            ))}
          </Select>

          {/* Fuel Type Filter */}
          <Select value={selectedFuelType} onChange={(e) => setSelectedFuelType(e.target.value)}>
            <option value="">All Fuel Types</option>
            {uniqueFuelTypes.map(fuelType => (
              <option key={fuelType?.id} value={fuelType?.id}>
                {fuelType?.name}
              </option>
            ))}
          </Select>

          {/* Start Date */}
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />

          {/* End Date */}
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />

          {/* Clear Filters */}
          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Sales Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Sales Transactions ({filteredAndSortedSales.length})
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={() => handleSort('attendant')}
              >
                <div className="flex items-center gap-2">
                  Attendant
                  {sortField === 'attendant' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={() => handleSort('fuelType')}
              >
                <div className="flex items-center gap-2">
                  Fuel Type
                  {sortField === 'fuelType' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 text-right"
                onClick={() => handleSort('quantitySold')}
              >
                <div className="flex items-center justify-end gap-2">
                  Quantity (L)
                  {sortField === 'quantitySold' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 text-right"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount (UGX.)
                  {sortField === 'totalAmount' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 text-center"
                onClick={() => handleSort('pumpNumber')}
              >
                <div className="flex items-center justify-center gap-2">
                  Pump
                  {sortField === 'pumpNumber' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Date & Time
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No sales records found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.attendant?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>{sale.fuelType?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-right font-mono">
                    {sale.quantitySold.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    UGX.{sale.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                      {sale.pumpNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {new Date(sale.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Attendant Totals */}
      {totals.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Attendant Performance Summary
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendant</TableHead>
                <TableHead className="text-right">Total Quantity (L)</TableHead>
                <TableHead className="text-right">Total Amount (UGX.)</TableHead>
                <TableHead className="text-center">Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totals.map((total) => (
                <TableRow key={total.attendantId}>
                  <TableCell className="font-medium">
                    {total.attendant?.name || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {total.totalQuantity.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${total.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                      {total.totalSales}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
