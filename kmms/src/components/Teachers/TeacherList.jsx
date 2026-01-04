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
      await onUpdate(editingTeacher._id, payload);
    } else {
      await onAdd(payload);
    }

    resetForm();
  };

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

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />

              {!editingTeacher && (
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              )}

              <Input
                placeholder="Class Assigned (e.g. Nursery A)"
                value={formData.classAssigned}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    classAssigned: e.target.value,
                  })
                }
                required
              />

              <select
                className="border rounded-lg p-2 w-full"
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
              </select>

              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) =>
                  setFormData({ ...formData, hireDate: e.target.value })
                }
                required
              />

              <Input
                placeholder="EPF Number"
                value={formData.epfNo}
                onChange={(e) =>
                  setFormData({ ...formData, epfNo: e.target.value })
                }
              />

              <Input
                placeholder="Tax Number"
                value={formData.taxNo}
                onChange={(e) =>
                  setFormData({ ...formData, taxNo: e.target.value })
                }
              />

              <select
                className="border rounded-lg p-2 w-full"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTeacher ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({teachers.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
              {teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.name}</TableCell>
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
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingTeacher(teacher);
                        setFormData({
                          name: teacher.name || "",
                          email: teacher.email || "",
                          phone: teacher.phone || "",
                          password: "",
                          classAssigned: teacher.classAssigned || "",
                          qualification: teacher.qualification || "",
                          hireDate:
                            teacher.hireDate?.split("T")[0] || "",
                          epfNo: teacher.epfNo || "",
                          taxNo: teacher.taxNo || "",
                          status: teacher.status || "Active",
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => onDelete(teacher._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No teachers found.
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
