import DOMPurify from "dompurify"
import { marked } from "marked"
import { atom, useAtom } from "jotai"
import { atomWithImmer as atomI } from "jotai-immer";
import { FileWithHandle } from "browser-fs-access";
import { TreeNode } from "rsuite/esm/internals/Tree/types";
import { store } from "./store";
import { get, set } from 'idb-keyval';
import { MaybeN } from "../utils/types";
import { workspaceRootKey } from "../utils/idb-keys";

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

interface WorkspaceState {
    id: string,
    dir: FileSystemDirectoryHandle,
    nodes?: FSTreeNode[]
}

export const workspace$ = atomI<WorkspaceState | null>(null)

export const useWorkspace$ = () => {
    const [workspace, setWorkspace] = useAtom(workspace$);

    const initWorkspace = (state: WorkspaceState) => {
        setWorkspace(state);
        set(workspaceRootKey, state.dir).catch(e => {
            console.error(`Failed to set ${workspaceRootKey}`, e)
        })
    }

    const updateNodes = (update: (prev: MaybeN<FSTreeNode[]>) => FSTreeNode[]) => {
        setWorkspace(prev => {
            if (prev) {
                prev.nodes = update(prev.nodes)
            }
        })
    }

    return {
        initWorkspace,
        updateNodes,
        workspace,
    }
}

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
    store.set(openFiles$, files => {
        for (const f of files) {
            if (f.isOpen) {
                update(f)
            }
        }
    })
}

interface FilePreview {
    content: string
    preview: string
}

type FilePreviews = Record<string, FilePreview | undefined>

export const previews$ = atom(async (get): Promise<FilePreviews> => {
    let prev: MaybeN<FilePreviews> = null;
    try {
        prev = await get(previews$)
    } catch (e) { }
    const openFiles = get(openFiles$)
    const next = { ...prev }
    for (const f of openFiles) {
        if (f.wipContent === next[f.path]?.content) {
            continue;
        }
        const content = f?.wipContent ?? "";
        const rendered = await marked.parse(content)
        const sanitized = DOMPurify.sanitize(rendered)
        next[f.path] = {
            content: f.wipContent,
            preview: sanitized
        }
    }
    return next
})
