import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Save, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { getClasses } from "../../api/classes";
import { getAttendance, saveAttendance } from "../../api/attendance";

export default function AdminAttendance() {
  const { toast } = useToast();
  
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load All Classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getClasses();
        setClasses(data || []);
        if (data && data.length > 0) setSelectedClassId(data[0]._id);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }
    loadClasses();
  }, []);

  // 2. Load Attendance (FIXED: Filter Active Only)
  useEffect(() => {
    if (!selectedClassId || !selectedDate) return;

    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAttendance(selectedDate, selectedClassId);
        
        const activeRecords = data.records
          .map(r => {
             // Handle populated student object
             const studentObj = r.studentId || {};
             return {
               studentId: studentObj._id || r.studentId, 
               name: studentObj.name || "Unknown",
               status: r.status || "Present",
               reason: r.reason || "",
               // Capture student account status (active/graduated/withdrawn)
               accountStatus: studentObj.status || "active" 
             };
          })
          // FILTER: Only show "active" students
          .filter(r => r.accountStatus.toLowerCase() === "active");

        setAttendanceRecords(activeRecords);
      } catch (err) {
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedClassId, selectedDate]);

  const toggleStatus = (index) => {
    const newRecords = [...attendanceRecords];
    const currentStatus = newRecords[index].status;
    newRecords[index].status = currentStatus === "Present" ? "Absent" : "Present";
    if (newRecords[index].status === "Present") newRecords[index].reason = "";
    setAttendanceRecords(newRecords);
  };

  const handleReasonChange = (index, value) => {
    const newRecords = [...attendanceRecords];
    newRecords[index].reason = value;
    setAttendanceRecords(newRecords);
  };

  const handleSave = async () => {
    try {
      const payload = {
        date: selectedDate,
        classId: selectedClassId,
        records: attendanceRecords.map(r => ({
          studentId: r.studentId,
          status: r.status,
          reason: r.reason
        }))
      };
      await saveAttendance(payload);
      toast({ title: "Success", description: "Attendance saved!" });
    } catch (err) {
      alert("Failed to save.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Attendance (Admin)</h2>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input 
            type="date" className="border rounded-md p-2 text-sm"
            value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
          />
          <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700 ml-2">
            <Save className="w-4 h-4 mr-2"/> Save
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-wrap gap-2">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => setSelectedClassId(cls._id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedClassId === cls._id
                  ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cls.className}
            </button>
          ))
        ) : (
          <span className="text-sm text-gray-500 px-4">No classes found.</span>
        )}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between">
             <span>Student List</span>
             <span className="text-sm font-normal text-gray-500">Total: {attendanceRecords.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No active students found in this class.</div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 bg-gray-50 p-2 rounded text-sm font-bold text-gray-600">
                <div className="col-span-4">Name</div>
                <div className="col-span-4 text-center">Status</div>
                <div className="col-span-4">Reason</div>
              </div>

              {attendanceRecords.map((r, i) => (
                <div 
                  key={r.studentId} 
                  className={`grid grid-cols-12 gap-4 items-center p-3 border rounded ${
                    r.status === "Absent" ? "bg-red-50 border-red-100" : "bg-white"
                  }`}
                >
                  <div className="col-span-4 font-medium truncate">{r.name}</div>
                  
                  <div className="col-span-4 flex justify-center">
                    <button 
                      onClick={() => toggleStatus(i)} 
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === "Present" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status === "Present" ? (
                        <><CheckCircle className="w-3 h-3"/> Present</>
                      ) : (
                        <><XCircle className="w-3 h-3"/> Absent</>
                      )}
                    </button>
                  </div>

                  <div className="col-span-4">
                    {r.status === "Absent" && (
                      <select 
                        className="w-full border p-1 rounded text-sm bg-white" 
                        value={r.reason} 
                        onChange={(e) => handleReasonChange(i, e.target.value)}
                      >
                        <option value="">Select Reason...</option>
                        <option value="Sick">Sick</option>
                        <option value="Family Matter">Family Matter</option>
                        <option value="Emergency">Emergency</option>
                        <option value="MIA">MIA</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}