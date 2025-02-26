"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["3319"],{66904:function(n,e,c){c.r(e),c.d(e,{metadata:()=>s,contentTitle:()=>d,default:()=>a,assets:()=>o,toc:()=>t,frontMatter:()=>r});var s=JSON.parse('{"id":"\u5F00\u53D1\u8BED\u8A00/Golang/GODEBUG\u914D\u7F6EGC\u8DDF\u8E2A\u4ECB\u7ECD","title":"GODEBUG\u914D\u7F6EGC\u8DDF\u8E2A\u4ECB\u7ECD","description":"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 GODEBUG \u73AF\u5883\u53D8\u91CF\u8FDB\u884C Go \u7A0B\u5E8F\u7684 GC \u8DDF\u8E2A\u548C\u5206\u6790\uFF0C\u5305\u62EC gctrace \u8F93\u51FA\u683C\u5F0F\u89E3\u6790","source":"@site/docs/2-\u5F00\u53D1\u8BED\u8A00/0-Golang/9-GODEBUG\u914D\u7F6EGC\u8DDF\u8E2A\u4ECB\u7ECD.md","sourceDirName":"2-\u5F00\u53D1\u8BED\u8A00/0-Golang","slug":"/godebug-gc-trace","permalink":"/godebug-gc-trace","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":9,"frontMatter":{"slug":"/godebug-gc-trace","title":"GODEBUG\u914D\u7F6EGC\u8DDF\u8E2A\u4ECB\u7ECD","hide_title":true,"keywords":["GODEBUG","GC\u8DDF\u8E2A","\u5783\u573E\u56DE\u6536","\u6027\u80FD\u5206\u6790","\u5185\u5B58\u7BA1\u7406","\u8C03\u8BD5\u5DE5\u5177"],"description":"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 GODEBUG \u73AF\u5883\u53D8\u91CF\u8FDB\u884C Go \u7A0B\u5E8F\u7684 GC \u8DDF\u8E2A\u548C\u5206\u6790\uFF0C\u5305\u62EC gctrace \u8F93\u51FA\u683C\u5F0F\u89E3\u6790"},"sidebar":"mainSidebar","previous":{"title":"unexpected fault address 0x0 fatal error: fault signal SIGSEGV: segmentation violation","permalink":"/golang-sigsegv-error"},"next":{"title":"\u4E00\u4E2AGolang\u7A0B\u5E8F\u5185\u5B58\u5360\u7528\u95EE\u9898\u6392\u67E5\u4F18\u5316\uFF08\u590D\u76D8\uFF09","permalink":"/golang-memory-optimization-case"}}'),i=c("85893"),l=c("50065");let r={slug:"/godebug-gc-trace",title:"GODEBUG\u914D\u7F6EGC\u8DDF\u8E2A\u4ECB\u7ECD",hide_title:!0,keywords:["GODEBUG","GC\u8DDF\u8E2A","\u5783\u573E\u56DE\u6536","\u6027\u80FD\u5206\u6790","\u5185\u5B58\u7BA1\u7406","\u8C03\u8BD5\u5DE5\u5177"],description:"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 GODEBUG \u73AF\u5883\u53D8\u91CF\u8FDB\u884C Go \u7A0B\u5E8F\u7684 GC \u8DDF\u8E2A\u548C\u5206\u6790\uFF0C\u5305\u62EC gctrace \u8F93\u51FA\u683C\u5F0F\u89E3\u6790"},d=void 0,o={},t=[{value:"\u80CC\u666F\u4ECB\u7ECD",id:"\u80CC\u666F\u4ECB\u7ECD",level:2},{value:"gctrace=1\u683C\u5F0F\u4ECB\u7ECD",id:"gctrace1\u683C\u5F0F\u4ECB\u7ECD",level:2},{value:"\u793A\u4F8B",id:"\u793A\u4F8B",level:3},{value:"\u683C\u5F0F",id:"\u683C\u5F0F",level:3},{value:"\u542B\u4E49",id:"\u542B\u4E49",level:3},{value:"\u6848\u4F8B",id:"\u6848\u4F8B",level:3},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function h(n){let e={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.a)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h2,{id:"\u80CC\u666F\u4ECB\u7ECD",children:"\u80CC\u666F\u4ECB\u7ECD"}),"\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"Golang"}),"\u6267\u884C\u5F15\u64CE\u63D0\u4F9B\u4E86\u5F88\u591A\u5B9E\u7528\u7684\u8FD0\u884C\u65F6",(0,i.jsx)(e.strong,{children:"\u73AF\u5883\u53D8\u91CF"}),"\u53C2\u6570\u6765\u63A7\u5236\u7279\u6027\u5F00\u5173\u6216\u8005\u6253\u5370\u4E00\u4E9B\u8C03\u8BD5\u4FE1\u606F\uFF0C\u5176\u4E2D\u6BD4\u8F83\u6709\u7528\u7684",(0,i.jsx)(e.code,{children:"GODEBUG"}),"\u73AF\u5883\u53D8\u91CF\u3002\u901A\u5E38\u6211\u4EEC\u4F7F\u7528",(0,i.jsx)(e.code,{children:"gctrace=1"}),"\u4F5C\u4E3A",(0,i.jsx)(e.code,{children:"GODBUG"}),"\u73AF\u5883\u53D8\u91CF\u7684\u503C\u6765\u6253\u5370",(0,i.jsx)(e.code,{children:"gc"}),"\u6267\u884C\u7684\u60C5\u51B5\uFF0C\u53EF\u4EE5\u8BC4\u4F30\u8FDB\u7A0B\u7684\u5185\u5B58\u4F7F\u7528\u60C5\u51B5\u4EE5\u53CA",(0,i.jsx)(e.code,{children:"gc"}),"\u6267\u884C\u5BF9\u7A0B\u5E8F\u6027\u80FD\u5F71\u54CD\u3002"]}),"\n",(0,i.jsx)(e.h2,{id:"gctrace1\u683C\u5F0F\u4ECB\u7ECD",children:"gctrace=1\u683C\u5F0F\u4ECB\u7ECD"}),"\n",(0,i.jsxs)(e.p,{children:["\u5728",(0,i.jsx)(e.code,{children:"Golang"}),"\u5B98\u65B9\u6587\u6863\u4E2D\u5DF2\u6709\u6BD4\u8F83\u8BE6\u7EC6\u7684\u4ECB\u7ECD\uFF0C\u5927\u5BB6\u53EF\u4EE5\u5148\u4E86\u89E3\u4E00\u4E0B\uFF1A",(0,i.jsx)(e.a,{href:"https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme",children:"https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme"})]}),"\n",(0,i.jsx)(e.h3,{id:"\u793A\u4F8B",children:"\u793A\u4F8B"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"$ GODEBUG=gctrace=1 go run main.go    \ngc 1 @0.032s 0%: 0.019+0.45+0.003 ms clock, 0.076+0.22/0.40/0.80+0.012 ms cpu, 4->4->0 MB, 5 MB goal, 4 P\ngc 2 @0.046s 0%: 0.004+0.40+0.008 ms clock, 0.017+0.32/0.25/0.81+0.034 ms cpu, 4->4->0 MB, 5 MB goal, 4 P\ngc 3 @0.063s 0%: 0.004+0.40+0.008 ms clock, 0.018+0.056/0.32/0.64+0.033 ms cpu, 4->4->0 MB, 5 MB goal, 4 P\ngc 4 @0.080s 0%: 0.004+0.45+0.016 ms clock, 0.018+0.15/0.34/0.77+0.065 ms cpu, 4->4->1 MB, 5 MB goal, 4 P\ngc 5 @0.095s 0%: 0.015+0.87+0.005 ms clock, 0.061+0.27/0.74/1.8+0.023 ms cpu, 4->4->1 MB, 5 MB goal, 4 P\ngc 6 @0.113s 0%: 0.014+0.69+0.002 ms clock, 0.056+0.23/0.48/1.4+0.011 ms cpu, 4->4->1 MB, 5 MB goal, 4 P\ngc 7 @0.140s 1%: 0.031+2.0+0.042 ms clock, 0.12+0.43/1.8/0.049+0.17 ms cpu, 4->4->1 MB, 5 MB goal, 4 P\n...\n"})}),"\n",(0,i.jsx)(e.h3,{id:"\u683C\u5F0F",children:"\u683C\u5F0F"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"gc ## @#s #%: #+#+## ms clock, #+#/#/#+## ms cpu, #->#->## MB, ## MB goal, ## P\n"})}),"\n",(0,i.jsx)(e.h3,{id:"\u542B\u4E49",children:"\u542B\u4E49"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"gc#"}),"\uFF1AGC \u6267\u884C\u6B21\u6570\u7684\u7F16\u53F7\uFF0C\u6BCF\u6B21\u53E0\u52A0\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"@#s"}),"\uFF1A\u81EA\u7A0B\u5E8F\u542F\u52A8\u540E\u5230\u5F53\u524D\u7684\u5177\u4F53\u79D2\u6570\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"#%"}),"\uFF1A\u81EA\u7A0B\u5E8F\u542F\u52A8\u4EE5\u6765\u5728GC\u4E2D\u82B1\u8D39\u7684\u65F6\u95F4\u767E\u5206\u6BD4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"#+...+#"}),"\uFF1AGC \u7684\u6807\u8BB0\u5DE5\u4F5C\u5171\u4F7F\u7528\u7684 CPU \u65F6\u95F4\u5360\u603B CPU \u65F6\u95F4\u7684\u767E\u5206\u6BD4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"#->#->## MB"}),"\uFF1A\u5206\u522B\u8868\u793A GC \u542F\u52A8\u65F6, GC \u7ED3\u675F\u65F6, GC \u6D3B\u52A8\u65F6\u7684\u5806\u5927\u5C0F."]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"#MB goal"}),"\uFF1A\u4E0B\u4E00\u6B21\u89E6\u53D1 GC \u7684\u5185\u5B58\u5360\u7528\u9608\u503C\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"#P"}),"\uFF1A\u5F53\u524D\u4F7F\u7528\u7684\u5904\u7406\u5668 P \u7684\u6570\u91CF\u3002"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h3,{id:"\u6848\u4F8B",children:"\u6848\u4F8B"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"gc 7 @0.140s 1%: 0.031+2.0+0.042 ms clock, 0.12+0.43/1.8/0.049+0.17 ms cpu, 4->4->1 MB, 5 MB goal, 4 P\n"})}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"gc 7"}),"\uFF1A\u7B2C 7 \u6B21 GC\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"@0.140s"}),"\uFF1A\u5F53\u524D\u662F\u7A0B\u5E8F\u542F\u52A8\u540E\u7684 0.140s\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"1%"}),"\uFF1A\u7A0B\u5E8F\u542F\u52A8\u540E\u5230\u73B0\u5728\u5171\u82B1\u8D39 1% \u7684\u65F6\u95F4\u5728 GC \u4E0A\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.031+2.0+0.042 ms clock"}),"\uFF1A"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.031"}),"\uFF1A\u8868\u793A\u5355\u4E2A P \u5728 mark \u9636\u6BB5\u7684 STW \u65F6\u95F4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"2.0"}),"\uFF1A\u8868\u793A\u6240\u6709 P \u7684 mark concurrent\uFF08\u5E76\u53D1\u6807\u8BB0\uFF09\u6240\u4F7F\u7528\u7684\u65F6\u95F4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.042"}),"\uFF1A\u8868\u793A\u5355\u4E2A P \u7684 markTermination \u9636\u6BB5\u7684 STW \u65F6\u95F4\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.12+0.43/1.8/0.049+0.17 ms cpu"}),"\uFF1A"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.12"}),"\uFF1A\u8868\u793A\u6574\u4E2A\u8FDB\u7A0B\u5728 mark \u9636\u6BB5 STW \u505C\u987F\u7684\u65F6\u95F4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.43/1.8/0.049"}),"\uFF1A0.43 \u8868\u793A mutator assist \u5360\u7528\u7684\u65F6\u95F4\uFF0C1.8 \u8868\u793A dedicated + fractional \u5360\u7528\u7684\u65F6\u95F4\uFF0C0.049 \u8868\u793A idle \u5360\u7528\u7684\u65F6\u95F4\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"0.17ms"}),"\uFF1A0.17 \u8868\u793A\u6574\u4E2A\u8FDB\u7A0B\u5728 markTermination \u9636\u6BB5 STW \u65F6\u95F4\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"4->4->1 MB"}),"\uFF1A"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"4\uFF1A\u8868\u793A\u5F00\u59CB mark \u9636\u6BB5\u524D\u7684 heap_live \u5927\u5C0F\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"4\uFF1A\u8868\u793A\u5F00\u59CB markTermination \u9636\u6BB5\u524D\u7684 heap_live \u5927\u5C0F\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:["1\uFF1A",(0,i.jsx)(e.strong,{children:"\u8868\u793A\u88AB\u6807\u8BB0\u4E3A\u5B58\u6D3B\u5BF9\u8C61\u7684\u5927\u5C0F\uFF08\u4E5F\u5C31\u662F\u4E0D\u4F1A\u91CA\u653E\u7684heap\u5927\u5C0F\uFF09"}),"\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"5 MB goal"}),"\uFF1A\u8868\u793A\u4E0B\u4E00\u6B21\u89E6\u53D1 GC \u56DE\u6536\u7684\u9608\u503C\u662F 5 MB\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"4 P"}),"\uFF1A\u672C\u6B21 GC \u4E00\u5171\u6D89\u53CA\u591A\u5C11\u4E2A P\u3002"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.a,{href:"https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme",children:"https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.a,{href:"https://eddycjy.gitbook.io/golang/di-9-ke-gong-ju/godebug-gc",children:"https://eddycjy.gitbook.io/golang/di-9-ke-gong-ju/godebug-gc"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.a,{href:"https://www.ardanlabs.com/blog/2019/05/garbage-collection-in-go-part2-gctraces.html",children:"https://www.ardanlabs.com/blog/2019/05/garbage-collection-in-go-part2-gctraces.html"})}),"\n"]}),"\n"]})]})}function a(n={}){let{wrapper:e}={...(0,l.a)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(h,{...n})}):h(n)}},50065:function(n,e,c){c.d(e,{Z:function(){return d},a:function(){return r}});var s=c(67294);let i={},l=s.createContext(i);function r(n){let e=s.useContext(l);return s.useMemo(function(){return"function"==typeof n?n(e):{...e,...n}},[e,n])}function d(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:r(n.components),s.createElement(l.Provider,{value:e},n.children)}}}]);