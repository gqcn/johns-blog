"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2542"],{69786:function(e,n,t){t.r(n),t.d(n,{metadata:()=>r,contentTitle:()=>a,default:()=>u,assets:()=>o,toc:()=>d,frontMatter:()=>l});var r=JSON.parse('{"id":"docs/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u6392\u5E8F\u7B97\u6CD5/\u5192\u6CE1\u6392\u5E8F","title":"\u5192\u6CE1\u6392\u5E8F","description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5192\u6CE1\u6392\u5E8F\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u3001\u65F6\u95F4\u590D\u6742\u5EA6\u5206\u6790\uFF0C\u4EE5\u53CA\u5176\u5728\u5B9E\u9645\u5E94\u7528\u4E2D\u7684\u4F18\u7F3A\u70B9","source":"@site/docs/docs/7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/0-\u6392\u5E8F\u7B97\u6CD5/0-\u5192\u6CE1\u6392\u5E8F.md","sourceDirName":"docs/7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/0-\u6392\u5E8F\u7B97\u6CD5","slug":"/data-structures-and-algorithms/bubble-sort","permalink":"/data-structures-and-algorithms/bubble-sort","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/data-structures-and-algorithms/bubble-sort","title":"\u5192\u6CE1\u6392\u5E8F","hide_title":true,"keywords":["\u6392\u5E8F\u7B97\u6CD5","\u5192\u6CE1\u6392\u5E8F","\u7B97\u6CD5\u590D\u6742\u5EA6","\u6BD4\u8F83\u6392\u5E8F","\u7A33\u5B9A\u6392\u5E8F","\u539F\u5730\u6392\u5E8F"],"description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5192\u6CE1\u6392\u5E8F\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u3001\u65F6\u95F4\u590D\u6742\u5EA6\u5206\u6790\uFF0C\u4EE5\u53CA\u5176\u5728\u5B9E\u9645\u5E94\u7528\u4E2D\u7684\u4F18\u7F3A\u70B9"},"sidebar":"mainSidebar","previous":{"title":"\u6392\u5E8F\u7B97\u6CD5","permalink":"/data-structures-and-algorithms/sorting-algorithms"},"next":{"title":"\u52A8\u6001\u89C4\u5212\u8BE6\u89E3","permalink":"/data-structures-and-algorithms/dynamic-programming"}}'),i=t("85893"),s=t("50065");let l={slug:"/data-structures-and-algorithms/bubble-sort",title:"\u5192\u6CE1\u6392\u5E8F",hide_title:!0,keywords:["\u6392\u5E8F\u7B97\u6CD5","\u5192\u6CE1\u6392\u5E8F","\u7B97\u6CD5\u590D\u6742\u5EA6","\u6BD4\u8F83\u6392\u5E8F","\u7A33\u5B9A\u6392\u5E8F","\u539F\u5730\u6392\u5E8F"],description:"\u8BE6\u7EC6\u4ECB\u7ECD\u5192\u6CE1\u6392\u5E8F\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u3001\u65F6\u95F4\u590D\u6742\u5EA6\u5206\u6790\uFF0C\u4EE5\u53CA\u5176\u5728\u5B9E\u9645\u5E94\u7528\u4E2D\u7684\u4F18\u7F3A\u70B9"},a=void 0,o={},d=[{value:"\u7B97\u6CD5\u6B65\u9AA4",id:"\u7B97\u6CD5\u6B65\u9AA4",level:2},{value:"\u52A8\u56FE\u6F14\u793A",id:"\u52A8\u56FE\u6F14\u793A",level:2},{value:"\u4EC0\u4E48\u65F6\u5019\u6700\u5FEB",id:"\u4EC0\u4E48\u65F6\u5019\u6700\u5FEB",level:2},{value:"\u4EC0\u4E48\u65F6\u5019\u6700\u6162",id:"\u4EC0\u4E48\u65F6\u5019\u6700\u6162",level:2},{value:"\u4EE3\u7801\u5B9E\u73B0",id:"\u4EE3\u7801\u5B9E\u73B0",level:2},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function c(e){let n={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:'\u5192\u6CE1\u6392\u5E8F\uFF08Bubble Sort\uFF09\u4E5F\u662F\u4E00\u79CD\u7B80\u5355\u76F4\u89C2\u7684\u6392\u5E8F\u7B97\u6CD5\u3002\u5B83\u91CD\u590D\u5730\u8D70\u8BBF\u8FC7\u8981\u6392\u5E8F\u7684\u6570\u5217\uFF0C\u4E00\u6B21\u6BD4\u8F83\u4E24\u4E2A\u5143\u7D20\uFF0C\u5982\u679C\u4ED6\u4EEC\u7684\u987A\u5E8F\u9519\u8BEF\u5C31\u628A\u4ED6\u4EEC\u4EA4\u6362\u8FC7\u6765\u3002\u8D70\u8BBF\u6570\u5217\u7684\u5DE5\u4F5C\u662F\u91CD\u590D\u5730\u8FDB\u884C\u76F4\u5230\u6CA1\u6709\u518D\u9700\u8981\u4EA4\u6362\uFF0C\u4E5F\u5C31\u662F\u8BF4\u8BE5\u6570\u5217\u5DF2\u7ECF\u6392\u5E8F\u5B8C\u6210\u3002\u8FD9\u4E2A\u7B97\u6CD5\u7684\u540D\u5B57\u7531\u6765\u662F\u56E0\u4E3A\u8D8A\u5C0F\u7684\u5143\u7D20\u4F1A\u7ECF\u7531\u4EA4\u6362\u6162\u6162"\u6D6E"\u5230\u6570\u5217\u7684\u9876\u7AEF\u3002'}),"\n",(0,i.jsx)(n.p,{children:"\u4F5C\u4E3A\u6700\u7B80\u5355\u7684\u6392\u5E8F\u7B97\u6CD5\u4E4B\u4E00\uFF0C\u5192\u6CE1\u6392\u5E8F\u7ED9\u6211\u7684\u611F\u89C9\u5C31\u50CF Abandon \u5728\u5355\u8BCD\u4E66\u91CC\u51FA\u73B0\u7684\u611F\u89C9\u4E00\u6837\uFF0C\u6BCF\u6B21\u90FD\u5728\u7B2C\u4E00\u9875\u7B2C\u4E00\u4F4D\uFF0C\u6240\u4EE5\u6700\u719F\u6089\u3002\u5192\u6CE1\u6392\u5E8F\u8FD8\u6709\u4E00\u79CD\u4F18\u5316\u7B97\u6CD5\uFF0C\u5C31\u662F\u7ACB\u4E00\u4E2A flag\uFF0C\u5F53\u5728\u4E00\u8D9F\u5E8F\u5217\u904D\u5386\u4E2D\u5143\u7D20\u6CA1\u6709\u53D1\u751F\u4EA4\u6362\uFF0C\u5219\u8BC1\u660E\u8BE5\u5E8F\u5217\u5DF2\u7ECF\u6709\u5E8F\u3002\u4F46\u8FD9\u79CD\u6539\u8FDB\u5BF9\u4E8E\u63D0\u5347\u6027\u80FD\u6765"}),"\n",(0,i.jsx)(n.p,{children:"\u8BF4\u5E76\u6CA1\u6709\u4EC0\u4E48\u592A\u5927\u4F5C\u7528\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u7B97\u6CD5\u6B65\u9AA4",children:"\u7B97\u6CD5\u6B65\u9AA4"}),"\n",(0,i.jsx)(n.p,{children:"\u6BD4\u8F83\u76F8\u90BB\u7684\u5143\u7D20\u3002\u5982\u679C\u7B2C\u4E00\u4E2A\u6BD4\u7B2C\u4E8C\u4E2A\u5927\uFF0C\u5C31\u4EA4\u6362\u4ED6\u4EEC\u4E24\u4E2A\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5BF9\u6BCF\u4E00\u5BF9\u76F8\u90BB\u5143\u7D20\u4F5C\u540C\u6837\u7684\u5DE5\u4F5C\uFF0C\u4ECE\u5F00\u59CB\u7B2C\u4E00\u5BF9\u5230\u7ED3\u5C3E\u7684\u6700\u540E\u4E00\u5BF9\u3002\u8FD9\u6B65\u505A\u5B8C\u540E\uFF0C\u6700\u540E\u7684\u5143\u7D20\u4F1A\u662F\u6700\u5927\u7684\u6570\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u9488\u5BF9\u6240\u6709\u7684\u5143\u7D20\u91CD\u590D\u4EE5\u4E0A\u7684\u6B65\u9AA4\uFF0C\u9664\u4E86\u6700\u540E\u4E00\u4E2A\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u6301\u7EED\u6BCF\u6B21\u5BF9\u8D8A\u6765\u8D8A\u5C11\u7684\u5143\u7D20\u91CD\u590D\u4E0A\u9762\u7684\u6B65\u9AA4\uFF0C\u76F4\u5230\u6CA1\u6709\u4EFB\u4F55\u4E00\u5BF9\u6570\u5B57\u9700\u8981\u6BD4\u8F83\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u52A8\u56FE\u6F14\u793A",children:"\u52A8\u56FE\u6F14\u793A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(41005).Z+"",width:"826",height:"257"})}),"\n",(0,i.jsx)(n.h2,{id:"\u4EC0\u4E48\u65F6\u5019\u6700\u5FEB",children:"\u4EC0\u4E48\u65F6\u5019\u6700\u5FEB"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u8F93\u5165\u7684\u6570\u636E\u5DF2\u7ECF\u662F\u6B63\u5E8F\u65F6\uFF08\u90FD\u5DF2\u7ECF\u662F\u6B63\u5E8F\u4E86\uFF0C\u6211\u8FD8\u8981\u4F60\u5192\u6CE1\u6392\u5E8F\u6709\u4F55\u7528\u554A\uFF09\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u4EC0\u4E48\u65F6\u5019\u6700\u6162",children:"\u4EC0\u4E48\u65F6\u5019\u6700\u6162"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u8F93\u5165\u7684\u6570\u636E\u662F\u53CD\u5E8F\u65F6\uFF08\u5199\u4E00\u4E2A for \u5FAA\u73AF\u53CD\u5E8F\u8F93\u51FA\u6570\u636E\u4E0D\u5C31\u884C\u4E86\uFF0C\u5E72\u561B\u8981\u7528\u4F60\u5192\u6CE1\u6392\u5E8F\u5462\uFF0C\u6211\u662F\u95F2\u7684\u5417\uFF09\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u4EE3\u7801\u5B9E\u73B0",children:"\u4EE3\u7801\u5B9E\u73B0"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"func bubbleSort(arr []int) []int {\n        length := len(arr)\n        for i := 0; i < length; i++ {\n                for j := 0; j < length-1-i; j++ {\n                        if arr[j] > arr[j+1] {\n                                arr[j], arr[j+1] = arr[j+1], arr[j]\n                        }\n                }\n        }\n        return arr\n}\n"})}),"\n",(0,i.jsx)(n.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://www.runoob.com/w3cnote/bubble-sort.html",children:"https://www.runoob.com/w3cnote/bubble-sort.html"})}),"\n"]}),"\n"]})]})}function u(e={}){let{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},41005:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/bubbleSort-a58fc226eb50f06b9cd09c98d1e6d09b.gif"},50065:function(e,n,t){t.d(n,{Z:function(){return a},a:function(){return l}});var r=t(67294);let i={},s=r.createContext(i);function l(e){let n=r.useContext(s);return r.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);