"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2774"],{72008:function(e,s,n){n.r(s),n.d(s,{metadata:()=>r,contentTitle:()=>l,default:()=>x,assets:()=>t,toc:()=>h,frontMatter:()=>i});var r=JSON.parse('{"id":"\u53EF\u89C2\u6D4B\u6027/\u76D1\u63A7\u6280\u672F/Linux\u4E2D\u8FDB\u7A0B\u5185\u5B58\u53CAcgroup\u5185\u5B58\u7EDF\u8BA1\u5DEE\u5F02","title":"Linux\u4E2D\u8FDB\u7A0B\u5185\u5B58\u53CAcgroup\u5185\u5B58\u7EDF\u8BA1\u5DEE\u5F02","description":"\u6DF1\u5165\u5206\u6790 Linux \u7CFB\u7EDF\u4E2D\u8FDB\u7A0B\u5185\u5B58\u548C cgroup \u5185\u5B58\u7EDF\u8BA1\u7684\u5DEE\u5F02\uFF0C\u5E2E\u52A9\u7528\u6237\u7406\u89E3\u5BB9\u5668\u73AF\u5883\u4E0B\u7684\u5185\u5B58\u7BA1\u7406\u548C\u76D1\u63A7","source":"@site/docs/4-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F/4-Linux\u4E2D\u8FDB\u7A0B\u5185\u5B58\u53CAcgroup\u5185\u5B58\u7EDF\u8BA1\u5DEE\u5F02.md","sourceDirName":"4-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F","slug":"/observability/linux-memory-cgroup-statistics","permalink":"/observability/linux-memory-cgroup-statistics","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"slug":"/observability/linux-memory-cgroup-statistics","title":"Linux\u4E2D\u8FDB\u7A0B\u5185\u5B58\u53CAcgroup\u5185\u5B58\u7EDF\u8BA1\u5DEE\u5F02","hide_title":true,"keywords":["Linux","Memory","cgroup","\u5185\u5B58\u7EDF\u8BA1","\u8FDB\u7A0B\u5185\u5B58","\u5BB9\u5668\u5185\u5B58","\u7CFB\u7EDF\u76D1\u63A7"],"description":"\u6DF1\u5165\u5206\u6790 Linux \u7CFB\u7EDF\u4E2D\u8FDB\u7A0B\u5185\u5B58\u548C cgroup \u5185\u5B58\u7EDF\u8BA1\u7684\u5DEE\u5F02\uFF0C\u5E2E\u52A9\u7528\u6237\u7406\u89E3\u5BB9\u5668\u73AF\u5883\u4E0B\u7684\u5185\u5B58\u7BA1\u7406\u548C\u76D1\u63A7"},"sidebar":"mainSidebar","previous":{"title":"\u5E38\u7528exporter\u6307\u6807samples","permalink":"/observability/prometheus-exporter-metrics-samples"},"next":{"title":"Cadvisor working set bytes\u4E0Elinux oom killer","permalink":"/observability/cadvisor-working-set-bytes-oom-killer"}}'),c=n("85893"),d=n("50065");let i={slug:"/observability/linux-memory-cgroup-statistics",title:"Linux\u4E2D\u8FDB\u7A0B\u5185\u5B58\u53CAcgroup\u5185\u5B58\u7EDF\u8BA1\u5DEE\u5F02",hide_title:!0,keywords:["Linux","Memory","cgroup","\u5185\u5B58\u7EDF\u8BA1","\u8FDB\u7A0B\u5185\u5B58","\u5BB9\u5668\u5185\u5B58","\u7CFB\u7EDF\u76D1\u63A7"],description:"\u6DF1\u5165\u5206\u6790 Linux \u7CFB\u7EDF\u4E2D\u8FDB\u7A0B\u5185\u5B58\u548C cgroup \u5185\u5B58\u7EDF\u8BA1\u7684\u5DEE\u5F02\uFF0C\u5E2E\u52A9\u7528\u6237\u7406\u89E3\u5BB9\u5668\u73AF\u5883\u4E0B\u7684\u5185\u5B58\u7BA1\u7406\u548C\u76D1\u63A7"},l=void 0,t={},h=[{value:"Linux\u5185\u5B58\u7B80\u4ECB",id:"linux\u5185\u5B58\u7B80\u4ECB",level:2},{value:"\u8FDB\u7A0B\u5185\u5B58",id:"\u8FDB\u7A0B\u5185\u5B58",level:2},{value:"\u865A\u62DF\u5730\u5740\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58",id:"\u865A\u62DF\u5730\u5740\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58",level:4},{value:"PageCache",id:"pagecache",level:4},{value:"\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",id:"\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",level:2},{value:"\u5355\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",id:"\u5355\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",level:4},{value:"\u5E38\u7528\u5185\u5B58\u67E5\u8BE2\u547D\u4EE4",id:"\u5E38\u7528\u5185\u5B58\u67E5\u8BE2\u547D\u4EE4",level:4},{value:"top",id:"top",level:6},{value:"ps",id:"ps",level:6},{value:"smem",id:"smem",level:6},{value:"\u5185\u5B58\u6307\u6807\u5173\u7CFB",id:"\u5185\u5B58\u6307\u6807\u5173\u7CFB",level:4},{value:"<code>cgroup</code>\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",id:"cgroup\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",level:4},{value:"\u603B\u7ED3",id:"\u603B\u7ED3",level:4},{value:"Docker\u548CK8s\u4E2D\u7684\u5185\u5B58\u7EDF\u8BA1",id:"docker\u548Ck8s\u4E2D\u7684\u5185\u5B58\u7EDF\u8BA1",level:2},{value:"docker stat\u547D\u4EE4",id:"docker-stat\u547D\u4EE4",level:4},{value:"kubectl top pod\u547D\u4EE4",id:"kubectl-top-pod\u547D\u4EE4",level:4},{value:"\u603B\u7ED3",id:"\u603B\u7ED3-1",level:4},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function o(e){let s={a:"a",br:"br",code:"code",h2:"h2",h4:"h4",h6:"h6",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.a)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s.h2,{id:"linux\u5185\u5B58\u7B80\u4ECB",children:"Linux\u5185\u5B58\u7B80\u4ECB"}),"\n",(0,c.jsxs)(s.p,{children:["\u7531\u4E8E",(0,c.jsx)(s.code,{children:"BIOS"}),"\u548C",(0,c.jsx)(s.code,{children:"Kernel"}),"\u542F\u52A8\u8FC7\u7A0B\u6D88\u8017\u4E86\u90E8\u5206\u7269\u7406\u5185\u5B58\uFF0C\u56E0\u6B64",(0,c.jsx)(s.code,{children:"MemTotal"}),"\u503C\uFF08 ",(0,c.jsx)(s.code,{children:"free"})," \u547D\u4EE4\u83B7\u53D6\uFF09\u5C0F\u4E8E",(0,c.jsx)(s.code,{children:"RAM"}),"\u5BB9\u91CF\u3002 ",(0,c.jsx)(s.code,{children:"Linux"}),"\u5185\u5B58\u67E5\u8BE2\u65B9\u5F0F\uFF1A"]}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"free"})," \u547D\u4EE4"]}),"\n",(0,c.jsx)(s.li,{children:(0,c.jsx)(s.code,{children:"/proc/meminfo"})}),"\n"]}),"\n",(0,c.jsxs)(s.p,{children:["\u901A\u8FC7\u67E5\u8BE2\u5230\u7684\u5185\u5B58\u6570\u636E\u53EF\u4EE5\u5F97\u5230",(0,c.jsx)(s.code,{children:"Linux"}),"\u5185\u5B58\u8BA1\u7B97\u516C\u5F0F\u5982\u4E0B\uFF1A"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{className:"language-bash",children:"## \u603B\u5185\u5B58 = \u5DF2\u4F7F\u7528\u5185\u5B58 + \u7A7A\u95F2\u5185\u5B58 + \u7F13\u5B58\ntotal = used + free + buff/cache \n"})}),"\n",(0,c.jsxs)(s.p,{children:["\u5176\u4E2D\uFF0C\u5DF2\u4F7F\u7528\u5185\u5B58\u6570\u636E\u5305\u62EC",(0,c.jsx)(s.code,{children:"Kernel"}),"\u6D88\u8017\u7684\u5185\u5B58\u548C\u6240\u6709\u8FDB\u7A0B\u6D88\u8017\u7684\u5185\u5B58\u3002"]}),"\n",(0,c.jsx)(s.h2,{id:"\u8FDB\u7A0B\u5185\u5B58",children:"\u8FDB\u7A0B\u5185\u5B58"}),"\n",(0,c.jsx)(s.p,{children:"\u8FDB\u7A0B\u6D88\u8017\u7684\u5185\u5B58\u5305\u62EC\uFF1A"}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsx)(s.li,{children:"\u865A\u62DF\u5730\u5740\u7A7A\u95F4\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58\u3002"}),"\n",(0,c.jsxs)(s.li,{children:["\u8BFB\u5199\u78C1\u76D8\u751F\u6210",(0,c.jsx)(s.code,{children:"PageCache"}),"\u6D88\u8017\u7684\u5185\u5B58\u3002"]}),"\n"]}),"\n",(0,c.jsx)(s.h4,{id:"\u865A\u62DF\u5730\u5740\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58",children:"\u865A\u62DF\u5730\u5740\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(88327).Z+"",width:"928",height:"705"})}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.strong,{children:"\u7269\u7406\u5185\u5B58"}),"\uFF1A\u786C\u4EF6\u5B89\u88C5\u7684\u5185\u5B58\uFF08",(0,c.jsx)(s.strong,{children:"\u5185\u5B58\u6761"}),"\uFF09\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.strong,{children:"\u865A\u62DF\u5185\u5B58"}),"\uFF1A\u64CD\u4F5C\u7CFB\u7EDF\u4E3A\u7A0B\u5E8F\u8FD0\u884C\u63D0\u4F9B\u7684\u5185\u5B58\u3002\u7A0B\u5E8F\u8FD0\u884C\u7A7A\u95F4\u5305\u62EC",(0,c.jsxs)(s.strong,{children:["\u7528\u6237\u7A7A\u95F4\uFF08\u7528\u6237\u6001\uFF09",(0,c.jsx)(s.strong,{children:"\u548C"}),"\u5185\u6838\u7A7A\u95F4\uFF08\u5185\u6838\u6001\uFF09"]}),"\u3002","\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.strong,{children:"\u7528\u6237\u6001"}),"\uFF1A\u4F4E\u7279\u6743\u8FD0\u884C\u7A0B\u5E8F\u3002\u6570\u636E\u5B58\u50A8\u7A7A\u95F4\u5305\u62EC\uFF1A"]}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:["\u6808\uFF08",(0,c.jsx)(s.code,{children:"Stack"}),"\uFF09\uFF1A\u51FD\u6570\u8C03\u7528\u7684\u51FD\u6570\u6808\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"MMap(Memory Mapping Segment)"}),"\uFF1A\u5185\u5B58\u6620\u5C04\u533A\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:["\u5806\uFF08",(0,c.jsx)(s.code,{children:"Heap"}),"\uFF09\uFF1A\u52A8\u6001\u5206\u914D\u5185\u5B58\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"BBS"}),"\u533A\uFF1A\u672A\u521D\u59CB\u5316\u7684\u9759\u6001\u53D8\u91CF\u5B58\u653E\u533A\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"Data"}),"\u533A\uFF1A\u5DF2\u521D\u59CB\u5316\u7684\u9759\u6001\u5E38\u91CF\u5B58\u653E\u533A\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"Text"}),"\u533A\uFF1A\u4E8C\u8FDB\u5236\u53EF\u6267\u884C\u4EE3\u7801\u5B58\u653E\u533A\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.p,{children:["\u7528\u6237\u6001\u4E2D\u8FD0\u884C\u7684\u7A0B\u5E8F\u901A\u8FC7",(0,c.jsx)(s.code,{children:"MMap"}),"\u5C06\u865A\u62DF\u5730\u5740\u6620\u5C04\u81F3\u7269\u7406\u5185\u5B58\u4E2D\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.strong,{children:"\u5185\u6838\u6001"}),"\uFF1A\u8FD0\u884C\u7684\u7A0B\u5E8F\u9700\u8981\u8BBF\u95EE\u64CD\u4F5C\u7CFB\u7EDF\u5185\u6838\u6570\u636E\u3002\u6570\u636E\u5B58\u50A8\u7A7A\u95F4\u5305\u62EC\uFF1A"]}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsx)(s.li,{children:"\u76F4\u63A5\u6620\u5C04\u533A\uFF1A\u901A\u8FC7\u7B80\u5355\u6620\u5C04\u5C06\u865A\u62DF\u5730\u5740\u6620\u5C04\u81F3\u7269\u7406\u5185\u5B58\u4E2D\u3002"}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"VMALLOC"}),"\uFF1A\u5185\u6838\u52A8\u6001\u6620\u5C04\u7A7A\u95F4\uFF0C\u7528\u4E8E\u5C06\u8FDE\u7EED\u7684\u865A\u62DF\u5730\u5740\u6620\u5C04\u81F3\u4E0D\u8FDE\u7EED\u7684\u7269\u7406\u5185\u5B58\u4E2D\u3002"]}),"\n",(0,c.jsx)(s.li,{children:"\u6301\u4E45\u5185\u6838\u6620\u5C04\u533A\uFF1A\u5C06\u865A\u62DF\u5730\u5740\u6620\u5C04\u81F3\u7269\u7406\u5185\u5B58\u7684\u9AD8\u7AEF\u5185\u5B58\u4E2D\u3002"}),"\n",(0,c.jsx)(s.li,{children:"\u56FA\u5B9A\u6620\u5C04\u533A\uFF1A\u7528\u4E8E\u6EE1\u8DB3\u7279\u6B8A\u6620\u5C04\u9700\u6C42\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,c.jsxs)(s.p,{children:["\u865A\u62DF\u5730\u5740\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58\u53EF\u4EE5\u533A\u5206\u4E3A",(0,c.jsx)(s.strong,{children:"\u5171\u4EAB\u7269\u7406\u5185\u5B58"}),"\u548C",(0,c.jsx)(s.strong,{children:"\u72EC\u5360\u7269\u7406\u5185\u5B58"}),"\u3002\u5982\u4E0B\u56FE\u6240\u793A\uFF0C\u7269\u7406\u5185\u5B581\u548C3\u7531\u8FDB\u7A0BA\u72EC\u5360\uFF0C\u7269\u7406\u5185\u5B582\u7531\u8FDB\u7A0BB\u72EC\u5360\uFF0C\u7269\u7406\u5185\u5B584\u7531\u8FDB\u7A0BA\u548C\u8FDB\u7A0BB\u5171\u4EAB\u3002"]}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(64655).Z+"",width:"1165",height:"691"})}),"\n",(0,c.jsx)(s.h4,{id:"pagecache",children:"PageCache"}),"\n",(0,c.jsxs)(s.p,{children:["\u9664\u4E86\u901A\u8FC7",(0,c.jsx)(s.code,{children:"MMap"}),"\u6587\u4EF6\u76F4\u63A5\u6620\u5C04\u5916\uFF0C\u8FDB\u7A0B\u6587\u4EF6\u8FD8\u53EF\u4EE5\u901A\u8FC7\u7CFB\u7EDF\u8C03\u7528",(0,c.jsx)(s.code,{children:"Buffered I/O"}),"\u76F8\u5173\u7684",(0,c.jsx)(s.code,{children:"Syscall"}),"\u5C06\u6570\u636E\u5199\u5165\u5230",(0,c.jsx)(s.code,{children:"PageCache"}),"\uFF0C\u56E0\u6B64\uFF0C",(0,c.jsx)(s.code,{children:"PageCache"}),"\u4E5F\u4F1A\u5360\u7528\u4E00\u90E8\u5206\u5185\u5B58\u3002"]}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(9856).Z+"",width:"803",height:"696"})}),"\n",(0,c.jsx)(s.h2,{id:"\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",children:"\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807"}),"\n",(0,c.jsx)(s.h4,{id:"\u5355\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",children:"\u5355\u8FDB\u7A0B\u5185\u5B58\u7EDF\u8BA1\u6307\u6807"}),"\n",(0,c.jsx)(s.p,{children:"\u8FDB\u7A0B\u8D44\u6E90\u6709\u5982\u4E0B\u7C7B\u578B\uFF1A"}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"anno_rss"}),"\uFF1A\u8868\u793A\u6CA1\u6709\u6620\u5C04\u5230\u6587\u4EF6\u7684\u5185\u5B58\u91CF\uFF0C\u5373\u533F\u540D\u5185\u5B58\u3002\u533F\u540D\u5185\u5B58\u901A\u5E38\u662F\u8FDB\u7A0B\u901A\u8FC7",(0,c.jsx)(s.code,{children:"malloc"}),"\u6216\u7C7B\u4F3C\u7684\u65B9\u6CD5\u52A8\u6001\u5206\u914D\u7684\u5185\u5B58\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"file_rss"}),"\uFF1A\u8868\u793A\u6620\u5C04\u5230\u6587\u4EF6\u7684\u5185\u5B58\u91CF\u3002\u5982\u679C\u4E00\u4E2A\u8FDB\u7A0B\u6253\u5F00\u4E86\u4E00\u4E2A\u6587\u4EF6\u5E76\u5C06\u5176\u6620\u5C04\u5230\u5185\u5B58\uFF0C\u90A3\u4E48\u8FD9\u90E8\u5206\u5185\u5B58\u5C31\u4F1A\u88AB\u8BA1\u5165",(0,c.jsx)(s.code,{children:"file_rss"}),"\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"shmem_rss"}),"\uFF1A\u8868\u793A\u5171\u4EAB\u5185\u5B58\u91CF\u3002\u5982\u679C\u591A\u4E2A\u8FDB\u7A0B\u5171\u4EAB\u4E00\u90E8\u5206\u5185\u5B58\uFF0C\u90A3\u4E48\u8FD9\u90E8\u5206\u5185\u5B58\u5C31\u4F1A\u88AB\u8BA1\u5165",(0,c.jsx)(s.code,{children:"shmem_rss"}),"\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.p,{children:["::: tip\n",(0,c.jsx)(s.code,{children:"RSS( resident set size)"}),"\uFF1A\u9A7B\u7559\u96C6\u5927\u5C0F\u3002\u8868\u793A\u8FDB\u7A0B\u5DF2\u88C5\u5165\u5185\u5B58\u7684\u9875\u9762\u7684\u96C6\u5408\u3002\n:::"]}),"\n",(0,c.jsx)(s.h4,{id:"\u5E38\u7528\u5185\u5B58\u67E5\u8BE2\u547D\u4EE4",children:"\u5E38\u7528\u5185\u5B58\u67E5\u8BE2\u547D\u4EE4"}),"\n",(0,c.jsx)(s.h6,{id:"top",children:"top"}),"\n",(0,c.jsxs)(s.p,{children:["::: tip\n\u8BE5\u547D\u4EE4\u5C55\u793A\u7684\u5185\u5B58\u5355\u4F4D\u9ED8\u8BA4\u4E3A",(0,c.jsx)(s.code,{children:"KB"}),"\u3002\n:::"]}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(63409).Z+"",width:"3784",height:"680"})}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u547D\u4EE4"}),(0,c.jsx)(s.th,{children:"\u5185\u5B58"}),(0,c.jsx)(s.th,{children:"\u8BF4\u660E"}),(0,c.jsx)(s.th,{children:"\u8BA1\u7B97\u516C\u5F0F"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"top"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"VIRT(Virtual Set Size)"})}),(0,c.jsx)(s.td,{children:"\u865A\u62DF\u5730\u5740\u7A7A\u95F4\u3002"}),(0,c.jsx)(s.td,{children:"\u65E0"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RES(Resident Set Size)"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"RSS"}),"\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58\u3002"]}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anno_rss + file_rss + shmem_rss"})}),(0,c.jsx)(s.td,{})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"SHR(Shared Memory)"})}),(0,c.jsx)(s.td,{children:"\u5171\u4EAB\u5185\u5B58\u3002"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"file_rss + shmem_rss"})}),(0,c.jsx)(s.td,{})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"%MEM"})}),(0,c.jsx)(s.td,{children:"\u5185\u5B58\u4F7F\u7528\u7387\u3002"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RES / MemTotal"})}),(0,c.jsx)(s.td,{})]})]})]}),"\n",(0,c.jsx)(s.h6,{id:"ps",children:"ps"}),"\n",(0,c.jsxs)(s.p,{children:["::: tip\n\u8BE5\u547D\u4EE4\u5C55\u793A\u7684\u5185\u5B58\u5355\u4F4D\u9ED8\u8BA4\u4E3A",(0,c.jsx)(s.code,{children:"KB"}),"\u3002\n:::"]}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(76831).Z+"",width:"3012",height:"446"})}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u547D\u4EE4"}),(0,c.jsx)(s.th,{children:"\u5185\u5B58"}),(0,c.jsx)(s.th,{children:"\u8BF4\u660E"}),(0,c.jsx)(s.th,{children:"\u8BA1\u7B97\u516C\u5F0F"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"ps"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"VSZ(Virtual Set Size)"})}),(0,c.jsx)(s.td,{children:"\u865A\u62DF\u5730\u5740\u7A7A\u95F4\u3002"}),(0,c.jsx)(s.td,{children:"\u65E0"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RSS(Resident Set Size)"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"RSS"}),"\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58\u3002"]}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anno_rss + file_rss + shmem_rss"})}),(0,c.jsx)(s.td,{})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"%MEM"})}),(0,c.jsx)(s.td,{children:"\u5185\u5B58\u4F7F\u7528\u7387\u3002"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RSS / MemTotal"})}),(0,c.jsx)(s.td,{})]})]})]}),"\n",(0,c.jsx)(s.h6,{id:"smem",children:"smem"}),"\n",(0,c.jsx)(s.p,{children:"::: tip\n\u8BE5\u547D\u4EE4\u9700\u8981\u5355\u72EC\u5B89\u88C5\u3002\n:::"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(79863).Z+"",width:"2242",height:"624"})}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u547D\u4EE4"}),(0,c.jsx)(s.th,{children:"\u5185\u5B58"}),(0,c.jsx)(s.th,{children:"\u8BF4\u660E"}),(0,c.jsx)(s.th,{children:"\u8BA1\u7B97\u516C\u5F0F"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"smem"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"USS(Unique Set Size)"})}),(0,c.jsx)(s.td,{children:"\u72EC\u5360\u5185\u5B58\u3002"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anno_rss"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"PSS(Proportional Set Size)"})}),(0,c.jsx)(s.td,{children:"\u6309\u6BD4\u4F8B\u5206\u914D\u5185\u5B58\u3002"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anno_rss + file_rss/m + shmem_rss/n"})}),(0,c.jsx)(s.td,{})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RSS(Resident Set Size)"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"RSS"}),"\u6620\u5C04\u7684\u7269\u7406\u5185\u5B58\u3002"]}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anno_rss + file_rss + shmem_rss"})}),(0,c.jsx)(s.td,{})]})]})]}),"\n",(0,c.jsx)(s.h4,{id:"\u5185\u5B58\u6307\u6807\u5173\u7CFB",children:"\u5185\u5B58\u6307\u6807\u5173\u7CFB"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(31989).Z+"",width:"1284",height:"780"})}),"\n",(0,c.jsxs)(s.p,{children:["::: tip\n",(0,c.jsx)(s.code,{children:"WSS(Memoy Working Set Size)"}),"\u6307\u6807\uFF1A\u4E00\u79CD\u66F4\u4E3A\u5408\u7406\u8BC4\u4F30\u8FDB\u7A0B\u5185\u5B58\u771F\u5B9E\u4F7F\u7528\u5185\u5B58\u7684\u8BA1\u7B97\u65B9\u5F0F\u3002\n\u4F46\u662F\u53D7\u9650\u4E8E",(0,c.jsx)(s.code,{children:"Linux Page Reclaim"}),"\u673A\u5236\uFF0C\u8FD9\u4E2A\u6982\u5FF5\u76EE\u524D\u8FD8\u53EA\u662F\u6982\u5FF5\uFF0C\u5E76\u6CA1\u6709\u54EA\u4E00\u4E2A\u5DE5\u5177\u53EF\u4EE5\u6B63\u786E\u7EDF\u8BA1\u51FA",(0,c.jsx)(s.code,{children:"WSS"}),"\uFF0C\u53EA\u80FD\u662F\u8D8B\u8FD1\u3002\n:::"]}),"\n",(0,c.jsxs)(s.h4,{id:"cgroup\u5185\u5B58\u7EDF\u8BA1\u6307\u6807",children:[(0,c.jsx)(s.code,{children:"cgroup"}),"\u5185\u5B58\u7EDF\u8BA1\u6307\u6807"]}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"cgroup"}),"\u7528\u4E8E\u5BF9",(0,c.jsx)(s.code,{children:"Linux"}),"\u7684\u4E00\u7EC4\u8FDB\u7A0B\u8D44\u6E90\u8FDB\u884C\u9650\u5236\u3001\u7BA1\u7406\u548C\u9694\u79BB\u3002\u66F4\u591A\u4FE1\u606F\uFF0C\u8BF7\u53C2\u89C1",(0,c.jsx)(s.a,{href:"https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/6/html/resource_management_guide/ch01",children:"\u5B98\u65B9\u6587\u6863"}),"\u3002",(0,c.jsx)(s.br,{}),"\n",(0,c.jsx)(s.code,{children:"cgroup"}),"\u6309\u5C42\u7EA7\u7BA1\u7406\uFF0C\u6BCF\u4E2A\u8282\u70B9\u90FD\u5305\u542B\u4E00\u7EC4\u6587\u4EF6\uFF0C\u7528\u4E8E\u7EDF\u8BA1\u7531\u8FD9\u4E2A\u8282\u70B9\u5305\u542B\u7684",(0,c.jsx)(s.code,{children:"cgroup"}),"\u7684\u67D0\u4E9B\u65B9\u9762\u7684\u6307\u6807\u3002\u4F8B\u5982\uFF0C",(0,c.jsx)(s.code,{children:"Memory Control Group(memcg)"}),"\u7EDF\u8BA1\u5185\u5B58\u76F8\u5173\u6307\u6807\u3002\xa0",(0,c.jsx)(s.br,{}),"\n",(0,c.jsx)(s.img,{src:n(6999).Z+"",width:"837",height:"444"})]}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"memory cgroup"}),"\u6587\u4EF6\u5305\u542B\u4EE5\u4E0B\u6307\u6807\uFF1A"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{className:"language-text",children:"cgroup.event_control       ## \u7528\u4E8Eeventfd\u7684\u63A5\u53E3\nmemory.usage_in_bytes      ## \u663E\u793A\u5F53\u524D\u5DF2\u7528\u7684\u5185\u5B58\nmemory.limit_in_bytes      ## \u8BBE\u7F6E/\u663E\u793A\u5F53\u524D\u9650\u5236\u7684\u5185\u5B58\u989D\u5EA6\nmemory.failcnt             ## \u663E\u793A\u5185\u5B58\u4F7F\u7528\u91CF\u8FBE\u5230\u9650\u5236\u503C\u7684\u6B21\u6570\nmemory.max_usage_in_bytes  ## \u5386\u53F2\u5185\u5B58\u6700\u5927\u4F7F\u7528\u91CF\nmemory.soft_limit_in_bytes ## \u8BBE\u7F6E/\u663E\u793A\u5F53\u524D\u9650\u5236\u7684\u5185\u5B58\u8F6F\u989D\u5EA6\nmemory.stat                ## \u663E\u793A\u5F53\u524Dcgroup\u7684\u5185\u5B58\u4F7F\u7528\u60C5\u51B5\nmemory.use_hierarchy       ## \u8BBE\u7F6E/\u663E\u793A\u662F\u5426\u5C06\u5B50cgroup\u7684\u5185\u5B58\u4F7F\u7528\u60C5\u51B5\u7EDF\u8BA1\u5230\u5F53\u524Dcgroup\u91CC\u9762\nmemory.force_empty         ## \u89E6\u53D1\u7CFB\u7EDF\u7ACB\u5373\u5C3D\u53EF\u80FD\u7684\u56DE\u6536\u5F53\u524Dcgroup\u4E2D\u53EF\u4EE5\u56DE\u6536\u7684\u5185\u5B58\nmemory.pressure_level      ## \u8BBE\u7F6E\u5185\u5B58\u538B\u529B\u7684\u901A\u77E5\u4E8B\u4EF6\uFF0C\u914D\u5408cgroup.event_control\u4E00\u8D77\u4F7F\u7528\nmemory.swappiness          ## \u8BBE\u7F6E\u548C\u663E\u793A\u5F53\u524D\u7684swappiness\nmemory.move_charge_at_immigrate ## \u8BBE\u7F6E\u5F53\u8FDB\u7A0B\u79FB\u52A8\u5230\u5176\u4ED6cgroup\u4E2D\u65F6\uFF0C\u5B83\u6240\u5360\u7528\u7684\u5185\u5B58\u662F\u5426\u4E5F\u968F\u7740\u79FB\u52A8\u8FC7\u53BB\nmemory.oom_control         ## \u8BBE\u7F6E/\u663E\u793Aoom controls\u76F8\u5173\u7684\u914D\u7F6E\nmemory.numa_stat           ## \u663E\u793Anuma\u76F8\u5173\u7684\u5185\u5B58\n"})}),"\n",(0,c.jsxs)(s.p,{children:["\u5176\u4E2D\u9700\u8981\u5173\u6CE8\u4EE5\u4E0B",(0,c.jsx)(s.code,{children:"3"}),"\u4E2A\u6307\u6807\uFF1A"]}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"memory.limit_in_bytes"}),"\uFF1A\u9650\u5236\u5F53\u524D",(0,c.jsx)(s.code,{children:"cgroup"}),"\u53EF\u4EE5\u4F7F\u7528\u7684\u5185\u5B58\u5927\u5C0F\u3002\u5BF9\u5E94",(0,c.jsx)(s.code,{children:"k8s"}),"\u3001",(0,c.jsx)(s.code,{children:"docker"}),"\u4E0B\u7684",(0,c.jsx)(s.code,{children:"memory limits"}),"\u503C\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"memory.usage_in_bytes"}),"\uFF1A\u5F53\u524D",(0,c.jsx)(s.code,{children:"cgroup"}),"\u91CC\u6240\u6709\u8FDB\u7A0B\u5B9E\u9645\u4F7F\u7528\u7684\u5185\u5B58\u603B\u548C\uFF0C\u7EA6\u7B49\u4E8E",(0,c.jsx)(s.code,{children:"memory.stat"}),"\u6587\u4EF6\u4E0B\u7684",(0,c.jsx)(s.code,{children:"RSS+Cache"}),"\u503C\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"memory.stat"}),"\uFF1A\u5F53\u524D",(0,c.jsx)(s.code,{children:"cgroup"}),"\u7684\u5185\u5B58\u7EDF\u8BA1\u8BE6\u60C5\u3002"]}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"memory.stat\u6587\u4EF6\u5B57\u6BB5"}),(0,c.jsx)(s.th,{children:"\u8BF4\u660E"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"cache"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"PageCache"}),"\u7F13\u5B58\u9875\u5927\u5C0F\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"rss"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"cgroup"}),"\u4E2D\u6240\u6709\u8FDB\u7A0B\u7684",(0,c.jsx)(s.code,{children:"anno_rss"}),"\u5185\u5B58\u4E4B\u548C\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"mapped_file"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"cgroup"}),"\u4E2D\u6240\u6709\u8FDB\u7A0B\u7684",(0,c.jsx)(s.code,{children:"file_rss"}),"\u548C",(0,c.jsx)(s.code,{children:"shmem_rss"}),"\u5185\u5B58\u4E4B\u548C\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"active_anon"})}),(0,c.jsxs)(s.td,{children:["\u6D3B\u8DC3LRU\uFF08",(0,c.jsx)(s.code,{children:"least-recently-used"}),"\uFF0C\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\uFF09\u5217\u8868\u4E2D\u6240\u6709",(0,c.jsx)(s.code,{children:"Anonymous"}),"\u8FDB\u7A0B\u4F7F\u7528\u5185\u5B58\u548C",(0,c.jsx)(s.code,{children:"Swap"}),"\u7F13\u5B58\uFF0C\u5305\u62EC ",(0,c.jsx)(s.code,{children:"tmpfs"}),"\uFF08",(0,c.jsx)(s.code,{children:"shmem"}),"\uFF09\uFF0C\u5355\u4F4D\u4E3A",(0,c.jsx)(s.code,{children:"bytes"}),"\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"inactive_anon"})}),(0,c.jsxs)(s.td,{children:["\u4E0D\u6D3B\u8DC3",(0,c.jsx)(s.code,{children:"LRU"}),"\u5217\u8868\u4E2D\u6240\u6709",(0,c.jsx)(s.code,{children:"Anonymous"}),"\u8FDB\u7A0B\u4F7F\u7528\u5185\u5B58\u548C",(0,c.jsx)(s.code,{children:"Swap"}),"\u7F13\u5B58\uFF0C\u5305\u62EC ",(0,c.jsx)(s.code,{children:"tmpfs"}),"\uFF08",(0,c.jsx)(s.code,{children:"shmem"}),"\uFF09\uFF0C\u5355\u4F4D\u4E3A",(0,c.jsx)(s.code,{children:"bytes"}),"\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"active_file"})}),(0,c.jsxs)(s.td,{children:["\u6D3B\u8DC3",(0,c.jsx)(s.code,{children:"LRU"}),"\u5217\u8868\u4E2D\u6240\u6709",(0,c.jsx)(s.code,{children:"File-backed"}),"\u8FDB\u7A0B\u4F7F\u7528\u5185\u5B58\uFF0C\u4EE5",(0,c.jsx)(s.code,{children:"bytes"}),"\u4E3A\u5355\u4F4D\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"inactive_file"})}),(0,c.jsxs)(s.td,{children:["\u4E0D\u6D3B\u8DC3",(0,c.jsx)(s.code,{children:"LRU"}),"\u5217\u8868\u4E2D\u6240\u6709",(0,c.jsx)(s.code,{children:"File-backed"}),"\u8FDB\u7A0B\u4F7F\u7528\u5185\u5B58\uFF0C\u4EE5",(0,c.jsx)(s.code,{children:"bytes"}),"\u4E3A\u5355\u4F4D\u3002"]})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"unevictable"})}),(0,c.jsxs)(s.td,{children:["\u65E0\u6CD5\u518D\u751F\u7684\u5185\u5B58\uFF0C\u4EE5",(0,c.jsx)(s.code,{children:"bytes"}),"\u4E3A\u5355\u4F4D\u3002"]})]})]})]}),"\n",(0,c.jsxs)(s.p,{children:["\u4EE5\u4E0A\u6307\u6807\u4E2D\u5982\u679C\u5E26\u6709",(0,c.jsx)(s.code,{children:"total_"}),"\u524D\u7F00\u5219\u8868\u793A\u5F53\u524D",(0,c.jsx)(s.code,{children:"cgroup"}),"\u53CA\u5176\u4E0B\u6240\u6709\u5B50\u5B59",(0,c.jsx)(s.code,{children:"cgroup"}),"\u5BF9\u5E94\u6307\u6807\u4E4B\u548C\u3002\u4F8B\u5982 ",(0,c.jsx)(s.code,{children:"total_rss"})," \u6307\u6807\u8868\u793A\u5F53\u524D",(0,c.jsx)(s.code,{children:"cgroup"}),"\u53CA\u5176\u4E0B\u6240\u6709\u5B50\u5B59",(0,c.jsx)(s.code,{children:"cgroup"}),"\u7684",(0,c.jsx)(s.code,{children:"RSS"}),"\u6307\u6807\u4E4B\u548C\u3002"]}),"\n"]}),"\n"]}),"\n",(0,c.jsx)(s.h4,{id:"\u603B\u7ED3",children:"\u603B\u7ED3"}),"\n",(0,c.jsxs)(s.p,{children:["\u5355\u8FDB\u7A0B\u548C\u8FDB\u7A0B",(0,c.jsx)(s.code,{children:"cgroup"}),"\u6307\u6807\u533A\u522B\uFF1A"]}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"cgroup"}),"\u7684",(0,c.jsx)(s.code,{children:"RSS"}),"\u6307\u6807\u53EA\u5305\u542B",(0,c.jsx)(s.code,{children:"anno_rss"}),"\uFF0C\u5BF9\u5E94\u5355\u8FDB\u7A0B\u4E0B\u7684",(0,c.jsx)(s.code,{children:"USS"}),"\u6307\u6807\uFF0C\u56E0\u6B64",(0,c.jsx)(s.code,{children:"cgroup"}),"\u7684",(0,c.jsx)(s.code,{children:"mapped_file+RSS"}),"\u5219\u5BF9\u5E94\u5355\u8FDB\u7A0B\u4E0B\u7684",(0,c.jsx)(s.code,{children:"RSS"}),"\u6307\u6807\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:["\u5355\u8FDB\u7A0B\u4E2D",(0,c.jsx)(s.code,{children:"PageCache"}),"\u9700\u5355\u72EC\u7EDF\u8BA1\uFF0C",(0,c.jsx)(s.code,{children:"cgroup"}),"\u4E2D ",(0,c.jsx)(s.code,{children:"memcg"})," \u6587\u4EF6\u7EDF\u8BA1\u7684\u5185\u5B58\u5DF2\u5305\u542B",(0,c.jsx)(s.code,{children:"PageCache"}),"\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u5185\u5B58"}),(0,c.jsx)(s.th,{children:"\u5355\u8FDB\u7A0B"}),(0,c.jsxs)(s.th,{children:["\u8FDB\u7A0B",(0,c.jsx)(s.code,{children:"cgroup(memcg)"})]})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"RSS"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anon_rss + file_rss \uFF0B shmem_rss"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"anon_rss"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"mapped_file"})}),(0,c.jsx)(s.td,{children:"\u65E0"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"file_rss + shmem_rss"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"cache"})}),(0,c.jsx)(s.td,{children:"\u65E0"}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"PageCache"})})]})]})]}),"\n",(0,c.jsx)(s.h2,{id:"docker\u548Ck8s\u4E2D\u7684\u5185\u5B58\u7EDF\u8BA1",children:"Docker\u548CK8s\u4E2D\u7684\u5185\u5B58\u7EDF\u8BA1"}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"Docker"}),"\u548C",(0,c.jsx)(s.code,{children:"K8S"}),"\u4E2D\u7684\u5185\u5B58\u7EDF\u8BA1\u5373",(0,c.jsx)(s.code,{children:"Linux memcg"}),"\u8FDB\u7A0B\u7EDF\u8BA1\uFF0C\u4F46\u4E24\u8005\u5185\u5B58\u4F7F\u7528\u7387\u7684\u5B9A\u4E49\u4E0D\u540C\u3002"]}),"\n",(0,c.jsx)(s.h4,{id:"docker-stat\u547D\u4EE4",children:"docker stat\u547D\u4EE4"}),"\n",(0,c.jsx)(s.p,{children:"\u8FD4\u56DE\u793A\u4F8B\u5982\u4E0B\uFF1A"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{src:n(20761).Z+"",width:"750",height:"34"})}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"LIMIT"}),"\u5BF9\u5E94\u63A7\u5236\u7EC4\u7684",(0,c.jsx)(s.code,{children:"memory.limit_in_bytes"})]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.code,{children:"MEM USAGE"}),"\u5BF9\u5E94\u63A7\u5236\u7EC4\u7684",(0,c.jsx)(s.code,{children:"memory.usage_in_bytes - memory.stat[total_cache]"})]}),"\n"]}),"\n",(0,c.jsxs)(s.p,{children:["::: tip\n",(0,c.jsx)(s.code,{children:"docker stat"}),"\u547D\u4EE4\u67E5\u8BE2\u539F\u7406\uFF0C\u8BF7\u53C2\u89C1",(0,c.jsx)(s.a,{href:"https://github.com/docker/cli/blob/37f9a88c696ae81be14c1697bd083d6421b4933c/cli/command/container/stats_helpers.go##L233",children:"\u5B98\u65B9\u6587\u6863"}),"\u3002\n:::"]}),"\n",(0,c.jsx)(s.h4,{id:"kubectl-top-pod\u547D\u4EE4",children:"kubectl top pod\u547D\u4EE4"}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"kubectl top"}),"\u547D\u4EE4\u901A\u8FC7",(0,c.jsx)(s.code,{children:"Metric-server"}),"\u548C",(0,c.jsx)(s.code,{children:"Heapster"}),"\u83B7\u53D6",(0,c.jsx)(s.code,{children:"Cadvisor"}),"\u4E2D",(0,c.jsx)(s.code,{children:"working_set"}),"\u7684\u503C\uFF0C\u8868\u793A",(0,c.jsx)(s.code,{children:"Pod"}),"\u5B9E\u4F8B\u4F7F\u7528\u7684\u5185\u5B58\u5927\u5C0F\uFF08\u4E0D\u5305\u62EC",(0,c.jsx)(s.code,{children:"Pause"}),"\u5BB9\u5668\uFF09\u3002",(0,c.jsx)(s.code,{children:"Metrics-server"}),"\u4E2D",(0,c.jsx)(s.code,{children:"Pod"}),"\u5185\u5B58\u83B7\u53D6\u539F\u7406\u5982\u4E0B\uFF0C\u66F4\u591A\u4FE1\u606F\uFF0C\u8BF7\u53C2\u89C1",(0,c.jsx)(s.a,{href:"https://github.com/kubernetes-sigs/metrics-server/blob/d4432d67b2fc435b9c71a89c13659882008a4c54/pkg/sources/summary/summary.go##L206",children:"\u5B98\u65B9\u6587\u6863"}),"\u3002"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{className:"language-go",children:'func decodeMemory(target *resource.Quantity, memStats *stats.MemoryStats) error {\n    if memStats == nil || memStats.WorkingSetBytes == nil {\n        return fmt.Errorf("missing memory usage metric")\n    }\n\n    *target = *uint64Quantity(*memStats.WorkingSetBytes, 0)\n    target.Format = resource.BinarySI\n\n    return nil\n}\n'})}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"Cadvisor"}),"\u5185\u5B58",(0,c.jsx)(s.code,{children:"workingset"}),"\u7B97\u6CD5\u5982\u4E0B\uFF0C\u66F4\u591A\u4FE1\u606F\uFF0C\u8BF7\u53C2\u89C1",(0,c.jsx)(s.a,{href:"https://github.com/google/cadvisor/blob/0ff17b8d0df3712923c46ca484701b876d02dfee/container/libcontainer/handler.go##L706",children:"\u5B98\u65B9\u6587\u6863"}),"\u3002\xa0"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{className:"language-go",children:'func setMemoryStats(s *cgroups.Stats, ret *info.ContainerStats) {\n    ret.Memory.Usage = s.MemoryStats.Usage.Usage\n    ret.Memory.MaxUsage = s.MemoryStats.Usage.MaxUsage\n    ret.Memory.Failcnt = s.MemoryStats.Usage.Failcnt\n\n    if s.MemoryStats.UseHierarchy {\n        ret.Memory.Cache = s.MemoryStats.Stats["total_cache"]\n        ret.Memory.RSS = s.MemoryStats.Stats["total_rss"]\n        ret.Memory.Swap = s.MemoryStats.Stats["total_swap"]\n        ret.Memory.MappedFile = s.MemoryStats.Stats["total_mapped_file"]\n    } else {\n        ret.Memory.Cache = s.MemoryStats.Stats["cache"]\n        ret.Memory.RSS = s.MemoryStats.Stats["rss"]\n        ret.Memory.Swap = s.MemoryStats.Stats["swap"]\n        ret.Memory.MappedFile = s.MemoryStats.Stats["mapped_file"]\n    }\n    if v, ok := s.MemoryStats.Stats["pgfault"]; ok {\n        ret.Memory.ContainerData.Pgfault = v\n        ret.Memory.HierarchicalData.Pgfault = v\n    }\n    if v, ok := s.MemoryStats.Stats["pgmajfault"]; ok {\n        ret.Memory.ContainerData.Pgmajfault = v\n        ret.Memory.HierarchicalData.Pgmajfault = v\n    }\n\n    workingSet := ret.Memory.Usage\n    if v, ok := s.MemoryStats.Stats["total_inactive_file"]; ok {\n        if workingSet < v {\n            workingSet = 0\n        } else {\n            workingSet -= v\n        }\n    }\n    ret.Memory.WorkingSet = workingSet\n}\n'})}),"\n",(0,c.jsxs)(s.p,{children:["\u901A\u8FC7\u4EE5\u4E0A\u547D\u4EE4\u7B97\u6CD5\u53EF\u4EE5\u5F97\u51FA\uFF0C",(0,c.jsx)(s.code,{children:"kubectl top pod"}),"\u547D\u4EE4\u67E5\u8BE2\u5230\u7684",(0,c.jsx)(s.code,{children:"Memory Usage = Memory WorkingSet = memory.usage_in_bytes - memory.stat[total_inactive_file]"}),"\u3002"]}),"\n",(0,c.jsx)(s.h4,{id:"\u603B\u7ED3-1",children:"\u603B\u7ED3"}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u547D\u4EE4"}),(0,c.jsx)(s.th,{children:"\u751F\u6001"}),(0,c.jsx)(s.th,{children:"Memory Usage\u8BA1\u7B97\u65B9\u5F0F"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"docker stat"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"docker"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"memory.usage_in_bytes - memory.stat[total_cache]"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"kubectl top pod"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"k8s"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"memory.usage_in_bytes - memory.stat[total_inactive_file]"})})]})]})]}),"\n",(0,c.jsxs)(s.p,{children:["\u5982\u679C\u4F7F\u7528",(0,c.jsx)(s.code,{children:"top/ps"}),"\u547D\u4EE4\u67E5\u8BE2\u5185\u5B58\uFF0C\u5219",(0,c.jsx)(s.code,{children:"cgroup"}),"\u4E0B\u7684",(0,c.jsx)(s.code,{children:"Memory Usage"}),"\u6307\u6807\u9700\u5BF9",(0,c.jsx)(s.code,{children:"top/ps"}),"\u547D\u4EE4\u67E5\u8BE2\u5230\u7684\u6307\u6807\u8FDB\u884C\u4EE5\u4E0B\u8BA1\u7B97\uFF1A"]}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"\u8FDB\u7A0B\u7EC4\u751F\u6001"}),(0,c.jsx)(s.th,{children:"\u8BA1\u7B97\u516C\u5F0F"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"cgroup"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"rss + cache\uFF08active cache + inactive cache\uFF09"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"docker"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"rss"})})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"k8s"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"rss + active cache"})})]})]})]}),"\n",(0,c.jsx)(s.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.a,{href:"https://www.alibabacloud.com/help/zh/arms/application-monitoring/memory-metrics",children:"https://www.alibabacloud.com/help/zh/arms/application-monitoring/memory-metrics"})}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.a,{href:"http://hustcat.github.io/memory-usage-in-process-and-cgroup/?spm=a2c6h.12873639.article-detail.8.4db570921VdAkk",children:"http://hustcat.github.io/memory-usage-in-process-and-cgroup"})}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.a,{href:"https://www.51cto.com/article/692936.html",children:"https://www.51cto.com/article/692936.html"})}),"\n"]}),"\n",(0,c.jsxs)(s.li,{children:["\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.a,{href:"https://itnext.io/from-rss-to-wss-navigating-the-depths-of-kubernetes-memory-metrics-4d7d77d8fdcb",children:"https://itnext.io/from-rss-to-wss-navigating-the-depths-of-kubernetes-memory-metrics-4d7d77d8fdcb"})}),"\n"]}),"\n"]})]})}function x(e={}){let{wrapper:s}={...(0,d.a)(),...e.components};return s?(0,c.jsx)(s,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}},63409:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/image-2024-5-6_15-47-44-3c9ff98d71453fab213d95cd82728a15.png"},76831:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/image-2024-5-6_15-49-57-2f3941ffe85efd46217fef2907e94dcf.png"},79863:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/image-2024-5-6_15-54-38-5ec44ed134f8c652d743ee6fddc3f4e2.png"},64655:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p619791-ad02733770ed0c00a98662bc54f32ef5.png"},88327:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p619795-69404e15b8193701e36160a86d2d78dd.png"},9856:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p620216-5070eedbff468865b7c23b97f1aa776b.png"},31989:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p623795-5768896fac67bfaaaf309696a0791227.png"},6999:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p624557-5fc099c2d921ba214af1bf233cd0dc29.png"},20761:function(e,s,n){n.d(s,{Z:function(){return r}});let r=n.p+"assets/images/p624725-ba41c4764c18e8879785226717f9cfa6.png"},50065:function(e,s,n){n.d(s,{Z:function(){return l},a:function(){return i}});var r=n(67294);let c={},d=r.createContext(c);function i(e){let s=r.useContext(d);return r.useMemo(function(){return"function"==typeof e?e(s):{...s,...e}},[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),r.createElement(d.Provider,{value:s},e.children)}}}]);