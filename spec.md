# University Department Hub

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Department Activities: log and view department events/activities with title, description, date, and category
- Department Targets: set and track departmental goals with title, description, deadline, status (pending/in-progress/achieved)
- Student Performance: record and view student grades/scores per subject/semester with student name, ID, subject, grade, and semester
- Dashboard overview: summary counts and highlights across all three modules
- Role-based access: Admin can add/edit/delete all records; Viewer can only read
- Navigation between Dashboard, Activities, Targets, and Student Performance sections

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Activities, Targets, and StudentPerformance data models with full CRUD operations
2. Authorization component for admin/viewer roles
3. Frontend: Dashboard summary page, Activities page, Targets page, Student Performance page
4. Responsive layout with sidebar navigation
