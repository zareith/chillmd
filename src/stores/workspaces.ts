import { signal } from "@preact/signals";

export type WorkspaceType = "OPFS_LOCAL";

export interface WorkspaceState {
    id: string,
    type: WorkspaceType
}

export const workspaces$ = signal<WorkspaceState[]>([]);
