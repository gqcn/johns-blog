"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2146"],{60306:function(e,d,c){c.r(d),c.d(d,{metadata:()=>n,contentTitle:()=>i,default:()=>j,assets:()=>o,toc:()=>h,frontMatter:()=>l});var n=JSON.parse('{"id":"docs/\u4E91\u539F\u751F/Dragonfly\u4ECB\u7ECD","title":"Dragonfly\u4ECB\u7ECD","description":"Dragonfly\u662F\u4E00\u6B3E\u57FA\u4E8EP2P\u7684\u667A\u80FD\u955C\u50CF\u548C\u6587\u4EF6\u5206\u53D1\u5DE5\u5177\uFF0C\u65E8\u5728\u63D0\u9AD8\u5927\u89C4\u6A21\u6587\u4EF6\u4F20\u8F93\u7684\u6548\u7387\u548C\u901F\u7387\uFF0C\u6700\u5927\u9650\u5EA6\u5730\u5229\u7528\u7F51\u7EDC\u5E26\u5BBD\u3002\u672C\u6587\u4ECB\u7ECD\u4E86Dragonfly\u7684\u67B6\u6784\u3001\u5DE5\u4F5C\u539F\u7406\u53CA\u5176\u5728\u5E94\u7528\u5206\u53D1\u3001\u7F13\u5B58\u5206\u53D1\u3001\u65E5\u5FD7\u5206\u53D1\u548C\u955C\u50CF\u5206\u53D1\u7B49\u9886\u57DF\u7684\u5E94\u7528\u3002","source":"@site/docs/docs/3000-\u4E91\u539F\u751F/1000-Dragonfly\u4ECB\u7ECD.md","sourceDirName":"docs/3000-\u4E91\u539F\u751F","slug":"/cloud-native/dragonfly","permalink":"/cloud-native/dragonfly","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1000,"frontMatter":{"slug":"/cloud-native/dragonfly","title":"Dragonfly\u4ECB\u7ECD","hide_title":true,"keywords":["Dragonfly","P2P","\u6587\u4EF6\u5206\u53D1","\u955C\u50CF\u52A0\u901F","CNCF","Scheduler","\u5206\u5E03\u5F0F\u4E0B\u8F7D","\u5BB9\u5668\u955C\u50CF","Nydus"],"description":"Dragonfly\u662F\u4E00\u6B3E\u57FA\u4E8EP2P\u7684\u667A\u80FD\u955C\u50CF\u548C\u6587\u4EF6\u5206\u53D1\u5DE5\u5177\uFF0C\u65E8\u5728\u63D0\u9AD8\u5927\u89C4\u6A21\u6587\u4EF6\u4F20\u8F93\u7684\u6548\u7387\u548C\u901F\u7387\uFF0C\u6700\u5927\u9650\u5EA6\u5730\u5229\u7528\u7F51\u7EDC\u5E26\u5BBD\u3002\u672C\u6587\u4ECB\u7ECD\u4E86Dragonfly\u7684\u67B6\u6784\u3001\u5DE5\u4F5C\u539F\u7406\u53CA\u5176\u5728\u5E94\u7528\u5206\u53D1\u3001\u7F13\u5B58\u5206\u53D1\u3001\u65E5\u5FD7\u5206\u53D1\u548C\u955C\u50CF\u5206\u53D1\u7B49\u9886\u57DF\u7684\u5E94\u7528\u3002"},"sidebar":"mainSidebar","previous":{"title":"Volcano\u8C03\u5EA6\u5668Actions & Plugins","permalink":"/cloud-native/volcano-scheduler-actions-plugins"},"next":{"title":"Docker\u548CContainerd\u5E38\u7528\u547D\u4EE4\u5BF9\u6BD4","permalink":"/cloud-native/docker-containerd-commands"}}'),r=c("85893"),s=c("50065");let l={slug:"/cloud-native/dragonfly",title:"Dragonfly\u4ECB\u7ECD",hide_title:!0,keywords:["Dragonfly","P2P","\u6587\u4EF6\u5206\u53D1","\u955C\u50CF\u52A0\u901F","CNCF","Scheduler","\u5206\u5E03\u5F0F\u4E0B\u8F7D","\u5BB9\u5668\u955C\u50CF","Nydus"],description:"Dragonfly\u662F\u4E00\u6B3E\u57FA\u4E8EP2P\u7684\u667A\u80FD\u955C\u50CF\u548C\u6587\u4EF6\u5206\u53D1\u5DE5\u5177\uFF0C\u65E8\u5728\u63D0\u9AD8\u5927\u89C4\u6A21\u6587\u4EF6\u4F20\u8F93\u7684\u6548\u7387\u548C\u901F\u7387\uFF0C\u6700\u5927\u9650\u5EA6\u5730\u5229\u7528\u7F51\u7EDC\u5E26\u5BBD\u3002\u672C\u6587\u4ECB\u7ECD\u4E86Dragonfly\u7684\u67B6\u6784\u3001\u5DE5\u4F5C\u539F\u7406\u53CA\u5176\u5728\u5E94\u7528\u5206\u53D1\u3001\u7F13\u5B58\u5206\u53D1\u3001\u65E5\u5FD7\u5206\u53D1\u548C\u955C\u50CF\u5206\u53D1\u7B49\u9886\u57DF\u7684\u5E94\u7528\u3002"},i=void 0,o={},h=[{value:"<strong>\u80CC\u666F</strong>",id:"\u80CC\u666F",level:2},{value:"<strong>\u7F51\u7EDC\u4E0B\u8F7D</strong>",id:"\u7F51\u7EDC\u4E0B\u8F7D",level:3},{value:"<strong>P2P \u4E0B\u8F7D\u539F\u7406</strong>",id:"p2p-\u4E0B\u8F7D\u539F\u7406",level:3},{value:"<strong>\u539F\u7406</strong>",id:"\u539F\u7406",level:3},{value:"<strong>\u67B6\u6784\u7B80\u4ECB</strong>",id:"\u67B6\u6784\u7B80\u4ECB",level:3},{value:"<strong><code>Manager</code></strong>",id:"manager",level:3},{value:"<strong><code>Scheduler</code></strong>",id:"scheduler",level:3},{value:"<strong><code>Seed Peer</code>\u548C<code>Peer</code></strong>",id:"seed-peer\u548Cpeer",level:3},{value:"<strong>Dfstore \u548C Dfcache</strong>",id:"dfstore-\u548C-dfcache",level:3},{value:"<strong>\u7A33\u5B9A\u6027</strong>",id:"\u7A33\u5B9A\u6027",level:3},{value:"<strong>\u9AD8\u6548\u6027</strong>",id:"\u9AD8\u6548\u6027",level:3},{value:"<strong>\u7B80\u5355\u6613\u7528</strong>",id:"\u7B80\u5355\u6613\u7528",level:3},{value:"\u53C2\u8003\u94FE\u63A5",id:"\u53C2\u8003\u94FE\u63A5",level:2}];function x(e){let d={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(d.blockquote,{children:["\n",(0,r.jsxs)(d.p,{children:["\u4E0A\u4E16\u7EAA\u672B\u671F\uFF0C\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"C/S"}),"\u6A21\u5F0F\u7684\u601D\u60F3\uFF0C\u4EBA\u4EEC\u53D1\u5C55\u4E86",(0,r.jsx)(d.code,{children:"HTTP"}),"\u3001",(0,r.jsx)(d.code,{children:"FTP"}),"\u7B49\u5E94\u7528\u5C42\u534F\u8BAE\u3002\u7136\u800C",(0,r.jsx)(d.code,{children:"C/S"}),"\u6A21\u5F0F\u7684\u5F0A\u7AEF\u5F88\u660E\u663E\uFF1A\u670D\u52A1\u5668\u7684\u8D1F\u8F7D\u8FC7\u5927\uFF0C\u4E0B\u8F7D\u901F\u7387\u8FC7\u6162\u3002\u57FA\u4E8E\u4E0A\u8FF0\u80CC\u666F\uFF0C\u6709\u4EBA\u7ED3\u5408",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u4E0E\u8D1F\u8F7D\u5747\u8861\u7684\u601D\u60F3\uFF0C\u63D0\u51FA",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0B\u8F7D\u6A21\u5F0F\u3002"]}),"\n"]}),"\n",(0,r.jsx)(d.h2,{id:"\u80CC\u666F",children:(0,r.jsx)(d.strong,{children:"\u80CC\u666F"})}),"\n",(0,r.jsx)(d.h3,{id:"\u7F51\u7EDC\u4E0B\u8F7D",children:(0,r.jsx)(d.strong,{children:"\u7F51\u7EDC\u4E0B\u8F7D"})}),"\n",(0,r.jsxs)(d.p,{children:["\u63D0\u8D77\u7F51\u7EDC\u4E0B\u8F7D\u9886\u57DF\uFF0C\u4F60\u5E94\u8BE5\u9996\u5148\u4F1A\u60F3\u5230\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"TCP/IP"}),"\u534F\u8BAE\u7C07\u7684",(0,r.jsx)(d.code,{children:"C/S"}),"\u6A21\u5F0F\u3002\u8FD9\u79CD\u6A21\u5F0F\u5E0C\u671B\u6BCF\u4E00\u4E2A\u5BA2\u6237\u673A\u90FD\u4E0E\u670D\u52A1\u5668\u5EFA\u7ACB",(0,r.jsx)(d.code,{children:"TCP"}),"\u8FDE\u63A5\uFF0C\u670D\u52A1\u5668\u8F6E\u8BE2\u76D1\u542C",(0,r.jsx)(d.code,{children:"TCP"}),"\u8FDE\u63A5\u5E76\u4F9D\u6B21\u54CD\u5E94\uFF0C\u5982\u4E0B\u56FE\uFF1A"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"\u7F51\u7EDC\u4E0B\u8F7D",src:c(5593).Z+"",width:"1080",height:"862"})}),"\n",(0,r.jsxs)(d.p,{children:["\u4E0A\u4E16\u7EAA\u672B\u671F\uFF0C\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"C/S"}),"\u6A21\u5F0F\u7684\u601D\u60F3\uFF0C\u4EBA\u4EEC\u53D1\u5C55\u4E86",(0,r.jsx)(d.code,{children:"HTTP"}),"\u3001",(0,r.jsx)(d.code,{children:"FTP"}),"\u7B49\u5E94\u7528\u5C42\u534F\u8BAE\u3002\u7136\u800C",(0,r.jsx)(d.code,{children:"C/S"}),"\u6A21\u5F0F\u7684\u5F0A\u7AEF\u5F88\u660E\u663E\uFF1A\u670D\u52A1\u5668\u7684\u8D1F\u8F7D\u8FC7\u5927\uFF0C\u4E0B\u8F7D\u901F\u7387\u8FC7\u6162\u3002\u968F\u7740\u4E92\u8054\u7F51\u89C4\u6A21\u7684\u589E\u5927\u4EE5\u53CA\u5BA2\u6237\u5BF9\u4E8E\u4E0B\u8F7D\u6570\u636E\u5927\u5C0F\uFF0C\u4E0B\u8F7D\u901F\u7387\u7B49\u9700\u6C42\u7684\u4E0A\u5347\uFF0C\u8FD9\u4E9B\u5F0A\u7AEF\u88AB\u4E0D\u65AD\u653E\u5927\u3002"]}),"\n",(0,r.jsx)(d.h3,{id:"p2p-\u4E0B\u8F7D\u539F\u7406",children:(0,r.jsx)(d.strong,{children:"P2P \u4E0B\u8F7D\u539F\u7406"})}),"\n",(0,r.jsxs)(d.p,{children:["\u57FA\u4E8E\u4E0A\u8FF0\u80CC\u666F\uFF0C\u6709\u4EBA\u7ED3\u5408",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u4E0E\u8D1F\u8F7D\u5747\u8861\u7684\u601D\u60F3\uFF0C\u63D0\u51FA",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0B\u8F7D\u6A21\u5F0F\u3002\u8FD9\u79CD\u6A21\u5F0F\u4E0D\u518D\u628A\u6240\u6709\u7684\u4E0B\u8F7D\u538B\u529B\u4E22\u7ED9\u670D\u52A1\u5668\uFF0C\u670D\u52A1\u5668\u53EA\u8D1F\u8D23\u4F20\u9012\u6587\u4EF6\u5143\u6570\u636E\uFF0C\u771F\u6B63\u7684\u6587\u4EF6\u4E0B\u8F7D\u8FDE\u63A5\u5EFA\u7ACB\u5728\u5BA2\u6237\u673A\u4E0E\u5BA2\u6237\u673A\u4E4B\u95F4\u3002\u540C\u65F6\u4E00\u4E2A\u6587\u4EF6\u53EF\u4EE5\u88AB\u5206\u7247\u4E3A\u591A\u4E2A\u5757\uFF0C\u540C\u4E00\u4E2A\u6587\u4EF6\u4E2D\u4E0D\u540C\u7684\u5757\u53EF\u4EE5\u5728\u4E0D\u540C\u7684\u5BA2\u6237\u673A\u4E4B\u4E0A\u4E0B\u8F7D\uFF0C\u4F7F\u5F97\u4E0B\u8F7D\u6587\u4EF6\u5728",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u4E2D\u52A8\u6001\u6D41\u901A\uFF0C\u5927\u5E45\u63D0\u5347\u4E86\u4E0B\u8F7D\u6548\u7387\uFF0C\u5982\u4E0B\u56FE\uFF1A"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"P2P \u4E0B\u8F7D\u539F\u7406",src:c(13691).Z+"",width:"1080",height:"630"})}),"\n",(0,r.jsxs)(d.p,{children:["\u53BB\u4E2D\u5FC3\u5316\u7684",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0B\u8F7D\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"DHT"}),"\u6280\u672F\uFF0C\u5B83\u91C7\u7528\u5206\u5E03\u5F0F\u5168\u7F51\u65B9\u5F0F\u6765\u8FDB\u884C\u4FE1\u606F\u7684\u5B58\u50A8\u548C\u68C0\u7D22\u3002\u6240\u6709\u4FE1\u606F\u5747\u4EE5\u54C8\u5E0C\u8868\u6761\u76EE\u5F62\u5F0F\u52A0\u4EE5\u5B58\u50A8\uFF0C\u8FD9\u4E9B\u6761\u76EE\u88AB\u5206\u6563\u5730\u5B58\u50A8\u5728\u5404\u4E2A\u8282\u70B9\u4E0A\uFF0C\u4ECE\u800C\u4EE5\u5168\u7F51\u65B9\u5F0F\u6784\u6210\u4E00\u5F20\u5DE8\u5927\u7684\u5206\u5E03\u5F0F\u54C8\u5E0C\u8868\u3002\u5728\u6B64\u57FA\u7840\u4E0A\u505A\u5230\u5BF9\u5355\u670D\u52A1\u5668\u7684\u53BB\u4E2D\u5FC3\u5316\uFF0C\u54C8\u5E0C\u8868\u8D1F\u8D23\u5BF9\u8D1F\u8F7D\u7684\u5206\u644A\uFF0C\u5C06\u5168\u7F51\u8D1F\u8F7D\u5747\u644A\u5230\u591A\u4E2A\u673A\u5668\u4E4B\u4E0A\u3002"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsxs)(d.strong,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u7B80\u4ECB\u53CA\u67B6\u6784\u6982\u8FF0"]})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsxs)(d.strong,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u662F\u4E00\u6B3E\u57FA\u4E8E P2P \u7684\u667A\u80FD\u955C\u50CF\u548C\u6587\u4EF6\u5206\u53D1\u5DE5\u5177"]}),"\u3002\u5B83\u65E8\u5728\u63D0\u9AD8\u5927\u89C4\u6A21\u6587\u4EF6\u4F20\u8F93\u7684\u6548\u7387\u548C\u901F\u7387\uFF0C\u6700\u5927\u9650\u5EA6\u5730\u5229\u7528\u7F51\u7EDC\u5E26\u5BBD\u3002\u5728\u5E94\u7528\u5206\u53D1\u3001\u7F13\u5B58\u5206\u53D1\u3001\u65E5\u5FD7\u5206\u53D1\u548C\u955C\u50CF\u5206\u53D1\u7B49\u9886\u57DF\u88AB\u5927\u89C4\u6A21\u4F7F\u7528\u3002"]}),"\n",(0,r.jsx)(d.h3,{id:"\u539F\u7406",children:(0,r.jsx)(d.strong,{children:"\u539F\u7406"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u7ED3\u5408",(0,r.jsx)(d.code,{children:"C/S"}),"\u67B6\u6784\u4E0E",(0,r.jsx)(d.code,{children:"P2P"}),"\u67B6\u6784\u7684\u4F18\u70B9\u3002\u5B83\u63D0\u4F9B\u9762\u5411\u5BA2\u6237\u7684",(0,r.jsx)(d.code,{children:"C/S"}),"\u67B6\u6784\u4E0B\u8F7D\u6A21\u5F0F\u3002\u540C\u65F6\u5B83\u4E5F\u63D0\u4F9B\u9762\u5411\u670D\u52A1\u5668\u96C6\u7FA4\u7684",(0,r.jsx)(d.code,{children:"P2P"}),"\u56DE\u6E90\u6A21\u5F0F\uFF0C\u4E0E\u4F20\u7EDF",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0D\u540C\u7684\u662F\uFF0C\u5BF9\u7B49\u7F51\u7EDC\u5EFA\u7ACB\u5728",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u5185\u90E8\uFF0C\u76EE\u6807\u662F\u6700\u5927\u5316",(0,r.jsx)(d.code,{children:"P2P"}),"\u5185\u90E8\u4E0B\u8F7D\u6548\u7387\uFF0C\u5982\u4E0B\u56FE\uFF1A"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"Dragonfly\u539F\u7406",src:c(87633).Z+"",width:"1080",height:"845"})}),"\n",(0,r.jsx)(d.h3,{id:"\u67B6\u6784\u7B80\u4ECB",children:(0,r.jsx)(d.strong,{children:"\u67B6\u6784\u7B80\u4ECB"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u9762\u5411\u955C\u50CF\u5206\u53D1\u548C\u6587\u4EF6\u5206\u53D1\uFF0C\u7ED3\u5408",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u548C\u670D\u52A1\u5668\u96C6\u7FA4\u7684\u601D\u60F3\uFF0C\u5411\u7528\u6237\u63D0\u4F9B\u7A33\u5B9A\u7684\u3001\u9AD8\u6548\u7684\u4E0B\u8F7D\u670D\u52A1\u3002",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u5E0C\u671B\u5728\u670D\u52A1\u5668\u5185\u90E8\u6784\u5EFA",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\uFF0C\u5C06\u670D\u52A1\u5668\u7684\u4E0D\u540C\u4E3B\u673A\u8282\u70B9\u5206\u4E3A ",(0,r.jsx)(d.strong,{children:"Manager\u3001Scheduler\u3001Seed Peer \u4EE5\u53CA Peer"})," \u56DB\u4E2A\u89D2\u8272\uFF0C\u5206\u522B\u63D0\u4F9B\u4E0D\u540C\u7684\u529F\u80FD\u3002"]}),"\n",(0,r.jsxs)(d.p,{children:["\u5176\u4E2D",(0,r.jsx)(d.code,{children:"Manager"}),"\u63D0\u4F9B\u603B\u4F53\u914D\u7F6E\u529F\u80FD\uFF0C\u62C9\u53D6\u5176\u4ED6\u89D2\u8272\u7684\u914D\u7F6E\u5E76\u76F8\u4E92\u901A\u4FE1\u3002",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u63D0\u4F9B\u4E0B\u8F7D\u8C03\u5EA6\u529F\u80FD\uFF0C\u5176\u8C03\u5EA6\u7ED3\u679C\u76F4\u63A5\u5F71\u54CD\u4E0B\u8F7D\u901F\u7387\u3002",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u8D1F\u8D23\u56DE\u6E90\u4E0B\u8F7D\uFF0C\u4ECE\u5916\u90E8\u7F51\u7EDC\u4E2D\u62C9\u53D6\u6240\u9700\u7684\u955C\u50CF\u6216\u6587\u4EF6\u3002",(0,r.jsx)(d.code,{children:"Peer"}),"\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"C/S"}),"\u67B6\u6784\u4E2D\u7684\u670D\u52A1\u5668\uFF0C\u901A\u8FC7\u591A\u79CD\u534F\u8BAE\u5411\u5BA2\u6237\u63D0\u4F9B\u4E0B\u8F7D\u529F\u80FD\u3002\u67B6\u6784\u56FE\u5982\u4E0B\uFF1A"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"Dragonfly\u67B6\u6784\u7B80\u4ECB",src:c(75883).Z+"",width:"997",height:"622"})}),"\n",(0,r.jsxs)(d.p,{children:["\u5176\u4E2D\uFF0C",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u652F\u6301\u4F7F\u7528\u591A\u79CD\u534F\u8BAE\u4ECE\u5916\u90E8\u7F51\u7EDC\u4E2D\u56DE\u6E90\u4E0B\u8F7D\uFF0C\u540C\u65F6\u4E5F\u652F\u6301\u5F53\u4F5C\u96C6\u7FA4\u5F53\u4E2D\u4E00\u4E2A",(0,r.jsx)(d.code,{children:"Peer"}),"\u4F7F\u7528\u3002",(0,r.jsx)(d.code,{children:"Peer"}),"\u63D0\u4F9B\u57FA\u4E8E\u591A\u79CD\u534F\u8BAE\u7684\u4E0B\u8F7D\u670D\u52A1\uFF0C\u4E5F\u63D0\u4F9B\u4E3A\u955C\u50CF\u4ED3\u5E93\u6216\u5176\u4ED6\u4E0B\u8F7D\u4EFB\u52A1\u7684\u4EE3\u7406\u670D\u52A1\u3002"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.strong,{children:"\u7EC4\u4EF6\u8BE6\u89E3"})}),"\n",(0,r.jsx)(d.h3,{id:"manager",children:(0,r.jsx)(d.strong,{children:(0,r.jsx)(d.code,{children:"Manager"})})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Manager"}),"\u5728\u591A",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u90E8\u7F72\u7684\u65F6\u5019\u626E\u6F14\u7BA1\u7406\u8005\u7684\u89D2\u8272\uFF0C\u63D0\u4F9B\u524D\u7AEF\u63A7\u5236\u53F0\u65B9\u4FBF\u7528\u6237\u8FDB\u884C\u53EF\u89C6\u5316\u64CD\u4F5C",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u3002\u5176\u4E3B\u8981\u63D0\u4F9B\u52A8\u6001\u914D\u7F6E\u7BA1\u7406\u3001\u7EF4\u62A4\u96C6\u7FA4\u7A33\u5B9A\u6027\u4EE5\u53CA\u7EF4\u62A4\u591A\u5957",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u7684\u5173\u8054\u5173\u7CFB\u7B49\u529F\u80FD\u3002\u5BF9\u4E8E\u7EF4\u62A4\u96C6\u7FA4\u6574\u4F53\u7A33\u5B9A\u6027",(0,r.jsx)(d.code,{children:"Manager"}),"\u548C\u5404\u4E2A\u670D\u52A1\u4FDD\u6301",(0,r.jsx)(d.code,{children:"Keepalive"}),"\u4FDD\u8BC1\u80FD\u591F\u5728\u5B9E\u4F8B\u5F02\u5E38\u60C5\u51B5\u4E0B\u5C06\u5F02\u5E38\u5B9E\u4F8B\u8FDB\u884C\u5254\u9664\u3002\u52A8\u6001\u914D\u7F6E\u7BA1\u7406\u53EF\u4EE5\u5728",(0,r.jsx)(d.code,{children:"Manager"}),"\u4E0A\u9762\u64CD\u4F5C\u5404\u4E2A\u7EC4\u4EF6\u7684\u63A7\u5236\u5355\u5143\uFF0C\u6BD4\u5982\u63A7\u5236",(0,r.jsx)(d.code,{children:"Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u7684\u8D1F\u8F7D\u6570\uFF0C",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u8C03\u5EA6",(0,r.jsx)(d.code,{children:"Parent"}),"\u7684\u4E2A\u6570\u7B49\u3002",(0,r.jsx)(d.code,{children:"Manager"}),"\u4E5F\u53EF\u4EE5\u7EF4\u62A4\u591A\u5957",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u5173\u8054\u5173\u7CFB\uFF0C\u4E00\u4E2A",(0,r.jsx)(d.code,{children:"Scheduler Cluster"}),"\u3001\u4E00\u4E2A",(0,r.jsx)(d.code,{children:"Seed Peer Cluster"}),"\u548C\u82E5\u5E72\u4E2A",(0,r.jsx)(d.code,{children:"Peer"}),"\u7EC4\u6210\u4E00\u4E2A\u5B8C\u6574\u7684",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\uFF0C\u5F53\u7136\u4E0D\u540C",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u53EF\u4EE5\u662F\u7F51\u7EDC\u9694\u79BB\u7684\u3002\u6B63\u5E38\u60C5\u51B5\u4E0B\u91C7\u7528\u4E00\u4E2A\u673A\u623F\u4E00\u5957",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\uFF0C\u7EDF\u4E00\u7531\u4E00\u4E2A",(0,r.jsx)(d.code,{children:"Manager"}),"\u7BA1\u7406\u591A\u4E2A",(0,r.jsx)(d.code,{children:"P2P"}),"\u96C6\u7FA4\u3002"]}),"\n",(0,r.jsx)(d.h3,{id:"scheduler",children:(0,r.jsx)(d.strong,{children:(0,r.jsx)(d.code,{children:"Scheduler"})})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Scheduler"}),"\u4E3B\u8981\u5DE5\u4F5C\u5C31\u662F\u4E3A\u5F53\u524D\u4E0B\u8F7D\u8282\u70B9\u5BFB\u627E\u6700\u4F18\u7236\u8282\u70B9\u5E76\u89E6\u53D1",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u8FDB\u884C\u56DE\u6E90\u4E0B\u8F7D\u3002\u5728\u9002\u5F53\u65F6\u5019\u8BA9",(0,r.jsx)(d.code,{children:"Peer"}),"\u8FDB\u884C\u56DE\u6E90\u4E0B\u8F7D\u3002",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u5728\u542F\u52A8\u65F6\uFF0C\u5148\u5411",(0,r.jsx)(d.code,{children:"Manager"}),"\u6CE8\u518C\uFF0C\u6CE8\u518C\u6210\u529F\u540E\u521D\u59CB\u5316\u52A8\u6001\u914D\u7F6E\u5BA2\u6237\u7AEF\uFF0C\u5E76\u4ECE",(0,r.jsx)(d.code,{children:"Manager"}),"\u62C9\u53D6\u52A8\u6001\u914D\u7F6E\uFF0C\u63A5\u4E0B\u6765\u542F\u52A8",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u81EA\u8EAB\u6240\u9700\u7684\u670D\u52A1\u3002"]}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Scheduler"}),"\u7684\u6838\u5FC3\u5C31\u662F\u9009\u53D6\u4E00\u7EC4\u6700\u4F18",(0,r.jsx)(d.code,{children:"Parent"}),"\u8282\u70B9\u4F9B\u5F53\u524D\u4E0B\u8F7D",(0,r.jsx)(d.code,{children:"Peer"}),"\u8FDB\u884C\u4E0B\u8F7D\u3002",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u9762\u5411",(0,r.jsx)(d.code,{children:"Task"}),"\uFF0C\u4E00\u6B21",(0,r.jsx)(d.code,{children:"Task"}),"\u5C31\u662F\u4E00\u6B21\u5B8C\u6574\u7684\u4E0B\u8F7D\u4EFB\u52A1\uFF0C\u5728",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u4E2D\u5B58\u50A8",(0,r.jsx)(d.code,{children:"Task"}),"\u4FE1\u606F\u548C\u76F8\u5E94",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0B\u8F7D\u7F51\u7EDC\u7684",(0,r.jsx)(d.code,{children:"DAG"}),"\u3002\u8C03\u5EA6\u8FC7\u7A0B\u662F\u9996\u5148\u8FC7\u6EE4\u5F02\u5E38",(0,r.jsx)(d.code,{children:"Parent"}),"\u8282\u70B9\uFF0C\u6839\u636E\u591A\u7EF4\u5EA6\u8FDB\u884C\u8FC7\u6EE4\uFF0C\u6BD4\u5982\u5224\u65AD\u8BE5",(0,r.jsx)(d.code,{children:"Peer"}),"\u662F\u5426\u662F",(0,r.jsx)(d.code,{children:"BadNode"}),"\uFF0C\u5224\u65AD\u903B\u8F91\u4E3A\u5047\u8BBE\u6BCF\u4E2A\u8282\u70B9\u7684\u54CD\u5E94\u65F6\u957F\u90FD\u9075\u5FAA\u6B63\u6001\u5206\u5E03\uFF0C\u82E5\u4E00\u4E2A\u8282\u70B9\u76EE\u524D\u7684\u54CD\u5E94\u65F6\u957F\u5904\u4E8E 6\u03C3 \u8303\u56F4\u4E4B\u5916\uFF0C\u90A3\u4E48\u8BA4\u4E3A\u8BE5\u8282\u70B9\u662F",(0,r.jsx)(d.code,{children:"BadNode"}),"\uFF0C\u5254\u9664\u8BE5\u8282\u70B9\u3002\u518D\u6839\u636E\u5386\u53F2\u4E0B\u8F7D\u7279\u5F81\u503C\u5BF9\u5269\u4F59\u5F85\u5B9A",(0,r.jsx)(d.code,{children:"Parent"}),"\u8282\u70B9\u8FDB\u884C\u6253\u5206\uFF0C\u8FD4\u56DE\u4E00\u7EC4\u5206\u6570\u6700\u9AD8\u7684",(0,r.jsx)(d.code,{children:"Parent"}),"\u63D0\u4F9B\u7ED9\u5F53\u524D",(0,r.jsx)(d.code,{children:"Peer"}),"\u8FDB\u884C\u4E0B\u8F7D\u3002"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"Dragonfly Scheduler",src:c(43893).Z+"",width:"1080",height:"647"})}),"\n",(0,r.jsx)(d.h3,{id:"seed-peer\u548Cpeer",children:(0,r.jsxs)(d.strong,{children:[(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Peer"})]})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Peer"}),"\u6709\u5F88\u591A\u76F8\u4F3C\u4E4B\u5904\u3002\u4ED6\u4EEC\u90FD\u662F\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"Dfdaemon"}),"\uFF0C\u4E0D\u540C\u7684\u662F",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u91C7\u7528",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u6A21\u5F0F\uFF0C\u652F\u6301\u4E3B\u52A8\u89E6\u53D1\u56DE\u6E90\u4E0B\u8F7D\u3002",(0,r.jsx)(d.code,{children:"Peer"}),"\u91C7\u7528",(0,r.jsx)(d.code,{children:"Peer"}),"\u6A21\u5F0F\uFF0C\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"C/S"}),"\u67B6\u6784\u4E2D\u7684\u670D\u52A1\u5668\u5411\u7528\u6237\u63D0\u4F9B\u4E0B\u8F7D\u529F\u80FD\uFF0C\u652F\u6301\u88AB",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u88AB\u52A8\u89E6\u53D1\u56DE\u6E90\u4E0B\u8F7D\u3002\u8FD9\u8868\u660E",(0,r.jsx)(d.code,{children:"Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u7684\u5173\u7CFB\u4E0D\u662F\u56FA\u5B9A\u7684\uFF0C\u4E00\u4E2A",(0,r.jsx)(d.code,{children:"Peer"}),"\u53EF\u4EE5\u901A\u8FC7\u56DE\u6E90\u4F7F\u81EA\u5DF1\u6210\u4E3A",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\uFF0C",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u4E5F\u53EF\u4EE5\u6539\u52A8\u8FD0\u884C\u72B6\u6001\u53D8\u4E3A",(0,r.jsx)(d.code,{children:"Peer"}),"\uFF0C",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u4F1A\u52A8\u6001\u5730\u5BF9\u76F8\u5E94",(0,r.jsx)(d.code,{children:"DAG"}),"\u8FDB\u884C\u6539\u52A8\u3002\u53E6\u5916",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Peer"}),"\u90FD\u9700\u8981\u53C2\u4E0E\u8C03\u5EA6\u4E0B\u8F7D\u8FC7\u7A0B\u5F53\u4E2D\uFF0C",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u53EF\u80FD\u4F1A\u9009\u53D6",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u6216\u8005",(0,r.jsx)(d.code,{children:"Peer"}),"\u4F5C\u4E3A\u7236\u8282\u70B9\u5411\u5176\u4ED6",(0,r.jsx)(d.code,{children:"Peer"}),"\u63D0\u4F9B\u4E0B\u8F7D\u529F\u80FD\u3002"]}),"\n",(0,r.jsx)(d.h3,{id:"dfstore-\u548C-dfcache",children:(0,r.jsx)(d.strong,{children:"Dfstore \u548C Dfcache"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dfcache"}),"\u662F",(0,r.jsx)(d.code,{children:"dragonfly"}),"\u7684\u7F13\u5B58\u5BA2\u6237\u7AEF\uFF0C\u5B83\u4E0E",(0,r.jsx)(d.code,{children:"dfdaemon"}),"\u901A\u4FE1\u5E76\u5BF9",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u4E2D\u7684\u6587\u4EF6\u8FDB\u884C\u64CD\u4F5C\uFF0C\u5176\u4E2D",(0,r.jsx)(d.code,{children:"P2P"}),"\u7F51\u7EDC\u5145\u5F53\u7F13\u5B58\u7CFB\u7EDF\u3002\u53EF\u4EE5\u5728",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u4E2D\u5B58\u50A8\u76F8\u5E94",(0,r.jsx)(d.code,{children:"Task"}),"\u548C",(0,r.jsx)(d.code,{children:"DAG"}),"\u3002"]}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dfstore"}),"\u662F",(0,r.jsx)(d.code,{children:"dragonfly"}),"\u5B58\u50A8\u5BA2\u6237\u7AEF. \u5176\u53EF\u4EE5\u4F9D\u8D56\u4E0D\u540C\u7C7B\u578B\u7684\u5BF9\u8C61\u5B58\u50A8\u670D\u52A1\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"Backend"}),"\uFF0C\u63D0\u4F9B\u7A33\u5B9A\u7684\u5B58\u50A8\u65B9\u6848\uFF0C\u73B0\u5728\u652F\u6301",(0,r.jsx)(d.code,{children:"S3"}),"\u548C",(0,r.jsx)(d.code,{children:"OSS"}),"\u3002",(0,r.jsx)(d.code,{children:"Dfstore"}),"\u4F9D\u8D56",(0,r.jsx)(d.code,{children:"Backend"}),"\u5BF9\u8C61\u5B58\u50A8\u670D\u52A1\u7ED3\u5408",(0,r.jsx)(d.code,{children:"P2P"}),"\u672C\u8EAB\u7684\u52A0\u901F\u7279\u70B9\u3002\u53EF\u505A\u5230\u5FEB\u5199\u5FEB\u8BFB\uFF0C\u5E76\u4E14\u80FD\u591F\u8282\u7701\u56DE\u6E90\u4EE5\u53CA\u8DE8\u673A\u623F\u6D41\u91CF\uFF0C\u51CF\u5C11\u6E90\u7AD9\u538B\u529B\u3002"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.strong,{children:"\u4F18\u52BF"})}),"\n",(0,r.jsx)(d.h3,{id:"\u7A33\u5B9A\u6027",children:(0,r.jsx)(d.strong,{children:"\u7A33\u5B9A\u6027"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u4F1A\u81EA\u52A8\u9694\u79BB\u5F02\u5E38\u8282\u70B9\u6765\u63D0\u9AD8\u4E0B\u8F7D\u7A33\u5B9A\u6027\uFF0C",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u4E2D\u5404\u4E2A\u7EC4\u4EF6\u901A\u8FC7",(0,r.jsx)(d.code,{children:"Keepalive"}),"\u4E0E",(0,r.jsx)(d.code,{children:"Manager"}),"\u8FDB\u884C\u8054\u7CFB\uFF0C",(0,r.jsx)(d.code,{children:"Manager"}),"\u80FD\u591F\u4FDD\u8BC1\u8FD4\u56DE\u7ED9",(0,r.jsx)(d.code,{children:"Peer"}),"\u7684",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u5730\u5740\u548C\u8FD4\u56DE\u7ED9",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u7684",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u5730\u5740\u90FD\u662F\u53EF\u7528\u7684\u3002\u4E0D\u53EF\u7528\u7684",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u548C",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u4E0D\u4F1A\u88AB",(0,r.jsx)(d.code,{children:"Manager"}),"\u63A8\u7ED9\u9700\u8981\u8FDB\u884C\u4E0B\u8F7D\u4EFB\u52A1\u7684",(0,r.jsx)(d.code,{children:"Peer"}),"\u6216",(0,r.jsx)(d.code,{children:"Scheduler"}),"\uFF0C\u4ECE\u800C\u8FBE\u5230\u9694\u79BB\u5F02\u5E38\u8282\u70B9\u7684\u76EE\u7684\uFF0C\u8FD9\u4E5F\u662F\u5B9E\u4F8B\u7EF4\u5EA6\u7684\u5F02\u5E38\u9694\u79BB\uFF0C\u5982\u4E0B\u56FE\uFF1A"]}),"\n",(0,r.jsx)(d.p,{children:(0,r.jsx)(d.img,{alt:"Dragonfly",src:c(55745).Z+"",width:"941",height:"801"})}),"\n",(0,r.jsxs)(d.p,{children:["\u53E6\u5916",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u5728\u8C03\u5EA6\u65F6\u4EE5",(0,r.jsx)(d.code,{children:"Task"}),"\u4E3A\u5355\u4F4D\uFF0C\u4E5F\u786E\u4FDD\u4E86\u6574\u4E2A\u8C03\u5EA6\u8FC7\u7A0B\u7684\u7A33\u5B9A\u6027\u3002\u5728\u6536\u5230\u4E00\u4E2A\u65B0\u7684",(0,r.jsx)(d.code,{children:"Task"}),"\u8C03\u5EA6\u8BF7\u6C42\u4E4B\u540E\uFF0C",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u89E6\u53D1",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u8FDB\u884C\u56DE\u6E90\u4E0B\u8F7D\uFF1B\u5728\u6536\u5230\u4E00\u4E2A\u5DF2\u6709",(0,r.jsx)(d.code,{children:"Task"}),"\u7684\u8C03\u5EA6\u8BF7\u6C42\u4E4B\u540E\uFF0C",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u8C03\u5EA6\u6700\u4F18",(0,r.jsx)(d.code,{children:"Parent Peer"}),"\u96C6\u5408\u8FD4\u56DE\u7ED9",(0,r.jsx)(d.code,{children:"Peer"}),"\u3002\u8FD9\u4E2A\u903B\u8F91\u786E\u4FDD\u4E86\u65E0\u8BBA",(0,r.jsx)(d.code,{children:"Task"}),"\u662F\u5426\u4E0B\u8F7D\u8FC7\uFF0C",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u90FD\u53EF\u4EE5\u5BF9\u5176\u8FDB\u884C\u5904\u7406\u3002\u6B64\u5916\u5728",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u8C03\u5EA6\u8FC7\u7A0B\u4E2D\uFF0C\u5BF9\u54CD\u5E94\u65F6\u957F\u8FC7\u6162\u7684",(0,r.jsx)(d.code,{children:"Peer"}),"\uFF0C\u8BA4\u4E3A\u76EE\u524D\u662F\u5F02\u5E38\u8282\u70B9\uFF0C\u5C06\u4E0D\u4F1A\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"Parent Peer"}),"\u88AB\u8FD4\u8FD8\u3002\u8FD9\u4E5F\u662F",(0,r.jsx)(d.code,{children:"Task"}),"\u7EF4\u5EA6\u7684\u5F02\u5E38\u9694\u79BB\u3002"]}),"\n",(0,r.jsx)(d.h3,{id:"\u9AD8\u6548\u6027",children:(0,r.jsx)(d.strong,{children:"\u9AD8\u6548\u6027"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u91C7\u7528",(0,r.jsx)(d.code,{children:"P2P"}),"\u8FDB\u884C\u670D\u52A1\u7AEF\u5185\u90E8\u7684\u56DE\u6E90\uFF0C",(0,r.jsx)(d.code,{children:"P2P"}),"\u4E0B\u8F7D\u672C\u8EAB\u5373\u5206\u644A\u8D1F\u8F7D\uFF0C\u5C06\u6BCF\u4E2A\u670D\u52A1\u7AEF\u8282\u70B9\u7684\u8D1F\u8F7D\u964D\u5230\u6700\u4F4E\uFF0C\u6709\u4EE5\u4E0B\u51E0\u4E2A\u7EC6\u8282\u4FDD\u8BC1\u4E86",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u4E0B\u8F7D\u7684\u9AD8\u6548\u6027\uFF1A"]}),"\n",(0,r.jsxs)(d.ul,{children:["\n",(0,r.jsxs)(d.li,{children:["\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Scheduler"}),"\u901A\u8FC7\u4E3A\u6BCF\u4E2A\u53EF\u80FD\u7684",(0,r.jsx)(d.code,{children:"Parent"}),"\u6253\u5206\uFF0C\u8FD4\u56DE\u7ED9",(0,r.jsx)(d.code,{children:"Peer"}),"\u76EE\u524D\u5C40\u90E8\u6700\u4F18\u7684",(0,r.jsx)(d.code,{children:"Parent"}),"\u96C6\u5408\uFF0C",(0,r.jsx)(d.code,{children:"Peer"}),"\u57FA\u4E8E\u6B64\u96C6\u5408\u505A\u4E0B\u8F7D\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(d.li,{children:["\n",(0,r.jsxs)(d.p,{children:["\u4E0B\u8F7D\u8FC7\u7A0B\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"Task"}),"\uFF0C\u6BCF\u4E2A",(0,r.jsx)(d.code,{children:"Task"}),"\u5C06\u5F85\u4E0B\u8F7D\u6587\u4EF6\u5206\u4E3A\u591A\u4E2A",(0,r.jsx)(d.code,{children:"Piece"}),"\uFF0C",(0,r.jsx)(d.code,{children:"Peer"}),"\u62FF\u5230\u4E86\u6700\u4F18\u7684",(0,r.jsx)(d.code,{children:"Parent"}),"\u4E4B\u540E\uFF0C\u5411\u6B64\u96C6\u5408\u5E7F\u64AD\u6BCF\u4E2A",(0,r.jsx)(d.code,{children:"Piece"}),"\u7684\u4E0B\u8F7D\u8BF7\u6C42\uFF0C\u96C6\u5408\u4E2D\u7684",(0,r.jsx)(d.code,{children:"Parent"}),"\u6536\u5230\u8BE5\u8BF7\u6C42\u540E\u8FD4\u56DE\u7ED9",(0,r.jsx)(d.code,{children:"Peer"}),"\u5BF9\u5E94",(0,r.jsx)(d.code,{children:"Piece"}),"\u7684\u5143\u4FE1\u606F\uFF0C",(0,r.jsx)(d.code,{children:"Peer"}),"\u5C06\u7B2C\u4E00\u4E2A\u6536\u5230\u7684",(0,r.jsx)(d.code,{children:"Piece"}),"\u5143\u4FE1\u606F\u6240\u5BF9\u5E94\u7684",(0,r.jsx)(d.code,{children:"Parent Peer"}),"\u4F5C\u4E3A\u8BE5",(0,r.jsx)(d.code,{children:"Piece"}),"\u7684\u5B9E\u9645\u4E0B\u8F7D\u6E90\u3002\u8BE5\u505A\u6CD5\u8003\u8651\u5230",(0,r.jsx)(d.code,{children:"Scheduler"}),"\u8FD4\u56DE\u53EF\u7528",(0,r.jsx)(d.code,{children:"Parent"}),"\u5230\u89E6\u53D1\u4E0B\u8F7D\u8FD9\u6BB5\u65F6\u95F4\u5185\u53EF\u80FD\u7684\u53D8\u5316\uFF0C\u540C\u65F6\u5BF9\u4E0D\u540C\u7684",(0,r.jsx)(d.code,{children:"Piece"}),"\uFF0C\u5141\u8BB8",(0,r.jsx)(d.code,{children:"Peer"}),"\u5411\u4E0D\u540C\u7684\u4E0B\u8F7D\u6E90\u83B7\u53D6\u6570\u636E\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(d.li,{children:["\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dfdaemon"}),"\u5206\u4E3A",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u6A21\u5F0F\u548C",(0,r.jsx)(d.code,{children:"Peer"}),"\u6A21\u5F0F\uFF0C\u5141\u8BB8",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Peer"}),"\u8FDB\u884C\u5207\u6362\uFF0C\u53EF\u4EE5\u6839\u636E\u5B9E\u9645\u9700\u6C42\u6539\u53D8\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"Seed Peer"}),"\u548C",(0,r.jsx)(d.code,{children:"Peer"}),"\u7684\u673A\u5668\u6570\u76EE\uFF0C\u52A8\u6001\u8C03\u6574\u66F4\u9002\u5E94\u5B9E\u9645\u60C5\u51B5\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(d.h3,{id:"\u7B80\u5355\u6613\u7528",children:(0,r.jsx)(d.strong,{children:"\u7B80\u5355\u6613\u7528"})}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u63D0\u4F9B",(0,r.jsx)(d.code,{children:"Helm Charts"}),"\u3001",(0,r.jsx)(d.code,{children:"Docker Compose"}),"\u3001",(0,r.jsx)(d.code,{children:"Docker Image"}),"\u4EE5\u53CA\u4E8C\u8FDB\u5236\u7684\u591A\u79CD\u90E8\u7F72\u65B9\u5F0F\u3002\u7528\u6237\u53EF\u4EE5",(0,r.jsxs)(d.strong,{children:["\u5FEB\u901F\u4E00\u952E\u90E8\u7F72\u8FDB\u884C\u4E00\u6B21\u7B80\u5355",(0,r.jsx)(d.code,{children:"POC"})]}),"\uFF0C\u5E76\u4E14\u4E5F\u53EF\u4EE5",(0,r.jsxs)(d.strong,{children:["\u57FA\u4E8E",(0,r.jsx)(d.code,{children:"Helm Charts"}),"\u8FDB\u884C\u5927\u89C4\u6A21\u751F\u4EA7\u90E8\u7F72"]}),"\u3002\u5F53\u7136",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u5404\u4E2A\u670D\u52A1\u90FD\u6709\u5B8C\u5584\u7684",(0,r.jsx)(d.code,{children:"Metrics"}),"\u4E5F\u63D0\u4F9B\u73B0\u6210\u7684",(0,r.jsx)(d.code,{children:"Granafa"}),"\u6A21\u7248\uFF0C\u65B9\u4FBF\u7528\u6237\u89C2\u5BDF",(0,r.jsx)(d.code,{children:"P2P"}),"\u7684\u6D41\u91CF\u8D70\u52BF\u3002"]}),"\n",(0,r.jsxs)(d.p,{children:[(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u4F5C\u4E3A",(0,r.jsx)(d.code,{children:"CNCF"}),"\u5728\u955C\u50CF\u52A0\u901F\u9886\u57DF\u6807\u51C6\u89E3\u51B3\u65B9\u6848\uFF0C\u7ED3\u5408",(0,r.jsx)(d.code,{children:"Dragonfly"}),"\u5B50\u9879\u76EE",(0,r.jsx)(d.code,{children:"Nydus"}),"\u8FDB\u884C\u6309\u9700\u52A0\u8F7D\u53EF\u4EE5",(0,r.jsx)(d.strong,{children:"\u6700\u5927\u9650\u5EA6\u63D0\u5347\u955C\u50CF\u4E0B\u8F7D\u901F\u5EA6"}),"\uFF0C\u672A\u6765\u6211\u4EEC\u4E5F\u4F1A\u7EE7\u7EED\u52AA\u529B\u5EFA\u8BBE\u955C\u50CF\u52A0\u901F\u9886\u57DF\u7684\u751F\u6001\u94FE\u3002\u611F\u8C22\u6240\u6709\u53C2\u4E0E\u5230\u793E\u533A\u5EFA\u8BBE\u7684\u540C\u5B66\uFF0C\u5E0C\u671B\u6709\u66F4\u591A\u5BF9\u955C\u50CF\u52A0\u901F\u9886\u57DF\u6216",(0,r.jsx)(d.code,{children:"P2P"}),"\u611F\u5174\u8DA3\u7684\u540C\u5B66\u52A0\u5165\uFF08\u6587\u672B\u626B\u63CF\u4E8C\u7EF4\u7801\u6216\u641C\u7D22\u9489\u9489\u7FA4\u53F7\uFF1A44701621\u8FDB\u7FA4\u4EA4\u6D41\uFF09\u5230\u6211\u4EEC\u7684\u793E\u533A\u5F53\u4E2D\u3002"]}),"\n",(0,r.jsx)(d.h2,{id:"\u53C2\u8003\u94FE\u63A5",children:"\u53C2\u8003\u94FE\u63A5"}),"\n",(0,r.jsxs)(d.ul,{children:["\n",(0,r.jsx)(d.li,{children:(0,r.jsx)(d.a,{href:"https://github.com/dragonflyoss/dragonfly",children:"https://github.com/dragonflyoss/dragonfly"})}),"\n",(0,r.jsx)(d.li,{children:(0,r.jsx)(d.a,{href:"https://zhuanlan.zhihu.com/p/630101983",children:"https://zhuanlan.zhihu.com/p/630101983"})}),"\n",(0,r.jsx)(d.li,{children:(0,r.jsx)(d.a,{href:"https://developer.aliyun.com/article/1008039?utm_content=m_1000357296",children:"https://developer.aliyun.com/article/1008039?utm_content=m_1000357296"})}),"\n"]})]})}function j(e={}){let{wrapper:d}={...(0,s.a)(),...e.components};return d?(0,r.jsx)(d,{...e,children:(0,r.jsx)(x,{...e})}):x(e)}},43893:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/3a82facd49334978a776f90b5728e015-f995efd5c39adc068f9c677da7d35a1d.png"},55745:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/493a056a5806443db47f4a37b3b1adab-c399f81489939c9bcfc4338fab185881.png"},5593:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/5d3b12856d43463fb737de3b88ee5b89-4d576d6e0504abd77c04b8633d32d1a5.png"},75883:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/b9b9fd0d98f3445f9b09e95014dc996e-d8b1591a7f17a906764b17a1ec223caa.png"},87633:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/fae57f4226fd405f806b67d3aa83c30e-71c2817a57f5e584435799ca9c8533bb.png"},13691:function(e,d,c){c.d(d,{Z:function(){return n}});let n=c.p+"assets/images/fb7c62d1b67049e289acc0fed05e17f5-44b6cb6b978d764494c383c736d57926.png"},50065:function(e,d,c){c.d(d,{Z:function(){return i},a:function(){return l}});var n=c(67294);let r={},s=n.createContext(r);function l(e){let d=n.useContext(s);return n.useMemo(function(){return"function"==typeof e?e(d):{...d,...e}},[d,e])}function i(e){let d;return d=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(s.Provider,{value:d},e.children)}}}]);