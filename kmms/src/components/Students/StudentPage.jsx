import React, { useEffect, useState } from "react";
import StudentList from "../components/StudentList";
import { getStudents, addStudent, deleteStudent } from "../api/students";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const handleAddStudent = async (payload) => {
    await addStudent(payload);   // ✅ backend POST
    await loadStudents();        // ✅ refresh UI
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    await loadStudents();
  };

  return (
    <StudentList
      students={students}
      onAdd={handleAddStudent}
      onDelete={handleDeleteStudent}
    />
  );
};

export default StudentsPage;
