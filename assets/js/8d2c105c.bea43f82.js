"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["2214"],{50946:function(e,n,t){t.r(n),t.d(n,{metadata:()=>r,contentTitle:()=>c,default:()=>d,assets:()=>p,toc:()=>o,frontMatter:()=>s});var r=JSON.parse('{"id":"\u53EF\u89C2\u6D4B\u6027/\u94FE\u8DEF\u8DDF\u8E2A/OpenTelemetry\u67B6\u6784","title":"OpenTelemetry\u67B6\u6784","description":"\u8BE6\u7EC6\u89E3\u6790 OpenTelemetry \u7684\u67B6\u6784\u8BBE\u8BA1\u3001\u6838\u5FC3\u7EC4\u4EF6\u548C\u6570\u636E\u6D41\u5411\uFF0C\u5E2E\u52A9\u7406\u89E3\u5176\u5982\u4F55\u5B9E\u73B0\u5206\u5E03\u5F0F\u7CFB\u7EDF\u7684\u5168\u65B9\u4F4D\u76D1\u63A7","source":"@site/docs/4-\u53EF\u89C2\u6D4B\u6027/0-\u94FE\u8DEF\u8DDF\u8E2A/2-OpenTelemetry\u67B6\u6784.md","sourceDirName":"4-\u53EF\u89C2\u6D4B\u6027/0-\u94FE\u8DEF\u8DDF\u8E2A","slug":"/opentelemetry-architecture","permalink":"/opentelemetry-architecture","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/opentelemetry-architecture","title":"OpenTelemetry\u67B6\u6784","hide_title":true,"keywords":["OpenTelemetry","\u67B6\u6784\u8BBE\u8BA1","\u7EC4\u4EF6\u7ED3\u6784","\u6570\u636E\u6D41","\u53EF\u89C2\u5BDF\u6027","\u7CFB\u7EDF\u96C6\u6210"],"description":"\u8BE6\u7EC6\u89E3\u6790 OpenTelemetry \u7684\u67B6\u6784\u8BBE\u8BA1\u3001\u6838\u5FC3\u7EC4\u4EF6\u548C\u6570\u636E\u6D41\u5411\uFF0C\u5E2E\u52A9\u7406\u89E3\u5176\u5982\u4F55\u5B9E\u73B0\u5206\u5E03\u5F0F\u7CFB\u7EDF\u7684\u5168\u65B9\u4F4D\u76D1\u63A7"},"sidebar":"mainSidebar","previous":{"title":"OpenTelemetry\u4ECB\u7ECD","permalink":"/opentelemetry-introduction"},"next":{"title":"\u76D1\u63A7\u6280\u672F","permalink":"/monitoring"}}'),i=t("85893"),l=t("50065");let s={slug:"/opentelemetry-architecture",title:"OpenTelemetry\u67B6\u6784",hide_title:!0,keywords:["OpenTelemetry","\u67B6\u6784\u8BBE\u8BA1","\u7EC4\u4EF6\u7ED3\u6784","\u6570\u636E\u6D41","\u53EF\u89C2\u5BDF\u6027","\u7CFB\u7EDF\u96C6\u6210"],description:"\u8BE6\u7EC6\u89E3\u6790 OpenTelemetry \u7684\u67B6\u6784\u8BBE\u8BA1\u3001\u6838\u5FC3\u7EC4\u4EF6\u548C\u6570\u636E\u6D41\u5411\uFF0C\u5E2E\u52A9\u7406\u89E3\u5176\u5982\u4F55\u5B9E\u73B0\u5206\u5E03\u5F0F\u7CFB\u7EDF\u7684\u5168\u65B9\u4F4D\u76D1\u63A7"},c=void 0,p={},o=[{value:"OpenTelemetry API",id:"opentelemetry-api",level:2},{value:"Tracer API",id:"tracer-api",level:4},{value:"Metric API",id:"metric-api",level:4},{value:"Context API",id:"context-api",level:4},{value:"\u8BED\u4E49\u89C4\u8303",id:"\u8BED\u4E49\u89C4\u8303",level:4},{value:"OpenTelemetry SDK",id:"opentelemetry-sdk",level:2},{value:"Tracer pipeline",id:"tracer-pipeline",level:4},{value:"Meter pipeline",id:"meter-pipeline",level:4},{value:"Meter pipeline",id:"meter-pipeline-1",level:4},{value:"Shared Context layer",id:"shared-context-layer",level:4},{value:"Collector",id:"collector",level:2},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function a(e){let n={a:"a",code:"code",h2:"h2",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",ul:"ul",...(0,l.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(96639).Z+"",width:"891",height:"838"})}),"\n",(0,i.jsx)(n.p,{children:"OpenTelemetry\u67B6\u6784"}),"\n",(0,i.jsx)(n.p,{children:"\u7531\u4E8EOpenTelemetry\u65E8\u5728\u6210\u4E3A\u4E00\u4E2A\u4E3A\u5382\u5546\u548C\u53EF\u89C2\u5BDF\u6027\u540E\u7AEF\u63D0\u4F9B\u7684\u8DE8\u8BED\u8A00\u6846\u67B6\uFF0C\u56E0\u6B64\u5B83\u975E\u5E38\u7075\u6D3B\u4E14\u53EF\u6269\u5C55\uFF0C\u4F46\u540C\u65F6\u4E5F\u5F88\u590D\u6742\u3002OpenTelemetry\u7684\u9ED8\u8BA4\u5B9E\u73B0\u4E2D\uFF0C\u5176\u67B6\u6784\u53EF\u4EE5\u5206\u4E3A\u5982\u4E0B\u4E09\u90E8\u5206\uFF1A"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"OpenTelemetry API"}),"\n",(0,i.jsxs)(n.li,{children:["OpenTelemetry SDK\uFF0C\u5305\u62EC","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Tracer pipeline"}),"\n",(0,i.jsx)(n.li,{children:"Meter pipeline"}),"\n",(0,i.jsx)(n.li,{children:"Shared Context layer"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"Collector"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"opentelemetry-api",children:"OpenTelemetry API"}),"\n",(0,i.jsx)(n.p,{children:"\u5E94\u7528\u5F00\u53D1\u8005\u4F1A\u4F7F\u7528Open Telemetry API\u5BF9\u5176\u4EE3\u7801\u8FDB\u884C\u63D2\u6869\uFF0C\u5E93\u4F5C\u8005\u4F1A\u7528\u5B83(\u5728\u5E93\u4E2D)\u76F4\u63A5\u7F16\u5199\u6869\u529F\u80FD\u3002API\u4E0D\u5904\u7406\u64CD\u4F5C\u95EE\u9898\uFF0C\u4E5F\u4E0D\u5173\u5FC3\u5982\u4F55\u5C06\u6570\u636E\u53D1\u9001\u5230\u5382\u5546\u540E\u7AEF\u3002"}),"\n",(0,i.jsx)(n.p,{children:"API\u5206\u4E3A\u56DB\u4E2A\u90E8\u5206\uFF1A"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"A Tracer API"}),"\n",(0,i.jsx)(n.li,{children:"A Metrics API"}),"\n",(0,i.jsx)(n.li,{children:"A Context API"}),"\n",(0,i.jsx)(n.li,{children:"\u8BED\u4E49\u89C4\u8303"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(29620).Z+"",width:"944",height:"201"})}),"\n",(0,i.jsx)(n.h4,{id:"tracer-api",children:"Tracer API"}),"\n",(0,i.jsx)(n.p,{children:"Tracer API \u652F\u6301\u751F\u6210spans\uFF0C\u53EF\u4EE5\u7ED9span\u5206\u914D\u4E00\u4E2AtraceId\uFF0C\u4E5F\u53EF\u4EE5\u9009\u62E9\u6027\u5730\u52A0\u4E0A\u65F6\u95F4\u6233\u3002\u4E00\u4E2ATracer\u4F1A\u7ED9spans\u6253\u4E0A\u540D\u79F0\u548C\u7248\u672C\u3002\u5F53\u67E5\u770B\u6570\u636E\u65F6\uFF0C\u540D\u79F0\u548C\u7248\u672C\u4F1A\u4E0E\u4E00\u4E2ATracer\u5173\u8054\uFF0C\u901A\u8FC7\u8FD9\u79CD\u65B9\u5F0F\u53EF\u4EE5\u8FFD\u8E2A\u751F\u6210sapan\u7684\u63D2\u88C5\u5E93\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"metric-api",children:"Metric API"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/metrics/api.md",children:"Metric API"}),"\u63D0\u4F9B\u4E86\u591A\u79CD\u7C7B\u578B\u7684Metric instruments(\u6869\u529F\u80FD)\uFF0C\u5982Counters\xa0\u548CObservers\u3002Counters \u5141\u8BB8\u5BF9\u5EA6\u91CF\u8FDB\u884C\u8BA1\u7B97\uFF0CObservers\u5141\u8BB8\u83B7\u53D6\u79BB\u6563\u65F6\u95F4\u70B9\u4E0A\u7684\u6D4B\u91CF\u503C\u3002\u4F8B\u5982\uFF0C\u53EF\u4EE5\u4F7F\u7528Observers\u89C2\u5BDF\u4E0D\u5728Span\u4E0A\u4E0B\u6587\u4E2D\u51FA\u73B0\u7684\u6570\u503C\uFF0C\u5982\u5F53\u524DCPU\u8D1F\u8F7D\u6216\u78C1\u76D8\u4E0A\u7A7A\u95F2\u7684\u5B57\u8282\u6570\u3002"]}),"\n",(0,i.jsx)(n.h4,{id:"context-api",children:"Context API"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/context/context.md",children:"Context API"}),'\xa0\u4F1A\u5728\u4F7F\u7528\u76F8\u540C"context"\u7684spans\u548Ctraces\u4E2D\u6DFB\u52A0\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF0C\u5982',(0,i.jsx)(n.a,{href:"https://www.w3.org/TR/trace-context/",children:"W3C Trace Context"}),",\xa0",(0,i.jsx)(n.a,{href:"https://github.com/openzipkin/b3-propagation",children:"Zipkin B3\u9996\u90E8"}),", \u6216\xa0",(0,i.jsx)(n.a,{href:"https://docs.newrelic.com/docs/understand-dependencies/distributed-tracing/get-started/introduction-distributed-tracing",children:"New Relic distributed tracing"}),"\xa0\u9996\u90E8\u3002\u6B64\u5916\u8BE5API\u5141\u8BB8\u8DDF\u8E2Aspans\u662F\u5982\u4F55\u5728\u4E00\u4E2A\u7CFB\u7EDF\u4E2D\u4F20\u9012\u7684\u3002\u5F53\u4E00\u4E2Atrace\u4ECE\u4E00\u4E2A\u5904\u7406\u4F20\u9012\u5230\u4E0B\u4E00\u4E2A\u5904\u7406\u65F6\u4F1A\u66F4\u65B0\u4E0A\u4E0B\u6587\u4FE1\u606F\u3002Metric instruments\u53EF\u4EE5\u8BBF\u95EE\u5F53\u524D\u4E0A\u4E0B\u6587\u3002"]}),"\n",(0,i.jsx)(n.h4,{id:"\u8BED\u4E49\u89C4\u8303",children:"\u8BED\u4E49\u89C4\u8303"}),"\n",(0,i.jsxs)(n.p,{children:["OpenTelemetry API\u5305\u542B\u4E00\u7EC4 ",(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/overview.md#semantic-conventions.md",children:"\u8BED\u4E49\u89C4\u8303"}),"\uFF0C\u8BE5\u89C4\u8303\u5305\u542B\u4E86\u547D\u540Dspans\u3001\u5C5E\u6027\u4EE5\u53CA\u4E0Espans\u76F8\u5173\u7684\u9519\u8BEF\u3002\u901A\u8FC7\u5C06\u8BE5\u89C4\u8303\u7F16\u7801\u5230API\u63A5\u53E3\u89C4\u8303\u4E2D\uFF0COpenTelemetry \u9879\u76EE\u4FDD\u8BC1\u6240\u6709\u7684instrumentation(\u4E0D\u8BBA\u4EFB\u4F55\u8BED\u8A00)\u90FD\u5305\u542B\u76F8\u540C\u7684\u8BED\u4E49\u4FE1\u606F\u3002\u5BF9\u4E8E\u5E0C\u671B\u4E3A\u6240\u6709\u7528\u6237\u63D0\u4F9B\u4E00\u81F4\u7684APM\u4F53\u9A8C\u7684\u5382\u5546\u6765\u8BF4\uFF0C\u8BE5\u529F\u80FD\u975E\u5E38\u6709\u4EF7\u503C\u3002"]}),"\n",(0,i.jsx)(n.h2,{id:"opentelemetry-sdk",children:"OpenTelemetry SDK"}),"\n",(0,i.jsx)(n.p,{children:"OpenTelemetry SDK\u662FOpenTelemetry API\u7684\u5B9E\u73B0\u3002\u8BE5SDK\u5305\u542B\u4E09\u4E2A\u90E8\u5206\uFF0C\u4E0E\u4E0A\u9762\u7684API\u7C7B\u4F3C\uFF1ATracer, \u4E00\u4E2AMeter, \u548C\u4E00\u4E2AShared Context layer\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(96189).Z+"",width:"1022",height:"735"})}),"\n",(0,i.jsx)(n.p,{children:"\u7406\u60F3\u60C5\u51B5\u4E0B\uFF0CSDK\u5E94\u8BE5\u6EE1\u8DB399%\u7684\u6807\u51C6\u4F7F\u7528\u573A\u666F\uFF0C\u4F46\u5982\u679C\u6709\u5FC5\u8981\uFF0C\u53EF\u4EE5\u81EA\u5B9A\u4E49SDK\u3002\u4F8B\u5982\uFF0C\u53EF\u4EE5\u5728Tracer pipeline\u5B9E\u73B0\u4E2D\u81EA\u5B9A\u4E49\u9664\u6838\u5FC3\u5B9E\u73B0(\u5982\u4F55\u4E0E\u5171\u4EAB\u4E0A\u4E0B\u6587\u5C42\u4EA4\u4E92)\u5916\u7684\u5176\u4ED6\u4EFB\u4F55\u5185\u5BB9\uFF0C\u5982Tracer pipeline\u4F7F\u7528\u7684\u91C7\u6837\u7B97\u6CD5\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"tracer-pipeline",children:"Tracer pipeline"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(31949).Z+"",width:"425",height:"596"})}),"\n",(0,i.jsxs)(n.p,{children:["\u5F53\u914D\u7F6E ",(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/sdk.md",children:"SDK"})," \u65F6\uFF0C\u9700\u8981\u5C06\u4E00\u4E2A\u6216\u591A\u4E2A",(0,i.jsx)(n.code,{children:"SpanProcessors"}),"\u4E0ETracer pipeline\u7684\u5B9E\u73B0\u8FDB\u884C\u5173\u8054\u3002",(0,i.jsx)(n.code,{children:"SpanProcessors"}),"\u4F1A\u67E5\u770Bspans\u7684\u751F\u547D\u5468\u671F\uFF0C\u7136\u540E\u5728\u5408\u9002\u7684\u65F6\u673A\u5C06spans\u4F20\u9001\u5230\u4E00\u4E2A",(0,i.jsx)(n.code,{children:"SpanExporter"}),"\u3002SDK\u4E2D\u5185\u7F6E\u4E86\u4E00\u4E2A\u7B80\u5355\u7684SpanProcessor\uFF0C\u53EF\u4EE5\u5C06\u5B8C\u6210\u7684spans\u76F4\u63A5\u8F6C\u53D1\u7ED9exporter \u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["SDK\u8FD8\u5305\u542B\u4E00\u4E2A\u6279\u5904\u7406\u5B9E\u73B0\uFF0C\u6309\u7167\u53EF\u914D\u7F6E\u7684\u95F4\u9694\u5206\u6279\u6B21\u8F6C\u53D1\u5DF2\u5B8C\u6210\u7684spans\u3002\u4F46\u7531\u4E8E",(0,i.jsx)(n.code,{children:"SpanProcessor"}),'\u7684\u5B9E\u73B0\u53EF\u4EE5\u63A5\u53D7\u63D2\u4EF6\uFF0C\u56E0\u6B64\u53EF\u4EE5\u5728\u5B8C\u6210\u81EA\u5DF1\u7684\u5B9E\u73B0\u540E\u8D4B\u4E88\u5176\u81EA\u5B9A\u4E49\u7684\u884C\u4E3A\u3002\u4F8B\u5982\uFF0C\u5982\u679C\u9065\u6D4B\u540E\u7AEF\u652F\u6301\u89C2\u6D4B"\u6B63\u5728\u8FDB\u884C\u7684"spans\uFF0C\u90A3\u4E48\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2ASpanProcessor\u5B9E\u73B0\uFF0C\u5C06\u6240\u6709span\u72B6\u6001\u53D8\u66F4\u6D89\u53CA\u7684spans\u8F6C\u53D1\u51FA\u53BB\u3002']}),"\n",(0,i.jsxs)(n.p,{children:["Tracer pipeline\u7684\u6700\u540E\u662F",(0,i.jsx)(n.code,{children:"SpanExporter"}),"\u3002\u4E00\u4E2Aexporter\u7684\u5DE5\u4F5C\u5F88\u7B80\u5355\uFF1A\u5C06OpenTelemetry \u7684spans\u8F6C\u6362\u4E3Atelemetry\u540E\u7AEF\u8981\u6C42\u7684\u8868\u8FBE\u683C\u5F0F\uFF0C\u7136\u540E\u8F6C\u53D1\u7ED9\u8BE5\u540E\u7AEF\u5373\u53EF\u3002\u63D0\u4F9B\u5B9A\u5236\u5316\u7684SpanExporter\u662Ftelemetry\u5382\u5546\u63A5\u5165OpenTelemetry\u751F\u6001\u7CFB\u7EDF\u7684\u6700\u7B80\u5355\u65B9\u5F0F\u3002"]}),"\n",(0,i.jsx)(n.h4,{id:"meter-pipeline",children:"Meter pipeline"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(97643).Z+"",width:"774",height:"552"})}),"\n",(0,i.jsx)(n.h4,{id:"meter-pipeline-1",children:"Meter pipeline"}),"\n",(0,i.jsx)(n.p,{children:"Meter pipeline\u8981\u8FDC\u6BD4Tracer pipeline\u590D\u6742\uFF0C\u800Cmetrics\u4E5F\u8FDC\u6BD4span\u590D\u6742\u3002\u4E0B\u9762\u7684\u63CF\u8FF0\u57FA\u4E8Ejava SDK\u5B9E\u73B0\uFF0C\u53EF\u80FD\u8DE8\u8BED\u8A00\u4F1A\u6709\u6240\u4E0D\u540C\u3002"}),"\n",(0,i.jsx)(n.p,{children:"Meter pipeline\u4F1A\u521B\u5EFA\u548C\u7EF4\u62A4\u591A\u79CD\u7C7B\u578B\u7684metric\u5DE5\u5177\uFF0C\u5305\u62ECCounters \u548CObservers\u3002\u6BCF\u4E2A\u5DE5\u5177\u7684\u5B9E\u4F8B\u90FD\u9700\u8981\u4EE5\u67D0\u79CD\u65B9\u5F0F\u805A\u5408\u3002\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CCounters\u901A\u8FC7\u7D2F\u52A0\u6570\u503C\u8FDB\u884C\u805A\u5408\uFF0C\u800CObservers\u901A\u8FC7\u91C7\u96C6\u8BB0\u5F55\u5230\u7684\u6700\u540E\u4E00\u4E2A\u6570\u503C\u8FDB\u884C\u805A\u5408\u3002\u6240\u6709\u7684\u5DE5\u5177\u9ED8\u8BA4\u90FD\u6709\u4E00\u4E2A\u805A\u5408\u3002"}),"\n",(0,i.jsx)(n.p,{children:"(\u5728\u672C\u6587\u7F16\u5199\u4E4B\u9645\uFF0Cmetric\u5DE5\u5177\u7684\u81EA\u5B9A\u4E49\u805A\u5408\u914D\u7F6E\u4ECD\u7136\u5728\u8D77\u8349\u9636\u6BB5)\u3002"}),"\n",(0,i.jsxs)(n.p,{children:["\u4E0D\u540C\u8BED\u8A00\u7684Meter pipeline\u7684\u5B9E\u73B0\u4F1A\u6709\u6240\u4E0D\u540C\uFF0C\u4F46\u6240\u6709\u573A\u666F\u4E0B\uFF0Cmetric\u7684\u805A\u5408\u7ED3\u679C\u90FD\u4F1A\u88AB\u4F20\u9012\u5230",(0,i.jsx)(n.code,{children:"MetricExporter"}),"\u3002\u4E0Espans\u7C7B\u4F3C\uFF0C\u4F9B\u5E94\u5546\u53EF\u4EE5\u63D0\u4F9B\u81EA\u5DF1\u7684exporter\uFF0C\u5C06\u7531metric aggregators\u751F\u6210\u7684\u805A\u5408\u6570\u636E\u8F6C\u6362\u4E3A\u9065\u6D4B\u540E\u7AEF\u6240\u9700\u7684\u7C7B\u578B\u3002"]}),"\n",(0,i.jsx)(n.p,{children:'OpenTelemetry\u652F\u6301\u4E24\u79CD\u7C7B\u578B\u7684exporter\uFF1A\u57FA\u4E8Eexporters\u7684"push"\uFF0C\u5373exporter\u6309\u7167\u65F6\u95F4\u95F4\u9694\u5C06\u6570\u636E\u53D1\u9001\u5230\u540E\u7AEF\uFF1B\u57FA\u4E8Eexporters\u7684"pull"\uFF0C\u5373\u540E\u7AEF\u6309\u7167\u9700\u8981\u8BF7\u6C42\u6570\u636E\u3002New Relic \u662F\u4E00\u4E2A\u57FA\u4E8Epush\u7684\u540E\u7AEF\uFF0C\u800CPrometheus\u662F\u4E00\u4E2A\u57FA\u4E8Epush\u7684\u540E\u7AEF\u3002'}),"\n",(0,i.jsx)(n.h4,{id:"shared-context-layer",children:"Shared Context layer"}),"\n",(0,i.jsx)(n.p,{children:"Shared Context layer\u4F4D\u4E8ETracer\u548CMeter pipeline\u4E4B\u95F4\uFF0C\u5141\u8BB8\u5728\u4E00\u4E2A\u6267\u884C\u7684span\u7684\u4E0A\u4E0B\u6587\u4E2D\u8BB0\u5F55\u6240\u6709\u975Eobserver\u7684metric\u3002\u53EF\u4EE5\u4F7F\u7528propagators\u81EA\u5B9A\u4E49Context\uFF0C\u5728\u7CFB\u7EDF\u5185\u5916\u4F20\u9012span\u4E0A\u4E0B\u6587\u3002OpenTelemetry SDK\u63D0\u4F9B\u4E86\u4E00\u4E2A\u57FA\u4E8EW3C Trace Context\u89C4\u8303\u7684\u5B9E\u73B0\uFF0C\u4F46\u4E5F\u53EF\u4EE5\u6839\u636E\u9700\u8981\u6765\u5305\u542B Zipkin B3 propagation\u7B49\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"collector",children:"Collector"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:t(5634).Z+"",width:"1102",height:"606"})}),"\n",(0,i.jsx)(n.p,{children:"OpenTelemetry Collector\u63D0\u4F9B\u4E86\u4E00\u79CD\u5382\u5546\u4E2D\u7ACB\u7684\u5B9E\u73B0\uFF0C\u65E0\u7F1D\u5730\u63A5\u6536\uFF0C\u5904\u7406\u548C\u5BFC\u51FA\u9065\u6D4B\u6570\u636E\u3002\u6B64\u5916\uFF0C\u5B83\u79FB\u9664\u4E86\u4E3A\u652F\u6301\u53D1\u9001\u5230\u591A\u4E2A\u5F00\u6E90\u6216\u5546\u4E1A\u540E\u7AEF\u800C\u4F7F\u7528\u7684\u5F00\u6E90\u53EF\u89C2\u5BDF\u6027\u6570\u636E\u683C\u5F0F(\u5982Jaeger\uFF0CPrometheus\u7B49)\u7684\u8FD0\u884C\uFF0C\u64CD\u4F5C\u548C\u7EF4\u62A4\u3002"}),"\n",(0,i.jsx)(n.p,{children:"OpenTelemetry collector\u53EF\u4EE5\u6269\u5C55\u6216\u5D4C\u5165\u5176\u4ED6\u5E94\u7528\u4E2D\u3002\u4E0B\u9762\u5E94\u7528\u6269\u5C55\u4E86collector\uFF1A"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib",children:"opentelemetry-collector-contrib"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/jaegertracing/jaeger/tree/master/cmd/opentelemetry",children:"jaeger"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u5982\u679C\u8981\u521B\u5EFA\u81EA\u5DF1\u7684collector\u53D1\u884C\u7248\uFF0C\u53EF\u4EE5\u53C2\u89C1\u8FD9\u7BC7Blog\uFF1A\xa0",(0,i.jsx)(n.a,{href:"https://medium.com/p/42337e994b63",children:"Building your own OpenTelemetry Collector distribution"}),"\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u5982\u679C\u8981\u6784\u5EFA\u81EA\u5DF1\u7684\u53D1\u884C\u7248\uFF0C\u53EF\u4EE5\u4F7F\u7528",(0,i.jsx)(n.a,{href:"https://github.com/observatorium/opentelemetry-collector-builder",children:"OpenTelemetry Collector Builder"}),"\xa0\u3002"]}),"\n",(0,i.jsx)(n.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://opentracing.io",children:"https://opentracing.io"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://opencensus.io/",children:"https://opencensus.io"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://opentelemetry.io/",children:"https://opentelemetry.io"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification",children:"https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://blog.newrelic.com/product-news/what-is-opentelemetry/",children:"https://blog.newrelic.com/product-news/what-is-opentelemetry/"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://www.mmbyte.com/article/124104.html",children:"https://www.mmbyte.com/article/124104.html"})}),"\n"]}),"\n"]})]})}function d(e={}){let{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},97643:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/59024b803d337f4235e1d61762999c7e-133b5b63762fa4854a8b5540804ef174.png"},96189:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/818425378eacd931058c1f478dba1eaa-ead426c360888c5b5cabd88bf53ce800.png"},31949:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/81f6a02f7a8c33537a3ab66d261f5a94-1e7e3e884dfebbd5f0df559ce4f9459a.png"},29620:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/8e12b523e73fe3bbf64bd124447914a2-6c12bde6c56a8d36343a451ec49971a6.png"},96639:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/8fbc65f937aaac8c9b6947faa89a6964-e0357fb79deac85993c99b0c8df4fc15.png"},5634:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/caddd853eb0ab7b314ac8d45c1039dbc-c618ddf7e19573432b184179b2eb3932.png"},50065:function(e,n,t){t.d(n,{Z:function(){return c},a:function(){return s}});var r=t(67294);let i={},l=r.createContext(i);function s(e){let n=r.useContext(l);return r.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(l.Provider,{value:n},e.children)}}}]);