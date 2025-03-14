import * as S from '@stylexjs/stylex'
import { h, h_ } from "../utils/preact"
import { Icon } from '@rsuite/icons';
import { Container, Header, Content, Sidebar, Sidenav, Nav } from "rsuite"
import MenuBar from "./menu-bar"
import Editor from "./editor"
import { useLocalstorageState } from "rooks";
import IntroModal from "./intro-modal"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    MdDashboard,
    MdSettings,
} from 'react-icons/md';
import SideNav from './side-nav';
import { FlexRowC, FlexColS, FlexRowS } from './flex';
import { useState } from 'preact/hooks';

export default function App() {
    const [didDismissIntro, setDismissIntro] = useState(false); // useLocalstorageState("chillmd:feat:intro", false)

    return h(FlexColS, { ...S.props(s.container) },
        h_(Header,
            h_(MenuBar)),
        h("div", {
            style: {
                flexGrow: 2,
                flexShrink: 1,
                position: "relative",
                width: "100%"
            }
        },
            h(FlexRowS, {
                style: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }
            },
                h_(SideNav),
                h_(Editor))),
        !didDismissIntro && h(IntroModal, {
            onClose: () => setDismissIntro(true)
        }),
        h_(ToastContainer))
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
