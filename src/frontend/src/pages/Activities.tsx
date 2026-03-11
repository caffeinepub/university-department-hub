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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ActivityCategory } from "../backend";
import type { Activity } from "../backend";
import {
  useActivities,
  useCreateActivity,
  useDeleteActivity,
  useIsAdmin,
  useUpdateActivity,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

const categoryColors: Record<ActivityCategory, string> = {
  [ActivityCategory.academic]: "bg-primary/10 text-primary border-primary/20",
  [ActivityCategory.research]: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  [ActivityCategory.social]:
    "bg-accent/20 text-accent-foreground border-accent/30",
  [ActivityCategory.administrative]:
    "bg-muted text-muted-foreground border-border",
};

const emptyForm = {
  title: "",
  description: "",
  date: "",
  category: ActivityCategory.academic,
};

export default function Activities() {
  const { data: activities = [], isLoading } = useActivities();
  const { data: isAdmin } = useIsAdmin();
  const create = useCreateActivity();
  const update = useUpdateActivity();
  const remove = useDeleteActivity();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | ActivityCategory>("all");

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Activity) => {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description,
      date: a.date,
      category: a.category,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date.trim()) {
      toast.error("Title and date are required.");
      return;
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...form });
        toast.success("Activity updated.");
      } else {
        await create.mutateAsync(form);
        toast.success("Activity created.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save activity.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success("Activity deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete activity.");
    }
  };

  const filtered =
    activeTab === "all"
      ? activities
      : activities.filter((a) => a.category === activeTab);
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
            Activities
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Department events, programmes and engagements
          </p>
        </div>
        {isAdmin && (
          <Button
            data-ocid="activities.add.button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} className="mr-1.5" />
            Add Activity
          </Button>
        )}
      </motion.div>

      {!isAdmin && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/60 text-muted-foreground text-sm border border-border/50">
          <AlertCircle size={15} />
          You are viewing in read-only mode. Sign in as an admin to manage
          activities.
        </div>
      )}

      {/* Category filter tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      >
        <TabsList className="bg-muted/60">
          <TabsTrigger data-ocid="activities.filter.tab" value="all">
            All
          </TabsTrigger>
          {Object.values(ActivityCategory).map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      {isLoading ? (
        <div data-ocid="activities.loading_state" className="space-y-2">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="activities.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <AlertCircle size={22} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No activities found
            {activeTab !== "all" ? ` for category "${activeTab}"` : ""}.
          </p>
          {isAdmin && (
            <Button
              variant="link"
              onClick={openAdd}
              className="mt-2 text-primary"
            >
              Add the first activity
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-border/60 overflow-hidden shadow-card"
        >
          <Table data-ocid="activities.table">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold text-foreground/80">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-foreground/80">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground/80">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-foreground/80 hidden md:table-cell">
                  Description
                </TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((act, idx) => (
                  <motion.tr
                    key={act.id.toString()}
                    data-ocid={`activities.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {act.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs ${categoryColors[act.category]}`}
                      >
                        {act.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {act.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[280px] truncate hidden md:table-cell">
                      {act.description}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            data-ocid={`activities.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(act)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            data-ocid={`activities.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(act)}
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
        <DialogContent data-ocid="activities.dialog" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Activity" : "Add New Activity"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="act-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="act-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Activity title"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-desc">Description</Label>
              <Textarea
                id="act-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description of the activity"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="act-date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="act-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, category: v as ActivityCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ActivityCategory).map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="activities.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="activities.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              {editing ? "Save Changes" : "Create Activity"}
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
            <DialogTitle className="font-display">Delete Activity</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{deleteTarget?.title}"
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="activities.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="activities.confirm_button"
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
