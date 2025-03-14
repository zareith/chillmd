import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    codeMirrorPlugin,
    CodeToggle,
    CreateLink,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    InsertAdmonition,
    InsertCodeBlock,
    InsertFrontmatter,
    InsertImage,
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
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import { Fragment as Frag, h } from "preact";
import "@mdxeditor/editor/style.css";
import "./editor.css"
import "../styles/toast-editor.css";
import { effect, signal } from "@preact/signals";
import { useRef } from "preact/hooks";
import * as fileActions from "../actions/files";
import * as fileStore from "../stores/files";
import { h_ } from "../utils/preact";
import { nanoid } from "nanoid";
import { fileSave } from "browser-fs-access";

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
    imagePlugin({
        async imageUploadHandler(image: File) {
            let fileName = "pasted-image-" + nanoid();
            if (image.type) {
                const { default: mime } = await import("mime")
                const ext = mime.getExtension(image.type)
                if (ext) fileName += `.${ext}`
            }
            await fileSave(image, {
                fileName
            })
            return URL.createObjectURL(image)
        }
    }),

    toolbarPlugin({
        toolbarContents: () => h_(Frag,
            h_(UndoRedo),
            h_(BoldItalicUnderlineToggles),
            h_(BlockTypeSelect),
            h_(CreateLink),
            h_(CodeToggle),
            h_(InsertThematicBreak),
            h_(ListsToggle),
            h_(InsertTable),
            h_(InsertFrontmatter),
            h_(InsertAdmonition),
            h_(InsertCodeBlock),
            h_(InsertImage)
        ),
    }),
];

export default function Editor() {
    const id = signal<string | null>(fileStore.currentFile$.value?.id);
    const editorRef = useRef<MDXEditorMethods | null>(null);

    effect(() => {
        if (!fileStore.currentFile$.value) {
            const firstId = fileStore.openFiles$.value[0]?.id
            if (firstId) fileActions.switchFile(firstId)
            else {
                const newId = fileActions.openNewFile();
                id.value = newId;
            }
        } else if (fileStore.currentFile$.value.id !== id.value) {
            const { wipContent } = fileStore.currentFile$.value;
            editorRef.current?.setMarkdown(wipContent);
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
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
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
            h("div", {
                style: {
                    position: "relative",
                    height: "100%",
                    width: "100%",
                },
            },
                h(MDXEditor, {
                    ref: editorRef,
                    markdown: fileStore.currentFile$.value?.wipContent ?? "",
                    plugins,
                    onChange: (md) => {
                        fileActions.updateFile(fileStore.currentFile$.value.id, md)
                    },
                })),
        ));
}
