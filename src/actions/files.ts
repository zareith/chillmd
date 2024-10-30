import * as filesStore from "../stores/files";
import downloadFile from "js-file-download"
import { produce } from "immer"
import { toast } from "react-toastify";

export const open = async () => {
    const [handle] = await window.showOpenFilePicker()
    const file = await handle.getFile()
    const content = await file.text()
    const id = filesStore.newId()

    filesStore.openFiles.value = produce(filesStore.openFiles.value, draft => {
        draft.push({
            id,
            content,
            handle,
        })
    });
    filesStore.currentFile.value = {
        id,
        content,
        handle
    }
}

export const save = async () => {
    const { id, content } = filesStore.currentFile.value;
    const handle = filesStore.currentFile.value.handle ?? await window.showSaveFilePicker({
        types: [{
            accept: {
                'text/plain': [".txt"],
                "text/markdown": [".md", ".markdown"]
            }
        }]
    })
    if (id) {
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
        filesStore.openFiles.value = produce(filesStore.openFiles.value, draft => {
            draft.forEach(item => {
                if (item.id === id) {
                    item.content = content;
                }
            })
        })
    }
}

export const download = async () => {
    downloadFile(
        filesStore.currentFile.value.content,
        'chillmd-doc.md'
    )
}

export const copy = async () => {
    toast.promise(navigator.clipboard.writeText(
        filesStore.currentFile.value.content,
    ), {
        success: "Copied to clipboard",
        error: "Failed to copy"
    })
}

export const copyAsHTML = async () => {

}