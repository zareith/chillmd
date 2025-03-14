import { Signal } from "@preact/signals";
import { Draft, produce, setAutoFreeze } from "immer";

// This causes issues with rsuite
// TODO Remove after completely decoupling ui from store
setAutoFreeze(false)

export const update = <T> (sig: Signal<T>, mutate: (t: Draft<T>) => void) => {
    sig.value = produce(sig.value, mutate)
}