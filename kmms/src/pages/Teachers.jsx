import React, { useState, useEffect } from "react";
import { getTeachers, addTeacher, deleteTeacher } from "../api/teachers";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    classAssigned: "",
    subjects: ""
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const data = await getTeachers();
    setTeachers(data);
  };

  const handleAdd = async () => {
    await addTeacher(form);
    setShowAdd(false);
    loadTeachers();
  };

  const handleDelete = async (id) => {
    await deleteTeacher(id);
    loadTeachers();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <button onClick={() => setShowAdd(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Add Teacher
        </button>
      </div>

      {/* Teacher list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <div key={t._id} className="bg-white p-4 shadow rounded-lg">
            <p className="font-bold">{t.name}</p>
            <p className="text-gray-600">{t.email}</p>
            <p className="text-sm text-gray-500">Class: {t.classAssigned}</p>
            <p className="text-sm text-gray-500">Subjects: {t.subjects}</p>

            <button
              onClick={() => handleDelete(t._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-lg font-bold mb-3">Add Teacher</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Class Assigned"
              onChange={(e) => setForm({ ...form, classAssigned: e.target.value })}
            />

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Subjects"
              onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            />

            <button
              onClick={handleAdd}
              className="w-full bg-green-600 text-white py-2 rounded mt-2"
            >
              Save
            </button>

            <button
              onClick={() => setShowAdd(false)}
              className="w-full bg-gray-300 py-2 rounded mt-2"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
