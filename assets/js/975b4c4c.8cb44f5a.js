"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["4107"],{9151:function(e,n,o){o.r(n),o.d(n,{metadata:()=>i,contentTitle:()=>c,default:()=>h,assets:()=>d,toc:()=>t,frontMatter:()=>l});var i=JSON.parse('{"id":"docs/\u4E91\u539F\u751F/Argo Workflow/Argo Workflow\u5F00\u53D1\u73AF\u5883\u642D\u5EFA","title":"Argo Workflow\u5F00\u53D1\u73AF\u5883\u642D\u5EFA","description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u642D\u5EFA Argo Workflow \u7684\u672C\u5730\u5F00\u53D1\u73AF\u5883\uFF0C\u5305\u62EC\u5FC5\u8981\u7684\u5DE5\u5177\u5B89\u88C5\u3001\u914D\u7F6E\u6B65\u9AA4\u548C\u5F00\u53D1\u8C03\u8BD5\u6307\u5357","source":"@site/docs/docs/3000-\u4E91\u539F\u751F/1-Argo Workflow/4-Argo Workflow\u5F00\u53D1\u73AF\u5883\u642D\u5EFA.md","sourceDirName":"docs/3000-\u4E91\u539F\u751F/1-Argo Workflow","slug":"/cloud-native/argo-workflow-development-setup","permalink":"/cloud-native/argo-workflow-development-setup","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"slug":"/cloud-native/argo-workflow-development-setup","title":"Argo Workflow\u5F00\u53D1\u73AF\u5883\u642D\u5EFA","hide_title":true,"keywords":["Argo Workflow","\u5F00\u53D1\u73AF\u5883","\u73AF\u5883\u642D\u5EFA","Kubernetes","\u672C\u5730\u5F00\u53D1","\u8C03\u8BD5\u914D\u7F6E"],"description":"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u642D\u5EFA Argo Workflow \u7684\u672C\u5730\u5F00\u53D1\u73AF\u5883\uFF0C\u5305\u62EC\u5FC5\u8981\u7684\u5DE5\u5177\u5B89\u88C5\u3001\u914D\u7F6E\u6B65\u9AA4\u548C\u5F00\u53D1\u8C03\u8BD5\u6307\u5357"},"sidebar":"mainSidebar","previous":{"title":"Argo Workflow\u7684GC\u7B56\u7565\uFF0C\u4EC0\u4E48\u65F6\u5019\u4F1A\u53BB\u6E05\u7406Pod","permalink":"/cloud-native/argo-workflow-gc-policy"},"next":{"title":"Volcano","permalink":"/cloud-native/volcano"}}'),r=o("85893"),s=o("50065");let l={slug:"/cloud-native/argo-workflow-development-setup",title:"Argo Workflow\u5F00\u53D1\u73AF\u5883\u642D\u5EFA",hide_title:!0,keywords:["Argo Workflow","\u5F00\u53D1\u73AF\u5883","\u73AF\u5883\u642D\u5EFA","Kubernetes","\u672C\u5730\u5F00\u53D1","\u8C03\u8BD5\u914D\u7F6E"],description:"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u642D\u5EFA Argo Workflow \u7684\u672C\u5730\u5F00\u53D1\u73AF\u5883\uFF0C\u5305\u62EC\u5FC5\u8981\u7684\u5DE5\u5177\u5B89\u88C5\u3001\u914D\u7F6E\u6B65\u9AA4\u548C\u5F00\u53D1\u8C03\u8BD5\u6307\u5357"},c=void 0,d={},t=[{value:"\u4E00\u3001\u670D\u52A1\u51C6\u5907",id:"\u4E00\u670D\u52A1\u51C6\u5907",level:2},{value:"1\u3001Golang",id:"1golang",level:3},{value:"2\u3001Yarn",id:"2yarn",level:3},{value:"3\u3001Docker",id:"3docker",level:3},{value:"4\u3001Kustomize",id:"4kustomize",level:3},{value:"5\u3001Protoc",id:"5protoc",level:3},{value:"6\u3001Minikube",id:"6minikube",level:3},{value:"\u4E09\u3001\u8BBE\u7F6Ehosts\u522B\u540D",id:"\u4E09\u8BBE\u7F6Ehosts\u522B\u540D",level:2},{value:"\u56DB\u3001\u7F16\u8BD1\u8FD0\u884C\u670D\u52A1",id:"\u56DB\u7F16\u8BD1\u8FD0\u884C\u670D\u52A1",level:2},{value:"1\u3001\u4F7F\u7528\u672C\u5730MySQL",id:"1\u4F7F\u7528\u672C\u5730mysql",level:3},{value:"1\uFF09\u521B\u5EFA<code>argo</code>\u6570\u636E\u5E93\u4EE5\u53CA<code>mysql</code>\u8D26\u53F7",id:"1\u521B\u5EFAargo\u6570\u636E\u5E93\u4EE5\u53CAmysql\u8D26\u53F7",level:4},{value:"2\uFF09\u6CE8\u91CA\u6389<code>argo-workflows</code>\u9879\u76EE\u4E2D\u7684\u7AEF\u53E3\u8F6C\u53D1",id:"2\u6CE8\u91CA\u6389argo-workflows\u9879\u76EE\u4E2D\u7684\u7AEF\u53E3\u8F6C\u53D1",level:4},{value:"2\u3001\u6267\u884C\u4EE3\u7801\u7F16\u8BD1&amp;\u8FD0\u884C",id:"2\u6267\u884C\u4EE3\u7801\u7F16\u8BD1\u8FD0\u884C",level:3},{value:"\u4E94\u3001\u68C0\u67E5\u670D\u52A1\u72B6\u6001",id:"\u4E94\u68C0\u67E5\u670D\u52A1\u72B6\u6001",level:2},{value:"1\u3001<code>Argo Server API</code>",id:"1argo-server-api",level:3},{value:"2\u3001<code>Argo UI</code>",id:"2argo-ui",level:3},{value:"3\u3001<code>MinIO UI</code>",id:"3minio-ui",level:3},{value:"\u516D\u3001\u6784\u5EFAImage\u955C\u50CF",id:"\u516D\u6784\u5EFAimage\u955C\u50CF",level:2},{value:"1\u3001\u6784\u5EFA\u955C\u50CF",id:"1\u6784\u5EFA\u955C\u50CF",level:3},{value:"2\u3001\u5E38\u89C1\u9519\u8BEF",id:"2\u5E38\u89C1\u9519\u8BEF",level:3},{value:"1\uFF09checksum mismatch",id:"1checksum-mismatch",level:4},{value:"<code>2\uFF09unrecognized import path &quot;golang.org/x/sys&quot;: reading https://golang.org/x/sys?go-get=1: 404 Not Found</code>",id:"2unrecognized-import-path-golangorgxsys-reading-httpsgolangorgxsysgo-get1-404-not-found",level:4},{value:"3\uFF09<code>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory</code>",id:"3fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed---javascript-heap-out-of-memory",level:4},{value:"<code>4\uFF09Container image &quot;argoproj/argoexec:latest&quot; is not present with pull policy of Never</code>",id:"4container-image-argoprojargoexeclatest-is-not-present-with-pull-policy-of-never",level:4},{value:"3\u3001\u7F16\u8BD1\u955C\u50CF\u7ED3\u679C",id:"3\u7F16\u8BD1\u955C\u50CF\u7ED3\u679C",level:4}];function a(e){let n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"Argo Workflow"}),"\u5B98\u65B9\u6709\u4E00\u7BC7\u5173\u4E8E\u672C\u5730\u8FD0\u884C",(0,r.jsx)(n.code,{children:"Argo Workflow"}),"\u7684\u4ECB\u7ECD\uFF1A",(0,r.jsx)(n.a,{href:"https://argoproj.github.io/argo-workflows/running-locally/",children:"https://argoproj.github.io/argo-workflows/running-locally/"}),"\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["\u672C\u5730\u642D\u5EFA\u7684Argo Workflow\u57FA\u4E8E",(0,r.jsx)(n.code,{children:"v3.1.5"}),"\u7248\u672C\uFF0C\u642D\u5EFA\u5F00\u53D1\u73AF\u5883\u4E5F\u8E29\u4E86\u4E00\u4E9B\u5751\uFF0C\u505A\u4E0B\u7B14\u8BB0\uFF0C\u65B9\u4FBF\u540E\u9762\u7684\u540C\u5B66\u6709\u6240\u51C6\u5907\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"\u4E00\u670D\u52A1\u51C6\u5907",children:"\u4E00\u3001\u670D\u52A1\u51C6\u5907"}),"\n",(0,r.jsxs)(n.p,{children:["::: warning\n",(0,r.jsx)(n.code,{children:"MacOS"}),"\u73AF\u5883\u5148\u5B89\u88C5\u597D",(0,r.jsx)(n.code,{children:"brew"}),"\u547D\u4EE4\uFF1A",(0,r.jsx)(n.a,{href:"https://brew.sh/",children:"https://brew.sh/"}),"\n:::"]}),"\n",(0,r.jsx)(n.h3,{id:"1golang",children:"1\u3001Golang"}),"\n",(0,r.jsxs)(n.p,{children:["\u81F3\u5C11\u5B89\u88C5",(0,r.jsx)(n.code,{children:"v1.15"}),"\u4EE5\u4E0A\u7248\u672C\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"2yarn",children:"2\u3001Yarn"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"brew install yarn\n"})}),"\n",(0,r.jsx)(n.h3,{id:"3docker",children:"3\u3001Docker"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://docs.docker.com/docker-for-mac/install/",children:"https://docs.docker.com/docker-for-mac/install/"})}),"\n",(0,r.jsx)(n.h3,{id:"4kustomize",children:"4\u3001Kustomize"}),"\n",(0,r.jsxs)(n.p,{children:["\u5F53\u524D\u4F7F\u7528\u5230\u7684\u662Fv3.8.8\u7248\u672C\uFF1A",(0,r.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv3.8.8",children:"https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize/v3.8.8"})]}),"\n",(0,r.jsxs)(n.p,{children:["\u4E0B\u8F7D\u5BF9\u5E94\u7684\u9884\u7F16\u8BD1\u4E8C\u8FDB\u5236\u6253\u5305\u6587\u4EF6\uFF0C\u89E3\u538B\u540E\u62F7\u8D1D\u4E00\u4EFD\u653E\u5230",(0,r.jsx)(n.code,{children:"$GOPATH/bin"}),"\u76EE\u5F55\u4E0B\uFF08\u5168\u5C40\u7528\uFF09\uFF1B\u518D\u62F7\u8D1D\u4E00\u4EFD\u5230",(0,r.jsx)(n.code,{children:"argo-workflow"}),"\u9879\u76EE\u7684",(0,r.jsx)(n.code,{children:"dist"}),"\u76EE\u5F55\u4E0B\uFF08\u540E\u9762argo\u7F16\u8BD1\u7684\u65F6\u5019\u9700\u8981\uFF09\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"5protoc",children:"5\u3001Protoc"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"brew install protobuf\n"})}),"\n",(0,r.jsx)(n.h3,{id:"6minikube",children:"6\u3001Minikube"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://minikube.sigs.k8s.io/docs/start/",children:"https://minikube.sigs.k8s.io/docs/start/"})}),"\n",(0,r.jsx)(n.h2,{id:"\u4E09\u8BBE\u7F6Ehosts\u522B\u540D",children:"\u4E09\u3001\u8BBE\u7F6Ehosts\u522B\u540D"}),"\n",(0,r.jsxs)(n.p,{children:["\u4FBF\u4E8E\u540E\u7EED\u670D\u52A1\u7684\u5185\u90E8\u522B\u540D\u8BBF\u95EE\uFF0C\u4FEE\u6539 ",(0,r.jsx)(n.code,{children:"/etc/hosts"}),"\uFF1A"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-text",children:"127.0.0.1 dex\n127.0.0.1 minio\n127.0.0.1 postgres\n127.0.0.1 mysql\n"})}),"\n",(0,r.jsx)(n.h2,{id:"\u56DB\u7F16\u8BD1\u8FD0\u884C\u670D\u52A1",children:"\u56DB\u3001\u7F16\u8BD1\u8FD0\u884C\u670D\u52A1"}),"\n",(0,r.jsx)(n.h3,{id:"1\u4F7F\u7528\u672C\u5730mysql",children:"1\u3001\u4F7F\u7528\u672C\u5730MySQL"}),"\n",(0,r.jsx)(n.p,{children:"\u7531\u4E8E\u6211\u672C\u5730\u5B89\u88C5\u6709mysql\uFF0C\u56E0\u6B64argo-workflows\u9879\u76EE\u5B89\u88C5\u7684mysql\u4F1A\u4E0E\u6211\u672C\u5730\u7684\u7AEF\u53E3\u53F7\u51B2\u7A81\u3002\u4E8E\u662F\u5728\u6211\u672C\u5730\u7684MySQL\u4E0A\u521B\u5EFA\u4E00\u4E2Aargo\u6570\u636E\u5E93\u4EE5\u53CA\u5BF9\u5E94\u7684\u8D26\u53F7\uFF0C\u4E0D\u4F7F\u7528minikube\u4E2D\u7684MySQL\u670D\u52A1\u3002"}),"\n",(0,r.jsxs)(n.h4,{id:"1\u521B\u5EFAargo\u6570\u636E\u5E93\u4EE5\u53CAmysql\u8D26\u53F7",children:["1\uFF09\u521B\u5EFA",(0,r.jsx)(n.code,{children:"argo"}),"\u6570\u636E\u5E93\u4EE5\u53CA",(0,r.jsx)(n.code,{children:"mysql"}),"\u8D26\u53F7"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sql",children:"CREATE DATABASE `argo`;\nCREATE USER 'mysql'@'%' IDENTIFIED BY 'password';\nGRANT ALL ON argo.* TO 'mysql'@'%';\n"})}),"\n",(0,r.jsxs)(n.h4,{id:"2\u6CE8\u91CA\u6389argo-workflows\u9879\u76EE\u4E2D\u7684\u7AEF\u53E3\u8F6C\u53D1",children:["2\uFF09\u6CE8\u91CA\u6389",(0,r.jsx)(n.code,{children:"argo-workflows"}),"\u9879\u76EE\u4E2D\u7684\u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(85558).Z+"",width:"2198",height:"1510"})}),"\n",(0,r.jsx)(n.h3,{id:"2\u6267\u884C\u4EE3\u7801\u7F16\u8BD1\u8FD0\u884C",children:"2\u3001\u6267\u884C\u4EE3\u7801\u7F16\u8BD1&\u8FD0\u884C"}),"\n",(0,r.jsx)(n.p,{children:"\u5728argo-workflows\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\u6267\u884C\u7F16\u8BD1\u5B89\u88C5argo-workflows\u76F8\u5173\u670D\u52A1\u5230\u672C\u5730\uFF0C\u5E76\u5728minikube\u4E2D\u521B\u5EFA\u76F8\u5E94\u7684argo\u8D44\u6E90\uFF1A"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make start PROFILE=mysql\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u7F16\u8BD1\u5C06\u4F1A\u4F7F\u7528",(0,r.jsx)(n.code,{children:"mysql"}),"\u670D\u52A1\uFF08\u9ED8\u8BA4\u4F7F\u7528\u7684\u662F",(0,r.jsx)(n.code,{children:"pgsql"}),"\uFF09\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["::: tip\n\u5F53argo\u76F8\u5173\u670D\u52A1\u542F\u52A8\u540E\uFF0C\u53EF\u4EE5\u53D1\u73B0argo\u6570\u636E\u5E93\u88AB\u521D\u59CB\u5316\u4E86\u76F8\u5173\u6570\u636E\u8868\u3002\n",(0,r.jsx)(n.img,{src:o(1505).Z+"",width:"1040",height:"888"}),"\n:::"]}),"\n",(0,r.jsx)(n.h2,{id:"\u4E94\u68C0\u67E5\u670D\u52A1\u72B6\u6001",children:"\u4E94\u3001\u68C0\u67E5\u670D\u52A1\u72B6\u6001"}),"\n",(0,r.jsxs)(n.h3,{id:"1argo-server-api",children:["1\u3001",(0,r.jsx)(n.code,{children:"Argo Server API"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"http://localhost:2746",children:"http://localhost:2746"})}),"\n",(0,r.jsx)(n.p,{children:"::: warning\n\u6CE8\u610F\u67E5\u770B\u7EC8\u7AEF\u65E5\u5FD7\u8F93\u51FA\u4FE1\u606F\uFF0C\u4E0D\u662FHTTPS\u8BBF\u95EE\u3002\n:::"}),"\n",(0,r.jsxs)(n.h3,{id:"2argo-ui",children:["2\u3001",(0,r.jsx)(n.code,{children:"Argo UI"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"http://localhost:8080",children:"http://localhost:8080"})}),"\n",(0,r.jsx)(n.p,{children:"::: warning\n\u521D\u6B21\u8BBF\u95EE\u7684\u65F6\u5019\u4F1A\u6BD4\u8F83\u6162\uFF0C\u6CE8\u610F\u67E5\u770B\u7EC8\u7AEF\u65E5\u5FD7\u8F93\u51FA\u4FE1\u606F\u3002\n:::"}),"\n",(0,r.jsxs)(n.h3,{id:"3minio-ui",children:["3\u3001",(0,r.jsx)(n.code,{children:"MinIO UI"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"http://localhost:9000",children:"http://localhost:9000"}),"\xa0"]}),"\n",(0,r.jsxs)(n.p,{children:["\u8D26\u53F7\uFF1A",(0,r.jsx)(n.code,{children:"admin"})]}),"\n",(0,r.jsxs)(n.p,{children:["\u5BC6\u7801\uFF1A",(0,r.jsx)(n.code,{children:"password"})]}),"\n",(0,r.jsx)(n.h2,{id:"\u516D\u6784\u5EFAimage\u955C\u50CF",children:"\u516D\u3001\u6784\u5EFAImage\u955C\u50CF"}),"\n",(0,r.jsx)(n.p,{children:"::: info\n\u6B63\u5E38\u5B8C\u6574\u7F16\u8BD1\u7EA65\u5206\u949F\u5DE6\u53F3\u3002\n:::"}),"\n",(0,r.jsx)(n.h3,{id:"1\u6784\u5EFA\u955C\u50CF",children:"1\u3001\u6784\u5EFA\u955C\u50CF"}),"\n",(0,r.jsx)(n.p,{children:"**\u8FD9\u4E00\u6B65\u662F\u975E\u5E38\u91CD\u8981\u7684\uFF0C\u5426\u5219\u4F60\u65E0\u6CD5\u521B\u5EFAworkflow\u8D44\u6E90\uFF0C\u56E0\u4E3Aargo\u76F8\u5173\u7684image\u5728\u672C\u5730\u6CA1\u6709\uFF0C\u62C9\u53D6\u955C\u50CF\u4F1A\u5931\u8D25\u3002**\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\u7F16\u8BD1\u5373\u53EF\uFF1A"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"eval $(minikube -p minikube docker-env) && make build\n"})}),"\n",(0,r.jsxs)(n.p,{children:["::: tip\n\u5176\u4E2D\u7684\xa0",(0,r.jsx)(n.code,{children:"eval $(minikube -p minikube docker-env)"})," \u547D\u4EE4\u7528\u4EE5\u8BBE\u7F6E\u5F53\u524D\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u4E3A",(0,r.jsx)(n.code,{children:"Minikube"}),"\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\uFF0C\u540E\u7EED\u5E38\u89C1\u9519\u8BEF\u4E2D\u6709\u4ECB\u7ECD\u3002\n:::"]}),"\n",(0,r.jsx)(n.h3,{id:"2\u5E38\u89C1\u9519\u8BEF",children:"2\u3001\u5E38\u89C1\u9519\u8BEF"}),"\n",(0,r.jsx)(n.h4,{id:"1checksum-mismatch",children:"1\uFF09checksum mismatch"}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679C\u9047\u5230",(0,r.jsx)(n.code,{children:"checksum mismatch"}),"\u7684\u95EE\u9898\uFF1A"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(87310).Z+"",width:"2284",height:"1062"})}),"\n",(0,r.jsxs)(n.p,{children:["\u7531\u4E8E\u7F16\u8BD1\u662F\u4F7F\u7528\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u6267\u884C\uFF0C\u56E0\u6B64\u627E\u5230",(0,r.jsx)(n.code,{children:"Dockerfile"}),"\u5BF9\u5E94\u7684\u5730\u5740\uFF0C\u53BB\u6389",(0,r.jsx)(n.code,{children:"go.sum"}),"\u5373\u53EF\u3002"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(62773).Z+"",width:"2328",height:"770"})}),"\n",(0,r.jsx)(n.h4,{id:"2unrecognized-import-path-golangorgxsys-reading-httpsgolangorgxsysgo-get1-404-not-found",children:(0,r.jsx)(n.code,{children:'2\uFF09unrecognized import path "golang.org/x/sys": reading https://golang.org/x/sys?go-get=1: 404 Not Found'})}),"\n",(0,r.jsx)(n.p,{children:"\u7F16\u8BD1\u9636\u6BB5\u62A5\u9519\uFF1A"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(5924).Z+"",width:"3512",height:"528"})}),"\n",(0,r.jsxs)(n.p,{children:["\u53EF\u80FD\u7531\u4E8E",(0,r.jsx)(n.code,{children:"GFW"}),"\u7684\u5173\u7CFB\u65E0\u6CD5\u8BBF\u95EE\u5BF9\u5E94\u7684\u5730\u5740\uFF0C\u5728\u56FD\u5185\u60F3\u597D\u597D\u64B8\u4EE3\u7801\u771F\u7684\u662F\u592A\u4E0D\u5BB9\u6613\u4E86\uFF0C\u5728",(0,r.jsx)(n.code,{children:"go.mod"}),"\u4E2D\u589E\u52A0\u4E00\u4E2A",(0,r.jsx)(n.code,{children:"replace"}),"\u5427\uFF1A"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:"golang.org/x/sys => github.com/golang/sys v0.0.0-20200317113312-5766fd39f98d\n"})}),"\n",(0,r.jsxs)(n.h4,{id:"3fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed---javascript-heap-out-of-memory",children:["3\uFF09",(0,r.jsx)(n.code,{children:"FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(31179).Z+"",width:"3526",height:"1502"})}),"\n",(0,r.jsxs)(n.p,{children:["\u6211\u82B1\u4E86\u6570\u4E2A\u5C0F\u65F6\u6CA1\u6709\u89E3\u51B3\u901A\u8BE5\u95EE\u9898\uFF0C\u7531\u4E8E\u672C\u6B21\u5F00\u53D1\u4E0D\u4F1A\u6D89\u53CA\u5230UI\u7684\u4FEE\u6539\uFF0C\u56E0\u6B64\u53EF\u4EE5\u628A",(0,r.jsx)(n.code,{children:"Dockerfile"}),"\u4E2D\u6D89\u53CA\u5230",(0,r.jsx)(n.code,{children:"ui"}),"\u7684\u90E8\u5206\u6CE8\u91CA\u6389\u3002\u968F\u540E\u91CD\u65B0\u6267\u884C\u7F16\u8BD1\u547D\u4EE4\u5373\u53EF\u3002"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"![](/attachments/image2021-8-25_19-41-24.png)  "})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(62955).Z+"",width:"2316",height:"984"})}),"\n",(0,r.jsx)(n.h4,{id:"4container-image-argoprojargoexeclatest-is-not-present-with-pull-policy-of-never",children:(0,r.jsx)(n.code,{children:'4\uFF09Container image "argoproj/argoexec:latest" is not present with pull policy of Never'})}),"\n",(0,r.jsx)(n.p,{children:"\u8FD0\u884C\u9636\u6BB5\u62A5\u9519\uFF1A"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(11074).Z+"",width:"3158",height:"662"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"\u53C2\u8003argo\u5B98\u65B9issue\uFF1A[https://github.com/argoproj/argo-workflows/issues/3672](https://github.com/argoproj/argo-workflows/issues/3672)"})}),"\n",(0,r.jsxs)(n.p,{children:["\u4E3B\u8981\u539F\u56E0\u4E5F\u5C31\u662F\u8BF4",(0,r.jsx)(n.code,{children:"Minikube"}),"\u4F7F\u7528\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u548C\u7CFB\u7EDF\u5B89\u88C5\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u4E0D\u4E00\u6837\uFF0C\u6211\u4EEC\u4E4B\u524D\u7F16\u8BD1\u7684\u955C\u50CF\u5728\u9ED8\u8BA4\u60C5\u51B5\u4E0B\u90FD\u662F\u7F16\u8BD1\u5230\u4E86\u7CFB\u7EDF\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u4E0A\u3002\u56E0\u6B64\u6211\u4EEC\u9700\u8981\u5728\u7F16\u8BD1\u7684Shell\u7EC8\u7AEF\u4E0A\u6267\u884C\u4E00\u4E0B ",(0,r.jsx)(n.code,{children:"eval $(minikube -p minikube docker-env)"})," \u547D\u4EE4\uFF0C\u8BBE\u7F6E\u5F53\u524D\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\u4E3A",(0,r.jsx)(n.code,{children:"Minikube"}),"\u7684",(0,r.jsx)(n.code,{children:"Docker"}),"\uFF0C\u968F\u540E\u91CD\u65B0\u6267\u884C\u7F16\u8BD1\u5373\u53EF\uFF1A"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"eval $(minikube -p minikube docker-env) && make build\n"})}),"\n",(0,r.jsx)(n.h4,{id:"3\u7F16\u8BD1\u955C\u50CF\u7ED3\u679C",children:"3\u3001\u7F16\u8BD1\u955C\u50CF\u7ED3\u679C"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:o(49209).Z+"",width:"2820",height:"230"})})]})}function h(e={}){let{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},5924:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-23_15-48-23-d3273ef652370c22c0040ac2044b5f37.png"},62773:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-23_16-53-20-2f0e1fa2fef753deb91e9eaf121a4d45.png"},62955:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-25_19-41-14-f371abfc577f75ac737b43a764dd8f20.png"},87310:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_11-43-11-cee077da973180f69de1d777215df2cc.png"},31179:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_14-31-29-c983c5465cf74262eb511fc7b30a8d26.png"},11074:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_15-43-55-a845ec3f3005d58a2abddc8c808bfeb2.png"},49209:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_15-9-35-710fd7ade5901150f334a25053145f33.png"},85558:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_16-34-51-641f1c6dc61be682402c59dc1bfdda01.png"},1505:function(e,n,o){o.d(n,{Z:function(){return i}});let i=o.p+"assets/images/image2021-8-9_16-36-46-16b51879108137dd1874c3094196ac02.png"},50065:function(e,n,o){o.d(n,{Z:function(){return c},a:function(){return l}});var i=o(67294);let r={},s=i.createContext(r);function l(e){let n=i.useContext(s);return i.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);