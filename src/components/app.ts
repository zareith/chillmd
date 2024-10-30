import { h } from "preact"
import * as S from '@stylexjs/stylex'
import { Container, Header, Content, Footer } from "rsuite"
import MenuBar from "./menu-bar"
import Editor from "./editor"
import { useLocalstorageState } from "rooks";
import IntroModal from "./intro-modal"
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export default function App() {
	const [didDismissIntro, setDismissIntro] = useLocalstorageState("chillmd:feat:intro", false)

	return h(Container, { ...S.props(s.container) },
		h(Header, {},
			h(MenuBar, {})),
		h(Content, {},
			h(Editor, {})),
		!didDismissIntro && h(IntroModal, {
			onClose: () => setDismissIntro(true)
		}),
		h(ToastContainer, {}))
}

const s = S.create({
	container: {
		height: "100vh",
		width: "100vw",
		padding: 0,
		margin: 0,
	}
})
