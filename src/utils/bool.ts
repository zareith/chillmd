import { MaybeN } from "./types";

export const toggleN = <T>(targetVal: T, curVal: MaybeN<T>) => {
    if (curVal === targetVal) return null;
    return targetVal;
}
