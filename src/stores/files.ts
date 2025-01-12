import { signal } from "@preact/signals";
import { FileWithHandle } from "browser-fs-access";

export const newId = () => `${+new Date()}`;

export const openFiles = signal<{
  id: string;
  blob?: FileWithHandle
}[]>([]);

export const currentFile = signal<{
  content: string;
  id: string;
}>({
  id: newId(),
  content: "",
});
