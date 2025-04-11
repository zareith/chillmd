import * as S from '@stylexjs/stylex'
import SplitPane from "react-split-pane"
import { h, h_ } from "../utils/preact"
import { Header } from "rsuite"
import MenuBar from "./menu-bar"
import { useLocalStorage } from "react-use";
import IntroModal from "./intro-modal"
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from './side-nav';
import { FlexColS, FlexRowS } from './flex';
import EditorGroup from './editor-group';
import "../styles/resizer.css"
import { layout$ } from '../state/ui'
import { useLayoutWide } from '../hooks/use-is-wide'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'preact/hooks'

export default function App() {
    const [didDismissIntro, setDismissIntro] =
        // useState(false);
        useLocalStorage("chillmd:feat:intro", false)
    const isWide = useLayoutWide();
    const [splitSize, setSplitSize] = useState(40);
    const layout = useAtomValue(layout$)

    useEffect(() => {
        if (layout.openSidebar) {
            setSplitSize(300);
        } else {
            setSplitSize(40);
        }
    }, [layout.openSidebar]);

    return h(FlexColS, { ...S.props(s.container) },
        h_(Header,
            h_(MenuBar)),

        // Body
        h("div", {
            style: {
                flexGrow: 2,
                flexShrink: 1,
                position: "relative",
                width: "100%"
            }
        },
            isWide ?
                // Split layout on desktop
                h(SplitPane, {
                    split: "vertical",
                    minSize: 40,
                    allowResize: !!layout.openSidebar,
                    maxSize: layout.openSidebar
                        ? 500
                        : 40,
                    size: splitSize,
                    onChange: (newSize) => {
                        setSplitSize(newSize)
                    }
                },
                    h_(SideNav),
                    h_(EditorGroup))

                // Skip the editor group if sidebar
                // expanded on mobile
                : h(FlexRowS, {
                    style: {
                        height: "100%",
                        width: "100%"
                    }
                },
                    h_(SideNav),
                    layout.openSidebar
                        ? null
                        : h_(EditorGroup))),

        !didDismissIntro && h(IntroModal, {
            onClose: () => setDismissIntro(true)
        }),

        h(ToastContainer, {} as ToastContainerProps))
}

const s = S.create({
    container: {
        height: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    navItem: {
        width: "60px"
    }
})
