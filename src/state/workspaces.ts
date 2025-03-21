import { atomWithImmer as atomI } from "jotai-immer";

export type WorkspaceType = "OPFS_LOCAL";

export interface WorkspaceState {
    id: string,
    type: WorkspaceType
}

export const workspaces$ = atomI<WorkspaceState[]>([]);
