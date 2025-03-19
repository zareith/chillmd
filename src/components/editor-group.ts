import { Toggle, IconButton, Tabs } from "rsuite";
import * as fileActions from "../actions/files"
import * as fileStore from "../stores/files";
import { h, h_ } from "../utils/preact";
import Editor from "./editor";
import { FlexColS, FlexRowC, FlexRowS } from "./flex";
import "./editor-group.css"
import { FiX } from "react-icons/fi";
import Preview from "./preview";

export default function EditorGroup() {
    const previewing = !!fileStore.currentFile$.value?.previewing
    return h(FlexColS, {
        className: "chillmd-ed-group-container"
    },
        previewing
            ? h_(Preview)
            : h_(Editor),

        h(FlexRowS, {
            className: "chillmd-ed-group-footer",
        },
            h(Tabs, {
                activeKey: fileStore.currentFile$.value?.id,
                appearance: "pills",
                onSelect: (fileId) => fileActions.switchFile("" + fileId)
            },
                fileStore.openFiles$.value.map((f, idx) => (
                    h(Tabs.Tab, {
                        eventKey: f.id,
                        title: h(FlexRowC, {
                            style: {
                                gap: 5
                            }
                        },
                            f.name,
                            h(IconButton, {
                                onClick: () => {
                                    fileActions.closeFile(f.id)
                                },
                                icon: h_(FiX),
                                size: "xs",
                                appearance: "subtle"
                            }))
                    })))),

            h("div", {
                style: { flexGrow: 1 }
            }),

            h(Toggle, {
                checked: previewing,
                onChange: (isChecked) => {
                    fileStore.updateCurrent(f => {
                        f.previewing = isChecked
                    })
                }
            }, "Preview")))
}

