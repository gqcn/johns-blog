"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["6030"],{64985:function(e,n,i){i.r(n),i.d(n,{metadata:()=>l,contentTitle:()=>c,default:()=>j,assets:()=>t,toc:()=>h,frontMatter:()=>d});var l=JSON.parse('{"id":"\u6280\u672F\u67B6\u6784/\u5FAE\u670D\u52A1\u67B6\u6784/\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303","title":"\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303","description":"\u8BE6\u7EC6\u8BB2\u89E3\u5FAE\u670D\u52A1\u62C6\u5206\u7684\u89C4\u8303\u548C\u539F\u5219\uFF0C\u5305\u62EC\u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408\u3001\u5355\u4E00\u804C\u8D23\u7B49\u6838\u5FC3\u7406\u5FF5\uFF0C\u5E2E\u52A9\u56E2\u961F\u66F4\u597D\u5730\u8FDB\u884C\u670D\u52A1\u62C6\u5206","source":"@site/docs/0-\u6280\u672F\u67B6\u6784/1-\u5FAE\u670D\u52A1\u67B6\u6784/2-\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303.md","sourceDirName":"0-\u6280\u672F\u67B6\u6784/1-\u5FAE\u670D\u52A1\u67B6\u6784","slug":"/microservice-splitting-specification","permalink":"/microservice-splitting-specification","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/microservice-splitting-specification","title":"\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303","hide_title":true,"keywords":["\u5FAE\u670D\u52A1\u62C6\u5206","\u9AD8\u5185\u805A","\u4F4E\u8026\u5408","\u5355\u4E00\u804C\u8D23","\u670D\u52A1\u8BBE\u8BA1","\u62C6\u5206\u89C4\u8303"],"description":"\u8BE6\u7EC6\u8BB2\u89E3\u5FAE\u670D\u52A1\u62C6\u5206\u7684\u89C4\u8303\u548C\u539F\u5219\uFF0C\u5305\u62EC\u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408\u3001\u5355\u4E00\u804C\u8D23\u7B49\u6838\u5FC3\u7406\u5FF5\uFF0C\u5E2E\u52A9\u56E2\u961F\u66F4\u597D\u5730\u8FDB\u884C\u670D\u52A1\u62C6\u5206"},"sidebar":"mainSidebar","previous":{"title":"\u5FAE\u670D\u52A1\u5206\u5C42\u6A21\u578B","permalink":"/microservice-layered-model"},"next":{"title":"\u7194\u65AD\u3001\u9650\u6D41\u3001\u964D\u7EA7\u7684\u533A\u522B","permalink":"/circuit-breaker-rate-limiting-degradation"}}'),s=i("85893"),r=i("50065");let d={slug:"/microservice-splitting-specification",title:"\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303",hide_title:!0,keywords:["\u5FAE\u670D\u52A1\u62C6\u5206","\u9AD8\u5185\u805A","\u4F4E\u8026\u5408","\u5355\u4E00\u804C\u8D23","\u670D\u52A1\u8BBE\u8BA1","\u62C6\u5206\u89C4\u8303"],description:"\u8BE6\u7EC6\u8BB2\u89E3\u5FAE\u670D\u52A1\u62C6\u5206\u7684\u89C4\u8303\u548C\u539F\u5219\uFF0C\u5305\u62EC\u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408\u3001\u5355\u4E00\u804C\u8D23\u7B49\u6838\u5FC3\u7406\u5FF5\uFF0C\u5E2E\u52A9\u56E2\u961F\u66F4\u597D\u5730\u8FDB\u884C\u670D\u52A1\u62C6\u5206"},c=void 0,t={},h=[{value:"\u4E00\u3001\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303",id:"\u4E00\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303",level:2},{value:"1\u3001\u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408",id:"1\u9AD8\u5185\u805A\u4F4E\u8026\u5408",level:4},{value:"2\u3001\u670D\u52A1\u62C6\u5206\u6B63\u4EA4\u6027\u539F\u5219",id:"2\u670D\u52A1\u62C6\u5206\u6B63\u4EA4\u6027\u539F\u5219",level:4},{value:"3\u3001\u670D\u52A1\u62C6\u5206\u5C42\u7EA7\u6700\u591A\u4E09\u5C42",id:"3\u670D\u52A1\u62C6\u5206\u5C42\u7EA7\u6700\u591A\u4E09\u5C42",level:4},{value:"4\u3001\u670D\u52A1\u7C92\u5EA6\u9002\u4E2D\u3001\u6F14\u8FDB\u5F0F\u62C6\u5206",id:"4\u670D\u52A1\u7C92\u5EA6\u9002\u4E2D\u6F14\u8FDB\u5F0F\u62C6\u5206",level:4},{value:"5\u3001\u907F\u514D\u73AF\u5F62\u4F9D\u8D56\u3001\u53CC\u5411\u4F9D\u8D56",id:"5\u907F\u514D\u73AF\u5F62\u4F9D\u8D56\u53CC\u5411\u4F9D\u8D56",level:4},{value:"6\u3001\u901A\u7528\u5316\u63A5\u53E3\u8BBE\u8BA1\uFF0C\u51CF\u5C11\u5B9A\u5236\u5316\u8BBE\u8BA1",id:"6\u901A\u7528\u5316\u63A5\u53E3\u8BBE\u8BA1\u51CF\u5C11\u5B9A\u5236\u5316\u8BBE\u8BA1",level:4},{value:"7\u3001\u63A5\u53E3\u8BBE\u8BA1\u9700\u8981\u4E25\u683C\u4FDD\u8BC1\u517C\u5BB9\u6027",id:"7\u63A5\u53E3\u8BBE\u8BA1\u9700\u8981\u4E25\u683C\u4FDD\u8BC1\u517C\u5BB9\u6027",level:4},{value:"8\u3001\u5C06\u4E32\u884C\u8C03\u7528\u6539\u4E3A\u5E76\u884C\u8C03\u7528\uFF0C\u6216\u8005\u5F02\u6B65\u5316",id:"8\u5C06\u4E32\u884C\u8C03\u7528\u6539\u4E3A\u5E76\u884C\u8C03\u7528\u6216\u8005\u5F02\u6B65\u5316",level:4},{value:"9\u3001\u63A5\u53E3\u5E94\u8BE5\u5B9E\u73B0\u5E42\u7B49\u6027",id:"9\u63A5\u53E3\u5E94\u8BE5\u5B9E\u73B0\u5E42\u7B49\u6027",level:4},{value:"10\u3001\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\u4E25\u7981\u5185\u5D4C\uFF0C\u900F\u4F20\xa0",id:"10\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\u4E25\u7981\u5185\u5D4C\u900F\u4F20",level:4},{value:"11\u3001\u907F\u514D\u670D\u52A1\u95F4\u5171\u4EAB\u6570\u636E\u5E93",id:"11\u907F\u514D\u670D\u52A1\u95F4\u5171\u4EAB\u6570\u636E\u5E93",level:4},{value:"12\u3001\u540C\u65F6\u5E94\u5F53\u8003\u8651\u56E2\u961F\u7ED3\u6784",id:"12\u540C\u65F6\u5E94\u5F53\u8003\u8651\u56E2\u961F\u7ED3\u6784",level:4},{value:"\u4E8C\u3001\u5FAE\u670D\u52A1\u62C6\u5206\u65F6\u673A",id:"\u4E8C\u5FAE\u670D\u52A1\u62C6\u5206\u65F6\u673A",level:2},{value:"1\u3001\u5FEB\u901F\u8FED\u4EE3",id:"1\u5FEB\u901F\u8FED\u4EE3",level:4},{value:"2\u3001\u9AD8\u5E76\u53D1\u3001\u6027\u80FD\u8981\u6C42",id:"2\u9AD8\u5E76\u53D1\u6027\u80FD\u8981\u6C42",level:4},{value:"3\u3001\u63D0\u4EA4\u4EE3\u7801\u9891\u7E41\u51FA\u73B0\u5927\u91CF\u51B2\u7A81",id:"3\u63D0\u4EA4\u4EE3\u7801\u9891\u7E41\u51FA\u73B0\u5927\u91CF\u51B2\u7A81",level:4},{value:"4\u3001\u5C0F\u529F\u80FD\u8981\u79EF\u7D2F\u5230\u5927\u7248\u672C\u624D\u80FD\u4E0A\u7EBF",id:"4\u5C0F\u529F\u80FD\u8981\u79EF\u7D2F\u5230\u5927\u7248\u672C\u624D\u80FD\u4E0A\u7EBF",level:4}];function x(e){let n={a:"a",code:"code",h2:"h2",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"\u4E00\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303",children:"\u4E00\u3001\u5FAE\u670D\u52A1\u62C6\u5206\u89C4\u8303"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u62C6\u5206\u4E4B\u540E\uFF0C\u5DE5\u7A0B\u4F1A\u6BD4\u8F83\u7684\u591A\uFF0C\u5982\u679C\u6CA1\u6709\u4E00\u5B9A\u7684\u89C4\u8303\uFF0C\u5C06\u4F1A\u975E\u5E38\u6DF7\u4E71\uFF0C\u96BE\u4EE5\u7EF4\u62A4\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"1\u9AD8\u5185\u805A\u4F4E\u8026\u5408",children:"1\u3001\u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408"}),"\n",(0,s.jsxs)(n.p,{children:["\u7D27\u5BC6\u5173\u8054\u7684\u4E8B\u7269\u5E94\u8BE5\u653E\u5728\u4E00\u8D77\uFF0C\u6BCF\u4E2A\u670D\u52A1\u662F\u9488\u5BF9\u4E00\u4E2A",(0,s.jsx)(n.strong,{children:"\u5355\u4E00\u804C\u8D23"}),"\u7684\u4E1A\u52A1\u80FD\u529B\u7684\u5C01\u88C5\uFF0C\u4E13\u6CE8\u505A\u597D\u4E00\u4EF6\u4E8B\u60C5\uFF08\u6BCF\u6B21\u53EA\u6709\u4E00\u4E2A\u66F4\u6539\u5B83\u7684\u7406\u7531)\u3002\u5982\u4E0B\u56FE\uFF1A\u6709\u56DB\u4E2A\u670D\u52A1A\u3001B\u3001C\u3001D\uFF0C\u4F46\u662F\u6BCF\u4E2A\u670D\u52A1\u804C\u8D23\u4E0D\u5355\u4E00\uFF0CA\u53EF\u80FD\u5728\u505AB\u7684\u4E8B\u60C5\uFF0CB\u53C8\u5728\u505AC\u7684\u4E8B\u60C5\uFF0CC\u53C8\u540C\u65F6\u5728\u505AA\u7684\u4E8B\u60C5\uFF0C\u901A\u8FC7\u91CD\u65B0\u8C03\u6574\uFF0C\u5C06\u76F8\u5173\u7684\u4E8B\u7269\u653E\u5728\u4E00\u8D77\u540E\uFF0C\u53EF\u4EE5\u51CF\u5C11\u4E0D\u5FC5\u8981\u7684\u670D\u52A1\u3002"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:i(34193).Z+"",width:"931",height:"347"})}),"\n",(0,s.jsx)(n.p,{children:"\u56FE1. \u9AD8\u5185\u805A\u3001\u4F4E\u8026\u5408"}),"\n",(0,s.jsx)(n.p,{children:"\u901A\u7528\u62C6\u5206\u65B9\u5F0F\uFF1A"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u5148\u6309\u4E1A\u52A1\u9886\u57DF\u62C6\uFF0C\u5982\u793E\u533A\u3001\u7528\u6237\u3001\u5546\u57CE\u3001\u6162\u75C5\u3001\u5DE5\u5355\uFF0C\u5982\u679C\u6709\u76F8\u540C\u529F\u80FD\u9700\u8981\u805A\u5408\uFF0C\u5219\u8FDB\u884C\u4E0B\u6C89\uFF08\u5782\u76F4\uFF09\u3002"}),"\n",(0,s.jsx)(n.li,{children:"\u518D\u6309\u529F\u80FD\u5B9A\u4F4D\u62C6\uFF08\u6C34\u5E73\uFF09\uFF0C\u5982\u5546\u57CE\u4E1A\u52A1\u590D\u6742\u5EA6\u63D0\u9AD8\u4E4B\u540E\u53EF\u8FDB\u4E00\u6B65\u62C6\u5206\u4E3A\u5546\u54C1\u3001\u8BA2\u5355\u3001\u7269\u6D41\u3001\u652F\u4ED8\u3002"}),"\n",(0,s.jsx)(n.li,{children:"\u6309\u91CD\u8981\u7A0B\u5EA6\u62C6\uFF0C\u533A\u5206\u6838\u5FC3\u4E0E\u975E\u6838\u5FC3\uFF0C\u5982\u8BA2\u5355\u6838\u5FC3\uFF0C\u8BA2\u5355\u975E\u6838\u5FC3\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"2\u670D\u52A1\u62C6\u5206\u6B63\u4EA4\u6027\u539F\u5219",children:"2\u3001\u670D\u52A1\u62C6\u5206\u6B63\u4EA4\u6027\u539F\u5219"}),"\n",(0,s.jsx)(n.p,{children:"\u4E24\u6761\u76F4\u7EBF\u76F8\u4EA4\u6210\u76F4\u89D2\uFF0C\u5C31\u662F\u6B63\u4EA4\u7684\u3002\u6B63\u4EA4\u4E5F\u5C31\u662F\u4E24\u6761\u76F4\u7EBF\u4E92\u4E0D\u4F9D\u8D56\u3002\u5982\u679C\u4E00\u4E2A\u7CFB\u7EDF\u7684\u53D8\u5316\u4E0D\u5F71\u54CD\u53E6\u4E00\u4E2A\u7CFB\u7EDF\u8FD9\u4E9B\u7CFB\u7EDF\u5C31\u662F\u6B63\u4EA4\u7684\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u76F4\u63A5\u5E94\u7528\u6B63\u4EA4\u6027\u539F\u5219\uFF0C\u6784\u5EFA\u7684\u7CFB\u7EDF\u7684\u8D28\u91CF\u53EF\u4EE5\u5F97\u5230\u5F88\u5927\u63D0\u9AD8\uFF0C\u53EF\u4EE5\u8BA9\u4F60\u7684\u7CFB\u7EDF\u6613\u4E8E\u8BBE\u8BA1\u3001\u5F00\u53D1\u3001\u6D4B\u8BD5\u53CA\u6269\u5C55\u4E0A\u7EBF\u3002\u63D0\u9AD8\u5F00\u53D1\u6548\u7387\uFF0C\u964D\u4F4E\u98CE\u9669\u3002"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:i(17624).Z+"",width:"913",height:"355"})}),"\n",(0,s.jsx)(n.p,{children:"\u56FE2. \u670D\u52A1\u62C6\u5206\u6B63\u4EA4\u6027"}),"\n",(0,s.jsx)(n.h4,{id:"3\u670D\u52A1\u62C6\u5206\u5C42\u7EA7\u6700\u591A\u4E09\u5C42",children:"3\u3001\u670D\u52A1\u62C6\u5206\u5C42\u7EA7\u6700\u591A\u4E09\u5C42"}),"\n",(0,s.jsx)(n.p,{children:"\u670D\u52A1\u62C6\u5206\u662F\u4E3A\u4E86\u6A2A\u5411\u6269\u5C55\uFF0C\u56E0\u800C\u5E94\u8BE5\u6A2A\u5411\u62C6\u5206\uFF0C\u800C\u975E\u7EB5\u5411\u62C6\u6210\u4E00\u4E32\u7684\u3002\u4E5F\u5373\u5E94\u8BE5\u5C06\u5546\u54C1\u548C\u8BA2\u5355\u62C6\u5206\uFF0C\u800C\u975E\u4E0B\u5355\u7684\u5341\u4E2A\u6B65\u9AA4\u62C6\u5206\uFF0C\u7136\u540E\u4E00\u4E2A\u8C03\u7528\u4E00\u4E2A\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["\u4EBA\u4EEC\u7ECF\u5E38\u95EE\u7684\u4E00\u4E2A\u95EE\u9898\u662F\uFF0C\u670D\u52A1\u62C6\u5206\u4E4B\u540E\uFF0C\u539F\u6765\u90FD\u5728\u4E00\u4E2A\u8FDB\u7A0B\u91CC\u9762\u7684\u51FD\u6570\u8C03\u7528\uFF0C\u73B0\u5728\u53D8\u6210\u4E86A\u8C03\u7528B\u8C03\u7528C\u8C03\u7528D\u8C03\u7528E\uFF0C\u4F1A\u4E0D\u4F1A\u56E0\u4E3A\u8C03\u7528\u94FE\u8DEF\u8FC7\u957F\u800C\u4F7F\u5F97\u76F8\u5E94\u53D8\u6162\u5462\uFF1F\u8FD9\u91CC\u7EB5\u5411\u7684\u62C6\u5206\u6700\u591A\u4E09\u5C42\uFF0C\u5927\u90E8\u5206\u60C5\u51B5\u4E0B\u53EA\u6709\u4E24\u6B21\u8C03\u7528\uFF0C\u5177\u4F53\u8BF7\u53C2\u8003\u300A",(0,s.jsx)(n.a,{href:"https://itician.org/pages/viewpage.action?pageId=3672502",children:"\u5FAE\u670D\u52A1\u5206\u5C42\u6A21\u578B"}),"\u300B\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"4\u670D\u52A1\u7C92\u5EA6\u9002\u4E2D\u6F14\u8FDB\u5F0F\u62C6\u5206",children:"4\u3001\u670D\u52A1\u7C92\u5EA6\u9002\u4E2D\u3001\u6F14\u8FDB\u5F0F\u62C6\u5206"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u62C6\u5206\u5E76\u4E0D\u662F\u4E00\u6B65\u5230\u4F4D\u7684\uFF0C\u5E94\u5F53\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u9010\u6B65\u5C55\u5F00\u3002\u5982\u679C\u4E00\u5F00\u59CB\u4E0D\u77E5\u9053\u5E94\u8BE5\u5212\u5206\u591A\u7EC6\uFF0C\u5B8C\u5168\u53EF\u4EE5\u5148\u7C97\u7C92\u5EA6\u5212\u5206\uFF0C\u7136\u540E\u968F\u7740\u9700\u8981\uFF0C\u521D\u6B65\u62C6\u5206\u3002\u6BD4\u5982\u4E00\u4E2A\u7535\u5546\u4E00\u5F00\u59CB\u7D22\u6027\u53EF\u4EE5\u62C6\u5206\u4E3A\u5546\u54C1\u670D\u52A1\u548C\u4EA4\u6613\u670D\u52A1\uFF0C\u4E00\u4E2A\u8D1F\u8D23\u5C55\u793A\u5546\u54C1\uFF0C\u4E00\u4E2A\u8D1F\u8D23\u8D2D\u4E70\u652F\u4ED8\u3002\u968F\u540E\u968F\u7740\u4EA4\u6613\u670D\u52A1\u8D8A\u6765\u8D8A\u590D\u6742\uFF0C\u5C31\u53EF\u4EE5\u9010\u6B65\u7684\u62C6\u5206\u6210\u8BA2\u5355\u670D\u52A1\u548C\u652F\u4ED8\u670D\u52A1\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u6B64\u5916\uFF0C\u4E00\u4E2A\u5FAE\u670D\u52A1\u9700\u8981\u8DB3\u591F\u7B80\u5355\uFF0C\u7AD9\u5728\u5FAE\u670D\u52A1\u89D2\u5EA6\u800C\u8A00\u5F80\u5F80\u53EA\u9700\u89811~2\u4EBA\u5DE6\u53F3\u53EF\u65B9\u4FBF\u5FEB\u901F\u7EF4\u62A4\u3002\u5982\u679C\u7EF4\u62A4\u7684\u4EBA\u5458\u8FC7\u591A\uFF0C\u8981\u4E48\u8FD9\u4E2A\u670D\u52A1\u8FC7\u4E8E\u590D\u6742\u6210\u4E3A\u4E86\u5355\u4F53\u5E94\u7528\uFF1B\u8981\u4E48\u662F\u670D\u52A1\u8FB9\u754C\u5212\u5206\u5F97\u4E0D\u591F\u660E\u786E\uFF1B\u8981\u4E48\u662F\u4EBA\u5458\u7EC4\u7EC7\u67B6\u6784\u7684\u804C\u8D23\u4E0D\u6E05\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"5\u907F\u514D\u73AF\u5F62\u4F9D\u8D56\u53CC\u5411\u4F9D\u8D56",children:"5\u3001\u907F\u514D\u73AF\u5F62\u4F9D\u8D56\u3001\u53CC\u5411\u4F9D\u8D56"}),"\n",(0,s.jsx)(n.p,{children:"\u670D\u52A1\u4E4B\u95F4\u7684\u73AF\u5F62/\u53CC\u5411\u4F9D\u8D56\u4F1A\u4F7F\u5F97\u670D\u52A1\u95F4\u8026\u5408\u52A0\u91CD\uFF0C\u5728\u670D\u52A1\u5347\u7EA7\u7684\u7684\u65F6\u5019\u4F1A\u6BD4\u8F83\u5934\u75BC\uFF0C\u4E0D\u77E5\u9053\u5E94\u8BE5\u5148\u5347\u7EA7\u54EA\u4E2A\uFF0C\u540E\u5347\u7EA7\u54EA\u4E2A\uFF0C\u96BE\u4EE5\u7EF4\u62A4\u3002\u56E0\u6B64\u6211\u4EEC\u9700\u8981\u6781\u529B\u907F\u514D\u670D\u52A1\u95F4\u7684\u8FD9\u79CD\u590D\u6742\u4F9D\u8D56\u5173\u7CFB\u3002"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:i(21271).Z+"",width:"625",height:"256"})}),"\n",(0,s.jsx)(n.p,{children:"\u56FE3. \u5FAA\u73AF\u4F9D\u8D56\u4E0E\u53CC\u5411\u4F9D\u8D56"}),"\n",(0,s.jsx)(n.p,{children:"\u89E3\u51B3\u8FD9\u79CD\u590D\u6742\u4F9D\u8D56\u5173\u7CFB\uFF0C\u6211\u4EEC\u6709\u4E24\u79CD\u670D\u52A1\u62C6\u5206\u907F\u514D\u65B9\u5F0F\uFF0C\u6839\u636E\u4E1A\u52A1\u573A\u666F\u5408\u7406\u9009\u62E9\uFF1A"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u5C06\u5171\u540C\u4F9D\u8D56\u7684\u670D\u52A1\u529F\u80FD\u8FDB\u884C\u4E0B\u6C89\uFF0C\u62C6\u5206\u4E3A\u7B2C\u4E09\u65B9\u670D\u52A1\u3002\u8FD8\u8981\u6CE8\u610F\u4E0B\u6C89\u7684\u670D\u52A1\u7EF4\u62A4\u65B9\u9700\u8981\u591A\u65B9\u534F\u5546\u786E\u5B9A\u7EF4\u62A4\u8005\u3002"}),"\n",(0,s.jsx)(n.li,{children:"\u5982\u679C\u5728\u4E1A\u52A1\u6D41\u7A0B\u4E0A\u5141\u8BB8\u5F02\u6B65\u89E3\u8026\u7684\uFF0C\u53EF\u4EE5\u8003\u8651\u5F15\u5165\u6D88\u606F\u4E2D\u95F4\u4EF6\u6765\u5904\u7406\uFF0C\u6D88\u606F\u4E2D\u95F4\u4EF6\u4E5F\u662F\u5FAE\u670D\u52A1\u6CBB\u7406\u4E2D\u4F7F\u7528\u8F83\u591A\u7684\u6838\u5FC3\u7EC4\u4EF6\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"6\u901A\u7528\u5316\u63A5\u53E3\u8BBE\u8BA1\u51CF\u5C11\u5B9A\u5236\u5316\u8BBE\u8BA1",children:"6\u3001\u901A\u7528\u5316\u63A5\u53E3\u8BBE\u8BA1\uFF0C\u51CF\u5C11\u5B9A\u5236\u5316\u8BBE\u8BA1"}),"\n",(0,s.jsxs)(n.p,{children:["\u63D0\u5FAE\u670D\u52A1\u63D0\u4F9B\u7684\u670D\u52A1\u4E00\u5B9A\u662F\u5C3D\u53EF\u80FD\u901A\u7528\u7684\uFF0C\u9762\u5411\u529F\u80FD\u6765\u5F00\u53D1\u7684\uFF0C\u800C\u4E0D\u662F\u9762\u5411\u8C03\u7528\u65B9\u6765\u5F00\u53D1\u7684\u3002\u6BD4\u5982\u67D0\u4E2A\u8C03\u7528\u65B9\u63D0\u51FA\u4E86\u4E00\u4E2A\u9700\u6C42\uFF1A\u8C03\u7528\u65B9B\u5E0C\u671BA\u670D\u52A1\u63D0\u4F9B\u4E00\u4E2A\u83B7\u53D6\u8BA2\u5355\u5217\u8868\u7684\u63A5\u53E3\uFF0C\u90A3\u4E48A\u670D\u52A1\u8BBE\u8BA1\u7684\u63A5\u53E3\u5C31\u5E94\u8BE5\u662F",(0,s.jsx)(n.code,{children:"GetOrderList()"}),"\uFF0C\u800C\u4E0D\u662F",(0,s.jsx)(n.code,{children:"GetOrderListForA()"}),"\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"7\u63A5\u53E3\u8BBE\u8BA1\u9700\u8981\u4E25\u683C\u4FDD\u8BC1\u517C\u5BB9\u6027",children:"7\u3001\u63A5\u53E3\u8BBE\u8BA1\u9700\u8981\u4E25\u683C\u4FDD\u8BC1\u517C\u5BB9\u6027"}),"\n",(0,s.jsx)(n.p,{children:"\u4E3A\u4E86\u4FDD\u8BC1\u6BCF\u4E2A\u5FAE\u670D\u52A1\u80FD\u591F\u72EC\u7ACB\u53D1\u5E03\uFF0C\u5E76\u4E14\u964D\u4F4E\u53D1\u5E03\u7684\u517C\u5BB9\u6027\u98CE\u9669\uFF0C\u90A3\u4E48\u63A5\u53E3\u9700\u8981\u4E25\u683C\u4FDD\u8BC1\u517C\u5BB9\u6027\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"8\u5C06\u4E32\u884C\u8C03\u7528\u6539\u4E3A\u5E76\u884C\u8C03\u7528\u6216\u8005\u5F02\u6B65\u5316",children:"8\u3001\u5C06\u4E32\u884C\u8C03\u7528\u6539\u4E3A\u5E76\u884C\u8C03\u7528\uFF0C\u6216\u8005\u5F02\u6B65\u5316"}),"\n",(0,s.jsx)(n.p,{children:"\u5982\u679C\u6709\u7684\u7EC4\u5408\u670D\u52A1\u5904\u7406\u6D41\u7A0B\u7684\u786E\u5F88\u957F\uFF0C\u9700\u8981\u8C03\u7528\u591A\u4E2A\u5916\u90E8\u670D\u52A1\uFF0C\u5E94\u8BE5\u8003\u8651\u5982\u4F55\u901A\u8FC7\u6D88\u606F\u961F\u5217\uFF0C\u5B9E\u73B0\u5F02\u6B65\u5316\u548C\u89E3\u8026\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u4F8B\u5982\u4E0B\u5355\u4E4B\u540E\uFF0C\u8981\u5237\u65B0\u7F13\u5B58\uFF0C\u8981\u901A\u77E5\u4ED3\u5E93\u7B49\uFF0C\u8FD9\u4E9B\u90FD\u4E0D\u9700\u8981\u518D\u4E0B\u5355\u6210\u529F\u7684\u65F6\u5019\u5C31\u8981\u505A\u5B8C\uFF0C\u800C\u662F\u53EF\u4EE5\u53D1\u4E00\u4E2A\u6D88\u606F\u7ED9\u6D88\u606F\u961F\u5217\uFF0C\u5F02\u6B65\u901A\u77E5\u5176\u4ED6\u670D\u52A1\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u800C\u4E14\u4F7F\u7528\u6D88\u606F\u961F\u5217\u7684\u597D\u5904\u662F\uFF0C\u4F60\u53EA\u8981\u53D1\u9001\u4E00\u4E2A\u6D88\u606F\uFF0C\u65E0\u8BBA\u4E0B\u6E38\u4F9D\u8D56\u65B9\u6709\u4E00\u4E2A\uFF0C\u8FD8\u662F\u6709\u5341\u4E2A\uFF0C\u90FD\u662F\u4E00\u6761\u6D88\u606F\u641E\u5B9A\uFF0C\u53EA\u4E0D\u8FC7\u591A\u51E0\u4E2A\u4E0B\u6E38\u76D1\u542C\u6D88\u606F\u5373\u53EF\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["\u5BF9\u4E8E\u4E0B\u5355\u5FC5\u987B\u540C\u65F6\u505A\u5B8C\u7684\uFF0C\u4F8B\u5982\u6263\u51CF\u5E93\u5B58\u548C\u4F18\u60E0\u5238\u7B49\uFF0C\u53EF\u4EE5\u8FDB\u884C",(0,s.jsx)(n.strong,{children:"\u5E76\u884C\u8C03\u7528"}),"\uFF0C\u8FD9\u6837\u5904\u7406\u65F6\u95F4\u4F1A\u5927\u5927\u7F29\u77ED\uFF0C\u4E0D\u662F\u591A\u6B21\u8C03\u7528\u7684\u65F6\u95F4\u4E4B\u548C\uFF0C\u800C\u662F\u6700\u957F\u7684\u90A3\u4E2A\u7CFB\u7EDF\u8C03\u7528\u65F6\u95F4\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"9\u63A5\u53E3\u5E94\u8BE5\u5B9E\u73B0\u5E42\u7B49\u6027",children:"9\u3001\u63A5\u53E3\u5E94\u8BE5\u5B9E\u73B0\u5E42\u7B49\u6027"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u62C6\u5206\u4E4B\u540E\uFF0C\u670D\u52A1\u4E4B\u95F4\u7684\u8C03\u7528\u5F53\u51FA\u73B0\u9519\u8BEF\u7684\u65F6\u5019\uFF0C\u5F80\u5F80\u90FD\u4F1A\u91CD\u8BD5\uFF0C\u4F46\u662F\u4E3A\u4E86\u4E0D\u8981\u4E0B\u4E24\u6B21\u5355\uFF0C\u652F\u4ED8\u4E24\u6B21\uFF0C\u5FAE\u670D\u52A1\u63A5\u53E3\u5E94\u5F53\u5B9E\u73B0\u5E42\u7B49\u6027\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u5E42\u7B49\u64CD\u4F5C\u4F7F\u7528\u72B6\u6001\u673A\uFF0C\u5F53\u4E00\u4E2A\u8C03\u7528\u5230\u6765\u7684\u65F6\u5019\uFF0C\u5F80\u5F80\u89E6\u53D1\u4E00\u4E2A\u72B6\u6001\u7684\u53D8\u5316\uFF0C\u5F53\u4E0B\u6B21\u8C03\u7528\u5230\u6765\u7684\u65F6\u5019\uFF0C\u53D1\u73B0\u5DF2\u7ECF\u4E0D\u662F\u8FD9\u4E2A\u72B6\u6001\uFF0C\u5C31\u8BF4\u660E\u4E0A\u6B21\u5DF2\u7ECF\u8C03\u7528\u8FC7\u4E86\u3002\u72B6\u6001\u7684\u53D8\u5316\u9700\u8981\u662F\u4E00\u4E2A\u539F\u5B50\u64CD\u4F5C\uFF0C\u4E5F\u5373\u5E76\u53D1\u8C03\u7528\u7684\u65F6\u5019\uFF0C\u53EA\u6709\u4E00\u6B21\u53EF\u4EE5\u6267\u884C\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"10\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\u4E25\u7981\u5185\u5D4C\u900F\u4F20",children:"10\u3001\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\u4E25\u7981\u5185\u5D4C\uFF0C\u900F\u4F20\xa0"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u63A5\u53E3\u4E4B\u95F4\u4F20\u9012\u6570\u636E\uFF0C\u5F80\u5F80\u901A\u8FC7\u6570\u636E\u7ED3\u6784\uFF0C\u5982\u679C\u6570\u636E\u7ED3\u6784\u900F\u4F20\uFF0C\u4ECE\u5E95\u5C42\u4E00\u76F4\u5230\u4E0A\u5C42\u4F7F\u7528\u540C\u4E00\u4E2A\u6570\u636E\u7ED3\u6784\uFF0C\u6216\u8005\u4E0A\u5C42\u7684\u6570\u636E\u7ED3\u6784\u5185\u5D4C\u5E95\u5C42\u7684\u6570\u636E\u7ED3\u6784\uFF0C\u5F53\u6570\u636E\u7ED3\u6784\u4E2D\u6DFB\u52A0\u6216\u8005\u5220\u9664\u4E00\u4E2A\u5B57\u6BB5\u7684\u65F6\u5019\uFF0C\u6CE2\u53CA\u7684\u9762\u4F1A\u975E\u5E38\u5927\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u56E0\u800C\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\uFF0C\u5728\u6BCF\u4E24\u4E2A\u63A5\u53E3\u4E4B\u95F4\u7EA6\u5B9A\uFF0C\u4E25\u7981\u5185\u5D4C\u548C\u900F\u4F20\uFF0C\u5373\u4FBF\u5DEE\u4E0D\u591A\uFF0C\u4E5F\u5E94\u8BE5\u91CD\u65B0\u5B9A\u4E49\uFF0C\u8FD9\u6837\u63A5\u53E3\u6570\u636E\u5B9A\u4E49\u7684\u6539\u53D8\uFF0C\u5F71\u54CD\u9762\u4EC5\u4EC5\u5728\u8C03\u7528\u65B9\u548C\u88AB\u8C03\u7528\u65B9\uFF0C\u5F53\u63A5\u53E3\u9700\u8981\u66F4\u65B0\u7684\u65F6\u5019\uFF0C\u6BD4\u8F83\u53EF\u63A7\uFF0C\u4E5F\u5BB9\u6613\u5347\u7EA7\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"11\u907F\u514D\u670D\u52A1\u95F4\u5171\u4EAB\u6570\u636E\u5E93",children:"11\u3001\u907F\u514D\u670D\u52A1\u95F4\u5171\u4EAB\u6570\u636E\u5E93"}),"\n",(0,s.jsxs)(n.p,{children:["\u6570\u636E\u5E93\u5305\u62EC\u4EFB\u610F\u7684\u6570\u636E\u5B58\u50A8\u670D\u52A1\uFF0C\u4F8B\u5982\uFF1A",(0,s.jsx)(n.code,{children:"MySQL"}),"\u3001",(0,s.jsx)(n.code,{children:"Redis"}),"\u3001",(0,s.jsx)(n.code,{children:"MongoDB"}),"\u7B49\u3002\u5982\u679C\u670D\u52A1\u95F4\u5171\u4EAB\u6570\u636E\u5E93\uFF0C\u4F1A\u9020\u6210\uFF1A"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u5F3A\u8026\u5408"}),"\uFF1A\u4E3A\u591A\u4E2A\u670D\u52A1\u63D0\u4F9B\u5355\u4E2A\u6570\u636E\u5E93\u4F1A\u9020\u6210\u670D\u52A1\u95F4\u7D27\u5BC6\u8026\u5408\uFF0C\u4E5F\u4F1A\u9020\u6210\u670D\u52A1\u72EC\u7ACB\u90E8\u7F72\u56F0\u96BE\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u6269\u5C55\u6027\u5DEE"}),"\uFF1A\u4F7F\u7528\u8FD9\u79CD\u8BBE\u8BA1\u5F88\u96BE\u6269\u5C55\u5355\u4E2A\u670D\u52A1\uFF0C\u56E0\u4E3A\u8FD9\u6837\u53EA\u80FD\u9009\u62E9\u6269\u5C55\u6574\u4E2A\u5355\u4E2A\u6570\u636E\u5E93\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u6027\u80FD\u95EE\u9898"}),"\uFF1A\u4F7F\u7528\u4E00\u4E2A\u5171\u4EAB\u6570\u636E\u5E93\uFF08\u4E0D\u662F\u6570\u636E\u5E93\u670D\u52A1\u5668\uFF09\uFF0C\u5728\u4E00\u6BB5\u65F6\u95F4\u5185\uFF0C\u4F60\u53EF\u80FD\u6700\u7EC8\u4F1A\u5F97\u5230\u4E00\u4E2A\u5DE8\u5927\u7684\u8868\u3002"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["\u56E0\u6B64\uFF0C\u5BF9\u4E8E\u73B0\u6709\u5171\u4EAB\u5E9E\u5927\u6570\u636E\u5E93\u7684\u5FAE\u670D\u52A1\uFF0C\u5EFA\u8BAE\u662F\u6309\u7167\u4E1A\u52A1\u7EF4\u5EA6\u62C6\u5206\u6210\u591A\u4E2A\u5C0F\u7684\u6570\u636E\u5E93\uFF0C\u5206\u5F00\u72EC\u7ACB\u7EF4\u62A4\u3002",(0,s.jsx)(n.strong,{children:"\u6B64\u5916\uFF0C\u518D\u6B21\u63D0\u9192\uFF0C\u7981\u6B62\u8DE8\u5E93\u8054\u8868\u67E5\u8BE2"}),"\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"12\u540C\u65F6\u5E94\u5F53\u8003\u8651\u56E2\u961F\u7ED3\u6784",children:"12\u3001\u540C\u65F6\u5E94\u5F53\u8003\u8651\u56E2\u961F\u7ED3\u6784"}),"\n",(0,s.jsx)(n.p,{children:"\u524D\u9762\u8BB2\u7684\u90FD\u662F\u6280\u672F\u56E0\u7D20\u7684\u5212\u5206\u539F\u5219\uFF0C\u5176\u5B9E\u5FAE\u670D\u52A1\u62C6\u5206\u65F6\u4E5F\u5E94\u5F53\u8003\u8651\u56E2\u961F\u7EC4\u7EC7\u7ED3\u6784\u3002"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u56E2\u961F\u8DB3\u591F\u8F7B\u91CF\u7EA7\uFF0C2 pizza\u539F\u5219\uFF0C\u4FDD\u8BC1\u56E2\u961F\u5185\u90E8\u80FD\u591F\u9AD8\u6548\u6C9F\u901A\u3002"}),"\n",(0,s.jsx)(n.li,{children:"\u56E2\u961F\u7684\u804C\u8D23\u8DB3\u591F\u660E\u786E\uFF0C\u4FDD\u8BC1\u80FD\u591F\u72EC\u7ACB\u7EF4\u62A4\uFF0C\u51CF\u5C11\u56E2\u961F\u95F4\u5DE5\u4F5C\u8026\u5408\u5EA6\uFF0C\u964D\u4F4E\u8DE8\u56E2\u961F\u534F\u4F5C\u6210\u672C\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"\u4E8C\u5FAE\u670D\u52A1\u62C6\u5206\u65F6\u673A",children:"\u4E8C\u3001\u5FAE\u670D\u52A1\u62C6\u5206\u65F6\u673A"}),"\n",(0,s.jsxs)(n.p,{children:["\u5FAE\u670D\u52A1\u62C6\u5206\u7EDD\u975E\u4E00\u4E2A\u5927\u8DC3\u8FDB\u8FD0\u52A8\uFF0C\u7531\u9AD8\u5C42\u53D1\u8D77\uFF0C\u628A\u4E00\u4E2A\u5E94\u7528\u62C6\u5206\u7684\u4E03\u96F6\u516B\u843D\u7684\uFF0C\u6700\u7EC8\u5927\u5927\u589E\u52A0\u8FD0\u7EF4\u6210\u672C\uFF0C\u4F46\u662F\u5E76\u4E0D\u4F1A\u5E26\u6765\u6536\u76CA\u3002",(0,s.jsx)(n.strong,{children:"\u5FAE\u670D\u52A1\u62C6\u5206\u7684\u8FC7\u7A0B\uFF0C\u5E94\u8BE5\u662F\u4E00\u4E2A\u7531\u75DB\u70B9\u9A71\u52A8\u7684"}),"\uFF0C\u662F\u4E1A\u52A1\u771F\u6B63\u9047\u5230\u4E86\u5FEB\u901F\u8FED\u4EE3\u548C\u9AD8\u5E76\u53D1\u7684\u95EE\u9898\uFF0C\u5982\u679C\u4E0D\u62C6\u5206\uFF0C\u5C06\u5BF9\u4E8E\u4E1A\u52A1\u7684\u53D1\u5C55\u5E26\u6765\u5F71\u54CD\uFF0C\u53EA\u6709\u8FD9\u4E2A\u65F6\u5019\uFF0C\u5FAE\u670D\u52A1\u7684\u62C6\u5206\u662F\u6709\u786E\u5B9A\u6536\u76CA\u7684\uFF0C\u589E\u52A0\u7684\u8FD0\u7EF4\u6210\u672C\u624D\u662F\u503C\u5F97\u7684\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"1\u5FEB\u901F\u8FED\u4EE3",children:"1\u3001\u5FEB\u901F\u8FED\u4EE3"}),"\n",(0,s.jsx)(n.p,{children:"\u4F7F\u7528\u5FAE\u670D\u52A1\u67B6\u6784\u7684\u76EE\u7684\u5C31\u662F\u4E3A\u4E86\u5FEB\u901F\u8FED\u4EE3\uFF0C\u5FEB\u901F\u4E0A\u7EBF\uFF0C\u8FD9\u4E5F\u662F\u5FAE\u670D\u52A1\u67B6\u6784\u7684\u6700\u5927\u7279\u70B9\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"2\u9AD8\u5E76\u53D1\u6027\u80FD\u8981\u6C42",children:"2\u3001\u9AD8\u5E76\u53D1\u3001\u6027\u80FD\u8981\u6C42"}),"\n",(0,s.jsx)(n.p,{children:"\u5BF9\u4E8E\u5FAE\u670D\u52A1\u5316\u62C6\u5206\u540E\u7684\u670D\u52A1\uFF0C\u53EF\u4EE5\u8F7B\u677E\u5730\u8FDB\u884C\u6C34\u5E73\u6269\u5BB9\uFF0C\u8FDB\u884C\u670D\u52A1\u4F18\u5316\uFF0C\u6EE1\u8DB3\u66F4\u591A\u7684\u5E76\u53D1\u548C\u6027\u80FD\u9700\u6C42\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u5728\u9AD8\u5E76\u53D1\u573A\u666F\u4E0B\uFF08\u6216\u8005\u8D44\u6E90\u7D27\u5F20\u7684\u573A\u666F\u4E0B\uFF09\uFF0C\u6211\u4EEC\u5E0C\u671B\u4E00\u4E2A\u8BF7\u6C42\u5982\u679C\u4E0D\u6210\u529F\uFF0C\u4E0D\u8981\u5360\u7528\u8D44\u6E90\uFF0C\u5E94\u8BE5\u5C3D\u5FEB\u5931\u8D25\uFF0C\u5C3D\u5FEB\u8FD4\u56DE\uFF0C\u800C\u4E14\u5E0C\u671B\u5F53\u4E00\u4E9B\u8FB9\u89D2\u7684\u4E1A\u52A1\u4E0D\u6B63\u5E38\u7684\u60C5\u51B5\u4E0B\uFF0C\u4E3B\u8981\u4E1A\u52A1\u6D41\u7A0B\u4E0D\u53D7\u5F71\u54CD\u3002\u8FD9\u5C31\u9700\u8981\u7194\u65AD\u7B56\u7565\uFF0C\u4E5F\u5373\u5F53A\u8C03\u7528B\uFF0C\u800CB\u603B\u662F\u4E0D\u6B63\u5E38\u7684\u65F6\u5019\uFF0C\u4E3A\u4E86\u8BA9B\u4E0D\u8981\u6CE2\u53CA\u5230A\uFF0C\u53EF\u4EE5\u5BF9B\u7684\u8C03\u7528\u8FDB\u884C\u7194\u65AD\uFF0C\u4E5F\u5373A\u4E0D\u8C03\u7528B\uFF0C\u800C\u662F\u8FD4\u56DE\u6682\u65F6\u7684fallback\u6570\u636E\uFF0C\u5F53B\u6B63\u5E38\u7684\u65F6\u5019\uFF0C\u518D\u653E\u5F00\u7194\u65AD\uFF0C\u8FDB\u884C\u6B63\u5E38\u7684\u8C03\u7528\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["\u5982\u679C\u6838\u5FC3\u4E1A\u52A1\u6D41\u7A0B\u548C\u666E\u901A\u4E1A\u52A1\u6D41\u7A0B\u5728\u540C\u4E00\u4E2A\u670D\u52A1\u4E2D\uFF0C\u5C31\u9700\u8981\u4F7F\u7528\u5927\u91CF\u7684",(0,s.jsx)(n.code,{children:"if-else"}),"\u8BED\u53E5\uFF0C\u6839\u636E\u4E0B\u53D1\u7684\u914D\u7F6E\u6765\u5224\u65AD\u662F\u5426\u7194\u65AD\u6216\u8005\u964D\u7EA7\uFF0C\u8FD9\u4F1A\u4F7F\u5F97\u914D\u7F6E\u5F02\u5E38\u590D\u6742\uFF0C\u96BE\u4EE5\u7EF4\u62A4\u3002\u5982\u679C\u6838\u5FC3\u4E1A\u52A1\u548C\u666E\u901A\u4E1A\u52A1\u5206\u6210\u4E24\u4E2A\u670D\u52A1\uFF0C\u5C31\u53EF\u4EE5\u4F7F\u7528\u6807\u51C6\u7684\u7194\u65AD\u964D\u7EA7\u7B56\u7565\uFF0C\u914D\u7F6E\u5728\u67D0\u79CD\u60C5\u51B5\u4E0B\uFF0C\u653E\u5F03\u5BF9\u53E6\u4E00\u4E2A\u670D\u52A1\u7684\u8C03\u7528\uFF0C\u53EF\u4EE5\u8FDB\u884C\u7EDF\u4E00\u7684\u7EF4\u62A4\u3002"]}),"\n",(0,s.jsx)(n.h4,{id:"3\u63D0\u4EA4\u4EE3\u7801\u9891\u7E41\u51FA\u73B0\u5927\u91CF\u51B2\u7A81",children:"3\u3001\u63D0\u4EA4\u4EE3\u7801\u9891\u7E41\u51FA\u73B0\u5927\u91CF\u51B2\u7A81"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u5BF9\u4E8E\u5FEB\u901F\u8FED\u4EE3\u7684\u6548\u679C\uFF0C\u9996\u5148\u662F\u5F00\u53D1\u72EC\u7ACB\uFF0C\u5982\u679C\u662F\u4E00\u5355\u4F53\u5E94\u7528\uFF0C\u51E0\u5341\u53F7\u4EBA\u5F00\u53D1\u4E00\u4E2A\u6A21\u5757\uFF0C\u5982\u679C\u4F7F\u7528GIT\u505A\u4EE3\u7801\u7BA1\u7406\uFF0C\u5219\u7ECF\u5E38\u4F1A\u9047\u5230\u7684\u4E8B\u60C5\u5C31\u662F\u4EE3\u7801\u63D0\u4EA4\u51B2\u7A81\u3002\u540C\u6837\u4E00\u4E2A\u6A21\u5757\uFF0C\u4F60\u4E5F\u6539\uFF0C\u4ED6\u4E5F\u6539\uFF0C\u51E0\u5341\u53F7\u4EBA\u6839\u672C\u6CA1\u529E\u6CD5\u6C9F\u901A\u3002\u6240\u4EE5\u5F53\u4F60\u60F3\u63D0\u4EA4\u4E00\u4E2A\u4EE3\u7801\u7684\u65F6\u5019\uFF0C\u53D1\u73B0\u548C\u522B\u4EBA\u63D0\u4EA4\u7684\u51B2\u7A81\u4E86\uFF0C\u4E8E\u662F\u56E0\u4E3A\u4F60\u662F\u540E\u63D0\u4EA4\u7684\u4EBA\uFF0C\u4F60\u6709\u8D23\u4EFB\u53BBmerge\u4EE3\u7801\uFF0C\u597D\u4E0D\u5BB9\u6613merge\u6210\u529F\u4E86\uFF0C\u7B49\u518D\u6B21\u63D0\u4EA4\u7684\u65F6\u5019\uFF0C\u53D1\u73B0\u53C8\u51B2\u7A81\u4E86\uFF0C\u4F60\u662F\u4E0D\u662F\u5F88\u607C\u706B\u3002\u968F\u7740\u56E2\u961F\u89C4\u6A21\u8D8A\u5927\uFF0C\u51B2\u7A81\u6982\u7387\u8D8A\u5927\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u6240\u4EE5\u5E94\u8BE5\u62C6\u5206\u6210\u4E0D\u540C\u7684\u6A21\u5757\uFF0C\u6BD4\u5982\u6BCF\u5341\u4E2A\u4EBA\u5DE6\u53F3\u7EF4\u62A4\u4E00\u4E2A\u6A21\u5757\uFF0C\u4E5F\u5373\u4E00\u4E2A\u5DE5\u7A0B\uFF0C\u9996\u5148\u4EE3\u7801\u51B2\u7A81\u7684\u6982\u7387\u5C0F\u591A\u4E86\uFF0C\u800C\u4E14\u6709\u4E86\u51B2\u7A81\uFF0C\u4E00\u4E2A\u5C0F\u7EC4\u4E00\u543C\uFF0C\u57FA\u672C\u4E0A\u95EE\u9898\u5C31\u89E3\u51B3\u4E86\u3002\u6BCF\u4E2A\u6A21\u5757\u5BF9\u5916\u63D0\u4F9B\u63A5\u53E3\uFF0C\u5176\u4ED6\u4F9D\u8D56\u6A21\u5757\u53EF\u4EE5\u4E0D\u7528\u5173\u6CE8\u5177\u4F53\u7684\u5B9E\u73B0\u7EC6\u8282\uFF0C\u53EA\u9700\u8981\u4FDD\u8BC1\u63A5\u53E3\u6B63\u786E\u5C31\u53EF\u4EE5\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"4\u5C0F\u529F\u80FD\u8981\u79EF\u7D2F\u5230\u5927\u7248\u672C\u624D\u80FD\u4E0A\u7EBF",children:"4\u3001\u5C0F\u529F\u80FD\u8981\u79EF\u7D2F\u5230\u5927\u7248\u672C\u624D\u80FD\u4E0A\u7EBF"}),"\n",(0,s.jsx)(n.p,{children:"\u5FAE\u670D\u52A1\u5BF9\u4E8E\u5FEB\u901F\u8FED\u4EE3\u7684\u6548\u679C\uFF0C\u9996\u5148\u662F\u4E0A\u7EBF\u72EC\u7ACB\u3002\u5982\u679C\u6CA1\u6709\u62C6\u5206\u5FAE\u670D\u52A1\uFF0C\u6BCF\u6B21\u4E0A\u7EBF\u90FD\u662F\u4E00\u4EF6\u5F88\u75DB\u82E6\u7684\u4E8B\u60C5\u3002\u5F53\u4F60\u4FEE\u6539\u4E86\u4E00\u4E2A\u8FB9\u89D2\u7684\u5C0F\u529F\u80FD\uFF0C\u4F46\u662F\u4F60\u4E0D\u6562\u9A6C\u4E0A\u4E0A\u7EBF\uFF0C\u56E0\u4E3A\u4F60\u4F9D\u8D56\u7684\u5176\u4ED6\u6A21\u5757\u624D\u5F00\u53D1\u4E86\u4E00\u534A\uFF0C\u4F60\u8981\u7B49\u4ED6\uFF0C\u7B49\u4ED6\u597D\u4E86\uFF0C\u4E5F\u4E0D\u6562\u9A6C\u4E0A\u4E0A\u7EBF\uFF0C\u56E0\u4E3A\u53E6\u4E00\u4E2A\u88AB\u4F9D\u8D56\u7684\u6A21\u5757\u4E5F\u5F00\u53D1\u4E86\u4E00\u534A\uFF0C\u5F53\u6240\u6709\u7684\u6A21\u5757\u90FD\u8026\u5408\u5728\u4E00\u8D77\uFF0C\u4E92\u76F8\u4F9D\u8D56\uFF0C\u8C01\u4E5F\u6CA1\u529E\u6CD5\u72EC\u7ACB\u4E0A\u7EBF\uFF0C\u800C\u662F\u9700\u8981\u534F\u8C03\u5404\u4E2A\u56E2\u961F\uFF0C\u5927\u5BB6\u5F00\u5927\u4F1A\uFF0C\u7EA6\u5B9A\u4E00\u4E2A\u65F6\u95F4\u70B9\uFF0C\u65E0\u8BBA\u5927\u5C0F\u529F\u80FD\uFF0C\u6B7B\u6D3B\u90FD\u8981\u8FD9\u5929\u4E0A\u7EBF\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u8FD9\u79CD\u6A21\u5F0F\u5BFC\u81F4\u4E0A\u7EBF\u7684\u65F6\u5019\uFF0C\u5355\u6B21\u4E0A\u7EBF\u7684\u9700\u6C42\u5217\u8868\u975E\u5E38\u957F\uFF0C\u8FD9\u6837\u98CE\u9669\u6BD4\u8F83\u5927\uFF0C\u53EF\u80FD\u5C0F\u529F\u80FD\u7684\u9519\u8BEF\u4F1A\u5BFC\u81F4\u5927\u529F\u80FD\u7684\u4E0A\u7EBF\u4E0D\u6B63\u5E38\uFF0C\u5C06\u5982\u6B64\u957F\u7684\u529F\u80FD\uFF0C\u9700\u8981\u4E00\u70B9\u70B9check\uFF0C\u975E\u5E38\u5C0F\u5FC3\uFF0C\u8FD9\u6837\u4E0A\u7EBF\u65F6\u95F4\u957F\uFF0C\u5F71\u54CD\u8303\u56F4\u5927\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["\u670D\u52A1\u62C6\u5206\u540E\uFF0C",(0,s.jsx)(n.strong,{children:"\u5728\u56E2\u961F\u804C\u8D23\u660E\u786E\u3001\u5E94\u7528\u8FB9\u754C\u660E\u786E\u3001\u63A5\u53E3\u7A33\u5B9A\u7684\u60C5\u51B5\u4E0B"}),"\uFF0C\u4E0D\u540C\u7684\u6A21\u5757\u53EF\u4EE5\u72EC\u7ACB\u4E0A\u7EBF\u3002\u8FD9\u6837\u4E0A\u7EBF\u7684\u6B21\u6570\u589E\u591A\uFF0C\u5355\u6B21\u4E0A\u7EBF\u7684\u9700\u6C42\u5217\u8868\u53D8\u5C0F\uFF0C\u53EF\u4EE5\u968F\u65F6\u56DE\u6EDA\uFF0C\u98CE\u9669\u53D8\u5C0F\uFF0C\u65F6\u95F4\u53D8\u77ED\uFF0C\u5F71\u54CD\u9762\u5C0F\uFF0C\u4ECE\u800C\u8FED\u4EE3\u901F\u5EA6\u52A0\u5FEB\u3002\u5BF9\u4E8E\u63A5\u53E3\u8981\u5347\u7EA7\u90E8\u5206\uFF0C\u4FDD\u8BC1\u7070\u5EA6\uFF0C\u5148\u505A\u63A5\u53E3\u65B0\u589E\uFF0C\u800C\u975E\u539F\u63A5\u53E3\u53D8\u66F4\uFF0C\u5F53\u6CE8\u518C\u4E2D\u5FC3\u4E2D\u76D1\u63A7\u5230\u7684\u8C03\u7528\u60C5\u51B5\uFF0C\u53D1\u73B0\u63A5\u53E3\u5DF2\u7ECF\u4E0D\u7528\u4E86\uFF0C\u518D\u5220\u9664\u3002"]})]})}function j(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},34193:function(e,n,i){i.d(n,{Z:function(){return l}});let l=i.p+"assets/images/image2020-11-20_14-59-0-fa5a8ffcc327f62822db4a97b08cc0f5.png"},21271:function(e,n,i){i.d(n,{Z:function(){return l}});let l=i.p+"assets/images/image2020-11-20_17-12-24-58f1c52961c5fa8fa934823d149c2d8e.png"},17624:function(e,n,i){i.d(n,{Z:function(){return l}});let l=i.p+"assets/images/image2020-11-20_17-16-29-7a6720d3de8fbc0e1462f71ea9baba38.png"},50065:function(e,n,i){i.d(n,{Z:function(){return c},a:function(){return d}});var l=i(67294);let s={},r=l.createContext(s);function d(e){let n=l.useContext(r);return l.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),l.createElement(r.Provider,{value:n},e.children)}}}]);