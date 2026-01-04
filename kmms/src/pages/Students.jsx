import React, { useEffect, useState } from "react";
import StudentList from "../components/Students/StudentList";
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../api/students";
import { getTeachers } from "../api/teachers";
import { getClasses } from "../api/classes";
import { useToast } from "../components/ui/use-toast";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]); // ✅ classes state
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [studentData, teacherData, classData] = await Promise.all([
        getStudents(),
        getTeachers(),
        getClasses(), // ✅ fetch classes
      ]);

      setStudents(Array.isArray(studentData) ? studentData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
      setClasses(Array.isArray(classData) ? classData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (form) => {
    try {
      await addStudent(form);

      toast({
        title: "Student added",
        description: `${form.name} has been successfully added.`,
      });

      loadData();
    } catch (error) {
      toast({
        title: "Failed to add student",
        description:
          error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateStudent = async (id, data) => {
    try {
      await updateStudent(id, data);

      toast({
        title: "Student updated",
        description: "Student information updated successfully.",
      });

      loadData();
    } catch (error) {
      toast({
        title: "Failed to update student",
        description:
          error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

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
      <StudentList
        students={students}
        teachers={teachers}
        classes={classes}          // ✅ PASS CLASSES
        onAdd={handleAddStudent}
        onUpdate={handleUpdateStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}
