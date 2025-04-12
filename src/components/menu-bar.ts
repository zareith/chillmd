import * as S from "@stylexjs/stylex";
import { h } from "preact";
import { ButtonToolbar, Dropdown } from "rsuite";
import * as fileActions from "../actions/files";

export default function MenuBar() {
    const dropdownProps: any = { // DEBUG issues with rsuite types
        appearance: "subtle",
        size: "xs",
    };

    return h(ButtonToolbar, {
            ...S.props(s.container),
        },
        h("img", {
            src: "logo.svg",
            height: 30,
            width: 30,
            ...S.props(s.logo),
        }),
        h(Dropdown, {
                title: "File",
                ...dropdownProps,
            },
            h(Dropdown.Item, {
                onClick: () => fileActions.openFile(),
            }, "Open"),
            h(Dropdown.Item, {
                onClick: () => fileActions.save(),
            }, "Save"),
            h(Dropdown.Menu, {
                title: "Copy As"
            },
                h(Dropdown.Item, {
                    onClick: fileActions.copy,
                }, "Markdown"),
            ),
        ),
        // h(Dropdown, {
        // 	title: "Edit",
        // 	...dropdownProps,
        // },
        // 	h(Dropdown.Item, {},
        // 		"Cut"),
        // 	h(Dropdown.Item, {},
        // 		"Copy"),
        // 	h(Dropdown.Item, {},
        // 		"Paste")),
        h(Dropdown, {
                title: "Help",
                ...dropdownProps,
            },
            h(Dropdown.Item, {
                onClick: () => window.open("https://www.markdownguide.org/basic-syntax/"),
            }, "Markdown Syntax"),
            h(Dropdown.Item, {
                onClick: () => window.open("https://www.gnu.org/licenses/gpl-3.0.en.html"),
            }, "License"),
            h(Dropdown.Item, {
                onClick: () => window.open("https://github.com/zareith/note-goblin"),
            }, "Source code"),
        ),
    );
}

const s = S.create({
    container: {
        background: "var(--rs-gray-50)",
        borderBottom: "1px solid var(--rs-gray-200)",
        paddingTop: "5px",
        paddingBottom: "5px",
    },
    logo: {
        marginLeft: "10px",
    },
});
