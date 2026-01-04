import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TimetableBuilder = ({
  timetables = [],
  teachers = [],
  classes = [],
  onCreate,
}) => {
  const [form, setForm] = useState({
    classId: "",
    day: "Monday",
    subject: "",
    teacherId: "",
    startTime: "",
    endTime: "",
    color: "#4f46e5",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSlot = async () => {
    if (
      !form.subject ||
      !form.startTime ||
      !form.endTime ||
      !form.teacherId
    ) {
      alert("Please complete all required fields");
      return;
    }


    await onCreate({
      classId: form.classId,
      day: form.day,
      subject: form.subject,
      teacherId: form.teacherId,
      startTime: form.startTime,
      endTime: form.endTime,
      color: form.color,
    });

    // reset subject/time only
    setForm((prev) => ({
      ...prev,
      subject: "",
      teacherId: "",
      startTime: "",
      endTime: "",
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Timetable Management</h2>
        <p className="text-sm text-gray-600">
          Create and manage class timetables
        </p>
      </div>

      {/* Builder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add Timetable Slot</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Class + Day */}
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border rounded-lg p-2"
              value={form.classId}
              onChange={(e) => handleChange("classId", e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg p-2"
              value={form.day}
              onChange={(e) => handleChange("day", e.target.value)}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <Input
            placeholder="Subject Name"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />

          {/* Teacher */}
          <select
            className="border rounded-lg p-2 w-full"
            value={form.teacherId}
            onChange={(e) => handleChange("teacherId", e.target.value)}
          >
            <option value="">Assign Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
            />
            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
            />
          </div>

          {/* Color */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Subject Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-10 h-10 border rounded"
            />
          </div>

          {/* Action */}
          <Button
            onClick={handleAddSlot}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableBuilder;
