import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  User, Student, Teacher, Course, Batch, ClassSchedule, Payment, 
  StudentDocument, AttendanceSession, Notice, ActivityLog, SystemSettings 
} from '../src/types/index';

interface DatabaseSchema {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  batches: Batch[];
  classes: ClassSchedule[];
  payments: Payment[];
  documents: StudentDocument[];
  attendance: AttendanceSession[];
  notices: Notice[];
  activityLogs: ActivityLog[];
  settings: SystemSettings;
  credentials: Record<string, string>; // userId -> passwordHash
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let dbInstance: DatabaseSchema | null = null;

// Initial Seed Data
function getInitialSeedData(): DatabaseSchema {
  const defaultSalt = bcrypt.genSaltSync(10);
  const defaultAdminPass = bcrypt.hashSync('admin123', defaultSalt);

  const adminUserId = 'usr_admin_01';

  const courses: Course[] = [];
  const batches: Batch[] = [];
  const teachers: Teacher[] = [];
  const students: Student[] = [];
  const payments: Payment[] = [];
  const documents: StudentDocument[] = [];
  const attendance: AttendanceSession[] = [];
  const activityLogs: ActivityLog[] = [];
  const notices: Notice[] = [];
  const classes: ClassSchedule[] = [];

  const settings: SystemSettings = {
    instituteName: 'MR. JD GAMING COACHING CENTER',
    adminName: 'MR. JD GAMING',
    tagline: 'Excellence in Competitive Coaching & Academic Mastery',
    logoUrl: '',
    address: 'Plot 48, Knowledge Park II, Education District, Metro City - 400001',
    phone: '+91 (022) 2890-4500 / +91 98000 11223',
    email: 'admin@mrjdgaming.edu',
    currencySymbol: '₹',
    currencyCode: 'INR',
    receiptFooter: 'Thank you for choosing MR. JD GAMING COACHING CENTER. Fees once paid are non-refundable. For support contact +91 98000 11223.',
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSizeMb: 10,
    academicYear: '2026-2027',
  };

  const users: User[] = [
    {
      id: adminUserId,
      email: 'admin@coaching.edu',
      name: 'MR. JD GAMING',
      username: 'mrjdgaming',
      phone: '+91 98000 11223',
      role: 'admin',
      status: 'ACTIVE',
      avatarUrl: '',
      createdAt: '2026-01-01T00:00:00Z',
    }
  ];

  const credentials: Record<string, string> = {
    [adminUserId]: defaultAdminPass,
  };

  return {
    users,
    students,
    teachers,
    courses,
    batches,
    classes,
    payments,
    documents,
    attendance,
    notices,
    activityLogs,
    settings,
    credentials,
  };
}

export function loadDatabase(): DatabaseSchema {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_FILE)) {
    const seed = getInitialSeedData();
    saveDatabase(seed);
    dbInstance = seed;
    return dbInstance;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbInstance = JSON.parse(raw);
    
    // Ensure classes array exists
    if (!dbInstance!.classes || !Array.isArray(dbInstance!.classes)) {
      const seed = getInitialSeedData();
      dbInstance!.classes = seed.classes;
    }
    
    // Ensure Admin name and institute branding are up to date
    if (dbInstance!.settings) {
      if (!dbInstance!.settings.instituteName) {
        dbInstance!.settings.instituteName = 'MR. JD GAMING COACHING CENTER';
        dbInstance!.settings.adminName = 'MR. JD GAMING';
      }
    }
    const adminUser = dbInstance!.users.find(u => u.role?.toLowerCase() === 'admin');
    if (adminUser) {
      if (!adminUser.name || adminUser.name.includes('Vikram Malhotra')) {
        adminUser.name = 'MR. JD GAMING';
      }
      if (!adminUser.username) {
        adminUser.username = 'mrjdgaming';
      }
      if (!adminUser.phone) {
        adminUser.phone = '+91 98000 11223';
      }
    }

    return dbInstance!;
  } catch (err) {
    console.error('Error reading database file, fallback to seed:', err);
    const seed = getInitialSeedData();
    saveDatabase(seed);
    dbInstance = seed;
    return dbInstance;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  try {
    dbInstance = data;
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

// Helpers for automatic sequence IDs
export function generateNextStudentId(db: DatabaseSchema): string {
  const currentYear = new Date().getFullYear();
  const prefix = `STU-${currentYear}-`;
  let maxSeq = 0;
  for (const s of db.students) {
    if (s.studentId && s.studentId.startsWith(prefix)) {
      const numPart = parseInt(s.studentId.substring(prefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

export function generateNextPaymentId(db: DatabaseSchema): string {
  const currentYear = new Date().getFullYear();
  const prefix = `PAY-${currentYear}-`;
  let maxSeq = 0;
  for (const p of db.payments) {
    if (p.paymentId && p.paymentId.startsWith(prefix)) {
      const numPart = parseInt(p.paymentId.substring(prefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

export function generateNextTeacherId(db: DatabaseSchema): string {
  const currentYear = new Date().getFullYear();
  const prefix = `TCH-${currentYear}-`;
  let maxSeq = 0;
  for (const t of db.teachers) {
    if (t.teacherId && t.teacherId.startsWith(prefix)) {
      const numPart = parseInt(t.teacherId.substring(prefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
  return `${prefix}${nextSeq}`;
}

export function generateNextDocId(db: DatabaseSchema): string {
  const currentYear = new Date().getFullYear();
  const prefix = `DOC-${currentYear}-`;
  let maxSeq = 0;
  for (const d of db.documents) {
    if (d.documentId && d.documentId.startsWith(prefix)) {
      const numPart = parseInt(d.documentId.substring(prefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

// Log an activity
export function recordActivity(
  db: DatabaseSchema,
  user: { id: string; name: string; role: any },
  action: string,
  target: string,
  details?: any
) {
  const log: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: { id: user.id, name: user.name, role: user.role },
    action,
    target,
    timestamp: new Date().toISOString(),
    details,
  };
  db.activityLogs.unshift(log);
  // Keep last 1000 logs
  if (db.activityLogs.length > 1000) {
    db.activityLogs = db.activityLogs.slice(0, 1000);
  }
}

// Recalculate Student totalPaid and totalDue based on actual payments
export function recalculateStudentFinancials(db: DatabaseSchema, studentId: string): void {
  const student = db.students.find(s => s.id === studentId || s.studentId === studentId);
  if (!student) return;

  const totalPaid = db.payments
    .filter(p => p.studentId === student.id || p.studentId === student.studentId)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  student.totalPaid = totalPaid;
  student.totalDue = Math.max(0, student.totalFee - totalPaid);
  
  if (student.totalDue <= 0 && student.totalPaid >= student.totalFee) {
    student.paymentStatus = 'PAID';
  } else if (student.totalPaid > 0) {
    student.paymentStatus = 'PARTIAL';
  } else {
    student.paymentStatus = 'DUE';
  }
  student.lastUpdated = new Date().toISOString();
}
