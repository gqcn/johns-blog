"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["7770"],{77914:function(e,n,r){r.r(n),r.d(n,{metadata:()=>t,contentTitle:()=>d,default:()=>u,assets:()=>l,toc:()=>a,frontMatter:()=>c});var t=JSON.parse('{"id":"hidden/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u53CD\u8F6C\u94FE\u8868(1)","title":"\u53CD\u8F6C\u94FE\u8868(1)","description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5B9E\u73B0\u5355\u94FE\u8868\u7684\u53CD\u8F6C\u64CD\u4F5C\uFF0C\u5305\u62EC\u8FED\u4EE3\u548C\u9012\u5F52\u4E24\u79CD\u5B9E\u73B0\u65B9\u5F0F\u7684\u5206\u6790\u4E0E\u6BD4\u8F83","source":"@site/docs/hidden/4-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/4-\u53CD\u8F6C\u94FE\u8868(1).md","sourceDirName":"hidden/4-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/data-structures-and-algorithms/reverse-linked-list","permalink":"/data-structures-and-algorithms/reverse-linked-list","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"slug":"/data-structures-and-algorithms/reverse-linked-list","title":"\u53CD\u8F6C\u94FE\u8868(1)","hide_title":true,"keywords":["\u7B97\u6CD5","\u94FE\u8868","\u53CD\u8F6C\u94FE\u8868","\u6307\u9488\u64CD\u4F5C","\u6570\u636E\u7ED3\u6784","\u94FE\u8868\u64CD\u4F5C"],"description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5B9E\u73B0\u5355\u94FE\u8868\u7684\u53CD\u8F6C\u64CD\u4F5C\uFF0C\u5305\u62EC\u8FED\u4EE3\u548C\u9012\u5F52\u4E24\u79CD\u5B9E\u73B0\u65B9\u5F0F\u7684\u5206\u6790\u4E0E\u6BD4\u8F83"},"sidebar":"hiddenSidebar","previous":{"title":"LFU\u7F13\u5B58\u7B97\u6CD5","permalink":"/data-structures-and-algorithms/lfu-cache-algorithm"},"next":{"title":"\u6700\u957F\u516C\u5171\u5B50\u5E8F\u5217","permalink":"/data-structures-and-algorithms/longest-common-subsequence"}}'),s=r("85893"),i=r("50065");let c={slug:"/data-structures-and-algorithms/reverse-linked-list",title:"\u53CD\u8F6C\u94FE\u8868(1)",hide_title:!0,keywords:["\u7B97\u6CD5","\u94FE\u8868","\u53CD\u8F6C\u94FE\u8868","\u6307\u9488\u64CD\u4F5C","\u6570\u636E\u7ED3\u6784","\u94FE\u8868\u64CD\u4F5C"],description:"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5B9E\u73B0\u5355\u94FE\u8868\u7684\u53CD\u8F6C\u64CD\u4F5C\uFF0C\u5305\u62EC\u8FED\u4EE3\u548C\u9012\u5F52\u4E24\u79CD\u5B9E\u73B0\u65B9\u5F0F\u7684\u5206\u6790\u4E0E\u6BD4\u8F83"},d=void 0,l={},a=[];function o(e){let n={a:"a",code:"code",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://leetcode.cn/problems/reverse-linked-list/description/",children:"https://leetcode.cn/problems/reverse-linked-list/description/"})}),"\n",(0,s.jsxs)(n.p,{children:["\u7ED9\u4F60\u5355\u94FE\u8868\u7684\u5934\u8282\u70B9\xa0",(0,s.jsx)(n.code,{children:"head"})," \uFF0C\u8BF7\u4F60\u53CD\u8F6C\u94FE\u8868\uFF0C\u5E76\u8FD4\u56DE\u53CD\u8F6C\u540E\u7684\u94FE\u8868\u3002"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B 1\uFF1A"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:r(62177).Z+"",width:"542",height:"222"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-text",children:"**\u8F93\u5165\uFF1A**head = [1,2,3,4,5]\n**\u8F93\u51FA\uFF1A**[5,4,3,2,1]\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B 2\uFF1A"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:r(23562).Z+"",width:"182",height:"222"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-text",children:"**\u8F93\u5165\uFF1A**head = [1,2]\n**\u8F93\u51FA\uFF1A**[2,1]\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B 3\uFF1A"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-text",children:"**\u8F93\u5165\uFF1A**head = []\n**\u8F93\u51FA\uFF1A**[]\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u63D0\u793A\uFF1A"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["\u94FE\u8868\u4E2D\u8282\u70B9\u7684\u6570\u76EE\u8303\u56F4\u662F ",(0,s.jsx)(n.code,{children:"[0, 5000]"})]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"-5000 <= Node.val <= 5000"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"**\u8FDB\u9636\uFF1A**\u94FE\u8868\u53EF\u4EE5\u9009\u7528\u8FED\u4EE3\u6216\u9012\u5F52\u65B9\u5F0F\u5B8C\u6210\u53CD\u8F6C\u3002\u4F60\u80FD\u5426\u7528\u4E24\u79CD\u65B9\u6CD5\u89E3\u51B3\u8FD9\u9053\u9898\uFF1F"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-go",children:"func reverseList(head *ListNode) *ListNode {\n    var prev *ListNode\n    curr := head\n    for curr != nil {\n        next := curr.Next\n        curr.Next = prev\n        prev = curr\n        curr = next\n    }\n    return prev\n}\n"})})]})}function u(e={}){let{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},62177:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/rev1ex1-d6868c9b3c68b496288084aa8984401f.jpg"},23562:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/rev1ex2-66d7c5c56f82f3b4cec8ef636a58d22d.jpg"},50065:function(e,n,r){r.d(n,{Z:function(){return d},a:function(){return c}});var t=r(67294);let s={},i=t.createContext(s);function c(e){let n=t.useContext(i);return t.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);