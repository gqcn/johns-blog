"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["9294"],{97877:function(e,t,r){r.r(t),r.d(t,{metadata:()=>n,contentTitle:()=>a,default:()=>f,assets:()=>c,toc:()=>u,frontMatter:()=>s});var n=JSON.parse('{"id":"\u5F00\u53D1\u8BED\u8A00/\u5F00\u53D1\u8BED\u8A00","title":"\u5F00\u53D1\u8BED\u8A00","description":"\u6DF1\u5165\u63A2\u8BA8\u5404\u79CD\u7F16\u7A0B\u8BED\u8A00\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Go \u8BED\u8A00\u7684\u5F00\u53D1\u5B9E\u8DF5","source":"@site/docs/2-\u5F00\u53D1\u8BED\u8A00/2-\u5F00\u53D1\u8BED\u8A00.md","sourceDirName":"2-\u5F00\u53D1\u8BED\u8A00","slug":"/programming","permalink":"/programming","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/programming","title":"\u5F00\u53D1\u8BED\u8A00","hide_title":true,"keywords":["\u7F16\u7A0B\u8BED\u8A00","Golang","\u540E\u7AEF\u5F00\u53D1","\u8BED\u8A00\u7279\u6027","\u6280\u672F\u6808","\u5F00\u53D1\u5DE5\u5177"],"description":"\u6DF1\u5165\u63A2\u8BA8\u5404\u79CD\u7F16\u7A0B\u8BED\u8A00\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Go \u8BED\u8A00\u7684\u5F00\u53D1\u5B9E\u8DF5"},"sidebar":"mainSidebar","previous":{"title":"\u67B6\u6784\u5E08\u804C\u4E1A\u8E29\u5751\u7ECF\u9A8C\u603B\u7ED3","permalink":"/architect-career-pitfalls"},"next":{"title":"Golang","permalink":"/golang"}}'),i=r("85893"),o=r("50065"),l=r("3105");let s={slug:"/programming",title:"\u5F00\u53D1\u8BED\u8A00",hide_title:!0,keywords:["\u7F16\u7A0B\u8BED\u8A00","Golang","\u540E\u7AEF\u5F00\u53D1","\u8BED\u8A00\u7279\u6027","\u6280\u672F\u6808","\u5F00\u53D1\u5DE5\u5177"],description:"\u6DF1\u5165\u63A2\u8BA8\u5404\u79CD\u7F16\u7A0B\u8BED\u8A00\u7684\u7279\u6027\u3001\u6700\u4F73\u5B9E\u8DF5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Go \u8BED\u8A00\u7684\u5F00\u53D1\u5B9E\u8DF5"},a=void 0,c={},u=[];function d(e){return(0,i.jsx)(l.Z,{})}function f(e={}){let{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},3105:function(e,t,r){r.d(t,{Z:()=>j});var n=r("85893");r("67294");var i=r("67026"),o=r("98404"),l=r("31183"),s=r("33876"),a=r("66026"),c=r("34751"),u=r("58608");let d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function f(e){let{href:t,children:r}=e;return(0,n.jsx)(l.Z,{href:t,className:(0,i.Z)("card padding--lg",d.cardContainer),children:r})}function m(e){let{href:t,icon:r,title:o,description:l}=e;return(0,n.jsxs)(f,{href:t,children:[(0,n.jsxs)(u.Z,{as:"h2",className:(0,i.Z)("text--truncate",d.cardTitle),title:o,children:[r," ",o]}),l&&(0,n.jsx)("p",{className:(0,i.Z)("text--truncate",d.cardDescription),title:l,children:l})]})}function p(e){let{item:t}=e,r=(0,o.LM)(t),i=function(){let{selectMessage:e}=(0,s.c)();return t=>e(t,(0,c.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,n.jsx)(m,{href:r,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??i(t.items.length)}):null}function h(e){let{item:t}=e,r=(0,a.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,o.xz)(t.docId??void 0);return(0,n.jsx)(m,{href:t.href,icon:r,title:t.label,description:t.description??i?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(h,{item:t});case"category":return(0,n.jsx)(p,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,r=(0,o.jA)();return(0,n.jsx)(j,{items:r.items,className:t})}function j(e){let{items:t,className:r}=e;if(!t)return(0,n.jsx)(x,{...e});let l=(0,o.MN)(t);return(0,n.jsx)("section",{className:(0,i.Z)("row",r),children:l.map((e,t)=>(0,n.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,n.jsx)(g,{item:e})},t))})}},33876:function(e,t,r){r.d(t,{c:function(){return a}});var n=r(67294),i=r(49931);let o=["zero","one","two","few","many","other"];function l(e){return o.filter(t=>e.includes(t))}let s={locale:"en",pluralForms:l(["one","other"]),select:e=>1===e?"one":"other"};function a(){let e=function(){let{i18n:{currentLocale:e}}=(0,i.Z)();return(0,n.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:l(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),s}},[e])}();return{selectMessage:(t,r)=>(function(e,t,r){let n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let i=r.select(t);return n[Math.min(r.pluralForms.indexOf(i),n.length-1)]})(r,t,e)}}},50065:function(e,t,r){r.d(t,{Z:function(){return s},a:function(){return l}});var n=r(67294);let i={},o=n.createContext(i);function l(e){let t=n.useContext(o);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);