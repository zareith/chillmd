import { Toaster, useToaster } from "rsuite";
import { MaybeP } from "./types";
import { Notification } from "rsuite"
import { h } from "./preact";

export interface ToasterOpts {
    toaster: Toaster
    suppress?: boolean
    messages?: {
        success?: boolean | string
        error?: boolean | string
    }
}

export const withToaster = async <T>(
    fn: () => MaybeP<T>,
    opts: ToasterOpts
) => {
    try {
        return await fn();
        if (opts?.messages?.success)
            opts.toaster.push(
                h(Notification, {
                    type: "success"
                },
                    opts.messages?.success === true
                        ? "Operation Successful"
                        : opts.messages?.success))
    } catch (e) {
        if (opts.messages?.error !== false) {
            opts.toaster.push(
                h(Notification, {
                    type: "error"
                },
                    opts.messages?.error === true
                        ? "Operation Failed"
                        : opts.messages?.error))
        }
        if (opts.suppress === false) throw e;
    }
}
