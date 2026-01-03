import React, { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import ParentDashboard from "../components/Dashboard/ParentDashboard";
import AdminTimetable from "../components/Timetable/AdminTimetable";
import Students from "./Students";
// import StudentList from "../components/Students/StudentList";
import TeacherList from "../components/Teachers/TeacherList";
import AttendanceManagement from "../components/Attendance/AttendanceManagement";
import ActivitiesTracking from "../components/Activities/ActivitiesTracking";
import LeaveManagement from "../components/Leave/LeaveManagement";
import LeaveRequest from "../components/Leave/LeaveRequest";
import PaymentManagement from "../components/Payments/PaymentManagement";
import Reports from "../components/Reports/Reports";
import Announcements from "../components/Announcements/Announcements";
import TeacherStudentView from "../components/Teachers/TeacherStudentView";
import Settings from "../components/Settings/Settings";


const Dashboard = ({ user, onLogout }) => {
  console.log("📌 Dashboard loaded. User role =", user.role);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Normalize for logic only
  const role = user.role.toLowerCase();

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    // ========== ADMIN ==========
    if (role === "admin") {
      if (activeTab === "dashboard")
        return <AdminDashboard setActiveTab={setActiveTab} />;

      if (activeTab === "users")
        return <Students mode="admin" />;

      if (activeTab === "teachers")
        return <TeacherList />;

      if (activeTab === "payments")
        return <PaymentManagement role="Admin" userId={user.id} />;

      if (activeTab === "leave")
        return <LeaveManagement />;

      if (activeTab === "reports")
        return <Reports />;

      if (activeTab === "announcements")
        return <Announcements />;

      if (activeTab === "timetable")
        return <AdminTimetable />;

      if (activeTab === "settings")
        return <Settings user={user} />;



      return <AdminDashboard setActiveTab={setActiveTab} />;
    }

    // ========== TEACHER ==========
    if (role === "teacher") {
      if (activeTab === "dashboard")
        return <TeacherDashboard setActiveTab={setActiveTab} />;

      if (activeTab === "students")
        return <TeacherStudentView />;


      if (activeTab === "attendance")
        return <AttendanceManagement teacherId={user.id} />;

      if (activeTab === "activities")
        return <ActivitiesTracking teacherId={user.id} />;

      if (activeTab === "leave-request")
        return <LeaveRequest teacherId={user.id} />;

      if (activeTab === "announcements")
        return <Announcements />;

      if (activeTab === "settings")
        return <Settings user={user} />;

      return <TeacherDashboard setActiveTab={setActiveTab} />;
    }

    // ========== PARENT ==========
    if (role === "parent") {
      if (activeTab === "dashboard")
        return <ParentDashboard setActiveTab={setActiveTab} />;

      if (activeTab === "payments")
        return <PaymentManagement role="Parent" userId={user.id} />;

      if (activeTab === "announcements")
        return <Announcements />;

      if (activeTab === "settings")
        return <Settings user={user} />;

      return <ParentDashboard setActiveTab={setActiveTab} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        role={user.role.toLowerCase()}   // 🔥 pass normalized role to sidebar
        activeTab={activeTab}
        setActiveTab={handleChangeTab}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        <Navbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        <main className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
