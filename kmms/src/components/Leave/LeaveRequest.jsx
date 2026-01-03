import React, { useContext, useState } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import { FileText } from "lucide-react";

const LeaveRequest = ({ teacherId }) => {
  const { leaveRequests, setLeaveRequests, teachers } = useContext(KMMSContext);

  const teacher = teachers.find((t) => t.id === teacherId);

  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.reason || !form.startDate || !form.endDate) return;

    const nextId = leaveRequests.length
      ? Math.max(...leaveRequests.map((l) => l.id)) + 1
      : 1;

    const newLeave = {
      id: nextId,
      teacherId,
      teacherName: teacher?.name || "Teacher",
      reason: form.reason,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "Pending",
    };

    setLeaveRequests([...leaveRequests, newLeave]);

    setForm({
      reason: "",
      startDate: "",
      endDate: "",
    });
  };

  const myRequests = leaveRequests.filter((l) => l.teacherId === teacherId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">Leave Request</h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">Submit New Leave Request</h3>

        <div className="space-y-3">
          <textarea
            name="reason"
            placeholder="Reason for leave"
            value={form.reason}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows="3"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Submit Leave Request
          </button>
        </div>
      </div>

      {/* My Leave Requests */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">My Leave Requests</h3>

        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <p className="text-gray-500 text-center">No leave requests yet.</p>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-lg border ${
                  req.status === "Pending"
                    ? "bg-yellow-50 border-yellow-200"
                    : req.status === "Approved"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="font-semibold">{req.reason}</p>
                <p className="text-sm text-gray-600">
                  {req.startDate} → {req.endDate}
                </p>
                <span
                  className={`mt-2 inline-block text-xs px-2 py-1 rounded-full ${
                    req.status === "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : req.status === "Approved"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
