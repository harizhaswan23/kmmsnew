import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { getParentTimetableToday } from "../../api/timetables";

export default function ParentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await getParentTimetableToday();
      setTimetable(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load parent timetable:", err);
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading timetable...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Today’s Timetable</h2>

      {timetable.length === 0 && (
        <p className="text-gray-500">No timetable available for today.</p>
      )}

      {timetable.map((slot) => (
        <Card key={slot._id}>
          <CardHeader>
            <CardTitle>{slot.subjectName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Time:</strong> {slot.startTime} – {slot.endTime}
            </p>
            <p>
              <strong>Teacher:</strong> {slot.teacherId?.name || "—"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
