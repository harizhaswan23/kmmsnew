import React, { useContext } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import DashboardCard from "./DashboardCard";
import { Users, Camera, MessageSquare, Clock } from "lucide-react";
import LiveDateTime from "../Common/LiveDateTime";


const TeacherDashboard = ({ setActiveTab }) => {
  const {
    students,
    activities,
    messages,
    schedules
  } = useContext(KMMSContext);

  const teacherId = 1; // from login

  const myStudents = students.filter((s) => s.teacherId === teacherId);
  const todayActivities = activities.filter(
    (a) => myStudents.find((s) => s.id === a.studentId) && a.date === "2025-11-18"
  );
  const unreadMessages = messages.filter(
    (m) => !m.read && m.to === "Teacher"
  ).length;

  const todaySchedule = schedules.filter(
    (s) => s.teacherId === teacherId && s.day === "Monday"
  );

  return (
    <div className="space-y-6">
      <LiveDateTime />
      <h2 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="My Students"
          value={myStudents.length}
          icon={Users}
          color="bg-blue-500"
          onClick={() => setActiveTab("students")}
        />
        <DashboardCard
          title="Today's Activities"
          value={todayActivities.length}
          icon={Camera}
          color="bg-green-500"
          onClick={() => setActiveTab("activities")}
        />
        <DashboardCard
          title="Unread Messages"
          value={unreadMessages}
          icon={MessageSquare}
          color="bg-purple-500"
          onClick={() => setActiveTab("messages")}
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" /> Today's Schedule
        </h3>

        <div className="space-y-3">
          {todaySchedule.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
            >
              <p className="font-semibold">{s.class}</p>
              <p className="text-sm text-gray-600">
                {s.startTime} — {s.endTime}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
