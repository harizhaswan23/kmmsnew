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
import { getClasses } from "../../api/classes"; 
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

      // 1. Fetch & Filter Students (Active Only)
      const studentsData = await getStudents();
      const activeStudents = studentsData.filter(s => 
        s.status && s.status.toLowerCase() === "active"
      );
      setTotalStudents(activeStudents.length);

      // 2. Fetch & Filter Teachers (Active Only)
      const teachersData = await getTeachers();
      const activeTeachersList = teachersData.filter(t => 
        t.status && t.status.toLowerCase() === "active"
      );
      setActiveTeachers(activeTeachersList.length);

      // 3. Attendance Calculation
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`; 
      
      // A. Get all classes first
      const allClasses = await getClasses();

      // B. Fetch attendance for each class for TODAY in parallel
      const attendancePromises = allClasses.map(cls => 
        getAttendance(today, cls._id)
          .catch(() => null) 
      );
      
      const results = await Promise.all(attendancePromises);

      // C. Sum up the "Present" counts strictly for ACTIVE students
      let totalPresent = 0;
      
      results.forEach((record) => {
        if (record && record.records && Array.isArray(record.records)) {
           
           const classPresent = record.records.filter(r => {
             // Check 1: Is the attendance status "Present"?
             const isMarkedPresent = r.status && r.status.toLowerCase() === "present";

             // Check 2: Is the Student Account "Active"?
             // (We use r.studentId.status because we populated it in the backend)
             const studentAccountStatus = r.studentId?.status || "active"; 
             const isAccountActive = studentAccountStatus.toLowerCase() === "active";

             return isMarkedPresent && isAccountActive;
           }).length;
           
           totalPresent += classPresent;
        }
      });

      setAttendanceToday({
        present: totalPresent,
        total: activeStudents.length, // Denominator: Total Active Students
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <p className="text-gray-500 text-sm">No recent activities to show.</p>
            </div> 
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <p className="text-gray-500 text-sm">No pending leave requests.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}