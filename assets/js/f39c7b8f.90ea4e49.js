"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["3194"],{45470:function(e,t,r){r.r(t),r.d(t,{metadata:()=>n,contentTitle:()=>s,default:()=>f,assets:()=>a,toc:()=>u,frontMatter:()=>c});var n=JSON.parse('{"id":"\u6280\u672F\u67B6\u6784/\u6280\u672F\u67B6\u6784","title":"\u6280\u672F\u67B6\u6784","description":"\u63A2\u8BA8\u73B0\u4EE3\u8F6F\u4EF6\u6280\u672F\u67B6\u6784\u7684\u8BBE\u8BA1\u7406\u5FF5\u3001\u5B9E\u8DF5\u65B9\u6CD5\u548C\u6700\u4F73\u5B9E\u8DF5\uFF0C\u5305\u62EC\u8F6F\u4EF6\u67B6\u6784\u3001\u5FAE\u670D\u52A1\u67B6\u6784\u3001\u4E2D\u53F0\u67B6\u6784\u7B49\u6838\u5FC3\u6280\u672F\u4E3B\u9898","source":"@site/docs/0-\u6280\u672F\u67B6\u6784/0-\u6280\u672F\u67B6\u6784.md","sourceDirName":"0-\u6280\u672F\u67B6\u6784","slug":"/architecture","permalink":"/architecture","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/architecture","title":"\u6280\u672F\u67B6\u6784","hide_title":true,"keywords":["\u6280\u672F\u67B6\u6784","\u7CFB\u7EDF\u8BBE\u8BA1","\u6846\u67B6\u7ED3\u6784","\u6280\u672F\u6808","\u67B6\u6784\u8BBE\u8BA1"],"description":"\u63A2\u8BA8\u73B0\u4EE3\u8F6F\u4EF6\u6280\u672F\u67B6\u6784\u7684\u8BBE\u8BA1\u7406\u5FF5\u3001\u5B9E\u8DF5\u65B9\u6CD5\u548C\u6700\u4F73\u5B9E\u8DF5\uFF0C\u5305\u62EC\u8F6F\u4EF6\u67B6\u6784\u3001\u5FAE\u670D\u52A1\u67B6\u6784\u3001\u4E2D\u53F0\u67B6\u6784\u7B49\u6838\u5FC3\u6280\u672F\u4E3B\u9898"},"sidebar":"mainSidebar","next":{"title":"\u8F6F\u4EF6\u67B6\u6784","permalink":"/software-architecture"}}'),i=r("85893"),l=r("50065"),o=r("3105");let c={slug:"/architecture",title:"\u6280\u672F\u67B6\u6784",hide_title:!0,keywords:["\u6280\u672F\u67B6\u6784","\u7CFB\u7EDF\u8BBE\u8BA1","\u6846\u67B6\u7ED3\u6784","\u6280\u672F\u6808","\u67B6\u6784\u8BBE\u8BA1"],description:"\u63A2\u8BA8\u73B0\u4EE3\u8F6F\u4EF6\u6280\u672F\u67B6\u6784\u7684\u8BBE\u8BA1\u7406\u5FF5\u3001\u5B9E\u8DF5\u65B9\u6CD5\u548C\u6700\u4F73\u5B9E\u8DF5\uFF0C\u5305\u62EC\u8F6F\u4EF6\u67B6\u6784\u3001\u5FAE\u670D\u52A1\u67B6\u6784\u3001\u4E2D\u53F0\u67B6\u6784\u7B49\u6838\u5FC3\u6280\u672F\u4E3B\u9898"},s=void 0,a={},u=[];function d(e){return(0,i.jsx)(o.Z,{})}function f(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},3105:function(e,t,r){r.d(t,{Z:()=>j});var n=r("85893");r("67294");var i=r("67026"),l=r("98404"),o=r("31183"),c=r("33876"),s=r("66026"),a=r("34751"),u=r("58608");let d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function f(e){let{href:t,children:r}=e;return(0,n.jsx)(o.Z,{href:t,className:(0,i.Z)("card padding--lg",d.cardContainer),children:r})}function m(e){let{href:t,icon:r,title:l,description:o}=e;return(0,n.jsxs)(f,{href:t,children:[(0,n.jsxs)(u.Z,{as:"h2",className:(0,i.Z)("text--truncate",d.cardTitle),title:l,children:[r," ",l]}),o&&(0,n.jsx)("p",{className:(0,i.Z)("text--truncate",d.cardDescription),title:o,children:o})]})}function h(e){let{item:t}=e,r=(0,l.LM)(t),i=function(){let{selectMessage:e}=(0,c.c)();return t=>e(t,(0,a.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,n.jsx)(m,{href:r,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??i(t.items.length)}):null}function p(e){let{item:t}=e,r=(0,s.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,l.xz)(t.docId??void 0);return(0,n.jsx)(m,{href:t.href,icon:r,title:t.label,description:t.description??i?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(p,{item:t});case"category":return(0,n.jsx)(h,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,r=(0,l.jA)();return(0,n.jsx)(j,{items:r.items,className:t})}function j(e){let{items:t,className:r}=e;if(!t)return(0,n.jsx)(x,{...e});let o=(0,l.MN)(t);return(0,n.jsx)("section",{className:(0,i.Z)("row",r),children:o.map((e,t)=>(0,n.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,n.jsx)(g,{item:e})},t))})}},33876:function(e,t,r){r.d(t,{c:function(){return s}});var n=r(67294),i=r(49931);let l=["zero","one","two","few","many","other"];function o(e){return l.filter(t=>e.includes(t))}let c={locale:"en",pluralForms:o(["one","other"]),select:e=>1===e?"one":"other"};function s(){let e=function(){let{i18n:{currentLocale:e}}=(0,i.Z)();return(0,n.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:o(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),c}},[e])}();return{selectMessage:(t,r)=>(function(e,t,r){let n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let i=r.select(t);return n[Math.min(r.pluralForms.indexOf(i),n.length-1)]})(r,t,e)}}},50065:function(e,t,r){r.d(t,{Z:function(){return c},a:function(){return o}});var n=r(67294);let i={},l=n.createContext(i);function o(e){let t=n.useContext(l);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);