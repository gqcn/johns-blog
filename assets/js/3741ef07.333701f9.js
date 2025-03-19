"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["9102"],{50331:function(e,r,t){t.r(r),t.d(r,{metadata:()=>s,contentTitle:()=>c,default:()=>a,assets:()=>o,toc:()=>l,frontMatter:()=>d});var s=JSON.parse('{"id":"docs/\u53EF\u89C2\u6D4B\u6027/\u76D1\u63A7\u6280\u672F/promtheus: rate\u4E0Eirate","title":"promtheus: rate\u4E0Eirate","description":"\u6DF1\u5165\u89E3\u6790 Prometheus \u4E2D rate \u548C irate \u51FD\u6570\u7684\u533A\u522B\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u7528\u6237\u66F4\u597D\u5730\u7406\u89E3\u548C\u9009\u62E9\u5408\u9002\u7684\u6307\u6807\u8BA1\u7B97\u65B9\u6CD5","source":"@site/docs/docs/5000-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F/1-promtheus: rate\u4E0Eirate.md","sourceDirName":"docs/5000-\u53EF\u89C2\u6D4B\u6027/1-\u76D1\u63A7\u6280\u672F","slug":"/observability/prometheus-rate-irate","permalink":"/observability/prometheus-rate-irate","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"slug":"/observability/prometheus-rate-irate","title":"promtheus: rate\u4E0Eirate","hide_title":true,"keywords":["Prometheus","rate","irate","\u76D1\u63A7","\u6307\u6807\u8BA1\u7B97","\u65F6\u5E8F\u6570\u636E"],"description":"\u6DF1\u5165\u89E3\u6790 Prometheus \u4E2D rate \u548C irate \u51FD\u6570\u7684\u533A\u522B\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u7528\u6237\u66F4\u597D\u5730\u7406\u89E3\u548C\u9009\u62E9\u5408\u9002\u7684\u6307\u6807\u8BA1\u7B97\u65B9\u6CD5"},"sidebar":"mainSidebar","previous":{"title":"OpenTelemetry Metrics\u4ECB\u7ECD","permalink":"/observability/opentelemetry-metrics-introduction"},"next":{"title":"prometheus: \u5E38\u7528\u544A\u8B66PromeQL","permalink":"/observability/prometheus-alert-rules"}}'),i=t("85893"),n=t("50065");let d={slug:"/observability/prometheus-rate-irate",title:"promtheus: rate\u4E0Eirate",hide_title:!0,keywords:["Prometheus","rate","irate","\u76D1\u63A7","\u6307\u6807\u8BA1\u7B97","\u65F6\u5E8F\u6570\u636E"],description:"\u6DF1\u5165\u89E3\u6790 Prometheus \u4E2D rate \u548C irate \u51FD\u6570\u7684\u533A\u522B\u548C\u4F7F\u7528\u573A\u666F\uFF0C\u5E2E\u52A9\u7528\u6237\u66F4\u597D\u5730\u7406\u89E3\u548C\u9009\u62E9\u5408\u9002\u7684\u6307\u6807\u8BA1\u7B97\u65B9\u6CD5"},c=void 0,o={},l=[{value:"<code>rate</code>",id:"rate",level:2},{value:"<code>irate</code>",id:"irate",level:2},{value:"\u53C2\u8003\u94FE\u63A5",id:"\u53C2\u8003\u94FE\u63A5",level:2}];function h(e){let r={a:"a",blockquote:"blockquote",br:"br",code:"code",h2:"h2",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:"irate"}),"\u548C",(0,i.jsx)(r.code,{children:"rate"}),"\u90FD\u4F1A\u7528\u4E8E\u8BA1\u7B97\u67D0\u4E2A\u6307\u6807\u5728\u4E00\u5B9A\u65F6\u95F4\u95F4\u9694\u5185\u7684\u53D8\u5316\u901F\u7387\u3002\u4F46\u662F\u5B83\u4EEC\u7684\u8BA1\u7B97\u65B9\u6CD5\u6709\u6240\u4E0D\u540C\uFF1A",(0,i.jsx)(r.code,{children:"irate"}),"\u53D6\u7684\u662F\u5728\u6307\u5B9A\u65F6\u95F4\u8303\u56F4\u5185\u7684",(0,i.jsx)(r.strong,{children:"\u6700\u8FD1\u4E24\u4E2A\u6570\u636E\u70B9"}),"\u6765\u7B97\u901F\u7387\uFF0C\u800C",(0,i.jsx)(r.code,{children:"rate"}),"\u4F1A\u53D6\u6307\u5B9A\u65F6\u95F4",(0,i.jsx)(r.strong,{children:"\u8303\u56F4\u5185\u6240\u6709\u6570\u636E\u70B9"}),"\uFF0C\u7B97\u51FA\u4E00\u7EC4\u901F\u7387\uFF0C\u7136\u540E\u53D6\u5E73\u5747\u503C\u4F5C\u4E3A\u7ED3\u679C\u3002"]}),"\n",(0,i.jsxs)(r.p,{children:["\u6240\u4EE5\u5B98\u7F51\u6587\u6863\u8BF4\uFF1A",(0,i.jsx)(r.code,{children:"irate"}),"\u9002\u5408\u5FEB\u901F\u53D8\u5316\u7684\u8BA1\u6570\u5668\uFF08",(0,i.jsx)(r.code,{children:"counter"}),"\uFF09\uFF0C\u800C",(0,i.jsx)(r.code,{children:"rate"}),"\u9002\u5408\u7F13\u6162\u53D8\u5316\u7684\u8BA1\u6570\u5668\uFF08",(0,i.jsx)(r.code,{children:"counter"}),"\uFF09\u3002"]}),"\n",(0,i.jsxs)(r.p,{children:["\u6839\u636E\u4EE5\u4E0A\u7B97\u6CD5\u6211\u4EEC\u4E5F\u53EF\u4EE5\u7406\u89E3\uFF0C\u5BF9\u4E8E\u5FEB\u901F\u53D8\u5316\u7684\u8BA1\u6570\u5668\uFF0C\u5982\u679C\u4F7F\u7528",(0,i.jsx)(r.code,{children:"rate"}),"\uFF0C\u56E0\u4E3A\u4F7F\u7528\u4E86\u5E73\u5747\u503C\uFF0C\u5F88\u5BB9\u6613\u628A\u5CF0\u503C\u524A\u5E73\u3002\u9664\u975E\u6211\u4EEC\u628A\u65F6\u95F4\u95F4\u9694\u8BBE\u7F6E\u5F97\u8DB3\u591F\u5C0F\uFF0C\u5C31\u80FD\u591F\u51CF\u5F31\u8FD9\u79CD\u6548\u5E94\u3002"]}),"\n",(0,i.jsx)(r.h2,{id:"rate",children:(0,i.jsx)(r.code,{children:"rate"})}),"\n",(0,i.jsxs)(r.p,{children:["\u8BE5\u51FD\u6570\u7528\u6765\u8BA1\u7B97\u67D0\u4E2A\u6307\u6807\u5728\u6700\u8FD1\u4E00\u4E2A\u533A\u95F4\u65F6\u95F4\u5185\u7684\u53D8\u5316\u7387\uFF0C\u5B83\u53EA\u80FD\u7528\u6765\u8BA1\u7B97",(0,i.jsx)(r.code,{children:"Counter"}),"\u7C7B\u578B\u7684\u6307\u6807\u3002",(0,i.jsx)(r.br,{}),"\n","\u6BD4\u5982\u8BF4\uFF0C",(0,i.jsx)(r.code,{children:"Prometheus"}),"\u6BCF",(0,i.jsx)(r.code,{children:"15"}),"\u79D2\u91C7\u96C6\u4E00\u6B21\u6570\u636E\uFF0C\u5F53\u67D0\u4E2A\u6307\u6807",(0,i.jsx)(r.code,{children:"metric1"}),"\u7684\u6570\u636E\u91C7\u96C6\u5982\u4E0B\uFF1A"]}),"\n",(0,i.jsxs)(r.table,{children:[(0,i.jsx)(r.thead,{children:(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.th,{}),(0,i.jsx)(r.th,{})]})}),(0,i.jsxs)(r.tbody,{children:[(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:(0,i.jsx)(r.strong,{children:"timestamp"})}),(0,i.jsx)(r.td,{children:(0,i.jsx)(r.strong,{children:"value"})})]}),(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:"..."}),(0,i.jsx)(r.td,{children:"..."})]}),(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:"15:00:00"}),(0,i.jsx)(r.td,{children:"10000"})]}),(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:"15:00:15"}),(0,i.jsx)(r.td,{children:"10030"})]}),(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:"15:00:30"}),(0,i.jsx)(r.td,{children:"10045"})]}),(0,i.jsxs)(r.tr,{children:[(0,i.jsx)(r.td,{children:"15:00:45"}),(0,i.jsx)(r.td,{children:"10090"})]})]})]}),"\n",(0,i.jsxs)(r.p,{children:["\u5047\u8BBE\u5F53\u524D\u65F6\u95F4\u4E3A",(0,i.jsx)(r.code,{children:"15:00:50"}),"\uFF0C\u6211\u4EEC\u6267\u884CPromQL\u8BED\u53E5",(0,i.jsx)(r.code,{children:"rate(metric1[1m])"}),"\uFF0C\u8BE5\u8BED\u53E5\u7684\u8FD4\u56DE\u503C\u4E3A",(0,i.jsx)(r.code,{children:"2"}),"\uFF0C\u8BA1\u7B97\u8FC7\u7A0B\u5982\u4E0B\uFF1A"]}),"\n",(0,i.jsxs)(r.blockquote,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:"Prometheus"}),"\u4F1A\u67E5\u627E",(0,i.jsx)(r.code,{children:"PromQL"}),"\u8BED\u53E5\u6267\u884C\u65F6\uFF0C",(0,i.jsx)(r.code,{children:"1m"}),"\u5185",(0,i.jsx)(r.code,{children:"\uFF0814:59:51 - 15:00:50\uFF09"}),"\u8BE5\u6307\u6807\u7684\u91C7\u96C6\u70B9\uFF0C\u627E\u5230\u5982\u4E0A",(0,i.jsx)(r.strong,{children:"\u56DB"}),"\u4E2A\u91C7\u96C6\u70B9\uFF0C\u7136\u540E\u7528\u8BE5\u533A\u95F4\u6700\u540E\u4E00\u4E2A\u91C7\u96C6\u70B9\u4E0E\u7B2C\u4E00\u4E2A\u91C7\u96C6\u70B9\u7684",(0,i.jsx)(r.code,{children:"value"}),"\u5DEE\uFF0C\u9664\u4EE5\u4E24\u4E2A\u91C7\u96C6\u70B9\u7684\u65F6\u95F4\u5DEE\uFF08\u79D2\uFF09\uFF0C\u5373",(0,i.jsx)(r.code,{children:"(10090-10000)/(15:00:45-15:00:00)=2"}),"\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"\u9700\u8981\u6CE8\u610F\u7684\u662F\uFF0C\u65F6\u95F4\u533A\u95F4\u7684\u503C\u81F3\u5C11\u8981\u4E3A\u91C7\u6837\u95F4\u9694\u7684\u4E24\u500D\uFF0C\u56E0\u4E3A\u53EA\u6709\u8FD9\u6837\u624D\u80FD\u4FDD\u8BC1\u65F6\u95F4\u533A\u95F4\u5185\u6709\u4E24\u4E2A\u91C7\u6837\u70B9"}),"\u3002\u6BD4\u5982\u4E0A\u9762\u7684\u4F8B\u5B50\u4E2D\uFF0C\u5047\u8BBE\u65F6\u95F4\u533A\u95F4\u8BBE\u4E3A",(0,i.jsx)(r.code,{children:"29"}),"\u79D2\uFF0C",(0,i.jsx)(r.code,{children:"PromQL"}),"\u8BED\u53E5\u7684\u6267\u884C\u65F6\u95F4\u4E3A",(0,i.jsx)(r.code,{children:"15:00:59.99"}),"\u79D2\uFF0C\u90A3\u4E48\u5B83\u4F1A\u67E5\u627E",(0,i.jsx)(r.code,{children:"[15:00:30.99, 15:00:59.99]"}),"\u65F6\u95F4\u5185\u7684\u91C7\u96C6\u70B9\uFF0C\u53D1\u73B0\u53EA\u6709\u4E00\u4E2A\uFF0C\u90A3\u4E48\u5C31\u6CA1\u6709\u529E\u6CD5\u8BA1\u7B97\uFF0C\u5C31\u4F1A\u62A5",(0,i.jsx)(r.code,{children:"No datapoints found"}),"\u7684\u9519\u8BEF\u3002"]}),"\n",(0,i.jsx)(r.h2,{id:"irate",children:(0,i.jsx)(r.code,{children:"irate"})}),"\n",(0,i.jsxs)(r.p,{children:["\u8BE5\u51FD\u6570\u4E0E",(0,i.jsx)(r.code,{children:"rate"}),"\u51FD\u6570\u4E0D\u540C\u7684\u662F\uFF0C\u5B83\u662F\u7528\u533A\u95F4\u5185\u7684\u6700\u540E\u4E00\u4E2A\u91C7\u96C6\u70B9\u4E0E\u5012\u6570\u7B2C\u4E8C\u4E2A\u91C7\u96C6\u70B9\u7684",(0,i.jsx)(r.code,{children:"value"}),"\u5DEE\uFF0C\u9664\u4EE5\u4E24\u4E2A\u91C7\u96C6\u70B9\u7684\u65F6\u95F4\u5DEE\u3002\u5373",(0,i.jsx)(r.code,{children:"15:00:50"}),"\u6267\u884C\u8BED\u53E5",(0,i.jsx)(r.code,{children:"irate(metric1[1m])"}),"\u65F6\uFF0C\u8BA1\u7B97\u51FA\u6765\u7684\u503C\u4E3A",(0,i.jsx)(r.code,{children:"(10090-10045)/(15:00:45-15:00:30)=3"})]}),"\n",(0,i.jsx)(r.h2,{id:"\u53C2\u8003\u94FE\u63A5",children:"\u53C2\u8003\u94FE\u63A5"}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsx)(r.p,{children:(0,i.jsx)(r.a,{href:"https://pshizhsysu.gitbook.io/prometheus/prometheus/promql/nei-zhi-han-shu/rate",children:"https://pshizhsysu.gitbook.io/prometheus/prometheus/promql/nei-zhi-han-shu/rate"})}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsx)(r.p,{children:(0,i.jsx)(r.a,{href:"https://blog.csdn.net/palet/article/details/82763695",children:"https://blog.csdn.net/palet/article/details/82763695"})}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsx)(r.p,{children:(0,i.jsx)(r.a,{href:"https://prometheus.io/docs/prometheus/latest/querying/functions/",children:"https://prometheus.io/docs/prometheus/latest/querying/functions/"})}),"\n"]}),"\n"]})]})}function a(e={}){let{wrapper:r}={...(0,n.a)(),...e.components};return r?(0,i.jsx)(r,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},50065:function(e,r,t){t.d(r,{Z:function(){return c},a:function(){return d}});var s=t(67294);let i={},n=s.createContext(i);function d(e){let r=s.useContext(n);return s.useMemo(function(){return"function"==typeof e?e(r):{...r,...e}},[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),s.createElement(n.Provider,{value:r},e.children)}}}]);