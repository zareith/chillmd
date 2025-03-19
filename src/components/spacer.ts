import { memo } from "preact/compat";
import { h } from "../utils/preact";

export default memo(function Spacer() {
    return h("div", {
        style: { flexGrow: 1 }
    })
})