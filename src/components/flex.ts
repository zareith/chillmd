import { h } from "preact";
import { CSSProperties, PropsWithChildren } from "preact/compat";

export type BoxProps = PropsWithChildren<{
    id?: string
    className?: string
    style?: CSSProperties
}>;

export const FlexColS = (p: BoxProps) => h("div", {
    ...p,
    style: {
        ...p.style,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
    }
})

export const FlexColC = (p: BoxProps) => h("div", {
    ...p,
    style: {
        ...p.style,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
})

export const FlexRowS = (p: BoxProps) => h("div", {
    ...p,
    style: {
        ...p.style,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch"
    }
})

export const FlexRowC = (p: BoxProps) => h("div", {
    ...p,
    style: {
        ...p.style,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
})
