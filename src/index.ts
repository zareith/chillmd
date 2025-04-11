import { render, VNode } from "preact";
import { h, h_ } from "./utils/preact"
import { setAutoFreeze } from "immer"
import "rsuite/dist/rsuite.min.css";
import "./styles/base.css";
import "virtual:stylex.css";
import App from "./components/app";
import * as fileActions from "./actions/files";
import { bindKbd } from "./utils/events";
import { Provider as JotaiProvider } from "jotai/react";
import { LocationProvider, ErrorBoundary, Router, Route } from "preact-iso"
import { store } from "./state/store";

// @ts-expect-error
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

// TODO Fix issues with rsuite tree
setAutoFreeze(false)

bindKbd(["ctrl+s", "command+s"], fileActions.save);
bindKbd(["ctrl+o", "command+o"], fileActions.openFile);

render(
    h(JotaiProvider, { store },
        h_(LocationProvider,
            h_(ErrorBoundary,
                h(Router, {
                    children: [
                        h(Route, {
                            path: "/",
                            component: App
                        }),
                        h(Route, {
                            path: "/ws/:workspaceId/:filePath*",
                            component: App,
                        }),
                    ] as VNode[]
                })))),
    document.getElementById("app")!
);
