import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  Calendar,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { ActivityCategory, TargetStatus } from "../backend";
import {
  useActivities,
  useStudentPerformances,
  useTargets,
} from "../hooks/useQueries";

const categoryColors: Record<ActivityCategory, string> = {
  [ActivityCategory.academic]: "bg-primary/10 text-primary border-primary/20",
  [ActivityCategory.research]: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  [ActivityCategory.social]:
    "bg-accent/20 text-accent-foreground border-accent/30",
  [ActivityCategory.administrative]:
    "bg-muted text-muted-foreground border-border",
};

const gradeColor = (grade: string) => {
  if (["A+", "A", "A-"].includes(grade)) return "text-success font-bold";
  if (["B+", "B", "B-"].includes(grade)) return "text-primary font-semibold";
  if (["C+", "C"].includes(grade)) return "text-warning font-medium";
  return "text-destructive font-medium";
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export default function Dashboard() {
  const { data: activities = [] } = useActivities();
  const { data: targets = [] } = useTargets();
  const { data: performances = [] } = useStudentPerformances();

  const achieved = targets.filter(
    (t) => t.status === TargetStatus.achieved,
  ).length;
  const inProgress = targets.filter(
    (t) => t.status === TargetStatus.inProgress,
  ).length;
  const pending = targets.filter(
    (t) => t.status === TargetStatus.pending,
  ).length;
  const achievedPct = targets.length
    ? Math.round((achieved / targets.length) * 100)
    : 0;

  const recentActivities = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const recentPerformances = [...performances].slice(0, 5);

  const stats = [
    {
      label: "Total Activities",
      value: activities.length,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      label: "Targets",
      value: targets.length,
      icon: Target,
      color: "text-chart-2",
      bg: "bg-chart-2/8",
      sub: `${achieved} achieved · ${inProgress} in progress · ${pending} pending`,
    },
    {
      label: "Student Records",
      value: performances.length,
      icon: GraduationCap,
      color: "text-accent-foreground",
      bg: "bg-accent/15",
    },
    {
      label: "Target Achievement",
      value: `${achievedPct}%`,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-display font-bold text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Overview of department activities, targets, and student performance
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="shadow-card border-border/60 hover:shadow-elevated transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-display font-bold mt-1 ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                    {stat.sub && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.sub}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon size={20} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Targets Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Award size={16} className="text-primary" />
              Targets Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Overall Achievement
                </span>
                <span className="font-semibold text-foreground">
                  {achievedPct}%
                </span>
              </div>
              <Progress value={achievedPct} className="h-2.5" />
              <div className="flex gap-4 text-xs pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                  {achieved} Achieved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  {inProgress} In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
                  {pending} Pending
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="shadow-card border-border/60 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Recent Activities
              </CardTitle>
              <Link
                to="/activities"
                className="text-xs text-primary hover:underline font-medium"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No activities yet.
                </p>
              ) : (
                recentActivities.map((act) => (
                  <div
                    key={act.id.toString()}
                    className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs shrink-0 capitalize ${categoryColors[act.category]}`}
                    >
                      {act.category}
                    </Badge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {act.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {act.date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Performance */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-card border-border/60 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <GraduationCap size={16} className="text-primary" />
                Recent Student Performance
              </CardTitle>
              <Link
                to="/performance"
                className="text-xs text-primary hover:underline font-medium"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-0 pt-2">
              {recentPerformances.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No records yet.
                </p>
              ) : (
                recentPerformances.map((p) => (
                  <div
                    key={p.id.toString()}
                    className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-secondary-foreground text-xs font-bold">
                        {p.studentName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {p.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.subject}
                      </p>
                    </div>
                    <span className={`text-sm ${gradeColor(p.grade)}`}>
                      {p.grade}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
