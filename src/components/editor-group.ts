import { IconButton, Tabs } from "rsuite";
import * as fileActions from "../actions/files"
import { currentFile$, openFiles$ } from "../stores/files";
import { h, h_ } from "../utils/preact";
import Editor from "./editor";
import { FlexColS, FlexRowC, FlexRowS } from "./flex";
import "./editor-group.css"
import { Fragment } from "preact/jsx-runtime";
import { FiX } from "react-icons/fi";

export default function EditorGroup() {
    return h(FlexColS, {
        className: "chillmd-ed-group-container"
    },
        h_(Editor),

        h(FlexRowS, {
            className: "chillmd-ed-group-footer",
        },
            h(Tabs, {
                activeKey: currentFile$.value?.id,
                appearance: "pills",
                onSelect: (fileId) => fileActions.switchFile("" + fileId)
            },
                openFiles$.value.map((f, idx) => (
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
                    }))))))
}

