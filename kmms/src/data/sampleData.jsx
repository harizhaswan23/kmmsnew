const sampleStudents = [
  { id: 1, name: 'Ahmad bin Ali', age: 5, class: 'Nursery A', parent: 'Ali bin Hassan', parentId: 1, teacherId: 1 },
  { id: 2, name: 'Siti Nurhaliza', age: 6, class: 'Pre-K B', parent: 'Fatimah binti Ahmad', parentId: 2, teacherId: 2 },
  { id: 3, name: 'Muhammad Hariz', age: 4, class: 'Toddler C', parent: 'Hassan bin Omar', parentId: 3, teacherId: 1 },
  { id: 4, name: 'Nurul Aina', age: 5, class: 'Nursery A', parent: 'Aminah binti Yusof', parentId: 4, teacherId: 1 },
  { id: 5, name: 'Danial Ariff', age: 6, class: 'Pre-K B', parent: 'Kamal bin Rashid', parentId: 5, teacherId: 2 }
];

const sampleTeachers = [
  { id: 1, name: 'Cikgu Fatimah', email: 'fatimah@kmms.edu', class: 'Nursery A', subjects: 'Early Learning' },
  { id: 2, name: 'Cikgu Azizah', email: 'azizah@kmms.edu', class: 'Pre-K B', subjects: 'Pre-Kindergarten' },
  { id: 3, name: 'Cikgu Halim', email: 'halim@kmms.edu', class: 'Toddler C', subjects: 'Toddler Care' }
];

const sampleActivities = [
  { id: 1, studentId: 1, date: '2025-11-18', activity: 'Learning ABCs', notes: 'Great participation!', time: '09:00 AM', photos: [] },
  { id: 2, studentId: 2, date: '2025-11-18', activity: 'Art & Craft', notes: 'Beautiful drawing', time: '10:30 AM', photos: [] },
  { id: 3, studentId: 3, date: '2025-11-18', activity: 'Story Time', notes: 'Loved the story', time: '11:00 AM', photos: [] },
  { id: 4, studentId: 1, date: '2025-11-18', activity: 'Outdoor Play', notes: 'Playing with friends', time: '02:00 PM', photos: [] }
];

const sampleAttendance = {
  '2025-11-18': {
    1: { status: 'present', time: '08:15 AM' },
    2: { status: 'present', time: '08:20 AM' },
    3: { status: 'absent', reason: 'Sick' },
    4: { status: 'present', time: '08:10 AM' },
    5: { status: 'present', time: '08:25 AM' }
  }
};

const samplePayments = [
  { id: 1, studentId: 1, amount: 500, category: 'Nursery', status: 'Paid', date: '2025-11-01', method: 'Online Banking' },
  { id: 2, studentId: 2, amount: 600, category: 'Pre-K', status: 'Pending', date: '2025-11-01', method: '' },
  { id: 3, studentId: 3, amount: 450, category: 'Toddler', status: 'Paid', date: '2025-11-01', method: 'Cash' },
  { id: 4, studentId: 4, amount: 500, category: 'Nursery', status: 'Paid', date: '2025-11-01', method: 'Online Banking' },
  { id: 5, studentId: 5, amount: 600, category: 'Pre-K', status: 'Pending', date: '2025-11-01', method: '' }
];

const sampleAnnouncements = [
  { id: 1, title: 'Holiday Notice', content: 'School closed on Nov 25', date: '2025-11-18', postedBy: 'Admin' },
  { id: 2, title: 'Parent-Teacher Meeting', content: 'Nov 30, 3 PM', date: '2025-11-17', postedBy: 'Admin' },
  { id: 3, title: 'Sports Day', content: 'Dec 15', date: '2025-11-16', postedBy: 'Admin' }
];

const sampleMessages = [
  { id: 1, from: 'Cikgu Fatimah', to: 'Parent', studentId: 1, message: 'Ahmad is doing good!', date: '2025-11-18', read: false },
  { id: 2, from: 'Parent', to: 'Cikgu Azizah', studentId: 2, message: 'Can we schedule meeting?', date: '2025-11-17', read: true }
];

const sampleLeaveRequests = [
  { id: 1, teacherId: 1, teacherName: 'Cikgu Fatimah', reason: 'Medical appointment', startDate: '2025-11-25', endDate: '2025-11-25', status: 'Pending' },
  { id: 2, teacherId: 2, teacherName: 'Cikgu Azizah', reason: 'Family emergency', startDate: '2025-11-20', endDate: '2025-11-21', status: 'Approved' }
];

const sampleSchedules = [
  { id: 1, teacherId: 1, class: 'Nursery A', day: 'Monday', startTime: '08:00', endTime: '12:00' },
  { id: 2, teacherId: 1, class: 'Nursery A', day: 'Monday', startTime: '14:00', endTime: '16:00' }
];

export default {
  sampleStudents,
  sampleTeachers,
  sampleActivities,
  sampleAttendance,
  samplePayments,
  sampleAnnouncements,
  sampleMessages,
  sampleLeaveRequests,
  sampleSchedules
};
