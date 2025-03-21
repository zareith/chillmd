import { useEffect, useRef } from "preact/hooks";
import * as fileAtoms from "../state/files";
import { h } from "../utils/preact";
import DOMPurify from "dompurify"
import { marked } from "marked"
import "./editor.css"
import { useAtomValue } from "jotai";

export default function Preview() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentFile = useAtomValue(fileAtoms.currentFile$)
    const previews = useAtomValue(fileAtoms.previews$)
    const preview = currentFile?.path
        ? previews[currentFile?.path]
        : null

    return h("div", {
        className: "chillmd-editor-container"
    },
        h("div", {
            className: "chillmd-preview-container"
        },
            h("div", {
                className: "chillmd-editor-preview",
                ref: containerRef,
                dangerouslySetInnerHTML: {
                    __html: preview ?? ""
                }
            })));

}