"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["5102"],{78397:function(e,t,n){n.r(t),n.d(t,{metadata:()=>r,contentTitle:()=>c,default:()=>f,assets:()=>a,toc:()=>u,frontMatter:()=>s});var r=JSON.parse('{"id":"\u4E91\u539F\u751F/\u4E91\u539F\u751F","title":"\u4E91\u539F\u751F","description":"\u6DF1\u5165\u63A2\u8BA8\u5BB9\u5668\u6280\u672F\u3001\u5BB9\u5668\u7F16\u6392\u3001\u5BB9\u5668\u8FD0\u884C\u65F6\u7B49\u4E91\u539F\u751F\u6280\u672F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Docker \u548C Kubernetes \u7684\u4F7F\u7528\u548C\u5B9E\u8DF5","source":"@site/docs/3-\u4E91\u539F\u751F/3-\u4E91\u539F\u751F.md","sourceDirName":"3-\u4E91\u539F\u751F","slug":"/cloud-native","permalink":"/cloud-native","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"slug":"/cloud-native","title":"\u4E91\u539F\u751F","hide_title":true,"keywords":["\u5BB9\u5668\u6280\u672F","Docker","Kubernetes","Containerd","\u5BB9\u5668\u7F16\u6392","\u5BB9\u5668\u8FD0\u884C\u65F6","\u4E91\u539F\u751F"],"description":"\u6DF1\u5165\u63A2\u8BA8\u5BB9\u5668\u6280\u672F\u3001\u5BB9\u5668\u7F16\u6392\u3001\u5BB9\u5668\u8FD0\u884C\u65F6\u7B49\u4E91\u539F\u751F\u6280\u672F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Docker \u548C Kubernetes \u7684\u4F7F\u7528\u548C\u5B9E\u8DF5"},"sidebar":"mainSidebar","previous":{"title":"\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5","permalink":"/programming/goland-remote-debug"},"next":{"title":"Kubernetes","permalink":"/cloud-native/kubernetes"}}'),i=n("85893"),o=n("50065"),l=n("3105");let s={slug:"/cloud-native",title:"\u4E91\u539F\u751F",hide_title:!0,keywords:["\u5BB9\u5668\u6280\u672F","Docker","Kubernetes","Containerd","\u5BB9\u5668\u7F16\u6392","\u5BB9\u5668\u8FD0\u884C\u65F6","\u4E91\u539F\u751F"],description:"\u6DF1\u5165\u63A2\u8BA8\u5BB9\u5668\u6280\u672F\u3001\u5BB9\u5668\u7F16\u6392\u3001\u5BB9\u5668\u8FD0\u884C\u65F6\u7B49\u4E91\u539F\u751F\u6280\u672F\uFF0C\u4E3B\u8981\u805A\u7126\u4E8E Docker \u548C Kubernetes \u7684\u4F7F\u7528\u548C\u5B9E\u8DF5"},c=void 0,a={},u=[];function d(e){return(0,i.jsx)(l.Z,{})}function f(e={}){let{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},3105:function(e,t,n){n.d(t,{Z:()=>b});var r=n("85893");n("67294");var i=n("67026"),o=n("98404"),l=n("31183"),s=n("33876"),c=n("66026"),a=n("34751"),u=n("58608");let d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function f(e){let{href:t,children:n}=e;return(0,r.jsx)(l.Z,{href:t,className:(0,i.Z)("card padding--lg",d.cardContainer),children:n})}function m(e){let{href:t,icon:n,title:o,description:l}=e;return(0,r.jsxs)(f,{href:t,children:[(0,r.jsxs)(u.Z,{as:"h2",className:(0,i.Z)("text--truncate",d.cardTitle),title:o,children:[n," ",o]}),l&&(0,r.jsx)("p",{className:(0,i.Z)("text--truncate",d.cardDescription),title:l,children:l})]})}function p(e){let{item:t}=e,n=(0,o.LM)(t),i=function(){let{selectMessage:e}=(0,s.c)();return t=>e(t,(0,a.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return n?(0,r.jsx)(m,{href:n,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??i(t.items.length)}):null}function h(e){let{item:t}=e,n=(0,c.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,o.xz)(t.docId??void 0);return(0,r.jsx)(m,{href:t.href,icon:n,title:t.label,description:t.description??i?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,r.jsx)(h,{item:t});case"category":return(0,r.jsx)(p,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,n=(0,o.jA)();return(0,r.jsx)(b,{items:n.items,className:t})}function b(e){let{items:t,className:n}=e;if(!t)return(0,r.jsx)(x,{...e});let l=(0,o.MN)(t);return(0,r.jsx)("section",{className:(0,i.Z)("row",n),children:l.map((e,t)=>(0,r.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,r.jsx)(g,{item:e})},t))})}},33876:function(e,t,n){n.d(t,{c:function(){return c}});var r=n(67294),i=n(49931);let o=["zero","one","two","few","many","other"];function l(e){return o.filter(t=>e.includes(t))}let s={locale:"en",pluralForms:l(["one","other"]),select:e=>1===e?"one":"other"};function c(){let e=function(){let{i18n:{currentLocale:e}}=(0,i.Z)();return(0,r.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:l(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),s}},[e])}();return{selectMessage:(t,n)=>(function(e,t,n){let r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${r.length}: ${e}`);let i=n.select(t);return r[Math.min(n.pluralForms.indexOf(i),r.length-1)]})(n,t,e)}}},50065:function(e,t,n){n.d(t,{Z:function(){return s},a:function(){return l}});var r=n(67294);let i={},o=r.createContext(i);function l(e){let t=r.useContext(o);return r.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);