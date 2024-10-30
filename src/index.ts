import { render, h } from 'preact'
import 'rsuite/dist/rsuite.min.css'
import './styles/base.css'
import 'virtual:stylex.css'
import App from "./components/app"

render(h(App, {}), document.getElementById('app'))

