import React from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableGrid({ slots = [] }) {
  console.log("🟦 TimetableGrid slots:", slots);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="border p-2 bg-gray-100">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {getTimeRows(slots).map((time) => (
            <tr key={time}>
              <td className="border p-2 font-medium bg-gray-50">
                {time}
              </td>

              {DAYS.map((day) => {
                const slot = slots.find(
                  (s) => s.day === day && s.startTime === time
                );

                return (
                  <td key={day} className="border p-2 h-16">
                    {slot && (
                      <div
                        className="rounded p-2 text-white text-xs"
                        style={{ backgroundColor: slot.color || "#60a5fa" }}
                      >
                        <div className="font-semibold">
                          {slot.subject}
                        </div>
                        <div>
                          {slot.startTime} – {slot.endTime}
                        </div>
                        <div className="opacity-90">
                          {slot.teacherId?.name || ""}
                        </div>
                        <div className="opacity-80">
                        {slot.classId?.className}
                      </div>

                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4">
        {getLegend(slots).map((l) => (
          <div key={l.subject} className="flex items-center gap-2 text-sm">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: l.color }}
            />
            {l.subject}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function getTimeRows(slots) {
  const times = slots.map((s) => s.startTime);
  return [...new Set(times)].sort();
}

function getLegend(slots) {
  const map = {};
  slots.forEach((s) => {
    if (!map[s.subject]) {
      map[s.subject] = s.color || "#60a5fa";
    }
  });

  return Object.entries(map).map(([subject, color]) => ({
    subject,
    color,
  }));
}
