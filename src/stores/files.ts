import { computed, signal } from "@preact/signals";
import { FileWithHandle } from "browser-fs-access";
import { produce } from "immer";
import { TreeNode } from "rsuite/esm/internals/Tree/types";

export interface FSTreeNode extends TreeNode {
    id: string
    dir?: { id: string, handle: FileSystemDirectoryHandle }
    handle: FileSystemHandle
    children?: FSTreeNode[]
}

export const workspace$ = signal<{
    dir: FileSystemDirectoryHandle,
    nodes?: FSTreeNode[]
} | null>(null)

export const deepFind = (nodes: FSTreeNode[], id: string, pull = false): FSTreeNode | null => {
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n.id === id) {
            if (pull)
                nodes.splice(i, 1)
            return n;
        }
        if (n.children) {
            const found = deepFind(n.children, id)
            if (found) return found
        }
    }
    return null
}

interface FileState {
    id: string;
    name: string;
    blob?: FileWithHandle
    wipContent: string
    previewing?: boolean
    isOpen: boolean
}

export const openFiles$ = signal<FileState[]>([]);

export const currentFile$ = computed((): FileState | null => openFiles$.value?.find(_ => _.isOpen) ?? null);

export const updateCurrent = (update: (s: FileState) => void): void => {
    openFiles$.value = openFiles$.value.map(f => {
        if (!f.isOpen) return f;
        return produce(f, update)
    })
}