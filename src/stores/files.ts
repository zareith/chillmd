import { signal } from "@preact/signals";

export const newId = () => `${+new Date()}`

export const openFiles = signal<{
    id: string
    content: string,
    handle: FileSystemFileHandle
}[]>([])

export const currentFile = signal<{
    content: string
    id: string
    handle?: FileSystemFileHandle
}>({
    id: newId(),
    content: ""
})
