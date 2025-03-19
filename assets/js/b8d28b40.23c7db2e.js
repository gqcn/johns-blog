"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["819"],{54155:function(e,r,o){o.r(r),o.d(r,{metadata:()=>n,contentTitle:()=>l,default:()=>h,assets:()=>c,toc:()=>d,frontMatter:()=>i});var n=JSON.parse('{"id":"docs/\u4E91\u539F\u751F/Argo Workflow/Argo Workflow\u5E38\u89C1\u95EE\u9898/Argo Workflow\u53CATemplate\u6570\u636E\u662F\u5982\u4F55\u5B58\u50A8\u7684","title":"Argo Workflow\u53CATemplate\u6570\u636E\u662F\u5982\u4F55\u5B58\u50A8\u7684","description":"\u63A2\u8BA8 Argo Workflow \u4E2D\u7684\u6A21\u677F\u6570\u636E\u5B58\u50A8\u673A\u5236\uFF0C\u5305\u62EC\u6A21\u677F\u5B9A\u4E49\u7684\u6301\u4E45\u5316\u65B9\u5F0F\u548C\u72B6\u6001\u6570\u636E\u7684\u7BA1\u7406\u7B56\u7565","source":"@site/docs/docs/3000-\u4E91\u539F\u751F/1-Argo Workflow/3-Argo Workflow\u5E38\u89C1\u95EE\u9898/2-Argo Workflow\u53CATemplate\u6570\u636E\u662F\u5982\u4F55\u5B58\u50A8\u7684.md","sourceDirName":"docs/3000-\u4E91\u539F\u751F/1-Argo Workflow/3-Argo Workflow\u5E38\u89C1\u95EE\u9898","slug":"/cloud-native/argo-workflow-template-storage","permalink":"/cloud-native/argo-workflow-template-storage","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/cloud-native/argo-workflow-template-storage","title":"Argo Workflow\u53CATemplate\u6570\u636E\u662F\u5982\u4F55\u5B58\u50A8\u7684","hide_title":true,"keywords":["Argo Workflow","\u6A21\u677F\u5B58\u50A8","\u6570\u636E\u6301\u4E45\u5316","Kubernetes","etcd","\u72B6\u6001\u7BA1\u7406"],"description":"\u63A2\u8BA8 Argo Workflow \u4E2D\u7684\u6A21\u677F\u6570\u636E\u5B58\u50A8\u673A\u5236\uFF0C\u5305\u62EC\u6A21\u677F\u5B9A\u4E49\u7684\u6301\u4E45\u5316\u65B9\u5F0F\u548C\u72B6\u6001\u6570\u636E\u7684\u7BA1\u7406\u7B56\u7565"},"sidebar":"mainSidebar","previous":{"title":"Argo Workflow\u7684\u6D41\u7A0B\u6570\u636E\u662F\u5982\u4F55\u5B9E\u73B0\u4E0A\u4E0B\u6587\u4F20\u9012\u7684","permalink":"/cloud-native/argo-workflow-context-passing"},"next":{"title":"Argo Workflow\u7684GC\u7B56\u7565\uFF0C\u4EC0\u4E48\u65F6\u5019\u4F1A\u53BB\u6E05\u7406Pod","permalink":"/cloud-native/argo-workflow-gc-policy"}}'),t=o("85893"),s=o("50065");let i={slug:"/cloud-native/argo-workflow-template-storage",title:"Argo Workflow\u53CATemplate\u6570\u636E\u662F\u5982\u4F55\u5B58\u50A8\u7684",hide_title:!0,keywords:["Argo Workflow","\u6A21\u677F\u5B58\u50A8","\u6570\u636E\u6301\u4E45\u5316","Kubernetes","etcd","\u72B6\u6001\u7BA1\u7406"],description:"\u63A2\u8BA8 Argo Workflow \u4E2D\u7684\u6A21\u677F\u6570\u636E\u5B58\u50A8\u673A\u5236\uFF0C\u5305\u62EC\u6A21\u677F\u5B9A\u4E49\u7684\u6301\u4E45\u5316\u65B9\u5F0F\u548C\u72B6\u6001\u6570\u636E\u7684\u7BA1\u7406\u7B56\u7565"},l=void 0,c={},d=[{value:"\u4E00\u3001\u672C\u5730\u73AF\u5883",id:"\u4E00\u672C\u5730\u73AF\u5883",level:2},{value:"\u4E8C\u3001\u67E5\u770B<code>Kubernetes etcd</code>",id:"\u4E8C\u67E5\u770Bkubernetes-etcd",level:2},{value:"\u4E09\u3001\u5DF2\u5B8C\u6210<code>Workflow</code>\u7684\u6570\u636E\u5B58\u50A8",id:"\u4E09\u5DF2\u5B8C\u6210workflow\u7684\u6570\u636E\u5B58\u50A8",level:2}];function a(e){let r={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(r.p,{children:["\u4ECE\u4E4B\u524D\u7684\u6E90\u7801\u7684\u68B3\u7406\u6211\u4EEC\u53EF\u4EE5\u53D1\u73B0\uFF0CArgo Framework\u5BF9\u4E8EWorkflow\u4EE5\u53CA\u5176Template\u6570\u636E\u6CA1\u6709\u81EA\u8EAB\u7684\u5B58\u50A8\u903B\u8F91\uFF0C\u800C\u662F\u901A\u8FC7KubeClient\u76F4\u63A5\u8C03\u7528Kubernetes\u7684\u63A5\u53E3\u5904\u7406\u5BF9\u8C61\u67E5\u8BE2\u3001\u521B\u5EFA\u3001\u66F4\u65B0\u3001\u9500\u6BC1\u3002\u4E5F\u5C31\u662F\u8BF4\uFF0C\u8FD9\u4E9B\u6570\u636E\u5E94\u8BE5\u662F\u4EA4\u7ED9Kubernetes\u6765\u8D1F\u8D23\u7EF4\u62A4\u7684\uFF0C\u5F53\u7136\u4E5F\u5305\u62EC\u5B58\u50A8\u3002\u6211\u4EEC\u90FD\u77E5\u9053Kubernetes\u5E95\u5C42\u662F\u4F7F\u7528\u7684etcd\u670D\u52A1\u4F5C\u4E3A\u5B58\u50A8\uFF0C\u4E3A\u4E86\u9A8C\u8BC1Workflow/Template\u6570\u636E\u5B58\u50A8\u7684\u8FD9\u4E00\u70B9\u731C\u6D4B\uFF0C\u6211\u4EEC\u76F4\u63A5\u53BB\u770BKubernetes\u4E2Detcd\u7684\u6570\u636E\u4E0D\u5C31\u884C\u4E86\u5417\u3002\u60F3\u4E0D\u5982\u505A\uFF0C",(0,t.jsx)(r.code,{children:"Let's do it"}),"\u3002"]}),"\n",(0,t.jsx)(r.h2,{id:"\u4E00\u672C\u5730\u73AF\u5883",children:"\u4E00\u3001\u672C\u5730\u73AF\u5883"}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\u4E3A\u4E86\u65B9\u4FBF\u64CD\u4F5C\uFF0C\u6211\u672C\u5730\u642D\u5EFA\u7684\u662F",(0,t.jsx)(r.code,{children:"minikube"}),"\u6765\u6109\u5FEB\u73A9\u800D",(0,t.jsx)(r.code,{children:"Kubernetes"}),"\uFF0C\u5B89\u88C5\u7684",(0,t.jsx)(r.code,{children:"Kubernetes"}),"\u7248\u672C\u4E3A",(0,t.jsx)(r.code,{children:"v1.20.7"}),"\u3002"]}),"\n",(0,t.jsxs)(r.li,{children:["\u672C\u5730\u5B89\u88C5\u7684",(0,t.jsx)(r.code,{children:"argo"}),"\u7248\u672C\u4E3A",(0,t.jsx)(r.code,{children:"v3.0.3\uFF0C\u5B89\u88C5\u5728ago\u547D\u540D\u7A7A\u95F4\u4E0B"}),"\u3002"]}),"\n",(0,t.jsxs)(r.li,{children:["\u672C\u5730\u7CFB\u7EDF\u4E3A",(0,t.jsx)(r.code,{children:"macOs Big Sur\xa011.3.1"}),"\u3002"]}),"\n",(0,t.jsx)(r.li,{children:"\u5F53\u524D\u5DF2\u7ECF\u8FD0\u884C\u4E86\u4E00\u4E9B\u5B9E\u4F8B\uFF1A"}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{src:o(29089).Z+"",width:"1634",height:"1150"})}),"\n",(0,t.jsxs)(r.h2,{id:"\u4E8C\u67E5\u770Bkubernetes-etcd",children:["\u4E8C\u3001\u67E5\u770B",(0,t.jsx)(r.code,{children:"Kubernetes etcd"})]}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\u8FDB\u5165\u5230",(0,t.jsx)(r.code,{children:"kube-system"}),"\u547D\u540D\u7A7A\u95F4\u4E0B\u7684",(0,t.jsx)(r.code,{children:"etcd"}),"\u5BB9\u5668\u4E2D\uFF1A"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{src:o(38551).Z+"",width:"2610",height:"546"})}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["\u4E3A\u65B9\u4FBF\u64CD\u4F5C\u8FD9\u91CC\u8BBE\u7F6E\u4E00\u4E0B",(0,t.jsx)(r.code,{children:"etcdctl"}),"\u7684\u522B\u540D\uFF1A"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{children:'alias etcdctl="ETCDCTL_API=3 /usr/local/bin/etcdctl --endpoints= https://127.0.0.1:2379 --cacert=/var/lib/minikube/certs/etcd/ca.crt --cert=/var/lib/minikube/certs/etcd/healthcheck-client.crt --key=/var/lib/minikube/certs/etcd/healthcheck-client.key"\n'})}),"\n"]}),"\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["\u968F\u540E\u4F7F\u7528\u547D\u540D\xa0",(0,t.jsx)(r.code,{children:"etcdctl get / --prefix=true --keys-only=true"})," \u67E5\u770B\u6240\u6709\u7684\u952E\u540D\u5217\u8868\uFF0C\u53EF\u4EE5\u770B\u5230\u6709\u5F88\u591A\u81EA\u5B9A\u4E49\u7684 ",(0,t.jsx)(r.code,{children:"/registry/[argoproj.io/workflows](http://argoproj.io/workflows)"})," \xa0\u4E3A\u524D\u7F00\u7684\u952E\u540D\uFF1A"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{src:o(40527).Z+"",width:"1742",height:"1952"})}),"\n",(0,t.jsxs)(r.p,{children:["\u53EF\u4EE5\u770B\u5230\u8FD9\u4E2A\u524D\u7F00\u8DDF",(0,t.jsx)(r.code,{children:"WorkflowInformer"}),"\u6CE8\u518C",(0,t.jsx)(r.code,{children:"ListWatch"}),"\u65F6\u7684",(0,t.jsx)(r.code,{children:"Resource"}),"\u53C2\u6570\u6709\u4E00\u5B9A\u7684\u5173\u8054\u5173\u7CFB\uFF0C\u7B2C\u4E09\u7EA7\u7684\u8BDD\u662F",(0,t.jsx)(r.code,{children:"namespace"}),"\uFF0C\u7B2C\u56DB\u7EA7\u7684\u8BDD\u662F",(0,t.jsx)(r.code,{children:"pod"}),"\u540D\u79F0\u3002"]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{src:o(40622).Z+"",width:"1810",height:"862"})}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\u53EF\u4EE5\u770B\u5230\u8FD9\u91CC\u90FD\u662F",(0,t.jsx)(r.code,{children:"argo"}),"\u6CE8\u518C\u7684",(0,t.jsx)(r.code,{children:"Workflow CRD"}),"\u6570\u636E\uFF0C\u6211\u4EEC\u62FF\u5176\u4E2D\u7684\xa0",(0,t.jsx)(r.code,{children:"steps-4ttw6(\u5BF9\u5E94\u5B98\u65B9\u793A\u4F8Bsteps.yaml)\xa0"}),"\xa0\u67E5\u770B\u4E0B\u5176\u4E2D\u6570\u636E\u662F\u4EC0\u4E48\u6837\u5B50\u7684\uFF1A"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{src:o(37982).Z+"",width:"3540",height:"1470"})}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["\u4E3A\u65B9\u4FBF\u67E5\u770B\uFF0C\u6211\u4EEC\u5C06\u7ED3\u679C\u683C\u5F0F\u5316\u4E00\u4E0B\uFF0C\u7531\u4E8E\u5185\u5BB9\u8F83\u957F\uFF0C",(0,t.jsx)(r.a,{href:"#",children:"\u8FD9\u91CC\u53EF\u4EE5\u70B9\u51FB\u67E5\u770B\u683C\u5F0F\u5316\u540E\u7684\u6587\u4EF6"}),"\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["\u53EF\u4EE5\u770B\u5230\u8FD9\u91CC\u9762\u5305\u542B\u4E86",(0,t.jsx)(r.code,{children:"Workflow"}),"\u7684\u6240\u6709\u4FE1\u606F\uFF08\u4E5F\u5305\u62EC",(0,t.jsx)(r.code,{children:"Workflow"}),"\u4E2D\u7684",(0,t.jsx)(r.code,{children:"Template"}),"\uFF09\uFF0C\u800C\u8FD9\u4E2A\u6570\u636E\u7ED3\u6784\u6B63\u597D\u8DDF\u6211\u4EEC\u4E0A\u9762\u4ECB\u7ECD\u5230\u7684\u7A0B\u5E8F\u4E2D\u7684",(0,t.jsx)(r.code,{children:"Workflow"}),"\u6570\u636E\u7ED3\u6784\u4E00\u4E00\u5BF9\u5E94\u3002"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(r.h2,{id:"\u4E09\u5DF2\u5B8C\u6210workflow\u7684\u6570\u636E\u5B58\u50A8",children:["\u4E09\u3001\u5DF2\u5B8C\u6210",(0,t.jsx)(r.code,{children:"Workflow"}),"\u7684\u6570\u636E\u5B58\u50A8"]}),"\n",(0,t.jsxs)(r.p,{children:["\u5DF2\u7ECF\u6267\u884C\u5B8C\u6210\u7684",(0,t.jsx)(r.code,{children:"Workflow"}),"\u662F\u6709\u4E00\u5B9A\u7684\u6E05\u7406\u7B56\u7565\uFF0C\u9ED8\u8BA4\u60C5\u51B5\u4E0B\u662F\u6C38\u4E45\u4FDD\u7559\uFF0C\u5177\u4F53\u7684\u6E05\u7406\u7B56\u7565\u4ECB\u7ECD\u8BF7\u53C2\u8003\u4E0B\u4E00\u4E2A\u5E38\u89C1\u95EE\u9898\u4ECB\u7ECD\u3002\u5982\u679C\u60F3\u8981\u5C06\u5DF2\u7ECF\u5B8C\u6210\u7684",(0,t.jsx)(r.code,{children:"Workflow"}),"\u6570\u636E\u6C38\u4E45\u4FDD\u5B58\u4E0B\u6765\uFF0C\u5B98\u65B9\u63D0\u4F9B\u4E86\u6570\u636E\u5E93\u5B58\u50A8\u7684\u652F\u6301\uFF0C\u4EC5\u9700\u7B80\u5355\u7684\u914D\u7F6E\u5373\u53EF\u5C06\u5DF2\u6267\u884C\u5B8C\u6210\u7684\u6570\u636E\u4FDD\u5B58\u5230",(0,t.jsx)(r.code,{children:"PgSQL/MySQL"}),"\u6570\u636E\u5E93\u4E2D\u3002\u5177\u4F53\u8BF7\u53C2\u8003\u5B98\u65B9\u6587\u6863\uFF1A",(0,t.jsx)(r.a,{href:"https://argoproj.github.io/argo-workflows/workflow-archive/",children:"https://argoproj.github.io/argo-workflows/workflow-archive/"})]})]})}function h(e={}){let{wrapper:r}={...(0,s.a)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},29089:function(e,r,o){o.d(r,{Z:function(){return n}});let n=o.p+"assets/images/image2021-7-5_16-34-59-08062bd4771fe19f8fbec1ab5e4871e7.png"},38551:function(e,r,o){o.d(r,{Z:function(){return n}});let n=o.p+"assets/images/image2021-7-5_16-41-13-f11e4790225109352fa7284912db0162.png"},40527:function(e,r,o){o.d(r,{Z:function(){return n}});let n=o.p+"assets/images/image2021-7-5_16-45-2-f3d396faada6efa54d71ab38dd0ad464.png"},37982:function(e,r,o){o.d(r,{Z:function(){return n}});let n=o.p+"assets/images/image2021-7-5_16-47-18-6371f72c1f97445998598d43a6d6a3d8.png"},40622:function(e,r,o){o.d(r,{Z:function(){return n}});let n=o.p+"assets/images/image2021-7-7_14-58-56-7126235073a6d3808395eb17a59dfd4c.png"},50065:function(e,r,o){o.d(r,{Z:function(){return l},a:function(){return i}});var n=o(67294);let t={},s=n.createContext(t);function i(e){let r=n.useContext(s);return n.useMemo(function(){return"function"==typeof e?e(r):{...r,...e}},[r,e])}function l(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),n.createElement(s.Provider,{value:r},e.children)}}}]);