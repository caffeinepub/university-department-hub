import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { StudentPerformance } from "../backend";
import {
  useCreatePerformance,
  useDeletePerformance,
  useIsAdmin,
  useStudentPerformances,
  useUpdatePerformance,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

const gradeVariant = (grade: string): string => {
  if (["A+", "A", "A-"].includes(grade))
    return "bg-success/10 text-success border-success/20";
  if (["B+", "B", "B-"].includes(grade))
    return "bg-primary/10 text-primary border-primary/20";
  if (["C+", "C"].includes(grade))
    return "bg-warning/10 text-warning-foreground border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

const emptyForm = {
  studentName: "",
  studentId: "",
  subject: "",
  grade: "",
  semester: "",
  remarks: "",
};

export default function StudentPerformancePage() {
  const { data: performances = [], isLoading } = useStudentPerformances();
  const { data: isAdmin } = useIsAdmin();
  const create = useCreatePerformance();
  const update = useUpdatePerformance();
  const remove = useDeletePerformance();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StudentPerformance | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<StudentPerformance | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };
  const openEdit = (p: StudentPerformance) => {
    setEditing(p);
    setForm({
      studentName: p.studentName,
      studentId: p.studentId,
      subject: p.subject,
      grade: p.grade,
      semester: p.semester,
      remarks: p.remarks ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !form.studentName.trim() ||
      !form.studentId.trim() ||
      !form.subject.trim() ||
      !form.grade.trim()
    ) {
      toast.error("Name, ID, subject, and grade are required.");
      return;
    }
    try {
      const payload = { ...form, remarks: form.remarks.trim() || null };
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...payload });
        toast.success("Record updated.");
      } else {
        await create.mutateAsync(payload);
        toast.success("Record created.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save record.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success("Record deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return performances;
    const q = search.toLowerCase();
    return performances.filter(
      (p) =>
        p.studentName.toLowerCase().includes(q) ||
        p.studentId.toLowerCase().includes(q),
    );
  }, [performances, search]);

  const isPending = create.isPending || update.isPending;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Student Performance
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Academic grades and performance records
          </p>
        </div>
        {isAdmin && (
          <Button
            data-ocid="performance.add.button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} className="mr-1.5" />
            Add Record
          </Button>
        )}
      </motion.div>

      {!isAdmin && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/60 text-muted-foreground text-sm border border-border/50">
          <AlertCircle size={15} />
          You are viewing in read-only mode. Sign in as admin to manage
          performance records.
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="performance.search_input"
          className="pl-9"
          placeholder="Search by name or student ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div data-ocid="performance.loading_state" className="space-y-2">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="performance.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Search size={22} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {search
              ? `No results for "${search}"`
              : "No performance records found."}
          </p>
          {isAdmin && !search && (
            <Button
              variant="link"
              onClick={openAdd}
              className="mt-2 text-primary"
            >
              Add the first record
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-border/60 overflow-hidden shadow-card"
        >
          <Table data-ocid="performance.table">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold text-foreground/80">
                  Student
                </TableHead>
                <TableHead className="font-semibold text-foreground/80">
                  ID
                </TableHead>
                <TableHead className="font-semibold text-foreground/80">
                  Subject
                </TableHead>
                <TableHead className="font-semibold text-foreground/80">
                  Grade
                </TableHead>
                <TableHead className="font-semibold text-foreground/80 hidden md:table-cell">
                  Semester
                </TableHead>
                <TableHead className="font-semibold text-foreground/80 hidden lg:table-cell">
                  Remarks
                </TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((p, idx) => (
                  <motion.tr
                    key={p.id.toString()}
                    data-ocid={`performance.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-secondary-foreground text-xs font-bold">
                            {p.studentName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground text-sm">
                          {p.studentName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">
                      {p.studentId}
                    </TableCell>
                    <TableCell className="text-sm text-foreground max-w-[160px] truncate">
                      {p.subject}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold ${gradeVariant(p.grade)}`}
                      >
                        {p.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                      {p.semester}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[180px] truncate hidden lg:table-cell">
                      {p.remarks ?? "—"}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            data-ocid={`performance.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(p)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            data-ocid={`performance.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="performance.dialog" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Performance Record" : "Add Performance Record"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">
                  Student Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-name"
                  value={form.studentName}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, studentName: e.target.value }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-id">
                  Student ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-id"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, studentId: e.target.value }))
                  }
                  placeholder="e.g. CS/2023/001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, subject: e.target.value }))
                  }
                  placeholder="Course/subject name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-grade">
                  Grade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-grade"
                  value={form.grade}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, grade: e.target.value }))
                  }
                  placeholder="A, B+, C…"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-semester">Semester</Label>
              <Input
                id="p-semester"
                value={form.semester}
                onChange={(e) =>
                  setForm((v) => ({ ...v, semester: e.target.value }))
                }
                placeholder="e.g. 2024/2025 Semester 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-remarks">Remarks</Label>
              <Textarea
                id="p-remarks"
                value={form.remarks}
                onChange={(e) =>
                  setForm((v) => ({ ...v, remarks: e.target.value }))
                }
                placeholder="Optional comments or notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="performance.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="performance.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              {editing ? "Save Changes" : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Record</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Delete performance record for{" "}
            <span className="font-medium text-foreground">
              {deleteTarget?.studentName}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="performance.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="performance.confirm_button"
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              {remove.isPending && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
