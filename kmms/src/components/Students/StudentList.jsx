import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const StudentList = ({
  students = [],
  teachers = [],
  onDelete,
  onAdd, // optional: parent can pass a function to call addStudent API
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    className: "",
    parentName: "",
    teacherId: "",
  });

  // --- Helper: derive age group from age ---
const computeAgeBucket = (age) => {
  const n = Number(age);
  if (!n) return null;
  if (n === 4) return 4;
  if (n === 5) return 5;
  if (n === 6) return 6;
  return null;
};

const getAgeColor = (age) => {
  switch (age) {
    case 4:
      return "bg-blue-100 text-blue-700";
    case 5:
      return "bg-green-100 text-green-700";
    case 6:
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

  // // Attach derived ageGroup to each student (based on age)
  // const enhancedStudents = useMemo(
  //   () =>
  //     (Array.isArray(students) ? students : []).map((s) => ({
  //       ...s,
  //       ageGroup: computeAgeBucket(s.age),
  //     })),
  //   [students]
  // );

  // --- Filtering & search ---
  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      !q ||
      student.name?.toLowerCase().includes(q) ||
      student.className?.toLowerCase().includes(q) ||
      student.parentName?.toLowerCase().includes(q);

    const matchesFilter =
  filterAgeGroup === "all" ||
  Number(filterAgeGroup) === Number(student.age);

    return matchesSearch && matchesFilter;
  });

  // --- Stats cards ---
const stats = useMemo(
  () => ({
    total: students.length,
    age4: students.filter((s) => Number(s.age) === 4).length,
    age5: students.filter((s) => Number(s.age) === 5).length,
    age6: students.filter((s) => Number(s.age) === 6).length,
  }),
  [students]
);


  // --- Add student submit handler ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      age: Number(formData.age) || undefined,
      className: formData.className,
      parentName: formData.parentName,
      teacherId: formData.teacherId || undefined,
      // parentId can be wired later if you add a parent dropdown
    };

    if (onAdd) {
      await onAdd(payload);
    }

    // Reset + close
    setFormData({
      name: "",
      age: "",
      className: "",
      parentName: "",
      teacherId: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (!onDelete) return;
    if (window.confirm("Are you sure you want to delete this student?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER + ADD BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray900 text-xl font-bold">
            Student Management
          </h2>
          <p className="text-gray-600 text-sm">
            Manage all students and their information
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
              {/* Name + Age */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Age"
                  type="number"
                  min="1"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>

              {/* Class + Teacher */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Class (e.g. Nursery A)"
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                />

                <select
                  className="border rounded-lg p-2 w-full"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                >
                  <option value="">Select Teacher</option>
                  {Array.isArray(teachers) &&
                    teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Parent name */}
              <Input
                placeholder="Parent Name"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData({ ...formData, parentName: e.target.value })
                }
              />

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card> 
          <CardContent className="p-4 flex items-center justify-between"> 
            <div> 
              <p className="text-sm text-gray-600">Total Students</p> 
              <h3 className="text-lg text-black-600">{stats.total}</h3> 
              </div> <GraduationCap className="w-10 h-10 text-gray-400" /> 
              </CardContent> 
              </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">4 Years</p>
              <h3 className="text-lg text-blue-600">{stats.age4}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"> <span className="text-blue-600 text-sm">4Y</span> </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">5 Years</p>
              <h3 className="text-lg text-green-600">{stats.age5}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"> <span className="text-blue-600 text-sm">5Y</span> </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">6 Years</p>
              <h3 className="text-lg text-purple-600">{stats.age6}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"> <span className="text-blue-600 text-sm">6Y</span> </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>All Students ({filteredStudents.length})</CardTitle>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Age filter */}
              <select
                className="border rounded-lg p-2 w-full md:w-40"
                value={filterAgeGroup}
                onChange={(e) => setFilterAgeGroup(e.target.value)}
              >
                <option value="all">All Ages</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="6">6 Years</option>

              </select>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search by name, class, parent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredStudents.map((student) => {
                const id = student._id || student.id;
                return (
                  <TableRow key={id}>
                    {/* Student name + chip */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                          {student.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Class: {student.className || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Age */}
                    <TableCell>{student.age || "-"}</TableCell>

                    {/* Age group badge */}
                    <TableCell>
                    <Badge className={getAgeColor(Number(student.age))}>
                      {student.age ? `${student.age} Years` : "N/A"}
                    </Badge>

                    </TableCell>

                    {/* Parent */}
                    <TableCell>{student.parentName || "-"}</TableCell>

                    {/* Class */}
                    <TableCell>{student.className || "-"}</TableCell>

                    {/* Teacher */}
                    <TableCell>{student.teacherId?.name || "-"}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent text-gray-600 hover:bg-gray-100 px-2 py-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          type="button"
                          className="bg-transparent hover:bg-red-50 px-2 py-1"
                          onClick={() => handleDeleteClick(id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
