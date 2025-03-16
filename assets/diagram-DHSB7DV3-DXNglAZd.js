import{p as w}from"./chunk-IUKPXING-CDVme178.js";import{Y as B,o as S,q as F,H as P,I as z,r as W,u as D,_ as l,C as x,Z as v,$ as T,P as _,a2 as A,D as E}from"./index-B2D0MHPO.js";import{p as N}from"./gitGraph-YCYPL57B-VhyfMZeP.js";import"./_baseUniq-ykcEhaf0.js";import"./_basePickBy-DxPYyP_8.js";import"./clone-CpLl5Bbh.js";var C={packet:[]},m=structuredClone(C),Y=B.packet,I=l(()=>{const t=v({...Y,...T().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),L=l(()=>m.packet,"getPacket"),H=l(t=>{t.length>0&&m.packet.push(t)},"pushWord"),M=l(()=>{_(),m=structuredClone(C)},"clear"),h={pushWord:H,getPacket:L,getConfig:I,clear:M,setAccTitle:S,getAccTitle:F,setDiagramTitle:P,getDiagramTitle:z,getAccDescription:W,setAccDescription:D},O=1e4,q=l(t=>{w(t,h);let e=-1,o=[],s=1;const{bitsPerRow:i}=h.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,x.debug(`Packet block ${a} - ${e} with label ${p}`);o.length<=i+1&&h.getPacket().length<O;){const[b,c]=G({start:a,end:r,label:p},s,i);if(o.push(b),b.end+1===s*i&&(h.pushWord(o),o=[],s++),!c)break;({start:a,end:r,label:p}=c)}}h.pushWord(o)},"populate"),G=l((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),K={parse:l(async t=>{const e=await N("packet",t);x.debug(e),q(e)},"parse")},R=l((t,e,o,s)=>{const i=s.db,a=i.getConfig(),{rowHeight:r,paddingY:p,bitWidth:b,bitsPerRow:c}=a,u=i.getPacket(),n=i.getDiagramTitle(),g=r+p,d=g*(u.length+1)-(n?0:r),k=b*c+2,f=A(e);f.attr("viewbox",`0 0 ${k} ${d}`),E(f,d,k,a.useMaxWidth);for(const[$,y]of u.entries())U(f,y,$,a);f.append("text").text(n).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=l((t,e,o,{rowHeight:s,paddingX:i,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:b})=>{const c=t.append("g"),u=o*(s+a)+a;for(const n of e){const g=n.start%p*r+1,d=(n.end-n.start+1)*r-i;if(c.append("rect").attr("x",g).attr("y",u).attr("width",d).attr("height",s).attr("class","packetBlock"),c.append("text").attr("x",g+d/2).attr("y",u+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(n.label),!b)continue;const k=n.end===n.start,f=u-2;c.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(n.start),k||c.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(n.end)}},"drawWord"),X={draw:R},Z={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},j=l(({packet:t}={})=>{const e=v(Z,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),rt={parser:K,db:h,renderer:X,styles:j};export{rt as diagram};
