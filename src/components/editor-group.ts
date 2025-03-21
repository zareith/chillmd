import Spacer from "./spacer";
import { Toggle, IconButton, Tabs } from "rsuite";
import * as fileActions from "../actions/files"
import * as fileStore from "../stores/files";
import { h, h_ } from "../utils/preact";
import Editor from "./editor";
import { FlexColS, FlexRowC } from "./flex";
import "./editor-group.css"
import { FiX } from "react-icons/fi";
import Preview from "./preview";
import { useAtomValue, useSetAtom } from "jotai";

export default function EditorGroup() {
    const curFile = useAtomValue(fileStore.currentFile$)
    const previewing = curFile?.previewing

    return h(FlexColS, {
        className: "chillmd-ed-group-container"
    },
        previewing
            ? h_(Preview)
            : h_(Editor),

        h_(Footer))
}

function Footer() {
    const curFile = useAtomValue(fileStore.currentFile$)
    const setOpenFiles = useSetAtom(fileStore.openFiles$)
    const previewing = curFile?.previewing

    return h(FlexRowC, {
        className: "chillmd-ed-group-footer",
    },
        h_(TabStrip),

        h_(Spacer),

        // Preview toggle
        h(Toggle, {
            checked: previewing,
            onChange: (isChecked) => {
                setOpenFiles(files => {
                    for (const f of files) {
                        if (f.path === curFile?.path) {
                            f.previewing = isChecked
                        }
                    }
                })
            }
        }, "Preview"))
}

function TabStrip() {
    const openFiles = useAtomValue(fileStore.openFiles$)
    const curFile = useAtomValue(fileStore.currentFile$)
    const isSoloScratchBuffer = openFiles?.length === 1 && !curFile?.blob
    const isClosable = !isSoloScratchBuffer

    return h(Tabs, {
        activeKey: curFile?.path,
        appearance: "pills",
        onSelect: (fileId) => fileActions.switchFile("" + fileId)
    },
        openFiles.map((f, idx) => (
            h(Tabs.Tab, {
                eventKey: f.path,
                title: h(FlexRowC, {
                    style: {
                        gap: 5
                    }
                },
                    f.name,

                    isClosable && h(IconButton, {
                        onClick: () => {
                            fileActions.closeFile(f.path)
                        },
                        icon: h_(FiX),
                        size: "xs",
                        appearance: "subtle"
                    }))
            }))))
}
