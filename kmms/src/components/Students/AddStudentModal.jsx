import React, { useState } from "react";
import { X } from "lucide-react";

const AddStudentModal = ({ onClose, onSubmit, teachers }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    className: "",
    parentName: "",
    parentId: "",
    teacherId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">

        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold">Add New Student</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <select
            name="className"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            <option value="Toddler C">Toddler C</option>
            <option value="Nursery A">Nursery A</option>
            <option value="Pre-K B">Pre-K B</option>
          </select>

          <input
            type="text"
            name="parentName"
            placeholder="Parent Name"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <select
            name="teacherId"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Student
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
