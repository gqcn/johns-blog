"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["9048"],{37238:function(e,t,r){r.r(t),r.d(t,{metadata:()=>n,contentTitle:()=>o,default:()=>f,assets:()=>a,toc:()=>u,frontMatter:()=>s});var n=JSON.parse('{"id":"\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/Etcd/Etcd","title":"Etcd","description":"\u63A2\u7D22 Etcd \u5206\u5E03\u5F0F\u952E\u503C\u5B58\u50A8\u7CFB\u7EDF\u7684\u6838\u5FC3\u7279\u6027\u3001\u67B6\u6784\u8BBE\u8BA1\u548C\u6700\u4F73\u5B9E\u8DF5","source":"@site/docs/5-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/2-Etcd/2-Etcd.md","sourceDirName":"5-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/2-Etcd","slug":"/etcd","permalink":"/etcd","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/etcd","title":"Etcd","hide_title":true,"keywords":["Etcd","\u5206\u5E03\u5F0F\u5B58\u50A8","\u952E\u503C\u5B58\u50A8","Raft","\u4E00\u81F4\u6027","\u670D\u52A1\u53D1\u73B0","\u914D\u7F6E\u4E2D\u5FC3"],"description":"\u63A2\u7D22 Etcd \u5206\u5E03\u5F0F\u952E\u503C\u5B58\u50A8\u7CFB\u7EDF\u7684\u6838\u5FC3\u7279\u6027\u3001\u67B6\u6784\u8BBE\u8BA1\u548C\u6700\u4F73\u5B9E\u8DF5"},"sidebar":"mainSidebar","previous":{"title":"Redis Stream\u7B80\u4ECB","permalink":"/redis-stream"},"next":{"title":"etcd\u8111\u88C2\u5904\u7406\u529E\u6CD5","permalink":"/etcd-split-brain-handling"}}'),i=r("85893"),l=r("50065"),c=r("69902");let s={slug:"/etcd",title:"Etcd",hide_title:!0,keywords:["Etcd","\u5206\u5E03\u5F0F\u5B58\u50A8","\u952E\u503C\u5B58\u50A8","Raft","\u4E00\u81F4\u6027","\u670D\u52A1\u53D1\u73B0","\u914D\u7F6E\u4E2D\u5FC3"],description:"\u63A2\u7D22 Etcd \u5206\u5E03\u5F0F\u952E\u503C\u5B58\u50A8\u7CFB\u7EDF\u7684\u6838\u5FC3\u7279\u6027\u3001\u67B6\u6784\u8BBE\u8BA1\u548C\u6700\u4F73\u5B9E\u8DF5"},o=void 0,a={},u=[];function d(e){return(0,i.jsx)(c.Z,{})}function f(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},69902:function(e,t,r){r.d(t,{Z:()=>b});var n=r("85893"),i=r("67294"),l=r("67026"),c=r("98404"),s=r("31183"),o=r("49931");let a=["zero","one","two","few","many","other"];function u(e){return a.filter(t=>e.includes(t))}let d={locale:"en",pluralForms:u(["one","other"]),select:e=>1===e?"one":"other"};var f=r("66026"),m=r("34751"),p=r("58608");let h={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function g(e){let{href:t,children:r}=e;return(0,n.jsx)(s.Z,{href:t,className:(0,l.Z)("card padding--lg",h.cardContainer),children:r})}function x(e){let{href:t,icon:r,title:i,description:c}=e;return(0,n.jsxs)(g,{href:t,children:[(0,n.jsxs)(p.Z,{as:"h2",className:(0,l.Z)("text--truncate",h.cardTitle),title:i,children:[r," ",i]}),c&&(0,n.jsx)("p",{className:(0,l.Z)("text--truncate",h.cardDescription),title:c,children:c})]})}function j(e){let{item:t}=e,r=(0,c.LM)(t),l=function(){let{selectMessage:e}=function(){let e=function(){let{i18n:{currentLocale:e}}=(0,o.Z)();return(0,i.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:u(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),d}},[e])}();return{selectMessage:(t,r)=>(function(e,t,r){let n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let i=r.select(t);return n[Math.min(r.pluralForms.indexOf(i),n.length-1)]})(r,t,e)}}();return t=>e(t,(0,m.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,n.jsx)(x,{href:r,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??l(t.items.length)}):null}function E(e){let{item:t}=e,r=(0,f.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,c.xz)(t.docId??void 0);return(0,n.jsx)(x,{href:t.href,icon:r,title:t.label,description:t.description??i?.description})}function w(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(E,{item:t});case"category":return(0,n.jsx)(j,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function y(e){let{className:t}=e,r=(0,c.jA)();return(0,n.jsx)(b,{items:r.items,className:t})}function b(e){let{items:t,className:r}=e;if(!t)return(0,n.jsx)(y,{...e});let i=(0,c.MN)(t);return(0,n.jsx)("section",{className:(0,l.Z)("row",r),children:i.map((e,t)=>(0,n.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,n.jsx)(w,{item:e})},t))})}},50065:function(e,t,r){r.d(t,{Z:function(){return s},a:function(){return c}});var n=r(67294);let i={},l=n.createContext(i);function c(e){let t=n.useContext(l);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);