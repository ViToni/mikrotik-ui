import { Notify } from "quasar";

function notifyError(error) {
    let message;
    if (isError(error)) {
        message = error.message;
    } else if (error) {
        message = "" + error;
    }
    if (message) {
        Notify.create({
            icon: "error",
            type: "negative",
            message,
            progress: true,
            position: "top-right",
            timeout: 3000
        });
    }
}

function isError(e) {
    return Object.prototype.toString.call(e) === "[object Error]";
}

export const Notifier = {
    onError: notifyError
};
