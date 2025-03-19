import { useRef } from "preact/hooks";
import * as fileStore from "../stores/files";
import { useSignalEffect } from "@preact/signals";
import { h } from "../utils/preact";
import DOMPurify from "dompurify"
import { marked } from "marked"
import "./editor.css"

export default function Preview() {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useSignalEffect(() => {
        const content = fileStore.currentFile$.value?.wipContent ?? "";
        Promise.resolve(marked.parse(content))
            .then(_ => DOMPurify.sanitize(_))
            .then(_ => {
                if (!containerRef.current) return
                containerRef.current.innerHTML = _
            })
    })

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