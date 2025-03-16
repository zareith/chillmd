import { FiFilePlus } from "react-icons/fi";
import { sortBy } from "remeda"
import { FiCheck } from "react-icons/fi";
import { FiFolderPlus } from "react-icons/fi";
import { nanoid } from "nanoid"
import { Dropdown, IconButton, Whisper, Popover, Input, InputGroup, WhisperInstance } from 'rsuite';
import { useComputed, useSignal } from "@preact/signals";
import { h, h_ } from "../utils/preact";
import { Button, Tree, useToaster } from "rsuite";
import { FlexColC, FlexRowC } from "./flex";
import { withToaster } from "../utils/with-toaster";
import { TreeNode } from "rsuite/esm/internals/Tree/types";
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import "./workspace-panel.css"
import { useLayoutEffect, useRef } from "preact/hooks";
import * as fileActions from "../actions/files";
import { deepFind, FSTreeNode, workspace$ } from "../stores/files";


export default function WorkspacePanel() {
    const isCreating$ = useComputed(() => !workspace$.value)
    const toaster = useToaster();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const treeH$ = useSignal(0)
    const treeKey$ = useSignal(nanoid())
    const selectedNode$ = useSignal<FSTreeNode | null>(null)
    const newFileTriggerRef = useRef<WhisperInstance>(null)
    const newFolderTriggerRef = useRef<WhisperInstance>(null)

    useLayoutEffect(() => {
        const bounds = containerRef.current?.getBoundingClientRect();
        treeH$.value = bounds.height
    })

    const createNode = async (name: string, type: "file" | "dir") => {
        let parentDir = selectedNode$.value?.dir?.handle ?? workspace$.value?.dir
        if (!parentDir) return
        const id = nanoid();
        let nextHandle: FileSystemHandle;
        if (type === "file") {
            nextHandle = await parentDir.getFileHandle(name, {
                create: true
            })
        } else if (type === "dir") {
            nextHandle = await parentDir.getDirectoryHandle(name, {
                create: true
            })
        }
        const parentId = selectedNode$.value?.dir?.id
        const roots = workspace$.value.nodes
        const node = parentId ? deepFind(roots, parentId) : null
        const children = node ? (node.children ??= []) : roots
        children.push({
            id,
            label: name,
            value: name,
            handle: nextHandle,
            dir: parentId ? {
                id: parentId,
                handle: parentDir
            } : undefined,
            children: type === "dir" ? [] : undefined
        })
        workspace$.value = {
            ...workspace$.value,
            nodes: [...roots],
        }
    }

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
                        withToaster(async () => {
                            const dir = await window.showDirectoryPicker();
                            const nodes = await getNodesForDir(undefined, dir);
                            workspace$.value = { dir, nodes }
                        }, {
                            toaster
                        })
                    }
                }, "Open Folder")) :

            h("div", {
                className: "chillmd-ws-tree"
            },
                h("div", {
                    className: "chillmd-ws-header"
                },
                    h("div", { className: "chillmd-ws-title" },
                        workspace$.value.dir.name),
                    h(Whisper, {
                        ref: newFileTriggerRef,
                        placement: "bottom",
                        trigger: "click",
                        speaker: h(NewNodePopup, {
                            title: "New File",
                            onSubmit: (name: string) => {
                                newFileTriggerRef.current.close();
                                createNode(name, "file")
                            }
                        }),
                        children: h(IconButton, {
                            appearance: "subtle",
                            icon: h_(FiFilePlus),
                        })
                    }),
                    h(Whisper, {
                        ref: newFolderTriggerRef,
                        placement: "bottom",
                        trigger: "click",
                        speaker: h(NewNodePopup, {
                            title: "New Folder",
                            onSubmit: (name: string) => {
                                newFolderTriggerRef.current.close();
                                createNode(name, "dir")
                            }
                        }),
                        children: h(IconButton, {
                            appearance: "subtle",
                            icon: h_(FiFolderPlus)
                        })
                    }),
                ),

                treeH$.value
                    ? h(Tree, {
                        data: workspace$.value.nodes ?? [],
                        showIndentLine: true,
                        key: treeKey$.value,
                        getChildren,
                        height: treeH$.value,
                        renderTreeNode: node => {
                            const fsNode = node as FSTreeNode
                            const fsHandle = fsNode.handle
                            return h(Dropdown, {
                                size: "sm",
                                noCaret: true,
                                renderToggle: p =>
                                    h(FlexRowC, {
                                        ...p,
                                        style: { gap: 5, width: "100%" }
                                    },
                                        fsHandle.kind === "directory" ?
                                            h_(FolderFillIcon) :
                                            h_(PageIcon),
                                        node.label),
                                trigger: "contextMenu",
                            },
                                fsHandle.kind === "file"
                                    ? h(Dropdown.Item, {
                                        onClick: () => {
                                            fileActions.openFile(fsNode.id)
                                        }
                                    },
                                        "Open")
                                    : null,
                                h(Dropdown.Item, {
                                    onClick: () => {
                                        fileActions.deleteFile(fsNode.id)
                                    }
                                },
                                    "Delete"),
                                fsHandle.kind === "directory"
                                    ? h(Dropdown.Item, {
                                        onClick: () => {
                                            selectedNode$.value = fsNode
                                            newFileTriggerRef.current?.open()
                                        }
                                    },
                                        "New File")
                                    : null,
                                fsHandle.kind === "directory"
                                    ? h(Dropdown.Item, {
                                        onClick: () => {
                                            selectedNode$.value = fsNode
                                            newFolderTriggerRef.current?.open()
                                        }
                                    }, "New Folder")
                                    : null)
                        },
                        onSelect: async (node) => {
                            const fsNode = node as FSTreeNode
                            selectedNode$.value = fsNode
                            const fsHandle = fsNode.handle
                            if (fsHandle.kind !== "file") return
                            const fileHandle = fsHandle as FileSystemFileHandle
                            const blob = await fileHandle.getFile()
                            fileActions.openFile(fsNode.id, Object.assign(blob, {
                                handle: fileHandle
                            }))
                        },
                    })
                    : null))
}


const getChildren = async (node: TreeNode) => {
    const fsNode = node as FSTreeNode
    if (fsNode.children?.length) return fsNode.children
    if (fsNode.handle.kind === "directory") {
        return (fsNode.children = await getNodesForDir(fsNode.id, fsNode.handle as FileSystemDirectoryHandle))
    }
    return null;
}

const getNodesForDir = async (
    parentId: string | undefined,
    dir: FileSystemDirectoryHandle,
) => {
    const nodes: FSTreeNode[] = [];

    for await (const [key, value] of dir.entries()) {
        if (key.match(/^(\.|_)/)) continue;
        const id = nanoid();
        nodes.push({
            id,
            label: key,
            handle: value,
            value: id,
            dir: value.kind === "directory" ? {
                id,
                handle: value
            } : parentId ? {
                id: parentId,
                handle: dir
            } : undefined,
            children: value.kind === "directory" ? [] : null
        })
    }

    return sortBy(nodes, _ => (_.label as string).toLowerCase());
}

const NewNodePopup = (p: {
    title: string
    onSubmit: (name: string) => void
}) => {
    const name$ = useSignal("")

    return h(Popover, {
        title: p.title,
        visible: true,
    },
        h_(InputGroup,
            h(Input, {
                placeholder: "Name",
                value: name$.value,
                onChange: e => {
                    name$.value = e
                },
                onKeyDown: e => {
                    if (e.key === "Enter") {
                        p.onSubmit(name$.value)
                    }
                }
            }),
            h(InputGroup.Button, {
                onClick: () => p.onSubmit(name$.value)
            },
                h_(FiCheck))
        ))
}