import { useEffect, useRef } from "preact/hooks";
import * as fileStore from "../stores/files";
import { h } from "../utils/preact";
import DOMPurify from "dompurify"
import { marked } from "marked"
import "./editor.css"
import { useAtomValue } from "jotai";

export default function Preview() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentFile = useAtomValue(fileStore.currentFile$)

    useEffect(() => {
        const content = currentFile?.wipContent ?? "";
        Promise.resolve(marked.parse(content))
            .then(_ => DOMPurify.sanitize(_))
            .then(_ => {
                if (!containerRef.current) return
                containerRef.current.innerHTML = _
            })
    }, [currentFile?.wipContent])

    return h("div", {
        className: "chillmd-editor-container"
    },
        h("div", {
            className: "chillmd-preview-container"
        },
            h("div", {
                className: "chillmd-editor-preview",
                ref: containerRef,
            })));

}