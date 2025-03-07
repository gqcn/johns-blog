"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["5239"],{18367:function(e,t,n){n.r(t),n.d(t,{metadata:()=>r,contentTitle:()=>c,default:()=>p,assets:()=>a,toc:()=>u,frontMatter:()=>s});var r=JSON.parse('{"id":"docs/\u53EF\u89C2\u6D4B\u6027/\u94FE\u8DEF\u8DDF\u8E2A/\u94FE\u8DEF\u8DDF\u8E2A","title":"\u94FE\u8DEF\u8DDF\u8E2A","description":"\u6DF1\u5165\u63A2\u8BA8\u5206\u5E03\u5F0F\u94FE\u8DEF\u8FFD\u8E2A\u6280\u672F\uFF0C\u5305\u62EC OpenTracing \u548C OpenTelemetry \u7B49\u5DE5\u5177\u7684\u539F\u7406\u3001\u5B9E\u73B0\u548C\u5E94\u7528\u573A\u666F","source":"@site/docs/docs/4-\u53EF\u89C2\u6D4B\u6027/0-\u94FE\u8DEF\u8DDF\u8E2A/0-\u94FE\u8DEF\u8DDF\u8E2A.md","sourceDirName":"docs/4-\u53EF\u89C2\u6D4B\u6027/0-\u94FE\u8DEF\u8DDF\u8E2A","slug":"/observability/tracing","permalink":"/observability/tracing","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/observability/tracing","title":"\u94FE\u8DEF\u8DDF\u8E2A","hide_title":true,"keywords":["\u5206\u5E03\u5F0F\u94FE\u8DEF\u8FFD\u8E2A","OpenTracing","OpenTelemetry","\u94FE\u8DEF\u76D1\u63A7","\u8C03\u7528\u94FE\u8DEF","\u6027\u80FD\u5206\u6790"],"description":"\u6DF1\u5165\u63A2\u8BA8\u5206\u5E03\u5F0F\u94FE\u8DEF\u8FFD\u8E2A\u6280\u672F\uFF0C\u5305\u62EC OpenTracing \u548C OpenTelemetry \u7B49\u5DE5\u5177\u7684\u539F\u7406\u3001\u5B9E\u73B0\u548C\u5E94\u7528\u573A\u666F"},"sidebar":"mainSidebar","previous":{"title":"\u53EF\u89C2\u6D4B\u6027","permalink":"/observability"},"next":{"title":"OpenTracing\u4ECB\u7ECD","permalink":"/observability/opentracing-introduction"}}'),i=n("85893"),l=n("50065"),o=n("3105");let s={slug:"/observability/tracing",title:"\u94FE\u8DEF\u8DDF\u8E2A",hide_title:!0,keywords:["\u5206\u5E03\u5F0F\u94FE\u8DEF\u8FFD\u8E2A","OpenTracing","OpenTelemetry","\u94FE\u8DEF\u76D1\u63A7","\u8C03\u7528\u94FE\u8DEF","\u6027\u80FD\u5206\u6790"],description:"\u6DF1\u5165\u63A2\u8BA8\u5206\u5E03\u5F0F\u94FE\u8DEF\u8FFD\u8E2A\u6280\u672F\uFF0C\u5305\u62EC OpenTracing \u548C OpenTelemetry \u7B49\u5DE5\u5177\u7684\u539F\u7406\u3001\u5B9E\u73B0\u548C\u5E94\u7528\u573A\u666F"},c=void 0,a={},u=[];function d(e){return(0,i.jsx)(o.Z,{})}function p(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},3105:function(e,t,n){n.d(t,{Z:()=>y});var r=n("85893");n("67294");var i=n("67026"),l=n("98404"),o=n("31183"),s=n("33876"),c=n("66026"),a=n("34751"),u=n("58608");let d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};function p(e){let{href:t,children:n}=e;return(0,r.jsx)(o.Z,{href:t,className:(0,i.Z)("card padding--lg",d.cardContainer),children:n})}function f(e){let{href:t,icon:n,title:l,description:o}=e;return(0,r.jsxs)(p,{href:t,children:[(0,r.jsxs)(u.Z,{as:"h2",className:(0,i.Z)("text--truncate",d.cardTitle),title:l,children:[n," ",l]}),o&&(0,r.jsx)("p",{className:(0,i.Z)("text--truncate",d.cardDescription),title:o,children:o})]})}function m(e){let{item:t}=e,n=(0,l.LM)(t),i=function(){let{selectMessage:e}=(0,s.c)();return t=>e(t,(0,a.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return n?(0,r.jsx)(f,{href:n,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??i(t.items.length)}):null}function h(e){let{item:t}=e,n=(0,c.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",i=(0,l.xz)(t.docId??void 0);return(0,r.jsx)(f,{href:t.href,icon:n,title:t.label,description:t.description??i?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,r.jsx)(h,{item:t});case"category":return(0,r.jsx)(m,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,n=(0,l.jA)();return(0,r.jsx)(y,{items:n.items,className:t})}function y(e){let{items:t,className:n}=e;if(!t)return(0,r.jsx)(x,{...e});let o=(0,l.MN)(t);return(0,r.jsx)("section",{className:(0,i.Z)("row",n),children:o.map((e,t)=>(0,r.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,r.jsx)(g,{item:e})},t))})}},33876:function(e,t,n){n.d(t,{c:function(){return c}});var r=n(67294),i=n(49931);let l=["zero","one","two","few","many","other"];function o(e){return l.filter(t=>e.includes(t))}let s={locale:"en",pluralForms:o(["one","other"]),select:e=>1===e?"one":"other"};function c(){let e=function(){let{i18n:{currentLocale:e}}=(0,i.Z)();return(0,r.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:o(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),s}},[e])}();return{selectMessage:(t,n)=>(function(e,t,n){let r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${r.length}: ${e}`);let i=n.select(t);return r[Math.min(n.pluralForms.indexOf(i),r.length-1)]})(n,t,e)}}},50065:function(e,t,n){n.d(t,{Z:function(){return s},a:function(){return o}});var r=n(67294);let i={},l=r.createContext(i);function o(e){let t=r.useContext(l);return r.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(l.Provider,{value:t},e.children)}}}]);