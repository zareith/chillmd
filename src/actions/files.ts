import { toast } from "react-toastify";
import * as filesStore from "../state/files";
import {
    fileOpen,
    fileSave,
    FileWithHandle,
} from 'browser-fs-access';
import { nanoid } from "nanoid";
import format from "date-fns/format";
import { store } from "../state/store";

export const extensions = [".markdown", ".md", ".txt", ".text"];

export const openFile = async (id?: string, blob?: FileWithHandle) => {
    id ??= nanoid();
    blob ??= await fileOpen({
        extensions,
        mimeTypes: ["text/*"]
    })
    const wipContent = await blob.text()
    store.set(filesStore.openFiles$, draft => {
        let didFind = false;
        draft.forEach(_ => {
            _.isOpen = _.path === id;
            if (_.isOpen) didFind = true;
        })
        if (!didFind) draft.push({
            path: id,
            blob,
            name: blob.name,
            isOpen: true,
            wipContent,
        });
    });
};

export const openNewFile = () => {
    let name = `${format(new Date(), 'yyyy-MM-dd')}.md`
    if (store.get(filesStore.openFiles$)?.find(_ => _.name === name)) {
        name = name.replace(/\.md$/, `-${+new Date()}.md`)
    }
    store.set(filesStore.openFiles$, draft => {
        draft.forEach(_ => {
            _.isOpen = false;
        })
        draft.push({
            path: name,
            name: name,
            isOpen: true,
            wipContent: "",
        });
    });
    return name;
}

export const closeFile = async (path: string) => {
    store.set(filesStore.openFiles$, draft => {
        const idx = draft.findIndex(f => f.path === path);
        draft.splice(idx, 1)
    })
}

export const deleteFile = async (path: string) => {
    closeFile(path)
    store.set(filesStore.workspace$, w => {
        if (!w?.nodes) return
        const f = filesStore.deepFind(path.split("/"), true, w.nodes)
        // @ts-ignore
        f?.handle.remove()
    })
}

export const switchFile = async (path: string) => {
    store.set(filesStore.openFiles$, draft => {
        draft.forEach(_ => {
            _.isOpen = _.path === path
        })
    });
}

export const updateFile = async (path: string, content: string) => {
    let shouldAutoSave = false;
    store.set(filesStore.openFiles$, draft => {
        for (const f of draft) {
            if (f.path === path) {
                if (f.blob?.handle && f.wipContent !== content)
                    shouldAutoSave = true;
                f.wipContent = content
            }
        }
    })
    if (shouldAutoSave)
        scheduleSave(path)
}

const saveTimeouts: Record<string, any> = {}

const scheduleSave = (path: string) => {
    if (saveTimeouts[path])
        return; // anyways going to get saved
    saveTimeouts[path] = setTimeout(() => {
        saveTimeouts[path] = undefined
        save(path)
    }, 500);
}

export const save = async (fileId?: string) => {
    const f = fileId
        ? store.get(filesStore.openFiles$).find(_ => _.path === fileId)
        : store.get(filesStore.currentFile$)
    if (!f) return
    const blob = new Blob([f.wipContent], {
        type: "text/markdown"
    })
    await fileSave(blob, {}, f.blob?.handle)
};

export const copy = async () => {
    toast.promise(
        navigator.clipboard.writeText(
            store.get(filesStore.currentFile$)?.wipContent ?? "",
        ),
        {
            success: "Copied to clipboard",
            error: "Failed to copy",
        },
    );
};

export const copyAsHTML = async () => {
};
