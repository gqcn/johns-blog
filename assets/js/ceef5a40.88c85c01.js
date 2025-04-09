"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["4275"],{49148:function(e,n,i){i.r(n),i.d(n,{metadata:()=>d,contentTitle:()=>r,default:()=>a,assets:()=>h,toc:()=>o,frontMatter:()=>c});var d=JSON.parse('{"id":"docs/\u4E91\u539F\u751F/\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4","title":"\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4","description":"\u672C\u6587\u8BE6\u7EC6\u4ECB\u7ECD\u4E86\u5982\u4F55\u4F7F\u7528Kind\u5DE5\u5177\u5FEB\u901F\u642D\u5EFAKubernetes\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4\uFF0C\u5305\u62ECKind\u7684\u5B89\u88C5\u914D\u7F6E\u3001\u57FA\u672C\u4F7F\u7528\u65B9\u6CD5\u4EE5\u53CA\u5E38\u89C1\u95EE\u9898\u89E3\u51B3\u65B9\u6848\uFF0C\u5E2E\u52A9\u5F00\u53D1\u8005\u5728\u672C\u5730\u9AD8\u6548\u8FDB\u884CKubernetes\u5E94\u7528\u5F00\u53D1\u548C\u6D4B\u8BD5\u3002","source":"@site/docs/docs/3000-\u4E91\u539F\u751F/3000-\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4.md","sourceDirName":"docs/3000-\u4E91\u539F\u751F","slug":"/cloud-native/kubernetes-kind","permalink":"/cloud-native/kubernetes-kind","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3000,"frontMatter":{"slug":"/cloud-native/kubernetes-kind","title":"\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4","hide_title":true,"keywords":["Kubernetes","Kind","\u672C\u5730\u96C6\u7FA4","\u6D4B\u8BD5\u73AF\u5883","Docker","\u5BB9\u5668","k8s","minikube","\u4E91\u539F\u751F","\u5F00\u53D1\u73AF\u5883"],"description":"\u672C\u6587\u8BE6\u7EC6\u4ECB\u7ECD\u4E86\u5982\u4F55\u4F7F\u7528Kind\u5DE5\u5177\u5FEB\u901F\u642D\u5EFAKubernetes\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4\uFF0C\u5305\u62ECKind\u7684\u5B89\u88C5\u914D\u7F6E\u3001\u57FA\u672C\u4F7F\u7528\u65B9\u6CD5\u4EE5\u53CA\u5E38\u89C1\u95EE\u9898\u89E3\u51B3\u65B9\u6848\uFF0C\u5E2E\u52A9\u5F00\u53D1\u8005\u5728\u672C\u5730\u9AD8\u6548\u8FDB\u884CKubernetes\u5E94\u7528\u5F00\u53D1\u548C\u6D4B\u8BD5\u3002"},"sidebar":"mainSidebar","previous":{"title":"Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4","permalink":"/cloud-native/docker-containerd-commands"},"next":{"title":"\u53EF\u89C2\u6D4B\u6027","permalink":"/observability"}}'),s=i("85893"),l=i("50065");let c={slug:"/cloud-native/kubernetes-kind",title:"\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4",hide_title:!0,keywords:["Kubernetes","Kind","\u672C\u5730\u96C6\u7FA4","\u6D4B\u8BD5\u73AF\u5883","Docker","\u5BB9\u5668","k8s","minikube","\u4E91\u539F\u751F","\u5F00\u53D1\u73AF\u5883"],description:"\u672C\u6587\u8BE6\u7EC6\u4ECB\u7ECD\u4E86\u5982\u4F55\u4F7F\u7528Kind\u5DE5\u5177\u5FEB\u901F\u642D\u5EFAKubernetes\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4\uFF0C\u5305\u62ECKind\u7684\u5B89\u88C5\u914D\u7F6E\u3001\u57FA\u672C\u4F7F\u7528\u65B9\u6CD5\u4EE5\u53CA\u5E38\u89C1\u95EE\u9898\u89E3\u51B3\u65B9\u6848\uFF0C\u5E2E\u52A9\u5F00\u53D1\u8005\u5728\u672C\u5730\u9AD8\u6548\u8FDB\u884CKubernetes\u5E94\u7528\u5F00\u53D1\u548C\u6D4B\u8BD5\u3002"},r=void 0,h={},o=[{value:"1. Kind\u7B80\u4ECB",id:"1-kind\u7B80\u4ECB",level:2},{value:"1.1 Kind\u7684\u4E3B\u8981\u7279\u70B9",id:"11-kind\u7684\u4E3B\u8981\u7279\u70B9",level:3},{value:"2. Kind\u4E0EMinikube\u7684\u5BF9\u6BD4",id:"2-kind\u4E0Eminikube\u7684\u5BF9\u6BD4",level:2},{value:"2.1 \u4F55\u65F6\u9009\u62E9Kind",id:"21-\u4F55\u65F6\u9009\u62E9kind",level:3},{value:"2.2 \u4F55\u65F6\u9009\u62E9Minikube",id:"22-\u4F55\u65F6\u9009\u62E9minikube",level:3},{value:"3. Kind\u7684\u5B89\u88C5\u548C\u914D\u7F6E",id:"3-kind\u7684\u5B89\u88C5\u548C\u914D\u7F6E",level:2},{value:"3.1 \u524D\u63D0\u6761\u4EF6",id:"31-\u524D\u63D0\u6761\u4EF6",level:3},{value:"3.2 \u5B89\u88C5Kind",id:"32-\u5B89\u88C5kind",level:3},{value:"macOS\u5B89\u88C5",id:"macos\u5B89\u88C5",level:4},{value:"Linux\u5B89\u88C5",id:"linux\u5B89\u88C5",level:4},{value:"Windows\u5B89\u88C5",id:"windows\u5B89\u88C5",level:4},{value:"3.3 \u9A8C\u8BC1\u5B89\u88C5",id:"33-\u9A8C\u8BC1\u5B89\u88C5",level:3},{value:"4. Kind\u7684\u57FA\u672C\u4F7F\u7528",id:"4-kind\u7684\u57FA\u672C\u4F7F\u7528",level:2},{value:"4.1 \u521B\u5EFA\u96C6\u7FA4",id:"41-\u521B\u5EFA\u96C6\u7FA4",level:3},{value:"4.2 \u4F7F\u7528\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u81EA\u5B9A\u4E49\u96C6\u7FA4",id:"42-\u4F7F\u7528\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u81EA\u5B9A\u4E49\u96C6\u7FA4",level:3},{value:"4.3 \u67E5\u770B\u96C6\u7FA4",id:"43-\u67E5\u770B\u96C6\u7FA4",level:3},{value:"4.4 \u914D\u7F6Ekubectl\u8BBF\u95EE\u96C6\u7FA4",id:"44-\u914D\u7F6Ekubectl\u8BBF\u95EE\u96C6\u7FA4",level:3},{value:"4.5 \u52A0\u8F7D\u672C\u5730Docker\u955C\u50CF\u5230Kind\u96C6\u7FA4",id:"45-\u52A0\u8F7D\u672C\u5730docker\u955C\u50CF\u5230kind\u96C6\u7FA4",level:3},{value:"4.6 \u5220\u9664\u96C6\u7FA4",id:"46-\u5220\u9664\u96C6\u7FA4",level:3},{value:"5. \u9AD8\u7EA7\u914D\u7F6E\u793A\u4F8B",id:"5-\u9AD8\u7EA7\u914D\u7F6E\u793A\u4F8B",level:2},{value:"5.1 \u914D\u7F6E\u7AEF\u53E3\u6620\u5C04",id:"51-\u914D\u7F6E\u7AEF\u53E3\u6620\u5C04",level:3},{value:"5.2 \u6302\u8F7D\u4E3B\u673A\u76EE\u5F55",id:"52-\u6302\u8F7D\u4E3B\u673A\u76EE\u5F55",level:3},{value:"5.3 \u914D\u7F6E\u96C6\u7FA4\u7F51\u7EDC",id:"53-\u914D\u7F6E\u96C6\u7FA4\u7F51\u7EDC",level:3},{value:"6. \u5E38\u89C1\u95EE\u9898\u53CA\u89E3\u51B3\u65B9\u6848",id:"6-\u5E38\u89C1\u95EE\u9898\u53CA\u89E3\u51B3\u65B9\u6848",level:2},{value:"6.1 \u955C\u50CF\u62C9\u53D6\u5931\u8D25",id:"61-\u955C\u50CF\u62C9\u53D6\u5931\u8D25",level:3},{value:"6.1.1 \u914D\u7F6EDocker\u56FD\u5185\u955C\u50CF\u6E90",id:"611-\u914D\u7F6Edocker\u56FD\u5185\u955C\u50CF\u6E90",level:4},{value:"6.1.2 \u4F7F\u7528\u81EA\u5B9A\u4E49\u955C\u50CF",id:"612-\u4F7F\u7528\u81EA\u5B9A\u4E49\u955C\u50CF",level:4},{value:"6.2 \u8D44\u6E90\u4E0D\u8DB3",id:"62-\u8D44\u6E90\u4E0D\u8DB3",level:3},{value:"6.3 \u7F51\u7EDC\u95EE\u9898",id:"63-\u7F51\u7EDC\u95EE\u9898",level:3},{value:"6.4 \u96C6\u7FA4\u521B\u5EFA\u5931\u8D25",id:"64-\u96C6\u7FA4\u521B\u5EFA\u5931\u8D25",level:3},{value:"6.5 kubectl\u65E0\u6CD5\u8FDE\u63A5\u5230\u96C6\u7FA4",id:"65-kubectl\u65E0\u6CD5\u8FDE\u63A5\u5230\u96C6\u7FA4",level:3},{value:"7. \u5B9E\u7528\u6280\u5DE7",id:"7-\u5B9E\u7528\u6280\u5DE7",level:2},{value:"7.1 \u5728CI/CD\u4E2D\u4F7F\u7528Kind",id:"71-\u5728cicd\u4E2D\u4F7F\u7528kind",level:3},{value:"7.2 \u4F7F\u7528Helm\u4E0EKind",id:"72-\u4F7F\u7528helm\u4E0Ekind",level:3},{value:"7.3 \u4F7F\u7528Ingress\u4E0EKind",id:"73-\u4F7F\u7528ingress\u4E0Ekind",level:3},{value:"8. \u603B\u7ED3",id:"8-\u603B\u7ED3",level:2}];function t(e){let n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,l.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"1-kind\u7B80\u4ECB",children:"1. Kind\u7B80\u4ECB"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"\u4F7F\u7528Kubernetes Kind\u642D\u5EFA\u672C\u5730\u6D4B\u8BD5\u96C6\u7FA4",src:i(54342).Z+"",width:"2560",height:"1440"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"})," (",(0,s.jsx)(n.code,{children:"Kubernetes IN Docker"}),") \u662F\u4E00\u4E2A\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Docker"}),"\u5BB9\u5668\u4F5C\u4E3A\u8282\u70B9\u6765\u8FD0\u884C\u672C\u5730",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u96C6\u7FA4\u7684\u5DE5\u5177\u3002\u5B83\u4E3B\u8981\u7528\u4E8E",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u81EA\u8EAB\u7684\u6D4B\u8BD5\uFF0C\u4F46\u4E5F\u662F\u5728\u672C\u5730\u5FEB\u901F\u521B\u5EFA\u548C\u6D4B\u8BD5",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u96C6\u7FA4\u7684\u7EDD\u4F73\u9009\u62E9\u3002",(0,s.jsx)(n.code,{children:"Kind"}),"\u662F",(0,s.jsx)(n.code,{children:"CNCF"}),"\uFF08",(0,s.jsx)(n.code,{children:"Cloud Native Computing Foundation"}),"\uFF09\u7684\u4E00\u4E2A\u8BA4\u8BC1\u9879\u76EE\uFF0C\u7531",(0,s.jsx)(n.code,{children:"Kubernetes SIG (Special Interest Group) Testing"}),"\u56E2\u961F\u5F00\u53D1\u548C\u7EF4\u62A4\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u76F8\u5173\u94FE\u63A5\uFF1A"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\u4ED3\u5E93\u5730\u5740\uFF1A",(0,s.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kind",children:"https://github.com/kubernetes-sigs/kind"})]}),"\n",(0,s.jsxs)(n.li,{children:["\u5B98\u7F51\u5730\u5740\uFF1A",(0,s.jsx)(n.a,{href:"https://kind.sigs.k8s.io/",children:"https://kind.sigs.k8s.io/"})]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"11-kind\u7684\u4E3B\u8981\u7279\u70B9",children:"1.1 Kind\u7684\u4E3B\u8981\u7279\u70B9"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u8F7B\u91CF\u7EA7"}),"\uFF1A\u76F8\u6BD4\u4E8E\u4F20\u7EDF\u7684\u865A\u62DF\u673A\u65B9\u6848\uFF0C",(0,s.jsx)(n.code,{children:"Kind"}),"\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Docker"}),"\u5BB9\u5668\u4F5C\u4E3A",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u8282\u70B9\uFF0C\u8D44\u6E90\u6D88\u8017\u66F4\u5C11\uFF0C\u542F\u52A8\u66F4\u5FEB\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u591A\u8282\u70B9\u652F\u6301"}),"\uFF1A\u53EF\u4EE5\u8F7B\u677E\u521B\u5EFA\u5305\u542B\u591A\u4E2A\u63A7\u5236\u5E73\u9762\u548C\u5DE5\u4F5C\u8282\u70B9\u7684\u96C6\u7FA4\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u8DE8\u5E73\u53F0"}),"\uFF1A\u652F\u6301",(0,s.jsx)(n.code,{children:"Linux"}),"\u3001",(0,s.jsx)(n.code,{children:"macOS"}),"\u548C",(0,s.jsx)(n.code,{children:"Windows"}),"\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u53EF\u914D\u7F6E\u6027"}),"\uFF1A\u63D0\u4F9B\u4E30\u5BCC\u7684\u914D\u7F6E\u9009\u9879\uFF0C\u53EF\u4EE5\u6839\u636E\u9700\u8981\u5B9A\u5236\u96C6\u7FA4\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u5FEB\u901F"}),"\uFF1A\u96C6\u7FA4\u521B\u5EFA\u548C\u9500\u6BC1\u901F\u5EA6\u5FEB\uFF0C\u975E\u5E38\u9002\u5408",(0,s.jsx)(n.code,{children:"CI/CD"}),"\u73AF\u5883\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"\u63A5\u8FD1\u751F\u4EA7\u73AF\u5883"}),"\uFF1A\u63D0\u4F9B\u4E86\u4E0E\u751F\u4EA7\u73AF\u5883\u66F4\u76F8\u4F3C\u7684\u591A\u8282\u70B9",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u4F53\u9A8C\u3002"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"2-kind\u4E0Eminikube\u7684\u5BF9\u6BD4",children:"2. Kind\u4E0EMinikube\u7684\u5BF9\u6BD4"}),"\n",(0,s.jsxs)(n.p,{children:["\u5728\u9009\u62E9\u672C\u5730",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u6D4B\u8BD5\u5DE5\u5177\u65F6\uFF0C",(0,s.jsx)(n.code,{children:"Kind"}),"\u548C",(0,s.jsx)(n.code,{children:"Minikube"}),"\u662F\u4E24\u4E2A\u5E38\u89C1\u7684\u9009\u62E9\u3002\u4E0B\u9762\u662F\u5B83\u4EEC\u7684\u4E3B\u8981\u533A\u522B\uFF1A"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"\u7279\u6027"}),(0,s.jsx)(n.th,{children:(0,s.jsx)(n.code,{children:"Kind"})}),(0,s.jsx)(n.th,{children:(0,s.jsx)(n.code,{children:"Minikube"})})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u5E95\u5C42\u6280\u672F"}),(0,s.jsxs)(n.td,{children:["\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Docker"}),"\u5BB9\u5668\u4F5C\u4E3A",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u8282\u70B9"]}),(0,s.jsxs)(n.td,{children:["\u4F7F\u7528\u865A\u62DF\u673A\uFF08\u5982",(0,s.jsx)(n.code,{children:"VirtualBox"}),"\u3001",(0,s.jsx)(n.code,{children:"HyperKit"}),"\uFF09\u6216\u5BB9\u5668"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u8D44\u6E90\u6D88\u8017"}),(0,s.jsx)(n.td,{children:"\u8F83\u4F4E\uFF0C\u9002\u5408\u8D44\u6E90\u53D7\u9650\u7684\u73AF\u5883"}),(0,s.jsx)(n.td,{children:"\u8F83\u9AD8\uFF0C\u7279\u522B\u662F\u4F7F\u7528\u865A\u62DF\u673A\u65F6"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u591A\u8282\u70B9\u652F\u6301"}),(0,s.jsx)(n.td,{children:"\u539F\u751F\u652F\u6301\u591A\u8282\u70B9\u96C6\u7FA4"}),(0,s.jsx)(n.td,{children:"\u4E3B\u8981\u8BBE\u8BA1\u4E3A\u5355\u8282\u70B9\uFF0C\u867D\u7136\u4E5F\u652F\u6301\u591A\u8282\u70B9"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u542F\u52A8\u901F\u5EA6"}),(0,s.jsx)(n.td,{children:"\u975E\u5E38\u5FEB"}),(0,s.jsx)(n.td,{children:"\u76F8\u5BF9\u8F83\u6162\uFF0C\u7279\u522B\u662F\u4F7F\u7528\u865A\u62DF\u673A\u65F6"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u9644\u52A0\u529F\u80FD"}),(0,s.jsxs)(n.td,{children:["\u4E13\u6CE8\u4E8E\u63D0\u4F9B\u7EAF",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u73AF\u5883"]}),(0,s.jsx)(n.td,{children:"\u5185\u7F6E\u66F4\u591A\u63D2\u4EF6\u548C\u9644\u52A0\u529F\u80FD"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u7528\u9014"}),(0,s.jsxs)(n.td,{children:["\u9002\u5408\u5F00\u53D1\u6D4B\u8BD5\u548C",(0,s.jsx)(n.code,{children:"CI/CD"}),"\u73AF\u5883"]}),(0,s.jsx)(n.td,{children:"\u9002\u5408\u5B66\u4E60\u548C\u672C\u5730\u5F00\u53D1"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"\u6210\u719F\u5EA6"}),(0,s.jsx)(n.td,{children:"\u76F8\u5BF9\u8F83\u65B0\uFF0C\u4F46\u53D1\u5C55\u8FC5\u901F"}),(0,s.jsx)(n.td,{children:"\u66F4\u6210\u719F\uFF0C\u5B58\u5728\u65F6\u95F4\u66F4\u957F"})]})]})]}),"\n",(0,s.jsx)(n.h3,{id:"21-\u4F55\u65F6\u9009\u62E9kind",children:"2.1 \u4F55\u65F6\u9009\u62E9Kind"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u5F53\u4F60\u9700\u8981\u5FEB\u901F\u521B\u5EFA\u548C\u9500\u6BC1\u96C6\u7FA4\u65F6"}),"\n",(0,s.jsxs)(n.li,{children:["\u5F53\u4F60\u9700\u8981\u5728",(0,s.jsx)(n.code,{children:"CI/CD"}),"\u7BA1\u9053\u4E2D\u6D4B\u8BD5",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u5E94\u7528\u65F6"]}),"\n",(0,s.jsx)(n.li,{children:"\u5F53\u4F60\u9700\u8981\u6D4B\u8BD5\u591A\u8282\u70B9\u573A\u666F\u65F6"}),"\n",(0,s.jsx)(n.li,{children:"\u5F53\u4F60\u7684\u8BA1\u7B97\u673A\u8D44\u6E90\u6709\u9650\u65F6"}),"\n",(0,s.jsxs)(n.li,{children:["\u5F53\u4F60\u9700\u8981\u6D4B\u8BD5",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u81EA\u8EAB\u7684\u529F\u80FD\u65F6"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"22-\u4F55\u65F6\u9009\u62E9minikube",children:"2.2 \u4F55\u65F6\u9009\u62E9Minikube"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\u5F53\u4F60\u662F",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u521D\u5B66\u8005\uFF0C\u9700\u8981\u66F4\u591A\u6307\u5BFC\u548C\u5185\u7F6E\u529F\u80FD\u65F6"]}),"\n",(0,s.jsx)(n.li,{children:"\u5F53\u4F60\u9700\u8981\u66F4\u63A5\u8FD1\u751F\u4EA7\u73AF\u5883\u7684\u865A\u62DF\u673A\u9694\u79BB\u65F6"}),"\n",(0,s.jsxs)(n.li,{children:["\u5F53\u4F60\u9700\u8981\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Minikube"}),"\u7279\u6709\u7684\u63D2\u4EF6\u548C\u9644\u52A0\u529F\u80FD\u65F6"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"3-kind\u7684\u5B89\u88C5\u548C\u914D\u7F6E",children:"3. Kind\u7684\u5B89\u88C5\u548C\u914D\u7F6E"}),"\n",(0,s.jsx)(n.h3,{id:"31-\u524D\u63D0\u6761\u4EF6",children:"3.1 \u524D\u63D0\u6761\u4EF6"}),"\n",(0,s.jsxs)(n.p,{children:["\u5728\u5B89\u88C5",(0,s.jsx)(n.code,{children:"Kind"}),"\u4E4B\u524D\uFF0C\u4F60\u9700\u8981\u786E\u4FDD\u5DF2\u7ECF\u5B89\u88C5\u4E86\u4EE5\u4E0B\u8F6F\u4EF6\uFF1A"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"Docker"}),"\uFF1A",(0,s.jsx)(n.code,{children:"Kind"}),"\u4F9D\u8D56",(0,s.jsx)(n.code,{children:"Docker"}),"\u6765\u521B\u5EFA\u5BB9\u5668\u8282\u70B9"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u547D\u4EE4\u884C\u5DE5\u5177\uFF08",(0,s.jsx)(n.code,{children:"kubectl"}),"\uFF09\uFF1A\u7528\u4E8E\u4E0E",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u96C6\u7FA4\u4EA4\u4E92"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"32-\u5B89\u88C5kind",children:"3.2 \u5B89\u88C5Kind"}),"\n",(0,s.jsx)(n.h4,{id:"macos\u5B89\u88C5",children:"macOS\u5B89\u88C5"}),"\n",(0,s.jsxs)(n.p,{children:["\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Homebrew"}),"\u5B89\u88C5\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"brew install kind\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u6216\u8005\u4F7F\u7528\u4E8C\u8FDB\u5236\u6587\u4EF6\u5B89\u88C5\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# \u4E0B\u8F7D\u6700\u65B0\u7248\u672C\u7684Kind\ncurl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.27.0/kind-darwin-amd64\n# \u4F7F\u6587\u4EF6\u53EF\u6267\u884C\nchmod +x ./kind\n# \u79FB\u52A8\u5230PATH\u8DEF\u5F84\u4E0B\nmv ./kind /usr/local/bin/kind\n"})}),"\n",(0,s.jsx)(n.h4,{id:"linux\u5B89\u88C5",children:"Linux\u5B89\u88C5"}),"\n",(0,s.jsx)(n.p,{children:"\u4F7F\u7528\u4E8C\u8FDB\u5236\u6587\u4EF6\u5B89\u88C5\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# \u4E0B\u8F7D\u6700\u65B0\u7248\u672C\u7684Kind\ncurl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.27.0/kind-linux-amd64\n# \u4F7F\u6587\u4EF6\u53EF\u6267\u884C\nchmod +x ./kind\n# \u79FB\u52A8\u5230PATH\u8DEF\u5F84\u4E0B\nsudo mv ./kind /usr/local/bin/kind\n"})}),"\n",(0,s.jsx)(n.h4,{id:"windows\u5B89\u88C5",children:"Windows\u5B89\u88C5"}),"\n",(0,s.jsxs)(n.p,{children:["\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Chocolatey"}),"\u5B89\u88C5\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"choco install kind\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u6216\u8005\u4F7F\u7528\u4E8C\u8FDB\u5236\u6587\u4EF6\u5B89\u88C5\uFF08\u5728",(0,s.jsx)(n.code,{children:"PowerShell"}),"\u4E2D\uFF09\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.27.0/kind-windows-amd64\nmove kind-windows-amd64.exe C:\\some-dir-in-your-PATH\\kind.exe\n"})}),"\n",(0,s.jsx)(n.h3,{id:"33-\u9A8C\u8BC1\u5B89\u88C5",children:"3.3 \u9A8C\u8BC1\u5B89\u88C5"}),"\n",(0,s.jsxs)(n.p,{children:["\u5B89\u88C5\u5B8C\u6210\u540E\uFF0C\u8FD0\u884C\u4EE5\u4E0B\u547D\u4EE4\u9A8C\u8BC1",(0,s.jsx)(n.code,{children:"Kind"}),"\u662F\u5426\u5B89\u88C5\u6210\u529F\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind version\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u5982\u679C\u5B89\u88C5\u6210\u529F\uFF0C\u5C06\u663E\u793A",(0,s.jsx)(n.code,{children:"Kind"}),"\u7684\u7248\u672C\u4FE1\u606F\u3002"]}),"\n",(0,s.jsx)(n.h2,{id:"4-kind\u7684\u57FA\u672C\u4F7F\u7528",children:"4. Kind\u7684\u57FA\u672C\u4F7F\u7528"}),"\n",(0,s.jsx)(n.h3,{id:"41-\u521B\u5EFA\u96C6\u7FA4",children:"4.1 \u521B\u5EFA\u96C6\u7FA4"}),"\n",(0,s.jsx)(n.p,{children:"\u521B\u5EFA\u4E00\u4E2A\u9ED8\u8BA4\u7684\u5355\u8282\u70B9\u96C6\u7FA4\u975E\u5E38\u7B80\u5355\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind create cluster\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u8FD9\u4E2A\u547D\u4EE4\u4F1A\u521B\u5EFA\u4E00\u4E2A\u540D\u4E3A",(0,s.jsx)(n.code,{children:"kind"}),"\u7684\u9ED8\u8BA4\u96C6\u7FA4\u3002\u5982\u679C\u4F60\u60F3\u6307\u5B9A\u96C6\u7FA4\u540D\u79F0\uFF0C\u53EF\u4EE5\u4F7F\u7528",(0,s.jsx)(n.code,{children:"--name"}),"\u53C2\u6570\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind create cluster --name my-cluster\n"})}),"\n",(0,s.jsx)(n.h3,{id:"42-\u4F7F\u7528\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u81EA\u5B9A\u4E49\u96C6\u7FA4",children:"4.2 \u4F7F\u7528\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u81EA\u5B9A\u4E49\u96C6\u7FA4"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"}),"\u652F\u6301\u4F7F\u7528",(0,s.jsx)(n.code,{children:"YAML"}),"\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u81EA\u5B9A\u4E49\u96C6\u7FA4\u3002\u4F8B\u5982\uFF0C\u521B\u5EFA\u4E00\u4E2A\u5305\u542B",(0,s.jsx)(n.code,{children:"1"}),"\u4E2A\u63A7\u5236\u5E73\u9762\u8282\u70B9\u548C",(0,s.jsx)(n.code,{children:"2"}),"\u4E2A\u5DE5\u4F5C\u8282\u70B9\u7684\u96C6\u7FA4\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"# \u4FDD\u5B58\u4E3Akind-config.yaml\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n- role: worker\n- role: worker\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u7136\u540E\u4F7F\u7528\u8FD9\u4E2A\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u96C6\u7FA4\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind create cluster --config kind-config.yaml\n"})}),"\n",(0,s.jsx)(n.h3,{id:"43-\u67E5\u770B\u96C6\u7FA4",children:"4.3 \u67E5\u770B\u96C6\u7FA4"}),"\n",(0,s.jsx)(n.p,{children:"\u521B\u5EFA\u96C6\u7FA4\u540E\uFF0C\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u67E5\u770B\u96C6\u7FA4\u4FE1\u606F\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# \u5217\u51FA\u6240\u6709Kind\u96C6\u7FA4\nkind get clusters\n\n# \u67E5\u770B\u96C6\u7FA4\u8282\u70B9\ndocker ps\n"})}),"\n",(0,s.jsx)(n.h3,{id:"44-\u914D\u7F6Ekubectl\u8BBF\u95EE\u96C6\u7FA4",children:"4.4 \u914D\u7F6Ekubectl\u8BBF\u95EE\u96C6\u7FA4"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"}),"\u4F1A\u81EA\u52A8\u914D\u7F6E",(0,s.jsx)(n.code,{children:"kubectl"}),"\u4EE5\u8BBF\u95EE\u65B0\u521B\u5EFA\u7684\u96C6\u7FA4\u3002\u4F60\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u9A8C\u8BC1\u8FDE\u63A5\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl cluster-info\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u5982\u679C\u4F60\u6709\u591A\u4E2A\u96C6\u7FA4\uFF0C\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u5207\u6362\u5230\u7279\u5B9A\u7684Kind\u96C6\u7FA4\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl cluster-info --context kind-my-cluster\n"})}),"\n",(0,s.jsx)(n.h3,{id:"45-\u52A0\u8F7D\u672C\u5730docker\u955C\u50CF\u5230kind\u96C6\u7FA4",children:"4.5 \u52A0\u8F7D\u672C\u5730Docker\u955C\u50CF\u5230Kind\u96C6\u7FA4"}),"\n",(0,s.jsxs)(n.p,{children:["\u7531\u4E8E",(0,s.jsx)(n.code,{children:"Kind"}),"\u96C6\u7FA4\u8FD0\u884C\u5728",(0,s.jsx)(n.code,{children:"Docker"}),"\u5BB9\u5668\u5185\uFF0C\u5B83\u4E0D\u4F1A\u81EA\u52A8\u8BBF\u95EE\u4F60\u672C\u5730",(0,s.jsx)(n.code,{children:"Docker"}),"\u5B88\u62A4\u8FDB\u7A0B\u4E2D\u7684\u955C\u50CF\u3002\u4F60\u9700\u8981\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u5C06\u672C\u5730\u955C\u50CF\u52A0\u8F7D\u5230",(0,s.jsx)(n.code,{children:"Kind"}),"\u96C6\u7FA4\u4E2D\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind load docker-image my-custom-image:tag --name my-cluster\n"})}),"\n",(0,s.jsx)(n.h3,{id:"46-\u5220\u9664\u96C6\u7FA4",children:"4.6 \u5220\u9664\u96C6\u7FA4"}),"\n",(0,s.jsx)(n.p,{children:"\u5F53\u4F60\u4E0D\u518D\u9700\u8981\u96C6\u7FA4\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u5220\u9664\u5B83\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind delete cluster --name my-cluster\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u5982\u679C\u4E0D\u6307\u5B9A\u540D\u79F0\uFF0C\u5C06\u5220\u9664\u9ED8\u8BA4\u7684",(0,s.jsx)(n.code,{children:"kind"}),"\u96C6\u7FA4\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind delete cluster\n"})}),"\n",(0,s.jsx)(n.h2,{id:"5-\u9AD8\u7EA7\u914D\u7F6E\u793A\u4F8B",children:"5. \u9AD8\u7EA7\u914D\u7F6E\u793A\u4F8B"}),"\n",(0,s.jsx)(n.h3,{id:"51-\u914D\u7F6E\u7AEF\u53E3\u6620\u5C04",children:"5.1 \u914D\u7F6E\u7AEF\u53E3\u6620\u5C04"}),"\n",(0,s.jsx)(n.p,{children:"\u5982\u679C\u4F60\u60F3\u4ECE\u4E3B\u673A\u76F4\u63A5\u8BBF\u95EE\u96C6\u7FA4\u4E2D\u7684\u670D\u52A1\uFF0C\u53EF\u4EE5\u914D\u7F6E\u7AEF\u53E3\u6620\u5C04\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n  extraPortMappings:\n  - containerPort: 30000\n    hostPort: 30000\n    protocol: TCP\n"})}),"\n",(0,s.jsx)(n.h3,{id:"52-\u6302\u8F7D\u4E3B\u673A\u76EE\u5F55",children:"5.2 \u6302\u8F7D\u4E3B\u673A\u76EE\u5F55"}),"\n",(0,s.jsx)(n.p,{children:"\u5C06\u4E3B\u673A\u76EE\u5F55\u6302\u8F7D\u5230Kind\u8282\u70B9\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n  extraMounts:\n  - hostPath: /path/on/host\n    containerPath: /path/in/node\n"})}),"\n",(0,s.jsx)(n.h3,{id:"53-\u914D\u7F6E\u96C6\u7FA4\u7F51\u7EDC",children:"5.3 \u914D\u7F6E\u96C6\u7FA4\u7F51\u7EDC"}),"\n",(0,s.jsxs)(n.p,{children:["\u81EA\u5B9A\u4E49",(0,s.jsx)(n.code,{children:"Pod"}),"\u548C",(0,s.jsx)(n.code,{children:"Service"}),"\u7684",(0,s.jsx)(n.code,{children:"CIDR"}),"\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnetworking:\n  podSubnet: "10.244.0.0/16"\n  serviceSubnet: "10.96.0.0/12"\n'})}),"\n",(0,s.jsx)(n.h2,{id:"6-\u5E38\u89C1\u95EE\u9898\u53CA\u89E3\u51B3\u65B9\u6848",children:"6. \u5E38\u89C1\u95EE\u9898\u53CA\u89E3\u51B3\u65B9\u6848"}),"\n",(0,s.jsx)(n.h3,{id:"61-\u955C\u50CF\u62C9\u53D6\u5931\u8D25",children:"6.1 \u955C\u50CF\u62C9\u53D6\u5931\u8D25"}),"\n",(0,s.jsx)(n.p,{children:"\u5728\u56FD\u5185\u73AF\u5883\u4E2D\uFF0C\u7531\u4E8E\u7F51\u7EDC\u539F\u56E0\uFF0C\u53EF\u80FD\u4F1A\u9047\u5230\u955C\u50CF\u62C9\u53D6\u5931\u8D25\u7684\u95EE\u9898\u3002\u89E3\u51B3\u65B9\u6848\u662F\u914D\u7F6E\u56FD\u5185\u955C\u50CF\u6E90\u3002"}),"\n",(0,s.jsx)(n.h4,{id:"611-\u914D\u7F6Edocker\u56FD\u5185\u955C\u50CF\u6E90",children:"6.1.1 \u914D\u7F6EDocker\u56FD\u5185\u955C\u50CF\u6E90"}),"\n",(0,s.jsxs)(n.p,{children:["\u7F16\u8F91\u6216\u521B\u5EFA",(0,s.jsx)(n.code,{children:"/etc/docker/daemon.json"}),"\u6587\u4EF6\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "registry-mirrors": [\n    "https://registry.docker-cn.com",\n    "https://hub-mirror.c.163.com",\n    "https://mirror.baidubce.com"\n  ]\n}\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u7136\u540E\u91CD\u542FDocker\u670D\u52A1\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"sudo systemctl restart docker\n"})}),"\n",(0,s.jsx)(n.h4,{id:"612-\u4F7F\u7528\u81EA\u5B9A\u4E49\u955C\u50CF",children:"6.1.2 \u4F7F\u7528\u81EA\u5B9A\u4E49\u955C\u50CF"}),"\n",(0,s.jsxs)(n.p,{children:["\u4F60\u4E5F\u53EF\u4EE5\u5728",(0,s.jsx)(n.code,{children:"Kind"}),"\u914D\u7F6E\u6587\u4EF6\u4E2D\u6307\u5B9A\u4F7F\u7528\u81EA\u5B9A\u4E49\u7684\u8282\u70B9\u955C\u50CF\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n  image: registry.cn-hangzhou.aliyuncs.com/google_containers/kindest-node:v1.25.3\n"})}),"\n",(0,s.jsx)(n.h3,{id:"62-\u8D44\u6E90\u4E0D\u8DB3",children:"6.2 \u8D44\u6E90\u4E0D\u8DB3"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"}),"\u8FD0\u884C\u591A\u8282\u70B9\u96C6\u7FA4\u53EF\u80FD\u4F1A\u6D88\u8017\u5927\u91CF\u8D44\u6E90\u3002\u5982\u679C\u9047\u5230\u8D44\u6E90\u4E0D\u8DB3\u7684\u95EE\u9898\uFF0C\u53EF\u4EE5\uFF1A"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u51CF\u5C11\u8282\u70B9\u6570\u91CF"}),"\n",(0,s.jsxs)(n.li,{children:["\u589E\u52A0",(0,s.jsx)(n.code,{children:"Docker"}),"\u7684\u8D44\u6E90\u9650\u5236\uFF08\u5728",(0,s.jsx)(n.code,{children:"Docker Desktop"}),"\u7684\u8BBE\u7F6E\u4E2D\uFF09"]}),"\n",(0,s.jsx)(n.li,{children:"\u4F7F\u7528\u66F4\u5C0F\u7684\u5355\u8282\u70B9\u96C6\u7FA4"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"63-\u7F51\u7EDC\u95EE\u9898",children:"6.3 \u7F51\u7EDC\u95EE\u9898"}),"\n",(0,s.jsx)(n.p,{children:"\u5982\u679C\u9047\u5230\u7F51\u7EDC\u8FDE\u63A5\u95EE\u9898\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\uFF1A"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u68C0\u67E5\u9632\u706B\u5899\u8BBE\u7F6E"}),"\n",(0,s.jsxs)(n.li,{children:["\u786E\u4FDD",(0,s.jsx)(n.code,{children:"Docker"}),"\u7F51\u7EDC\u6B63\u5E38\u5DE5\u4F5C"]}),"\n",(0,s.jsx)(n.li,{children:"\u91CD\u65B0\u521B\u5EFA\u96C6\u7FA4"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind delete cluster\nkind create cluster\n"})}),"\n",(0,s.jsx)(n.h3,{id:"64-\u96C6\u7FA4\u521B\u5EFA\u5931\u8D25",children:"6.4 \u96C6\u7FA4\u521B\u5EFA\u5931\u8D25"}),"\n",(0,s.jsx)(n.p,{children:"\u5982\u679C\u96C6\u7FA4\u521B\u5EFA\u5931\u8D25\uFF0C\u53EF\u4EE5\u67E5\u770B\u8BE6\u7EC6\u65E5\u5FD7\uFF1A"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind create cluster --name my-cluster --verbosity 9\n"})}),"\n",(0,s.jsx)(n.h3,{id:"65-kubectl\u65E0\u6CD5\u8FDE\u63A5\u5230\u96C6\u7FA4",children:"6.5 kubectl\u65E0\u6CD5\u8FDE\u63A5\u5230\u96C6\u7FA4"}),"\n",(0,s.jsxs)(n.p,{children:["\u5982\u679C",(0,s.jsx)(n.code,{children:"kubectl"}),"\u65E0\u6CD5\u8FDE\u63A5\u5230",(0,s.jsx)(n.code,{children:"Kind"}),"\u96C6\u7FA4\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# \u68C0\u67E5\u96C6\u7FA4\u72B6\u6001\nkind get clusters\n\n# \u5BFC\u51FAkubeconfig\nkind export kubeconfig --name my-cluster\n\n# \u9A8C\u8BC1\u8FDE\u63A5\nkubectl cluster-info\n"})}),"\n",(0,s.jsx)(n.h2,{id:"7-\u5B9E\u7528\u6280\u5DE7",children:"7. \u5B9E\u7528\u6280\u5DE7"}),"\n",(0,s.jsx)(n.h3,{id:"71-\u5728cicd\u4E2D\u4F7F\u7528kind",children:"7.1 \u5728CI/CD\u4E2D\u4F7F\u7528Kind"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"}),"\u975E\u5E38\u9002\u5408\u5728",(0,s.jsx)(n.code,{children:"CI/CD"}),"\u7BA1\u9053\u4E2D\u4F7F\u7528\u3002\u4EE5\u4E0B\u662F\u5728",(0,s.jsx)(n.code,{children:"GitHub Actions"}),"\u4E2D\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Kind"}),"\u7684\u793A\u4F8B\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'name: Test with Kind\n\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v2\n    - uses: engineerd/setup-kind@v0.5.0\n      with:\n        version: "v0.27.0"\n    - name: Test\n      run: |\n        kubectl cluster-info\n        kubectl get pods -A\n'})}),"\n",(0,s.jsx)(n.h3,{id:"72-\u4F7F\u7528helm\u4E0Ekind",children:"7.2 \u4F7F\u7528Helm\u4E0EKind"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Helm"}),"\u662F",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u7684\u5305\u7BA1\u7406\u5DE5\u5177\uFF0C\u53EF\u4EE5\u4E0E",(0,s.jsx)(n.code,{children:"Kind"}),"\u4E00\u8D77\u4F7F\u7528\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# \u5B89\u88C5Helm\ncurl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash\n\n# \u4F7F\u7528Helm\u5728Kind\u96C6\u7FA4\u4E2D\u5B89\u88C5\u5E94\u7528\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm install my-release bitnami/nginx\n"})}),"\n",(0,s.jsx)(n.h3,{id:"73-\u4F7F\u7528ingress\u4E0Ekind",children:"7.3 \u4F7F\u7528Ingress\u4E0EKind"}),"\n",(0,s.jsxs)(n.p,{children:["\u5728",(0,s.jsx)(n.code,{children:"Kind"}),"\u96C6\u7FA4\u4E2D\u542F\u7528",(0,s.jsx)(n.code,{children:"Ingress"}),"\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'# \u4FDD\u5B58\u4E3Akind-ingress.yaml\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n  kubeadmConfigPatches:\n  - |\n    kind: InitConfiguration\n    nodeRegistration:\n      kubeletExtraArgs:\n        node-labels: "ingress-ready=true"\n  extraPortMappings:\n  - containerPort: 80\n    hostPort: 80\n    protocol: TCP\n  - containerPort: 443\n    hostPort: 443\n    protocol: TCP\n'})}),"\n",(0,s.jsxs)(n.p,{children:["\u521B\u5EFA\u96C6\u7FA4\u5E76\u5B89\u88C5",(0,s.jsx)(n.code,{children:"Ingress"}),"\u63A7\u5236\u5668\uFF1A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kind create cluster --config kind-ingress.yaml\nkubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml\n"})}),"\n",(0,s.jsx)(n.h2,{id:"8-\u603B\u7ED3",children:"8. \u603B\u7ED3"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Kind"}),"\u662F\u4E00\u4E2A\u5F3A\u5927\u800C\u7075\u6D3B\u7684\u5DE5\u5177\uFF0C\u53EF\u4EE5\u5E2E\u52A9\u5F00\u53D1\u8005\u5728\u672C\u5730\u5FEB\u901F\u521B\u5EFA",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u6D4B\u8BD5\u73AF\u5883\u3002\u5B83\u7684\u8F7B\u91CF\u7EA7\u7279\u6027\u548C\u591A\u8282\u70B9\u652F\u6301\u4F7F\u5176\u6210\u4E3A\u5F00\u53D1\u3001\u6D4B\u8BD5\u548C",(0,s.jsx)(n.code,{children:"CI/CD"}),"\u73AF\u5883\u7684\u7406\u60F3\u9009\u62E9\u3002\u901A\u8FC7\u672C\u6587\u4ECB\u7ECD\u7684\u5B89\u88C5\u914D\u7F6E\u3001\u57FA\u672C\u4F7F\u7528\u548C\u5E38\u89C1\u95EE\u9898\u89E3\u51B3\u65B9\u6848\uFF0C\u4F60\u5E94\u8BE5\u80FD\u591F\u5F00\u59CB\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Kind"}),"\u8FDB\u884C",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u5E94\u7528\u7684\u672C\u5730\u5F00\u53D1\u548C\u6D4B\u8BD5\u3002"]}),"\n",(0,s.jsxs)(n.p,{children:["\u4E0E\u4F20\u7EDF\u7684",(0,s.jsx)(n.code,{children:"Minikube"}),"\u76F8\u6BD4\uFF0C",(0,s.jsx)(n.code,{children:"Kind"}),"\u5728\u8D44\u6E90\u6D88\u8017\u3001\u542F\u52A8\u901F\u5EA6\u548C\u591A\u8282\u70B9\u652F\u6301\u65B9\u9762\u5177\u6709\u660E\u663E\u4F18\u52BF\uFF0C\u7279\u522B\u9002\u5408\u9700\u8981\u9891\u7E41\u521B\u5EFA\u548C\u9500\u6BC1\u96C6\u7FA4\u7684\u573A\u666F\u3002\u968F\u7740\u4E91\u539F\u751F\u6280\u672F\u7684\u4E0D\u65AD\u53D1\u5C55\uFF0C",(0,s.jsx)(n.code,{children:"Kind"}),"\u4E5F\u5728\u6301\u7EED\u6539\u8FDB\uFF0C\u4E3A\u5F00\u53D1\u8005\u63D0\u4F9B\u66F4\u597D\u7684\u672C\u5730",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u4F53\u9A8C\u3002"]}),"\n",(0,s.jsxs)(n.p,{children:["\u5E0C\u671B\u672C\u6587\u80FD\u5E2E\u52A9\u4F60\u66F4\u597D\u5730\u7406\u89E3\u548C\u4F7F\u7528",(0,s.jsx)(n.code,{children:"Kind"}),"\uFF0C\u52A0\u901F\u4F60\u7684",(0,s.jsx)(n.code,{children:"Kubernetes"}),"\u5E94\u7528\u5F00\u53D1\u8FC7\u7A0B\u3002"]})]})}function a(e={}){let{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(t,{...e})}):t(e)}},54342:function(e,n,i){i.d(n,{Z:function(){return d}});let d=i.p+"assets/images/image-7ee32d8b90540110422a3751d832b722.png"},50065:function(e,n,i){i.d(n,{Z:function(){return r},a:function(){return c}});var d=i(67294);let s={},l=d.createContext(s);function c(e){let n=d.useContext(l);return d.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),d.createElement(l.Provider,{value:n},e.children)}}}]);