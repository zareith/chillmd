import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeAdmonitionType,
    ChangeCodeMirrorLanguage,
    codeBlockPlugin,
    codeMirrorPlugin,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    InsertAdmonition,
    InsertCodeBlock,
    InsertFrontmatter,
    InsertSandpack,
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
    ShowSandpackInfo,
    tablePlugin,
    thematicBreakPlugin,
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
    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
    codeMirrorPlugin({
        codeBlockLanguages: {
            ts: "TypeScript",
            js: 'JavaScript',
            css: 'CSS',
            sql: "SQL",
            yaml: "YAML",
            go: "GO",
        }
    }),
    quotePlugin(),
    markdownShortcutPlugin(),
    tablePlugin(),
    thematicBreakPlugin(),

    toolbarPlugin({
        toolbarContents: () => h(Frag, {},
            h(UndoRedo, {}),
            h(BoldItalicUnderlineToggles, {}),
            h(BlockTypeSelect, {}),
            h(CreateLink, {}),
            h(CodeToggle, {}),
            h(InsertThematicBreak, {}),
            h(ListsToggle, {}),
            h(InsertTable, {}),
            h(InsertFrontmatter, {}),
            h(InsertAdmonition, {}),
            h(InsertCodeBlock, {}),
        ),
    }),
];

export default function Editor() {
    const id = signal<string>(fileStore.currentFile$.value.id);
    const editorRef = useRef<MDXEditorMethods | null>(null);

    effect(() => {
        if (fileStore.currentFile$.value.id !== id.value) {
            const { content } = fileStore.currentFile$.value;
            editorRef.current?.setMarkdown(content);
            id.value = fileStore.currentFile$.value.id;
        }
    });

    return h("div", {
        style: {
            position: "relative",
            flexGrow: 1,
            flexShrink: 1,
        }
    },
        h("div", {
            style: {
                height: "100%",
                position: "relative",
                overflow: "auto",
            },
            tabIndex: -1,
            onClick: (e) => {
                // Skip when items inside editor are clicked - because it interferes with functionality of
                // some built in components
                if (e.target instanceof Node)
                    for (const tbar of [...document.querySelectorAll('.mdxeditor')]) {
                        if (tbar.contains(e.target)) return;
                    }
                editorRef.current?.focus()
            }
        },
            h(MDXEditor, {
                ref: editorRef,
                markdown: fileStore.currentFile$.value.content,
                plugins,
                onChange: (md) => {
                    fileStore.currentFile$.value = produce(fileStore.currentFile$.value, d => {
                        d.content = md;
                    });
                },
            }),
        ));
}
