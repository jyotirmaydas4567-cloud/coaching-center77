var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express2 = __toESM(require("express"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/routes.ts
var import_express = require("express");
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var DATA_DIR = import_path.default.resolve(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "database.json");
var UPLOADS_DIR = import_path.default.resolve(process.cwd(), "uploads");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
if (!import_fs.default.existsSync(UPLOADS_DIR)) {
  import_fs.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var dbInstance = null;
function getInitialSeedData() {
  const defaultSalt = import_bcryptjs.default.genSaltSync(10);
  const defaultAdminPass = import_bcryptjs.default.hashSync("admin123", defaultSalt);
  const adminUserId = "usr_admin_01";
  const courses = [];
  const batches = [];
  const teachers = [];
  const students = [];
  const payments = [];
  const documents = [];
  const attendance = [];
  const activityLogs = [];
  const notices = [];
  const classes = [];
  const settings = {
    instituteName: "MR. JD GAMING COACHING CENTER",
    adminName: "MR. JD GAMING",
    tagline: "Excellence in Competitive Coaching & Academic Mastery",
    logoUrl: "",
    address: "Plot 48, Knowledge Park II, Education District, Metro City - 400001",
    phone: "+91 (022) 2890-4500 / +91 98000 11223",
    email: "admin@mrjdgaming.edu",
    currencySymbol: "\u20B9",
    currencyCode: "INR",
    receiptFooter: "Thank you for choosing MR. JD GAMING COACHING CENTER. Fees once paid are non-refundable. For support contact +91 98000 11223.",
    allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxFileSizeMb: 10,
    academicYear: "2026-2027"
  };
  const users = [
    {
      id: adminUserId,
      email: "admin@coaching.edu",
      name: "MR. JD GAMING",
      username: "mrjdgaming",
      phone: "+91 98000 11223",
      role: "admin",
      status: "ACTIVE",
      avatarUrl: "",
      createdAt: "2026-01-01T00:00:00Z"
    }
  ];
  const credentials = {
    [adminUserId]: defaultAdminPass
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
    credentials
  };
}
function loadDatabase() {
  if (dbInstance) return dbInstance;
  if (!import_fs.default.existsSync(DB_FILE)) {
    const seed = getInitialSeedData();
    saveDatabase(seed);
    dbInstance = seed;
    return dbInstance;
  }
  try {
    const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
    dbInstance = JSON.parse(raw);
    if (!dbInstance.classes || !Array.isArray(dbInstance.classes)) {
      const seed = getInitialSeedData();
      dbInstance.classes = seed.classes;
    }
    if (dbInstance.settings) {
      if (!dbInstance.settings.instituteName) {
        dbInstance.settings.instituteName = "MR. JD GAMING COACHING CENTER";
        dbInstance.settings.adminName = "MR. JD GAMING";
      }
    }
    const adminUser = dbInstance.users.find((u) => u.role?.toLowerCase() === "admin");
    if (adminUser) {
      if (!adminUser.name || adminUser.name.includes("Vikram Malhotra")) {
        adminUser.name = "MR. JD GAMING";
      }
      if (!adminUser.username) {
        adminUser.username = "mrjdgaming";
      }
      if (!adminUser.phone) {
        adminUser.phone = "+91 98000 11223";
      }
    }
    return dbInstance;
  } catch (err) {
    console.error("Error reading database file, fallback to seed:", err);
    const seed = getInitialSeedData();
    saveDatabase(seed);
    dbInstance = seed;
    return dbInstance;
  }
}
function saveDatabase(data) {
  try {
    dbInstance = data;
    const tempFile = `${DB_FILE}.tmp`;
    import_fs.default.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    import_fs.default.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Failed to save database:", err);
  }
}
function generateNextStudentId(db) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
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
  const nextSeq = (maxSeq + 1).toString().padStart(4, "0");
  return `${prefix}${nextSeq}`;
}
function generateNextPaymentId(db) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
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
  const nextSeq = (maxSeq + 1).toString().padStart(4, "0");
  return `${prefix}${nextSeq}`;
}
function generateNextTeacherId(db) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
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
  const nextSeq = (maxSeq + 1).toString().padStart(3, "0");
  return `${prefix}${nextSeq}`;
}
function generateNextDocId(db) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
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
  const nextSeq = (maxSeq + 1).toString().padStart(4, "0");
  return `${prefix}${nextSeq}`;
}
function recordActivity(db, user, action, target, details) {
  const log = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: { id: user.id, name: user.name, role: user.role },
    action,
    target,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    details
  };
  db.activityLogs.unshift(log);
  if (db.activityLogs.length > 1e3) {
    db.activityLogs = db.activityLogs.slice(0, 1e3);
  }
}
function recalculateStudentFinancials(db, studentId) {
  const student = db.students.find((s) => s.id === studentId || s.studentId === studentId);
  if (!student) return;
  const totalPaid = db.payments.filter((p) => p.studentId === student.id || p.studentId === student.studentId).reduce((sum, p) => sum + Number(p.amount), 0);
  student.totalPaid = totalPaid;
  student.totalDue = Math.max(0, student.totalFee - totalPaid);
  if (student.totalDue <= 0 && student.totalPaid >= student.totalFee) {
    student.paymentStatus = "PAID";
  } else if (student.totalPaid > 0) {
    student.paymentStatus = "PARTIAL";
  } else {
    student.paymentStatus = "DUE";
  }
  student.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
}

// server/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "coaching_mgmt_secure_jwt_secret_key_2026";
function generateToken(user) {
  return import_jsonwebtoken.default.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      referenceId: user.referenceId
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. Please log in." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    const db = loadDatabase();
    const user = db.users.find((u) => u.id === decoded.id && u.status === "ACTIVE");
    if (!user) {
      res.status(401).json({ error: "Invalid session or user account is disabled." });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Session expired or invalid token." });
    return;
  }
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Access forbidden. Administrator privileges required." });
    return;
  }
  next();
}
function requireTeacherOrAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin" && req.user.role !== "teacher") {
    res.status(403).json({ error: "Access forbidden. Teacher or Administrator privileges required." });
    return;
  }
  next();
}
function isTeacherAssignedToBatch(teacherUserId, batchId) {
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === teacherUserId);
  if (!user || user.role !== "teacher" || !user.referenceId) return false;
  const teacher = db.teachers.find((t) => t.id === user.referenceId);
  if (!teacher) return false;
  return teacher.assignedBatchIds.includes(batchId);
}
function isTeacherAssignedToStudent(teacherUserId, studentId) {
  const db = loadDatabase();
  const student = db.students.find((s) => s.id === studentId || s.studentId === studentId);
  if (!student) return false;
  return isTeacherAssignedToBatch(teacherUserId, student.batchId);
}

// server/routes.ts
var router = (0, import_express.Router)();
var uploadsDir = import_path2.default.resolve(process.cwd(), "uploads");
if (!import_fs2.default.existsSync(uploadsDir)) {
  import_fs2.default.mkdirSync(uploadsDir, { recursive: true });
}
var storage = import_multer.default.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = import_path2.default.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});
var upload = (0, import_multer.default)({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10 MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed formats: PDF, JPG, PNG"));
    }
  }
});
var avatarStorage = import_multer.default.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = import_path2.default.extname(file.originalname).toLowerCase() || ".png";
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});
var avatarUpload = (0, import_multer.default)({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5 MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image type. Only JPG, JPEG, and PNG files are allowed."));
    }
  }
});
router.post("/auth/login", (req, res) => {
  const { email, username, identifier, password } = req.body;
  const loginInput = (email || username || identifier || "").trim();
  if (!loginInput || !password) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }
  const db = loadDatabase();
  const lowerInput = loginInput.toLowerCase();
  let user = db.users.find((u) => u.email.toLowerCase() === lowerInput);
  if (!user) {
    user = db.users.find((u) => u.username && u.username.toLowerCase() === lowerInput);
  }
  if (!user) {
    const student = db.students.find(
      (s) => s.studentId && s.studentId.toLowerCase() === lowerInput || s.id.toLowerCase() === lowerInput || s.mobileNumber === loginInput
    );
    if (student) {
      user = db.users.find((u) => u.id === student.userId || u.referenceId === student.id);
    }
  }
  if (!user) {
    const teacher = db.teachers.find(
      (t) => t.teacherId && t.teacherId.toLowerCase() === lowerInput || t.id.toLowerCase() === lowerInput || t.mobile && t.mobile === loginInput || t.phone && t.phone === loginInput
    );
    if (teacher) {
      user = db.users.find((u) => u.id === teacher.userId || u.referenceId === teacher.id);
    }
  }
  if (!user) {
    user = db.users.find((u) => u.name && u.name.toLowerCase() === lowerInput);
  }
  if (!user) {
    if (lowerInput === "admin" || lowerInput === "mrjdgaming" || lowerInput === "mr. jd gaming" || lowerInput === "mr.jd gaming") {
      user = db.users.find((u) => u.role === "admin" || u.role === "ADMIN");
    }
  }
  if (!user) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }
  if (user.status === "DISABLED") {
    res.status(403).json({ error: "Your account has been disabled. Please contact administration." });
    return;
  }
  const passwordHash = db.credentials[user.id];
  if (!passwordHash || !import_bcryptjs2.default.compareSync(password, passwordHash)) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }
  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username || (user.role === "admin" ? "mrjdgaming" : user.name.toLowerCase().replace(/\s+/g, "_")),
      phone: user.phone || "",
      role: user.role,
      referenceId: user.referenceId,
      avatarUrl: user.avatarUrl || "",
      status: user.status
    }
  });
});
router.post("/auth/forgot-password/verify", (req, res) => {
  const { identifier } = req.body;
  const searchInput = (identifier || "").trim();
  if (!searchInput) {
    res.status(400).json({ error: "Please enter your registered Username, Email, Student ID, or Teacher ID." });
    return;
  }
  const db = loadDatabase();
  const lowerInput = searchInput.toLowerCase();
  let user = db.users.find((u) => u.email.toLowerCase() === lowerInput);
  if (!user) {
    user = db.users.find((u) => u.username && u.username.toLowerCase() === lowerInput);
  }
  if (!user) {
    const student = db.students.find(
      (s) => s.studentId && s.studentId.toLowerCase() === lowerInput || s.id.toLowerCase() === lowerInput || s.mobileNumber === searchInput
    );
    if (student) {
      user = db.users.find((u) => u.id === student.userId || u.referenceId === student.id);
    }
  }
  if (!user) {
    const teacher = db.teachers.find(
      (t) => t.teacherId && t.teacherId.toLowerCase() === lowerInput || t.id.toLowerCase() === lowerInput || t.mobile && t.mobile === searchInput || t.phone && t.phone === searchInput
    );
    if (teacher) {
      user = db.users.find((u) => u.id === teacher.userId || u.referenceId === teacher.id);
    }
  }
  if (!user) {
    user = db.users.find((u) => u.name && u.name.toLowerCase() === lowerInput);
  }
  if (!user) {
    if (lowerInput === "admin" || lowerInput === "mrjdgaming" || lowerInput === "mr. jd gaming" || lowerInput === "mr.jd gaming") {
      user = db.users.find((u) => u.role === "admin" || u.role === "ADMIN");
    }
  }
  if (!user) {
    res.status(404).json({ error: "No account found matching this identifier. Please check and try again." });
    return;
  }
  if (user.status === "DISABLED") {
    res.status(403).json({ error: "Your account has been disabled. Please contact administration." });
    return;
  }
  const resetToken = import_jsonwebtoken2.default.sign(
    { userId: user.id, purpose: "pwd_reset" },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  let maskedEmail = user.email;
  const atIndex = user.email.indexOf("@");
  if (atIndex > 2) {
    maskedEmail = user.email.charAt(0) + "***" + user.email.slice(atIndex - 1);
  }
  res.json({
    success: true,
    resetToken,
    user: {
      name: user.name,
      role: user.role,
      maskedEmail
    }
  });
});
router.post("/auth/forgot-password/reset", (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken) {
    res.status(400).json({ error: "Reset session token is missing. Please verify your account again." });
    return;
  }
  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters long." });
    return;
  }
  let decoded;
  try {
    decoded = import_jsonwebtoken2.default.verify(resetToken, JWT_SECRET);
    if (decoded.purpose !== "pwd_reset") {
      res.status(400).json({ error: "Invalid reset token purpose." });
      return;
    }
  } catch (err) {
    res.status(400).json({ error: "Password reset session has expired. Please verify your account again." });
    return;
  }
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === decoded.userId);
  if (!user) {
    res.status(404).json({ error: "User account not found." });
    return;
  }
  const salt = import_bcryptjs2.default.genSaltSync(10);
  db.credentials[user.id] = import_bcryptjs2.default.hashSync(newPassword, salt);
  recordActivity(db, user, "PASSWORD_RESET_SELF", `Account password was reset via Forgot Password portal for ${user.name} (${user.role})`);
  saveDatabase(db);
  res.json({
    success: true,
    message: "Password has been reset successfully! You can now sign in with your new password."
  });
});
router.get("/auth/me", requireAuth, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  let extraData = {};
  if (user.role === "teacher" && user.referenceId) {
    const teacher = db.teachers.find((t) => t.id === user.referenceId);
    if (teacher) {
      extraData.teacher = teacher;
      extraData.assignedBatches = db.batches.filter((b) => teacher.assignedBatchIds.includes(b.id));
    }
  } else if (user.role === "student" && user.referenceId) {
    const student = db.students.find((s) => s.id === user.referenceId);
    if (student) {
      extraData.student = student;
    }
  }
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username || (user.role === "admin" ? "mrjdgaming" : user.name.toLowerCase().replace(/\s+/g, "_")),
      phone: user.phone || "",
      role: user.role,
      referenceId: user.referenceId,
      avatarUrl: user.avatarUrl || "",
      status: user.status
    },
    ...extraData
  });
});
router.put("/auth/profile", requireAuth, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  const { name, username, email, phone, avatarUrl, currentPassword, newPassword } = req.body;
  if (name && name.trim()) {
    user.name = name.trim();
    if (user.role === "admin" && db.settings) {
      db.settings.adminName = user.name;
    }
  }
  if (username && username.trim()) {
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    const existing = db.users.find((u) => u.id !== user.id && u.username?.toLowerCase() === cleanUsername);
    if (existing) {
      res.status(400).json({ error: "This username is already taken. Please choose another." });
      return;
    }
    user.username = cleanUsername;
  }
  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = db.users.find((u) => u.id !== user.id && u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      res.status(400).json({ error: "This email is already registered to another account." });
      return;
    }
    user.email = cleanEmail;
  }
  if (phone !== void 0) {
    user.phone = phone.trim();
  }
  if (avatarUrl !== void 0) {
    user.avatarUrl = avatarUrl;
  }
  if (newPassword) {
    if (newPassword.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters." });
      return;
    }
    if (currentPassword) {
      const currentHash = db.credentials[user.id];
      if (!currentHash || !import_bcryptjs2.default.compareSync(currentPassword, currentHash)) {
        res.status(400).json({ error: "Current password is incorrect." });
        return;
      }
    } else {
      res.status(400).json({ error: "Current password is required to set a new password." });
      return;
    }
    const salt = import_bcryptjs2.default.genSaltSync(10);
    db.credentials[user.id] = import_bcryptjs2.default.hashSync(newPassword, salt);
    recordActivity(db, req.user, "PASSWORD_CHANGED", `User ${user.name} changed their password.`);
  }
  recordActivity(db, req.user, "PROFILE_UPDATED", `User ${user.name} (${user.role}) updated their profile details.`);
  saveDatabase(db);
  res.json({
    message: "Profile updated successfully.",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username || "mrjdgaming",
      phone: user.phone || "",
      role: user.role,
      referenceId: user.referenceId,
      avatarUrl: user.avatarUrl || "",
      status: user.status
    }
  });
});
router.post("/auth/profile/photo", requireAuth, (req, res) => {
  avatarUpload.single("photo")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "Image size exceeds maximum limit of 5MB. Please choose a smaller photo." });
        return;
      }
      res.status(400).json({ error: err.message || "Failed to upload photo." });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No image file uploaded." });
      return;
    }
    const db = loadDatabase();
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    user.avatarUrl = photoUrl;
    recordActivity(db, req.user, "PROFILE_PHOTO_UPDATED", `User ${user.name} uploaded a new profile picture.`);
    saveDatabase(db);
    res.json({
      message: "Profile photo uploaded successfully.",
      avatarUrl: photoUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username || "mrjdgaming",
        phone: user.phone || "",
        role: user.role,
        referenceId: user.referenceId,
        avatarUrl: user.avatarUrl || "",
        status: user.status
      }
    });
  });
});
router.delete("/auth/profile/photo", requireAuth, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  user.avatarUrl = "";
  recordActivity(db, req.user, "PROFILE_PHOTO_REMOVED", `User ${user.name} removed their profile photo.`);
  saveDatabase(db);
  res.json({
    message: "Profile photo removed successfully.",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username || "mrjdgaming",
      phone: user.phone || "",
      role: user.role,
      referenceId: user.referenceId,
      avatarUrl: "",
      status: user.status
    }
  });
});
router.post("/auth/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current password and new password are required." });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  const db = loadDatabase();
  const currentHash = db.credentials[req.user.id];
  if (!currentHash || !import_bcryptjs2.default.compareSync(currentPassword, currentHash)) {
    res.status(400).json({ error: "Current password is incorrect." });
    return;
  }
  const salt = import_bcryptjs2.default.genSaltSync(10);
  db.credentials[req.user.id] = import_bcryptjs2.default.hashSync(newPassword, salt);
  saveDatabase(db);
  recordActivity(db, req.user, "PASSWORD_CHANGED", `User ${req.user.name} changed their password.`);
  saveDatabase(db);
  res.json({ message: "Password changed successfully." });
});
router.get("/admin/dashboard-stats", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const currentMonthStr = todayStr.substring(0, 7);
  const totalStudents = db.students.length;
  const activeStudents = db.students.filter((s) => s.studentStatus === "ACTIVE").length;
  const totalTeachers = db.teachers.length;
  const totalCourses = db.courses.length;
  const totalBatches = db.batches.length;
  const totalFees = db.students.reduce((sum, s) => sum + (Number(s.totalFee) || 0), 0);
  const totalPaid = db.students.reduce((sum, s) => sum + (Number(s.totalPaid) || 0), 0);
  const totalDue = db.students.reduce((sum, s) => sum + (Number(s.totalDue) || 0), 0);
  const todayPayments = db.payments.filter((p) => p.paymentDate === todayStr || p.createdAt.startsWith(todayStr));
  const todayCollection = todayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const monthPayments = db.payments.filter((p) => p.paymentDate.startsWith(currentMonthStr));
  const monthlyCollection = monthPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingDocuments = (db.documents || []).filter((d) => d.status === "Pending Review" || d.status === "Pending").length;
  let totalSessions = db.attendance.length;
  let totalPresents = 0;
  let totalRecords = 0;
  let presentToday = 0;
  let absentToday = 0;
  for (const session of db.attendance) {
    const isToday = session.date === todayStr;
    for (const rec of session.records) {
      totalRecords++;
      if (rec.status === "PRESENT" || rec.status === "LATE") totalPresents++;
      if (isToday) {
        if (rec.status === "PRESENT" || rec.status === "LATE") presentToday++;
        else absentToday++;
      }
    }
  }
  const avgAttendancePercent = totalRecords > 0 ? Math.round(totalPresents / totalRecords * 100) : 0;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = [];
  const currDate = /* @__PURE__ */ new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currDate.getFullYear(), currDate.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const mLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    const sum = db.payments.filter((p) => p.paymentDate.startsWith(mStr)).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    monthlyRevenue.push({
      month: mLabel,
      amount: sum,
      target: 5e4
    });
  }
  const paidCount = db.students.filter((s) => s.paymentStatus === "PAID").length;
  const partialCount = db.students.filter((s) => s.paymentStatus === "PARTIAL").length;
  const dueCount = db.students.filter((s) => s.paymentStatus === "DUE").length;
  const paidVsDueBreakdown = [
    { name: "Paid in Full", value: totalPaid, count: paidCount },
    { name: "Pending / Due", value: totalDue, count: partialCount + dueCount }
  ];
  const enrollmentByCourse = db.courses.map((course) => {
    const count = db.students.filter((s) => s.courseId === course.id && s.studentStatus === "ACTIVE").length;
    return {
      courseName: course.courseName.length > 20 ? course.courseName.substring(0, 18) + "..." : course.courseName,
      students: count
    };
  });
  const dueStudents = db.students.filter((s) => s.totalDue > 0 && s.studentStatus === "ACTIVE").sort((a, b) => b.totalDue - a.totalDue).slice(0, 6).map((student) => {
    const studentPayments = db.payments.filter((p) => p.studentId === student.id || p.studentId === student.studentId);
    const lastPayment = studentPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];
    return {
      student,
      lastPaymentDate: lastPayment ? lastPayment.paymentDate : "No payment yet",
      lastPaymentAmount: lastPayment ? lastPayment.amount : 0
    };
  });
  const recentPayments = [...db.payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const recentAdmissions = [...db.students].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).slice(0, 6);
  const recentActivities = [...db.activityLogs || []].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);
  const stats = {
    totalStudents,
    activeStudents,
    totalTeachers,
    totalCourses,
    totalBatches,
    totalFees,
    totalPaid,
    totalDue,
    todayCollection,
    monthlyCollection,
    pendingDocuments,
    attendanceSummary: {
      totalSessions,
      avgAttendancePercent,
      presentToday,
      absentToday
    },
    monthlyRevenue,
    paidVsDueBreakdown,
    enrollmentByCourse,
    dueStudents,
    recentPayments,
    recentAdmissions,
    recentActivities
  };
  res.json(stats);
});
router.get("/students", requireAuth, (req, res) => {
  const db = loadDatabase();
  const { search, courseId, batchId, status, paymentStatus, missingDocs } = req.query;
  let list = [];
  if (req.user.role === "admin") {
    list = [...db.students];
  } else if (req.user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    list = db.students.filter((s) => teacher.assignedBatchIds.includes(s.batchId));
  } else if (req.user.role === "student") {
    const student = db.students.find((s) => s.id === req.user.referenceId || s.userId === req.user.id);
    res.json(student ? [student] : []);
    return;
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.mobileNumber.includes(q) || s.email && s.email.toLowerCase().includes(q) || s.courseName && s.courseName.toLowerCase().includes(q) || s.batchName && s.batchName.toLowerCase().includes(q)
    );
  }
  if (courseId) {
    list = list.filter((s) => s.courseId === courseId);
  }
  if (batchId) {
    list = list.filter((s) => s.batchId === batchId);
  }
  if (status) {
    list = list.filter((s) => s.studentStatus === status);
  }
  if (paymentStatus) {
    list = list.filter((s) => s.paymentStatus === paymentStatus);
  }
  if (missingDocs === "true") {
    const studentsWithMissing = new Set(
      db.documents.filter((d) => d.status === "Missing" || d.status === "Pending").map((d) => d.studentId)
    );
    list = list.filter((s) => studentsWithMissing.has(s.id));
  }
  res.json(list);
});
router.get("/students/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const student = db.students.find((s) => s.id === id || s.studentId === id);
  if (!student) {
    res.status(404).json({ error: "Student not found." });
    return;
  }
  if (req.user.role === "student") {
    if (student.id !== req.user.referenceId && student.userId !== req.user.id) {
      res.status(403).json({ error: "Access denied. You can only view your own student record." });
      return;
    }
  } else if (req.user.role === "teacher") {
    if (!isTeacherAssignedToStudent(req.user.id, student.id)) {
      res.status(403).json({ error: "Access denied. This student is not in your assigned batches." });
      return;
    }
  }
  const payments = db.payments.filter((p) => p.studentId === student.id || p.studentId === student.studentId);
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  const attendanceHistory = [];
  for (const session of db.attendance) {
    const rec = session.records.find((r) => r.studentId === student.id);
    if (rec) {
      if (rec.status === "PRESENT") presentCount++;
      else if (rec.status === "ABSENT") absentCount++;
      else if (rec.status === "LATE") lateCount++;
      attendanceHistory.push({
        date: session.date,
        batchName: session.batchName,
        status: rec.status,
        note: rec.note,
        markedAt: session.markedAt
      });
    }
  }
  const totalClasses = presentCount + absentCount + lateCount;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount + lateCount) / totalClasses * 100) : 100;
  let documents = [];
  if (req.user.role === "admin") {
    documents = db.documents.filter((d) => d.studentId === student.id);
  } else if (req.user.role === "student") {
    documents = db.documents.filter((d) => d.studentId === student.id).map((d) => ({
      id: d.id,
      documentId: d.documentId,
      documentType: d.documentType,
      fileName: d.fileName,
      status: d.status,
      uploadedDate: d.uploadedDate
    }));
  } else {
    documents = [];
  }
  res.json({
    student,
    payments,
    attendance: {
      totalClasses,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      percentage: attendancePercentage,
      history: attendanceHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
    documents
  });
});
router.post("/students", requireAuth, requireAdmin, (req, res) => {
  const {
    fullName,
    fatherName,
    motherName,
    dob,
    gender,
    mobileNumber,
    email,
    address,
    photoUrl,
    courseId,
    batchId,
    admissionDate,
    courseDuration,
    guardianName,
    guardianMobile,
    relation,
    totalFee,
    initialPayment,
    createLoginAccount,
    password
  } = req.body;
  if (!fullName || !mobileNumber || !courseId || !batchId) {
    res.status(400).json({ error: "Full name, mobile number, course, and batch are required." });
    return;
  }
  const db = loadDatabase();
  const course = db.courses.find((c) => c.id === courseId);
  const batch = db.batches.find((b) => b.id === batchId);
  const newStudentId = generateNextStudentId(db);
  const internalId = `stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const feeAmount = Number(totalFee) || (course ? course.courseFee : 0);
  const paidAmount = Number(initialPayment) || 0;
  const dueAmount = Math.max(0, feeAmount - paidAmount);
  let paymentStatus = "DUE";
  if (dueAmount === 0 && paidAmount > 0) paymentStatus = "PAID";
  else if (paidAmount > 0) paymentStatus = "PARTIAL";
  let createdUserId = void 0;
  if (createLoginAccount && email) {
    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!existingUser) {
      createdUserId = `usr_stu_${Date.now()}`;
      const salt = import_bcryptjs2.default.genSaltSync(10);
      const userPass = password || "student123";
      const hash = import_bcryptjs2.default.hashSync(userPass, salt);
      const newUser = {
        id: createdUserId,
        email: email.trim(),
        name: fullName,
        role: "student",
        referenceId: internalId,
        status: "ACTIVE",
        avatarUrl: photoUrl || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.users.push(newUser);
      db.credentials[createdUserId] = hash;
    }
  }
  const newStudent = {
    id: internalId,
    studentId: newStudentId,
    fullName,
    fatherName: fatherName || "",
    motherName: motherName || "",
    dob: dob || "",
    gender: gender || "Male",
    mobileNumber,
    email: email || "",
    address: address || "",
    photoUrl: photoUrl || "",
    courseId,
    courseName: course ? course.courseName : "",
    batchId,
    batchName: batch ? batch.batchName : "",
    admissionDate: admissionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    courseDuration: courseDuration || (course ? course.duration : "6 Months"),
    studentStatus: "ACTIVE",
    guardianName: guardianName || "",
    guardianMobile: guardianMobile || "",
    relation: relation || "",
    totalFee: feeAmount,
    totalPaid: paidAmount,
    totalDue: dueAmount,
    paymentStatus,
    userId: createdUserId,
    createdDate: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.students.push(newStudent);
  if (paidAmount > 0) {
    const paymentId = generateNextPaymentId(db);
    const newPayment = {
      id: `pay_${Date.now()}`,
      paymentId,
      studentId: internalId,
      studentFormattedId: newStudentId,
      studentName: fullName,
      courseName: course ? course.courseName : "",
      batchName: batch ? batch.batchName : "",
      amount: paidAmount,
      paymentDate: admissionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      paymentMethod: req.body.paymentMethod || "Cash",
      transactionId: req.body.transactionId || `INIT-${Date.now().toString().slice(-6)}`,
      receivedBy: req.user.name,
      note: "Initial admission fee payment",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.payments.push(newPayment);
  }
  const defaultDocTypes = ["Student Photo", "ID Proof", "Educational Certificate"];
  for (const docType of defaultDocTypes) {
    const docId = generateNextDocId(db);
    db.documents.push({
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      documentId: docId,
      studentId: internalId,
      studentName: fullName,
      studentFormattedId: newStudentId,
      documentType: docType,
      fileName: "",
      fileUrl: "",
      uploadedBy: "",
      uploadedDate: "",
      status: "Missing"
    });
  }
  recordActivity(db, req.user, "STUDENT_CREATED", `New student admission: ${fullName} (${newStudentId})`, { fee: feeAmount, batch: batch?.batchName });
  saveDatabase(db);
  res.status(201).json(newStudent);
});
router.put("/students/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const student = db.students.find((s) => s.id === id || s.studentId === id);
  if (!student) {
    res.status(404).json({ error: "Student not found." });
    return;
  }
  const {
    fullName,
    fatherName,
    motherName,
    dob,
    gender,
    mobileNumber,
    email,
    address,
    photoUrl,
    courseId,
    batchId,
    admissionDate,
    courseDuration,
    studentStatus,
    guardianName,
    guardianMobile,
    relation,
    totalFee
  } = req.body;
  if (courseId && courseId !== student.courseId) {
    const c = db.courses.find((x) => x.id === courseId);
    if (c) {
      student.courseId = courseId;
      student.courseName = c.courseName;
    }
  }
  if (batchId && batchId !== student.batchId) {
    const b = db.batches.find((x) => x.id === batchId);
    if (b) {
      student.batchId = batchId;
      student.batchName = b.batchName;
    }
  }
  if (fullName) student.fullName = fullName;
  if (fatherName !== void 0) student.fatherName = fatherName;
  if (motherName !== void 0) student.motherName = motherName;
  if (dob !== void 0) student.dob = dob;
  if (gender) student.gender = gender;
  if (mobileNumber) student.mobileNumber = mobileNumber;
  if (email !== void 0) student.email = email;
  if (address !== void 0) student.address = address;
  if (photoUrl !== void 0) student.photoUrl = photoUrl;
  if (admissionDate) student.admissionDate = admissionDate;
  if (courseDuration) student.courseDuration = courseDuration;
  if (studentStatus) student.studentStatus = studentStatus;
  if (guardianName !== void 0) student.guardianName = guardianName;
  if (guardianMobile !== void 0) student.guardianMobile = guardianMobile;
  if (relation !== void 0) student.relation = relation;
  if (totalFee !== void 0) student.totalFee = Number(totalFee);
  recalculateStudentFinancials(db, student.id);
  student.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  recordActivity(db, req.user, "STUDENT_UPDATED", `Updated details for ${student.fullName} (${student.studentId})`);
  saveDatabase(db);
  res.json(student);
});
router.delete("/students/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const studentIndex = db.students.findIndex((s) => s.id === id || s.studentId === id);
  if (studentIndex === -1) {
    res.status(404).json({ error: "Student not found." });
    return;
  }
  const student = db.students[studentIndex];
  if (req.query.hardDelete === "true") {
    db.students.splice(studentIndex, 1);
    if (student.userId) {
      db.users = db.users.filter((u) => u.id !== student.userId);
      delete db.credentials[student.userId];
    }
    recordActivity(db, req.user, "STUDENT_DELETED", `Deleted student record: ${student.fullName} (${student.studentId})`);
  } else {
    student.studentStatus = "ARCHIVED";
    student.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    recordActivity(db, req.user, "STUDENT_ARCHIVED", `Archived student: ${student.fullName} (${student.studentId})`);
  }
  saveDatabase(db);
  res.json({ message: "Student successfully processed." });
});
router.post("/students/:id/reset-password", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  const db = loadDatabase();
  const student = db.students.find((s) => s.id === id || s.studentId === id);
  if (!student) {
    res.status(404).json({ error: "Student not found." });
    return;
  }
  const salt = import_bcryptjs2.default.genSaltSync(10);
  const hash = import_bcryptjs2.default.hashSync(newPassword, salt);
  if (!student.userId) {
    const newUserId = `usr_stu_${Date.now()}`;
    const newUser = {
      id: newUserId,
      email: student.email || `${student.studentId.toLowerCase()}@student.edu`,
      name: student.fullName,
      role: "student",
      referenceId: student.id,
      status: "ACTIVE",
      avatarUrl: student.photoUrl,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    student.userId = newUserId;
    db.users.push(newUser);
    db.credentials[newUserId] = hash;
  } else {
    db.credentials[student.userId] = hash;
  }
  recordActivity(db, req.user, "STUDENT_CREDENTIALS_RESET", `Reset login password for ${student.fullName} (${student.studentId})`);
  saveDatabase(db);
  res.json({ message: "Student password reset successfully." });
});
router.get("/payments", requireAuth, (req, res) => {
  const db = loadDatabase();
  const { studentId, batchId, startDate, endDate } = req.query;
  let list = [...db.payments];
  if (req.user.role === "student") {
    list = list.filter((p) => p.studentId === req.user.referenceId);
  } else if (req.user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    const studentIdsInTeacherBatches = new Set(
      db.students.filter((s) => teacher.assignedBatchIds.includes(s.batchId)).map((s) => s.id)
    );
    list = list.filter((p) => studentIdsInTeacherBatches.has(p.studentId));
  }
  if (studentId) {
    list = list.filter((p) => p.studentId === studentId || p.studentFormattedId === studentId);
  }
  if (startDate) {
    list = list.filter((p) => p.paymentDate >= String(startDate));
  }
  if (endDate) {
    list = list.filter((p) => p.paymentDate <= String(endDate));
  }
  list.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  res.json(list);
});
router.get("/payments/due", requireAuth, (req, res) => {
  const db = loadDatabase();
  const { courseId, batchId, search, sortBy } = req.query;
  let dueList = db.students.filter((s) => s.totalDue > 0 && s.studentStatus === "ACTIVE");
  if (req.user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    dueList = dueList.filter((s) => teacher.assignedBatchIds.includes(s.batchId));
  } else if (req.user.role === "student") {
    dueList = dueList.filter((s) => s.id === req.user.referenceId);
  }
  if (courseId) {
    dueList = dueList.filter((s) => s.courseId === courseId);
  }
  if (batchId) {
    dueList = dueList.filter((s) => s.batchId === batchId);
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    dueList = dueList.filter((s) => s.fullName.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
  }
  const enriched = dueList.map((student) => {
    const studentPayments = db.payments.filter((p) => p.studentId === student.id || p.studentId === student.studentId);
    const lastPayment = studentPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];
    return {
      student,
      lastPaymentDate: lastPayment ? lastPayment.paymentDate : "No payment yet",
      lastPaymentAmount: lastPayment ? lastPayment.amount : 0
    };
  });
  if (sortBy === "due-desc") {
    enriched.sort((a, b) => b.student.totalDue - a.student.totalDue);
  } else if (sortBy === "due-asc") {
    enriched.sort((a, b) => a.student.totalDue - b.student.totalDue);
  }
  res.json(enriched);
});
router.post("/payments", requireAuth, requireTeacherOrAdmin, (req, res) => {
  const { studentId, amount, paymentDate, paymentMethod, transactionId, note } = req.body;
  if (!studentId || !amount || Number(amount) <= 0) {
    res.status(400).json({ error: "Valid student ID and positive payment amount are required." });
    return;
  }
  const db = loadDatabase();
  const student = db.students.find((s) => s.id === studentId || s.studentId === studentId);
  if (!student) {
    res.status(404).json({ error: "Student not found." });
    return;
  }
  if (req.user.role === "teacher") {
    if (!isTeacherAssignedToStudent(req.user.id, student.id)) {
      res.status(403).json({ error: "Access denied. You cannot collect payments for students outside your assigned batches." });
      return;
    }
  }
  const numAmount = Number(amount);
  if (numAmount > student.totalDue && req.user.role !== "admin") {
    res.status(400).json({
      error: `Payment amount (${numAmount}) exceeds remaining due amount (${student.totalDue}). Contact Admin for extra credit adjustments.`
    });
    return;
  }
  const paymentId = generateNextPaymentId(db);
  const newPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    paymentId,
    studentId: student.id,
    studentFormattedId: student.studentId,
    studentName: student.fullName,
    courseName: student.courseName,
    batchName: student.batchName,
    amount: numAmount,
    paymentDate: paymentDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    paymentMethod: paymentMethod || "Cash",
    transactionId: transactionId || "",
    receivedBy: req.user.name,
    note: note || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.payments.push(newPayment);
  recalculateStudentFinancials(db, student.id);
  recordActivity(
    db,
    req.user,
    "PAYMENT_ADDED",
    `Collected payment ${paymentId} of \u20B9${numAmount} for ${student.fullName} (${student.studentId}) via ${paymentMethod}`,
    { paymentId, amount: numAmount, method: paymentMethod }
  );
  saveDatabase(db);
  res.status(201).json({ payment: newPayment, student });
});
router.put("/payments/:id", requireAuth, requireTeacherOrAdmin, (req, res) => {
  const { id } = req.params;
  const { studentId, amount, paymentDate, paymentMethod, transactionId, note } = req.body;
  const db = loadDatabase();
  const paymentIndex = db.payments.findIndex((p) => p.id === id || p.paymentId === id);
  if (paymentIndex === -1) {
    res.status(404).json({ error: "Payment record not found." });
    return;
  }
  const existingPayment = db.payments[paymentIndex];
  const originalStudentId = existingPayment.studentId;
  const targetStudentId = studentId || originalStudentId;
  const student = db.students.find((s) => s.id === targetStudentId || s.studentId === targetStudentId);
  if (!student) {
    res.status(404).json({ error: "Associated student record not found." });
    return;
  }
  if (req.user.role === "teacher") {
    if (!isTeacherAssignedToStudent(req.user.id, student.id)) {
      res.status(403).json({ error: "Access denied. You cannot manage payments for students outside your assigned batches." });
      return;
    }
  }
  if (amount !== void 0) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ error: "Payment amount must be a positive number." });
      return;
    }
    existingPayment.amount = numAmount;
  }
  if (studentId && studentId !== originalStudentId) {
    existingPayment.studentId = student.id;
    existingPayment.studentFormattedId = student.studentId;
    existingPayment.studentName = student.fullName;
    existingPayment.courseName = student.courseName;
    existingPayment.batchName = student.batchName;
  }
  if (paymentDate) existingPayment.paymentDate = paymentDate;
  if (paymentMethod) existingPayment.paymentMethod = paymentMethod;
  if (transactionId !== void 0) existingPayment.transactionId = transactionId;
  if (note !== void 0) existingPayment.note = note;
  recalculateStudentFinancials(db, student.id);
  if (originalStudentId && originalStudentId !== student.id) {
    recalculateStudentFinancials(db, originalStudentId);
  }
  recordActivity(
    db,
    req.user,
    "PAYMENT_UPDATED",
    `Updated payment ${existingPayment.paymentId} (\u20B9${existingPayment.amount}) for ${student.fullName} (${student.studentId})`,
    { paymentId: existingPayment.paymentId, amount: existingPayment.amount, method: existingPayment.paymentMethod }
  );
  saveDatabase(db);
  res.json({ payment: existingPayment, student });
});
router.delete("/payments/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const paymentIndex = db.payments.findIndex((p) => p.id === id || p.paymentId === id);
  if (paymentIndex === -1) {
    res.status(404).json({ error: "Payment record not found." });
    return;
  }
  const payment = db.payments[paymentIndex];
  const studentId = payment.studentId;
  db.payments.splice(paymentIndex, 1);
  if (studentId) {
    recalculateStudentFinancials(db, studentId);
  }
  recordActivity(
    db,
    req.user,
    "PAYMENT_DELETED",
    `Deleted payment record ${payment.paymentId} (\u20B9${payment.amount})`
  );
  saveDatabase(db);
  res.json({ message: "Payment record deleted successfully." });
});
router.get("/payments/:id/receipt", requireAuth, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const payment = db.payments.find((p) => p.id === id || p.paymentId === id);
  if (!payment) {
    res.status(404).json({ error: "Payment record not found." });
    return;
  }
  const student = db.students.find((s) => s.id === payment.studentId || s.studentId === payment.studentId);
  if (!student) {
    res.status(404).json({ error: "Associated student record not found." });
    return;
  }
  if (req.user.role === "student" && student.id !== req.user.referenceId && student.userId !== req.user.id) {
    res.status(403).json({ error: "Access denied. You can only view your own receipts." });
    return;
  }
  if (req.user.role === "teacher" && !isTeacherAssignedToStudent(req.user.id, student.id)) {
    res.status(403).json({ error: "Access denied. You can only view receipts for students in your assigned batches." });
    return;
  }
  const receipt = {
    institute: db.settings,
    payment,
    student: {
      studentId: student.studentId,
      fullName: student.fullName,
      courseName: student.courseName,
      batchName: student.batchName,
      mobileNumber: student.mobileNumber,
      totalFee: student.totalFee,
      totalPaid: student.totalPaid,
      totalDue: student.totalDue
    }
  };
  res.json(receipt);
});
router.get("/attendance", requireAuth, (req, res) => {
  const db = loadDatabase();
  const { batchId, date } = req.query;
  let list = [...db.attendance];
  if (req.user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    list = list.filter((a) => teacher.assignedBatchIds.includes(a.batchId));
  } else if (req.user.role === "student") {
    const studentId = req.user.referenceId;
    const studentSessions = list.map((session) => {
      const rec = session.records.find((r) => r.studentId === studentId);
      if (!rec) return null;
      return {
        id: session.id,
        date: session.date,
        batchName: session.batchName,
        courseName: session.courseName,
        status: rec.status,
        note: rec.note,
        markedByName: session.markedByName,
        markedAt: session.markedAt
      };
    }).filter(Boolean);
    res.json(studentSessions);
    return;
  }
  if (batchId) {
    list = list.filter((a) => a.batchId === batchId);
  }
  if (date) {
    list = list.filter((a) => a.date === date);
  }
  res.json(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
});
router.post("/attendance", requireAuth, requireTeacherOrAdmin, (req, res) => {
  const { batchId, date, records } = req.body;
  if (!batchId || !date || !Array.isArray(records)) {
    res.status(400).json({ error: "Batch ID, date, and attendance records array are required." });
    return;
  }
  const db = loadDatabase();
  const batch = db.batches.find((b) => b.id === batchId);
  if (!batch) {
    res.status(404).json({ error: "Batch not found." });
    return;
  }
  if (req.user.role === "teacher" && !isTeacherAssignedToBatch(req.user.id, batchId)) {
    res.status(403).json({ error: "Access denied. You can only mark attendance for your assigned batches." });
    return;
  }
  let session = db.attendance.find((a) => a.batchId === batchId && a.date === date);
  if (session) {
    session.records = records;
    session.markedBy = req.user.id;
    session.markedByName = req.user.name;
    session.markedAt = (/* @__PURE__ */ new Date()).toISOString();
  } else {
    session = {
      id: `att_${Date.now()}`,
      batchId,
      batchName: batch.batchName,
      courseName: batch.courseName,
      date,
      records,
      markedBy: req.user.id,
      markedByName: req.user.name,
      markedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.attendance.push(session);
  }
  recordActivity(
    db,
    req.user,
    "ATTENDANCE_MARKED",
    `Marked attendance for ${batch.batchName} on ${date} (${records.length} students)`,
    { batchId, date, totalMarked: records.length }
  );
  saveDatabase(db);
  res.json(session);
});
var REQUIRED_DOC_TYPES = ["Student Photo", "ID Proof", "Educational Certificate"];
router.get("/documents", requireAuth, (req, res) => {
  const db = loadDatabase();
  const { studentId, status } = req.query;
  if (req.user.role === "teacher") {
    res.status(403).json({ error: "Teachers are not authorized to view student compliance documents." });
    return;
  }
  if (req.user.role === "student") {
    let student = (db.students || []).find((s) => s.id === req.user.referenceId || s.userId === req.user.id);
    if (!student) {
      student = (db.students || []).find((s) => s.email?.toLowerCase() === req.user.email.toLowerCase());
    }
    if (!student) {
      res.status(404).json({ error: "Student record not found." });
      return;
    }
    const studentDocs = (db.documents || []).filter((d) => d.studentId === student.id);
    const result = [];
    for (const reqType of REQUIRED_DOC_TYPES) {
      const existing = studentDocs.find((d) => d.documentType === reqType);
      if (existing) {
        result.push(existing);
      } else {
        result.push({
          id: `missing_${student.id}_${reqType.replace(/\s+/g, "_").toLowerCase()}`,
          documentId: "\u2014",
          studentId: student.id,
          studentName: student.fullName,
          studentFormattedId: student.studentId,
          documentType: reqType,
          fileName: "",
          fileUrl: "",
          uploadedBy: "",
          uploadedDate: "",
          status: "Missing",
          notes: ""
        });
      }
    }
    for (const d of studentDocs) {
      if (!REQUIRED_DOC_TYPES.includes(d.documentType)) {
        result.push(d);
      }
    }
    res.json(result);
    return;
  }
  let allDocs = [];
  if (studentId) {
    const student = (db.students || []).find((s) => s.id === studentId || s.studentId === studentId);
    if (student) {
      const studentDocs = (db.documents || []).filter((d) => d.studentId === student.id);
      for (const reqType of REQUIRED_DOC_TYPES) {
        const existing = studentDocs.find((d) => d.documentType === reqType);
        if (existing) {
          allDocs.push(existing);
        } else {
          allDocs.push({
            id: `missing_${student.id}_${reqType.replace(/\s+/g, "_").toLowerCase()}`,
            documentId: "\u2014",
            studentId: student.id,
            studentName: student.fullName,
            studentFormattedId: student.studentId,
            documentType: reqType,
            fileName: "",
            fileUrl: "",
            uploadedBy: "",
            uploadedDate: "",
            status: "Missing",
            notes: ""
          });
        }
      }
      for (const d of studentDocs) {
        if (!REQUIRED_DOC_TYPES.includes(d.documentType)) {
          allDocs.push(d);
        }
      }
    }
  } else {
    for (const student of db.students || []) {
      const studentDocs = (db.documents || []).filter((d) => d.studentId === student.id);
      for (const reqType of REQUIRED_DOC_TYPES) {
        const existing = studentDocs.find((d) => d.documentType === reqType);
        if (existing) {
          allDocs.push(existing);
        } else {
          allDocs.push({
            id: `missing_${student.id}_${reqType.replace(/\s+/g, "_").toLowerCase()}`,
            documentId: "\u2014",
            studentId: student.id,
            studentName: student.fullName,
            studentFormattedId: student.studentId,
            documentType: reqType,
            fileName: "",
            fileUrl: "",
            uploadedBy: "",
            uploadedDate: "",
            status: "Missing",
            notes: ""
          });
        }
      }
      for (const d of studentDocs) {
        if (!REQUIRED_DOC_TYPES.includes(d.documentType)) {
          allDocs.push(d);
        }
      }
    }
  }
  if (status) {
    const filterStatus = String(status).toLowerCase();
    allDocs = allDocs.filter((d) => {
      const s = (d.status || "").toLowerCase();
      if (filterStatus === "pending" || filterStatus === "pending review") {
        return s === "pending review" || s === "pending";
      }
      if (filterStatus === "approved" || filterStatus === "submitted") {
        return s === "approved" || s === "submitted";
      }
      if (filterStatus === "rejected") {
        return s === "rejected";
      }
      if (filterStatus === "missing") {
        return s === "missing";
      }
      return s === filterStatus;
    });
  }
  res.json(allDocs);
});
router.post("/documents/upload", requireAuth, upload.single("file"), (req, res) => {
  if (req.user.role === "teacher") {
    res.status(403).json({ error: "Teachers are not authorized to upload student compliance documents." });
    return;
  }
  const { studentId, documentType, notes, status } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Please select a document file to upload (JPG, PNG, or PDF up to 10MB)." });
    return;
  }
  const db = loadDatabase();
  let targetStudentId = studentId;
  if (req.user.role === "student") {
    const student2 = (db.students || []).find((s) => s.id === req.user.referenceId || s.userId === req.user.id);
    if (!student2) {
      res.status(404).json({ error: "Student profile not found." });
      return;
    }
    targetStudentId = student2.id;
  }
  if (!targetStudentId || !documentType) {
    res.status(400).json({ error: "Student ID and document type are required." });
    return;
  }
  const student = (db.students || []).find((s) => s.id === targetStudentId || s.studentId === targetStudentId);
  if (!student) {
    res.status(404).json({ error: "Target student not found." });
    return;
  }
  const docStatus = req.user.role === "student" ? "Pending Review" : status || "Pending Review";
  const docId = generateNextDocId(db);
  if (!db.documents) db.documents = [];
  const existingIdx = db.documents.findIndex((d) => d.studentId === student.id && d.documentType === documentType);
  let doc;
  if (existingIdx !== -1) {
    doc = db.documents[existingIdx];
    doc.fileName = file.originalname;
    doc.fileUrl = `/api/documents/download/${file.filename}`;
    doc.fileSize = file.size;
    doc.mimeType = file.mimetype;
    doc.uploadedBy = req.user.name;
    doc.uploadedDate = (/* @__PURE__ */ new Date()).toISOString();
    doc.uploadedAt = (/* @__PURE__ */ new Date()).toISOString();
    doc.status = docStatus;
    doc.notes = notes ? String(notes).trim() : "";
    delete doc.reviewedBy;
    delete doc.reviewedAt;
  } else {
    doc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      documentId: docId,
      studentId: student.id,
      studentName: student.fullName,
      studentFormattedId: student.studentId,
      documentType,
      fileName: file.originalname,
      fileUrl: `/api/documents/download/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: req.user.name,
      uploadedDate: (/* @__PURE__ */ new Date()).toISOString(),
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: docStatus,
      notes: notes ? String(notes).trim() : ""
    };
    db.documents.push(doc);
  }
  recordActivity(
    db,
    req.user,
    "DOCUMENT_UPLOADED",
    `Uploaded ${documentType} for ${student.fullName} (${student.studentId}) - Status: ${docStatus}`
  );
  if (req.user.role === "student" || docStatus === "Pending Review") {
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: "Document Pending Approval",
      message: `${student.fullName} has uploaded a ${documentType} and it is waiting for your review.`,
      studentName: student.fullName,
      studentId: student.studentId,
      documentType,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Pending Review",
      targetUrl: "/admin/documents?status=Pending Review",
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  saveDatabase(db);
  res.status(201).json(doc);
});
router.patch("/documents/:id/status", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = loadDatabase();
  if (!db.documents) db.documents = [];
  let doc = db.documents.find((d) => d.id === id || d.documentId === id);
  if (!doc && id.startsWith("missing_")) {
    const parts = id.split("_");
    const studentId = parts[1];
    const docTypeSlug = parts.slice(2).join("_");
    const student = (db.students || []).find((s) => s.id === studentId);
    if (!student) {
      res.status(404).json({ error: "Student not found." });
      return;
    }
    const matchingType = REQUIRED_DOC_TYPES.find((t) => t.replace(/\s+/g, "_").toLowerCase() === docTypeSlug) || "ID Proof";
    if (status === "Approved") {
      res.status(400).json({ error: "Cannot approve a document that has not been uploaded yet." });
      return;
    }
    doc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      documentId: generateNextDocId(db),
      studentId: student.id,
      studentName: student.fullName,
      studentFormattedId: student.studentId,
      documentType: matchingType,
      fileName: "",
      fileUrl: "",
      status: status || "Missing",
      notes: notes || "",
      uploadedBy: "",
      uploadedDate: ""
    };
    db.documents.push(doc);
  }
  if (!doc) {
    res.status(404).json({ error: "Document record not found." });
    return;
  }
  if (status === "Approved" && (!doc.fileUrl || !doc.fileName)) {
    res.status(400).json({ error: "Cannot approve a document without an uploaded file." });
    return;
  }
  if (status === "Rejected" && (!notes || !notes.trim())) {
    res.status(400).json({ error: "Please provide a reason or audit note for rejecting this document." });
    return;
  }
  if (status) doc.status = status;
  if (notes !== void 0) doc.notes = notes.trim();
  doc.reviewedBy = req.user.name;
  doc.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (db.notifications) {
    db.notifications.forEach((n) => {
      if ((n.studentId === doc.studentFormattedId || n.studentId === doc.studentId) && (!n.documentType || n.documentType === doc.documentType)) {
        n.isRead = true;
      }
    });
  }
  recordActivity(
    db,
    req.user,
    "DOCUMENT_STATUS_UPDATED",
    `Updated status to ${status} for ${doc.documentType} of ${doc.studentName || doc.studentId}`
  );
  saveDatabase(db);
  res.json(doc);
});
router.post("/documents/:id/approve", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const db = loadDatabase();
  const doc = (db.documents || []).find((d) => d.id === id || d.documentId === id);
  if (!doc) {
    res.status(404).json({ error: "Document record not found." });
    return;
  }
  if (!doc.fileUrl || !doc.fileName) {
    res.status(400).json({ error: "Cannot approve a document without an uploaded file." });
    return;
  }
  doc.status = "Approved";
  doc.notes = notes ? notes.trim() : doc.notes || "Approved by Administration";
  doc.reviewedBy = req.user.name;
  doc.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (db.notifications) {
    db.notifications.forEach((n) => {
      if ((n.studentId === doc.studentFormattedId || n.studentId === doc.studentId) && (!n.documentType || n.documentType === doc.documentType)) {
        n.isRead = true;
      }
    });
  }
  recordActivity(db, req.user, "DOCUMENT_APPROVED", `Approved ${doc.documentType} for ${doc.studentName || doc.studentId}`);
  saveDatabase(db);
  res.json(doc);
});
router.post("/documents/:id/reject", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { reason, notes } = req.body;
  const rejectionReason = (reason || notes || "").trim();
  if (!rejectionReason) {
    res.status(400).json({ error: "Please provide a reason for rejecting this document." });
    return;
  }
  const db = loadDatabase();
  const doc = (db.documents || []).find((d) => d.id === id || d.documentId === id);
  if (!doc) {
    res.status(404).json({ error: "Document record not found." });
    return;
  }
  doc.status = "Rejected";
  doc.notes = rejectionReason;
  doc.reviewedBy = req.user.name;
  doc.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (db.notifications) {
    db.notifications.forEach((n) => {
      if ((n.studentId === doc.studentFormattedId || n.studentId === doc.studentId) && (!n.documentType || n.documentType === doc.documentType)) {
        n.isRead = true;
      }
    });
  }
  recordActivity(db, req.user, "DOCUMENT_REJECTED", `Rejected ${doc.documentType} for ${doc.studentName || doc.studentId}: ${rejectionReason}`);
  saveDatabase(db);
  res.json(doc);
});
router.get("/notifications", requireAuth, requireAdmin, (_req, res) => {
  const db = loadDatabase();
  const notifications = (db.notifications || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  res.json({ notifications, unreadCount });
});
router.patch("/notifications/:id/read", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  if (!db.notifications) db.notifications = [];
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    saveDatabase(db);
  }
  res.json({ success: true, notification: notif });
});
router.post("/notifications/mark-all-read", requireAuth, requireAdmin, (_req, res) => {
  const db = loadDatabase();
  if (db.notifications) {
    db.notifications.forEach((n) => {
      n.isRead = true;
    });
    saveDatabase(db);
  }
  res.json({ success: true, message: "All notifications marked as read" });
});
router.get("/documents/download/:filename", requireAuth, (req, res) => {
  const { filename } = req.params;
  const db = loadDatabase();
  const doc = (db.documents || []).find((d) => d.fileUrl && d.fileUrl.endsWith(filename));
  if (!doc) {
    res.status(404).json({ error: "Document not found." });
    return;
  }
  if (req.user.role === "teacher") {
    res.status(403).json({ error: "Access forbidden." });
    return;
  }
  if (req.user.role === "student" && doc.studentId !== req.user.referenceId) {
    const student = (db.students || []).find((s) => s.userId === req.user.id);
    if (!student || student.id !== doc.studentId) {
      res.status(403).json({ error: "Access forbidden. You do not own this document." });
      return;
    }
  }
  const filePath = import_path2.default.join(uploadsDir, filename);
  if (!import_fs2.default.existsSync(filePath)) {
    res.status(404).json({ error: "Physical file not found on server." });
    return;
  }
  res.sendFile(filePath);
});
router.get("/courses", requireAuth, (_req, res) => {
  const db = loadDatabase();
  const normalized = (db.courses || []).map((c) => ({
    ...c,
    name: c.courseName || c.name || "",
    courseName: c.courseName || c.name || "",
    code: c.courseId || c.code || "",
    courseId: c.courseId || c.code || "",
    fee: c.courseFee ?? c.fee ?? 0,
    courseFee: c.courseFee ?? c.fee ?? 0
  }));
  res.json(normalized);
});
router.post("/courses", requireAuth, requireAdmin, (req, res) => {
  const courseName = req.body.courseName || req.body.name;
  const courseFee = req.body.courseFee !== void 0 ? req.body.courseFee : req.body.fee;
  const description = req.body.description || "";
  const duration = req.body.duration || "6 Months";
  const status = req.body.status || "ACTIVE";
  if (!courseName || courseFee === void 0) {
    res.status(400).json({ error: "Course name and fee are required." });
    return;
  }
  const db = loadDatabase();
  const nextNum = (db.courses || []).length + 101;
  const courseCode = req.body.courseId || req.body.code || `CRS-${nextNum}`;
  const newCourse = {
    id: `crs_${Date.now()}`,
    courseId: courseCode,
    code: courseCode,
    courseName,
    name: courseName,
    description,
    duration,
    courseFee: Number(courseFee),
    fee: Number(courseFee),
    status,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!db.courses) db.courses = [];
  db.courses.push(newCourse);
  recordActivity(db, req.user, "COURSE_CREATED", `Created course: ${courseName} (${newCourse.courseId})`);
  saveDatabase(db);
  res.status(201).json(newCourse);
});
router.put("/courses/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const course = (db.courses || []).find((c) => c.id === id || c.courseId === id || c.code === id);
  if (!course) {
    res.status(404).json({ error: "Course not found." });
    return;
  }
  const courseName = req.body.courseName || req.body.name;
  const courseFee = req.body.courseFee !== void 0 ? req.body.courseFee : req.body.fee;
  const courseCode = req.body.courseId || req.body.code;
  const { description, duration, status } = req.body;
  if (courseName) {
    course.courseName = courseName;
    course.name = courseName;
  }
  if (courseCode) {
    course.courseId = courseCode;
    course.code = courseCode;
  }
  if (courseFee !== void 0) {
    course.courseFee = Number(courseFee);
    course.fee = Number(courseFee);
  }
  if (description !== void 0) course.description = description;
  if (duration) course.duration = duration;
  if (status) course.status = status;
  recordActivity(db, req.user, "COURSE_UPDATED", `Updated course: ${course.courseName}`);
  saveDatabase(db);
  res.json(course);
});
router.get("/batches", requireAuth, (req, res) => {
  const db = loadDatabase();
  let batches = [...db.batches || []];
  const enriched = batches.map((batch) => {
    const studentCount = (db.students || []).filter((s) => s.batchId === batch.id && s.studentStatus === "ACTIVE").length;
    return {
      ...batch,
      name: batch.batchName || batch.name || "",
      batchName: batch.batchName || batch.name || "",
      room: batch.room || batch.roomNumber || "Room 1",
      roomNumber: batch.room || batch.roomNumber || "Room 1",
      teacherId: batch.assignedTeacherId || batch.teacherId || "",
      assignedTeacherId: batch.assignedTeacherId || batch.teacherId || "",
      studentCount
    };
  });
  if (req.user.role === "teacher") {
    const teacher = (db.teachers || []).find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    res.json(enriched.filter((b) => (teacher.assignedBatchIds || []).includes(b.id)));
    return;
  }
  res.json(enriched);
});
router.post("/batches", requireAuth, requireAdmin, (req, res) => {
  const batchName = req.body.batchName || req.body.name;
  const courseId = req.body.courseId;
  const assignedTeacherId = req.body.assignedTeacherId || req.body.teacherId || "";
  const startDate = req.body.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const endDate = req.body.endDate || "";
  const classTime = req.body.classTime || "10:00 AM - 12:00 PM";
  const room = req.body.room || req.body.roomNumber || "Room 1";
  const maxCapacity = Number(req.body.maxCapacity) || 30;
  const status = req.body.status || "ACTIVE";
  if (!batchName || !courseId) {
    res.status(400).json({ error: "Batch name and course are required." });
    return;
  }
  const db = loadDatabase();
  const course = (db.courses || []).find((c) => c.id === courseId);
  const teacher = assignedTeacherId ? (db.teachers || []).find((t) => t.id === assignedTeacherId) : null;
  const batchInternalId = `bat_${Date.now()}`;
  const batchCode = `BAT-${(/* @__PURE__ */ new Date()).getFullYear()}-${batchName.substring(0, 3).toUpperCase()}${(db.batches || []).length + 1}`;
  const newBatch = {
    id: batchInternalId,
    batchId: batchCode,
    batchName,
    name: batchName,
    courseId,
    courseName: course ? course.courseName || course.name : "",
    assignedTeacherId,
    teacherId: assignedTeacherId,
    teacherName: teacher ? teacher.name || teacher.fullName : "",
    startDate,
    endDate,
    classTime,
    room,
    roomNumber: room,
    maxCapacity,
    status,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!db.batches) db.batches = [];
  db.batches.push(newBatch);
  if (teacher && !teacher.assignedBatchIds.includes(batchInternalId)) {
    teacher.assignedBatchIds.push(batchInternalId);
  }
  recordActivity(db, req.user, "BATCH_CREATED", `Created batch: ${batchName} (${batchCode})`);
  saveDatabase(db);
  res.status(201).json(newBatch);
});
router.put("/batches/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const batch = (db.batches || []).find((b) => b.id === id || b.batchId === id);
  if (!batch) {
    res.status(404).json({ error: "Batch not found." });
    return;
  }
  const batchName = req.body.batchName || req.body.name;
  const courseId = req.body.courseId;
  const assignedTeacherId = req.body.assignedTeacherId !== void 0 ? req.body.assignedTeacherId : req.body.teacherId;
  const { startDate, endDate, classTime, status } = req.body;
  const room = req.body.room || req.body.roomNumber;
  const maxCapacity = req.body.maxCapacity !== void 0 ? Number(req.body.maxCapacity) : void 0;
  if (courseId && courseId !== batch.courseId) {
    const c = (db.courses || []).find((x) => x.id === courseId);
    if (c) {
      batch.courseId = courseId;
      batch.courseName = c.courseName || c.name;
    }
  }
  if (assignedTeacherId !== void 0) {
    batch.assignedTeacherId = assignedTeacherId;
    batch.teacherId = assignedTeacherId;
    const t = (db.teachers || []).find((x) => x.id === assignedTeacherId);
    batch.teacherName = t ? t.name || t.fullName : "";
    for (const teacher of db.teachers || []) {
      if (teacher.id === assignedTeacherId) {
        if (!teacher.assignedBatchIds.includes(batch.id)) teacher.assignedBatchIds.push(batch.id);
      } else {
        teacher.assignedBatchIds = (teacher.assignedBatchIds || []).filter((bId) => bId !== batch.id);
      }
    }
  }
  if (batchName) {
    batch.batchName = batchName;
    batch.name = batchName;
  }
  if (startDate) batch.startDate = startDate;
  if (endDate !== void 0) batch.endDate = endDate;
  if (classTime) batch.classTime = classTime;
  if (room) {
    batch.room = room;
    batch.roomNumber = room;
  }
  if (maxCapacity !== void 0) batch.maxCapacity = maxCapacity;
  if (status) batch.status = status;
  recordActivity(db, req.user, "BATCH_UPDATED", `Updated batch: ${batch.batchName}`);
  saveDatabase(db);
  res.json(batch);
});
router.get("/classes", requireAuth, (req, res) => {
  const db = loadDatabase();
  const classesList = db.classes || [];
  if (req.user.role === "admin") {
    res.json(classesList);
    return;
  }
  if (req.user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === req.user.referenceId);
    if (!teacher) {
      res.json([]);
      return;
    }
    const filtered = classesList.filter(
      (c) => c.teacherId === teacher.id || teacher.assignedBatchIds.includes(c.batchId)
    );
    res.json(filtered);
    return;
  }
  if (req.user.role === "student") {
    const student = db.students.find((s) => s.id === req.user.referenceId || s.userId === req.user.id);
    if (!student) {
      res.json([]);
      return;
    }
    const filtered = classesList.filter((c) => c.batchId === student.batchId);
    res.json(filtered);
    return;
  }
  res.json(classesList);
});
router.post("/classes", requireAuth, requireAdmin, (req, res) => {
  const { className, courseId, batchId, teacherId, dayOfWeek, date, startTime, endTime, room, meetingLink, notes, status } = req.body;
  if (!className || !courseId || !batchId) {
    res.status(400).json({ error: "Class title, course, and batch are required." });
    return;
  }
  const db = loadDatabase();
  const course = db.courses.find((c) => c.id === courseId);
  const batch = db.batches.find((b) => b.id === batchId);
  const teacher = teacherId ? db.teachers.find((t) => t.id === teacherId) : null;
  const newClass = {
    id: `cls_${Date.now()}`,
    className,
    courseId,
    courseName: course ? course.courseName : "",
    batchId,
    batchName: batch ? batch.batchName : "",
    teacherId: teacher ? teacher.id : batch ? batch.assignedTeacherId : "",
    teacherName: teacher ? teacher.name : batch ? batch.teacherName : "",
    dayOfWeek: dayOfWeek || "Monday, Wednesday, Friday",
    date: date || "",
    startTime: startTime || "10:00 AM",
    endTime: endTime || "12:00 PM",
    room: room || (batch ? batch.room || "Room 1" : "Room 1"),
    meetingLink: meetingLink || "",
    notes: notes || "",
    status: status || "SCHEDULED",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!db.classes) db.classes = [];
  db.classes.unshift(newClass);
  recordActivity(db, req.user, "CLASS_SCHEDULED", `Scheduled class: "${className}" for ${newClass.batchName}`);
  saveDatabase(db);
  res.status(201).json(newClass);
});
router.put("/classes/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  if (!db.classes) db.classes = [];
  const classItem = db.classes.find((c) => c.id === id);
  if (!classItem) {
    res.status(404).json({ error: "Class schedule not found." });
    return;
  }
  const { className, courseId, batchId, teacherId, dayOfWeek, date, startTime, endTime, room, meetingLink, notes, status } = req.body;
  if (className) classItem.className = className;
  if (courseId) {
    classItem.courseId = courseId;
    const c = db.courses.find((x) => x.id === courseId);
    if (c) classItem.courseName = c.courseName;
  }
  if (batchId) {
    classItem.batchId = batchId;
    const b = db.batches.find((x) => x.id === batchId);
    if (b) classItem.batchName = b.batchName;
  }
  if (teacherId !== void 0) {
    classItem.teacherId = teacherId;
    const t = db.teachers.find((x) => x.id === teacherId);
    classItem.teacherName = t ? t.name : "";
  }
  if (dayOfWeek !== void 0) classItem.dayOfWeek = dayOfWeek;
  if (date !== void 0) classItem.date = date;
  if (startTime !== void 0) classItem.startTime = startTime;
  if (endTime !== void 0) classItem.endTime = endTime;
  if (room !== void 0) classItem.room = room;
  if (meetingLink !== void 0) classItem.meetingLink = meetingLink;
  if (notes !== void 0) classItem.notes = notes;
  if (status !== void 0) classItem.status = status;
  recordActivity(db, req.user, "CLASS_UPDATED", `Updated class schedule: "${classItem.className}"`);
  saveDatabase(db);
  res.json(classItem);
});
router.delete("/classes/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  if (!db.classes) db.classes = [];
  const index = db.classes.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Class schedule not found." });
    return;
  }
  const classItem = db.classes[index];
  db.classes.splice(index, 1);
  recordActivity(db, req.user, "CLASS_DELETED", `Deleted class schedule: "${classItem.className}"`);
  saveDatabase(db);
  res.json({ message: "Class schedule deleted successfully." });
});
router.get("/teachers", requireAuth, requireAdmin, (_req, res) => {
  const db = loadDatabase();
  const enriched = (db.teachers || []).map((teacher) => {
    const assignedBatches = (db.batches || []).filter((b) => (teacher.assignedBatchIds || []).includes(b.id));
    return {
      ...teacher,
      name: teacher.name || teacher.fullName || "",
      fullName: teacher.fullName || teacher.name || "",
      mobile: teacher.mobile || teacher.phone || "",
      phone: teacher.phone || teacher.mobile || "",
      subject: teacher.subject || teacher.specialization || "",
      specialization: teacher.specialization || teacher.subject || "",
      assignedBatches: assignedBatches.map((b) => ({ id: b.id, name: b.batchName || b.name || "" }))
    };
  });
  res.json(enriched);
});
router.post("/teachers", requireAuth, requireAdmin, (req, res) => {
  const name = req.body.name || req.body.fullName;
  const email = req.body.email;
  const mobile = req.body.mobile || req.body.phone;
  const { assignedBatchIds, photoUrl, qualification, password } = req.body;
  const specialization = req.body.specialization || req.body.subject || "";
  const salary = req.body.salary !== void 0 ? Number(req.body.salary) : void 0;
  if (!name || !email || !mobile) {
    res.status(400).json({ error: "Name, email, and mobile are required." });
    return;
  }
  const db = loadDatabase();
  const existingUser = (db.users || []).find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: "A user with this email address already exists." });
    return;
  }
  const teacherInternalId = `tch_${Date.now()}`;
  const teacherCode = generateNextTeacherId(db);
  const teacherUserId = `usr_tch_${Date.now()}`;
  const salt = import_bcryptjs2.default.genSaltSync(10);
  const teacherPass = password || "teacher123";
  const hash = import_bcryptjs2.default.hashSync(teacherPass, salt);
  const newUser = {
    id: teacherUserId,
    email: email.trim(),
    name,
    role: "teacher",
    referenceId: teacherInternalId,
    status: "ACTIVE",
    avatarUrl: photoUrl || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const newTeacher = {
    id: teacherInternalId,
    teacherId: teacherCode,
    name,
    fullName: name,
    photoUrl: photoUrl || "",
    mobile,
    phone: mobile,
    email: email.trim(),
    assignedBatchIds: Array.isArray(assignedBatchIds) ? assignedBatchIds : [],
    status: "ACTIVE",
    userId: teacherUserId,
    qualification: qualification || "",
    specialization,
    subject: specialization,
    salary,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!db.users) db.users = [];
  db.users.push(newUser);
  if (!db.credentials) db.credentials = {};
  db.credentials[teacherUserId] = hash;
  if (!db.teachers) db.teachers = [];
  db.teachers.push(newTeacher);
  if (Array.isArray(assignedBatchIds)) {
    for (const batchId of assignedBatchIds) {
      const b = (db.batches || []).find((x) => x.id === batchId);
      if (b) {
        b.assignedTeacherId = teacherInternalId;
        b.teacherId = teacherInternalId;
        b.teacherName = name;
      }
    }
  }
  recordActivity(db, req.user, "TEACHER_CREATED", `Created teacher profile: ${name} (${teacherCode})`);
  saveDatabase(db);
  res.status(201).json(newTeacher);
});
router.put("/teachers/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const teacher = (db.teachers || []).find((t) => t.id === id || t.teacherId === id);
  if (!teacher) {
    res.status(404).json({ error: "Teacher not found." });
    return;
  }
  const name = req.body.name || req.body.fullName;
  const mobile = req.body.mobile || req.body.phone;
  const email = req.body.email;
  const { assignedBatchIds, photoUrl, qualification, status } = req.body;
  const specialization = req.body.specialization || req.body.subject;
  const salary = req.body.salary !== void 0 ? Number(req.body.salary) : void 0;
  if (name) {
    teacher.name = name;
    teacher.fullName = name;
  }
  if (mobile) {
    teacher.mobile = mobile;
    teacher.phone = mobile;
  }
  if (email) teacher.email = email;
  if (photoUrl !== void 0) teacher.photoUrl = photoUrl;
  if (qualification !== void 0) teacher.qualification = qualification;
  if (specialization !== void 0) {
    teacher.specialization = specialization;
    teacher.subject = specialization;
  }
  if (salary !== void 0) teacher.salary = salary;
  if (status) teacher.status = status;
  if (Array.isArray(assignedBatchIds)) {
    teacher.assignedBatchIds = assignedBatchIds;
    for (const b of db.batches || []) {
      if (assignedBatchIds.includes(b.id)) {
        b.assignedTeacherId = teacher.id;
        b.teacherId = teacher.id;
        b.teacherName = teacher.name;
      } else if (b.assignedTeacherId === teacher.id || b.teacherId === teacher.id) {
        b.assignedTeacherId = "";
        b.teacherId = "";
        b.teacherName = "";
      }
    }
  }
  if (teacher.userId) {
    const user = (db.users || []).find((u) => u.id === teacher.userId);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (status) user.status = status;
    }
  }
  teacher.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  recordActivity(db, req.user, "TEACHER_UPDATED", `Updated teacher details for ${teacher.name}`);
  saveDatabase(db);
  res.json(teacher);
});
router.patch("/teachers/:id/toggle-status", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const teacher = db.teachers.find((t) => t.id === id || t.teacherId === id);
  if (!teacher) {
    res.status(404).json({ error: "Teacher not found." });
    return;
  }
  teacher.status = teacher.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
  if (teacher.userId) {
    const user = db.users.find((u) => u.id === teacher.userId);
    if (user) user.status = teacher.status;
  }
  recordActivity(db, req.user, "TEACHER_STATUS_TOGGLED", `Changed ${teacher.name} status to ${teacher.status}`);
  saveDatabase(db);
  res.json(teacher);
});
router.post("/teachers/:id/reset-password", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  const db = loadDatabase();
  const teacher = db.teachers.find((t) => t.id === id || t.teacherId === id);
  if (!teacher || !teacher.userId) {
    res.status(404).json({ error: "Teacher or login account not found." });
    return;
  }
  const salt = import_bcryptjs2.default.genSaltSync(10);
  db.credentials[teacher.userId] = import_bcryptjs2.default.hashSync(newPassword, salt);
  recordActivity(db, req.user, "TEACHER_PASSWORD_RESET", `Reset login password for teacher ${teacher.name}`);
  saveDatabase(db);
  res.json({ message: "Teacher password reset successfully." });
});
router.delete("/teachers/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const index = (db.teachers || []).findIndex((t) => t.id === id || t.teacherId === id);
  if (index === -1) {
    res.status(404).json({ error: "Teacher not found." });
    return;
  }
  const teacher = db.teachers[index];
  if (teacher.userId) {
    db.users = (db.users || []).filter((u) => u.id !== teacher.userId && u.referenceId !== teacher.id);
    if (db.credentials) {
      delete db.credentials[teacher.userId];
    }
  }
  if (db.batches) {
    for (const batch of db.batches) {
      if (batch.assignedTeacherId === teacher.id || batch.teacherId === teacher.id || batch.assignedTeacherId === teacher.teacherId) {
        batch.assignedTeacherId = void 0;
        batch.teacherId = void 0;
        batch.teacherName = void 0;
      }
    }
  }
  db.teachers.splice(index, 1);
  recordActivity(db, req.user, "TEACHER_DELETED", `Permanently deleted teacher: ${teacher.fullName || teacher.name} (${teacher.teacherId})`);
  saveDatabase(db);
  res.json({ success: true, message: `Teacher ${teacher.fullName || teacher.name} was permanently removed.` });
});
router.get("/notices", requireAuth, (req, res) => {
  const db = loadDatabase();
  const user = req.user;
  if (user.role === "admin") {
    res.json(db.notices.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
    return;
  }
  if (user.role === "teacher") {
    const teacher = db.teachers.find((t) => t.id === user.referenceId);
    const assignedBatches = teacher ? teacher.assignedBatchIds : [];
    const visible = db.notices.filter(
      (n) => n.targetAudience === "All" || n.targetAudience === "Teachers" || n.targetAudience === "Specific Batch" && n.targetBatchId && assignedBatches.includes(n.targetBatchId)
    );
    res.json(visible.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
    return;
  }
  if (user.role === "student") {
    const student = db.students.find((s) => s.id === user.referenceId);
    const studentBatch = student ? student.batchId : "";
    const visible = db.notices.filter(
      (n) => n.targetAudience === "All" || n.targetAudience === "Students" || n.targetAudience === "Specific Batch" && n.targetBatchId === studentBatch
    );
    res.json(visible.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
    return;
  }
  res.json([]);
});
router.post("/notices", requireAuth, requireAdmin, (req, res) => {
  const { title, description, publishDate, expiryDate, targetAudience, targetBatchId } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required." });
    return;
  }
  const db = loadDatabase();
  let batchName = "";
  if (targetBatchId) {
    const batch = db.batches.find((b) => b.id === targetBatchId);
    if (batch) batchName = batch.batchName;
  }
  const newNotice = {
    id: `not_${Date.now()}`,
    title,
    description,
    publishDate: publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    expiryDate: expiryDate || "",
    targetAudience: targetAudience || "All",
    targetBatchId,
    targetBatchName: batchName,
    createdBy: req.user.name,
    createdByName: req.user.name,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.notices.unshift(newNotice);
  recordActivity(db, req.user, "NOTICE_CREATED", `Published notice: "${title}" for audience: ${targetAudience}`);
  saveDatabase(db);
  res.status(201).json(newNotice);
});
router.delete("/notices/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const index = db.notices.findIndex((n) => n.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Notice not found." });
    return;
  }
  const notice = db.notices[index];
  db.notices.splice(index, 1);
  recordActivity(db, req.user, "NOTICE_DELETED", `Deleted notice: "${notice.title}"`);
  saveDatabase(db);
  res.json({ message: "Notice deleted successfully." });
});
router.get("/reports/students", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const { courseId, batchId, status } = req.query;
  let students = [...db.students];
  if (courseId) students = students.filter((s) => s.courseId === courseId);
  if (batchId) students = students.filter((s) => s.batchId === batchId);
  if (status) students = students.filter((s) => s.studentStatus === status);
  const courseBreakdown = {};
  const batchBreakdown = {};
  for (const s of students) {
    const cName = s.courseName || "Unassigned";
    const bName = s.batchName || "Unassigned";
    courseBreakdown[cName] = (courseBreakdown[cName] || 0) + 1;
    batchBreakdown[bName] = (batchBreakdown[bName] || 0) + 1;
  }
  res.json({
    total: students.length,
    active: students.filter((s) => s.studentStatus === "ACTIVE").length,
    archived: students.filter((s) => s.studentStatus === "ARCHIVED").length,
    courseBreakdown,
    batchBreakdown,
    students
  });
});
router.get("/reports/payments", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const { startDate, endDate } = req.query;
  let payments = [...db.payments];
  if (startDate) payments = payments.filter((p) => p.paymentDate >= String(startDate));
  if (endDate) payments = payments.filter((p) => p.paymentDate <= String(endDate));
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalDueAcrossSystem = db.students.reduce((sum, s) => sum + Number(s.totalDue), 0);
  const totalFeesAcrossSystem = db.students.reduce((sum, s) => sum + Number(s.totalFee), 0);
  const methodBreakdown = {};
  for (const p of payments) {
    methodBreakdown[p.paymentMethod] = (methodBreakdown[p.paymentMethod] || 0) + Number(p.amount);
  }
  res.json({
    totalCollected,
    totalDueAcrossSystem,
    totalFeesAcrossSystem,
    paymentCount: payments.length,
    methodBreakdown,
    payments
  });
});
router.get("/reports/attendance", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const { batchId } = req.query;
  let sessions = [...db.attendance];
  if (batchId) sessions = sessions.filter((s) => s.batchId === batchId);
  let totalRecords = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  for (const s of sessions) {
    for (const r of s.records) {
      totalRecords++;
      if (r.status === "PRESENT") totalPresent++;
      else if (r.status === "ABSENT") totalAbsent++;
      else if (r.status === "LATE") totalLate++;
    }
  }
  const overallPercentage = totalRecords > 0 ? Math.round((totalPresent + totalLate) / totalRecords * 100) : 100;
  res.json({
    totalSessions: sessions.length,
    totalRecords,
    totalPresent,
    totalAbsent,
    totalLate,
    overallPercentage,
    sessions
  });
});
router.get("/reports/documents", requireAuth, requireAdmin, (_req, res) => {
  const db = loadDatabase();
  const submitted = db.documents.filter((d) => d.status === "Submitted").length;
  const pending = db.documents.filter((d) => d.status === "Pending").length;
  const missing = db.documents.filter((d) => d.status === "Missing").length;
  res.json({
    total: db.documents.length,
    submitted,
    pending,
    missing,
    documents: db.documents
  });
});
router.get("/activity-logs", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const { search, limit } = req.query;
  let logs = [...db.activityLogs];
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    logs = logs.filter(
      (l) => l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.user.name.toLowerCase().includes(q)
    );
  }
  const max = Number(limit) || 100;
  res.json(logs.slice(0, max));
});
router.get("/settings", requireAuth, requireAdmin, (_req, res) => {
  const db = loadDatabase();
  res.json(db.settings);
});
router.put("/settings", requireAuth, requireAdmin, (req, res) => {
  const db = loadDatabase();
  const {
    instituteName,
    tagline,
    logoUrl,
    address,
    phone,
    email,
    currencySymbol,
    currencyCode,
    receiptFooter,
    allowedFileTypes,
    maxFileSizeMb,
    academicYear
  } = req.body;
  if (instituteName) db.settings.instituteName = instituteName;
  if (tagline !== void 0) db.settings.tagline = tagline;
  if (logoUrl !== void 0) db.settings.logoUrl = logoUrl;
  if (address !== void 0) db.settings.address = address;
  if (phone !== void 0) db.settings.phone = phone;
  if (email !== void 0) db.settings.email = email;
  if (currencySymbol !== void 0) db.settings.currencySymbol = currencySymbol;
  if (currencyCode !== void 0) db.settings.currencyCode = currencyCode;
  if (receiptFooter !== void 0) db.settings.receiptFooter = receiptFooter;
  if (allowedFileTypes !== void 0) db.settings.allowedFileTypes = allowedFileTypes;
  if (maxFileSizeMb !== void 0) db.settings.maxFileSizeMb = Number(maxFileSizeMb);
  if (academicYear !== void 0) db.settings.academicYear = academicYear;
  recordActivity(db, req.user, "SETTINGS_UPDATED", "Updated institution branding and system settings");
  saveDatabase(db);
  res.json(db.settings);
});
var routes_default = router;

// server.ts
async function startServer() {
  const app = (0, import_express2.default)();
  const PORT = 3e3;
  app.use(import_express2.default.json({ limit: "10mb" }));
  app.use(import_express2.default.urlencoded({ extended: true, limit: "10mb" }));
  app.use((req, _res, next) => {
    if (req.url.startsWith("/api")) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });
  const uploadsPath = import_path3.default.resolve(process.cwd(), "uploads");
  app.use("/uploads", import_express2.default.static(uploadsPath));
  app.use("/api", routes_default);
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        port: 3e3
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path3.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path3.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coaching Center Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
