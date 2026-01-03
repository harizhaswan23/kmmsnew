import React, { useContext, useState } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import { Download, Calendar, DollarSign } from "lucide-react";

const Reports = () => {
  const { students, attendance, payments } = useContext(KMMSContext);

  const [activeReport, setActiveReport] = useState("attendance");
  const [selectedDate, setSelectedDate] = useState("2025-11-18");

  // =======================
  // ATTENDANCE REPORT LOGIC
  // =======================
  const dailyAttendance = attendance[selectedDate] || {};

  const presentCount = Object.values(dailyAttendance).filter(
    (a) => a.status === "present"
  ).length;

  const absentCount = Object.values(dailyAttendance).filter(
    (a) => a.status === "absent"
  ).length;

  // =====================
  // PAYMENT REPORT LOGIC
  // =====================
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const byCategory = {
    Toddler: payments.filter((p) => p.category === "Toddler"),
    Nursery: payments.filter((p) => p.category === "Nursery"),
    "Pre-K": payments.filter((p) => p.category === "Pre-K"),
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>

      {/* Report Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveReport("attendance")}
          className={`px-4 py-2 rounded-lg border ${
            activeReport === "attendance"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Attendance Report
        </button>

        <button
          onClick={() => setActiveReport("payment")}
          className={`px-4 py-2 rounded-lg border ${
            activeReport === "payment"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Financial Report
        </button>
      </div>

      {/* MAIN DISPLAY */}
      {activeReport === "attendance" ? (
        <AttendanceReport
          students={students}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dailyAttendance={dailyAttendance}
          presentCount={presentCount}
          absentCount={absentCount}
        />
      ) : (
        <PaymentReport
          payments={payments}
          byCategory={byCategory}
          totalPaid={totalPaid}
          totalPending={totalPending}
        />
      )}
    </div>
  );
};

export default Reports;

// ======================================================
// ATTENDANCE REPORT COMPONENT
// ======================================================

const AttendanceReport = ({
  students,
  selectedDate,
  setSelectedDate,
  dailyAttendance,
  presentCount,
  absentCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Attendance Report</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-blue-700">{students.length}</p>
        </div>

        <div className="p-4 bg-green-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
        </div>

        <div className="p-4 bg-red-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Attendance Table</h4>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                const rec = dailyAttendance[s.id];
                return (
                  <tr key={s.id} className="border-b">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">
                      {!rec ? (
                        "-"
                      ) : rec.status === "present" ? (
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                          Present
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {rec?.time || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// PAYMENT REPORT COMPONENT
// ======================================================

const PaymentReport = ({ payments, byCategory, totalPaid, totalPending }) => {
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Financial Report</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-green-700">RM {totalPaid}</p>
        </div>

        <div className="p-4 bg-yellow-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">RM {totalPending}</p>
        </div>

        <div className="p-4 bg-blue-50 text-center rounded-lg">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-700">RM {totalRevenue}</p>
        </div>
      </div>

      {/* Category Report */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Revenue by Category</h4>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(byCategory).map(([cat, arr]) => {
            const total = arr.reduce((sum, p) => sum + p.amount, 0);
            const paid = arr.filter((p) => p.status === "Paid").length;
            const pending = arr.filter((p) => p.status === "Pending").length;

            return (
              <div
                key={cat}
                className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
              >
                <p className="text-lg font-semibold">{cat}</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  RM {total}
                </p>

                <div className="mt-4 space-y-1 text-sm">
                  <p className="text-green-600">✓ Paid: {paid}</p>
                  <p className="text-yellow-600">⏳ Pending: {pending}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
