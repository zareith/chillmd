import { atom } from "jotai"
import { atomWithImmer as atomI } from "jotai-immer";
import { FileWithHandle } from "browser-fs-access";
import { TreeNode } from "rsuite/esm/internals/Tree/types";
import { store } from "./store";

export interface FSTreeNode extends TreeNode {
    path: string
    name: string
    // Ref to closest directory
    // If the node is directory - its own handle
    // Else its parent directory
    dir?: { handle: FileSystemDirectoryHandle }
    handle: FileSystemHandle
    children?: FSTreeNode[]
}

export const workspace$ = atomI<{
    dir: FileSystemDirectoryHandle,
    nodes?: FSTreeNode[]
} | null>(null)

export const deepFind = (
    path: string[],
    pull = false,
    nodes = store.get(workspace$)?.nodes ?? []
): FSTreeNode | null => {
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n.name !== path[0]) continue;
        if (path.length > 1 && n.children) {
            // Traverse down the tree
            return deepFind(path.slice(1), pull, n.children)
        }
        if (path.length !== 1) continue;
        if (pull) nodes.splice(i, 1)
        return n;
    }
    return null
}

interface FileState {
    path: string;
    name: string;
    blob?: FileWithHandle
    wipContent: string
    previewing?: boolean
    isOpen: boolean
}

export const openFiles$ = atomI<FileState[]>([]);

export const currentFile$ = atom((get): FileState | null =>
    get(openFiles$).find(_ => _.isOpen) ?? null);

export const updateCurrent = (update: (f: FileState) => void): void => {
    store.set(openFiles$, files=> {
        for (const f of files) {
            if (f.isOpen) {
                update(f)
            }
        }
    })
}