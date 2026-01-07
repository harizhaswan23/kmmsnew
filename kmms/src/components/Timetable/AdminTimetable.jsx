import React, { useState, useEffect } from "react";
import { Plus, Save, Calendar, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast"; // Ensure you have this or use alert()

import TimetableGrid from "./TimetableGrid";
import { getClasses } from "../../api/classes";
import { getTeachers } from "../../api/teachers";
import { 
  getTimetableByClass, 
  createTimetable, 
  deleteTimetable 
} from "../../api/timetables"; // Import real API functions

export default function AdminTimetable() {
  const { toast } = useToast(); // Optional: specific toast notification
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [fetchingTimetable, setFetchingTimetable] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    subject: "",
    teacher: "", // This will store the teacher's NAME for display, or ID if you prefer
  });

  // 1. Fetch Classes & Teachers on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const [classesData, teachersData] = await Promise.all([
          getClasses(),
          getTeachers(),
        ]);
        setClasses(classesData || []);
        setTeachers(teachersData || []);

        // Default to first class
        if (classesData && classesData.length > 0) {
          setSelectedClassId(classesData[0]._id);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Fetch Timetable when Class changes
  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchSlots() {
      setFetchingTimetable(true);
      try {
        const data = await getTimetableByClass(selectedClassId);
        setTimetableData(data || []);
      } catch (err) {
        console.error("Failed to load timetable", err);
        setTimetableData([]);
      } finally {
        setFetchingTimetable(false);
      }
    }

    fetchSlots();
  }, [selectedClassId]);

  // 3. Handle Add Slot (Backend Integration)
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.startTime || !formData.endTime || !selectedClassId) return;

    try {
      // Find the teacher object to send the ID if needed, 
      // OR just send the name if your backend expects a name string.
      // Based on your controller: it expects "teacherId". 
      // If your form stores the "Name" string, you need to find the ID.
      const selectedTeacherObj = teachers.find(t => t.name === formData.teacher);
      
      const payload = {
        classId: selectedClassId,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        subject: formData.subject,
        teacherId: selectedTeacherObj ? selectedTeacherObj._id : null, 
        // If your backend schema allows teacher name strings, change above line.
        // But usually it's an ObjectId reference.
      };

      await createTimetable(payload);
      
      // Refresh list
      const updatedData = await getTimetableByClass(selectedClassId);
      setTimetableData(updatedData);

      // Reset Form
      setFormData({
        ...formData,
        subject: "",
        // teacher: "", // Optional: keep teacher selected for faster entry
      });

      if (toast) toast({ title: "Success", description: "Slot added successfully" });

    } catch (err) {
      console.error("Failed to add slot", err);
      alert("Error adding slot. Please check console.");
    }
  };

  // 4. Handle Delete Slot (Backend Integration)
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await deleteTimetable(slotId);
      
      // Remove from UI immediately
      setTimetableData((prev) => prev.filter((slot) => slot._id !== slotId && slot.id !== slotId));
      
    } catch (err) {
      console.error("Failed to delete slot", err);
      alert("Failed to delete session.");
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Timetable Management</h2>
      </div>

      {/* --- CLASS TABS --- */}
      <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-wrap gap-2">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => setSelectedClassId(cls._id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedClassId === cls._id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              Class {cls.className || cls.name}
            </button>
          ))
        ) : (
          <span className="text-sm text-gray-500 px-4">No classes found. Add a class first.</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* --- ADD SLOT FORM --- */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Add Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSlot} className="space-y-4">
              
              {/* Day */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Day</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Start</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">End</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <Input
                  placeholder="e.g. Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              {/* Teacher */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Teacher</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="sm" className="w-full bg-pink-600 hover:bg-pink-700 mt-2"><Plus className="w-4 h-4 mr-2" /> Add Slot
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- PREVIEW --- */}
        <div className="lg:col-span-3">
          <Card className="h-full min-h-[500px]">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>
                  Preview: {classes.find(c => c._id === selectedClassId)?.className || "Class"}
                </span>
                <span className="text-sm font-normal text-gray-500 flex items-center">
                  {fetchingTimetable && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Weekly Schedule
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <TimetableGrid
                slots={timetableData.map(slot => ({
                  ...slot,
                  // Ensure these fields map correctly for the Grid component
                  // Backend populates 'teacherId' as an object { _id, name }
                  // Grid expects a string 'teacher'
                  teacher: slot.teacherId?.name || "Unknown Teacher", 
                  id: slot._id // Map _id to id for deletion logic
                }))}
                onDeleteSlot={handleDeleteSlot}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}