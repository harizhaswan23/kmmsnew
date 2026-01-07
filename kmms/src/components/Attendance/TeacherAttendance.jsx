import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Save, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { getClasses } from "../../api/classes";
import { getAttendance, saveAttendance } from "../../api/attendance";

export default function TeacherAttendance({ user }) {
  const { toast } = useToast();
  
  const [myClass, setMyClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Find My Class based on user.classAssigned
  useEffect(() => {
    async function findMyClass() {
      if (!user.classAssigned) {
        setErrorMsg("You have no class assigned. Contact Admin.");
        return;
      }
      try {
        const allClasses = await getClasses();
        // Find the class ID that matches the string name
        const found = allClasses.find(c => 
          c.className.toLowerCase().trim() === user.classAssigned.toLowerCase().trim()
        );

        if (found) {
          setMyClass(found);
        } else {
          setErrorMsg(`Class "${user.classAssigned}" not found in database.`);
        }
      } catch (err) {
        console.error(err);
      }
    }
    findMyClass();
  }, [user]);

  // 2. Load Attendance
  useEffect(() => {
    if (!myClass || !selectedDate) return;

    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAttendance(selectedDate, myClass._id);
        const mappedRecords = data.records.map(r => ({
           studentId: r.studentId._id || r.studentId, 
           name: r.studentId.name || "Unknown",
           status: r.status || "Present",
           reason: r.reason || ""
        }));
        setAttendanceRecords(mappedRecords);
      } catch (err) {
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [myClass, selectedDate]);

  // Handlers
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
        classId: myClass._id,
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

  if (errorMsg) return <div className="p-10 text-red-500 font-bold text-center">{errorMsg}</div>;
  if (!myClass) return <div className="p-10 text-center">Loading your class info...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Title shows ONLY the assigned class */}
        <h2 className="text-2xl font-bold text-gray-900">
          Attendance: <span className="text-blue-600">{myClass.className}</span>
        </h2>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input 
            type="date" className="border rounded-md p-2 text-sm"
            value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
          />
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 ml-2">
            <Save className="w-4 h-4 mr-2"/> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between">
             <span>Student List</span>
             <span className="text-sm font-normal text-gray-500">Total: {attendanceRecords.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" /> : 
            attendanceRecords.length === 0 ? <div className="text-center p-8 text-gray-500">No students found in your class.</div> : (
            <div className="space-y-2">
               {/* Header */}
               <div className="grid grid-cols-12 gap-4 bg-gray-50 p-2 rounded text-sm font-bold text-gray-600">
                 <div className="col-span-4">Name</div>
                 <div className="col-span-4 text-center">Status</div>
                 <div className="col-span-4">Reason</div>
               </div>

               {/* List */}
               {attendanceRecords.map((r, i) => (
                <div key={r.studentId} className={`grid grid-cols-12 gap-4 items-center p-3 border rounded ${r.status === "Absent" ? "bg-red-50 border-red-100" : "bg-white"}`}>
                  <div className="col-span-4 font-medium truncate">{r.name}</div>
                  <div className="col-span-4 flex justify-center">
                    <button onClick={() => toggleStatus(i)} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${r.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {r.status === "Present" ? <><CheckCircle className="w-3 h-3"/> Present</> : <><XCircle className="w-3 h-3"/> Absent</>}
                    </button>
                  </div>
                  <div className="col-span-4">
                    {r.status === "Absent" && (
                      <select className="w-full border p-1 rounded text-sm bg-white" value={r.reason} onChange={(e) => handleReasonChange(i, e.target.value)}>
                        <option value="">Select Reason...</option>
                        <option value="Sick">Sick</option>
                        <option value="Family Matter">Family Matter</option>
                        <option value="Emergency">Emergency</option>
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