const cls = (...classes: (string | null | undefined | boolean)[]) =>
    classes.filter(_ => typeof _ === "string").join(" ")

const cname = (...classes: (string | null | undefined | boolean)[]) =>
({
    className: cls(...classes)
})