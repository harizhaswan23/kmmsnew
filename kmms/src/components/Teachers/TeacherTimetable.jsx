import React, { useEffect, useState } from "react";
import TimetableGrid from "../Timetable/TimetableGrid";
import { getTeacherTimetable } from "../../api/timetables";

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await getTeacherTimetable();
      setTimetable(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load teacher timetable:", err);
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading timetable...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">My Teaching Timetable</h2>

      <TimetableGrid slots={timetable} />
    </div>
  );
}
