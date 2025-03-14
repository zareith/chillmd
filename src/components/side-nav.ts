import * as S from '@stylexjs/stylex'
import { frag, h, h_ } from "../utils/preact";
import {
    MdDashboard,
    MdSettings,
} from 'react-icons/md';
import { Icon } from '@rsuite/icons';
import { Button } from 'rsuite';
import { layout$ } from '../stores/ui';
import { produce } from 'immer';
import { toggleN } from '../utils/bool';
import WorkspacePanel from './workspace-panel';

export default function SideNav() {
    return frag(
        h("div", { ...S.props(s.container) },
            h(Button, {
                appearance: "subtle",
                startIcon: h(Icon, {
                    as: MdDashboard,
                }),
                onClick: () => {
                    layout$.value = produce(layout$.value, v => {
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
                    layout$.value = produce(layout$.value, v => {
                        v.openSidebar = toggleN("SETTINGS", v.openSidebar)
                    })
                }
            })),
        layout$.value.openSidebar && h("div", { ...S.props(s.expandedContainer) },
            h_(WorkspacePanel))
    );
}

const s = S.create({
    container: {
        background: "var(--rs-gray-200)",
        borderRight: "1px solid var(--rs-gray-200)",
        display: "flex",
        flexDirection: "column",
    },
    expandedContainer: {
        background: "var(--rs-gray-50)",
        borderRight: "1px solid var(--rs-gray-200)",
        display: "flex",
        flexDirection: "column",
        flexBasis: "300px",
        flexGrow: 0,
        flexShrink: 0,
    },
    item: {
        padding: "10px",
        display: "block",
    }
})
