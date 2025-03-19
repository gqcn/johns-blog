"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["7430"],{61426:function(n,e,i){i.r(e),i.d(e,{metadata:()=>d,contentTitle:()=>r,default:()=>a,assets:()=>o,toc:()=>t,frontMatter:()=>c});var d=JSON.parse('{"id":"docs/\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/MySQL/MySQL InnoDB\u5B58\u50A8\u5F15\u64CE\u5BF9MVCC\u7684\u5B9E\u73B0","title":"MySQL InnoDB\u5B58\u50A8\u5F15\u64CE\u5BF9MVCC\u7684\u5B9E\u73B0","description":"\u6DF1\u5165\u89E3\u6790 MySQL InnoDB \u5B58\u50A8\u5F15\u64CE\u4E2D MVCC\uFF08\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236\uFF09\u7684\u5B9E\u73B0\u539F\u7406\u548C\u673A\u5236","source":"@site/docs/docs/6000-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/0-MySQL/0-MySQL InnoDB\u5B58\u50A8\u5F15\u64CE\u5BF9MVCC\u7684\u5B9E\u73B0.md","sourceDirName":"docs/6000-\u6570\u636E\u5E93\u4E0E\u4E2D\u95F4\u4EF6/0-MySQL","slug":"/database-and-middleware/mysql-innodb-mvcc","permalink":"/database-and-middleware/mysql-innodb-mvcc","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/database-and-middleware/mysql-innodb-mvcc","title":"MySQL InnoDB\u5B58\u50A8\u5F15\u64CE\u5BF9MVCC\u7684\u5B9E\u73B0","hide_title":true,"keywords":["MySQL","InnoDB","MVCC","\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236","\u4E8B\u52A1\u9694\u79BB","\u6570\u636E\u5E93\u5F15\u64CE","\u5E76\u53D1\u63A7\u5236"],"description":"\u6DF1\u5165\u89E3\u6790 MySQL InnoDB \u5B58\u50A8\u5F15\u64CE\u4E2D MVCC\uFF08\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236\uFF09\u7684\u5B9E\u73B0\u539F\u7406\u548C\u673A\u5236"},"sidebar":"mainSidebar","previous":{"title":"MySQL","permalink":"/database-and-middleware/mysql"},"next":{"title":"MySQL\u4E8B\u52A1\u5E76\u53D1\u63A7\u5236\u548C\u9694\u79BB\u7EA7\u522B","permalink":"/database-and-middleware/mysql-transaction-isolation"}}'),l=i("85893"),s=i("50065");let c={slug:"/database-and-middleware/mysql-innodb-mvcc",title:"MySQL InnoDB\u5B58\u50A8\u5F15\u64CE\u5BF9MVCC\u7684\u5B9E\u73B0",hide_title:!0,keywords:["MySQL","InnoDB","MVCC","\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236","\u4E8B\u52A1\u9694\u79BB","\u6570\u636E\u5E93\u5F15\u64CE","\u5E76\u53D1\u63A7\u5236"],description:"\u6DF1\u5165\u89E3\u6790 MySQL InnoDB \u5B58\u50A8\u5F15\u64CE\u4E2D MVCC\uFF08\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236\uFF09\u7684\u5B9E\u73B0\u539F\u7406\u548C\u673A\u5236"},r=void 0,o={},t=[{value:"\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236 (Multi-Version Concurrency Control)",id:"\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236-multi-version-concurrency-control",level:2},{value:"InnoDB \u5BF9 MVCC \u7684\u5B9E\u73B0",id:"innodb-\u5BF9-mvcc-\u7684\u5B9E\u73B0",level:2},{value:"\u9690\u85CF\u5B57\u6BB5",id:"\u9690\u85CF\u5B57\u6BB5",level:3},{value:"ReadView",id:"readview",level:3},{value:"undo-log",id:"undo-log",level:3},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function h(n){let e={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.a)(),...n.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(e.h2,{id:"\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236-multi-version-concurrency-control",children:"\u591A\u7248\u672C\u5E76\u53D1\u63A7\u5236 (Multi-Version Concurrency Control)"}),"\n",(0,l.jsx)(e.p,{children:"MVCC \u662F\u4E00\u79CD\u5E76\u53D1\u63A7\u5236\u673A\u5236\uFF0C\u7528\u4E8E\u5728\u591A\u4E2A\u5E76\u53D1\u4E8B\u52A1\u540C\u65F6\u8BFB\u5199\u6570\u636E\u5E93\u65F6\u4FDD\u6301\u6570\u636E\u7684\u4E00\u81F4\u6027\u548C\u9694\u79BB\u6027\u3002\u5B83\u662F\u901A\u8FC7\u5728\u6BCF\u4E2A\u6570\u636E\u884C\u4E0A\u7EF4\u62A4\u591A\u4E2A\u7248\u672C\u7684\u6570\u636E\u6765\u5B9E\u73B0\u7684\u3002\u5F53\u4E00\u4E2A\u4E8B\u52A1\u8981\u5BF9\u6570\u636E\u5E93\u4E2D\u7684\u6570\u636E\u8FDB\u884C\u4FEE\u6539\u65F6\uFF0CMVCC \u4F1A\u4E3A\u8BE5\u4E8B\u52A1\u521B\u5EFA\u4E00\u4E2A\u6570\u636E\u5FEB\u7167\uFF0C\u800C\u4E0D\u662F\u76F4\u63A5\u4FEE\u6539\u5B9E\u9645\u7684\u6570\u636E\u884C\u3002"}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"1\u3001\u8BFB\u64CD\u4F5C\uFF08SELECT\uFF09"}),"\uFF1A"]}),"\n",(0,l.jsx)(e.p,{children:"\u5F53\u4E00\u4E2A\u4E8B\u52A1\u6267\u884C\u8BFB\u64CD\u4F5C\u65F6\uFF0C\u5B83\u4F1A\u4F7F\u7528\u5FEB\u7167\u8BFB\u53D6\u3002\u5FEB\u7167\u8BFB\u53D6\u662F\u57FA\u4E8E\u4E8B\u52A1\u5F00\u59CB\u65F6\u6570\u636E\u5E93\u4E2D\u7684\u72B6\u6001\u521B\u5EFA\u7684\uFF0C\u56E0\u6B64\u4E8B\u52A1\u4E0D\u4F1A\u8BFB\u53D6\u5176\u4ED6\u4E8B\u52A1\u5C1A\u672A\u63D0\u4EA4\u7684\u4FEE\u6539\u3002\u5177\u4F53\u5DE5\u4F5C\u60C5\u51B5\u5982\u4E0B\uFF1A"}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5BF9\u4E8E\u8BFB\u53D6\u64CD\u4F5C\uFF0C\u4E8B\u52A1\u4F1A\u67E5\u627E\u7B26\u5408\u6761\u4EF6\u7684\u6570\u636E\u884C\uFF0C\u5E76\u9009\u62E9\u7B26\u5408\u5176\u4E8B\u52A1\u5F00\u59CB\u65F6\u95F4\u7684\u6570\u636E\u7248\u672C\u8FDB\u884C\u8BFB\u53D6\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u5982\u679C\u67D0\u4E2A\u6570\u636E\u884C\u6709\u591A\u4E2A\u7248\u672C\uFF0C\u4E8B\u52A1\u4F1A\u9009\u62E9\u4E0D\u665A\u4E8E\u5176\u5F00\u59CB\u65F6\u95F4\u7684\u6700\u65B0\u7248\u672C\uFF0C\u786E\u4FDD\u4E8B\u52A1\u53EA\u8BFB\u53D6\u5728\u5B83\u5F00\u59CB\u4E4B\u524D\u5DF2\u7ECF\u5B58\u5728\u7684\u6570\u636E\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u4E8B\u52A1\u8BFB\u53D6\u7684\u662F\u5FEB\u7167\u6570\u636E\uFF0C\u56E0\u6B64\u5176\u4ED6\u5E76\u53D1\u4E8B\u52A1\u5BF9\u6570\u636E\u884C\u7684\u4FEE\u6539\u4E0D\u4F1A\u5F71\u54CD\u5F53\u524D\u4E8B\u52A1\u7684\u8BFB\u53D6\u64CD\u4F5C\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"2\u3001\u5199\u64CD\u4F5C\uFF08INSERT\u3001UPDATE\u3001DELETE\uFF09"}),"\uFF1A"]}),"\n",(0,l.jsx)(e.p,{children:"\u5F53\u4E00\u4E2A\u4E8B\u52A1\u6267\u884C\u5199\u64CD\u4F5C\u65F6\uFF0C\u5B83\u4F1A\u751F\u6210\u4E00\u4E2A\u65B0\u7684\u6570\u636E\u7248\u672C\uFF0C\u5E76\u5C06\u4FEE\u6539\u540E\u7684\u6570\u636E\u5199\u5165\u6570\u636E\u5E93\u3002\u5177\u4F53\u5DE5\u4F5C\u60C5\u51B5\u5982\u4E0B\uFF1A"}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5BF9\u4E8E\u5199\u64CD\u4F5C\uFF0C\u4E8B\u52A1\u4F1A\u4E3A\u8981\u4FEE\u6539\u7684\u6570\u636E\u884C\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u7248\u672C\uFF0C\u5E76\u5C06\u4FEE\u6539\u540E\u7684\u6570\u636E\u5199\u5165\u65B0\u7248\u672C\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u65B0\u7248\u672C\u7684\u6570\u636E\u4F1A\u5E26\u6709\u5F53\u524D\u4E8B\u52A1\u7684\u7248\u672C\u53F7\uFF0C\u4EE5\u4FBF\u5176\u4ED6\u4E8B\u52A1\u80FD\u591F\u6B63\u786E\u8BFB\u53D6\u76F8\u5E94\u7248\u672C\u7684\u6570\u636E\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u539F\u59CB\u7248\u672C\u7684\u6570\u636E\u4ECD\u7136\u5B58\u5728\uFF0C\u4F9B\u5176\u4ED6\u4E8B\u52A1\u4F7F\u7528\u5FEB\u7167\u8BFB\u53D6\uFF0C\u8FD9\u4FDD\u8BC1\u4E86\u5176\u4ED6\u4E8B\u52A1\u4E0D\u53D7\u5F53\u524D\u4E8B\u52A1\u7684\u5199\u64CD\u4F5C\u5F71\u54CD\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"3\u3001\u4E8B\u52A1\u63D0\u4EA4\u548C\u56DE\u6EDA"}),"\uFF1A"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5F53\u4E00\u4E2A\u4E8B\u52A1\u63D0\u4EA4\u65F6\uFF0C\u5B83\u6240\u505A\u7684\u4FEE\u6539\u5C06\u6210\u4E3A\u6570\u636E\u5E93\u7684\u6700\u65B0\u7248\u672C\uFF0C\u5E76\u4E14\u5BF9\u5176\u4ED6\u4E8B\u52A1\u53EF\u89C1\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u5F53\u4E00\u4E2A\u4E8B\u52A1\u56DE\u6EDA\u65F6\uFF0C\u5B83\u6240\u505A\u7684\u4FEE\u6539\u5C06\u88AB\u64A4\u9500\uFF0C\u5BF9\u5176\u4ED6\u4E8B\u52A1\u4E0D\u53EF\u89C1\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"4\u3001\u7248\u672C\u7684\u56DE\u6536"}),"\uFF1A"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u4E3A\u4E86\u9632\u6B62\u6570\u636E\u5E93\u4E2D\u7684\u7248\u672C\u65E0\u9650\u589E\u957F\uFF0CMVCC \u4F1A\u5B9A\u671F\u8FDB\u884C\u7248\u672C\u7684\u56DE\u6536\u3002\u56DE\u6536\u673A\u5236\u4F1A\u5220\u9664\u5DF2\u7ECF\u4E0D\u518D\u9700\u8981\u7684\u65E7\u7248\u672C\u6570\u636E\uFF0C\u4ECE\u800C\u91CA\u653E\u7A7A\u95F4\u3002"}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:"MVCC \u901A\u8FC7\u521B\u5EFA\u6570\u636E\u7684\u591A\u4E2A\u7248\u672C\u548C\u4F7F\u7528\u5FEB\u7167\u8BFB\u53D6\u6765\u5B9E\u73B0\u5E76\u53D1\u63A7\u5236\u3002\u8BFB\u64CD\u4F5C\u4F7F\u7528\u65E7\u7248\u672C\u6570\u636E\u7684\u5FEB\u7167\uFF0C\u5199\u64CD\u4F5C\u521B\u5EFA\u65B0\u7248\u672C\uFF0C\u5E76\u786E\u4FDD\u539F\u59CB\u7248\u672C\u4ECD\u7136\u53EF\u7528\u3002\u8FD9\u6837\uFF0C\u4E0D\u540C\u7684\u4E8B\u52A1\u53EF\u4EE5\u5728\u4E00\u5B9A\u7A0B\u5EA6\u4E0A\u5E76\u53D1\u6267\u884C\uFF0C\u800C\u4E0D\u4F1A\u76F8\u4E92\u5E72\u6270\uFF0C\u4ECE\u800C\u63D0\u9AD8\u4E86\u6570\u636E\u5E93\u7684\u5E76\u53D1\u6027\u80FD\u548C\u6570\u636E\u4E00\u81F4\u6027\u3002"}),"\n",(0,l.jsx)(e.h2,{id:"innodb-\u5BF9-mvcc-\u7684\u5B9E\u73B0",children:"InnoDB \u5BF9 MVCC \u7684\u5B9E\u73B0"}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.code,{children:"MVCC"})," \u7684\u5B9E\u73B0\u4F9D\u8D56\u4E8E\uFF1A",(0,l.jsx)(e.strong,{children:"\u9690\u85CF\u5B57\u6BB5\u3001Read View\u3001undo log"}),"\u3002\u5728\u5185\u90E8\u5B9E\u73B0\u4E2D\uFF0C",(0,l.jsx)(e.code,{children:"InnoDB"})," \u901A\u8FC7\u6570\u636E\u884C\u7684 ",(0,l.jsx)(e.code,{children:"DB_TRX_ID"})," \u548C ",(0,l.jsx)(e.code,{children:"Read View"})," \u6765\u5224\u65AD\u6570\u636E\u7684\u53EF\u89C1\u6027\uFF0C\u5982\u4E0D\u53EF\u89C1\uFF0C\u5219\u901A\u8FC7\u6570\u636E\u884C\u7684 ",(0,l.jsx)(e.code,{children:"DB_ROLL_PTR"})," \u627E\u5230 ",(0,l.jsx)(e.code,{children:"undo log"})," \u4E2D\u7684\u5386\u53F2\u7248\u672C\u3002\u6BCF\u4E2A\u4E8B\u52A1\u8BFB\u5230\u7684\u6570\u636E\u7248\u672C\u53EF\u80FD\u662F\u4E0D\u4E00\u6837\u7684\uFF0C\u5728\u540C\u4E00\u4E2A\u4E8B\u52A1\u4E2D\uFF0C\u7528\u6237\u53EA\u80FD\u770B\u5230\u8BE5\u4E8B\u52A1\u521B\u5EFA ",(0,l.jsx)(e.code,{children:"Read View"})," \u4E4B\u524D\u5DF2\u7ECF\u63D0\u4EA4\u7684\u4FEE\u6539\u548C\u8BE5\u4E8B\u52A1\u672C\u8EAB\u505A\u7684\u4FEE\u6539"]}),"\n",(0,l.jsx)(e.h3,{id:"\u9690\u85CF\u5B57\u6BB5",children:"\u9690\u85CF\u5B57\u6BB5"}),"\n",(0,l.jsxs)(e.p,{children:["\u5728\u5185\u90E8\uFF0C",(0,l.jsx)(e.code,{children:"InnoDB"})," \u5B58\u50A8\u5F15\u64CE\u4E3A\u6BCF\u884C\u6570\u636E\u6DFB\u52A0\u4E86\u4E09\u4E2A ",(0,l.jsx)(e.a,{href:"https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html",children:"\u9690\u85CF\u5B57\u6BB5"}),"\uFF1A"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"DB_TRX_ID\uFF086\u5B57\u8282\uFF09"}),"\uFF1A\u8868\u793A\u6700\u540E\u4E00\u6B21\u63D2\u5165\u6216\u66F4\u65B0\u8BE5\u884C\u7684\u4E8B\u52A1 id\u3002\u6B64\u5916\uFF0C",(0,l.jsx)(e.code,{children:"delete"})," \u64CD\u4F5C\u5728\u5185\u90E8\u88AB\u89C6\u4E3A\u66F4\u65B0\uFF0C\u53EA\u4E0D\u8FC7\u4F1A\u5728\u8BB0\u5F55\u5934 ",(0,l.jsx)(e.code,{children:"Record header"})," \u4E2D\u7684 ",(0,l.jsx)(e.code,{children:"deleted_flag"})," \u5B57\u6BB5\u5C06\u5176\u6807\u8BB0\u4E3A\u5DF2\u5220\u9664"]}),"\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"DB_ROLL_PTR\uFF087\u5B57\u8282\uFF09"})," \u56DE\u6EDA\u6307\u9488\uFF0C\u6307\u5411\u8BE5\u884C\u7684 ",(0,l.jsx)(e.code,{children:"undo log"})," \u3002\u5982\u679C\u8BE5\u884C\u672A\u88AB\u66F4\u65B0\uFF0C\u5219\u4E3A\u7A7A"]}),"\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"DB_ROW_ID\uFF086\u5B57\u8282\uFF09"}),"\uFF1A\u5982\u679C\u6CA1\u6709\u8BBE\u7F6E\u4E3B\u952E\u4E14\u8BE5\u8868\u6CA1\u6709\u552F\u4E00\u975E\u7A7A\u7D22\u5F15\u65F6\uFF0C",(0,l.jsx)(e.code,{children:"InnoDB"})," \u4F1A\u4F7F\u7528\u8BE5 id \u6765\u751F\u6210\u805A\u7C07\u7D22\u5F15"]}),"\n"]}),"\n",(0,l.jsx)(e.h3,{id:"readview",children:"ReadView"}),"\n",(0,l.jsx)(e.p,{children:"\u4E3B\u8981\u662F\u7528\u6765\u505A\u53EF\u89C1\u6027\u5224\u65AD\uFF0C\u91CC\u9762\u4FDD\u5B58\u4E86 \u201C\u5F53\u524D\u5BF9\u672C\u4E8B\u52A1\u4E0D\u53EF\u89C1\u7684\u5176\u4ED6\u6D3B\u8DC3\u4E8B\u52A1\u201D"}),"\n",(0,l.jsx)(e.p,{children:"\u4E3B\u8981\u6709\u4EE5\u4E0B\u5B57\u6BB5\uFF1A"}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"m_low_limit_id"}),"\uFF1A\u76EE\u524D\u51FA\u73B0\u8FC7\u7684\u6700\u5927\u7684\u4E8B\u52A1 ID+1\uFF0C\u5373\u4E0B\u4E00\u4E2A\u5C06\u88AB\u5206\u914D\u7684\u4E8B\u52A1 ID\u3002\u5927\u4E8E\u7B49\u4E8E\u8FD9\u4E2A ID \u7684\u6570\u636E\u7248\u672C\u5747\u4E0D\u53EF\u89C1"]}),"\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"m_up_limit_id"}),"\uFF1A\u6D3B\u8DC3\u4E8B\u52A1\u5217\u8868 ",(0,l.jsx)(e.code,{children:"m_ids"})," \u4E2D\u6700\u5C0F\u7684\u4E8B\u52A1 ID\uFF0C\u5982\u679C ",(0,l.jsx)(e.code,{children:"m_ids"})," \u4E3A\u7A7A\uFF0C\u5219 ",(0,l.jsx)(e.code,{children:"m_up_limit_id"})," \u4E3A ",(0,l.jsx)(e.code,{children:"m_low_limit_id"}),"\u3002\u5C0F\u4E8E\u8FD9\u4E2A ID \u7684\u6570\u636E\u7248\u672C\u5747\u53EF\u89C1"]}),"\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"m_ids"}),"\uFF1A",(0,l.jsx)(e.code,{children:"Read View"})," \u521B\u5EFA\u65F6\u5176\u4ED6\u672A\u63D0\u4EA4\u7684\u6D3B\u8DC3\u4E8B\u52A1 ID \u5217\u8868\u3002\u521B\u5EFA ",(0,l.jsx)(e.code,{children:"Read View"}),"\u65F6\uFF0C\u5C06\u5F53\u524D\u672A\u63D0\u4EA4\u4E8B\u52A1 ID \u8BB0\u5F55\u4E0B\u6765\uFF0C\u540E\u7EED\u5373\u4F7F\u5B83\u4EEC\u4FEE\u6539\u4E86\u8BB0\u5F55\u884C\u7684\u503C\uFF0C\u5BF9\u4E8E\u5F53\u524D\u4E8B\u52A1\u4E5F\u662F\u4E0D\u53EF\u89C1\u7684\u3002",(0,l.jsx)(e.code,{children:"m_ids"})," \u4E0D\u5305\u62EC\u5F53\u524D\u4E8B\u52A1\u81EA\u5DF1\u548C\u5DF2\u63D0\u4EA4\u7684\u4E8B\u52A1\uFF08\u6B63\u5728\u5185\u5B58\u4E2D\uFF09"]}),"\n",(0,l.jsxs)(e.li,{children:[(0,l.jsx)(e.code,{children:"m_creator_trx_id"}),"\uFF1A\u521B\u5EFA\u8BE5 ",(0,l.jsx)(e.code,{children:"Read View"})," \u7684\u4E8B\u52A1 ID"]}),"\n"]}),"\n",(0,l.jsx)(e.h3,{id:"undo-log",children:"undo-log"}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.code,{children:"undo log"})," \u4E3B\u8981\u6709\u4E24\u4E2A\u4F5C\u7528\uFF1A"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5F53\u4E8B\u52A1\u56DE\u6EDA\u65F6\u7528\u4E8E\u5C06\u6570\u636E\u6062\u590D\u5230\u4FEE\u6539\u524D\u7684\u6837\u5B50"}),"\n",(0,l.jsxs)(e.li,{children:["\u53E6\u4E00\u4E2A\u4F5C\u7528\u662F ",(0,l.jsx)(e.code,{children:"MVCC"})," \uFF0C\u5F53\u8BFB\u53D6\u8BB0\u5F55\u65F6\uFF0C\u82E5\u8BE5\u8BB0\u5F55\u88AB\u5176\u4ED6\u4E8B\u52A1\u5360\u7528\u6216\u5F53\u524D\u7248\u672C\u5BF9\u8BE5\u4E8B\u52A1\u4E0D\u53EF\u89C1\uFF0C\u5219\u53EF\u4EE5\u901A\u8FC7 ",(0,l.jsx)(e.code,{children:"undo log"})," \u8BFB\u53D6\u4E4B\u524D\u7684\u7248\u672C\u6570\u636E\uFF0C\u4EE5\u6B64\u5B9E\u73B0\u975E\u9501\u5B9A\u8BFB"]}),"\n"]}),"\n",(0,l.jsx)(e.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:(0,l.jsx)(e.a,{href:"https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html",children:"https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html"})}),"\n"]})]})}function a(n={}){let{wrapper:e}={...(0,s.a)(),...n.components};return e?(0,l.jsx)(e,{...n,children:(0,l.jsx)(h,{...n})}):h(n)}},50065:function(n,e,i){i.d(e,{Z:function(){return r},a:function(){return c}});var d=i(67294);let l={},s=d.createContext(l);function c(n){let e=d.useContext(s);return d.useMemo(function(){return"function"==typeof n?n(e):{...e,...n}},[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(l):n.components||l:c(n.components),d.createElement(s.Provider,{value:e},n.children)}}}]);