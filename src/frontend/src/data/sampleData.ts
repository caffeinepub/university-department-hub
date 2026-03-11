import { ActivityCategory, TargetStatus } from "../backend";
import type { Activity, StudentPerformance, Target } from "../backend";

export const sampleActivities: Activity[] = [
  {
    id: BigInt(1),
    title: "Annual Research Symposium 2025",
    description:
      "A two-day symposium showcasing faculty and student research across all disciplines. Keynote by Prof. Margaret Osei on AI in Education.",
    date: "2025-11-14",
    category: ActivityCategory.research,
  },
  {
    id: BigInt(2),
    title: "Community Outreach: STEM Day",
    description:
      "Department volunteers hosted workshops at three local secondary schools introducing students to computer science fundamentals and career paths.",
    date: "2025-10-22",
    category: ActivityCategory.social,
  },
  {
    id: BigInt(3),
    title: "Curriculum Review Board Meeting",
    description:
      "Quarterly review of BSc Computer Science curriculum with external assessors. Approved updates to Year 3 elective modules.",
    date: "2025-10-05",
    category: ActivityCategory.administrative,
  },
  {
    id: BigInt(4),
    title: "Guest Lecture: Machine Learning in Healthcare",
    description:
      "Dr. Aisha Kamara from the National AI Institute delivered an invited lecture attended by over 150 students and faculty.",
    date: "2025-09-28",
    category: ActivityCategory.academic,
  },
  {
    id: BigInt(5),
    title: "Faculty Development Workshop",
    description:
      "A full-day professional development workshop focused on modern pedagogical approaches including active learning and flipped classroom methods.",
    date: "2025-09-15",
    category: ActivityCategory.administrative,
  },
  {
    id: BigInt(6),
    title: "Departmental Sports & Wellness Day",
    description:
      "Annual wellness event bringing together students, staff, and faculty for team sports, yoga sessions, and mental health talks.",
    date: "2025-08-30",
    category: ActivityCategory.social,
  },
];

export const sampleTargets: Target[] = [
  {
    id: BigInt(1),
    title: "Increase Research Publication Output by 25%",
    description:
      "Encourage faculty to submit at least 2 papers to indexed journals per year. Provide research grants and writing support through the Academic Affairs office.",
    deadline: "2025-12-31",
    status: TargetStatus.inProgress,
  },
  {
    id: BigInt(2),
    title: "Achieve 90% Graduate Employment Rate",
    description:
      "Strengthen industry partnerships and internship programmes to ensure graduates secure meaningful employment within 6 months of graduation.",
    deadline: "2026-06-30",
    status: TargetStatus.inProgress,
  },
  {
    id: BigInt(3),
    title: "Launch 3 New Industry Collaboration Projects",
    description:
      "Partner with technology firms and NGOs to create project-based learning opportunities for final-year students, including live client briefs.",
    deadline: "2025-11-30",
    status: TargetStatus.achieved,
  },
  {
    id: BigInt(4),
    title: "Obtain ISO 9001 Departmental Accreditation",
    description:
      "Complete all documentation, process mapping, and internal audits required to apply for quality management system certification.",
    deadline: "2026-03-31",
    status: TargetStatus.pending,
  },
  {
    id: BigInt(5),
    title: "Reduce Student Dropout Rate to Below 5%",
    description:
      "Implement early-warning academic support system, peer tutoring, and mandatory first-year mentorship programme.",
    deadline: "2025-12-31",
    status: TargetStatus.achieved,
  },
  {
    id: BigInt(6),
    title: "Digitize All Student Records",
    description:
      "Migrate all physical academic records to the university's integrated student information system and ensure 100% data integrity.",
    deadline: "2025-09-30",
    status: TargetStatus.pending,
  },
];

export const samplePerformances: StudentPerformance[] = [
  {
    id: BigInt(1),
    studentName: "Amara Diallo",
    studentId: "CS/2022/0041",
    subject: "Data Structures & Algorithms",
    grade: "A",
    semester: "2024/2025 Semester 1",
    remarks: "Exceptional performance; top of class.",
  },
  {
    id: BigInt(2),
    studentName: "Kwame Asante",
    studentId: "CS/2022/0087",
    subject: "Database Management Systems",
    grade: "B+",
    semester: "2024/2025 Semester 1",
    remarks: "Strong practical skills, minor gaps in theory.",
  },
  {
    id: BigInt(3),
    studentName: "Fatima El-Hassan",
    studentId: "CS/2021/0033",
    subject: "Software Engineering",
    grade: "A-",
    semester: "2024/2025 Semester 1",
    remarks: "Excellent project management and documentation.",
  },
  {
    id: BigInt(4),
    studentName: "Emeka Okonkwo",
    studentId: "CS/2023/0012",
    subject: "Introduction to Programming",
    grade: "B",
    semester: "2024/2025 Semester 1",
    remarks:
      "Good effort; needs to improve algorithm complexity understanding.",
  },
  {
    id: BigInt(5),
    studentName: "Naledi Dlamini",
    studentId: "CS/2021/0058",
    subject: "Artificial Intelligence",
    grade: "A+",
    semester: "2024/2025 Semester 1",
    remarks: "Outstanding research-quality coursework submission.",
  },
  {
    id: BigInt(6),
    studentName: "Ibrahim Touré",
    studentId: "CS/2022/0104",
    subject: "Computer Networks",
    grade: "C+",
    semester: "2024/2025 Semester 1",
    remarks: "Passed but encouraged to seek tutoring support.",
  },
  {
    id: BigInt(7),
    studentName: "Aisha Mensah",
    studentId: "CS/2023/0029",
    subject: "Mathematics for Computing",
    grade: "B+",
    semester: "2024/2025 Semester 1",
    remarks: "Solid grasp of discrete mathematics.",
  },
  {
    id: BigInt(8),
    studentName: "Oluwaseun Adeyemi",
    studentId: "CS/2020/0067",
    subject: "Final Year Project",
    grade: "A",
    semester: "2024/2025 Semester 2",
    remarks: "Commended by external examiner; publication recommended.",
  },
];
