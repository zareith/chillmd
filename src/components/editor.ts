import "../styles/toast-editor.css";
import { effect, signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import * as fileActions from "../actions/files";
import * as fileStore from "../stores/files";
import { defineOptions, ink, Instance } from 'ink-mde'
import "./editor.css"
import { h } from "../utils/preact";

export default function Editor() {
    const file = fileStore.currentFile$.value
    const id = signal<string | null>(file?.id ?? null);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<Instance | null>(null);

    useEffect(() => {
        const containerEl = containerRef.current
        if (!containerEl) return
        const options = defineOptions({
            doc: file?.wipContent ?? "",
            interface: {
                toolbar: true,
                images: true,
                attribution: false,
            },
            hooks: {
                afterUpdate: (doc: string) => {
                    if (!id.value) return
                    fileActions.updateFile(id.value, doc);
                },
            },
        })
        ink(containerEl, options).then((inst) => {
            editorRef.current = inst
        })
        return () => {
            editorRef.current?.destroy()
        }
    }, [])

    effect(() => {
        if (!fileStore.currentFile$.value) {
            const firstId = fileStore.openFiles$.value[0]?.id
            if (firstId) fileActions.switchFile(firstId)
            else {
                const newId = fileActions.openNewFile();
                id.value = newId;
            }
        } else if (fileStore.currentFile$.value.id !== id.value) {
            const { wipContent } = fileStore.currentFile$.value;
            editorRef.current?.update(wipContent);
            id.value = fileStore.currentFile$.value.id;
        }
    });

    const handleContainerClick = () => {
        editorRef.current?.focus();
    }

    return h("div", {
        className: "chillmd-editor-container",
        tabIndex: -1,
        onClick: handleContainerClick,
        ref: containerRef,
    });
}
