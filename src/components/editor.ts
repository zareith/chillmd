import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeAdmonitionType,
    codeBlockPlugin,
    CodeToggle,
    CreateLink,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    InsertAdmonition,
    InsertCodeBlock,
    InsertFrontmatter,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    quotePlugin,
    tablePlugin,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import { Fragment as Frag, h } from "preact";
import "@mdxeditor/editor/style.css";
import "../styles/toast-editor.css";
import { effect, signal } from "@preact/signals";
import { produce } from "immer";
import { useEffect, useRef } from "preact/hooks";
import * as fileActions from "../actions/files";
import * as fileStore from "../stores/files";

const plugins = [
    headingsPlugin(),
    directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
    frontmatterPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    listsPlugin(),
    codeBlockPlugin(),
    quotePlugin(),
    markdownShortcutPlugin(),
    tablePlugin(),

    toolbarPlugin({
        toolbarClassName: "my-classname",
        toolbarContents: () => h(Frag, {},
            h(UndoRedo, {}),
            h(BoldItalicUnderlineToggles, {}),
            h(BlockTypeSelect, {}),
            h(CreateLink, {}),
            h(InsertCodeBlock, {}),
            h(CodeToggle, {}),
            h(InsertThematicBreak, {}),
            h(ListsToggle, {}),
            h(InsertTable, {}),
            h(InsertFrontmatter, {}),
            h(InsertAdmonition, {}),
        ),
    }),
];

export default function Editor() {
    const id = signal<string>(fileStore.currentFile.value.id);
    const editorRef = useRef<MDXEditorMethods | null>(null);

    effect(() => {
        if (fileStore.currentFile.value.id !== id.value) {
            const { content } = fileStore.currentFile.value;
            editorRef.current?.setMarkdown(content);
            id.value = fileStore.currentFile.value.id;
        }
    });

    return h("div", {
        style: {
            height: "100%",
            position: "relative",
            overflow: "hidden",
        },
    },
        h(MDXEditor, {
            ref: editorRef,
            markdown: fileStore.currentFile.value.content,
            plugins,
            onChange: (md) => {
                fileStore.currentFile.value = produce(fileStore.currentFile.value, d => {
                    d.content = md;
                });
            },
        }),
    );
}
