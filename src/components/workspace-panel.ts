import { FiFilePlus } from "react-icons/fi";
import path from "path-browserify"
import { sortBy } from "remeda"
import { FiCheck } from "react-icons/fi";
import { FiFolderPlus } from "react-icons/fi";
import { Dropdown, IconButton, Whisper, Popover, Input, InputGroup, WhisperInstance } from 'rsuite';
import { h, h_ } from "../utils/preact";
import { Button, Tree, useToaster } from "rsuite";
import { FlexColC, FlexRowC } from "./flex";
import { withToaster } from "../utils/with-toaster";
import { TreeNode } from "rsuite/esm/internals/Tree/types";
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import "./workspace-panel.css"
import { useCallback, useLayoutEffect, useRef, useState } from "preact/hooks";
import * as fileActions from "../actions/files";
import { deepFind, FSTreeNode, useWorkspace$, workspace$ } from "../state/files";
import { VNode } from "preact";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useLocation } from "preact-iso";

const AllowedFilesRegex = /.(md|markdown)$/i

export default function WorkspacePanel() {
    const wsStore = useWorkspace$()
    const isCreating = !wsStore.workspace
    const toaster = useToaster();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [treeH, setTreeH] = useState(0)
    const [selectedNode, setSelectedNode] = useState<FSTreeNode | null>(null)
    const newFileTriggerRef = useRef<WhisperInstance>(null)
    const newFolderTriggerRef = useRef<WhisperInstance>(null)
    const loc = useLocation();

    const onTriggerNewFile = useCallback((node: FSTreeNode) => {
        setSelectedNode(node)
        newFileTriggerRef.current?.open()
    }, [])

    const onTriggerNewDir = useCallback((node: FSTreeNode) => {
        setSelectedNode(node)
        newFolderTriggerRef.current?.open()
    }, [])

    useLayoutEffect(() => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (!bounds) return
        setTreeH(bounds.height)
    })

    const createNode = async (name: string, type: "file" | "dir") => {
        if (!wsStore.workspace) return;
        let parentDir = selectedNode?.dir?.handle ?? wsStore.workspace?.dir
        if (!parentDir) return
        let nextHandle: FileSystemHandle | null = null;
        if (type === "file") {
            nextHandle = await parentDir.getFileHandle(name, {
                create: true
            })
        } else if (type === "dir") {
            nextHandle = await parentDir.getDirectoryHandle(name, {
                create: true
            })
        }
        if (!nextHandle) return;
        const pathArr = selectedNode?.path?.split("/")
        let parentPath = pathArr?.slice(0, -1);
        const roots = wsStore.workspace?.nodes ?? []
        const node = parentPath
            ? deepFind(parentPath)
            : null
        const children = node ? (node.children ??= []) : roots
        children.push({
            path: selectedNode?.path
                ? selectedNode.children // If directory
                    ? path.join(selectedNode.path, name)
                    : path.join(path.dirname(selectedNode.path), name)
                : name,
            canOpen: type === "dir" || !!name.match(AllowedFilesRegex),
            name,
            label: name,
            value: name,
            handle: nextHandle,
            dir: parentDir ? {
                handle: parentDir
            } : undefined,
            children: type === "dir" ? [] : undefined
        })
        wsStore.updateNodes(_prev => [...roots])
    }

    return h("div", {
        className: "chillmd-ws-panel",
        ref: containerRef,
    },
        isCreating ?
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
                            const dir = await window.showDirectoryPicker({
                                startIn: "documents",
                                mode: "readwrite"
                            });
                            const nodes = await getNodesForDir(undefined, dir);
                            const id = nanoid();
                            wsStore.initWorkspace({ id, dir, nodes });
                            loc.route(`/ws/${id}`)
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
                    h("div", {
                        className: "chillmd-ws-title"
                    },
                        wsStore.workspace?.dir.name),
                    h(Whisper, {
                        ref: newFileTriggerRef,
                        placement: "bottom",
                        trigger: "click",
                        speaker: h(NewNodePopup, {
                            title: "New File",
                            onSubmit: (name: string) => {
                                newFileTriggerRef.current?.close();
                                createNode(name, "file")
                            }
                        }) as VNode<{}>,
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
                                newFolderTriggerRef.current?.close();
                                createNode(name, "dir")
                            }
                        }) as VNode<{}>,
                        children: h(IconButton, {
                            appearance: "subtle",
                            icon: h_(FiFolderPlus)
                        })
                    }),
                ),

                treeH
                    ? h(Tree, {
                        data: wsStore.workspace?.nodes ?? [],
                        showIndentLine: true,
                        getChildren,
                        height: treeH,
                        renderTreeNode: node =>
                            h(TreeNodeItem, {
                                node: node as FSTreeNode,
                                onTriggerNewFile,
                                onTriggerNewDir,
                            }),
                        onSelect: async (node) => {
                            const fsNode = node as FSTreeNode
                            setSelectedNode(fsNode)
                            const fsHandle = fsNode.handle
                            if (fsHandle.kind !== "file") return
                            if (!fsNode.canOpen) return
                            const fileHandle = fsHandle as FileSystemFileHandle
                            const blob = await fileHandle.getFile()
                            fileActions.openFile(fsNode.path, Object.assign(blob, {
                                handle: fileHandle
                            }))
                        },
                    })
                    : null))
}

function TreeNodeItem(p: {
    node: FSTreeNode
    onTriggerNewFile: (node: FSTreeNode) => void
    onTriggerNewDir: (node: FSTreeNode) => void
}) {
    const fsNode = p.node
    const fsHandle = fsNode.handle
    return h(Dropdown, {
        size: "sm",
        noCaret: true,
        renderToggle: p =>
            h(FlexRowC, {
                ...p,
                style: {
                    gap: 5,
                    width: "100%",
                    opacity: fsNode.canOpen ? 1 : 0.5
                },
            },
                fsHandle.kind === "directory" ?
                    h_(FolderFillIcon) :
                    h_(PageIcon),
                fsNode.label),
        trigger: "contextMenu",
    },
        fsHandle.kind === "file"
            ? h(Dropdown.Item, {
                onClick: () => {
                    fileActions.openFile(fsNode.path)
                }
            },
                "Open")
            : null,
        h(Dropdown.Item, {
            onClick: () => {
                fileActions.deleteFile(fsNode.path)
            }
        },
            "Delete"),
        fsHandle.kind === "directory"
            ? h(Dropdown.Item, {
                onClick: () => {
                    p.onTriggerNewDir(fsNode)
                }
            },
                "New File")
            : null,
        fsHandle.kind === "directory"
            ? h(Dropdown.Item, {
                onClick: () => {
                    p.onTriggerNewFile(fsNode)
                }
            }, "New Folder")
            : null)
}


const getChildren = async (node: TreeNode) => {
    const fsNode = node as FSTreeNode
    if (fsNode.children?.length) return fsNode.children
    if (fsNode.handle.kind === "directory") {
        return (fsNode.children = await getNodesForDir(fsNode.path, fsNode.handle as FileSystemDirectoryHandle))
    }
    return [];
}

const getNodesForDir = async (
    parentPath: string | undefined,
    dir: FileSystemDirectoryHandle,
) => {
    const nodes: FSTreeNode[] = [];

    for await (const [key, value] of dir.entries()) {
        if (key.match(/^(\.|_)/)) continue;
        const path = parentPath
            ? `${parentPath}/${key}`
            : key;
        nodes.push({
            path,
            name: key,
            label: key,
            handle: value,
            value: path,
            canOpen: value.kind === "directory" || !!path.match(AllowedFilesRegex),
            dir: value.kind === "directory" ? {
                handle: value
            } : parentPath ? {
                handle: dir
            } : undefined,
            children: value.kind === "directory" ? [] : undefined
        })
    }

    return sortBy(nodes, _ => (_.label as string).toLowerCase());
}

const NewNodePopup = (p: {
    title: string
    onSubmit: (name: string) => void
}) => {
    const [name, setName] = useState("")

    return h(Popover, {
        title: p.title,
        visible: true,
    },
        h_(InputGroup,
            h(Input, {
                placeholder: "Name",
                value: name,
                onChange: e => {
                    setName(e)
                },
                onKeyDown: e => {
                    if (e.key === "Enter") {
                        p.onSubmit(name)
                    }
                }
            }),
            h(InputGroup.Button, {
                onClick: () => p.onSubmit(name)
            },
                h_(FiCheck))))
}
