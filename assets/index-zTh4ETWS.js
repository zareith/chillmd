import{P as fe,a3 as R,h as v,E as g,j as f,a4 as de,a5 as pe,S as Z,g as ee,V as me,D as V,r as ge,a6 as xe,a7 as ye,a8 as Se,f as Me,a9 as m,aa as te,z as be}from"./index-CCfa309r.js";function h(){var t=arguments[0];typeof t=="string"&&(t=document.createElement(t));var e=1,n=arguments[1];if(n&&typeof n=="object"&&n.nodeType==null&&!Array.isArray(n)){for(var r in n)if(Object.prototype.hasOwnProperty.call(n,r)){var s=n[r];typeof s=="string"?t.setAttribute(r,s):s!=null&&(t[r]=s)}e++}for(;e<arguments.length;e++)ne(t,arguments[e]);return t}function ne(t,e){if(typeof e=="string")t.appendChild(document.createTextNode(e));else if(e!=null)if(e.nodeType!=null)t.appendChild(e);else if(Array.isArray(e))for(var n=0;n<e.length;n++)ne(t,e[n]);else throw new RangeError("Unsupported child node: "+e)}const J=typeof String.prototype.normalize=="function"?t=>t.normalize("NFKD"):t=>t;class k{constructor(e,n,r=0,s=e.length,i,l){this.test=l,this.value={from:0,to:0},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(r,s),this.bufferStart=r,this.normalize=i?a=>i(J(a)):J,this.query=this.normalize(n)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return xe(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let n=ye(e),r=this.bufferStart+this.bufferPos;this.bufferPos+=Se(e);let s=this.normalize(n);if(s.length)for(let i=0,l=r;;i++){let a=s.charCodeAt(i),c=this.match(a,l,this.bufferPos+this.bufferStart);if(i==s.length-1){if(c)return this.value=c,this;break}l==r&&i<n.length&&n.charCodeAt(i)==a&&l++}}}match(e,n,r){let s=null;for(let i=0;i<this.matches.length;i+=2){let l=this.matches[i],a=!1;this.query.charCodeAt(l)==e&&(l==this.query.length-1?s={from:this.matches[i+1],to:r}:(this.matches[i]++,a=!0)),a||(this.matches.splice(i,2),i-=2)}return this.query.charCodeAt(0)==e&&(this.query.length==1?s={from:n,to:r}:this.matches.push(1,n)),s&&this.test&&!this.test(s.from,s.to,this.buffer,this.bufferStart)&&(s=null),s}}typeof Symbol<"u"&&(k.prototype[Symbol.iterator]=function(){return this});const re={from:-1,to:-1,match:/.*/.exec("")},B="gm"+(/x/.unicode==null?"":"u");class se{constructor(e,n,r,s=0,i=e.length){if(this.text=e,this.to=i,this.curLine="",this.done=!1,this.value=re,/\\[sWDnr]|\n|\r|\[\^/.test(n))return new ie(e,n,r,s,i);this.re=new RegExp(n,B+(r!=null&&r.ignoreCase?"i":"")),this.test=r==null?void 0:r.test,this.iter=e.iter();let l=e.lineAt(s);this.curLineStart=l.from,this.matchPos=q(e,s),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let n=this.matchPos<=this.to&&this.re.exec(this.curLine);if(n){let r=this.curLineStart+n.index,s=r+n[0].length;if(this.matchPos=q(this.text,s+(r==s?1:0)),r==this.curLineStart+this.curLine.length&&this.nextLine(),(r<s||r>this.value.to)&&(!this.test||this.test(r,s,n)))return this.value={from:r,to:s,match:n},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}}const Q=new WeakMap;class b{constructor(e,n){this.from=e,this.text=n}get to(){return this.from+this.text.length}static get(e,n,r){let s=Q.get(e);if(!s||s.from>=r||s.to<=n){let a=new b(n,e.sliceString(n,r));return Q.set(e,a),a}if(s.from==n&&s.to==r)return s;let{text:i,from:l}=s;return l>n&&(i=e.sliceString(n,l)+i,l=n),s.to<r&&(i+=e.sliceString(s.to,r)),Q.set(e,new b(l,i)),new b(n,i.slice(n-l,r-l))}}class ie{constructor(e,n,r,s,i){this.text=e,this.to=i,this.done=!1,this.value=re,this.matchPos=q(e,s),this.re=new RegExp(n,B+(r!=null&&r.ignoreCase?"i":"")),this.test=r==null?void 0:r.test,this.flat=b.get(e,s,this.chunkEnd(s+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,n=this.re.exec(this.flat.text);if(n&&!n[0]&&n.index==e&&(this.re.lastIndex=e+1,n=this.re.exec(this.flat.text)),n){let r=this.flat.from+n.index,s=r+n[0].length;if((this.flat.to>=this.to||n.index+n[0].length<=this.flat.text.length-10)&&(!this.test||this.test(r,s,n)))return this.value={from:r,to:s,match:n},this.matchPos=q(this.text,s+(r==s?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=b.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol<"u"&&(se.prototype[Symbol.iterator]=ie.prototype[Symbol.iterator]=function(){return this});function Ce(t){try{return new RegExp(t,B),!0}catch{return!1}}function q(t,e){if(e>=t.length)return e;let n=t.lineAt(e),r;for(;e<n.to&&(r=n.text.charCodeAt(e-n.from))>=56320&&r<57344;)e++;return e}function _(t){let e=String(t.state.doc.lineAt(t.state.selection.main.head).number),n=h("input",{class:"cm-textfield",name:"line",value:e}),r=h("form",{class:"cm-gotoLine",onkeydown:i=>{i.keyCode==27?(i.preventDefault(),t.dispatch({effects:P.of(!1)}),t.focus()):i.keyCode==13&&(i.preventDefault(),s())},onsubmit:i=>{i.preventDefault(),s()}},h("label",t.state.phrase("Go to line"),": ",n)," ",h("button",{class:"cm-button",type:"submit"},t.state.phrase("go")));function s(){let i=/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(n.value);if(!i)return;let{state:l}=t,a=l.doc.lineAt(l.selection.main.head),[,c,o,d,y]=i,A=d?+d.slice(1):0,C=o?+o:a.number;if(o&&y){let $=C/100;c&&($=$*(c=="-"?-1:1)+a.number/l.doc.lines),C=Math.round(l.doc.lines*$)}else o&&c&&(C=C*(c=="-"?-1:1)+a.number);let G=l.doc.line(Math.max(1,Math.min(l.doc.lines,C))),U=f.cursor(G.from+Math.max(0,Math.min(A,G.length)));t.dispatch({effects:[P.of(!1),g.scrollIntoView(U.from,{y:"center"})],selection:U}),t.focus()}return{dom:r}}const P=v.define(),X=Z.define({create(){return!0},update(t,e){for(let n of e.effects)n.is(P)&&(t=n.value);return t},provide:t=>ee.from(t,e=>e?_:null)}),ke=t=>{let e=R(t,_);if(!e){let n=[P.of(!0)];t.state.field(X,!1)==null&&n.push(v.appendConfig.of([X,Le])),t.dispatch({effects:n}),e=R(t,_)}return e&&e.dom.querySelector("input").select(),!0},Le=g.baseTheme({".cm-panel.cm-gotoLine":{padding:"2px 6px 4px","& label":{fontSize:"80%"}}}),ve=({state:t,dispatch:e})=>{let{selection:n}=t,r=f.create(n.ranges.map(s=>t.wordAt(s.head)||f.cursor(s.head)),n.mainIndex);return r.eq(n)?!1:(e(t.update({selection:r})),!0)};function Ee(t,e){let{main:n,ranges:r}=t.selection,s=t.wordAt(n.head),i=s&&s.from==n.from&&s.to==n.to;for(let l=!1,a=new k(t.doc,e,r[r.length-1].to);;)if(a.next(),a.done){if(l)return null;a=new k(t.doc,e,0,Math.max(0,r[r.length-1].from-1)),l=!0}else{if(l&&r.some(c=>c.from==a.value.from))continue;if(i){let c=t.wordAt(a.value.from);if(!c||c.from!=a.value.from||c.to!=a.value.to)continue}return a.value}}const Ae=({state:t,dispatch:e})=>{let{ranges:n}=t.selection;if(n.some(i=>i.from===i.to))return ve({state:t,dispatch:e});let r=t.sliceDoc(n[0].from,n[0].to);if(t.selection.ranges.some(i=>t.sliceDoc(i.from,i.to)!=r))return!1;let s=Ee(t,r);return s?(e(t.update({selection:t.selection.addRange(f.range(s.from,s.to),!1),effects:g.scrollIntoView(s.to)})),!0):!1},x=de.define({combine(t){return pe(t,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new $e(e),scrollToMatch:e=>g.scrollIntoView(e)})}});function _e(t){return t?[x.of(t),z]:z}class le{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||Ce(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(n,r)=>r=="n"?`
`:r=="r"?"\r":r=="t"?"	":"\\")}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord}create(){return this.regexp?new qe(this):new We(this)}getCursor(e,n=0,r){let s=e.doc?e:Me.create({doc:e});return r==null&&(r=s.doc.length),this.regexp?M(this,s,n,r):S(this,s,n,r)}}class ae{constructor(e){this.spec=e}}function S(t,e,n,r){return new k(e.doc,t.unquoted,n,r,t.caseSensitive?void 0:s=>s.toLowerCase(),t.wholeWord?Fe(e.doc,e.charCategorizer(e.selection.main.head)):void 0)}function Fe(t,e){return(n,r,s,i)=>((i>n||i+s.length<r)&&(i=Math.max(0,n-2),s=t.sliceString(i,Math.min(t.length,r+2))),(e(D(s,n-i))!=m.Word||e(I(s,n-i))!=m.Word)&&(e(I(s,r-i))!=m.Word||e(D(s,r-i))!=m.Word))}class We extends ae{constructor(e){super(e)}nextMatch(e,n,r){let s=S(this.spec,e,r,e.doc.length).nextOverlapping();if(s.done){let i=Math.min(e.doc.length,n+this.spec.unquoted.length);s=S(this.spec,e,0,i).nextOverlapping()}return s.done||s.value.from==n&&s.value.to==r?null:s.value}prevMatchInRange(e,n,r){for(let s=r;;){let i=Math.max(n,s-1e4-this.spec.unquoted.length),l=S(this.spec,e,i,s),a=null;for(;!l.nextOverlapping().done;)a=l.value;if(a)return a;if(i==n)return null;s-=1e4}}prevMatch(e,n,r){let s=this.prevMatchInRange(e,0,n);return s||(s=this.prevMatchInRange(e,Math.max(0,r-this.spec.unquoted.length),e.doc.length)),s&&(s.from!=n||s.to!=r)?s:null}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,n){let r=S(this.spec,e,0,e.doc.length),s=[];for(;!r.next().done;){if(s.length>=n)return null;s.push(r.value)}return s}highlight(e,n,r,s){let i=S(this.spec,e,Math.max(0,n-this.spec.unquoted.length),Math.min(r+this.spec.unquoted.length,e.doc.length));for(;!i.next().done;)s(i.value.from,i.value.to)}}function M(t,e,n,r){return new se(e.doc,t.search,{ignoreCase:!t.caseSensitive,test:t.wholeWord?Re(e.charCategorizer(e.selection.main.head)):void 0},n,r)}function D(t,e){return t.slice(te(t,e,!1),e)}function I(t,e){return t.slice(e,te(t,e))}function Re(t){return(e,n,r)=>!r[0].length||(t(D(r.input,r.index))!=m.Word||t(I(r.input,r.index))!=m.Word)&&(t(I(r.input,r.index+r[0].length))!=m.Word||t(D(r.input,r.index+r[0].length))!=m.Word)}class qe extends ae{nextMatch(e,n,r){let s=M(this.spec,e,r,e.doc.length).next();return s.done&&(s=M(this.spec,e,0,n).next()),s.done?null:s.value}prevMatchInRange(e,n,r){for(let s=1;;s++){let i=Math.max(n,r-s*1e4),l=M(this.spec,e,i,r),a=null;for(;!l.next().done;)a=l.value;if(a&&(i==n||a.from>i+10))return a;if(i==n)return null}}prevMatch(e,n,r){return this.prevMatchInRange(e,0,n)||this.prevMatchInRange(e,r,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g,(n,r)=>r=="$"?"$":r=="&"?e.match[0]:r!="0"&&+r<e.match.length?e.match[r]:n)}matchAll(e,n){let r=M(this.spec,e,0,e.doc.length),s=[];for(;!r.next().done;){if(s.length>=n)return null;s.push(r.value)}return s}highlight(e,n,r,s){let i=M(this.spec,e,Math.max(0,n-250),Math.min(r+250,e.doc.length));for(;!i.next().done;)s(i.value.from,i.value.to)}}const L=v.define(),j=v.define(),p=Z.define({create(t){return new N(O(t).create(),null)},update(t,e){for(let n of e.effects)n.is(L)?t=new N(n.value.create(),t.panel):n.is(j)&&(t=new N(t.query,n.value?K:null));return t},provide:t=>ee.from(t,e=>e.panel)});function ze(t){let e=t.field(p,!1);return e?e.query.spec:O(t)}class N{constructor(e,n){this.query=e,this.panel=n}}const Pe=V.mark({class:"cm-searchMatch"}),De=V.mark({class:"cm-searchMatch cm-searchMatch-selected"}),Ie=me.fromClass(class{constructor(t){this.view=t,this.decorations=this.highlight(t.state.field(p))}update(t){let e=t.state.field(p);(e!=t.startState.field(p)||t.docChanged||t.selectionSet||t.viewportChanged)&&(this.decorations=this.highlight(e))}highlight({query:t,panel:e}){if(!e||!t.spec.valid)return V.none;let{view:n}=this,r=new be;for(let s=0,i=n.visibleRanges,l=i.length;s<l;s++){let{from:a,to:c}=i[s];for(;s<l-1&&c>i[s+1].from-2*250;)c=i[++s].to;t.highlight(n.state,a,c,(o,d)=>{let y=n.state.selection.ranges.some(A=>A.from==o&&A.to==d);r.add(o,d,y?De:Pe)})}return r.finish()}},{decorations:t=>t.decorations});function E(t){return e=>{let n=e.state.field(p,!1);return n&&n.query.spec.valid?t(e,n):he(e)}}const T=E((t,{query:e})=>{let{to:n}=t.state.selection.main,r=e.nextMatch(t.state,n,n);if(!r)return!1;let s=f.single(r.from,r.to),i=t.state.facet(x);return t.dispatch({selection:s,effects:[H(t,r),i.scrollToMatch(s.main,t)],userEvent:"select.search"}),oe(t),!0}),w=E((t,{query:e})=>{let{state:n}=t,{from:r}=n.selection.main,s=e.prevMatch(n,r,r);if(!s)return!1;let i=f.single(s.from,s.to),l=t.state.facet(x);return t.dispatch({selection:i,effects:[H(t,s),l.scrollToMatch(i.main,t)],userEvent:"select.search"}),oe(t),!0}),Te=E((t,{query:e})=>{let n=e.matchAll(t.state,1e3);return!n||!n.length?!1:(t.dispatch({selection:f.create(n.map(r=>f.range(r.from,r.to))),userEvent:"select.search.matches"}),!0)}),we=({state:t,dispatch:e})=>{let n=t.selection;if(n.ranges.length>1||n.main.empty)return!1;let{from:r,to:s}=n.main,i=[],l=0;for(let a=new k(t.doc,t.sliceDoc(r,s));!a.next().done;){if(i.length>1e3)return!1;a.value.from==r&&(l=i.length),i.push(f.range(a.value.from,a.value.to))}return e(t.update({selection:f.create(i,l),userEvent:"select.search.matches"})),!0},Y=E((t,{query:e})=>{let{state:n}=t,{from:r,to:s}=n.selection.main;if(n.readOnly)return!1;let i=e.nextMatch(n,r,r);if(!i)return!1;let l=i,a=[],c,o,d=[];if(l.from==r&&l.to==s&&(o=n.toText(e.getReplacement(l)),a.push({from:l.from,to:l.to,insert:o}),l=e.nextMatch(n,l.from,l.to),d.push(g.announce.of(n.phrase("replaced match on line $",n.doc.lineAt(r).number)+"."))),l){let y=a.length==0||a[0].from>=i.to?0:i.to-i.from-o.length;c=f.single(l.from-y,l.to-y),d.push(H(t,l)),d.push(n.facet(x).scrollToMatch(c.main,t))}return t.dispatch({changes:a,selection:c,effects:d,userEvent:"input.replace"}),!0}),Oe=E((t,{query:e})=>{if(t.state.readOnly)return!1;let n=e.matchAll(t.state,1e9).map(s=>{let{from:i,to:l}=s;return{from:i,to:l,insert:e.getReplacement(s)}});if(!n.length)return!1;let r=t.state.phrase("replaced $ matches",n.length)+".";return t.dispatch({changes:n,effects:g.announce.of(r),userEvent:"input.replace.all"}),!0});function K(t){return t.state.facet(x).createPanel(t)}function O(t,e){var n,r,s,i,l;let a=t.selection.main,c=a.empty||a.to>a.from+100?"":t.sliceDoc(a.from,a.to);if(e&&!c)return e;let o=t.facet(x);return new le({search:((n=e==null?void 0:e.literal)!==null&&n!==void 0?n:o.literal)?c:c.replace(/\n/g,"\\n"),caseSensitive:(r=e==null?void 0:e.caseSensitive)!==null&&r!==void 0?r:o.caseSensitive,literal:(s=e==null?void 0:e.literal)!==null&&s!==void 0?s:o.literal,regexp:(i=e==null?void 0:e.regexp)!==null&&i!==void 0?i:o.regexp,wholeWord:(l=e==null?void 0:e.wholeWord)!==null&&l!==void 0?l:o.wholeWord})}function ce(t){let e=R(t,K);return e&&e.dom.querySelector("[main-field]")}function oe(t){let e=ce(t);e&&e==t.root.activeElement&&e.select()}const he=t=>{let e=t.state.field(p,!1);if(e&&e.panel){let n=ce(t);if(n&&n!=t.root.activeElement){let r=O(t.state,e.query.spec);r.valid&&t.dispatch({effects:L.of(r)}),n.focus(),n.select()}}else t.dispatch({effects:[j.of(!0),e?L.of(O(t.state,e.query.spec)):v.appendConfig.of(z)]});return!0},ue=t=>{let e=t.state.field(p,!1);if(!e||!e.panel)return!1;let n=R(t,K);return n&&n.dom.contains(t.root.activeElement)&&t.focus(),t.dispatch({effects:j.of(!1)}),!0},Ve=[{key:"Mod-f",run:he,scope:"editor search-panel"},{key:"F3",run:T,shift:w,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:T,shift:w,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:ue,scope:"editor search-panel"},{key:"Mod-Shift-l",run:we},{key:"Mod-Alt-g",run:ke},{key:"Mod-d",run:Ae,preventDefault:!0}];class $e{constructor(e){this.view=e;let n=this.query=e.state.field(p).query.spec;this.commit=this.commit.bind(this),this.searchField=h("input",{value:n.search,placeholder:u(e,"Find"),"aria-label":u(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=h("input",{value:n.replace,placeholder:u(e,"Replace"),"aria-label":u(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=h("input",{type:"checkbox",name:"case",form:"",checked:n.caseSensitive,onchange:this.commit}),this.reField=h("input",{type:"checkbox",name:"re",form:"",checked:n.regexp,onchange:this.commit}),this.wordField=h("input",{type:"checkbox",name:"word",form:"",checked:n.wholeWord,onchange:this.commit});function r(s,i,l){return h("button",{class:"cm-button",name:s,onclick:i,type:"button"},l)}this.dom=h("div",{onkeydown:s=>this.keydown(s),class:"cm-search"},[this.searchField,r("next",()=>T(e),[u(e,"next")]),r("prev",()=>w(e),[u(e,"previous")]),r("select",()=>Te(e),[u(e,"all")]),h("label",null,[this.caseField,u(e,"match case")]),h("label",null,[this.reField,u(e,"regexp")]),h("label",null,[this.wordField,u(e,"by word")]),...e.state.readOnly?[]:[h("br"),this.replaceField,r("replace",()=>Y(e),[u(e,"replace")]),r("replaceAll",()=>Oe(e),[u(e,"replace all")])],h("button",{name:"close",onclick:()=>ue(e),"aria-label":u(e,"close"),type:"button"},["×"])])}commit(){let e=new le({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:L.of(e)}))}keydown(e){ge(this.view,e,"search-panel")?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?w:T)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),Y(this.view))}update(e){for(let n of e.transactions)for(let r of n.effects)r.is(L)&&!r.value.eq(this.query)&&this.setQuery(r.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(x).top}}function u(t,e){return t.state.phrase(e)}const F=30,W=/[\s\.,:;?!]/;function H(t,{from:e,to:n}){let r=t.state.doc.lineAt(e),s=t.state.doc.lineAt(n).to,i=Math.max(r.from,e-F),l=Math.min(s,n+F),a=t.state.sliceDoc(i,l);if(i!=r.from){for(let c=0;c<F;c++)if(!W.test(a[c+1])&&W.test(a[c])){a=a.slice(c);break}}if(l!=s){for(let c=a.length-1;c>a.length-F;c--)if(!W.test(a[c-1])&&W.test(a[c])){a=a.slice(0,c);break}}return g.announce.of(`${t.state.phrase("current match")}. ${a} ${t.state.phrase("on line")} ${r.number}.`)}const Qe=g.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),z=[p,fe.low(Ie),Qe];export{se as R,le as S,Ve as a,T as b,L as c,w as f,ze as g,_e as s};
