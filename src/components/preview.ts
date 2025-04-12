import { useRef } from "preact/hooks";
import * as fileAtoms from "../state/files";
import { h } from "../utils/preact";
import "./editor.css"
import { useAtomValue } from "jotai";

export default function Preview() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentFile = useAtomValue(fileAtoms.currentFile$)
    const previews = useAtomValue(fileAtoms.previews$)

    console.log({ previews })

    const preview = currentFile?.path
        ? previews[currentFile?.path]
        : null

    return h("div", {
        className: "ngoblin-editor-container"
    },
        h("div", {
            className: "ngoblin-preview-container"
        },
            h("div", {
                className: "ngoblin-editor-preview",
                ref: containerRef,
                dangerouslySetInnerHTML: {
                    __html: preview?.preview ?? ""
                }
            })));

}
