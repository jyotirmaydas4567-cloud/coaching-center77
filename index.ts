export type UserRole = 'admin' | 'teacher' | 'student' | 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'student' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  referenceId?: string; // teacherId or studentId
  status: 'ACTIVE' | 'DISABLED';
  avatarUrl?: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
}

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'DUE';
export type StudentStatus = 'ACTIVE' | 'ARCHIVED';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string; // Database internal ID (e.g., "stu_abc123")
  studentId: string; // Formatted ID e.g., "STU-2026-0001"
  fullName: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  dateOfBirth?: string;
  gender?: Gender | string;
  bloodGroup?: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  photoUrl?: string;
  
  // Academic
  courseId: string;
  courseName?: string;
  batchId: string;
  batchName?: string;
  admissionDate: string;
  courseDuration?: string;
  studentStatus: StudentStatus;
  schoolCollege?: string;
  previousGrade?: string;

  // Guardian
  guardianName?: string;
  guardianMobile?: string;
  guardianPhone?: string;
  relation?: string;
  guardianRelation?: string;
  guardianOccupation?: string;

  // Financials (computed/stored)
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  paymentStatus: PaymentStatus;
  nextDueDate?: string;

  // System & Credentials
  userId?: string;
  username?: string;
  notes?: string;
  createdDate: string;
  lastUpdated: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';

export interface Payment {
  id: string;
  paymentId: string; // e.g., "PAY-2026-0001"
  studentId: string; // references Student.id or studentId
  studentFormattedId?: string;
  studentName?: string;
  courseName?: string;
  batchName?: string;
  totalFee?: number;
  amount: number;
  remainingDue?: number;
  paymentDate: string;
  paymentMethod: PaymentMethod | string;
  transactionId?: string;
  receivedBy: string;
  paymentStatus?: 'PAID' | 'PARTIAL' | 'DUE';
  receiptUrl?: string;
  screenshotUrl?: string;
  note?: string;
  createdAt: string;
}

export type DocumentType = 
  | 'Student Photo'
  | 'ID Proof'
  | 'Educational Certificate'
  | 'Marksheet'
  | 'Address Proof'
  | 'Admission Form'
  | 'Registration Document'
  | 'Payment Receipt'
  | 'Other';

export type DocumentStatus = 'Missing' | 'Pending Review' | 'Approved' | 'Rejected' | 'Submitted' | 'Pending';
export type DocumentVisibility = 'ADMIN_ONLY' | 'ADMIN_TEACHER' | 'ADMIN_TEACHER_STUDENT';

export interface StudentDocument {
  id: string;
  documentId: string;
  studentId: string;
  studentName?: string;
  studentFormattedId?: string;
  documentType: DocumentType | string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: string;
  uploadedDate?: string;
  uploadedAt?: string;
  status: DocumentStatus | string;
  visibility?: DocumentVisibility | string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceRecordItem {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSession {
  id: string;
  batchId: string;
  batchName?: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecordItem[];
  markedBy: string;
  markedByName?: string;
  markedAt: string;
  createdAt?: string;
}

export interface ClassSchedule {
  id: string;
  className: string;
  courseId: string;
  courseName?: string;
  batchId: string;
  batchName?: string;
  teacherId: string;
  teacherName?: string;
  date?: string; // YYYY-MM-DD
  dayOfWeek?: string; // e.g. "Monday, Wednesday, Friday"
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "12:00 PM"
  room: string;
  meetingLink?: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Course {
  id: string;
  courseId?: string;
  code?: string;
  name?: string;
  courseName: string;
  description: string;
  duration: string;
  fee?: number;
  courseFee: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface Batch {
  id: string;
  batchId: string; // e.g., "BAT-2026-A"
  name?: string;
  batchName: string;
  courseId: string;
  courseName?: string;
  assignedTeacherId: string;
  teacherId?: string;
  teacherName?: string;
  startDate: string;
  endDate: string;
  classTime: string; // e.g., "10:00 AM - 12:00 PM"
  classDays?: string;
  room?: string;
  roomNumber?: string;
  maxCapacity?: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  studentCount?: number;
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g., "TCH-2026-001"
  name: string;
  fullName?: string;
  photoUrl?: string;
  mobile: string;
  phone?: string;
  email: string;
  subject?: string;
  course?: string;
  salary?: number;
  assignedBatchIds: string[];
  assignedBatches?: { id: string; name: string }[];
  status: 'ACTIVE' | 'DISABLED';
  userId?: string;
  qualification?: string;
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

export type NoticeAudience = 'All' | 'Teachers' | 'Students' | 'Specific Batch' | 'Specific Student';

export interface Notice {
  id: string;
  title: string;
  description: string;
  content?: string;
  publishDate: string;
  expiryDate?: string;
  targetAudience: NoticeAudience | string;
  targetBatchId?: string;
  targetBatchName?: string;
  targetStudentId?: string;
  isPinned?: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  action: string;
  target: string;
  timestamp: string;
  ipAddress?: string;
  details?: Record<string, any>;
}

export interface SystemSettings {
  instituteName: string;
  adminName?: string;
  tagline?: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  currencySymbol: string;
  currencyCode?: string;
  receiptFooter?: string;
  receiptFooterText?: string;
  allowedFileTypes?: string[];
  maxFileSizeMb?: number;
  academicYear?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalBatches: number;
  totalFees: number;
  totalPaid: number;
  totalDue: number;
  todayCollection: number;
  monthlyCollection?: number;
  pendingDocuments: number;
  attendanceSummary: {
    totalSessions: number;
    avgAttendancePercent: number;
    presentToday: number;
    absentToday: number;
  };
  monthlyRevenue?: { month: string; amount: number; target?: number }[];
  paidVsDueBreakdown?: { name: string; value: number; count: number }[];
  enrollmentByCourse?: { courseName: string; students: number }[];
  recentPayments: Payment[];
  recentAdmissions: Student[];
  dueStudents?: { student: Student; lastPaymentDate?: string; lastPaymentAmount?: number }[];
  recentActivities?: ActivityLog[];
}

export interface StudentPortalData {
  student: Student;
  payments: Payment[];
  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
    history: {
      date: string;
      batchName: string;
      status: AttendanceStatus;
      note?: string;
      markedAt: string;
    }[];
  };
  documents: StudentDocument[];
  classes?: ClassSchedule[];
  notices: Notice[];
}

export interface TeacherDashboardData {
  teacher: Teacher;
  stats: {
    assignedBatchesCount: number;
    totalStudents: number;
    todayAttendanceMarked: boolean;
  };
  assignedBatches: Batch[];
  assignedClasses?: ClassSchedule[];
  classes?: ClassSchedule[];
  recentAttendance: AttendanceSession[];
  notices: Notice[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  studentName?: string;
  studentId?: string;
  documentType?: string;
  uploadedAt?: string;
  status?: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}
