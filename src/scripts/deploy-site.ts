import ghpages from "gh-pages"

ghpages.publish("dist", e => {
    if (e) {
        console.error(e);
        process.exit(1);
    } else {
        process.exit(0);
    }
})