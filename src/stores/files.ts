import { computed, signal } from "@preact/signals";
import { FileWithHandle } from "browser-fs-access";

export const openFiles$ = signal<{
  id: string;
  name: string;
  blob?: FileWithHandle
  wipContent: string
  isOpen: boolean
}[]>([]);

export const currentFile$ = computed(() => openFiles$.value.find(_ => _.isOpen));
