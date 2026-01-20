import React, { useEffect, useState } from "react";
import StudentList from "../../components/Students/StudentList";
import { getStudents } from "../../api/students";
import { getTeachers } from "../../api/teachers"; // keep if you want teacher names shown

export default function TeacherStudents({ user }) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use user._id or user.id depending on what you store
  //const teacherId = user?._id || user?.id || null;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // getStudents() on the backend will auto-filter by req.user (teacher),
      // so no need to pass teacherId here. It uses the token for auth.
      const studentData = await getStudents();

      // Optional: fetch teachers if StudentList expects teacher objects to display teacher names
      let teacherData = [];
      try {
        teacherData = await getTeachers();
      } catch (err) {
        // non-fatal: teacher list is just for display of names
        teacherData = [];
      }

      setStudents(Array.isArray(studentData) ? studentData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
    } catch (err) {
      console.error("Failed to load teacher students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Teachers probably shouldn't delete students; if allowed, implement API & call it
    console.warn("Delete action not implemented for teachers");
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading students...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Students</h1>
      </div>

      <StudentList
        students={students}
        teachers={teachers}
        onDelete={handleDelete}
        userRole="teacher"
      />
    </div>
  );
}
