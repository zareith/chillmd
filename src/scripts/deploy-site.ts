// @ts-expect-error
import ghpages from "gh-pages";

ghpages.publish("dist", {
    nojekyll: true,
    cname: "notegobl.in",
}, (e: any) => {
  if (e) {
    console.error(e);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
