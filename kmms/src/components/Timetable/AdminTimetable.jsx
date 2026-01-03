import React, { useEffect, useState } from "react";
import { getTimetables, createTimetable, updateTimetable } from "../../api/timetables";
import { getClasses } from "../../api/classes";
import { Plus, Trash2 } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export default function AdminTimetable() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formDay, setFormDay] = useState("monday");
  const [formSlots, setFormSlots] = useState([
    { startTime: "", endTime: "", subject: "", teacherName: "", room: "" },
  ]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadTimetables(selectedClassId);
    }
  }, [selectedClassId]);

  async function loadClasses() {
    try {
      const data = await getClasses();
      setClasses(data || []);
      if (data && data.length > 0) {
        setSelectedClassId(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  }

  async function loadTimetables(classId) {
    try {
      setLoading(true);
      const data = await getTimetables({ classId });
      setTimetables(data || []);
    } catch (err) {
      console.error("Failed to load timetables", err);
    } finally {
      setLoading(false);
    }
  }

  function getDayDoc(day) {
    return timetables.find((t) => t.dayOfWeek === day);
  }

  function openFormForDay(day) {
    setFormDay(day);
    const existing = getDayDoc(day);

    if (existing && existing.slots && existing.slots.length > 0) {
      setFormSlots(
        existing.slots.map((s) => ({
          startTime: s.startTime || "",
          endTime: s.endTime || "",
          subject: s.subject || "",
          teacherName: s.teacherName || "",
          room: s.room || "",
        }))
      );
    } else {
      setFormSlots([
        { startTime: "", endTime: "", subject: "", teacherName: "", room: "" },
      ]);
    }

    setShowForm(true);
  }

  function handleSlotChange(index, field, value) {
    setFormSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  }

  function addSlotRow() {
    setFormSlots((prev) => [
      ...prev,
      { startTime: "", endTime: "", subject: "", teacherName: "", room: "" },
    ]);
  }

  function removeSlotRow(index) {
    setFormSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveDay(e) {
    e.preventDefault();
    if (!selectedClassId) return;

    const payload = {
      classId: selectedClassId,
      dayOfWeek: formDay,
      slots: formSlots.filter((s) => s.subject && s.startTime && s.endTime),
    };

    if (payload.slots.length === 0) {
      return;
    }

    const existing = getDayDoc(formDay);

    try {
      if (existing) {
        await updateTimetable(existing._id, payload);
      } else {
        await createTimetable(payload);
      }
      setShowForm(false);
      await loadTimetables(selectedClassId);
    } catch (err) {
      console.error("Failed to save timetable", err);
    }
  }

  const selectedClass = classes.find((c) => c._id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Class Timetable</h2>
          <p className="text-gray-600 text-sm">
            Manage weekly timetable by class
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            className="border rounded-lg px-3 py-2"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name || cls.className || "Class"}{" "}
                {cls.level ? `(${cls.level})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-gray-500">Loading timetable...</div>}

      {!loading && selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS.map((day) => {
            const doc = getDayDoc(day);
            const displayName =
              day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

            return (
              <div
                key={day}
                className="bg-white rounded-xl shadow p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{displayName}</h3>
                  <button
                    onClick={() => openFormForDay(day)}
                    className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                {doc && doc.slots && doc.slots.length > 0 ? (
                  <ul className="space-y-2">
                    {doc.slots
                      .slice()
                      .sort((a, b) =>
                        (a.startTime || "").localeCompare(b.startTime || "")
                      )
                      .map((slot, idx) => (
                        <li
                          key={idx}
                          className="border border-gray-100 rounded-lg px-3 py-2 text-sm"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {slot.subject}
                            </span>
                            <span className="text-xs text-gray-500">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {slot.teacherName && (
                              <span>👩‍🏫 {slot.teacherName} </span>
                            )}
                            {slot.room && <span>• Room {slot.room}</span>}
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    No slots added yet for this day.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Overlay Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold mb-1">
              Edit{" "}
              {formDay.charAt(0).toUpperCase() + formDay.slice(1)} timetable
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Class: {selectedClass?.name || selectedClass?.className}
            </p>

            <form
              onSubmit={handleSaveDay}
              className="space-y-3 max-h-96 overflow-y-auto pr-1"
            >
              {formSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                >
                  <input
                    type="time"
                    className="border rounded px-2 py-1 text-sm"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleSlotChange(index, "startTime", e.target.value)
                    }
                    required
                  />
                  <input
                    type="time"
                    className="border rounded px-2 py-1 text-sm"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(index, "endTime", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subject / Activity"
                    className="border rounded px-2 py-1 text-sm"
                    value={slot.subject}
                    onChange={(e) =>
                      handleSlotChange(index, "subject", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Teacher"
                    className="border rounded px-2 py-1 text-sm"
                    value={slot.teacherName}
                    onChange={(e) =>
                      handleSlotChange(index, "teacherName", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Room"
                      className="border rounded px-2 py-1 text-sm flex-1"
                      value={slot.room}
                      onChange={(e) =>
                        handleSlotChange(index, "room", e.target.value)
                      }
                    />
                    {formSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlotRow(index)}
                        className="p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSlotRow}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add another slot
              </button>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
