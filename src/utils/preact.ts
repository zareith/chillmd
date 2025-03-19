import { Attributes, ClassAttributes, ComponentChild, ComponentChildren, ComponentType, Fragment, h, VNode } from "preact";

export { h }

export function h_<T extends HTMLElement>(
	type: keyof h.JSX.IntrinsicElements,
	...children: ComponentChildren[]
): VNode<ClassAttributes<T>>;
export function h_<T extends HTMLElement>(
	type: keyof h.JSX.IntrinsicElements,
	...children: ComponentChildren[]
): VNode<ClassAttributes<T>>;
// export function h_<T extends HTMLElement>(
// 	type: string,
// 	...children: ComponentChildren[]
// ): VNode<
// 	| (ClassAttributes<T> &
// 			h.JSX.HTMLAttributes &
// 			h.JSX.SVGAttributes)
// 	| null
// >;
export function h_(
	type: ComponentType<object>,
	...children: ComponentChildren[]
): VNode<Attributes>;
export function h_(type: unknown, ...children: ComponentChildren[]) {
    return h(type as any, {}, ...children);
}

export const frag = (...children: ComponentChildren[]) =>
    h(Fragment, {}, ...children);
