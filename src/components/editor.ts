import "../styles/toast-editor.css";
import { useEffect, useRef, useState } from "preact/hooks";
import * as fileActions from "../actions/files";
import * as fileStore from "../stores/files";
import { defineOptions, ink, Instance } from 'ink-mde'
import "./editor.css"
import { h } from "../utils/preact";
import { useAtomValue } from "jotai";

export default function Editor() {
    const curFile = useAtomValue(fileStore.currentFile$);
    const [curPath, setCurPath] = useState<string | null>(curFile?.path ?? null);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<Instance | null>(null);
    const openFiles = useAtomValue(fileStore.openFiles$)

    useEffect(() => {
        const expectedPath = curFile?.path
        if (!expectedPath) {
            let nextPath = openFiles[0]?.path
            if (!nextPath) nextPath = fileActions.openNewFile()
            fileActions.switchFile(nextPath)
        } else if (curFile && (expectedPath !== curPath || !editorRef.current)) {
            const containerEl = containerRef.current
            if (containerEl) {
                const options = defineOptions({
                    doc: curFile?.wipContent ?? "",
                    interface: {
                        toolbar: true,
                        images: true,
                        attribution: false,
                    },
                    hooks: {
                        afterUpdate: (doc: string) => {
                            fileActions.updateFile(curFile.path, doc);
                        },
                    },
                })
                console.log("Creating editor for", curFile.path)
                setCurPath(curFile.path)
                ink(containerEl, options).then((inst) => {
                    console.log("Created editor for", curFile.path)
                    editorRef.current = inst
                })
            }
        }
        return () => {
            editorRef.current?.destroy()
        }
    }, [curFile?.path])

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
