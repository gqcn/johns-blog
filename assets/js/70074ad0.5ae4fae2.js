"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["5241"],{18480:function(d,e,c){c.r(e),c.d(e,{metadata:()=>r,contentTitle:()=>i,default:()=>x,assets:()=>l,toc:()=>o,frontMatter:()=>s});var r=JSON.parse('{"id":"docs/\u4E91\u539F\u751F/Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4","title":"Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4","description":"\u8BE6\u7EC6\u5BF9\u6BD4 Docker\u3001Containerd (crictl) \u548C ctr \u7684\u5E38\u7528\u547D\u4EE4\uFF0C\u5E2E\u52A9\u7528\u6237\u5728\u4E0D\u540C\u5BB9\u5668\u8FD0\u884C\u65F6\u73AF\u5883\u4E0B\u8FDB\u884C\u5BB9\u5668\u64CD\u4F5C\u548C\u7BA1\u7406","source":"@site/docs/docs/3000-\u4E91\u539F\u751F/2000-Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4.md","sourceDirName":"docs/3000-\u4E91\u539F\u751F","slug":"/cloud-native/docker-containerd-commands","permalink":"/cloud-native/docker-containerd-commands","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2000,"frontMatter":{"slug":"/cloud-native/docker-containerd-commands","title":"Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4","hide_title":true,"keywords":["Docker","Containerd","crictl","ctr","\u5BB9\u5668\u547D\u4EE4","\u547D\u4EE4\u5BF9\u6BD4","\u5BB9\u5668\u8FD0\u7EF4","\u5BB9\u5668\u7BA1\u7406"],"description":"\u8BE6\u7EC6\u5BF9\u6BD4 Docker\u3001Containerd (crictl) \u548C ctr \u7684\u5E38\u7528\u547D\u4EE4\uFF0C\u5E2E\u52A9\u7528\u6237\u5728\u4E0D\u540C\u5BB9\u5668\u8FD0\u884C\u65F6\u73AF\u5883\u4E0B\u8FDB\u884C\u5BB9\u5668\u64CD\u4F5C\u548C\u7BA1\u7406"},"sidebar":"mainSidebar","previous":{"title":"Dragonfly\u4ECB\u7ECD","permalink":"/cloud-native/dragonfly"},"next":{"title":"\u53EF\u89C2\u6D4B\u6027","permalink":"/observability"}}'),n=c("85893"),t=c("50065");let s={slug:"/cloud-native/docker-containerd-commands",title:"Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4",hide_title:!0,keywords:["Docker","Containerd","crictl","ctr","\u5BB9\u5668\u547D\u4EE4","\u547D\u4EE4\u5BF9\u6BD4","\u5BB9\u5668\u8FD0\u7EF4","\u5BB9\u5668\u7BA1\u7406"],description:"\u8BE6\u7EC6\u5BF9\u6BD4 Docker\u3001Containerd (crictl) \u548C ctr \u7684\u5E38\u7528\u547D\u4EE4\uFF0C\u5E2E\u52A9\u7528\u6237\u5728\u4E0D\u540C\u5BB9\u5668\u8FD0\u884C\u65F6\u73AF\u5883\u4E0B\u8FDB\u884C\u5BB9\u5668\u64CD\u4F5C\u548C\u7BA1\u7406"},i=void 0,l={},o=[];function h(d){let e={code:"code",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,t.a)(),...d.components};return(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{children:"\u547D\u4EE4"}),(0,n.jsx)(e.th,{children:"docker"}),(0,n.jsx)(e.th,{children:"crictl\uFF08\u63A8\u8350\uFF09"}),(0,n.jsx)(e.th,{children:"ctr"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770B\u5BB9\u5668\u5217\u8868"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker ps"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl ps"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io c ls"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770B\u5BB9\u5668\u8BE6\u60C5"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker inspect"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl inspect"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io c info"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770B\u5BB9\u5668\u65E5\u5FD7"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker logs"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl logs"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u5BB9\u5668\u5185\u6267\u884C\u547D\u4EE4"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker exec"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl exec"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u6302\u8F7D\u5BB9\u5668"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker attach"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl attach"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u5BB9\u5668\u8D44\u6E90\u4F7F\u7528"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker stats"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl stats"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u521B\u5EFA\u5BB9\u5668"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker create"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl create"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io c create"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u542F\u52A8\u5BB9\u5668"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker start"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl start"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io run"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u505C\u6B62\u5BB9\u5668"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker stop"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl stop"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u5220\u9664\u5BB9\u5668"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker rm"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl rm"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io c del"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770B\u955C\u50CF\u5217\u8868"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker images"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl images"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io i ls"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770B\u955C\u50CF\u8BE6\u60C5"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker inspect"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl inspecti"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u62C9\u53D6\u955C\u50CF"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker pull"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl pull"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io i pull"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u63A8\u9001\u955C\u50CF"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker push"})}),(0,n.jsx)(e.td,{children:"\u65E0"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io i push"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u5220\u9664\u955C\u50CF"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"docker rmi"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl rmi"})}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"ctr -n k8s.io i rm"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770BPod\u5217\u8868"})}),(0,n.jsx)(e.td,{children:"\u65E0"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl pods"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u67E5\u770BPod\u8BE6\u60C5"})}),(0,n.jsx)(e.td,{children:"\u65E0"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl inspectp"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u542F\u52A8Pod"})}),(0,n.jsx)(e.td,{children:"\u65E0"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl runp"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:(0,n.jsx)(e.strong,{children:"\u505C\u6B62Pod"})}),(0,n.jsx)(e.td,{children:"\u65E0"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"crictl stopp"})}),(0,n.jsx)(e.td,{children:"\u65E0"})]})]})]})}function x(d={}){let{wrapper:e}={...(0,t.a)(),...d.components};return e?(0,n.jsx)(e,{...d,children:(0,n.jsx)(h,{...d})}):h(d)}},50065:function(d,e,c){c.d(e,{Z:function(){return i},a:function(){return s}});var r=c(67294);let n={},t=r.createContext(n);function s(d){let e=r.useContext(t);return r.useMemo(function(){return"function"==typeof d?d(e):{...e,...d}},[e,d])}function i(d){let e;return e=d.disableParentContext?"function"==typeof d.components?d.components(n):d.components||n:s(d.components),r.createElement(t.Provider,{value:e},d.children)}}}]);