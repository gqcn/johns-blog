"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["3819"],{60771:function(e,l,i){i.r(l),i.d(l,{metadata:()=>d,contentTitle:()=>h,default:()=>a,assets:()=>s,toc:()=>t,frontMatter:()=>c});var d=JSON.parse('{"id":"\u6280\u672F\u67B6\u6784/\u5FAE\u670D\u52A1\u67B6\u6784/\u5FAE\u670D\u52A1\u67B6\u6784\u4F53\u7CFB","title":"\u5FAE\u670D\u52A1\u67B6\u6784\u4F53\u7CFB","description":"\u5168\u9762\u4ECB\u7ECD\u5FAE\u670D\u52A1\u67B6\u6784\u7684\u6838\u5FC3\u7EC4\u6210\u90E8\u5206\uFF0C\u5305\u62EC\u5F00\u53D1\u6846\u67B6\u3001\u670D\u52A1\u6CE8\u518C\u53D1\u73B0\u3001\u8D1F\u8F7D\u5747\u8861\u7B49\u5173\u952E\u6280\u672F\u8981\u7D20","source":"@site/docs/0-\u6280\u672F\u67B6\u6784/1-\u5FAE\u670D\u52A1\u67B6\u6784/0-\u5FAE\u670D\u52A1\u67B6\u6784\u4F53\u7CFB.md","sourceDirName":"0-\u6280\u672F\u67B6\u6784/1-\u5FAE\u670D\u52A1\u67B6\u6784","slug":"/microservice-architecture-system","permalink":"/microservice-architecture-system","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"slug":"/microservice-architecture-system","title":"\u5FAE\u670D\u52A1\u67B6\u6784\u4F53\u7CFB","hide_title":true,"keywords":["\u5FAE\u670D\u52A1\u67B6\u6784","\u5F00\u53D1\u6846\u67B6","\u670D\u52A1\u6CE8\u518C","\u8D1F\u8F7D\u5747\u8861","\u901A\u4FE1\u534F\u8BAE","\u5F00\u53D1\u89C4\u8303"],"description":"\u5168\u9762\u4ECB\u7ECD\u5FAE\u670D\u52A1\u67B6\u6784\u7684\u6838\u5FC3\u7EC4\u6210\u90E8\u5206\uFF0C\u5305\u62EC\u5F00\u53D1\u6846\u67B6\u3001\u670D\u52A1\u6CE8\u518C\u53D1\u73B0\u3001\u8D1F\u8F7D\u5747\u8861\u7B49\u5173\u952E\u6280\u672F\u8981\u7D20"},"sidebar":"mainSidebar","previous":{"title":"\u5FAE\u670D\u52A1\u67B6\u6784","permalink":"/microservice-architecture"},"next":{"title":"\u5FAE\u670D\u52A1\u5206\u5C42\u6A21\u578B","permalink":"/microservice-layered-model"}}'),n=i("85893"),r=i("50065");let c={slug:"/microservice-architecture-system",title:"\u5FAE\u670D\u52A1\u67B6\u6784\u4F53\u7CFB",hide_title:!0,keywords:["\u5FAE\u670D\u52A1\u67B6\u6784","\u5F00\u53D1\u6846\u67B6","\u670D\u52A1\u6CE8\u518C","\u8D1F\u8F7D\u5747\u8861","\u901A\u4FE1\u534F\u8BAE","\u5F00\u53D1\u89C4\u8303"],description:"\u5168\u9762\u4ECB\u7ECD\u5FAE\u670D\u52A1\u67B6\u6784\u7684\u6838\u5FC3\u7EC4\u6210\u90E8\u5206\uFF0C\u5305\u62EC\u5F00\u53D1\u6846\u67B6\u3001\u670D\u52A1\u6CE8\u518C\u53D1\u73B0\u3001\u8D1F\u8F7D\u5747\u8861\u7B49\u5173\u952E\u6280\u672F\u8981\u7D20"},h=void 0,s={},t=[{value:"\u4E00\u3001\u5F00\u53D1\u6846\u67B6",id:"\u4E00\u5F00\u53D1\u6846\u67B6",level:2},{value:"1\u3001\u7EDF\u4E00\u6846\u67B6",id:"1\u7EDF\u4E00\u6846\u67B6",level:3},{value:"2\u3001\u5F00\u53D1\u89C4\u8303",id:"2\u5F00\u53D1\u89C4\u8303",level:3},{value:"3\u3001\u901A\u4FE1\u534F\u8BAE",id:"3\u901A\u4FE1\u534F\u8BAE",level:3},{value:"4\u3001\u5F00\u53D1\u5DE5\u5177\u94FE",id:"4\u5F00\u53D1\u5DE5\u5177\u94FE",level:3},{value:"\u4E8C\u3001\u6CE8\u518C\u53D1\u73B0",id:"\u4E8C\u6CE8\u518C\u53D1\u73B0",level:2},{value:"\u4E09\u3001\u8D1F\u8F7D\u5747\u8861",id:"\u4E09\u8D1F\u8F7D\u5747\u8861",level:2},{value:"\u56DB\u3001\u914D\u7F6E\u7BA1\u7406",id:"\u56DB\u914D\u7F6E\u7BA1\u7406",level:2},{value:"\u4E94\u3001\u6D88\u606F\u961F\u5217",id:"\u4E94\u6D88\u606F\u961F\u5217",level:2},{value:"\u516D\u3001\u53EF\u89C2\u5BDF\u6027",id:"\u516D\u53EF\u89C2\u5BDF\u6027",level:2},{value:"1\u3001\u5206\u5E03\u5F0F\u94FE\u8DEF\u8DDF\u8E2A",id:"1\u5206\u5E03\u5F0F\u94FE\u8DEF\u8DDF\u8E2A",level:3},{value:"2\u3001Metrics\u6307\u6807\u641C\u96C6",id:"2metrics\u6307\u6807\u641C\u96C6",level:3},{value:"3\u3001\u76D1\u63A7\u544A\u8B66\u5E73\u53F0",id:"3\u76D1\u63A7\u544A\u8B66\u5E73\u53F0",level:3},{value:"\u4E03\u3001\u9650\u6D41\u7194\u65AD",id:"\u4E03\u9650\u6D41\u7194\u65AD",level:2},{value:"\u516B\u3001\u6838\u5FC3\u7EC4\u4EF6",id:"\u516B\u6838\u5FC3\u7EC4\u4EF6",level:2},{value:"1\u3001\u65E5\u5FD7\u641C\u96C6",id:"1\u65E5\u5FD7\u641C\u96C6",level:3},{value:"2\u3001\u5206\u5E03\u5F0F\u9501",id:"2\u5206\u5E03\u5F0F\u9501",level:3},{value:"3\u3001\u5206\u5E03\u5F0F\u7F13\u5B58",id:"3\u5206\u5E03\u5F0F\u7F13\u5B58",level:3},{value:"4\u3001\u5206\u5E03\u5F0F\u4E8B\u52A1",id:"4\u5206\u5E03\u5F0F\u4E8B\u52A1",level:3},{value:"5\u3001\u5168\u5C40\u552F\u4E00ID",id:"5\u5168\u5C40\u552F\u4E00id",level:3},{value:"6\u3001\u5B9A\u65F6\u4EFB\u52A1\u7CFB\u7EDF",id:"6\u5B9A\u65F6\u4EFB\u52A1\u7CFB\u7EDF",level:3},{value:"\u4E5D\u3001\u6301\u7EED\u90E8\u7F72",id:"\u4E5D\u6301\u7EED\u90E8\u7F72",level:2},{value:"1\u3001\u5E73\u6ED1\u91CD\u542F",id:"1\u5E73\u6ED1\u91CD\u542F",level:3},{value:"2\u3001\u52A8\u6001\u4F38\u7F29",id:"2\u52A8\u6001\u4F38\u7F29",level:3},{value:"3\u3001\u5065\u5EB7\u68C0\u67E5",id:"3\u5065\u5EB7\u68C0\u67E5",level:3},{value:"4\u3001\u8D44\u6E90\u9694\u79BB",id:"4\u8D44\u6E90\u9694\u79BB",level:3},{value:"5\u3001\u7070\u5EA6\u53D1\u5E03",id:"5\u7070\u5EA6\u53D1\u5E03",level:3},{value:"6\u3001\u6545\u969C\u8F6C\u79FB",id:"6\u6545\u969C\u8F6C\u79FB",level:3},{value:"7\u3001Docker\u5BB9\u5668\u5316",id:"7docker\u5BB9\u5668\u5316",level:3},{value:"\u5341\u3001\u57FA\u7840\u7406\u8BBA",id:"\u5341\u57FA\u7840\u7406\u8BBA",level:2},{value:"1\u3001CAP",id:"1cap",level:3},{value:"2\u3001BASE",id:"2base",level:3},{value:"\u5341\u4E00\u3001\u6280\u672F\u65B9\u6848",id:"\u5341\u4E00\u6280\u672F\u65B9\u6848",level:2},{value:"1\u3001\u7EDF\u4E00\u9519\u8BEF\u5904\u7406",id:"1\u7EDF\u4E00\u9519\u8BEF\u5904\u7406",level:3},{value:"2\u3001\u8DEF\u7531\u6743\u9650\u63A7\u5236",id:"2\u8DEF\u7531\u6743\u9650\u63A7\u5236",level:3},{value:"3\u3001\u5FAE\u670D\u52A1\u95F4\u8BA4\u8BC1\u673A\u5236",id:"3\u5FAE\u670D\u52A1\u95F4\u8BA4\u8BC1\u673A\u5236",level:3},{value:"4\u3001\u670D\u52A1\u964D\u7EA7\u65B9\u6848",id:"4\u670D\u52A1\u964D\u7EA7\u65B9\u6848",level:3},{value:"5\u3001\u8D85\u65F6\u548C\u91CD\u8BD5\u673A\u5236",id:"5\u8D85\u65F6\u548C\u91CD\u8BD5\u673A\u5236",level:3},{value:"6\u3001\u5E42\u7B49\u6027\u673A\u5236",id:"6\u5E42\u7B49\u6027\u673A\u5236",level:3},{value:"7\u3001\u5206\u5E93\u5206\u8868",id:"7\u5206\u5E93\u5206\u8868",level:3},{value:"8\u3001GraghQL",id:"8graghql",level:3},{value:"\u5341\u4E8C\u3001\u57F9\u8BAD\u6307\u5BFC",id:"\u5341\u4E8C\u57F9\u8BAD\u6307\u5BFC",level:2},{value:"1\u3001\u6587\u6863\u8F93\u51FA",id:"1\u6587\u6863\u8F93\u51FA",level:3},{value:"2\u3001\u5B9A\u671F\u5BA3\u8BB2",id:"2\u5B9A\u671F\u5BA3\u8BB2",level:3},{value:"3\u3001\u95EE\u9898\u534F\u52A9",id:"3\u95EE\u9898\u534F\u52A9",level:3}];function v(e){let l={h2:"h2",h3:"h3",p:"p",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(l.p,{children:"\u5148\u5217\u4E2A\u5927\u7EB2\uFF0C\u9646\u7EED\u5B8C\u5584\u5185\u5BB9\u3002"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E00\u5F00\u53D1\u6846\u67B6",children:"\u4E00\u3001\u5F00\u53D1\u6846\u67B6"}),"\n",(0,n.jsx)(l.h3,{id:"1\u7EDF\u4E00\u6846\u67B6",children:"1\u3001\u7EDF\u4E00\u6846\u67B6"}),"\n",(0,n.jsx)(l.h3,{id:"2\u5F00\u53D1\u89C4\u8303",children:"2\u3001\u5F00\u53D1\u89C4\u8303"}),"\n",(0,n.jsx)(l.p,{children:"\u5305\u62EC\u524D\u540E\u7AEF\u5206\u79BB\u7684\u63A5\u53E3\u89C4\u8303\u548C\u8C03\u8BD5\u3002"}),"\n",(0,n.jsx)(l.h3,{id:"3\u901A\u4FE1\u534F\u8BAE",children:"3\u3001\u901A\u4FE1\u534F\u8BAE"}),"\n",(0,n.jsx)(l.h3,{id:"4\u5F00\u53D1\u5DE5\u5177\u94FE",children:"4\u3001\u5F00\u53D1\u5DE5\u5177\u94FE"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E8C\u6CE8\u518C\u53D1\u73B0",children:"\u4E8C\u3001\u6CE8\u518C\u53D1\u73B0"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E09\u8D1F\u8F7D\u5747\u8861",children:"\u4E09\u3001\u8D1F\u8F7D\u5747\u8861"}),"\n",(0,n.jsx)(l.h2,{id:"\u56DB\u914D\u7F6E\u7BA1\u7406",children:"\u56DB\u3001\u914D\u7F6E\u7BA1\u7406"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E94\u6D88\u606F\u961F\u5217",children:"\u4E94\u3001\u6D88\u606F\u961F\u5217"}),"\n",(0,n.jsx)(l.h2,{id:"\u516D\u53EF\u89C2\u5BDF\u6027",children:"\u516D\u3001\u53EF\u89C2\u5BDF\u6027"}),"\n",(0,n.jsx)(l.h3,{id:"1\u5206\u5E03\u5F0F\u94FE\u8DEF\u8DDF\u8E2A",children:"1\u3001\u5206\u5E03\u5F0F\u94FE\u8DEF\u8DDF\u8E2A"}),"\n",(0,n.jsx)(l.h3,{id:"2metrics\u6307\u6807\u641C\u96C6",children:"2\u3001Metrics\u6307\u6807\u641C\u96C6"}),"\n",(0,n.jsx)(l.h3,{id:"3\u76D1\u63A7\u544A\u8B66\u5E73\u53F0",children:"3\u3001\u76D1\u63A7\u544A\u8B66\u5E73\u53F0"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E03\u9650\u6D41\u7194\u65AD",children:"\u4E03\u3001\u9650\u6D41\u7194\u65AD"}),"\n",(0,n.jsx)(l.h2,{id:"\u516B\u6838\u5FC3\u7EC4\u4EF6",children:"\u516B\u3001\u6838\u5FC3\u7EC4\u4EF6"}),"\n",(0,n.jsx)(l.h3,{id:"1\u65E5\u5FD7\u641C\u96C6",children:"1\u3001\u65E5\u5FD7\u641C\u96C6"}),"\n",(0,n.jsx)(l.h3,{id:"2\u5206\u5E03\u5F0F\u9501",children:"2\u3001\u5206\u5E03\u5F0F\u9501"}),"\n",(0,n.jsx)(l.h3,{id:"3\u5206\u5E03\u5F0F\u7F13\u5B58",children:"3\u3001\u5206\u5E03\u5F0F\u7F13\u5B58"}),"\n",(0,n.jsx)(l.h3,{id:"4\u5206\u5E03\u5F0F\u4E8B\u52A1",children:"4\u3001\u5206\u5E03\u5F0F\u4E8B\u52A1"}),"\n",(0,n.jsx)(l.h3,{id:"5\u5168\u5C40\u552F\u4E00id",children:"5\u3001\u5168\u5C40\u552F\u4E00ID"}),"\n",(0,n.jsx)(l.h3,{id:"6\u5B9A\u65F6\u4EFB\u52A1\u7CFB\u7EDF",children:"6\u3001\u5B9A\u65F6\u4EFB\u52A1\u7CFB\u7EDF"}),"\n",(0,n.jsx)(l.h2,{id:"\u4E5D\u6301\u7EED\u90E8\u7F72",children:"\u4E5D\u3001\u6301\u7EED\u90E8\u7F72"}),"\n",(0,n.jsx)(l.h3,{id:"1\u5E73\u6ED1\u91CD\u542F",children:"1\u3001\u5E73\u6ED1\u91CD\u542F"}),"\n",(0,n.jsx)(l.h3,{id:"2\u52A8\u6001\u4F38\u7F29",children:"2\u3001\u52A8\u6001\u4F38\u7F29"}),"\n",(0,n.jsx)(l.h3,{id:"3\u5065\u5EB7\u68C0\u67E5",children:"3\u3001\u5065\u5EB7\u68C0\u67E5"}),"\n",(0,n.jsx)(l.h3,{id:"4\u8D44\u6E90\u9694\u79BB",children:"4\u3001\u8D44\u6E90\u9694\u79BB"}),"\n",(0,n.jsx)(l.h3,{id:"5\u7070\u5EA6\u53D1\u5E03",children:"5\u3001\u7070\u5EA6\u53D1\u5E03"}),"\n",(0,n.jsx)(l.h3,{id:"6\u6545\u969C\u8F6C\u79FB",children:"6\u3001\u6545\u969C\u8F6C\u79FB"}),"\n",(0,n.jsx)(l.h3,{id:"7docker\u5BB9\u5668\u5316",children:"7\u3001Docker\u5BB9\u5668\u5316"}),"\n",(0,n.jsx)(l.h2,{id:"\u5341\u57FA\u7840\u7406\u8BBA",children:"\u5341\u3001\u57FA\u7840\u7406\u8BBA"}),"\n",(0,n.jsx)(l.h3,{id:"1cap",children:"1\u3001CAP"}),"\n",(0,n.jsx)(l.h3,{id:"2base",children:"2\u3001BASE"}),"\n",(0,n.jsx)(l.h2,{id:"\u5341\u4E00\u6280\u672F\u65B9\u6848",children:"\u5341\u4E00\u3001\u6280\u672F\u65B9\u6848"}),"\n",(0,n.jsx)(l.h3,{id:"1\u7EDF\u4E00\u9519\u8BEF\u5904\u7406",children:"1\u3001\u7EDF\u4E00\u9519\u8BEF\u5904\u7406"}),"\n",(0,n.jsx)(l.h3,{id:"2\u8DEF\u7531\u6743\u9650\u63A7\u5236",children:"2\u3001\u8DEF\u7531\u6743\u9650\u63A7\u5236"}),"\n",(0,n.jsx)(l.p,{children:"\u5305\u62EC\u524D\u7AEF\u8DE8\u57DF\u5904\u7406\u3002"}),"\n",(0,n.jsx)(l.h3,{id:"3\u5FAE\u670D\u52A1\u95F4\u8BA4\u8BC1\u673A\u5236",children:"3\u3001\u5FAE\u670D\u52A1\u95F4\u8BA4\u8BC1\u673A\u5236"}),"\n",(0,n.jsx)(l.h3,{id:"4\u670D\u52A1\u964D\u7EA7\u65B9\u6848",children:"4\u3001\u670D\u52A1\u964D\u7EA7\u65B9\u6848"}),"\n",(0,n.jsx)(l.h3,{id:"5\u8D85\u65F6\u548C\u91CD\u8BD5\u673A\u5236",children:"5\u3001\u8D85\u65F6\u548C\u91CD\u8BD5\u673A\u5236"}),"\n",(0,n.jsx)(l.h3,{id:"6\u5E42\u7B49\u6027\u673A\u5236",children:"6\u3001\u5E42\u7B49\u6027\u673A\u5236"}),"\n",(0,n.jsx)(l.h3,{id:"7\u5206\u5E93\u5206\u8868",children:"7\u3001\u5206\u5E93\u5206\u8868"}),"\n",(0,n.jsx)(l.h3,{id:"8graghql",children:"8\u3001GraghQL"}),"\n",(0,n.jsx)(l.h2,{id:"\u5341\u4E8C\u57F9\u8BAD\u6307\u5BFC",children:"\u5341\u4E8C\u3001\u57F9\u8BAD\u6307\u5BFC"}),"\n",(0,n.jsx)(l.h3,{id:"1\u6587\u6863\u8F93\u51FA",children:"1\u3001\u6587\u6863\u8F93\u51FA"}),"\n",(0,n.jsx)(l.h3,{id:"2\u5B9A\u671F\u5BA3\u8BB2",children:"2\u3001\u5B9A\u671F\u5BA3\u8BB2"}),"\n",(0,n.jsx)(l.h3,{id:"3\u95EE\u9898\u534F\u52A9",children:"3\u3001\u95EE\u9898\u534F\u52A9"})]})}function a(e={}){let{wrapper:l}={...(0,r.a)(),...e.components};return l?(0,n.jsx)(l,{...e,children:(0,n.jsx)(v,{...e})}):v(e)}},50065:function(e,l,i){i.d(l,{Z:function(){return h},a:function(){return c}});var d=i(67294);let n={},r=d.createContext(n);function c(e){let l=d.useContext(r);return d.useMemo(function(){return"function"==typeof e?e(l):{...l,...e}},[l,e])}function h(e){let l;return l=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:c(e.components),d.createElement(r.Provider,{value:l},e.children)}}}]);