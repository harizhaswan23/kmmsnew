import React, { useEffect, useState } from "react";
import TimetableBuilder from "../components/Timetable/TimetableBuilder";

import { getTimetables, createTimetable } from "../api/timetables";
import { getTeachers } from "../api/teachers";
import { getClasses } from "../api/classes";

export default function Timetables() {
  const [timetables, setTimetables] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [timetableData, teacherData, classData] = await Promise.all([
        getTimetables(),
        getTeachers(),
        getClasses(),
      ]);

      setTimetables(Array.isArray(timetableData) ? timetableData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
      setClasses(Array.isArray(classData) ? classData : []);
    } catch (err) {
      console.error("Failed to load timetable data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    await createTimetable(payload);
    loadData();
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading timetables...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <TimetableBuilder
        timetables={timetables}
        teachers={teachers}
        classes={classes}
        onCreate={handleCreate}
      />
    </div>
  );
}
