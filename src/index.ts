import { h, render } from "preact";
import { setAutoFreeze } from "immer"
import "rsuite/dist/rsuite.min.css";
import "./styles/base.css";
import "virtual:stylex.css";
import App from "./components/app";
import * as fileActions from "./actions/files";
import { bindKbd } from "./utils/events";
import { Provider } from "jotai/react";
import { store } from "./stores/store";

// TODO Fix issues with rsuite tree
setAutoFreeze(false)

bindKbd(["ctrl+s", "command+s"], fileActions.save);
bindKbd(["ctrl+o", "command+o"], fileActions.openFile);

render(
    h(Provider, { store },
        h(App, {})),
    document.getElementById("app")!
);
