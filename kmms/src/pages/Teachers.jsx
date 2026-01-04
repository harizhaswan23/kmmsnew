import React, { useEffect, useState } from "react";
import TeacherList from "../components/Teachers/TeacherList";
import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../api/teachers";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
  try {
    const data = await getTeachers();
    console.log("GET /teachers response:", data); // 🔥 ADD THIS
    setTeachers(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to load teachers:", err);
    setTeachers([]);
  } finally {
    setLoading(false);
  }
};


  const handleAddTeacher = async (payload) => {
    await addTeacher(payload);
    loadTeachers();
  };

  const handleUpdateTeacher = async (id, payload) => {
    await updateTeacher(id, payload);
    loadTeachers();
  };

  const handleDeleteTeacher = async (id) => {
    await deleteTeacher(id);
    loadTeachers();
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading teachers...</div>;
  }

  return (
    <div className="p-6">
      <TeacherList
        teachers={teachers}
        onAdd={handleAddTeacher}      // ✅ REQUIRED
        onUpdate={handleUpdateTeacher} // ✅ REQUIRED
        onDelete={handleDeleteTeacher} // ✅ REQUIRED
      />
    </div>
  );
}
