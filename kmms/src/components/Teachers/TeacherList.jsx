import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

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

const TeacherList = ({ teachers = [], onAdd, onUpdate, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewMode, setViewMode] = useState("current"); // 'current' or 'history'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    classAssigned: "",
    qualification: "",
    hireDate: "",
    epfNo: "",
    taxNo: "",
    status: "Active",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      classAssigned: "",
      qualification: "",
      hireDate: "",
      epfNo: "",
      taxNo: "",
      status: "Active",
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      classAssigned: formData.classAssigned,
      qualification: formData.qualification,
      hireDate: formData.hireDate,
      epfNo: formData.epfNo,
      taxNo: formData.taxNo,
      status: formData.status,
    };

    if (!editingTeacher && formData.password) {
      payload.password = formData.password;
    }

    if (editingTeacher) {
      await onUpdate(editingTeacher._id || editingTeacher.id, payload);
    } else {
      await onAdd(payload);
    }

    resetForm();
  };

  // Filter Logic: Current = Active, History = Inactive/Resigned
  const filteredTeachers = teachers.filter((teacher) => {
    const isActive = teacher.status === "Active";
    return viewMode === "current" ? isActive : !isActive;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Teacher Management</h2>
          <p className="text-sm text-gray-600">
            Manage all teachers and assignments
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  placeholder="e.g. Sarah Johnson"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  placeholder="e.g. 012-3456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password (only for new) */}
              {!editingTeacher && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* Class Assigned */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Class Assigned</label>
                <Input
                  placeholder="e.g. Nursery A"
                  value={formData.classAssigned}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      classAssigned: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Qualification */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Qualification</label>
                <select
                  className="border rounded-lg p-2 w-full text-sm"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualification: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Degree">Degree</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>

              {/* Hire Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Hire Date</label>
                <Input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* EPF No */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">EPF Number</label>
                <Input
                  placeholder="e.g. 12345678"
                  value={formData.epfNo}
                  onChange={(e) =>
                    setFormData({ ...formData, epfNo: e.target.value })
                  }
                />
              </div>

              {/* Tax No */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tax Number</label>
                <Input
                  placeholder="e.g. OG 123456789"
                  value={formData.taxNo}
                  onChange={(e) =>
                    setFormData({ ...formData, taxNo: e.target.value })
                  }
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  className="border rounded-lg p-2 w-full text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTeacher ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-2">
          {/* Tabs for Current vs History */}
          <div className="flex items-center gap-6 border-b">
            <button
              onClick={() => setViewMode("current")}
              className={`pb-3 text-sm font-medium transition-colors ${
                viewMode === "current"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Current Teachers
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`pb-3 text-sm font-medium transition-colors ${
                viewMode === "history"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>EPF No</TableHead>
                <TableHead>Tax No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <TableRow key={teacher._id || teacher.id}>
                    {/* Index Number */}
                    <TableCell className="font-medium text-gray-500">
                      {index + 1}.
                    </TableCell>

                    <TableCell className="font-medium text-gray-900">
                      {teacher.name}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone || "-"}</TableCell>
                    <TableCell>{teacher.classAssigned || "-"}</TableCell>
                    <TableCell>{teacher.qualification || "-"}</TableCell>
                    <TableCell>
                      {teacher.hireDate
                        ? new Date(teacher.hireDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{teacher.epfNo || "-"}</TableCell>
                    <TableCell>{teacher.taxNo || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          teacher.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          teacher.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setFormData({
                            name: teacher.name || "",
                            email: teacher.email || "",
                            phone: teacher.phone || "",
                            password: "",
                            classAssigned: teacher.classAssigned || "",
                            qualification: teacher.qualification || "",
                            hireDate: teacher.hireDate
                              ? teacher.hireDate.split("T")[0]
                              : "",
                            epfNo: teacher.epfNo || "",
                            taxNo: teacher.taxNo || "",
                            status: teacher.status || "Active",
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(teacher._id || teacher.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500 h-24">
                    No {viewMode} teachers found.
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

export default TeacherList;