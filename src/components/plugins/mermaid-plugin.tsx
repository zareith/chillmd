// Adapted from https://github.com/mdx-editor/editor/blob/82a735733f3aec3c529eaa20f8a2f6b84096b2b3/src/examples/mermaid.tsx#L8
import { basicSetup, EditorView } from 'codemirror';
import { CodeBlockEditorDescriptor, CodeMirrorEditor, useCodeBlockEditorContext } from '@mdxeditor/editor'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'preact/compat'
import { mermaid as mermaidCMPlugin, mindmapTags } from 'codemirror-lang-mermaid';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { nanoid } from 'nanoid';
import { h } from '../../utils/preact';

mermaid.initialize({ startOnLoad: true })

const MermaidPreview: React.FC<{ code: string }> = ({ code }) => {
    const ref = useRef<HTMLDivElement>(null)
    const idRef = useRef(nanoid())

    useEffect(() => {
        if (ref.current) {
            void mermaid.render(idRef.current, code).then(({ svg }) => {
                ref.current!.innerHTML = svg
            })
        }
    }, [code])

    return h("div", { ref }, code)
}

export const MermaidCodeEditorDescriptor: CodeBlockEditorDescriptor = {
    match: (language, _meta) => {
        return language === 'mermaid' || language == 'mmd'
    },
    priority: 1,
    Editor: (props) =>
        h("div", {
            onKeyDown: e => {
                e.stopImmediatePropagation()
            }
        },
            h(CodeMirrorEditor, {
                ...props,
                language: "mermaid"
            }),
            h("div", {
                style: {
                    flex: 1
                }
            },
                h(MermaidPreview, {
                    code: props.code
                })))
}

const mmdHighlightStyle = HighlightStyle.define([
    { tag: mindmapTags.diagramName, color: '#9650c8' },
    { tag: mindmapTags.lineText1, color: '#ce9178' },
    { tag: mindmapTags.lineText2, color: 'green' },
    { tag: mindmapTags.lineText3, color: 'red' },
    { tag: mindmapTags.lineText4, color: 'magenta' },
    { tag: mindmapTags.lineText5, color: '#569cd6' },
]);
// TODO Add highlight styles to all languages

export const mermaidCMPlugins = [mermaidCMPlugin(), syntaxHighlighting(mmdHighlightStyle)]