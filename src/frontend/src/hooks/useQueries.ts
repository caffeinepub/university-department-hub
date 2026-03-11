import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ActivityCategory, TargetStatus } from "../backend";
import type { Activity, StudentPerformance, Target } from "../backend";
import {
  sampleActivities,
  samplePerformances,
  sampleTargets,
} from "../data/sampleData";
import { useActor } from "./useActor";

const DEMO_MODE = true;

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ---- Activities ----

export function useActivities() {
  const { actor, isFetching } = useActor();
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return DEMO_MODE ? sampleActivities : [];
      try {
        const data = await actor.getAllActivities();
        return data.length > 0 ? data : DEMO_MODE ? sampleActivities : [];
      } catch {
        return DEMO_MODE ? sampleActivities : [];
      }
    },
    enabled: !isFetching,
    staleTime: 10_000,
  });
}

export function useCreateActivity() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: string;
      category: ActivityCategory;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createActivity(
        data.title,
        data.description,
        data.date,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useUpdateActivity() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      date: string;
      category: ActivityCategory;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateActivity(
        data.id,
        data.title,
        data.description,
        data.date,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useDeleteActivity() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteActivity(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

// ---- Targets ----

export function useTargets() {
  const { actor, isFetching } = useActor();
  return useQuery<Target[]>({
    queryKey: ["targets"],
    queryFn: async () => {
      if (!actor) return DEMO_MODE ? sampleTargets : [];
      try {
        const data = await actor.getAllTargets();
        return data.length > 0 ? data : DEMO_MODE ? sampleTargets : [];
      } catch {
        return DEMO_MODE ? sampleTargets : [];
      }
    },
    enabled: !isFetching,
    staleTime: 10_000,
  });
}

export function useCreateTarget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      deadline: string;
      status: TargetStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createTarget(
        data.title,
        data.description,
        data.deadline,
        data.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["targets"] }),
  });
}

export function useUpdateTarget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      deadline: string;
      status: TargetStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateTarget(
        data.id,
        data.title,
        data.description,
        data.deadline,
        data.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["targets"] }),
  });
}

export function useDeleteTarget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteTarget(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["targets"] }),
  });
}

// ---- Student Performance ----

export function useStudentPerformances() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentPerformance[]>({
    queryKey: ["performances"],
    queryFn: async () => {
      if (!actor) return DEMO_MODE ? samplePerformances : [];
      try {
        const data = await actor.getAllStudentPerformances();
        return data.length > 0 ? data : DEMO_MODE ? samplePerformances : [];
      } catch {
        return DEMO_MODE ? samplePerformances : [];
      }
    },
    enabled: !isFetching,
    staleTime: 10_000,
  });
}

export function useCreatePerformance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      studentName: string;
      studentId: string;
      subject: string;
      grade: string;
      semester: string;
      remarks: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createStudentPerformance(
        data.studentName,
        data.studentId,
        data.subject,
        data.grade,
        data.semester,
        data.remarks,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performances"] }),
  });
}

export function useUpdatePerformance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      studentName: string;
      studentId: string;
      subject: string;
      grade: string;
      semester: string;
      remarks: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateStudentPerformance(
        data.id,
        data.studentName,
        data.studentId,
        data.subject,
        data.grade,
        data.semester,
        data.remarks,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performances"] }),
  });
}

export function useDeletePerformance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteStudentPerformance(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performances"] }),
  });
}
