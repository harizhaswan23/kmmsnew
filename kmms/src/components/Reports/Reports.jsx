import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Percent, 
  Loader2,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getClasses } from "../../api/classes";
import { getMonthlyStats } from "../../api/attendance";

const Reports = () => {
  const [activeReport, setActiveReport] = useState("attendance");

  // --- ATTENDANCE STATE ---
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FINANCIAL STATE (Hardcoded) ---
  const financialData = {
    totalRevenue: 45200,
    totalExpenses: 12500,
    netProfit: 32700,
    outstandingFees: 4800,
    transactions: [
      { id: 1, desc: "School Fees - Nursery A", amount: 1200, date: "2026-01-05", type: "income" },
      { id: 2, desc: "School Fees - Nursery B", amount: 850, date: "2026-01-06", type: "income" },
      { id: 3, desc: "Office Supplies", amount: -320, date: "2026-01-07", type: "expense" },
      { id: 4, desc: "Utility Bill (Electricity)", amount: -450, date: "2026-01-08", type: "expense" },
      { id: 5, desc: "School Fees - Kindergarten 1", amount: 1500, date: "2026-01-09", type: "income" },
    ]
  };

  // 1. Load Classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getClasses();
        setClasses(data || []);
        if (data && data.length > 0) setSelectedClassId(data[0]._id);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }
    loadClasses();
  }, []);

  // 2. Fetch Attendance Stats
  useEffect(() => {
    if (!selectedClassId || !selectedMonth) return;
    if (activeReport !== "attendance") return;

    async function fetchStats() {
      setLoading(true);
      try {
        const data = await getMonthlyStats(selectedClassId, selectedMonth);
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [selectedClassId, selectedMonth, activeReport]);

  return (
    <div className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-500">Overview of school performance and finances</p>
        </div>
        
        {/* Report Type Toggle */}
        <div className="bg-white p-1 rounded-lg border shadow-sm flex">
          <button
            onClick={() => setActiveReport("attendance")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeReport === "attendance"
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Attendance Report
          </button>
          <button
            onClick={() => setActiveReport("financial")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeReport === "financial"
                ? "bg-green-100 text-green-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Financial Report
          </button>
        </div>
      </div>

      {/* ======================= ATTENDANCE REPORT ======================= */}
      {activeReport === "attendance" && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
          
          {/* --- NEW: Filters with Labels on Top --- */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
            
            {/* Class Selector Group */}
            <div className="flex flex-col gap-1.5 w-full md:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Select Class
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Users className="w-4 h-4 text-gray-400" />
                <select
                  className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full md:w-40"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Separator (Hidden on mobile) */}
            <div className="hidden md:block h-10 w-px bg-gray-200 mt-6"></div>

            {/* Month Selector Group */}
            <div className="flex flex-col gap-1.5 w-full md:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Select Month
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="month"
                  className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full md:w-auto"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>

          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Days Recorded</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalDays}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      stats.percentage >= 80 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Avg Attendance</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.percentage}%</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Present</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalPresent}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Absent</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalAbsent}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Monthly Overview</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Present ({stats.totalPresent})</span>
                      <span>Absent ({stats.totalAbsent})</span>
                    </div>
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${stats.percentage}%` }} />
                      <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${100 - stats.percentage}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 text-center pt-2">Based on {stats.totalRecords} student records.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-dashed">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No attendance data found for this month.</p>
            </div>
          )}
        </div>
      )}

      {/* ======================= FINANCIAL REPORT (Unchanged) ======================= */}
      {activeReport === "financial" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Financial data shown is for demonstration purposes.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-2">RM {financialData.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign className="w-5 h-5"/></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expenses</p>
                    <h3 className="text-2xl font-bold text-red-500 mt-2">RM {financialData.totalExpenses.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg text-red-600"><CreditCard className="w-5 h-5"/></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Profit</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">RM {financialData.netProfit.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5"/></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Outstanding Fees</p>
                    <h3 className="text-2xl font-bold text-orange-500 mt-2">RM {financialData.outstandingFees.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><AlertCircle className="w-5 h-5"/></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-center gap-6 px-4 pb-4">
                   <div className="w-16 bg-green-500 rounded-t-lg relative group transition-all hover:bg-green-600" style={{ height: '80%' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700">80%</span>
                   </div>
                   <div className="w-16 bg-red-400 rounded-t-lg relative group transition-all hover:bg-red-500" style={{ height: '30%' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-700">30%</span>
                   </div>
                </div>
                <div className="flex justify-center gap-8 text-sm font-medium text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Income</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div> Expenses</div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.transactions.map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t.desc}</p>
                          <p className="text-xs text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : ''} RM {Math.abs(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;