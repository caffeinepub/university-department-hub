import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Target {
    id: bigint;
    status: TargetStatus;
    title: string;
    description: string;
    deadline: string;
}
export interface StudentPerformance {
    id: bigint;
    studentId: string;
    semester: string;
    studentName: string;
    subject: string;
    grade: string;
    remarks?: string;
}
export interface Activity {
    id: bigint;
    title: string;
    date: string;
    description: string;
    category: ActivityCategory;
}
export interface UserProfile {
    name: string;
}
export enum ActivityCategory {
    social = "social",
    research = "research",
    administrative = "administrative",
    academic = "academic"
}
export enum TargetStatus {
    achieved = "achieved",
    pending = "pending",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createActivity(title: string, description: string, date: string, category: ActivityCategory): Promise<void>;
    createStudentPerformance(studentName: string, studentId: string, subject: string, grade: string, semester: string, remarks: string | null): Promise<void>;
    createTarget(title: string, description: string, deadline: string, status: TargetStatus): Promise<void>;
    deleteActivity(id: bigint): Promise<void>;
    deleteStudentPerformance(id: bigint): Promise<void>;
    deleteTarget(id: bigint): Promise<void>;
    getActivity(id: bigint): Promise<Activity>;
    getAllActivities(): Promise<Array<Activity>>;
    getAllStudentPerformances(): Promise<Array<StudentPerformance>>;
    getAllTargets(): Promise<Array<Target>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStudentPerformance(id: bigint): Promise<StudentPerformance>;
    getTarget(id: bigint): Promise<Target>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateActivity(id: bigint, title: string, description: string, date: string, category: ActivityCategory): Promise<void>;
    updateStudentPerformance(id: bigint, studentName: string, studentId: string, subject: string, grade: string, semester: string, remarks: string | null): Promise<void>;
    updateTarget(id: bigint, title: string, description: string, deadline: string, status: TargetStatus): Promise<void>;
}
