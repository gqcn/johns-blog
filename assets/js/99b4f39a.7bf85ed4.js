"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["7134"],{89997:function(t,e,n){n.r(e),n.d(e,{metadata:()=>r,contentTitle:()=>i,default:()=>u,assets:()=>d,toc:()=>o,frontMatter:()=>A});var r=JSON.parse('{"id":"docs/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u6709\u6548\u7684\u6B63\u65B9\u5F62","title":"\u6709\u6548\u7684\u6B63\u65B9\u5F62","description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u56DB\u4E2A\u70B9\u662F\u5426\u80FD\u6784\u6210\u6709\u6548\u6B63\u65B9\u5F62\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u8FB9\u957F\u8BA1\u7B97\u548C\u89D2\u5EA6\u5224\u5B9A\u7684\u65B9\u6CD5","source":"@site/docs/docs/7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/10-\u6709\u6548\u7684\u6B63\u65B9\u5F62.md","sourceDirName":"docs/7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/data-structures-and-algorithms/valid-square","permalink":"/data-structures-and-algorithms/valid-square","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":10,"frontMatter":{"slug":"/data-structures-and-algorithms/valid-square","title":"\u6709\u6548\u7684\u6B63\u65B9\u5F62","hide_title":true,"keywords":["\u7B97\u6CD5","\u51E0\u4F55","\u6B63\u65B9\u5F62","\u5750\u6807\u7CFB","\u8DDD\u79BB\u8BA1\u7B97","\u6570\u5B66\u95EE\u9898"],"description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u56DB\u4E2A\u70B9\u662F\u5426\u80FD\u6784\u6210\u6709\u6548\u6B63\u65B9\u5F62\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u8FB9\u957F\u8BA1\u7B97\u548C\u89D2\u5EA6\u5224\u5B9A\u7684\u65B9\u6CD5"},"sidebar":"mainSidebar","previous":{"title":"\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32","permalink":"/data-structures-and-algorithms/repeated-substring-pattern"},"next":{"title":"\u4E8C\u53C9\u6811\u7684\u952F\u9F7F\u5F62\u5C42\u5E8F\u904D\u5386","permalink":"/data-structures-and-algorithms/binary-tree-zigzag-traversal"}}'),s=n("85893"),a=n("50065");let A={slug:"/data-structures-and-algorithms/valid-square",title:"\u6709\u6548\u7684\u6B63\u65B9\u5F62",hide_title:!0,keywords:["\u7B97\u6CD5","\u51E0\u4F55","\u6B63\u65B9\u5F62","\u5750\u6807\u7CFB","\u8DDD\u79BB\u8BA1\u7B97","\u6570\u5B66\u95EE\u9898"],description:"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u56DB\u4E2A\u70B9\u662F\u5426\u80FD\u6784\u6210\u6709\u6548\u6B63\u65B9\u5F62\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u8FB9\u957F\u8BA1\u7B97\u548C\u89D2\u5EA6\u5224\u5B9A\u7684\u65B9\u6CD5"},i=void 0,d={},o=[];function c(t){let e={a:"a",img:"img",p:"p",strong:"strong",...(0,a.a)(),...t.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.p,{children:(0,s.jsx)(e.a,{href:"https://leetcode.cn/problems/valid-square/description/",children:"https://leetcode.cn/problems/valid-square/description/"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{src:n(73882).Z+"",width:"1682",height:"1340"})}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.strong,{children:"\u4E2A\u4EBA\u601D\u8DEF"}),"\uFF1A4\u4E2A\u70B9\u4E24\u4E24\u5404\u6784\u9020\u62106\u6761\u8FB9\uFF0C\u5176\u4E2D\u67094\u6761\u8FB9\u76F8\u7B49\uFF0C\u53E6\u59162\u6761\uFF08\u659C\u8FB9\uFF09\u76F8\u7B49\uFF0C\u53E6\u59162\u6761\uFF08\u659C\u8FB9\uFF09\u6BD4\u5176\u4ED64\u6761\u8FB9\u957F\uFF0C\u53EF\u4EE5\u6309\u7167\u76F4\u89D2\u4E09\u89D2\u5F62\u53EF\u8BA1\u7B97\u659C\u8FB9\u957F\u5EA6\u662F\u5426\u5339\u914D",(0,s.jsx)(e.img,{src:n(9925).Z+"",width:"123",height:"27"})]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{src:n(12878).Z+"",width:"720",height:"309"})})]})}function u(t={}){let{wrapper:e}={...(0,a.a)(),...t.components};return e?(0,s.jsx)(e,{...t,children:(0,s.jsx)(c,{...t})}):c(t)}},12878:function(t,e,n){n.d(e,{Z:function(){return r}});let r=n.p+"assets/images/1637375445-PlIgZz-image-f4dd7f0a3b3ba433c921a4c6253a540f.png"},9925:function(t,e,n){n.d(e,{Z:function(){return r}});let r="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAbCAMAAABr7QAXAAAAM1BMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxgEwMAAAAEHRSTlMADh4uPk5ebn6Pn6+/z9/vbYUu2QAAAX5JREFUeNrt0+2KpDAQheG3Kt8xxtz/1e7CNJbOgJG2YVjY5/cxh0MM78vjId4mm/JbcuWZ/7P/odmpcuJSboE5y76ve46kgg7lmvp5di42TvxI0DOXWu9Y9ulskwS2xLVaj9nns43fhBPNnPV4zD6fbZrjzDdOdKhlPzq7OCbdsf/Mas5FmNEIL2uw80t2KkBw4K+7a/W5uFM2VkGqvYMjdqF3Xny34xKUHsE7CJPuvnhkVSwbG2AH53akvLgQR+RLi3t4AcJQdBt/yWW3jgC0bFkdHgiOGdna99k63PEar+57z7WFXencVIb7Nrt2e7UndRwpWK4Xdr1yk46KzbZve5zv3nM6LM3IHP28b9M2AZZo36bXq9U73V8XtAm7LQAQZ/85EEYCtY8ZHogdjbe6AdaMKQUgO5jrHWpmt0RwayPJne7FQapgZIk+ZeGONMJxNm4JMeoaEne6XfO5cOa8YCbPrGaOvIJ4bnUjXnhfHTZ7TjMfpCPza5J88LA/6ssR+H2zRuoAAAAASUVORK5CYII="},73882:function(t,e,n){n.d(e,{Z:function(){return r}});let r=n.p+"assets/images/image-2024-9-17_16-14-28-04912070762ba28538d0fb0c3c841389.png"},50065:function(t,e,n){n.d(e,{Z:function(){return i},a:function(){return A}});var r=n(67294);let s={},a=r.createContext(s);function A(t){let e=r.useContext(a);return r.useMemo(function(){return"function"==typeof t?t(e):{...e,...t}},[e,t])}function i(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(s):t.components||s:A(t.components),r.createElement(a.Provider,{value:e},t.children)}}}]);