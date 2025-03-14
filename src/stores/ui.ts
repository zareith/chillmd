import { signal } from "@preact/signals";
import { MaybeN } from "../utils/types";

export type SidebarType = "WORKSPACE" | "SEARCH" | "SETTINGS";

export interface LayoutState {
  openSidebar?: MaybeN<SidebarType>
  tabs: TabState[]
  activeTabId?: MaybeN<string>
}

export interface PanelState {
  fileId: string
}

export type OrientationType = "HORIZONTAL" | "VERTICAL";

export interface TabState {
  panels: PanelState[]
  orientation: MaybeN<OrientationType>
}

export const layout$ = signal<LayoutState>({
  tabs: [],
});
