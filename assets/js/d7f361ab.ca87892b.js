"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["3912"],{59047:function(e,n,s){s.r(n),s.d(n,{metadata:()=>d,contentTitle:()=>t,default:()=>a,assets:()=>o,toc:()=>l,frontMatter:()=>r});var d=JSON.parse('{"id":"\u5BB9\u5668\u6280\u672F/Kubernetes/Pod stuck in ContainerCreating-Terminating","title":"Pod stuck in ContainerCreating/Terminating","description":"\u5206\u6790\u548C\u89E3\u51B3 Kubernetes Pod \u5361\u5728 ContainerCreating \u6216 Terminating \u72B6\u6001\u7684\u95EE\u9898\uFF0C\u5305\u62EC\u95EE\u9898\u6392\u67E5\u548C\u89E3\u51B3\u65B9\u6848","source":"@site/docs/3-\u5BB9\u5668\u6280\u672F/0-Kubernetes/7-Pod stuck in ContainerCreating-Terminating.md","sourceDirName":"3-\u5BB9\u5668\u6280\u672F/0-Kubernetes","slug":"/kubernetes-pod-stuck-issues","permalink":"/kubernetes-pod-stuck-issues","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":7,"frontMatter":{"slug":"/kubernetes-pod-stuck-issues","title":"Pod stuck in ContainerCreating/Terminating","hide_title":true,"keywords":["Kubernetes","Pod","ContainerCreating","Terminating","\u95EE\u9898\u6392\u67E5","\u5BB9\u5668\u72B6\u6001","Docker"],"description":"\u5206\u6790\u548C\u89E3\u51B3 Kubernetes Pod \u5361\u5728 ContainerCreating \u6216 Terminating \u72B6\u6001\u7684\u95EE\u9898\uFF0C\u5305\u62EC\u95EE\u9898\u6392\u67E5\u548C\u89E3\u51B3\u65B9\u6848"},"sidebar":"mainSidebar","previous":{"title":"Kubernetes \u5E38\u89C1\u95EE\u9898","permalink":"/kubernetes-common-issues"},"next":{"title":"Argo Workflow","permalink":"/argo-workflow"}}'),c=s("85893"),i=s("50065");let r={slug:"/kubernetes-pod-stuck-issues",title:"Pod stuck in ContainerCreating/Terminating",hide_title:!0,keywords:["Kubernetes","Pod","ContainerCreating","Terminating","\u95EE\u9898\u6392\u67E5","\u5BB9\u5668\u72B6\u6001","Docker"],description:"\u5206\u6790\u548C\u89E3\u51B3 Kubernetes Pod \u5361\u5728 ContainerCreating \u6216 Terminating \u72B6\u6001\u7684\u95EE\u9898\uFF0C\u5305\u62EC\u95EE\u9898\u6392\u67E5\u548C\u89E3\u51B3\u65B9\u6848"},t=void 0,o={},l=[{value:"\u95EE\u9898\u63CF\u8FF0",id:"\u95EE\u9898\u63CF\u8FF0",level:2},{value:"\u6392\u67E5\u8FC7\u7A0B",id:"\u6392\u67E5\u8FC7\u7A0B",level:2},{value:"\u9047\u5230\u95EE\u9898\u5148\u67E5\u65E5\u5FD7",id:"\u9047\u5230\u95EE\u9898\u5148\u67E5\u65E5\u5FD7",level:3},{value:"\u914D\u7F6E\u7EC6\u8282\u6392\u67E5",id:"\u914D\u7F6E\u7EC6\u8282\u6392\u67E5",level:3},{value:"hostPID",id:"hostpid",level:4},{value:"lifecycle.postStart",id:"lifecyclepoststart",level:4},{value:"\u76F8\u5173\u8054\u7684docker bug",id:"\u76F8\u5173\u8054\u7684docker-bug",level:3},{value:"docker bug\u590D\u73B0\u8FC7\u7A0B",id:"docker-bug\u590D\u73B0\u8FC7\u7A0B",level:4},{value:"Kubernetes Pod\u7BA1\u7406\u7EC6\u8282",id:"kubernetes-pod\u7BA1\u7406\u7EC6\u8282",level:3},{value:"SyncPod",id:"syncpod",level:4},{value:"\u89E3\u51B3\u95EE\u9898",id:"\u89E3\u51B3\u95EE\u9898",level:2},{value:"\u95EE\u9898\u603B\u7ED3",id:"\u95EE\u9898\u603B\u7ED3",level:2}];function h(e){let n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.h2,{id:"\u95EE\u9898\u63CF\u8FF0",children:"\u95EE\u9898\u63CF\u8FF0"}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"kubernetes"}),"\u7248\u672C\uFF1A",(0,c.jsx)(n.code,{children:"v1.22.5"})]}),"\n",(0,c.jsxs)(n.p,{children:["\u90E8\u5206",(0,c.jsx)(n.code,{children:"Pod"}),"\u5728\u65B0\u7248\u672C\u53D1\u5E03\u540E\u4E00\u76F4\u5904\u4E8E",(0,c.jsx)(n.code,{children:"ContainerCreating"}),"\u72B6\u6001\uFF0C\u7ECF\u8FC7",(0,c.jsx)(n.code,{children:"kubectl delete"}),"\u547D\u4EE4\u5220\u9664\u540E\u4E00\u76F4",(0,c.jsx)(n.code,{children:"Terminating"}),"\u72B6\u6001\u3002"]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(66151).Z+"",width:"3340",height:"1336"})}),"\n",(0,c.jsx)(n.h2,{id:"\u6392\u67E5\u8FC7\u7A0B",children:"\u6392\u67E5\u8FC7\u7A0B"}),"\n",(0,c.jsx)(n.h3,{id:"\u9047\u5230\u95EE\u9898\u5148\u67E5\u65E5\u5FD7",children:"\u9047\u5230\u95EE\u9898\u5148\u67E5\u65E5\u5FD7"}),"\n",(0,c.jsxs)(n.p,{children:["\u9996\u5148\u8FDB\u5165\u5BBF\u4E3B\u673A\uFF0C\u67E5\u770B\u4E09\u4E2A\u65E5\u5FD7\uFF0C\u6309\u7167",(0,c.jsx)(n.code,{children:"pod"}),"\u540D\u79F0\u53CA",(0,c.jsx)(n.code,{children:"imageid"}),"\u8FDB\u884C\u7B5B\u9009\u3002\u5176\u4E2D",(0,c.jsx)(n.code,{children:"pod"}),"\u540D\u79F0\u4E3A",(0,c.jsx)(n.code,{children:"khaos-guardian-bmzsk"})," \uFF0C",(0,c.jsx)(n.code,{children:"imageid"}),"\u4E3A",(0,c.jsx)(n.code,{children:"1da9e4f1-a5d4-40db-b8bc-4db1d27ca458"}),"\u3002"]}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:"kubelet"}),"\u65E5\u5FD7\uFF1A",(0,c.jsx)(n.code,{children:"journalctl -u kubelet | grep khaos-guardian-bmzsk\xa0"}),"\xa0"]}),"\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:"docker"}),"\u65E5\u5FD7\uFF1A",(0,c.jsx)(n.code,{children:"journalctl -u docker | grep 1da9e4f1-a5d4-40db-b8bc-4db1d27ca458"})]}),"\n",(0,c.jsxs)(n.li,{children:["\u7CFB\u7EDF\u65E5\u5FD7\uFF1A",(0,c.jsx)(n.code,{children:"cd /var/log && grep khaos-guardian-bmzsk\xa0 messages"})]}),"\n"]}),"\n",(0,c.jsxs)(n.p,{children:["\u82B1\u8D39\u4E86\u4E0D\u5C11\u65F6\u95F4\u68C0\u7D22\u65E5\u5FD7\uFF0C",(0,c.jsx)(n.strong,{children:"\u5B9E\u9645\u4E0A\u6CA1\u6709\u627E\u5230\u4EFB\u4F55\u6709\u7528\u7684\u4FE1\u606F"}),"\u3002"]}),"\n",(0,c.jsx)(n.h3,{id:"\u914D\u7F6E\u7EC6\u8282\u6392\u67E5",children:"\u914D\u7F6E\u7EC6\u8282\u6392\u67E5"}),"\n",(0,c.jsxs)(n.p,{children:["\u6211\u4EEC\u53EF\u4EE5\u770B\u5230\u6574\u4E2A\u96C6\u7FA4\u53EA\u6709\u8FD9\u4E2A",(0,c.jsx)(n.code,{children:"daemonset"}),"\u7684",(0,c.jsx)(n.code,{children:"pod"}),"\u51FA\u73B0\u8FC7\u8FD9\u4E2A\u95EE\u9898\uFF0C\u5176\u4ED6\u7684",(0,c.jsx)(n.code,{children:"pod"}),"\u6CA1\u6709\u51FA\u73B0\uFF0C\u90A3\u4E48\u53EF\u80FD\u95EE\u9898\u51FA\u5728\u8FD9\u4E2A",(0,c.jsx)(n.code,{children:"daemonset"}),"\u7684\u67D0\u4E9B\u914D\u7F6E\u5F15\u53D1\u7684\u8FD9\u4E2A\u95EE\u9898\u3002\u4F46\u8FD9\u4E2A",(0,c.jsx)(n.code,{children:"daemonset"}),"\u7684\u914D\u7F6E\u6BD4\u8F83\u590D\u6742\uFF0C\u5E76\u4E14\u5305\u542B",(0,c.jsx)(n.code,{children:"4"}),"\u4E2A",(0,c.jsx)(n.code,{children:"container"}),"\uFF0C\u6240\u4EE5\u8FD9\u5757\u6392\u67E5\u8D77\u6765\u5F88\u5403\u529B\uFF0C\u4E5F\u6BD4\u8F83\u6D6A\u8D39\u65F6\u95F4\u3002\u7ECF\u8FC7\u7EC6\u8282\u7684\u68B3\u7406\uFF0C\u4EE5\u53CA\u56E2\u961F\u5185\u90E8\u540C\u5B66\u7684\u534F\u4F5C\uFF0C\u6211\u4EEC\u6700\u7EC8\u53D1\u73B0\u662F\u6709\u4E24\u4E2A\u914D\u7F6E\u9879\u5F15\u53D1\u7684\u95EE\u9898\u3002"]}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsx)(n.li,{children:(0,c.jsx)(n.code,{children:"hostPID"})}),"\n",(0,c.jsx)(n.li,{children:(0,c.jsx)(n.code,{children:"lifecycle.postStart"})}),"\n"]}),"\n",(0,c.jsx)(n.h4,{id:"hostpid",children:"hostPID"}),"\n",(0,c.jsxs)(n.p,{children:["\u5B98\u65B9\u6587\u6863\uFF1A",(0,c.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/security/pod-security-standards/",children:"https://kubernetes.io/docs/concepts/security/pod-security-standards/"})]}),"\n",(0,c.jsxs)(n.p,{children:["\u914D\u7F6E\u5230",(0,c.jsx)(n.code,{children:"pod spec"}),"\u4E2D\uFF0C\u7528\u4E8E\u8BA9",(0,c.jsx)(n.code,{children:"Pod"}),"\u4E2D\u7684\u6240\u6709\u5BB9\u5668\u611F\u77E5\u5BBF\u4E3B\u673A\u7684\u8FDB\u7A0B\u4FE1\u606F\uFF0C\u5E76\u4E14\u6267\u884C\u8FDB\u7A0B\u7BA1\u7406\u3002"]}),"\n",(0,c.jsxs)(n.p,{children:["\u6B64\u5916\uFF0C\u76F8\u5173\u8054\u7684\u8FD8\u6709\u4E00\u4E2A",(0,c.jsx)(n.code,{children:"shareProcessNamespace"}),"\u914D\u7F6E\uFF0C\u4E5F\u662F\u914D\u7F6E\u5230",(0,c.jsx)(n.code,{children:"pod spec"}),"\u4E2D\uFF0C\u7528\u4E8E\u5355",(0,c.jsx)(n.code,{children:"pod"}),"\u591A",(0,c.jsx)(n.code,{children:"container"}),"\u573A\u666F\u4E0B\u8BA9",(0,c.jsx)(n.code,{children:"pod"}),"\u4E0B\u7684",(0,c.jsx)(n.code,{children:"container"}),"\u76F8\u4E92\u611F\u77E5",(0,c.jsx)(n.code,{children:"pid"}),"\uFF0C\u5177\u4F53\u4ECB\u7ECD\uFF1A",(0,c.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/",children:"https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/"})]}),"\n",(0,c.jsx)(n.h4,{id:"lifecyclepoststart",children:"lifecycle.postStart"}),"\n",(0,c.jsxs)(n.p,{children:["\u7528\u4E8E\u5728\u6307\u5B9A",(0,c.jsx)(n.code,{children:"container"}),"\u6210\u529F",(0,c.jsx)(n.code,{children:"Running"}),"\u540E\u6267\u884C\u4E00\u4E9B\u81EA\u5B9A\u4E49\u811A\u672C\uFF0C\u5177\u4F53\u4ECB\u7ECD\uFF1A",(0,c.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",children:"https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/"})]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(69779).Z+"",width:"2004",height:"726"})}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(85988).Z+"",width:"2060",height:"1120"})}),"\n",(0,c.jsx)(n.h3,{id:"\u76F8\u5173\u8054\u7684docker-bug",children:"\u76F8\u5173\u8054\u7684docker bug"}),"\n",(0,c.jsxs)(n.p,{children:["\u8FD9\u91CC\u4E0E",(0,c.jsx)(n.code,{children:"hostPID/shareProcessNamespace"}),"\u76F8\u5173\u7684\u6709\u4E00\u4E2A",(0,c.jsx)(n.code,{children:"docker"}),"\u7684",(0,c.jsx)(n.code,{children:"bug"}),"\uFF1A",(0,c.jsx)(n.a,{href:"https://github.com/kubernetes/kubernetes/issues/92214",children:"https://github.com/kubernetes/kubernetes/issues/92214"})]}),"\n",(0,c.jsxs)(n.p,{children:["\u5F53\u5F00\u542F\u8FDB\u7A0B\u4FE1\u606F\u5171\u4EAB\u65F6\uFF0C\u5982\u679C\u5BF9",(0,c.jsx)(n.code,{children:"docker"}),"\u5BB9\u5668\u6267\u884C",(0,c.jsx)(n.code,{children:"exec"}),"\u547D\u4EE4\uFF0C\u5E76\u4E14",(0,c.jsx)(n.code,{children:"docker"}),"\u5BB9\u5668\u5148\u4E8E",(0,c.jsx)(n.code,{children:"exec"}),"\u8FDB\u7A0B\u9000\u51FA\uFF0C\u90A3\u4E48\u6B64\u65F6",(0,c.jsx)(n.code,{children:"exec"}),"\u7684\u6267\u884C\u4F1A\u5361\u4F4F\u3002"]}),"\n",(0,c.jsx)(n.h4,{id:"docker-bug\u590D\u73B0\u8FC7\u7A0B",children:"docker bug\u590D\u73B0\u8FC7\u7A0B"}),"\n",(0,c.jsxs)(n.p,{children:["\u901A\u8FC7",(0,c.jsx)(n.code,{children:"docker run"}),"\u8FD0\u884C\u4E00\u4E2A\u5BB9\u5668\uFF1A"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"docker run -d --pid=host --rm --name nginx nginx\n"})}),"\n",(0,c.jsxs)(n.p,{children:["\u5728\u53E6\u4E00\u4E2A\u7EC8\u7AEF\u6267\u884C",(0,c.jsx)(n.code,{children:"docker exec"}),"\u6307\u4EE4\uFF1A"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"docker exec -it nginx sh\n"})}),"\n",(0,c.jsxs)(n.p,{children:["\u968F\u540E",(0,c.jsx)(n.code,{children:"kill"}),"\u5BB9\u5668\uFF1A"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"docker kill nginx\n"})}),"\n",(0,c.jsxs)(n.p,{children:["\u53EF\u4EE5\u770B\u5230\u5F53",(0,c.jsx)(n.code,{children:"kill"}),"\u6389\u5BB9\u5668\u540E\uFF0C\u5BF9\u5E94\u7684",(0,c.jsx)(n.code,{children:"exec"}),"\u8FDB\u7A0B\u6B64\u65F6\u5361\u4F4F\u4E86\uFF0C\u65E0\u6CD5\u9000\u51FA\uFF0C\u53EA\u80FD\u5F3A\u884C\u5173\u95ED\u7EC8\u7AEF\u89E3\u51B3\u3002\xa0"]}),"\n",(0,c.jsx)(n.h3,{id:"kubernetes-pod\u7BA1\u7406\u7EC6\u8282",children:"Kubernetes Pod\u7BA1\u7406\u7EC6\u8282"}),"\n",(0,c.jsxs)(n.p,{children:["\u5982\u679C\u60F3\u8981\u4E86\u89E3\u8FD9\u4E2A",(0,c.jsx)(n.code,{children:"docker bug"}),"\u5BF9",(0,c.jsx)(n.code,{children:"pod"}),"\u751F\u547D\u5468\u671F\u7684\u5F71\u54CD\uFF0C\u6211\u4EEC\u6765\u770B\u770B",(0,c.jsx)(n.code,{children:"kubernetes"}),"\u6E90\u7801\u4E2D\u7684",(0,c.jsx)(n.code,{children:"pod"}),"\u521B\u5EFA\u6D41\u7A0B\u3002\u9996\u5148\u4E86\u89E3\u4E00\u4E2A\u80CC\u666F\uFF0C",(0,c.jsx)(n.code,{children:"kubernetes"}),"\u7684\u6BCF\u4E00\u4E2A",(0,c.jsx)(n.code,{children:"pod"}),"\u5728",(0,c.jsx)(n.code,{children:"kubelet"}),"\u4E2D\u90FD\u5BF9\u5E94\u6709\u4E00\u4E2A",(0,c.jsx)(n.code,{children:"goroutine"}),"\u4E00\u4E00\u5BF9\u5E94\u6765\u7BA1\u7406\u7EF4\u62A4\u5176",(0,c.jsx)(n.code,{children:"reconcile"}),"\uFF0C\u5373\u4EFB\u4F55",(0,c.jsx)(n.code,{children:"pod spec"}),"\u7684\u53D8\u66F4\u6216\u8005\u5BBF\u4E3B\u673A",(0,c.jsx)(n.code,{children:"container status"}),"\u7684\u53D8\u5316\u90FD\u7531\u8BE5",(0,c.jsx)(n.code,{children:"goroutine"}),"\u6765\u4FDD\u8BC1\u6267\u884C\u548C\u540C\u6B65\u3002"]}),"\n",(0,c.jsx)(n.h4,{id:"syncpod",children:"SyncPod"}),"\n",(0,c.jsxs)(n.p,{children:["\u6BCF\u5F53",(0,c.jsx)(n.code,{children:"Pod Spec"}),"\u53D8\u5316\u65F6\uFF0C\u4F8B\u5982\u521B\u5EFA\u65F6\uFF0C\u4F1A\u6309\u7167",(0,c.jsx)(n.code,{children:"EphemeralContainers\u3001InitContainers\u3001Containers"}),"\u4F9D\u6B21\u6267\u884C\u5BB9\u5668\u521B\u5EFA\u3002\u5177\u4F53\u53C2\u8003\uFF1A",(0,c.jsx)(n.a,{href:"https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L1048",children:"https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L1048"})]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(9068).Z+"",width:"3840",height:"2110"})}),"\n",(0,c.jsxs)(n.p,{children:["::: tip\n\u8FD9\u79CD\u521B\u5EFA\u867D\u7136\u5728",(0,c.jsx)(n.code,{children:"kubernetes"}),"\u4E2D\u662F\u987A\u5E8F\u6267\u884C\u7684\uFF0C\u4F46\u662F\u5BBF\u4E3B\u673A\u7684\u5BB9\u5668\u542F\u52A8\u6210\u529F\u5374\u662F\u5F02\u6B65\u7684\uFF0C\u4E0D\u80FD\u4FDD\u8BC1\u987A\u5E8F\u6027\u3002\n\u6709\u7684\u5BB9\u5668\u53EF\u80FD\u5728\u6700\u5F00\u59CB\u6267\u884C\u521B\u5EFA\uFF0C\u4F46\u662F\u53EF\u80FD\u5728\u6700\u540E\u624D\u8FD0\u884C\u6210\u529F\u3002\n:::"]}),"\n",(0,c.jsxs)(n.p,{children:["\u4F46\u662F\uFF0C\u5982\u679C\u5BB9\u5668\u4E2D\u5B58\u5728",(0,c.jsx)(n.code,{children:"PostStart"}),"\u811A\u672C\uFF0C\u90A3\u4E48\u5C06\u4F1A\u963B\u585E\u540E\u7EED\u5BB9\u5668\u7684\u521B\u5EFA\uFF0C\u9700\u8981\u7B49\u5F85",(0,c.jsx)(n.code,{children:"PostStart"}),"\u811A\u672C\u6267\u884C\u5B8C\u6210\u540E\u624D\u4F1A\u7EE7\u7EED\u6267\u884C\u3002\u5177\u4F53\u53C2\u8003\uFF1A",(0,c.jsx)(n.a,{href:"https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_container.go#L297",children:"https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_container.go#L297"})]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(35655).Z+"",width:"3456",height:"2018"})}),"\n",(0,c.jsxs)(n.p,{children:["\u5982\u679C\u5E95\u5C42\u662F",(0,c.jsx)(n.code,{children:"docker"}),"\uFF0C\u90A3\u4E48\u8FD9\u91CC\u4F7F\u7528\u7684\u4FBF\u6B63\u662F",(0,c.jsx)(n.code,{children:"docker exec"}),"\u547D\u4EE4\u6765\u5B9E\u73B0\u7684",(0,c.jsx)(n.code,{children:"PostStart"}),"\u81EA\u5B9A\u4E49\u811A\u672C\u6267\u884C\u3002"]}),"\n",(0,c.jsx)(n.h2,{id:"\u89E3\u51B3\u95EE\u9898",children:"\u89E3\u51B3\u95EE\u9898"}),"\n",(0,c.jsxs)(n.p,{children:["\u627E\u5230\u95EE\u9898\u6839\u56E0\u540E\uFF0C\u89E3\u51B3\u76EE\u524D\u96C6\u7FA4\u4E2D",(0,c.jsx)(n.code,{children:"Terminating"}),"\u7684",(0,c.jsx)(n.code,{children:"Pod"}),"\u5C31\u6BD4\u8F83\u7B80\u5355\u4E86\u3002"]}),"\n",(0,c.jsxs)(n.p,{children:["step1\uFF1A\u68C0\u7D22\u51FA",(0,c.jsx)(n.code,{children:"Terminating"}),"\u7684",(0,c.jsx)(n.code,{children:"Pod"})]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"kubectl get pod -n xxx -owide | grep Terminating\n"})}),"\n",(0,c.jsxs)(n.p,{children:["step2\uFF1A\u8FDB\u5165\u5BBF\u4E3B\u673A\u5E72\u6389",(0,c.jsx)(n.code,{children:"docker"}),"\u5BB9\u5668"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"kubectl node-shell x.x.x.x\ndocker ps -a | grep xxx\ndocker rm -f xxx\nexit\n"})}),"\n",(0,c.jsxs)(n.p,{children:["step3\uFF1A\u9000\u51FA\u5BBF\u4E3B\u673A\uFF0C\u5F3A\u5220\u5BF9\u5E94\u7684",(0,c.jsx)(n.code,{children:"Pod"})]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-bash",children:"kubectl delete -n xxx pod/xxx --force\n"})}),"\n",(0,c.jsx)(n.p,{children:"\u64CD\u4F5C\u8BB0\u5F55\uFF1A"}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(35423).Z+"",width:"3640",height:"896"})}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{src:s(66272).Z+"",width:"3468",height:"824"})}),"\n",(0,c.jsx)(n.h2,{id:"\u95EE\u9898\u603B\u7ED3",children:"\u95EE\u9898\u603B\u7ED3"}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:["\n",(0,c.jsxs)(n.p,{children:["\u5C3D\u91CF\u4E0D\u8981\u4F7F\u7528",(0,c.jsx)(n.code,{children:"docker"}),"\u4F5C\u4E3A\u5E95\u5C42\u5BB9\u5668\u7BA1\u7406\u5DE5\u5177\u3002"]}),"\n"]}),"\n",(0,c.jsxs)(n.li,{children:["\n",(0,c.jsxs)(n.p,{children:["\u5C3D\u91CF\u4E0D\u8981\u5728",(0,c.jsx)(n.code,{children:"pod"}),"\u4E2D\u4F7F\u7528",(0,c.jsx)(n.code,{children:"postStart"}),"\u81EA\u5B9A\u4E49\u811A\u672C\u3002"]}),"\n"]}),"\n"]})]})}function a(e={}){let{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(h,{...e})}):h(e)}},66151:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_16-33-32-eaccdaade3af0479beec4b47a2bdaa07.png"},85988:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_16-36-18-444ed507d2ff882eed8952432d35ec40.png"},66272:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_16-42-9-f8bce419f53fa82dd9d97e5c322b1a65.png"},35423:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_16-43-36-82d8945eead1b75a27b7b3bbd0d7c3eb.png"},35655:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_17-59-57-de15d0ccc808d0b7f2a3e62ea0bdd49e.png"},69779:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_17-9-27-28b9e14635ac1939a6d0509649a2b5a4.png"},9068:function(e,n,s){s.d(n,{Z:function(){return d}});let d=s.p+"assets/images/image-2024-4-16_18-2-48-36457b4992d73e3ac2280f5ba754f446.png"},50065:function(e,n,s){s.d(n,{Z:function(){return t},a:function(){return r}});var d=s(67294);let c={},i=d.createContext(c);function r(e){let n=d.useContext(i);return d.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:r(e.components),d.createElement(i.Provider,{value:n},e.children)}}}]);