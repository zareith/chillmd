import { produce } from "immer";
import downloadFile from "js-file-download";
import { toast } from "react-toastify";
import * as filesStore from "../stores/files";
import {
    fileOpen,
    directoryOpen,
    fileSave,
    supported,
    FileWithHandle,
} from 'browser-fs-access';
import { nanoid } from "nanoid";

export const openFile = async (id?: string, blob?: FileWithHandle) => {
    id ??= nanoid();
    blob ??= await fileOpen({
        extensions: [".markdown", ".md", ".txt", ".text"],
        mimeTypes: ["text/*"]
    })
    const wipContent = await blob.text()
    filesStore.openFiles$.value = produce(filesStore.openFiles$.value, draft => {
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
    filesStore.openFiles$.value = produce(filesStore.openFiles$.value, draft => {
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

export const switchFile = async (fileId: string) => {
    filesStore.openFiles$.value = produce(filesStore.openFiles$.value, draft => {
        draft.forEach(_ => {
            _.isOpen = _.id === fileId
        })
    });
}

export const save = async () => {
    const f = filesStore.currentFile$.value
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
