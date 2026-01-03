import React, { useEffect, useState } from "react";
import StudentList from "../components/Students/StudentList";
import AddStudentModal from "../components/Students/AddStudentModal";
import { getStudents, addStudent, deleteStudent } from "../api/students";
import { getTeachers } from "../api/teachers"; // create this later

export default function Students() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load students + teachers from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const studentData = await getStudents();
      const teacherData = await getTeachers();

      setStudents(studentData);
      setTeachers(teacherData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add student → backend
  const handleAddStudent = async (form) => {
    try {
      await addStudent(form);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Delete student → backend
  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      loadData();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading student records...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Student List */}
      <StudentList
      students={students}
      teachers={teachers}
      onAdd={handleAddStudent}   // ⭐ THIS IS THE KEY
      onDelete={handleDeleteStudent}
      />


      {/* Modal */}
      {showModal && (
        <AddStudentModal
        onClose={() => setShowModal(false)}
        onSave={handleAddStudent}
        teachers={teachers}
      />

      )}
    </div>
  );
}
