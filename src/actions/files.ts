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

export const openFile = async () => {
    const blob = await fileOpen({
        extensions: [".markdown", ".md", ".txt", ".text"],
        mimeTypes: ["text/*"]
    })
    const id = filesStore.newId();
    filesStore.openFiles$.value = produce(filesStore.openFiles$.value, draft => {
        draft.push({
            id,
            blob
        });
    });
    filesStore.currentFile$.value = {
        id,
        content: await blob.text(),
    };
};

export const save = async () => {
    const { id, content } = filesStore.currentFile$.value;
    const opened = filesStore.openFiles$.value.find(of => of.id === id)
    const blob = new Blob([content], {
        type: "text/markdown"
    })
    await fileSave(blob, {}, opened.blob?.handle)
};

export const copy = async () => {
    toast.promise(
        navigator.clipboard.writeText(
            filesStore.currentFile$.value.content,
        ),
        {
            success: "Copied to clipboard",
            error: "Failed to copy",
        },
    );
};

export const copyAsHTML = async () => {
};
