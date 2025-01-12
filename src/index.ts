import { h, render } from "preact";
import "rsuite/dist/rsuite.min.css";
import "./styles/base.css";
import "virtual:stylex.css";
import App from "./components/app";
import Mousetrap from "mousetrap";
import * as fileActions from "./actions/files";
import { bindKbd } from "./utils/events";

bindKbd(["ctrl+s", "command+s"], fileActions.save);
bindKbd(["ctrl+o", "command+o"], fileActions.openFile);

render(h(App, {}), document.getElementById("app"));
