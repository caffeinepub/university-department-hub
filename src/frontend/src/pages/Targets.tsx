import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TargetStatus } from "../backend";
import type { Target } from "../backend";
import {
  useCreateTarget,
  useDeleteTarget,
  useIsAdmin,
  useTargets,
  useUpdateTarget,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

const statusConfig: Record<TargetStatus, { label: string; className: string }> =
  {
    [TargetStatus.achieved]: {
      label: "Achieved",
      className: "bg-success/10 text-success border-success/20",
    },
    [TargetStatus.inProgress]: {
      label: "In Progress",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [TargetStatus.pending]: {
      label: "Pending",
      className: "bg-warning/10 text-warning-foreground border-warning/20",
    },
  };

const emptyForm = {
  title: "",
  description: "",
  deadline: "",
  status: TargetStatus.pending,
};

export default function Targets() {
  const { data: targets = [], isLoading } = useTargets();
  const { data: isAdmin } = useIsAdmin();
  const create = useCreateTarget();
  const update = useUpdateTarget();
  const remove = useDeleteTarget();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Target | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Target | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | TargetStatus>("all");

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };
  const openEdit = (t: Target) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description,
      deadline: t.deadline,
      status: t.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...form });
        toast.success("Target updated.");
      } else {
        await create.mutateAsync(form);
        toast.success("Target created.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save target.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success("Target deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete target.");
    }
  };

  const filtered =
    filterStatus === "all"
      ? targets
      : targets.filter((t) => t.status === filterStatus);
  const isPending = create.isPending || update.isPending;

  const filterButtons: Array<{ label: string; value: "all" | TargetStatus }> = [
    { label: "All", value: "all" },
    { label: "Achieved", value: TargetStatus.achieved },
    { label: "In Progress", value: TargetStatus.inProgress },
    { label: "Pending", value: TargetStatus.pending },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Targets
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Department goals and performance milestones
          </p>
        </div>
        {isAdmin && (
          <Button
            data-ocid="targets.add.button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} className="mr-1.5" />
            Add Target
          </Button>
        )}
      </motion.div>

      {!isAdmin && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/60 text-muted-foreground text-sm border border-border/50">
          <AlertCircle size={15} />
          You are viewing in read-only mode. Sign in as admin to manage targets.
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ label, value }) => (
          <Button
            key={value}
            data-ocid="targets.filter.tab"
            variant={filterStatus === value ? "default" : "outline"}
            size="sm"
            className={`text-xs ${filterStatus === value ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setFilterStatus(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div
          data-ocid="targets.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-44 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="targets.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <AlertCircle size={22} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No targets found
            {filterStatus !== "all" ? ` with status "${filterStatus}"` : ""}.
          </p>
          {isAdmin && (
            <Button
              variant="link"
              onClick={openAdd}
              className="mt-2 text-primary"
            >
              Add the first target
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          <AnimatePresence>
            {filtered.map((target, idx) => (
              <motion.div
                key={target.id.toString()}
                data-ocid={`targets.item.${idx + 1}`}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <Card className="shadow-card border-border/60 hover:shadow-elevated transition-shadow h-full flex flex-col">
                  <CardContent className="pt-5 pb-3 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-foreground text-sm leading-snug flex-1">
                        {target.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${statusConfig[target.status].className}`}
                      >
                        {statusConfig[target.status].label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {target.description}
                    </p>
                    {target.deadline && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        Deadline:{" "}
                        <span className="font-medium">{target.deadline}</span>
                      </div>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardFooter className="pt-2 pb-3 gap-2 border-t border-border/40">
                      <Button
                        data-ocid={`targets.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-primary h-7"
                        onClick={() => openEdit(target)}
                      >
                        <Pencil size={12} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        data-ocid={`targets.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive h-7"
                        onClick={() => setDeleteTarget(target)}
                      >
                        <Trash2 size={12} className="mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="targets.dialog" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Target" : "Add New Target"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="tgt-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tgt-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Target title"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tgt-desc">Description</Label>
              <Textarea
                id="tgt-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe this target"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tgt-deadline">Deadline</Label>
                <Input
                  id="tgt-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, deadline: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as TargetStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TargetStatus.pending}>
                      Pending
                    </SelectItem>
                    <SelectItem value={TargetStatus.inProgress}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={TargetStatus.achieved}>
                      Achieved
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="targets.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="targets.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              {editing ? "Save Changes" : "Create Target"}
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
            <DialogTitle className="font-display">Delete Target</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{deleteTarget?.title}"
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="targets.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="targets.confirm_button"
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
