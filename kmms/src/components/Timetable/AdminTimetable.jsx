import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  getTimetableByClass,
  createTimetable,
} from "../../api/timetables";
import TimetableGrid from "./TimetableGrid";

import { getTeachers } from "../../api/teachers";
import { getClasses } from "../../api/classes";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function AdminTimetable() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [form, setForm] = useState({
    subject: "",
    startTime: "",
    endTime: "",
    teacherId: "",
    color: "#60a5fa",
  });

  // Load teachers & classes once
  useEffect(() => {
    loadBaseData();
  }, []);

  // Load timetable when class changes
  useEffect(() => {
    if (selectedClass) {
      loadTimetable(selectedClass);
    } else {
      setTimetables([]);
    }
  }, [selectedClass]);

  const loadBaseData = async () => {
    try {
      const [cls, tch] = await Promise.all([
        getClasses(),
        getTeachers(),
      ]);

      setClasses(cls || []);
      setTeachers(tch || []);
    } catch (err) {
      console.error("Failed to load base data:", err);
    }
  };

  const loadTimetable = async (classId) => {
    try {
      const data = await getTimetableByClass(classId);
      setTimetables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load timetable:", err);
      setTimetables([]);
    }
  };

  const handleAddSlot = async () => {
    if (!selectedClass) {
      alert("Please select a class first");
      return;
    }

    if (!form.subject || !form.startTime || !form.endTime) {
      alert("Please complete all required fields");
      return;
    }

    try {
      await createTimetable({
      classId: selectedClass,
      day: selectedDay,         
      subject: form.subject,     
      startTime: form.startTime,
      endTime: form.endTime,
      teacherId: form.teacherId,
      color: form.color,
       });

      setForm({
        subject: "",
        startTime: "",
        endTime: "",
        teacherId: "",
        color: "#60a5fa",
      });

      loadTimetable(selectedClass);
    } catch (err) {
      console.error("Failed to create timetable slot:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Timetable Management</h2>

      {/* CREATE SLOT */}
      <Card>
        <CardHeader>
          <CardTitle>Create Timetable Slot</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <select
            className="border rounded p-2"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <Input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />

          <Input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
          />

          <Input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
          />

          <select
            className="border rounded p-2"
            value={form.teacherId}
            onChange={(e) =>
              setForm({ ...form, teacherId: e.target.value })
            }
          >
            <option value="">Assign Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <Input
            type="color"
            value={form.color}
            onChange={(e) =>
              setForm({ ...form, color: e.target.value })
            }
          />

          <Button
            className="md:col-span-6 flex gap-2"
            onClick={handleAddSlot}
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </Button>
        </CardContent>
      </Card>

      {/* PREVIEW (PHASE 2) */}
      <Card>
        <CardHeader>
          <CardTitle>Timetable Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableGrid slots={timetables} />
        </CardContent>
      </Card>


    </div>
  );
}
