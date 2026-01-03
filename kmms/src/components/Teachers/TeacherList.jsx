import React, { useEffect, useState } from "react";
import { BookOpen, Trash2, Edit, UserPlus } from "lucide-react";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";

import { getTeachers, addTeacher, deleteTeacher } from "../../api/teachers";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);

  // Load teachers from backend
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  // ADD Teacher → backend
  const handleAddTeacher = async (formData) => {
    try {
      await addTeacher(formData);
      setShowAddModal(false);
      loadTeachers(); // refresh list
    } catch (err) {
      console.error("Failed to add teacher:", err);
    }
  };

  // DELETE Teacher → backend
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await deleteTeacher(id);
      loadTeachers();
    } catch (err) {
      console.error("Delete teacher failed:", err);
    }
  };

  // EDIT Teacher (only local unless backend PUT is made)
  const handleEditTeacher = async (updated) => {
    console.warn("⚠️ Update teacher not implemented in backend yet.");
    setEditTeacher(null);
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading teachers...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Teacher Management</h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Teacher
        </button>
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>

              <div className="flex-1">
                <p className="font-semibold">{teacher.name}</p>
                <p className="text-sm text-gray-600">{teacher.email}</p>
                <p className="text-xs text-gray-500">Role: {teacher.role}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditTeacher(teacher)}
                className="flex-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Edit
              </button>

              <button
                onClick={() => handleDelete(teacher._id)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddTeacherModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTeacher}
        />
      )}

      {/* Edit Modal (optional — requires backend PUT) */}
      {editTeacher && (
        <EditTeacherModal
          teacher={editTeacher}
          onClose={() => setEditTeacher(null)}
          onSave={handleEditTeacher}
        />
      )}
    </div>
  );
};

export default TeacherList;
