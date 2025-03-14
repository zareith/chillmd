import { h, h_ } from "../utils/preact";
import {
    MdDashboard,
    MdSettings,
} from 'react-icons/md';
import { Icon } from '@rsuite/icons';
import { Button } from 'rsuite';
import { layout$ } from '../stores/ui';
import { toggleN } from '../utils/bool';
import WorkspacePanel from './workspace-panel';
import "./side-nav.css"
import { FlexRowS } from './flex';
import { update } from "../utils/immer";

export default function SideNav() {
    return h(FlexRowS, {
        className: `chillmd-side-nav-container ${layout$.value.openSidebar ? "-expanded" : ""}`
    },
        h("div", {
            className: "chillmd-side-nav"
        },
            h(Button, {
                appearance: "subtle",
                startIcon: h(Icon, {
                    as: MdDashboard,
                }),
                onClick: () => {
                    update(layout$, v => {
                        v.openSidebar = toggleN("WORKSPACE", v.openSidebar)
                    })
                }
            }),
            h(Button, {
                appearance: "subtle",
                startIcon: h(Icon, {
                    as: MdSettings,
                }),
                onClick: () => {
                    update(layout$, v => {
                        v.openSidebar = toggleN("SETTINGS", v.openSidebar)
                    })
                }
            })),

        layout$.value.openSidebar && h("div", {
            className: "chillmd-side-nav-expanded"
        },
            h_(WorkspacePanel))
    );
}
