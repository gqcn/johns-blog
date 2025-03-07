"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["9976"],{94753:function(e,t,i){i.r(t),i.d(t,{metadata:()=>s,contentTitle:()=>o,default:()=>u,assets:()=>l,toc:()=>d,frontMatter:()=>n});var s=JSON.parse('{"id":"docs/\u53EF\u89C2\u6D4B\u6027/\u76D1\u63A7\u6280\u672F/\u5982\u4F55\u4ECEkubelet\u62C9\u53D6cadvisor\u6307\u6807","title":"\u5982\u4F55\u4ECEkubelet\u62C9\u53D6cadvisor\u6307\u6807","description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4ECE Kubelet \u83B7\u53D6 cAdvisor \u7684\u5BB9\u5668\u76D1\u63A7\u6307\u6807\uFF0C\u5305\u62EC\u914D\u7F6E\u65B9\u6CD5\u3001\u91C7\u96C6\u6B65\u9AA4\u548C\u6700\u4F73\u5B9E\u8DF5","source":"@site/docs/docs/4-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F/7-\u5982\u4F55\u4ECEkubelet\u62C9\u53D6cadvisor\u6307\u6807.md","sourceDirName":"docs/4-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F","slug":"/observability/kubelet-cadvisor-metrics-collection","permalink":"/observability/kubelet-cadvisor-metrics-collection","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":7,"frontMatter":{"slug":"/observability/kubelet-cadvisor-metrics-collection","title":"\u5982\u4F55\u4ECEkubelet\u62C9\u53D6cadvisor\u6307\u6807","hide_title":true,"keywords":["Kubelet","cAdvisor","\u6307\u6807\u91C7\u96C6","\u5BB9\u5668\u76D1\u63A7","\u76D1\u63A7\u914D\u7F6E","\u6027\u80FD\u6570\u636E"],"description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4ECE Kubelet \u83B7\u53D6 cAdvisor \u7684\u5BB9\u5668\u76D1\u63A7\u6307\u6807\uFF0C\u5305\u62EC\u914D\u7F6E\u65B9\u6CD5\u3001\u91C7\u96C6\u6B65\u9AA4\u548C\u6700\u4F73\u5B9E\u8DF5"},"sidebar":"mainSidebar","previous":{"title":"\u4ECEkubelet\u83B7\u53D6cadvisor\u6307\u6807\u5076\u73B0\u4E22\u5931container*\u76F8\u5173\u6307\u6807","permalink":"/observability/kubelet-cadvisor-metrics-missing"},"next":{"title":"eBPF\u5B66\u4E60","permalink":"/observability/ebpf-learning-guide"}}'),r=i("85893"),c=i("50065");let n={slug:"/observability/kubelet-cadvisor-metrics-collection",title:"\u5982\u4F55\u4ECEkubelet\u62C9\u53D6cadvisor\u6307\u6807",hide_title:!0,keywords:["Kubelet","cAdvisor","\u6307\u6807\u91C7\u96C6","\u5BB9\u5668\u76D1\u63A7","\u76D1\u63A7\u914D\u7F6E","\u6027\u80FD\u6570\u636E"],description:"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4ECE Kubelet \u83B7\u53D6 cAdvisor \u7684\u5BB9\u5668\u76D1\u63A7\u6307\u6807\uFF0C\u5305\u62EC\u914D\u7F6E\u65B9\u6CD5\u3001\u91C7\u96C6\u6B65\u9AA4\u548C\u6700\u4F73\u5B9E\u8DF5"},o=void 0,l={},d=[{value:"\u80CC\u666F",id:"\u80CC\u666F",level:2},{value:"\u6CE8\u610F\u4E8B\u9879",id:"\u6CE8\u610F\u4E8B\u9879",level:2}];function a(e){let t={a:"a",code:"code",h2:"h2",img:"img",p:"p",...(0,c.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"\u80CC\u666F",children:"\u80CC\u666F"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"kubelet"}),"\u4E2D\u5DF2\u7ECF\u5185\u7F6E\u4E86",(0,r.jsx)(t.code,{children:"cadvisor"}),"\uFF0C\u53EF\u4EE5\u62C9\u53D6\u5230\u5BB9\u5668\u7684\u6307\u6807\uFF0C\u5E76\u4E14\u4F1A\u81EA\u52A8\u7ED9\u5BB9\u5668\u6307\u6807\u6CE8\u5165",(0,r.jsx)(t.code,{children:"pod, node"}),"\u7B49\u6807\u7B7E\u4FE1\u606F\u3002\u4F46",(0,r.jsx)(t.code,{children:"kubelet"}),"\u66B4\u9732\u7684\u6307\u6807\u63A5\u53E3\u662F",(0,r.jsx)(t.code,{children:"https"}),"\u534F\u8BAE\uFF0C\u56E0\u6B64\u6D89\u53CA\u5230\u6743\u9650\u9A8C\u8BC1\uFF0C\u5177\u4F53\u6B65\u9AA4\u53EF\u4EE5\u53C2\u8003\uFF1A",(0,r.jsx)(t.a,{href:"https://github.com/SUSE/doc-caasp/issues/166",children:"https://github.com/SUSE/doc-caasp/issues/166"})]}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{src:i(58093).Z+"",width:"1712",height:"1348"})}),"\n",(0,r.jsx)(t.h2,{id:"\u6CE8\u610F\u4E8B\u9879",children:"\u6CE8\u610F\u4E8B\u9879"}),"\n",(0,r.jsxs)(t.p,{children:["\u7531\u4E8E\u5BB9\u5668\u6307\u6807\u4F9D\u8D56\u4E8E",(0,r.jsx)(t.code,{children:"kubelet"}),"\uFF0C\u6269\u5C55\u6027\u53D7\u9650\u4E8E",(0,r.jsx)(t.code,{children:"kubernetes"}),"\u7248\u672C\uFF0C\u6BD4\u5982",(0,r.jsx)(t.code,{children:"kubelet"}),"\u5B58\u5728",(0,r.jsx)(t.code,{children:"bug"}),"\uFF0C\u90A3\u4E48\u53EF\u80FD\u96BE\u4EE5\u4FEE\u590D\uFF0C\u56E0\u4E3A\u5347\u7EA7",(0,r.jsx)(t.code,{children:"kubernetes"}),"\u7248\u672C\u662F\u6BD4\u8F83\u91CD\u7684\u64CD\u4F5C\uFF0C\u7279\u522B\u662F\u9488\u5BF9\u79DF\u6237\u7AEF\u7684\u7528\u6237\u901A\u5E38\u96BE\u4EE5\u63A5\u53D7\u3002\u5177\u4F53\u53EF\u53C2\u8003\u9047\u5230\u7684\u5DF2\u77E5\u95EE\u9898\uFF1A",(0,r.jsx)(t.a,{href:"/observability/kubelet-cadvisor-metrics-missing",children:"\u4ECEkubelet\u83B7\u53D6cadvisor\u6307\u6807\u5076\u73B0\u4E22\u5931container*\u76F8\u5173\u6307\u6807"})]})]})}function u(e={}){let{wrapper:t}={...(0,c.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},58093:function(e,t,i){i.d(t,{Z:function(){return s}});let s=i.p+"assets/images/image-2024-5-14_14-55-12-45069422743cb99150a9d032a40bfff4.png"},50065:function(e,t,i){i.d(t,{Z:function(){return o},a:function(){return n}});var s=i(67294);let r={},c=s.createContext(r);function n(e){let t=s.useContext(c);return s.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:n(e.components),s.createElement(c.Provider,{value:t},e.children)}}}]);