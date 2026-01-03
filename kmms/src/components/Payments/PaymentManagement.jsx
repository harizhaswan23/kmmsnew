import React, { useContext } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import { DollarSign, Download } from "lucide-react";

const PaymentManagement = ({ userId, role }) => {
  const { payments, students } = useContext(KMMSContext);

  // Parent sees only own child's payment
  const parentChild = students.find((s) => s.parentId === userId);
  const filteredPayments =
    role === "Parent"
      ? payments.filter((p) => p.studentId === parentChild?.id)
      : payments;

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Payment & Ledger</h2>

      {/* Admin-only dashboard cards */}
      {role !== "Parent" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-2xl font-bold text-green-700">RM {totalPaid}</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">RM {totalPending}</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-indigo-700">RM {totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Payment Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Payment Records</h3>

          {role !== "Parent" && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Method</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((p) => {
                const student = students.find((s) => s.id === p.studentId);

                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{student?.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-lg">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">RM {p.amount}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-gray-600">{p.date}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {p.method || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Summary by Category */}
      {role !== "Parent" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Payment by Age Category</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Toddler", "Nursery", "Pre-K"].map((cat) => {
              const catPayments = payments.filter((p) => p.category === cat);
              const total = catPayments.reduce((sum, p) => sum + p.amount, 0);
              const paid = catPayments.filter((p) => p.status === "Paid").length;
              const pending =
                catPayments.filter((p) => p.status === "Pending").length;

              return (
                <div
                  key={cat}
                  className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                >
                  <p className="text-lg font-semibold text-indigo-900">{cat}</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    RM {total}
                  </p>

                  <div className="mt-4 space-y-1 text-sm">
                    <p className="text-green-600">✓ Paid: {paid} students</p>
                    <p className="text-yellow-600">
                      ⏳ Pending: {pending} students
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
