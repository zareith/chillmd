import { h } from "preact";
import * as S from '@stylexjs/stylex'
import { Modal } from "rsuite";

export default function IntroModal(p: {
    onClose: () => void
}) {
    return h(Modal, { open: true, onClose: p.onClose },
        h(Modal.Header, {},
            h(Modal.Title, { ...S.props(s.title) },
                "Welcome")),
        h(Modal.Body, {},
            h("div", { ...S.props(s.primaryLogoContainer) },
                h("img", {
                    src: "/logo.svg",
                    width: 100,
                    ...S.props(s.logo)
                })),

            h("p", {
                ...S.props(s.introPara),
            },
                "Chillmd is a privacy focussed markdown editor that works entirely in your brower"),

            h("table", {},
                h("tbody", {},

                    h("tr", {},
                        h("td", { ...S.props(s.logoColCell) },
                            h("a", {
                                href: "https://www.gnu.org/licenses/gpl-3.0.en.html",
                                target: "_blank",
                            },
                                h("img", { src: "/gplv3-logo.png", width: 80 }))),
                        h("td", {},
                            h("p", {},
                                "This project is free as in free speech and licensed under open source ",
                                h("a", {
                                    href: "https://www.gnu.org/licenses/gpl-3.0.en.html"
                                },
                                    "GPLv3.0 license.")))),

                    h("tr", {},
                        h("td", { ...S.props(s.logoColCell) },
                            h("a", {
                                href: "https://github.com/zareith/chillmd",
                                target: "_blank",
                            },
                                h("img", { src: "/github-mark.svg", width: 30 }))),
                        h("td", {},
                            h("p", {}, "Your feedback and contributions are welcome.")))))))
}

const s = S.create({
    primaryLogoContainer: {
        textAlign: "center",
        marginTop: "40px"
    },
    title: {
        textAlign: "center",
    },
    introPara: {
        marginBottom: "40px",
        fontSize: "1.2rem",
        textAlign: "center",
    },
    logo: {
        width: "100px",
        display: "inline-block",
        marginBottom: "20px"
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        marginTop: "20px",
    },
    logoColCell: {
        textAlign: "right",
        paddingRight: "10px"
    }
})