import hotkeys from 'hotkeys-js'

hotkeys.filter = () => true;

export const bindKbd = (
    keys: string | string[],
    callback: () => void,
) => {
    const combinedKeys = Array.isArray(keys)
        ? keys.join(",")
        : keys;
    hotkeys(combinedKeys, (e) => {
        e.stopPropagation();
        e.preventDefault();
        callback();
    })
}
