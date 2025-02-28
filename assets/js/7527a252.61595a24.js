"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["6321"],{299:function(e,n,r){r.r(n),r.d(n,{metadata:()=>t,contentTitle:()=>l,default:()=>f,assets:()=>c,toc:()=>d,frontMatter:()=>o});var t=JSON.parse('{"id":"\u4E91\u539F\u751F/Argo Workflow/Argo Workflow\u4ECB\u7ECD","title":"Argo Workflow\u4ECB\u7ECD","description":"\u4ECB\u7ECD Argo Workflow \u7684\u57FA\u672C\u6982\u5FF5\u3001\u6838\u5FC3\u7279\u6027\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u8BFB\u8005\u7406\u89E3\u8FD9\u4E2A\u57FA\u4E8E Kubernetes \u7684\u5DE5\u4F5C\u6D41\u5F15\u64CE","source":"@site/docs/3-\u4E91\u539F\u751F/1-Argo Workflow/1-Argo Workflow\u4ECB\u7ECD.md","sourceDirName":"3-\u4E91\u539F\u751F/1-Argo Workflow","slug":"/cloud-native/argo-workflow-introduction","permalink":"/cloud-native/argo-workflow-introduction","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"slug":"/cloud-native/argo-workflow-introduction","title":"Argo Workflow\u4ECB\u7ECD","hide_title":true,"keywords":["Argo Workflow","\u5DE5\u4F5C\u6D41","\u5BB9\u5668\u7F16\u6392","Kubernetes","\u6D41\u7A0B\u81EA\u52A8\u5316","\u4EFB\u52A1\u7F16\u6392"],"description":"\u4ECB\u7ECD Argo Workflow \u7684\u57FA\u672C\u6982\u5FF5\u3001\u6838\u5FC3\u7279\u6027\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u8BFB\u8005\u7406\u89E3\u8FD9\u4E2A\u57FA\u4E8E Kubernetes \u7684\u5DE5\u4F5C\u6D41\u5F15\u64CE"},"sidebar":"mainSidebar","previous":{"title":"Argo Workflow","permalink":"/cloud-native/argo-workflow"},"next":{"title":"Argo Workflow\u6E90\u7801\u89E3\u6790","permalink":"/cloud-native/argo-workflow-source-code"}}'),i=r("85893"),s=r("50065");let o={slug:"/cloud-native/argo-workflow-introduction",title:"Argo Workflow\u4ECB\u7ECD",hide_title:!0,keywords:["Argo Workflow","\u5DE5\u4F5C\u6D41","\u5BB9\u5668\u7F16\u6392","Kubernetes","\u6D41\u7A0B\u81EA\u52A8\u5316","\u4EFB\u52A1\u7F16\u6392"],description:"\u4ECB\u7ECD Argo Workflow \u7684\u57FA\u672C\u6982\u5FF5\u3001\u6838\u5FC3\u7279\u6027\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u8BFB\u8005\u7406\u89E3\u8FD9\u4E2A\u57FA\u4E8E Kubernetes \u7684\u5DE5\u4F5C\u6D41\u5F15\u64CE"},l=void 0,c={},d=[{value:"\u4E00\u3001\u4EC0\u4E48\u662F\u6D41\u6C34\u7EBF",id:"\u4E00\u4EC0\u4E48\u662F\u6D41\u6C34\u7EBF",level:2},{value:"\u4E8C\u3001Argo\u662F\u4EC0\u4E48",id:"\u4E8Cargo\u662F\u4EC0\u4E48",level:2},{value:"\u4E09\u3001\u4E09\u7EA7\u5B9A\u4E49",id:"\u4E09\u4E09\u7EA7\u5B9A\u4E49",level:2},{value:"1\u3001Template",id:"1template",level:3},{value:"2\u3001Workflow",id:"2workflow",level:3},{value:"3\u3001WorkflowTemplate",id:"3workflowtemplate",level:3},{value:"4\u3001Workflow Overview",id:"4workflow-overview",level:3},{value:"\u56DB\u3001Sidecar",id:"\u56DBsidecar",level:2},{value:"1\u3001Init",id:"1init",level:3},{value:"2\u3001Wait",id:"2wait",level:3},{value:"\u4E94\u3001Inputs and Outputs",id:"\u4E94inputs-and-outputs",level:2},{value:"1\u3001Artifact",id:"1artifact",level:3},{value:"2\u3001Script",id:"2script",level:3},{value:"3\u3001Parameter",id:"3parameter",level:3},{value:"4\u3001Volume",id:"4volume",level:3},{value:"\u516D\u3001\u6D41\u7A0B\u63A7\u5236\u529F\u80FD",id:"\u516D\u6D41\u7A0B\u63A7\u5236\u529F\u80FD",level:2},{value:"1\u3001\u5FAA\u73AF",id:"1\u5FAA\u73AF",level:3},{value:"2\u3001\u6761\u4EF6\u5224\u65AD",id:"2\u6761\u4EF6\u5224\u65AD",level:3},{value:"3\u3001\u9519\u8BEF\u91CD\u8BD5",id:"3\u9519\u8BEF\u91CD\u8BD5",level:3},{value:"4\u3001\u9012\u5F52",id:"4\u9012\u5F52",level:3},{value:"5\u3001\u9000\u51FA\u5904\u7406",id:"5\u9000\u51FA\u5904\u7406",level:3},{value:"\u4E03\u3001\u53C2\u8003\u8D44\u6599",id:"\u4E03\u53C2\u8003\u8D44\u6599",level:2}];function a(e){let n={a:"a",blockquote:"blockquote",br:"br",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"\u4E00\u4EC0\u4E48\u662F\u6D41\u6C34\u7EBF",children:"\u4E00\u3001\u4EC0\u4E48\u662F\u6D41\u6C34\u7EBF"}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u8BA1\u7B97\u673A\u4E2D\uFF0C",(0,i.jsx)(n.strong,{children:"\u6D41\u6C34\u7EBF\u662F\u628A\u4E00\u4E2A\u91CD\u590D\u7684\u8FC7\u7A0B\u5206\u89E3\u4E3A\u82E5\u5E72\u4E2A\u5B50\u8FC7\u7A0B\uFF0C\u4F7F\u6BCF\u4E2A\u5B50\u8FC7\u7A0B\u4E0E\u5176\u4ED6\u5B50\u8FC7\u7A0B\u5E76\u884C\u8FDB\u884C\u7684\u6280\u672F\uFF0C\u4E5F\u53EB Pipeline"}),"\u3002\u7531\u4E8E\u8FD9\u79CD\u5DE5\u4F5C\u65B9\u5F0F\u4E0E\u5DE5\u5382\u4E2D\u7684\u751F\u4EA7\u6D41\u6C34\u7EBF\u5341\u5206\u76F8\u4F3C\uFF0C \u56E0\u6B64\u4E5F\u88AB\u79F0\u4E3A\u6D41\u6C34\u7EBF\u6280\u672F\u3002\u4ECE\u672C\u8D28\u4E0A\u8BB2\uFF0C\u6D41\u6C34\u7EBF\u6280\u672F\u662F\u4E00\u79CD\u65F6\u95F4\u5E76\u884C\u6280\u672F\u3002\u4EE5\u201C\u6784\u5EFA\u955C\u50CF\u201D\u8FC7\u7A0B\u4E3A\u4F8B\uFF1A"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(87432).Z+"",width:"645",height:"365"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u6BCF\u4E00\u6B21\u6784\u5EFA\u955C\u50CF\u4E2D\uFF0C\u6211\u4EEC\u90FD\u9700\u8981\u62C9\u4E0B\u4EE3\u7801\u4ED3\u5E93\u4E2D\u7684\u4EE3\u7801\uFF0C\u8FDB\u884C\u4EE3\u7801\u7F16\u8BD1\uFF0C\u6784\u5EFA\u955C\u50CF\uFF0C\u6700\u540E\u63A8\u5F80\u955C\u50CF\u4ED3\u5E93\u3002\u5728\u6BCF\u4E00\u6B21\u4EE3\u7801\u66F4\u6539\u8FC7\u540E\uFF0C\u8FD9\u4E00\u8FC7\u7A0B\u90FD\u662F\u4E0D\u53D8\u7684\u3002\u4F7F\u7528\u6D41\u6C34\u7EBF\u5DE5\u5177\u53EF\u4EE5\u6781\u5927\u7684\u63D0\u5347\u8FD9\u4E00\u8FC7\u7A0B\u7684\u6548\u7387\uFF0C\u53EA\u9700\u8981\u8FDB\u884C\u7B80\u5355\u7684\u914D\u7F6E\u4FBF\u53EF\u4EE5\u8F7B\u677E\u7684\u5B8C\u6210\u91CD\u590D\u6027\u7684\u5DE5\u4F5C\u3002\u8FD9\u6837\u7684\u8FC7\u7A0B\u4E5F\u88AB\u79F0\u4E4B\u4E3A CI\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u4E0A\u56FE\u6D41\u7A0B\u4E2D\u4F7F\u7528\u7684\u662F Jenkins\u3002Jenkins \u4F5C\u4E3A\u8001\u724C\u6D41\u6C34\u7EBF\u6846\u67B6\u88AB\u5927\u5BB6\u6240\u719F\u77E5\u3002\u5728\u4E91\u539F\u751F\u65F6\u4EE3\uFF0CJenkins \u63A8\u51FA\u4E86 Jenkins X \u4F5C\u4E3A\u57FA\u4E8E Kubernetes \u7684\u65B0\u4E00\u4EE3\u6D41\u6C34\u7EBF\uFF0C\u53E6\u5916\u4E91\u539F\u751F\u65F6\u4EE3\u8FD8\u8BDE\u751F\u4E86\u4E24\u5927\u6D41\u6C34\u7EBF\u6846\u67B6\u2014\u2014 Argo \u548C Tekton\u3002\u672C\u6587\u5C31\u8BE6\u7EC6\u4ECB\u7ECD\u4E86 Argo \u7684\u76F8\u5173\u5185\u5BB9\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u4E8Cargo\u662F\u4EC0\u4E48",children:"\u4E8C\u3001Argo\u662F\u4EC0\u4E48"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Argo Workflows"})," \u662F\u4E00\u4E2A\u5F00\u6E90\u7684\u5BB9\u5668\u539F\u751F\u7684\u5DE5\u4F5C\u6D41\u5F15\u64CE\uFF0C\u53EF\u5728 Kubernetes \u4E0A\u7F16\u6392\u5E76\u884C\u4F5C\u4E1A\u3002Argo Workflows \u901A\u8FC7 Kubernetes CRD\u65B9\u5F0F\u5B9E\u73B0\u3002Argo \u57FA\u4E8E Kubernetes\uFF0C\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528 ",(0,i.jsx)(n.code,{children:"kubectl"})," \u5B89\u88C5\uFF0C\u5B89\u88C5\u7684\u7EC4\u4EF6\u4E3B\u8981\u5305\u62EC\u4E86\u4E00\u4E9B CRD \u4EE5\u53CA\u5BF9\u5E94\u7684 controller \u548C\u4E00\u4E2A server\u3002"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(46718).Z+"",width:"1080",height:"119"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["\u6CE8\u610F\uFF0C\u4E0A\u8FF0\u5B89\u88C5\u53EA\u4F1A\u6267\u884C\u540C namespace \u5185\u7684 Workflow\uFF0Ccluster install \u8BE6\u89C1\u6587\u6863\u3002\u6587\u6863\u5730\u5740\uFF1A",(0,i.jsx)(n.a,{href:"https://argoproj.github.io/argo-workflows/",children:"https://argoproj.github.io/argo-workflows/"})]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u4E09\u4E09\u7EA7\u5B9A\u4E49",children:"\u4E09\u3001\u4E09\u7EA7\u5B9A\u4E49"}),"\n",(0,i.jsxs)(n.p,{children:["\u8981\u4E86\u89E3 Argo \u5B9A\u4E49\u7684 CRD\uFF0C\u5148\u4ECE\u5176\u4E2D\u7684\u4E09\u7EA7\u5B9A\u4E49\u5165\u624B\u3002\u6982\u5FF5\u4E0A\u7684\u4ECE\u5927\u5230\u5C0F\u5206\u522B\u4E3A WorkflowTemplate\u3001Workflow\u3001Template\uFF0C\u8FD9\u4E9B\u8D44\u6E90\u7684\u547D\u540D\u6709\u4E9B\u76F8\u4F3C\uFF0C\u8981\u6CE8\u610F\u5206\u8FA8\u3002",(0,i.jsx)(n.a,{href:"https://argoproj.github.io/argo-workflows/workflow-concepts/",children:"https://argoproj.github.io/argo-workflows/workflow-concepts/"})]}),"\n",(0,i.jsx)(n.h3,{id:"1template",children:"1\u3001Template"}),"\n",(0,i.jsxs)(n.p,{children:["\u4ECE\u6700\u7B80\u5355\u7684 template \u8BF4\u8D77\uFF0C\u4E00\u4E2A template \u6709\u591A\u79CD\u7C7B\u578B\uFF0C\u5206\u522B\u4E3A ",(0,i.jsx)(n.code,{children:"container"}),"\u3001",(0,i.jsx)(n.code,{children:"script"}),"\u3001",(0,i.jsx)(n.code,{children:"dag"}),"\u3001",(0,i.jsx)(n.code,{children:"steps"}),"\u3001",(0,i.jsx)(n.code,{children:"resource"})," \u4EE5\u53CA ",(0,i.jsx)(n.code,{children:"suspend"}),"**\u3002**\u5BF9\u4E8E template\uFF0C\u6211\u4EEC\u53EF\u4EE5\u7B80\u5355\u7684\u5C06\u5176\u7406\u89E3\u4E3A\u4E00\u4E2A Pod \u2014\u2014container/script/resource \u7C7B\u578B\u7684 template \u90FD\u4F1A\u53BB\u5B9E\u9645\u63A7\u5236\u4E00\u4E2A Pod\uFF0C\u800C dag/steps \u7C7B\u578B\u7684 template \u5219\u662F\u7531\u591A\u4E2A\u57FA\u7840\u7C7B\u578B\u7684 template \uFF08container/script/resource\uFF09\u7EC4\u6210\u7684\u3002"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"container"}),"\uFF1A\u6700\u5E38\u89C1\u7684\u6A21\u677F\u7C7B\u578B\uFF0C\u4E0E Kubernetes container spec \u4FDD\u6301\u4E00\u81F4\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"script"}),"\uFF1A\u8BE5\u7C7B\u578B\u57FA\u4E8E Container\uFF0C\u652F\u6301\u7528\u6237\u5728 template \u5B9A\u4E49\u4E00\u6BB5\u811A\u672C\uFF0C\u53E6\u6709\u4E00\u4E2A Source \u5B57\u6BB5\u6765\u8868\u793A\u811A\u672C\u7684\u8FD0\u884C\u73AF\u5883\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"resource"}),"\uFF1A\u8BE5\u7C7B\u578B\u652F\u6301\u6211\u4EEC\u5728 template \u4E2D\u5BF9 kubernetes \u7684\u8D44\u6E90\u8FDB\u884C\u64CD\u4F5C\uFF0C\u6709\u4E00\u4E2A action \u5B57\u6BB5\u53EF\u4EE5\u6307\u5B9A\u64CD\u4F5C\u7C7B\u578B\uFF0C\u5982 create, apply, delete \u7B49\uFF0C\u5E76\u4E14\u652F\u6301\u8BBE\u5B9A\u76F8\u5173\u7684\u6210\u529F\u4E0E\u5931\u8D25\u6761\u4EF6\u7528\u4E8E\u5224\u65AD\u8BE5 template \u7684\u6210\u529F\u4E0E\u5931\u8D25\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"suspend"}),"\uFF1ASuspend template \u5C06\u5728\u4E00\u6BB5\u65F6\u95F4\u5185\u6216\u5728\u624B\u52A8\u6062\u590D\u6267\u884C\u4E4B\u524D\u6682\u505C\u6267\u884C\u3002\u53EF\u4EE5\u4ECE CLI \uFF08\u4F7F\u7528 argo resume\uFF09\u3001API \u6216 UI \u6062\u590D\u6267\u884C\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"steps"}),"\uFF1ASteps Template \u5141\u8BB8\u7528\u6237\u4EE5\u4E00\u7CFB\u5217\u6B65\u9AA4\u5B9A\u4E49\u4EFB\u52A1\u3002\u5728 Steps \u4E2D\uFF0C[--] \u4EE3\u8868\u987A\u5E8F\u6267\u884C\uFF0C[-] \u4EE3\u8868\u5E76\u884C\u6267\u884C\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"dag"}),"\uFF1ADAG template \u5141\u8BB8\u7528\u6237\u5C06\u4EFB\u52A1\u5B9A\u4E49\u4E3A\u5E26\u4F9D\u8D56\u7684\u6709\u5411\u65E0\u73AF\u56FE\u3002\u5728 DAG \u4E2D\uFF0C\u901A\u8FC7 dependencies\u8BBE\u7F6E\u5728\u7279\u5B9A\u4EFB\u52A1\u5F00\u59CB\u4E4B\u524D\u5FC5\u987B\u5B8C\u6210\u7684\u5176\u4ED6\u4EFB\u52A1\u3002\u6CA1\u6709\u4EFB\u4F55\u4F9D\u8D56\u9879\u7684\u4EFB\u52A1\u5C06\u7ACB\u5373\u8FD0\u884C\u3002\u6709\u5173 DAG \u7684\u8BE6\u7EC6\u903B\u8F91\u53EF\u89C1\u6E90\u7801\xa0",(0,i.jsx)(n.a,{href:"https://github.com/argoproj/argo/blob/master/workflow/controller/dag.go#L204",children:"https://github.com/argoproj/a..."}),"\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"2workflow",children:"2\u3001Workflow"}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u4E00\u4E2A Workflow \u4E2D\uFF0C\u5176 spec \u4E2D\u6709\u4E00\u4E2A\u540D\u4E3A templates \u7684\u5B57\u6BB5\uFF0C\u5728\u5176\u4E2D\u81F3\u5C11\u9700\u8981\u4E00\u4E2A template \u4F5C\u4E3A\u5176\u7EC4\u6210\u7684\u4EFB\u52A1\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u4E00\u4E2A\u6700\u7B80\u5355\u7684 hello world \u4F8B\u5B50\u5982\u4E0B\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(18145).Z+"",width:"1080",height:"671"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u8FD9\u4E2A\u4F8B\u5B50\u4E2D\uFF0C\u8BE5 Workflow \u7684 templates \u5B57\u6BB5\u4E2D\u6307\u5B9A\u4E86\u4E00\u4E2A\u7C7B\u578B\u4E3A container \u7684 template\uFF0C\u4F7F\u7528\u4E86 whalesay \u955C\u50CF\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u4E0B\u9762\u662F\u4E00\u4E2A\u7A0D\u5FAE\u590D\u6742\u7684 workflow\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(34091).Z+"",width:"1080",height:"1052"})}),"\n",(0,i.jsx)(n.h3,{id:"3workflowtemplate",children:"3\u3001WorkflowTemplate"}),"\n",(0,i.jsx)(n.p,{children:"WorkflowTemplate \u76F8\u5F53\u4E8E Workflow \u7684\u6A21\u677F\u5E93\uFF0C\u548C Workflow \u4E00\u6837\uFF0C\u4E5F\u7531 template \u7EC4\u6210\u3002\u7528\u6237\u5728\u521B\u5EFA\u5B8C WorkflowTemplate \u540E\uFF0C\u53EF\u4EE5\u901A\u8FC7\u76F4\u63A5\u63D0\u4EA4\u5B83\u4EEC\u6765\u6267\u884C Workflow\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(42050).Z+"",width:"1080",height:"906"})}),"\n",(0,i.jsx)(n.h3,{id:"4workflow-overview",children:"4\u3001Workflow Overview"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(66471).Z+"",width:"1020",height:"780"})}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u4E86\u89E3\u4E86 Argo \u7684\u4E09\u7EA7\u5B9A\u4E49\u540E\uFF0C\u6211\u4EEC\u9996\u5148\u6765\u6DF1\u5165\u4E00\u4E0B Argo \u4E2D\u6700\u4E3A\u5173\u952E\u7684\u5B9A\u4E49\uFF0CWorkflow\u3002",(0,i.jsx)(n.strong,{children:"Workflow \u662F Argo \u4E2D\u6700\u91CD\u8981\u7684\u8D44\u6E90\uFF0C\u6709\u4E24\u4E2A\u91CD\u8981\u7684\u529F\u80FD\uFF1A"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u5B9A\u4E49\u4E86\u8981\u6267\u884C\u7684\u5DE5\u4F5C\u6D41\u3002"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u5B58\u50A8\u4E86\u5DE5\u4F5C\u6D41\u7684\u72B6\u6001\u3002"})}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u7531\u4E8E\u8FD9\u4E9B\u53CC\u91CD\u804C\u8D23\uFF0CWorkflow \u5E94\u8BE5\u88AB\u89C6\u4E3A\u4E00\u4E2A Active \u7684\u5BF9\u8C61\u3002\u5B83\u4E0D\u4EC5\u662F\u4E00\u4E2A\u9759\u6001\u5B9A\u4E49\uFF0C\u4E5F\u662F\u4E0A\u8FF0\u5B9A\u4E49\u7684\u4E00\u4E2A\u201C\u5B9E\u4F8B\u201D\u3002"}),"\n",(0,i.jsx)(n.p,{children:"**Workflow Template \u7684\u5B9A\u4E49\u4E0E Workflow \u51E0\u4E4E\u4E00\u81F4\uFF0C\u9664\u4E86\u7C7B\u578B\u4E0D\u540C\u3002**\u6B63\u56E0\u4E3A Workflow \u65E2\u53EF\u4EE5\u662F\u4E00\u4E2A\u5B9A\u4E49\u4E5F\u53EF\u4EE5\u662F\u4E00\u4E2A\u5B9E\u4F8B\uFF0C\u6240\u4EE5\u624D\u9700\u8981 WorkflowTemplate \u4F5C\u4E3A Workflow \u7684\u6A21\u677F\uFF0CWorkflowTemplate \u5728\u5B9A\u4E49\u540E\u53EF\u4EE5\u901A\u8FC7\u63D0\u4EA4\uFF08Submit\uFF09\u6765\u521B\u5EFA\u4E00\u4E2A Workflow\u3002"}),"\n",(0,i.jsxs)(n.p,{children:["\u800C ",(0,i.jsx)(n.strong,{children:"Workflow"})," \u7531\u4E00\u4E2A entrypoint \u53CA\u4E00\u7CFB\u5217 template \u7EC4\u6210\uFF0Centrypoint \u5B9A\u4E49\u4E86\u8FD9\u4E2A workflow \u6267\u884C\u7684\u5165\u53E3\uFF0C\u800C template \u4F1A\u5B9E\u9645\u53BB\u6267\u884C\u4E00\u4E2A Pod\uFF0C\u5176\u4E2D\uFF0C\u7528\u6237\u5B9A\u4E49\u7684\u5185\u5BB9\u4F1A\u5728 Pod \u4E2D\u4EE5 Main Container \u4F53\u73B0\u3002\u6B64\u5916\uFF0C\u8FD8\u6709\u4E24\u4E2A ",(0,i.jsx)(n.strong,{children:"Sidecar"})," \u6765\u8F85\u52A9\u8FD0\u884C\u3002"]}),"\n",(0,i.jsx)(n.h2,{id:"\u56DBsidecar",children:"\u56DB\u3001Sidecar"}),"\n",(0,i.jsxs)(n.p,{children:["\u5728 Argo \u4E2D\uFF0C\u8FD9\u4E9B Sidecar \u7684\u955C\u50CF\u90FD\u662F ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.code,{children:"argoexec"})}),"\u3002Argo \u901A\u8FC7\u8FD9\u4E2A executor \u6765\u5B8C\u6210\u4E00\u4E9B\u6D41\u7A0B\u63A7\u5236\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"1init",children:"1\u3001Init"}),"\n",(0,i.jsxs)(n.p,{children:["\u5F53\u7528\u6237\u7684 template \u4E2D\u9700\u8981\u4F7F\u7528\u5230 inputs \u4E2D\u7684 ",(0,i.jsx)(n.code,{children:"artifact"})," \u6216\u8005\u662F script \u7C7B\u578B\u65F6\uFF08script \u7C7B\u578B\u9700\u8981\u6CE8\u5165\u811A\u672C\uFF09\uFF0CArgo \u90FD\u4F1A\u4E3A\u8FD9\u4E2A pod \u52A0\u4E0A\u4E00\u4E2A ",(0,i.jsx)(n.strong,{children:"InitContainer"})," \u2014\u2014 \u5176\u955C\u50CF\u4E3A argoexec\uFF0C\u547D\u4EE4\u662F argoexec init\u3002\u5728\u8FD9\u4E2A ",(0,i.jsx)(n.code,{children:"Init Container"})," \u4E2D\uFF0C\u4E3B\u8981\u5DE5\u4F5C\u5C31\u662F\u52A0\u8F7D ",(0,i.jsx)(n.code,{children:"artifact"}),"\uFF1A"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(27417).Z+"",width:"940",height:"916"})}),"\n",(0,i.jsx)(n.h3,{id:"2wait",children:"2\u3001Wait"}),"\n",(0,i.jsxs)(n.p,{children:["\u9664\u4E86 Resource \u7C7B\u578B\u5916\u7684 template\uFF0CArgo \u90FD\u4F1A\u6CE8\u5165\u4E00\u4E2A Wait Container\uFF0C\u7528\u4E8E\u7B49\u5F85 Main Container \u7684\u5B8C\u6210\u5E76\u7ED3\u675F\u6240\u6709 Sidecar\u3002\u8FD9\u4E2A Wait Container \u7684\u955C\u50CF\u540C\u6837\u4E3A ",(0,i.jsx)(n.code,{children:"argoexec"}),"\uFF0C\u547D\u4EE4\u662F ",(0,i.jsx)(n.code,{children:"argoexec wait"}),"\u3002\uFF08Resource \u7C7B\u578B\u7684\u4E0D\u9700\u8981\u662F\u56E0\u4E3A Resource \u7C7B\u578B\u7684 template \u76F4\u63A5\u4F7F\u7528 ",(0,i.jsx)(n.code,{children:"argoexec"})," \u4F5C\u4E3A Main Container \u8FD0\u884C\uFF09"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(86647).Z+"",width:"1080",height:"1623"})}),"\n",(0,i.jsx)(n.h2,{id:"\u4E94inputs-and-outputs",children:"\u4E94\u3001Inputs and Outputs"}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u8FD0\u884C Workflow \u65F6\uFF0C\u4E00\u4E2A\u5E38\u89C1\u7684\u573A\u666F\u662F\u8F93\u51FA\u4EA7\u7269\u7684\u4F20\u9012\u3002\u901A\u5E38\uFF0C\u4E00\u4E2A Step \u7684\u8F93\u51FA\u4EA7\u7269\u53EF\u4EE5\u7528\u4F5C\u540E\u7EED\u6B65\u9AA4\u7684\u8F93\u5165\u4EA7\u7269\u3002",(0,i.jsx)(n.strong,{children:"\u5728 Argo \u4E2D\uFF0C\u4EA7\u7269\u53EF\u4EE5\u901A\u8FC7 Artifact \u6216\u662F Parameter \u4F20\u9012\u3002"})]}),"\n",(0,i.jsx)(n.h3,{id:"1artifact",children:"1\u3001Artifact"}),"\n",(0,i.jsx)(n.p,{children:"**\u8981\u4F7F\u7528 Argo \u7684 Artifact\uFF0C\u9996\u5148\u5FC5\u987B\u914D\u7F6E\u548C\u4F7F\u7528 Artifact \u5B58\u50A8\u4ED3\u5E93\u3002**\u5177\u4F53\u7684\u914D\u7F6E\u65B9\u5F0F\u53EF\u4EE5\u901A\u8FC7\u4FEE\u6539\u5B58\u6709 Artifact Repository \u4FE1\u606F\u7684\u9ED8\u8BA4 Config Map \u6216\u8005\u5728 Workflow \u4E2D\u663E\u793A\u6307\u5B9A\uFF0C\u8BE6\u89C1 \u914D\u7F6E\u6587\u6863\uFF0C\u5728\u6B64\u4E0D\u505A\u8D58\u8FF0\u3002\u4E0B\u8868\u4E3A Argo \u652F\u6301\u7684\u4ED3\u5E93\u7C7B\u578B\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(85057).Z+"",width:"1080",height:"608"})}),"\n",(0,i.jsx)(n.p,{children:"\u4E00\u4E2A\u7B80\u5355\u7684\u4F7F\u7528\u4E86 Artifact \u7684\u4F8B\u5B50\u5982\u4E0B\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(86179).Z+"",width:"1080",height:"1286"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CArtifact \u88AB\u6253\u5305\u4E3A tgz(tar +gzip)\u5305\uFF0C\u6211\u4EEC\u4E5F\u53EF\u4EE5\u4F7F\u7528 archive \u5B57\u6BB5\u6307\u5B9A\u5B58\u6863\u7B56\u7565\u3002"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u4E0A\u9762\u7684\u4F8B\u5B50\u91CC\uFF0C\u540D\u4E3A whalesay \u7684 template \u4F7F\u7528 cowsay \u547D\u4EE4\u751F\u6210\u4E00\u4E2A\u540D\u4E3A /tmp/hello-world.txt \u7684\u6587\u4EF6\uFF0C\u7136\u540E\u5C06\u8BE5\u6587\u4EF6\u4F5C\u4E3A\u4E00\u4E2A\u540D\u4E3A hello-art \u7684 Artifact \u8F93\u51FA\u3002\u540D\u4E3A print-message \u7684 template \u63A5\u53D7\u4E00\u4E2A\u540D\u4E3A message \u7684\u8F93\u5165 Artifact\uFF0C\u5728 /tmp/message \u7684\u8DEF\u5F84\u4E0A\u89E3\u5305\u5B83\uFF0C\u7136\u540E\u4F7F\u7528 cat \u547D\u4EE4\u6253\u5370 /tmp/message \u7684\u5185\u5BB9\u3002"}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u524D\u9762\xa0Sidecar \u4ECB\u7ECD\u4E2D\u63D0\u5230\u8FC7\uFF0C",(0,i.jsx)(n.strong,{children:"Init Container \u4E3B\u8981\u7528\u4E8E\u62C9\u53D6 Artifact \u4EA7\u7269"}),"\u3002\u8FD9\u4E9B Sidecar \u6B63\u662F\u4EA7\u7269\u4F20\u9012\u7684\u5173\u952E\u3002\u4E0B\u9762\uFF0C\u6211\u4EEC\u901A\u8FC7\u4ECB\u7ECD\u53E6\u4E00\u79CD\u4EA7\u7269\u4F20\u9012\u7684\u65B9\u5F0F\u6765\u4F53\u9A8C Argo \u4E2D\u4F20\u9012\u4EA7\u7269\u7684\u5173\u952E\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"2script",children:"2\u3001Script"}),"\n",(0,i.jsx)(n.p,{children:"\u5148\u6765\u770B\u4E00\u4E2A\u7B80\u5355\u7684\u4F8B\u5B50\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(98413).Z+"",width:"1080",height:"1065"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u4E0A\u9762\u7684\u4F8B\u5B50\u4E2D\uFF0C\u6709\u4E24\u4E2A\u7C7B\u578B\u4E3A script \u7684 template\uFF0Cscript \u5141\u8BB8\u4F7F\u7528 source \u89C4\u8303\u811A\u672C\u4E3B\u4F53\u3002\u8FD9\u5C06\u521B\u5EFA\u4E00\u4E2A\u5305\u542B\u811A\u672C\u4E3B\u4F53\u7684\u4E34\u65F6\u6587\u4EF6\uFF0C\u7136\u540E\u5C06\u4E34\u65F6\u6587\u4EF6\u7684\u540D\u79F0\u4F5C\u4E3A\u6700\u540E\u4E00\u4E2A\u53C2\u6570\u4F20\u9012\u7ED9 command\uFF08\u6267\u884C\u811A\u672C\u4E3B\u4F53\u7684\u89E3\u91CA\u5668\uFF09\uFF0C\u8FD9\u6837\u4FBF\u53EF\u4EE5\u65B9\u4FBF\u7684\u6267\u884C\u4E0D\u540C\u7C7B\u578B\u7684\u811A\u672C\uFF08bash\u3001python\u3001js etc\uFF09\u3002"}),"\n",(0,i.jsxs)(n.p,{children:["Script template \u4F1A\u5C06\u811A\u672C\u7684\u6807\u51C6\u8F93\u51FA\u5206\u914D\u7ED9\u4E00\u4E2A\u540D\u4E3A result \u7684\u7279\u6B8A\u8F93\u51FA\u53C2\u6570\u4ECE\u800C\u88AB\u5176\u4ED6 template \u8C03\u7528\u3002\u5728\u8FD9\u91CC\uFF0C\u901A\u8FC7 ",(0,i.jsx)(n.code,{children:"{{steps.generate.outputs.result}}"})," \u5373\u53EF\u83B7\u53D6\u5230\u540D\u4E3A generate \u7684 template \u7684\u811A\u672C\u8F93\u51FA\u3002"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"{{xxx}}"})," \u662F Argo \u56FA\u5B9A\u7684\u53D8\u91CF\u66FF\u6362\u683C\u5F0F\uFF1A"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\u5173\u4E8E\u53D8\u91CF\u7684\u683C\u5F0F\u8BE6\u89C1\u6587\u6863\uFF0C\u6587\u6863\u5730\u5740\uFF1A",(0,i.jsx)(n.a,{href:"https://github.com/argoproj/argo/blob/master/docs/variables.md",children:"https://github.com/argoproj/a..."})]}),"\n",(0,i.jsxs)(n.li,{children:["\u5173\u4E8E\u53D8\u91CF\u66FF\u6362\u7684\u903B\u8F91\u8BE6\u89C1\u6E90\u7801\uFF0C\u6E90\u7801\u5730\u5740\uFF1A",(0,i.jsx)(n.a,{href:"https://github.com/argoproj/argo/blob/master/workflow/common/util.go#L305",children:"https://github.com/argoproj/a..."})]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u90A3\u4E48\uFF0C\u5BB9\u5668\u5185\u90E8\u5E94\u8BE5\u5982\u4F55\u83B7\u53D6\u8FD9\u4E2A\u811A\u672C\u8F93\u51FA\u5462\uFF1F\u6211\u4EEC\u56DE\u5230 Sidecar\uFF0C\u5728 Wait Container \u4E2D\uFF0C\u6709\u8FD9\u6837\u4E00\u6BB5\u903B\u8F91\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(14764).Z+"",width:"1080",height:"943"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(32248).Z+"",width:"1080",height:"376"})}),"\n",(0,i.jsx)(n.p,{children:"\u518D\u6765\u770B\u770B\u8FD9\u4E2A Wait Container \u7684 Volume Mount \u60C5\u51B5\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(3312).Z+"",width:"1080",height:"488"})}),"\n",(0,i.jsxs)(n.p,{children:["\u73B0\u5728\u5C31\u5341\u5206\u660E\u786E\u4E86\uFF0C",(0,i.jsx)(n.strong,{children:"Wait Container \u901A\u8FC7\u6302\u8F7D docker.sock \u4EE5\u53CA service account\uFF0C\u83B7\u53D6\u5230 Main Container \u4E2D\u7684\u8F93\u51FA\u7ED3\u679C\uFF0C\u5E76\u4FDD\u5B58\u5230 Workflow \u4E2D"}),"\u3002\u5F53\u7136\uFF0C\u56E0\u4E3A Workflow \u4E2D\u4FDD\u5B58\u4E86\u5927\u91CF\u7684\u4FE1\u606F\uFF0C\u5F53\u4E00\u4E2A Workflow \u7684 Step \u8FC7\u591A\u65F6\uFF0C\u6574\u4E2A Workflow \u7684\u7ED3\u6784\u4F1A\u8FC7\u4E8E\u5E9E\u5927\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"3parameter",children:"3\u3001Parameter"}),"\n",(0,i.jsxs)(n.p,{children:["**Parameter \u63D0\u4F9B\u4E86\u4E00\u79CD\u901A\u7528\u673A\u5236\uFF0C\u53EF\u4EE5\u5C06\u6B65\u9AA4\u7684\u7ED3\u679C\u7528\u4F5C\u53C2\u6570\u3002**Parameter \u7684\u5DE5\u4F5C\u539F\u7406\u4E0E\u811A\u672C\u7ED3\u679C\u7C7B\u4F3C\uFF0C\u9664\u4E86\u8F93\u51FA\u53C2\u6570\u7684\u503C\u4F1A\u88AB\u8BBE\u7F6E\u4E3A\u751F\u6210\u6587\u4EF6\u7684\u5185\u5BB9\uFF0C\u800C\u4E0D\u662F stdout \u7684\u5185\u5BB9\u3002\u5982\uFF1A",(0,i.jsx)(n.br,{}),"\n",(0,i.jsx)(n.img,{src:r(33401).Z+"",width:"1080",height:"338"})]}),"\n",(0,i.jsx)(n.h3,{id:"4volume",children:"4\u3001Volume"}),"\n",(0,i.jsx)(n.p,{children:"\u8FD9\u5E76\u4E0D\u662F Argo \u5904\u7406\u4EA7\u7269\u4F20\u9012\u7684\u4E00\u79CD\u6807\u51C6\u65B9\u5F0F\uFF0C\u4F46\u662F\u901A\u8FC7\u5171\u4EAB\u5B58\u50A8\uFF0C\u6211\u4EEC\u663E\u7136\u4E5F\u80FD\u8FBE\u5230\u5171\u901A\u4EA7\u7269\u7684\u7ED3\u679C\u3002\u5F53\u7136\uFF0C\u5982\u679C\u4F7F\u7528 Volume\uFF0C\u6211\u4EEC\u5219\u65E0\u9700\u501F\u52A9 Inputs \u548C Outputs\u3002\u5728 Workflow \u7684 Spec \u4E2D\uFF0C\u6211\u4EEC\u5B9A\u4E49\u4E00\u4E2A Volume \u6A21\u677F\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(2443).Z+"",width:"1080",height:"392"})}),"\n",(0,i.jsx)(n.p,{children:"\u5E76\u5728\u5176\u4ED6\u7684 template \u4E2D mount \u8BE5 volume\uFF1A"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(25721).Z+"",width:"1080",height:"289"})}),"\n",(0,i.jsx)(n.h2,{id:"\u516D\u6D41\u7A0B\u63A7\u5236\u529F\u80FD",children:"\u516D\u3001\u6D41\u7A0B\u63A7\u5236\u529F\u80FD"}),"\n",(0,i.jsx)(n.h3,{id:"1\u5FAA\u73AF",children:"1\u3001\u5FAA\u73AF"}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u7F16\u5199 Workflow \u65F6\uFF0C\u80FD\u591F\u5FAA\u73AF\u8FED\u4EE3\u4E00\u7EC4\u8F93\u5165\u901A\u5E38\u662F\u975E\u5E38\u6709\u7528\u7684\uFF0C\u5982\u4E0B\u4F8B\u6240\u793A:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(3541).Z+"",width:"1080",height:"383"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u6E90\u7801\u5B9E\u73B0\u4E2D\uFF0C\u5C06\u4F1A\u53BB\u5224\u65AD withItems\uFF0C\u5982\u679C\u5B58\u5728\uFF0C\u5219\u5BF9\u5176\u4E2D\u7684\u6BCF\u4E2A\u5143\u7D20\u8FDB\u884C\u4E00\u6B21 step \u7684\u6269\u5C55\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(58749).Z+"",width:"1080",height:"774"})}),"\n",(0,i.jsx)(n.h3,{id:"2\u6761\u4EF6\u5224\u65AD",children:"2\u3001\u6761\u4EF6\u5224\u65AD"}),"\n",(0,i.jsxs)(n.p,{children:["\u901A\u8FC7 ",(0,i.jsx)(n.code,{children:"when"})," \u5173\u952E\u5B57\u6307\u5B9A\uFF1A"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(2304).Z+"",width:"1080",height:"454"})}),"\n",(0,i.jsx)(n.h3,{id:"3\u9519\u8BEF\u91CD\u8BD5",children:"3\u3001\u9519\u8BEF\u91CD\u8BD5"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(58305).Z+"",width:"1080",height:"313"})}),"\n",(0,i.jsx)(n.h3,{id:"4\u9012\u5F52",children:"4\u3001\u9012\u5F52"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Template \u53EF\u4EE5\u9012\u5F52\u5730\u76F8\u4E92\u8C03\u7528"}),"\uFF0C\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u5B9E\u7528\u7684\u529F\u80FD\u3002\u4F8B\u5982\u5728\u673A\u5668\u5B66\u4E60\u573A\u666F\u4E2D\uFF1A\u53EF\u4EE5\u8BBE\u5B9A\u51C6\u786E\u7387\u5FC5\u987B\u6EE1\u8DB3\u4E00\u4E2A\u503C\uFF0C\u5426\u5219\u5C31\u6301\u7EED\u8FDB\u884C\u8BAD\u7EC3\u3002\u5728\u4E0B\u9762\u8FD9\u4E2A\u629B\u786C\u5E01\u4F8B\u5B50\u4E2D\uFF0C\u6211\u4EEC\u53EF\u4EE5\u6301\u7EED\u629B\u786C\u5E01\uFF0C\u76F4\u5230\u51FA\u73B0\u6B63\u9762\u624D\u7ED3\u675F\u6574\u4E2A\u5DE5\u4F5C\u6D41\u3002"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(79790).Z+"",width:"1080",height:"1002"})}),"\n",(0,i.jsx)(n.p,{children:"\u4EE5\u4E0B\u662F\u4E24\u6B21\u6267\u884C\u7684\u7ED3\u679C\uFF0C\u7B2C\u4E00\u6B21\u6267\u884C\u76F4\u63A5\u629B\u5230\u6B63\u9762\uFF0C\u7ED3\u675F\u6D41\u7A0B\uFF1B\u7B2C\u4E8C\u6B21\u91CD\u590D\u4E09\u6B21\u540E\u624D\u629B\u5230\u6B63\u9762\uFF0C\u7ED3\u675F\u6D41\u7A0B\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(19961).Z+"",width:"1080",height:"710"})}),"\n",(0,i.jsx)(n.h3,{id:"5\u9000\u51FA\u5904\u7406",children:"5\u3001\u9000\u51FA\u5904\u7406"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"\u9000\u51FA\u5904\u7406\u662F\u4E00\u4E2A\u6307\u5B9A\u5728 workflow \u7ED3\u675F\u65F6\u6267\u884C\u7684 template\uFF0C\u65E0\u8BBA\u6210\u529F\u6216\u5931\u8D25\u3002"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:r(4425).Z+"",width:"1080",height:"192"})}),"\n",(0,i.jsx)(n.h2,{id:"\u4E03\u53C2\u8003\u8D44\u6599",children:"\u4E03\u3001\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://segmentfault.com/a/1190000038979821",children:"https://segmentfault.com/a/1190000038979821"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/argoproj/argo-workflows",children:"https://github.com/argoproj/argo-workflows"})}),"\n"]}),"\n"]})]})}function f(e={}){let{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},19961:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/124113011-5fffbacb91e93-c6e58bd43052515c69d339d277970433.png"},86647:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/143124495-5fffb8cd0ce29-145b0f57687be3d889aa4efd4979cbae.png"},58305:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/1488316399-5fffbab193435-3e042ac83cc57ba933dc121db0a01df8.png"},4425:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/1707708146-5fffbb107bb50-462844b9e7a7f0ae8c99b86862464e2d.png"},3541:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/1714551681-5fffba7f41974-3804f00f0ce66361d51b75532ee0a3ff.png"},2304:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/1732212544-5fffbaa9f3a4f-54db5a7b977363ceb4729f8314c518ac.png"},34091:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2043671593-5fffb84536c0d-1d77831ab9ef9de2681fd18521885279.png"},58749:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2164989231-5fffba8844abe-3612d6827bd220b0cf61241ab5a81c37.png"},2443:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2256174945-5fffba5dc767f-3dd97c228780c3541fd53d699f526341.png"},42050:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2381840871-5fffb856062a4-4b35ec38ef44f0ebc0f74e7249c746bb.png"},18145:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2478719909-5fffb73379d3c-531378f7560a980fb79a3ecdb26186e2.png"},27417:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2657741167-5fffb8c009e45-4db8db8968f03a5d0ba268d4dda1f7a6.png"},98413:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/2992108274-5fffb90ac6e9e-23d1f387c673ea2aacf0e804366d2dcf.png"},66471:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3008190936-5fffb8654df09-7ceafc3f619037682f6ba60c6063b339.png"},25721:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3085720282-5fffba6cb8ae6-01c71b8a97310577488b3ab88df448db.png"},79790:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3566924783-5fffbabdcee62-9f22d68899b84aef0c7660320defc5e6.png"},85057:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/368505397-5fffb8e6dbf65-e62804815598ad2e8630df898c49cf04.png"},87432:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3710404115-5fffb6e1af9bc-70e06260f0ca2cabc141f3124d36621f.png"},86179:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3952974062-5fffb8f00b5dc-14bdbc7d72d41de463c6289f6ab243e0.png"},3312:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/3976899563-5fffb9477dcc3-77e275983758415b8b8dcd247b25f2e0.png"},32248:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/4120955339-5fffb922eee06-418fcdf47aa018788d826e3d92b5d3df.png"},14764:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/455755801-5fffb91c238b1-9a5228b39cad5863135588493973922b.png"},33401:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/946689225-5fffba4a1a03d-e7e71fff35930ce45f2f2ef35625419b.png"},46718:function(e,n,r){r.d(n,{Z:function(){return t}});let t=r.p+"assets/images/974227319-5fffb6fd58599-ba755b4db8add886a2b0bf828d69d0e0.png"},50065:function(e,n,r){r.d(n,{Z:function(){return l},a:function(){return o}});var t=r(67294);let i={},s=t.createContext(i);function o(e){let n=t.useContext(s);return t.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);