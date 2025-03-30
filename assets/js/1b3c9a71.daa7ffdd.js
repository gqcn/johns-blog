"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2064"],{59790:function(e,t,r){r.r(t),r.d(t,{metadata:()=>n,contentTitle:()=>s,default:()=>m,assets:()=>c,toc:()=>u,frontMatter:()=>a});var n=JSON.parse('{"id":"hidden/GoFrame/GoFrame","title":"GoFrame","description":"\u6DF1\u5165\u63A2\u8BA8 GoFrame \u6846\u67B6\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F","source":"@site/docs/hidden/0-GoFrame/0-GoFrame.md","sourceDirName":"hidden/0-GoFrame","slug":"/hidden/goframe","permalink":"/hidden/goframe","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/hidden/goframe","title":"GoFrame","hide_title":true,"keywords":["GoFrame","Golang","\u540E\u7AEF\u5F00\u53D1","\u8BED\u8A00\u7279\u6027","\u6280\u672F\u6808","\u5F00\u53D1\u5DE5\u5177"],"description":"\u6DF1\u5165\u63A2\u8BA8 GoFrame \u6846\u67B6\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F"},"sidebar":"hiddenSidebar","next":{"title":"GoFrame\u5B9E\u73B0\u591A\u79DF\u6237\u9694\u79BB\u7684\u6700\u4F73\u5B9E\u8DF5","permalink":"/goframe/multi-tenant"}}'),o=r("85893"),i=r("50065"),l=r("3105");let a={slug:"/hidden/goframe",title:"GoFrame",hide_title:!0,keywords:["GoFrame","Golang","\u540E\u7AEF\u5F00\u53D1","\u8BED\u8A00\u7279\u6027","\u6280\u672F\u6808","\u5F00\u53D1\u5DE5\u5177"],description:"\u6DF1\u5165\u63A2\u8BA8 GoFrame \u6846\u67B6\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F"},s=void 0,c={},u=[];function d(e){return(0,o.jsx)(l.Z,{})}function m(e={}){let{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},3105:function(e,t,r){r.d(t,{Z:()=>F});var n=r("85893");r("67294");var o=r("67026"),i=r("98404"),l=r("31183"),a=r("33876"),s=r("66026"),c=r("34751"),u=r("58608");let d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function m(e){let{href:t,children:r}=e;return(0,n.jsx)(l.Z,{href:t,className:(0,o.Z)("card padding--lg",d.cardContainer),children:r})}function f(e){let{href:t,icon:r,title:i,description:l}=e;return(0,n.jsxs)(m,{href:t,children:[(0,n.jsxs)(u.Z,{as:"h2",className:(0,o.Z)("text--truncate",d.cardTitle),title:i,children:[r," ",i]}),l&&(0,n.jsx)("p",{className:(0,o.Z)("text--truncate",d.cardDescription),title:l,children:l})]})}function h(e){let{item:t}=e,r=(0,i.LM)(t),o=function(){let{selectMessage:e}=(0,a.c)();return t=>e(t,(0,c.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,n.jsx)(f,{href:r,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??o(t.items.length)}):null}function p(e){let{item:t}=e,r=(0,s.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",o=(0,i.xz)(t.docId??void 0);return(0,n.jsx)(f,{href:t.href,icon:r,title:t.label,description:t.description??o?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(p,{item:t});case"category":return(0,n.jsx)(h,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,r=(0,i.jA)();return(0,n.jsx)(F,{items:r.items,className:t})}function F(e){let{items:t,className:r}=e;if(!t)return(0,n.jsx)(x,{...e});let l=(0,i.MN)(t);return(0,n.jsx)("section",{className:(0,o.Z)("row",r),children:l.map((e,t)=>(0,n.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,n.jsx)(g,{item:e})},t))})}},33876:function(e,t,r){r.d(t,{c:function(){return s}});var n=r(67294),o=r(49931);let i=["zero","one","two","few","many","other"];function l(e){return i.filter(t=>e.includes(t))}let a={locale:"en",pluralForms:l(["one","other"]),select:e=>1===e?"one":"other"};function s(){let e=function(){let{i18n:{currentLocale:e}}=(0,o.Z)();return(0,n.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:l(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),a}},[e])}();return{selectMessage:(t,r)=>(function(e,t,r){let n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let o=r.select(t);return n[Math.min(r.pluralForms.indexOf(o),n.length-1)]})(r,t,e)}}},50065:function(e,t,r){r.d(t,{Z:function(){return a},a:function(){return l}});var n=r(67294);let o={},i=n.createContext(o);function l(e){let t=n.useContext(i);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:l(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);