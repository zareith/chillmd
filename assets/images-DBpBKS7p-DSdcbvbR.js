var m=Object.defineProperty;var u=(s,a,t)=>a in s?m(s,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[a]=t;var d=(s,a,t)=>u(s,typeof a!="symbol"?a+"":a,t);import{S as g,E as p,s as y,R as h,D as o,b as f}from"./index-CCfa309r.js";class b extends f{constructor({url:t}){super();d(this,"url");this.url=t}eq(t){return t.url===this.url}toDOM(){const t=document.createElement("div"),e=t.appendChild(document.createElement("div")),r=e.appendChild(document.createElement("figure")),n=r.appendChild(document.createElement("img"));return t.setAttribute("aria-hidden","true"),t.className="cm-image-container",e.className="cm-image-backdrop",r.className="cm-image-figure",n.className="cm-image-img",n.src=this.url,t.style.paddingBottom="0.5rem",t.style.paddingTop="0.5rem",e.classList.add("cm-image-backdrop"),e.style.borderRadius="var(--ink-internal-border-radius)",e.style.display="flex",e.style.alignItems="center",e.style.justifyContent="center",e.style.overflow="hidden",e.style.maxWidth="100%",r.style.margin="0",n.style.display="block",n.style.maxHeight="var(--ink-internal-block-max-height)",n.style.maxWidth="100%",n.style.width="100%",t}}const v=()=>{const s=/!\[.*?\]\((?<url>.*?)\)/,a=e=>o.widget({widget:new b(e),side:-1,block:!0}),t=e=>{const r=[];return y(e).iterate({enter:({type:n,from:l,to:c})=>{if(n.name==="Image"){const i=s.exec(e.doc.sliceString(l,c));i&&i.groups&&i.groups.url&&r.push(a({url:i.groups.url}).range(e.doc.lineAt(l).from))}}}),r.length>0?h.of(r):o.none};return[g.define({create(e){return t(e)},update(e,r){return r.docChanged?t(r.state):e.map(r.changes)},provide(e){return p.decorations.from(e)}})]};export{v as images};
