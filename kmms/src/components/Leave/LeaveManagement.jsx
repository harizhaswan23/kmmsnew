import React, { useContext } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import { Clock, CheckCircle, XSquare } from "lucide-react";

const LeaveManagement = () => {
  const { leaveRequests, setLeaveRequests } = useContext(KMMSContext);

  const handleDecision = (id, decision) => {
    const updated = leaveRequests.map((req) =>
      req.id === id
        ? { ...req, status: decision }
        : req
    );
    setLeaveRequests(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Teacher Leave Management</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">
            {leaveRequests.filter((l) => l.status === "Pending").length}
          </p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-green-700">
            {leaveRequests.filter((l) => l.status === "Approved").length}
          </p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-3xl font-bold text-red-700">
            {leaveRequests.filter((l) => l.status === "Rejected").length}
          </p>
        </div>
      </div>

      {/* Leave Request List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">Leave Requests</h3>

        <div className="space-y-3">
          {leaveRequests.map((req) => (
            <div
              key={req.id}
              className={`p-4 border-2 rounded-lg ${
                req.status === "Pending"
                  ? "border-yellow-300 bg-yellow-50"
                  : req.status === "Approved"
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{req.teacherName}</p>
                  <p className="text-sm text-gray-600">{req.reason}</p>
                  <p className="text-sm text-gray-600">
                    {req.startDate} → {req.endDate}
                  </p>
                </div>

                {req.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(req.id, "Approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => handleDecision(req.id, "Rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                    >
                      <XSquare className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Status: <span className="font-semibold">{req.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
