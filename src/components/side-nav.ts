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
import { useAtom } from "jotai";

export default function SideNav() {
    const [layout, setLayout] = useAtom(layout$)

    return h(FlexRowS, {
        className: `chillmd-side-nav-container ${layout.openSidebar ? "-expanded" : ""}`
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
                    setLayout(v => {
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
                    setLayout(v => {
                        v.openSidebar = toggleN("SETTINGS", v.openSidebar)
                    })
                }
            })),

        layout.openSidebar && h("div", {
            className: "chillmd-side-nav-expanded"
        },
            h_(WorkspacePanel))
    );
}
