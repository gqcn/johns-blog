"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["9930"],{921:function(e,n,l){l.r(n),l.d(n,{metadata:()=>r,contentTitle:()=>d,default:()=>o,assets:()=>c,toc:()=>a,frontMatter:()=>s});var r=JSON.parse('{"id":"docs/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u9875\u9762\u7F6E\u6362\u7B97\u6CD5","title":"\u9875\u9762\u7F6E\u6362\u7B97\u6CD5","description":"\u8BE6\u7EC6\u4ECB\u7ECD\u64CD\u4F5C\u7CFB\u7EDF\u4E2D\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF0C\u5305\u62ECFIFO\u3001LRU\u3001OPT\u7B49\u7B97\u6CD5\u7684\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u5F0F\u548C\u6027\u80FD\u6BD4\u8F83","source":"@site/docs/docs/8000-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/2-\u9875\u9762\u7F6E\u6362\u7B97\u6CD5.md","sourceDirName":"docs/8000-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/data-structures-and-algorithms/page-replacement-algorithm","permalink":"/data-structures-and-algorithms/page-replacement-algorithm","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/data-structures-and-algorithms/page-replacement-algorithm","title":"\u9875\u9762\u7F6E\u6362\u7B97\u6CD5","hide_title":true,"keywords":["\u7B97\u6CD5","\u9875\u9762\u7F6E\u6362","\u64CD\u4F5C\u7CFB\u7EDF","FIFO","LRU","OPT","\u5185\u5B58\u7BA1\u7406"],"description":"\u8BE6\u7EC6\u4ECB\u7ECD\u64CD\u4F5C\u7CFB\u7EDF\u4E2D\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF0C\u5305\u62ECFIFO\u3001LRU\u3001OPT\u7B49\u7B97\u6CD5\u7684\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u5F0F\u548C\u6027\u80FD\u6BD4\u8F83"},"sidebar":"mainSidebar","previous":{"title":"\u52A8\u6001\u89C4\u5212\u8BE6\u89E3","permalink":"/data-structures-and-algorithms/dynamic-programming"},"next":{"title":"LFU\u7F13\u5B58\u7B97\u6CD5","permalink":"/data-structures-and-algorithms/lfu-cache-algorithm"}}'),i=l("85893"),t=l("50065");let s={slug:"/data-structures-and-algorithms/page-replacement-algorithm",title:"\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",hide_title:!0,keywords:["\u7B97\u6CD5","\u9875\u9762\u7F6E\u6362","\u64CD\u4F5C\u7CFB\u7EDF","FIFO","LRU","OPT","\u5185\u5B58\u7BA1\u7406"],description:"\u8BE6\u7EC6\u4ECB\u7ECD\u64CD\u4F5C\u7CFB\u7EDF\u4E2D\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF0C\u5305\u62ECFIFO\u3001LRU\u3001OPT\u7B49\u7B97\u6CD5\u7684\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u5F0F\u548C\u6027\u80FD\u6BD4\u8F83"},d=void 0,c={},a=[{value:"\u4EC0\u4E48\u662F\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",id:"\u4EC0\u4E48\u662F\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",level:2},{value:"\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",id:"\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",level:2},{value:"FIFO\uFF08\u5148\u8FDB\u5148\u51FA\u7B97\u6CD5\uFF09",id:"fifo\u5148\u8FDB\u5148\u51FA\u7B97\u6CD5",level:4},{value:"OPT\uFF08\u6700\u4F73\u7F6E\u6362\u7B97\u6CD5\uFF09",id:"opt\u6700\u4F73\u7F6E\u6362\u7B97\u6CD5",level:4},{value:"LRU\uFF08\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\u7B97\u6CD5\uFF09",id:"lru\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\u7B97\u6CD5",level:4},{value:"Clock\uFF08\u65F6\u949F\u7F6E\u6362\u7B97\u6CD5\uFF09",id:"clock\u65F6\u949F\u7F6E\u6362\u7B97\u6CD5",level:4},{value:"LFU\uFF08\u6700\u4E0D\u5E38\u7528\u7B97\u6CD5\uFF09",id:"lfu\u6700\u4E0D\u5E38\u7528\u7B97\u6CD5",level:4},{value:"MFU\uFF08\u6700\u5E38\u4F7F\u7528\u7B97\u6CD5\uFF09",id:"mfu\u6700\u5E38\u4F7F\u7528\u7B97\u6CD5",level:4},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function h(e){let n={a:"a",br:"br",h2:"h2",h4:"h4",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"\u4EC0\u4E48\u662F\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",children:"\u4EC0\u4E48\u662F\u9875\u9762\u7F6E\u6362\u7B97\u6CD5"}),"\n",(0,i.jsxs)(n.p,{children:["\u8FDB\u7A0B\u8FD0\u884C\u65F6\uFF0C\u82E5\u5176\u8BBF\u95EE\u7684\u9875\u9762\u4E0D\u5728\u5185\u5B58\u800C\u9700\u5C06\u5176\u8C03\u5165\uFF0C\u4F46\u5185\u5B58\u5DF2\u65E0\u7A7A\u95F2\u7A7A\u95F4\u65F6\uFF0C\u5C31\u9700\u8981\u4ECE\u5185\u5B58\u4E2D\u8C03\u51FA\u4E00\u9875\u7A0B\u5E8F\u6216\u6570\u636E\uFF0C\u9001\u5165\u78C1\u76D8\u7684\u5BF9\u6362\u533A\uFF0C\u5176\u4E2D\u9009\u62E9\u8C03\u51FA\u9875\u9762\u7684\u7B97\u6CD5\u5C31\u79F0\u4E3A",(0,i.jsx)(n.strong,{children:"\u9875\u9762\u7F6E\u6362\u7B97\u6CD5"}),"\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u597D\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u5E94\u6709\u8F83\u4F4E\u7684\u9875\u9762\u66F4\u6362\u9891\u7387\uFF0C\u4E5F\u5C31\u662F\u8BF4\uFF0C\u5E94\u5C06\u4EE5\u540E\u4E0D\u4F1A\u518D\u8BBF\u95EE\u6216\u8005\u4EE5\u540E\u8F83\u957F\u65F6\u95F4\u5185\u4E0D\u4F1A\u518D\u8BBF\u95EE\u7684\u9875\u9762\u5148\u8C03\u51FA\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5",children:"\u5E38\u89C1\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5"}),"\n",(0,i.jsx)(n.h4,{id:"fifo\u5148\u8FDB\u5148\u51FA\u7B97\u6CD5",children:"FIFO\uFF08\u5148\u8FDB\u5148\u51FA\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\uFF08\u4F18\u5148\u6DD8\u6C70\u6700\u65E9\u8FDB\u5165\u5185\u5B58\u7684\u9875\u9762\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"FIFO \u7B97\u6CD5\u662F\u6700\u7B80\u5355\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u3002FIFO \u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u4E3A\u6BCF\u4E2A\u9875\u9762\u8BB0\u5F55\u4E86\u8C03\u5230\u5185\u5B58\u7684\u65F6\u95F4\uFF0C\u5F53\u5FC5\u987B\u7F6E\u6362\u9875\u9762\u65F6\u4F1A\u9009\u62E9\u6700\u65E7\u7684\u9875\u9762\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u201CFIFO \u7B97\u6CD5\u5F53\u8FDB\u7A0B\u5206\u914D\u5230\u7684\u9875\u9762\u6570\u589E\u52A0\u65F6\uFF0C\u7F3A\u9875\u4E2D\u65AD\u7684\u6B21\u6570\u53EF\u80FD\u589E\u52A0\u4E5F\u53EF\u80FD\u51CF\u5C11\u201D"}),"\n",(0,i.jsx)(n.p,{children:"FIFO \u7B97\u6CD5\u57FA\u4E8E\u961F\u5217\u5B9E\u73B0\uFF0C\u4E0D\u662F\u5806\u6808\u7C7B\u7B97\u6CD5\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u6CE8\u610F\uFF0C\u5E76\u4E0D\u9700\u8981\u8BB0\u5F55\u8C03\u5165\u9875\u9762\u7684\u786E\u5207\u65F6\u95F4\uFF0C\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2A FIFO \u961F\u5217\uFF0C\u6765\u7BA1\u7406\u6240\u6709\u7684\u5185\u5B58\u9875\u9762\u3002\u7F6E\u6362\u7684\u662F\u961F\u5217\u7684\u9996\u4E2A\u9875\u9762\u3002\u5F53\u9700\u8981\u8C03\u5165\u9875\u9762\u5230\u5185\u5B58\u65F6\uFF0C\u5C31\u5C06\u5B83\u52A0\u5230\u961F\u5217\u7684\u5C3E\u90E8"}),"\n",(0,i.jsx)(n.p,{children:"FIFO \u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u6613\u4E8E\u7406\u89E3\u548C\u7F16\u7A0B\u3002\u7136\u800C\uFF0C\u5B83\u7684\u6027\u80FD\u5E76\u4E0D\u603B\u662F\u5341\u5206\u7406\u60F3\uFF1A"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5176\u4E00\uFF0C\u6240\u7F6E\u6362\u7684\u9875\u9762\u53EF\u4EE5\u662F\u5F88\u4E45\u4EE5\u524D\u4F7F\u7528\u8FC7\u4F46\u73B0\u5DF2\u4E0D\u518D\u4F7F\u7528\u7684\u521D\u59CB\u5316\u6A21\u5757"}),"\n",(0,i.jsx)(n.li,{children:"\u5176\u4E8C\uFF0C\u6240\u7F6E\u6362\u7684\u9875\u9762\u53EF\u4EE5\u5305\u542B\u4E00\u4E2A\u88AB\u5927\u91CF\u4F7F\u7528\u7684\u53D8\u91CF\uFF0C\u5B83\u65E9\u5C31\u521D\u59CB\u5316\u4E86\uFF0C\u4F46\u4ECD\u5728\u4E0D\u65AD\u4F7F\u7528"}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"opt\u6700\u4F73\u7F6E\u6362\u7B97\u6CD5",children:"OPT\uFF08\u6700\u4F73\u7F6E\u6362\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\uFF08\u6DD8\u6C70\u4EE5\u540E\u4E0D\u4F1A\u4F7F\u7528\u7684\u9875\u9762\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\u53D1\u73B0 Belady \u5F02\u5E38\u7684\u4E00\u4E2A\u7ED3\u679C\u662F\u5BFB\u627E\u6700\u4F18\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF0C\u8FD9\u4E2A\u7B97\u6CD5\u5177\u6709\u6240\u6709\u7B97\u6CD5\u7684\u6700\u4F4E\u7684\u7F3A\u9875\u9519\u8BEF\u7387\uFF0C\u5E76\u4E14\u4E0D\u4F1A\u906D\u53D7 Belady \u5F02\u5E38\u3002\u8FD9\u79CD\u7B97\u6CD5\u786E\u5B9E\u5B58\u5728\uFF0C\u5B83\u88AB\u79F0\u4E3A OPT \u6216 MIN\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u8FD9\u79CD\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u786E\u4FDD\u5BF9\u4E8E\u7ED9\u5B9A\u6570\u91CF\u7684\u5E27\u4F1A\u4EA7\u751F\u6700\u4F4E\u7684\u53EF\u80FD\u7684\u7F3A\u9875\u9519\u8BEF\u7387\u3002"}),"\n",(0,i.jsx)(n.p,{children:"FIFO \u548C OPT \u7B97\u6CD5\u7684\u533A\u522B\u5728\u4E8E\uFF1A\u9664\u4E86\u5728\u65F6\u95F4\u4E0A\u5411\u540E\u6216\u5411\u524D\u770B\u4E4B\u5916\uFF0CFIFO \u7B97\u6CD5\u4F7F\u7528\u7684\u662F\u9875\u9762\u8C03\u5165\u5185\u5B58\u7684\u65F6\u95F4\uFF0COPT \u7B97\u6CD5\u4F7F\u7528\u7684\u662F\u9875\u9762\u5C06\u6765\u4F7F\u7528\u7684\u65F6\u95F4\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"lru\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\u7B97\u6CD5",children:"LRU\uFF08\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\uFF08\u6DD8\u6C70\u6700\u8FD1\u6CA1\u6709\u4F7F\u7528\u7684\u9875\u9762\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\u9009\u62E9\u6700\u8FD1\u6700\u957F\u65F6\u95F4\u672A\u8BBF\u95EE\u8FC7\u7684\u9875\u9762\u4E88\u4EE5\u6DD8\u6C70\uFF0C\u5B83\u8BA4\u4E3A\u8FC7\u53BB\u4E00\u6BB5\u65F6\u95F4\u5185\u672A\u8BBF\u95EE\u8FC7\u7684\u9875\u9762\uFF0C\u5728\u6700\u8FD1\u7684\u5C06\u6765\u53EF\u80FD\u4E5F\u4E0D\u4F1A\u88AB\u8BBF\u95EE\u3002\u8BE5\u7B97\u6CD5\u4E3A\u6BCF\u4E2A\u9875\u9762\u8BBE\u7F6E\u4E00\u4E2A\u8BBF\u95EE\u5B57\u6BB5\uFF0C\u6765\u8BB0\u5F55\u9875\u9762\u81EA\u4E0A\u6B21\u88AB\u8BBF\u95EE\u4EE5\u6765\u6240\u7ECF\u5386\u7684\u65F6\u95F4\uFF0C\u6DD8\u6C70\u9875\u9762\u65F6\u9009\u62E9\u73B0\u6709\u9875\u9762\u4E2D\u503C\u6700\u5927\u7684\u4E88\u4EE5\u6DD8\u6C70\u3002"}),"\n",(0,i.jsxs)(n.p,{children:["OPT \u548C LRU \u7B97\u6CD5\u7684\u533A\u522B\u5728\u4E8E\uFF1ALRU \u7B97\u6CD5\u6839\u636E\u5404\u9875\u4EE5\u524D\u7684\u60C5\u51B5\uFF0C\u662F\u201C\u5411\u524D\u770B\u201D\u7684\uFF0C\u800C\u6700\u4F73\u7F6E\u6362\u7B97\u6CD5\u5219\u6839\u636E\u5404\u9875\u4EE5\u540E\u7684\u4F7F\u7528\u60C5\u51B5\uFF0C\u662F\u201C\u5411\u540E\u770B\u201D\u7684\u3002",(0,i.jsx)(n.br,{}),"\n","LRU \u6027\u80FD\u8F83\u597D\uFF0C\u4F46\u9700\u8981\u5BC4\u5B58\u5668\u548C\u6808\u7684\u786C\u4EF6\u652F\u6301\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"LRU \u662F\u5806\u6808\u7C7B\u7684\u7B97\u6CD5\uFF0C\u7406\u8BBA\u4E0A\u53EF\u4EE5\u8BC1\u660E\uFF0C\u5806\u6808\u7C7B\u7B97\u6CD5\u4E0D\u53EF\u80FD\u51FA\u73B0 Belady \u5F02\u5E38\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"clock\u65F6\u949F\u7F6E\u6362\u7B97\u6CD5",children:"Clock\uFF08\u65F6\u949F\u7F6E\u6362\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\u7B80\u5355\u7684 CLOCK \u7B97\u6CD5\u662F\u7ED9\u6BCF\u4E00\u5E27\u5173\u8054\u4E00\u4E2A\u9644\u52A0\u4F4D\uFF0C\u79F0\u4E3A\u4F7F\u7528\u4F4D\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u67D0\u4E00\u9875\u9996\u6B21\u88C5\u5165\u4E3B\u5B58\u65F6\uFF0C\u8BE5\u5E27\u7684\u4F7F\u7528\u4F4D\u8BBE\u7F6E\u4E3A1;"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u8BE5\u9875\u968F\u540E\u518D\u88AB\u8BBF\u95EE\u5230\u65F6\uFF0C\u5B83\u7684\u4F7F\u7528\u4F4D\u4E5F\u88AB\u7F6E\u4E3A1\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5BF9\u4E8E\u9875\u66FF\u6362\u7B97\u6CD5\uFF0C\u7528\u4E8E\u66FF\u6362\u7684\u5019\u9009\u5E27\u96C6\u5408\u770B\u505A\u4E00\u4E2A\u5FAA\u73AF\u7F13\u51B2\u533A\uFF0C\u5E76\u4E14\u6709\u4E00\u4E2A\u6307\u9488\u4E0E\u4E4B\u76F8\u5173\u8054\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u67D0\u4E00\u9875\u88AB\u66FF\u6362\u65F6\uFF0C\u8BE5\u6307\u9488\u88AB\u8BBE\u7F6E\u6210\u6307\u5411\u7F13\u51B2\u533A\u4E2D\u7684\u4E0B\u4E00\u5E27\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5F53\u9700\u8981\u66FF\u6362\u4E00\u9875\u65F6\uFF0C\u64CD\u4F5C\u7CFB\u7EDF\u626B\u63CF\u7F13\u51B2\u533A\uFF0C\u4EE5\u67E5\u627E\u4F7F\u7528\u4F4D\u88AB\u7F6E\u4E3A0\u7684\u4E00\u5E27\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u6BCF\u5F53\u9047\u5230\u4E00\u4E2A\u4F7F\u7528\u4F4D\u4E3A1\u7684\u5E27\u65F6\uFF0C\u64CD\u4F5C\u7CFB\u7EDF\u5C31\u5C06\u8BE5\u4F4D\u91CD\u65B0\u7F6E\u4E3A0\uFF1B"}),"\n",(0,i.jsx)(n.p,{children:"\u5982\u679C\u5728\u8FD9\u4E2A\u8FC7\u7A0B\u5F00\u59CB\u65F6\uFF0C\u7F13\u51B2\u533A\u4E2D\u6240\u6709\u5E27\u7684\u4F7F\u7528\u4F4D\u5747\u4E3A0\uFF0C\u5219\u9009\u62E9\u9047\u5230\u7684\u7B2C\u4E00\u4E2A\u5E27\u66FF\u6362\uFF1B"}),"\n",(0,i.jsx)(n.p,{children:"\u5982\u679C\u6240\u6709\u5E27\u7684\u4F7F\u7528\u4F4D\u5747\u4E3A1,\u5219\u6307\u9488\u5728\u7F13\u51B2\u533A\u4E2D\u5B8C\u6574\u5730\u5FAA\u73AF\u4E00\u5468\uFF0C\u628A\u6240\u6709\u4F7F\u7528\u4F4D\u90FD\u7F6E\u4E3A0\uFF0C\u5E76\u4E14\u505C\u7559\u5728\u6700\u521D\u7684\u4F4D\u7F6E\u4E0A\uFF0C\u66FF\u6362\u8BE5\u5E27\u4E2D\u7684\u9875\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u7531\u4E8E\u8BE5\u7B97\u6CD5\u5FAA\u73AF\u5730\u68C0\u67E5\u5404\u9875\u9762\u7684\u60C5\u51B5\uFF0C\u6545\u79F0\u4E3A CLOCK \u7B97\u6CD5\uFF0C\u53C8\u79F0\u4E3A\u6700\u8FD1\u672A\u7528( Not Recently Used, NRU )\u7B97\u6CD5\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"lfu\u6700\u4E0D\u5E38\u7528\u7B97\u6CD5",children:"LFU\uFF08\u6700\u4E0D\u5E38\u7528\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528\uFF08LFU\uFF09\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u8981\u6C42\u7F6E\u6362\u5177\u6709\u6700\u5C0F\u8BA1\u6570\u7684\u9875\u9762\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u8FD9\u79CD\u9009\u62E9\u7684\u539F\u56E0\u662F\uFF0C\u79EF\u6781\u4F7F\u7528\u7684\u9875\u9762\u5E94\u5F53\u5177\u6709\u5927\u7684\u5F15\u7528\u8BA1\u6570\u3002\u7136\u800C\uFF0C\u5F53\u4E00\u4E2A\u9875\u9762\u5728\u8FDB\u7A0B\u7684\u521D\u59CB\u9636\u6BB5\u5927\u91CF\u4F7F\u7528\u4F46\u662F\u968F\u540E\u4E0D\u518D\u4F7F\u7528\u65F6\uFF0C\u4F1A\u51FA\u73B0\u95EE\u9898\u3002\u7531\u4E8E\u88AB\u5927\u91CF\u4F7F\u7528\uFF0C\u5B83\u6709\u4E00\u4E2A\u5927\u7684\u8BA1\u6570\uFF0C\u5373\u4F7F\u4E0D\u518D\u9700\u8981\u5374\u4ECD\u4FDD\u7559\u5728\u5185\u5B58\u4E2D\u3002\u4E00\u79CD\u89E3\u51B3\u65B9\u6848\u662F\uFF0C\u5B9A\u671F\u5730\u5C06\u8BA1\u6570\u53F3\u79FB 1 \u4F4D\uFF0C\u4EE5\u5F62\u6210\u6307\u6570\u8870\u51CF\u7684\u5E73\u5747\u4F7F\u7528\u8BA1\u6570\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"mfu\u6700\u5E38\u4F7F\u7528\u7B97\u6CD5",children:"MFU\uFF08\u6700\u5E38\u4F7F\u7528\u7B97\u6CD5\uFF09"}),"\n",(0,i.jsx)(n.p,{children:"\u6700\u7ECF\u5E38\u4F7F\u7528\uFF08MFU\uFF09\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\u662F\u57FA\u4E8E\u5982\u4E0B\u8BBA\u70B9\uFF1A\u5177\u6709\u6700\u5C0F\u8BA1\u6570\u7684\u9875\u9762\u53EF\u80FD\u521A\u521A\u88AB\u5F15\u5165\u5E76\u4E14\u5C1A\u672A\u4F7F\u7528\u3002"}),"\n",(0,i.jsx)(n.p,{children:"MFU \u548C LFU \u7F6E\u6362\u90FD\u4E0D\u5E38\u7528\u3002\u8FD9\u4E9B\u7B97\u6CD5\u7684\u5B9E\u73B0\u662F\u6602\u8D35\u7684\uFF0C\u5E76\u4E14\u5B83\u4EEC\u4E0D\u80FD\u5F88\u597D\u5730\u8FD1\u4F3C OPT \u7F6E\u6362\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://www.cnblogs.com/Leophen/p/11397699.html",children:"https://www.cnblogs.com/Leophen/p/11397699.html"})}),"\n"]}),"\n"]})]})}function o(e={}){let{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},50065:function(e,n,l){l.d(n,{Z:function(){return d},a:function(){return s}});var r=l(67294);let i={},t=r.createContext(i);function s(e){let n=r.useContext(t);return r.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);