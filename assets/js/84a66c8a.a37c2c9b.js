"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["4544"],{30158:function(e,t,r){r.r(t),r.d(t,{metadata:()=>n,contentTitle:()=>a,default:()=>f,assets:()=>c,toc:()=>u,frontMatter:()=>s});var n=JSON.parse('{"id":"\u9690\u85CF\u76EE\u5F55/\u5176\u4ED6\u6587\u6863/\u5176\u4ED6\u6587\u6863","title":"\u5176\u4ED6\u6587\u6863","description":"","source":"@site/docs/99-\u9690\u85CF\u76EE\u5F55/1-\u5176\u4ED6\u6587\u6863/1-\u5176\u4ED6\u6587\u6863.md","sourceDirName":"99-\u9690\u85CF\u76EE\u5F55/1-\u5176\u4ED6\u6587\u6863","slug":"/other","permalink":"/other","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"slug":"/other","title":"\u5176\u4ED6\u6587\u6863","hide_title":true,"unlisted":false},"sidebar":"mainSidebar","previous":{"title":"\u6846\u67B6\u672A\u6765\u65B9\u5411\u8C03\u7814","permalink":"/goframe-thoughts-for-future"},"next":{"title":"\u9762\u8BD5\u57FA\u7840\u77E5\u8BC6\u70B9\u8BB0\u5F55","permalink":"/interview-basic-knowledge"}}'),i=r("85893"),l=r("50065"),o=r("69902");let s={slug:"/other",title:"\u5176\u4ED6\u6587\u6863",hide_title:!0,unlisted:!1},a=void 0,c={},u=[];function d(e){return(0,i.jsx)(o.Z,{})}function f(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},69902:function(e,t,r){r.d(t,{Z:()=>v});var n=r("85893"),i=r("67294"),l=r("67026"),o=r("98404"),s=r("31183"),a=r("49931");let c=["zero","one","two","few","many","other"];function u(e){return c.filter(t=>e.includes(t))}let d={locale:"en",pluralForms:u(["one","other"]),select:e=>1===e?"one":"other"};var f=r("66026"),m=r("34751"),h=r("58608");let p={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function g(e){let{href:t,children:r}=e;return(0,n.jsx)(s.Z,{href:t,className:(0,l.Z)("card padding--lg",p.cardContainer),children:r})}function x(e){let{href:t,icon:r,title:i,description:o}=e;return(0,n.jsxs)(g,{href:t,children:[(0,n.jsxs)(h.Z,{as:"h2",className:(0,l.Z)("text--truncate",p.cardTitle),title:i,children:[r," ",i]}),o&&(0,n.jsx)("p",{className:(0,l.Z)("text--truncate",p.cardDescription),title:o,children:o})]})}function j(e){let{item:t}=e,r=(0,o.LM)(t),l=function(){let{selectMessage:e}=function(){let e=function(){let{i18n:{currentLocale:e}}=(0,a.Z)();return(0,i.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:u(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),d}},[e])}();return{selectMessage:(t,r)=>(function(e,t,r){let n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let i=r.select(t);return n[Math.min(r.pluralForms.indexOf(i),n.length-1)]})(r,t,e)}}();return t=>e(t,(0,m.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,n.jsx)(x,{href:r,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??l(t.items.length)}):null}function w(e){let{item:t}=e,r=(0,f.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,o.xz)(t.docId??void 0);return(0,n.jsx)(x,{href:t.href,icon:r,title:t.label,description:t.description??i?.description})}function b(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(w,{item:t});case"category":return(0,n.jsx)(j,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function k(e){let{className:t}=e,r=(0,o.jA)();return(0,n.jsx)(v,{items:r.items,className:t})}function v(e){let{items:t,className:r}=e;if(!t)return(0,n.jsx)(k,{...e});let i=(0,o.MN)(t);return(0,n.jsx)("section",{className:(0,l.Z)("row",r),children:i.map((e,t)=>(0,n.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,n.jsx)(b,{item:e})},t))})}},50065:function(e,t,r){r.d(t,{Z:function(){return s},a:function(){return o}});var n=r(67294);let i={},l=n.createContext(i);function o(e){let t=n.useContext(l);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);