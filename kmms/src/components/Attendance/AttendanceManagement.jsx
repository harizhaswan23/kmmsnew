import React, { useContext, useState, useEffect } from "react";
import { KMMSContext } from "../../context/KMMSContext";
import { Users, CheckSquare, XSquare } from "lucide-react";
import { getAttendanceByDate, markAttendanceApi } from "../../api/attendance";

const AttendanceManagement = ({ teacherId }) => {
  const { students } = useContext(KMMSContext);

  // Use today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Map: { [studentId]: attendanceRecord }
  const [todayAttendance, setTodayAttendance] = useState({});

  // Only students that belong to this teacher
  const myStudents = students.filter(
    (s) => String(s.teacherId) === String(teacherId)
  );

  // Load attendance from backend whenever date changes
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const records = await getAttendanceByDate(selectedDate);
        // Convert array to map keyed by studentId
        const map = {};
        records.forEach((rec) => {
          // rec.studentId is the ObjectId string
          map[rec.studentId] = rec;
        });
        setTodayAttendance(map);
      } catch (error) {
        console.error("Error loading attendance:", error);
        setTodayAttendance({});
      }
    };

    loadAttendance();
  }, [selectedDate]);

  const handleMark = async (student, status) => {
  try {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedRec = await markAttendanceApi({
      date: selectedDate,
      studentId: student._id,   // from backend
      status,
      time,
      reason: "",
    });

    setTodayAttendance((prev) => ({
      ...prev,
      [student._id]: updatedRec,
    }));
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
};


  const presentCount = Object.values(todayAttendance).filter(
    (a) => a.status === "present"
  ).length;

  const absentCount = Object.values(todayAttendance).filter(
    (a) => a.status === "absent"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Attendance Management
        </h2>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">
          Mark Attendance – {selectedDate}
        </h3>

        {myStudents.length === 0 ? (
          <p className="text-gray-500">No students assigned to this teacher.</p>
        ) : (
          <div className="space-y-3">
            {myStudents.map((student) => {
              const record = todayAttendance[student._id];
              const status = record?.status;

              return (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {student.classroom || student.class || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMark(student, "present")}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        status === "present"
                          ? "bg-green-600 text-white"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      Present
                    </button>

                    <button
                      onClick={() => handleMark(student, "absent")}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        status === "absent"
                          ? "bg-red-600 text-white"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <XSquare className="w-4 h-4" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 text-center rounded-lg">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-blue-700">
            {myStudents.length}
          </p>
        </div>

        <div className="p-4 bg-green-50 text-center rounded-lg">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
        </div>

        <div className="p-4 bg-red-50 text-center rounded-lg">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
