import React, { createContext, useState } from "react";
import data from "../data/sampleData";

export const KMMSContext = createContext();

export const KMMSProvider = ({ children }) => {
  const [students, setStudents] = useState(data.sampleStudents);
  const [teachers, setTeachers] = useState(data.sampleTeachers);
  const [activities, setActivities] = useState(data.sampleActivities);
  const [attendance, setAttendance] = useState(data.sampleAttendance);
  const [payments, setPayments] = useState(data.samplePayments);
  const [announcements, setAnnouncements] = useState(data.sampleAnnouncements);
  const [messages, setMessages] = useState(data.sampleMessages);
  const [leaveRequests, setLeaveRequests] = useState(data.sampleLeaveRequests);
  const [schedules, setSchedules] = useState(data.sampleSchedules);

  return (
    <KMMSContext.Provider
      value={{
        students, setStudents,
        teachers, setTeachers,
        activities, setActivities,
        attendance, setAttendance,
        payments, setPayments,
        announcements, setAnnouncements,
        messages, setMessages,
        leaveRequests, setLeaveRequests,
        schedules, setSchedules
      }}
    >
      {children}
    </KMMSContext.Provider>
  );
};
