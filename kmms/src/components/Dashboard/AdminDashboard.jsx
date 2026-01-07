import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  CheckCircle,
  DollarSign,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";


import { getStudents } from "../../api/students";
import { getTeachers } from "../../api/teachers";
import { getAttendance } from "../../api/attendance";

import LiveDateTime from "../Common/LiveDateTime";

export default function AdminDashboard({ setActiveTab }) {
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTeachers, setActiveTeachers] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState({
    present: 0,
    total: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // LOAD DASHBOARD DATA
  // -----------------------
  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Students
      const students = await getStudents();
      setTotalStudents(students.length);

      // Teachers
      const teachers = await getTeachers();
      setActiveTeachers(teachers.length);

      // Attendance
      const att = await getAttendance();
      const today = new Date().toISOString().split("T")[0];

      const todayRecords = att.filter((a) => a.date === today);
      const presentCount = todayRecords.filter(
        (a) => a.status === "present"
      ).length;

      setAttendanceToday({
        present: presentCount,
        total: students.length,
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }



  // -----------------------
  // STATS BOX DESIGN
  // -----------------------
  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "from-blue-400 to-blue-600",
      onClick: () => setActiveTab("users"),
    },
    {
      title: "Active Teachers",
      value: activeTeachers,
      icon: BookOpen,
      color: "from-green-400 to-green-600",
      onClick: () => setActiveTab("teachers"),
    },
    {
      title: "Today’s Attendance",
      value: `${attendanceToday.present}/${attendanceToday.total}`,
      icon: CheckCircle,
      color: "from-purple-400 to-purple-600",
      onClick: () => setActiveTab("attendance"),
    },
    {
      title: "Revenue (This Month)",
      value: `RM ${revenue}`,
      icon: DollarSign,
      color: "from-yellow-400 to-yellow-600",
      onClick: () => setActiveTab("payments"),
    },
  ];

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <LiveDateTime />
      <h2 className="text-2xl font-bold">Administrator Dashboard</h2>

      {/* ---------------- STATS GRID ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          

          return (
            <Card
              key={stat.title}
              onClick={stat.onClick}
              className="cursor-pointer hover:shadow-lg transition"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-gray-900 text-xl mb-1">{stat.value}</h3>

                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-600">{stat.change}</span>
                    </div>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ---------------- 2 PANELS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT ACTIVITIES */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
          {/*    {recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                > */}
                   {/* Avatar */}
             {/*     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {item.teacher[0]}
                    </span>
                  </div>  
            */}
                  {/* Text Info */}
            {/*      <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {item.teacher}
                      <span className="text-gray-600"> {item.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
               */} 
                  {/* Type Badge */}
              {/*      <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </div> 
              ))} */}
            </div> 
          </CardContent>
        </Card>

        {/* PENDING LEAVES */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-orange-50 border border-orange-100 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-900">{leave.teacher}</p>
                      <p className="text-sm text-gray-600">{leave.type}</p>
                    </div>
                    <Badge className="bg-orange-500 text-white">
                      Pending
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">
                    Dates: {leave.dates}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))} */}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}