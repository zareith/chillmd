import { produce } from "immer";
import { toast } from "react-toastify";
import * as filesStore from "../stores/files";
import {
    fileOpen,
    fileSave,
    FileWithHandle,
} from 'browser-fs-access';
import { nanoid } from "nanoid";
import { update } from "../utils/immer";

export const openFile = async (id?: string, blob?: FileWithHandle) => {
    id ??= nanoid();
    blob ??= await fileOpen({
        extensions: [".markdown", ".md", ".txt", ".text"],
        mimeTypes: ["text/*"]
    })
    const wipContent = await blob.text()
    update(filesStore.openFiles$, draft => {
        let didFind = false;
        draft.forEach(_ => {
            _.isOpen = _.id === id;
            if (_.isOpen) didFind = true;
        })
        if (!didFind) draft.push({
            id,
            blob,
            name: blob.name,
            isOpen: true,
            wipContent,
        });
    });
};

export const openNewFile = () => {
    const id = nanoid()
    update(filesStore.openFiles$, draft => {
        draft.forEach(_ => {
            _.isOpen = false;
        })
        draft.push({
            id,
            name: "Untitled",
            isOpen: true,
            wipContent: "",
        });
    });
    return id
}

export const closeFile = async (id: string) => {
    filesStore.openFiles$.value = filesStore.openFiles$.value.filter(f =>
        f.id !== id
    )
}

export const deleteFile = async (id: string) => {
    closeFile(id)
    update(filesStore.workspace$, w => {
        if (!w.nodes) return
        const f = filesStore.deepFind(w.nodes, id, true)
        // @ts-ignore
        f?.handle.remove()
    })
}

export const switchFile = async (fileId: string) => {
    update(filesStore.openFiles$, draft => {
        draft.forEach(_ => {
            _.isOpen = _.id === fileId
        })
    });
}

export const updateFile = async (fileId: string, content: string) => {
    let shouldAutoSave = false;
    update(filesStore.openFiles$, draft => {
        for (const f of draft) {
            if (f.id === fileId) {
                f.wipContent = content
            }
            if (f.blob?.handle) shouldAutoSave = true;
        }
    })
    if (shouldAutoSave)
        scheduleSave(fileId)
}

const saveTimeouts: Record<string, any> = {}

const scheduleSave = (fileId: string) => {
    if (saveTimeouts[fileId]) return;
    saveTimeouts[fileId] = setTimeout(() => {
        saveTimeouts[fileId] = undefined
        save(fileId)
    }, 500);
}

export const save = async (fileId?: string) => {
    const f = fileId
        ? filesStore.openFiles$.value.find(_ => _.id === fileId)
        : filesStore.currentFile$.value
    if (!f) return
    const blob = new Blob([f.wipContent], {
        type: "text/markdown"
    })
    await fileSave(blob, {}, f.blob.handle)
};

export const copy = async () => {
    toast.promise(
        navigator.clipboard.writeText(
            filesStore.currentFile$.value.wipContent,
        ),
        {
            success: "Copied to clipboard",
            error: "Failed to copy",
        },
    );
};

export const copyAsHTML = async () => {
};
