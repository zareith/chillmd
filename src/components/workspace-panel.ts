import { effect, useSignal } from "@preact/signals";
import { h, h_ } from "../utils/preact";
import { layout$ } from "../stores/ui";
import { workspaces$ } from "../stores/workspaces";
import * as filesStore from "../stores/files";
import { frag } from "../utils/preact";
import { Button, Tree, useToaster } from "rsuite";
import { FlexColC, FlexRowC } from "./flex";
import { MaybeN } from "../utils/types";
import { withToaster } from "../utils/with-toaster";
import { TreeNode } from "rsuite/esm/internals/Tree/types";
import { produce } from "immer";
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import "./workspace-panel.css"
import { useLayoutEffect, useRef } from "preact/hooks";

const maxDiscoveryLevel = 5;

interface FSTreeNode extends TreeNode {
    handle: FileSystemHandle
}

export default function WorkspacePanel() {
    const isCreating$ = useSignal(false)
    const dir$ = useSignal<MaybeN<FileSystemDirectoryHandle>>(null)
    const nodes$ = useSignal<FSTreeNode[]>([])
    const toaster = useToaster();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const treeH$ = useSignal(0)

    useLayoutEffect(() => {
        const bounds = containerRef.current?.getBoundingClientRect();
        treeH$.value = bounds.height
    })

    effect(() => {
        if (!dir$.value) {
            isCreating$.value = true;
            return;
        }
    })

    return h("div", {
        className: "chillmd-ws-panel",
        ref: containerRef,
    },
        isCreating$.value ?
            h(FlexColC, {
                style: {
                    padding: "10px"
                }
            },
                h(Button, {
                    appearance: "primary",
                    size: "xs",
                    onClick: async () => {
                        dir$.value = await window.showDirectoryPicker();
                        withToaster(async () => {
                            nodes$.value = await getNodesForDir(dir$.value)
                            isCreating$.value = false
                        }, {
                            toaster
                        })
                    }
                }, "Open Folder")) :

            treeH$.value
                ? h(Tree, {
                    data: nodes$.value,
                    getChildren,
                    height: treeH$.value,
                    renderTreeNode: node => {
                        const fsHandle = (node as FSTreeNode).handle
                        return h(FlexRowC, { style: { gap: 5, width: "100%" } },
                            fsHandle.kind === "directory" ?
                                h_(FolderFillIcon) :
                                h_(PageIcon),
                            node.label,
                        )
                    },
                    onSelect: async (node) => {
                        const fsHandle = (node as FSTreeNode).handle
                        if (fsHandle.kind !== "file") return
                        const blob = await (fsHandle as FileSystemFileHandle).getFile()
                        const id = filesStore.newId();
                        filesStore.openFiles$.value = produce(filesStore.openFiles$.value, d => {
                            d.push({ id, blob })
                        })
                        const content = await blob.text();
                        filesStore.currentFile$.value = { id, content }
                    },
                    showIndentLine: true,
                })
                : null
    )
}


const getChildren = async (node: TreeNode) => {
    const fsNode = node as FSTreeNode
    if (fsNode.handle.kind === "directory") {
        return getNodesForDir(fsNode.handle as FileSystemDirectoryHandle)
    }
    return null;
}

const getNodesForDir = async (dir: FileSystemDirectoryHandle) => {
    const nodes: FSTreeNode[] = [];
    for await (const [key, value] of dir.entries()) {
        nodes.push({
            label: key,
            handle: value,
            value: key,
            children: value.kind === "directory" ? [] : null
        })
    }
    return nodes;
}
