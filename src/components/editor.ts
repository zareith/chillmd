import { h } from "preact"
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor as TEditor } from '@toast-ui/react-editor'
import "../styles/toast-editor.css"
import { useEffect, useRef } from "preact/hooks"
import * as fileStore from "../stores/files"
import * as fileActions from "../actions/files"
import { produce } from "immer"
import { effect, signal } from "@preact/signals"
import { useDuckShortcut } from '@ahmedayob/duck-shortcut'


export default function Editor() {
	const editorRef = useRef<TEditor>()
	const id = signal<string>(fileStore.currentFile.value.id)

	useDuckShortcut({
		keys: ['ctrl+s'],
		onKeysPressed: fileActions.save
	})
	useDuckShortcut({
		keys: ['ctrl+o'],
		onKeysPressed: fileActions.open
	})

	effect(() => {
		if (fileStore.currentFile.value.id !== id.value) {
			const { content } = fileStore.currentFile.value
			editorRef.current?.getInstance()?.setMarkdown(content)
			id.value = fileStore.currentFile.value.id
		}
	});

	return h("div", {
		style: {
			height: "100%",
			position: "relative",
			overflow: "hidden"
		}
	},
		h(TEditor, {
			ref: editorRef,
			previewStyle: "tab",
			usageStatistics: false,
			height: "100%",
			initialValue: fileStore.currentFile.value.content,
			onChange: () => {
				const editor = editorRef.current;
				const md = editor.getInstance().getMarkdown()
				fileStore.currentFile.value = produce(fileStore.currentFile.value, d => {
					d.content = md
				})
			}
		}))
}
