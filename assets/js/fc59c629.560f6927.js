"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2355"],{68294:function(n,e,s){s.r(e),s.d(e,{metadata:()=>l,contentTitle:()=>t,default:()=>x,assets:()=>c,toc:()=>h,frontMatter:()=>i});var l=JSON.parse('{"id":"\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/MySQL/MySQL\u9501\u673A\u5236","title":"MySQL\u9501\u673A\u5236","description":"\u6DF1\u5165\u5206\u6790 MySQL \u6570\u636E\u5E93\u4E2D\u7684\u5404\u79CD\u9501\u673A\u5236\uFF0C\u5305\u62EC\u8868\u9501\u3001\u884C\u9501\u7684\u5B9E\u73B0\u539F\u7406\u548C\u4F7F\u7528\u573A\u666F","source":"@site/docs/5-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/0-MySQL/2-MySQL\u9501\u673A\u5236.md","sourceDirName":"5-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/0-MySQL","slug":"/database-and-middleware/mysql-lock-mechanism","permalink":"/database-and-middleware/mysql-lock-mechanism","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/database-and-middleware/mysql-lock-mechanism","title":"MySQL\u9501\u673A\u5236","hide_title":true,"keywords":["MySQL","\u9501\u673A\u5236","\u8868\u9501","\u884C\u9501","\u5171\u4EAB\u9501","\u6392\u4ED6\u9501","\u6B7B\u9501","\u5E76\u53D1\u63A7\u5236"],"description":"\u6DF1\u5165\u5206\u6790 MySQL \u6570\u636E\u5E93\u4E2D\u7684\u5404\u79CD\u9501\u673A\u5236\uFF0C\u5305\u62EC\u8868\u9501\u3001\u884C\u9501\u7684\u5B9E\u73B0\u539F\u7406\u548C\u4F7F\u7528\u573A\u666F"},"sidebar":"mainSidebar","previous":{"title":"MySQL\u4E8B\u52A1\u5E76\u53D1\u63A7\u5236\u548C\u9694\u79BB\u7EA7\u522B","permalink":"/database-and-middleware/mysql-transaction-isolation"},"next":{"title":"\u5E38\u89C1MySQL\u7D22\u5F15\u5931\u6548\u573A\u666F","permalink":"/database-and-middleware/mysql-index-failure-scenarios"}}'),d=s("85893"),r=s("50065");let i={slug:"/database-and-middleware/mysql-lock-mechanism",title:"MySQL\u9501\u673A\u5236",hide_title:!0,keywords:["MySQL","\u9501\u673A\u5236","\u8868\u9501","\u884C\u9501","\u5171\u4EAB\u9501","\u6392\u4ED6\u9501","\u6B7B\u9501","\u5E76\u53D1\u63A7\u5236"],description:"\u6DF1\u5165\u5206\u6790 MySQL \u6570\u636E\u5E93\u4E2D\u7684\u5404\u79CD\u9501\u673A\u5236\uFF0C\u5305\u62EC\u8868\u9501\u3001\u884C\u9501\u7684\u5B9E\u73B0\u539F\u7406\u548C\u4F7F\u7528\u573A\u666F"},t=void 0,c={},h=[{value:"\u8868\u7EA7\u9501\u548C\u884C\u7EA7\u9501\u4E86\u89E3\u5417\uFF1F\u6709\u4EC0\u4E48\u533A\u522B\uFF1F",id:"\u8868\u7EA7\u9501\u548C\u884C\u7EA7\u9501\u4E86\u89E3\u5417\u6709\u4EC0\u4E48\u533A\u522B",level:2},{value:"\u884C\u7EA7\u9501\u7684\u4F7F\u7528\u6709\u4EC0\u4E48\u6CE8\u610F\u4E8B\u9879\uFF1F",id:"\u884C\u7EA7\u9501\u7684\u4F7F\u7528\u6709\u4EC0\u4E48\u6CE8\u610F\u4E8B\u9879",level:2},{value:"InnoDB \u6709\u54EA\u51E0\u7C7B\u884C\u9501\uFF1F",id:"innodb-\u6709\u54EA\u51E0\u7C7B\u884C\u9501",level:2},{value:"\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\u5462\uFF1F",id:"\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\u5462",level:2},{value:"\u610F\u5411\u9501\u6709\u4EC0\u4E48\u4F5C\u7528\uFF1F",id:"\u610F\u5411\u9501\u6709\u4EC0\u4E48\u4F5C\u7528",level:2},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function o(n){let e={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.a)(),...n.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(e.p,{children:"\u9501\u662F\u4E00\u79CD\u5E38\u89C1\u7684\u5E76\u53D1\u4E8B\u52A1\u7684\u63A7\u5236\u65B9\u5F0F\u3002"}),"\n",(0,d.jsx)(e.h2,{id:"\u8868\u7EA7\u9501\u548C\u884C\u7EA7\u9501\u4E86\u89E3\u5417\u6709\u4EC0\u4E48\u533A\u522B",children:"\u8868\u7EA7\u9501\u548C\u884C\u7EA7\u9501\u4E86\u89E3\u5417\uFF1F\u6709\u4EC0\u4E48\u533A\u522B\uFF1F"}),"\n",(0,d.jsxs)(e.p,{children:["MyISAM \u4EC5\u4EC5\u652F\u6301\u8868\u7EA7\u9501(table-level locking)\uFF0C\u4E00\u9501\u5C31\u9501\u6574\u5F20\u8868\uFF0C\u8FD9\u5728\u5E76\u53D1\u5199\u7684\u60C5\u51B5\u4E0B\u6027\u80FD\u975E\u5E38\u5DEE\u3002",(0,d.jsx)(e.strong,{children:"InnoDB \u4E0D\u5149\u652F\u6301\u8868\u7EA7\u9501(table-level locking)\uFF0C\u8FD8\u652F\u6301\u884C\u7EA7\u9501(row-level locking)\uFF0C\u9ED8\u8BA4\u4E3A\u884C\u7EA7\u9501"}),"\u3002"]}),"\n",(0,d.jsx)(e.p,{children:"\u884C\u7EA7\u9501\u7684\u7C92\u5EA6\u66F4\u5C0F\uFF0C\u4EC5\u5BF9\u76F8\u5173\u7684\u8BB0\u5F55\u4E0A\u9501\u5373\u53EF\uFF08\u5BF9\u4E00\u884C\u6216\u8005\u591A\u884C\u8BB0\u5F55\u52A0\u9501\uFF09\uFF0C\u6240\u4EE5\u5BF9\u4E8E\u5E76\u53D1\u5199\u5165\u64CD\u4F5C\u6765\u8BF4\uFF0C InnoDB \u7684\u6027\u80FD\u66F4\u9AD8\u3002"}),"\n",(0,d.jsxs)(e.p,{children:[(0,d.jsx)(e.strong,{children:"\u8868\u7EA7\u9501\u548C\u884C\u7EA7\u9501\u5BF9\u6BD4"}),"\uFF1A"]}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u8868\u7EA7\u9501\uFF1A"})," MySQL \u4E2D\u9501\u5B9A\u7C92\u5EA6\u6700\u5927\u7684\u4E00\u79CD\u9501\uFF08\u5168\u5C40\u9501\u9664\u5916\uFF09\uFF0C\u662F\u9488\u5BF9\u975E\u7D22\u5F15\u5B57\u6BB5\u52A0\u7684\u9501\uFF0C\u5BF9\u5F53\u524D\u64CD\u4F5C\u7684\u6574\u5F20\u8868\u52A0\u9501\uFF0C\u5B9E\u73B0\u7B80\u5355\uFF0C\u8D44\u6E90\u6D88\u8017\u4E5F\u6BD4\u8F83\u5C11\uFF0C\u52A0\u9501\u5FEB\uFF0C\u4E0D\u4F1A\u51FA\u73B0\u6B7B\u9501\u3002\u4E0D\u8FC7\uFF0C\u89E6\u53D1\u9501\u51B2\u7A81\u7684\u6982\u7387\u6700\u9AD8\uFF0C\u9AD8\u5E76\u53D1\u4E0B\u6548\u7387\u6781\u4F4E\u3002",(0,d.jsx)(e.strong,{children:"\u8868\u7EA7\u9501\u548C\u5B58\u50A8\u5F15\u64CE\u65E0\u5173"}),"\uFF0CMyISAM \u548C InnoDB \u5F15\u64CE\u90FD\u652F\u6301\u8868\u7EA7\u9501\u3002"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u884C\u7EA7\u9501\uFF1A"})," MySQL \u4E2D\u9501\u5B9A\u7C92\u5EA6\u6700\u5C0F\u7684\u4E00\u79CD\u9501\uFF0C\u662F ",(0,d.jsx)(e.strong,{children:"\u9488\u5BF9\u7D22\u5F15\u5B57\u6BB5\u52A0\u7684\u9501"})," \uFF0C\u53EA\u9488\u5BF9\u5F53\u524D\u64CD\u4F5C\u7684\u884C\u8BB0\u5F55\u8FDB\u884C\u52A0\u9501\u3002 \u884C\u7EA7\u9501\u80FD\u5927\u5927\u51CF\u5C11\u6570\u636E\u5E93\u64CD\u4F5C\u7684\u51B2\u7A81\u3002\u5176\u52A0\u9501\u7C92\u5EA6\u6700\u5C0F\uFF0C\u5E76\u53D1\u5EA6\u9AD8\uFF0C\u4F46\u52A0\u9501\u7684\u5F00\u9500\u4E5F\u6700\u5927\uFF0C\u52A0\u9501\u6162\uFF0C\u4F1A\u51FA\u73B0\u6B7B\u9501\u3002",(0,d.jsx)(e.strong,{children:"\u884C\u7EA7\u9501\u548C\u5B58\u50A8\u5F15\u64CE\u6709\u5173"}),"\uFF0C\u662F\u5728\u5B58\u50A8\u5F15\u64CE\u5C42\u9762\u5B9E\u73B0\u7684\u3002"]}),"\n"]}),"\n",(0,d.jsx)(e.h2,{id:"\u884C\u7EA7\u9501\u7684\u4F7F\u7528\u6709\u4EC0\u4E48\u6CE8\u610F\u4E8B\u9879",children:"\u884C\u7EA7\u9501\u7684\u4F7F\u7528\u6709\u4EC0\u4E48\u6CE8\u610F\u4E8B\u9879\uFF1F"}),"\n",(0,d.jsxs)(e.p,{children:[(0,d.jsx)(e.strong,{children:"InnoDB \u7684\u884C\u9501\u662F\u9488\u5BF9\u7D22\u5F15\u5B57\u6BB5\u52A0\u7684\u9501\uFF0C\u8868\u7EA7\u9501\u662F\u9488\u5BF9\u975E\u7D22\u5F15\u5B57\u6BB5\u52A0\u7684\u9501"}),"\u3002\u5F53\u6211\u4EEC\u6267\u884C ",(0,d.jsx)(e.code,{children:"UPDATE"}),"\u3001",(0,d.jsx)(e.code,{children:"DELETE"})," \u8BED\u53E5\u65F6\uFF0C\u5982\u679C ",(0,d.jsx)(e.code,{children:"WHERE"}),"\u6761\u4EF6\u4E2D\u5B57\u6BB5\u6CA1\u6709\u547D\u4E2D\u552F\u4E00\u7D22\u5F15\u6216\u8005\u7D22\u5F15\u5931\u6548\u7684\u8BDD\uFF0C\u5C31\u4F1A\u5BFC\u81F4\u626B\u63CF\u5168\u8868\u5BF9\u8868\u4E2D\u7684\u6240\u6709\u884C\u8BB0\u5F55\u8FDB\u884C\u52A0\u9501\u3002\u8FD9\u4E2A\u5728\u6211\u4EEC\u65E5\u5E38\u5DE5\u4F5C\u5F00\u53D1\u4E2D\u7ECF\u5E38\u4F1A\u9047\u5230\uFF0C\u4E00\u5B9A\u8981\u591A\u591A\u6CE8\u610F\uFF01\uFF01\uFF01"]}),"\n",(0,d.jsx)(e.p,{children:"\u4E0D\u8FC7\uFF0C\u5F88\u591A\u65F6\u5019\u5373\u4F7F\u7528\u4E86\u7D22\u5F15\u4E5F\u6709\u53EF\u80FD\u4F1A\u8D70\u5168\u8868\u626B\u63CF\uFF0C\u8FD9\u662F\u56E0\u4E3A MySQL \u4F18\u5316\u5668\u7684\u539F\u56E0\u3002"}),"\n",(0,d.jsx)(e.h2,{id:"innodb-\u6709\u54EA\u51E0\u7C7B\u884C\u9501",children:"InnoDB \u6709\u54EA\u51E0\u7C7B\u884C\u9501\uFF1F"}),"\n",(0,d.jsx)(e.p,{children:"InnoDB \u884C\u9501\u662F\u901A\u8FC7\u5BF9\u7D22\u5F15\u6570\u636E\u9875\u4E0A\u7684\u8BB0\u5F55\u52A0\u9501\u5B9E\u73B0\u7684\uFF0CMySQL InnoDB \u652F\u6301\u4E09\u79CD\u884C\u9501\u5B9A\u65B9\u5F0F\uFF1A"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u8BB0\u5F55\u9501\uFF08Record Lock\uFF09"}),"\uFF1A\u4E5F\u88AB\u79F0\u4E3A\u8BB0\u5F55\u9501\uFF0C\u5C5E\u4E8E\u5355\u4E2A\u884C\u8BB0\u5F55\u4E0A\u7684\u9501\u3002"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u95F4\u9699\u9501\uFF08Gap Lock\uFF09"}),"\uFF1A\u9501\u5B9A\u4E00\u4E2A\u8303\u56F4\uFF0C\u4E0D\u5305\u62EC\u8BB0\u5F55\u672C\u8EAB\u3002"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u4E34\u952E\u9501\uFF08Next-Key Lock\uFF09"}),"\uFF1ARecord Lock+Gap Lock\uFF0C\u9501\u5B9A\u4E00\u4E2A\u8303\u56F4\uFF0C\u5305\u542B\u8BB0\u5F55\u672C\u8EAB\uFF0C\u4E3B\u8981\u76EE\u7684",(0,d.jsx)(e.strong,{children:"\u662F\u4E3A\u4E86\u89E3\u51B3\u5E7B\u8BFB\u95EE\u9898"}),"\uFF08MySQL \u4E8B\u52A1\u90E8\u5206\u63D0\u5230\u8FC7\uFF09\u3002\u8BB0\u5F55\u9501\u53EA\u80FD\u9501\u4F4F\u5DF2\u7ECF\u5B58\u5728\u7684\u8BB0\u5F55\uFF0C\u4E3A\u4E86\u907F\u514D\u63D2\u5165\u65B0\u8BB0\u5F55\uFF0C\u9700\u8981\u4F9D\u8D56\u95F4\u9699\u9501\u3002"]}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:(0,d.jsx)(e.strong,{children:"\u5728 InnoDB \u9ED8\u8BA4\u7684\u9694\u79BB\u7EA7\u522B REPEATABLE-READ \u4E0B\uFF0C\u884C\u9501\u9ED8\u8BA4\u4F7F\u7528\u7684\u662F Next-Key Lock\u3002\u4F46\u662F\uFF0C\u5982\u679C\u64CD\u4F5C\u7684\u7D22\u5F15\u662F\u552F\u4E00\u7D22\u5F15\u6216\u4E3B\u952E\uFF0CInnoDB \u4F1A\u5BF9 Next-Key Lock \u8FDB\u884C\u4F18\u5316\uFF0C\u5C06\u5176\u964D\u7EA7\u4E3A Record Lock\uFF0C\u5373\u4EC5\u9501\u4F4F\u7D22\u5F15\u672C\u8EAB\uFF0C\u800C\u4E0D\u662F\u8303\u56F4\u3002"})}),"\n",(0,d.jsxs)(e.p,{children:["\u4E00\u4E9B\u5927\u5382\u9762\u8BD5\u4E2D\u53EF\u80FD\u4F1A\u95EE\u5230 Next-Key Lock \u7684\u52A0\u9501\u8303\u56F4\uFF0C\u8FD9\u91CC\u63A8\u8350\u4E00\u7BC7\u6587\u7AE0\uFF1A",(0,d.jsx)(e.a,{href:"https://segmentfault.com/a/1190000040129107",children:"MySQL next-key lock \u52A0\u9501\u8303\u56F4\u662F\u4EC0\u4E48\uFF1F - \u7A0B\u5E8F\u5458\u5C0F\u822A - 2021"}),"\u3002"]}),"\n",(0,d.jsx)(e.h2,{id:"\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\u5462",children:"\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\u5462\uFF1F"}),"\n",(0,d.jsx)(e.p,{children:"\u4E0D\u8BBA\u662F\u8868\u7EA7\u9501\u8FD8\u662F\u884C\u7EA7\u9501\uFF0C\u90FD\u5B58\u5728\u5171\u4EAB\u9501\uFF08Share Lock\uFF0CS \u9501\uFF09\u548C\u6392\u4ED6\u9501\uFF08Exclusive Lock\uFF0CX \u9501\uFF09\u8FD9\u4E24\u7C7B\uFF1A"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u5171\u4EAB\u9501\uFF08S \u9501\uFF09"}),"\uFF1A\u53C8\u79F0\u8BFB\u9501\uFF0C\u4E8B\u52A1\u5728\u8BFB\u53D6\u8BB0\u5F55\u7684\u65F6\u5019\u83B7\u53D6\u5171\u4EAB\u9501\uFF0C\u5141\u8BB8\u591A\u4E2A\u4E8B\u52A1\u540C\u65F6\u83B7\u53D6\uFF08\u9501\u517C\u5BB9\uFF09\u3002"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u6392\u4ED6\u9501\uFF08X \u9501\uFF09"}),"\uFF1A\u53C8\u79F0\u5199\u9501/\u72EC\u5360\u9501\uFF0C\u4E8B\u52A1\u5728\u4FEE\u6539\u8BB0\u5F55\u7684\u65F6\u5019\u83B7\u53D6\u6392\u4ED6\u9501\uFF0C\u4E0D\u5141\u8BB8\u591A\u4E2A\u4E8B\u52A1\u540C\u65F6\u83B7\u53D6\u3002\u5982\u679C\u4E00\u4E2A\u8BB0\u5F55\u5DF2\u7ECF\u88AB\u52A0\u4E86\u6392\u4ED6\u9501\uFF0C\u90A3\u5176\u4ED6\u4E8B\u52A1\u4E0D\u80FD\u518D\u5BF9\u8FD9\u6761\u4E8B\u52A1\u52A0\u4EFB\u4F55\u7C7B\u578B\u7684\u9501\uFF08\u9501\u4E0D\u517C\u5BB9\uFF09\u3002"]}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u6392\u4ED6\u9501\u4E0E\u4EFB\u4F55\u7684\u9501\u90FD\u4E0D\u517C\u5BB9\uFF0C\u5171\u4EAB\u9501\u4EC5\u548C\u5171\u4EAB\u9501\u517C\u5BB9\u3002"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{}),(0,d.jsx)(e.th,{children:"S \u9501"}),(0,d.jsx)(e.th,{children:"X \u9501"})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"S \u9501"}),(0,d.jsx)(e.td,{children:"\u4E0D\u51B2\u7A81"}),(0,d.jsx)(e.td,{children:"\u51B2\u7A81"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"X \u9501"}),(0,d.jsx)(e.td,{children:"\u51B2\u7A81"}),(0,d.jsx)(e.td,{children:"\u51B2\u7A81"})]})]})]}),"\n",(0,d.jsxs)(e.p,{children:["\u7531\u4E8E MVCC \u7684\u5B58\u5728\uFF0C\u5BF9\u4E8E\u4E00\u822C\u7684 ",(0,d.jsx)(e.code,{children:"SELECT"})," \u8BED\u53E5\uFF0CInnoDB \u4E0D\u4F1A\u52A0\u4EFB\u4F55\u9501\u3002\u4E0D\u8FC7\uFF0C \u4F60\u53EF\u4EE5\u901A\u8FC7\u4EE5\u4E0B\u8BED\u53E5\u663E\u5F0F\u52A0\u5171\u4EAB\u9501\u6216\u6392\u4ED6\u9501\u3002"]}),"\n",(0,d.jsx)(e.pre,{children:(0,d.jsx)(e.code,{className:"language-sql",children:"## \u5171\u4EAB\u9501 \u53EF\u4EE5\u5728 MySQL 5.7 \u548C MySQL 8.0 \u4E2D\u4F7F\u7528\nSELECT ... LOCK IN SHARE MODE;\n## \u5171\u4EAB\u9501 \u53EF\u4EE5\u5728 MySQL 8.0 \u4E2D\u4F7F\u7528\nSELECT ... FOR SHARE;\n## \u6392\u4ED6\u9501\nSELECT ... FOR UPDATE;\n"})}),"\n",(0,d.jsx)(e.h2,{id:"\u610F\u5411\u9501\u6709\u4EC0\u4E48\u4F5C\u7528",children:"\u610F\u5411\u9501\u6709\u4EC0\u4E48\u4F5C\u7528\uFF1F"}),"\n",(0,d.jsxs)(e.p,{children:["\u5982\u679C\u9700\u8981\u7528\u5230\u8868\u9501\u7684\u8BDD\uFF0C\u5982\u4F55\u5224\u65AD\u8868\u4E2D\u7684\u8BB0\u5F55\u6CA1\u6709\u884C\u9501\u5462\uFF0C\u4E00\u884C\u4E00\u884C\u904D\u5386\u80AF\u5B9A\u662F\u4E0D\u884C\uFF0C\u6027\u80FD\u592A\u5DEE\u3002\u6211\u4EEC\u9700\u8981\u7528\u5230\u4E00\u4E2A\u53EB\u505A\u610F\u5411\u9501\u7684\u4E1C\u4E1C\u6765",(0,d.jsx)(e.strong,{children:"\u5FEB\u901F\u5224\u65AD\u662F\u5426\u53EF\u4EE5\u5BF9\u67D0\u4E2A\u8868\u4F7F\u7528\u8868\u9501"}),"\u3002"]}),"\n",(0,d.jsxs)(e.p,{children:[(0,d.jsx)(e.strong,{children:"\u610F\u5411\u9501\u662F\u8868\u7EA7\u9501"}),"\uFF0C\u5171\u6709\u4E24\u79CD\uFF1A"]}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u610F\u5411\u5171\u4EAB\u9501\uFF08Intention Shared Lock\uFF0CIS \u9501\uFF09"}),"\uFF1A\u4E8B\u52A1\u6709\u610F\u5411\u5BF9\u8868\u4E2D\u7684\u67D0\u4E9B\u8BB0\u5F55\u52A0\u5171\u4EAB\u9501\uFF08S \u9501\uFF09\uFF0C\u52A0\u5171\u4EAB\u9501\u524D\u5FC5\u987B\u5148\u53D6\u5F97\u8BE5\u8868\u7684 IS \u9501\u3002"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.strong,{children:"\u610F\u5411\u6392\u4ED6\u9501\uFF08Intention Exclusive Lock\uFF0CIX \u9501\uFF09"}),"\uFF1A\u4E8B\u52A1\u6709\u610F\u5411\u5BF9\u8868\u4E2D\u7684\u67D0\u4E9B\u8BB0\u5F55\u52A0\u6392\u4ED6\u9501\uFF08X \u9501\uFF09\uFF0C\u52A0\u6392\u4ED6\u9501\u4E4B\u524D\u5FC5\u987B\u5148\u53D6\u5F97\u8BE5\u8868\u7684 IX \u9501\u3002"]}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:(0,d.jsx)(e.strong,{children:"\u610F\u5411\u9501\u662F\u7531\u6570\u636E\u5F15\u64CE\u81EA\u5DF1\u7EF4\u62A4\u7684\uFF0C\u7528\u6237\u65E0\u6CD5\u624B\u52A8\u64CD\u4F5C\u610F\u5411\u9501\uFF0C\u5728\u4E3A\u6570\u636E\u884C\u52A0\u5171\u4EAB/\u6392\u4ED6\u9501\u4E4B\u524D\uFF0CInnoDB \u4F1A\u5148\u83B7\u53D6\u8BE5\u6570\u636E\u884C\u6240\u5728\u5728\u6570\u636E\u8868\u7684\u5BF9\u5E94\u610F\u5411\u9501\u3002"})}),"\n",(0,d.jsx)(e.p,{children:"\u610F\u5411\u9501\u4E4B\u95F4\u662F\u4E92\u76F8\u517C\u5BB9\u7684\u3002"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{}),(0,d.jsx)(e.th,{children:"IS \u9501"}),(0,d.jsx)(e.th,{children:"IX \u9501"})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"IS \u9501"}),(0,d.jsx)(e.td,{children:"\u517C\u5BB9"}),(0,d.jsx)(e.td,{children:"\u517C\u5BB9"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"IX \u9501"}),(0,d.jsx)(e.td,{children:"\u517C\u5BB9"}),(0,d.jsx)(e.td,{children:"\u517C\u5BB9"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u610F\u5411\u9501\u548C\u5171\u4EAB\u9501\u548C\u6392\u5B83\u9501\u4E92\u65A5\uFF08\u8FD9\u91CC\u6307\u7684\u662F\u8868\u7EA7\u522B\u7684\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\uFF0C\u610F\u5411\u9501\u4E0D\u4F1A\u4E0E\u884C\u7EA7\u7684\u5171\u4EAB\u9501\u548C\u6392\u4ED6\u9501\u4E92\u65A5\uFF09\u3002"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{}),(0,d.jsx)(e.th,{children:"IS \u9501"}),(0,d.jsx)(e.th,{children:"IX \u9501"})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"S \u9501"}),(0,d.jsx)(e.td,{children:"\u517C\u5BB9"}),(0,d.jsx)(e.td,{children:"\u4E92\u65A5"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"X \u9501"}),(0,d.jsx)(e.td,{children:"\u4E92\u65A5"}),(0,d.jsx)(e.td,{children:"\u4E92\u65A5"})]})]})]}),"\n",(0,d.jsx)(e.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:["\n",(0,d.jsx)(e.p,{children:(0,d.jsx)(e.a,{href:"https://javaguide.cn/database/mysql/mysql-questions-01.html",children:"https://javaguide.cn/database/mysql/mysql-questions-01.html"})}),"\n"]}),"\n"]})]})}function x(n={}){let{wrapper:e}={...(0,r.a)(),...n.components};return e?(0,d.jsx)(e,{...n,children:(0,d.jsx)(o,{...n})}):o(n)}},50065:function(n,e,s){s.d(e,{Z:function(){return t},a:function(){return i}});var l=s(67294);let d={},r=l.createContext(d);function i(n){let e=l.useContext(r);return l.useMemo(function(){return"function"==typeof n?n(e):{...e,...n}},[e,n])}function t(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(d):n.components||d:i(n.components),l.createElement(r.Provider,{value:e},n.children)}}}]);