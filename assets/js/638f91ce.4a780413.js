"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["6585"],{1360:function(e,n,d){d.r(n),d.d(n,{metadata:()=>l,contentTitle:()=>r,default:()=>g,assets:()=>s,toc:()=>a,frontMatter:()=>i});var l=JSON.parse('{"id":"\u5F00\u53D1\u8BED\u8A00/Golang/\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5","title":"\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5","description":"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 Goland IDE \u7684 Remote Debug \u529F\u80FD\u8FDB\u884C\u8FDC\u7A0B\u8C03\u8BD5\uFF0C\u5305\u62EC dlv \u5DE5\u5177\u7684\u5B89\u88C5\u548C\u914D\u7F6E\u8FC7\u7A0B","source":"@site/docs/2-\u5F00\u53D1\u8BED\u8A00/0-Golang/11-\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5.md","sourceDirName":"2-\u5F00\u53D1\u8BED\u8A00/0-Golang","slug":"/goland-remote-debug","permalink":"/goland-remote-debug","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":11,"frontMatter":{"slug":"/goland-remote-debug","title":"\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5","hide_title":true,"keywords":["Goland","\u8FDC\u7A0B\u8C03\u8BD5","dlv","Remote Debug","Kubernetes","\u8C03\u8BD5\u5DE5\u5177"],"description":"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 Goland IDE \u7684 Remote Debug \u529F\u80FD\u8FDB\u884C\u8FDC\u7A0B\u8C03\u8BD5\uFF0C\u5305\u62EC dlv \u5DE5\u5177\u7684\u5B89\u88C5\u548C\u914D\u7F6E\u8FC7\u7A0B"},"sidebar":"mainSidebar","previous":{"title":"\u4E00\u4E2AGolang\u7A0B\u5E8F\u5185\u5B58\u5360\u7528\u95EE\u9898\u6392\u67E5\u4F18\u5316\uFF08\u590D\u76D8\uFF09","permalink":"/golang-memory-optimization-case"},"next":{"title":"\u5BB9\u5668\u6280\u672F","permalink":"/container"}}'),t=d("85893"),o=d("50065");let i={slug:"/goland-remote-debug",title:"\u4F7F\u7528goland remote debug\u8FDC\u7A0B\u8C03\u8BD5",hide_title:!0,keywords:["Goland","\u8FDC\u7A0B\u8C03\u8BD5","dlv","Remote Debug","Kubernetes","\u8C03\u8BD5\u5DE5\u5177"],description:"\u8BE6\u7EC6\u8BF4\u660E\u5982\u4F55\u4F7F\u7528 Goland IDE \u7684 Remote Debug \u529F\u80FD\u8FDB\u884C\u8FDC\u7A0B\u8C03\u8BD5\uFF0C\u5305\u62EC dlv \u5DE5\u5177\u7684\u5B89\u88C5\u548C\u914D\u7F6E\u8FC7\u7A0B"},r=void 0,s={},a=[{value:"\u5B89\u88C5dlv\u5DE5\u5177",id:"\u5B89\u88C5dlv\u5DE5\u5177",level:2},{value:"\u91CD\u65B0\u7F16\u8BD1\u7A0B\u5E8F",id:"\u91CD\u65B0\u7F16\u8BD1\u7A0B\u5E8F",level:2},{value:"\u8FDB\u5BB9\u5668\u6267\u884C\u7A0B\u5E8F",id:"\u8FDB\u5BB9\u5668\u6267\u884C\u7A0B\u5E8F",level:2},{value:"\xa0\u6267\u884C\u53CD\u5411\u4EE3\u7406\u5230dlv",id:"\u6267\u884C\u53CD\u5411\u4EE3\u7406\u5230dlv",level:2},{value:"\u5F00\u542Fgoland remote debug",id:"\u5F00\u542Fgoland-remote-debug",level:2}];function c(e){let n={a:"a",code:"code",h2:"h2",img:"img",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["\u5F53\u6211\u4EEC\u9700\u8981\u7279\u5B9A\u7684\u8FD0\u884C\u73AF\u5883\u624D\u80FD\u590D\u73B0\u67D0\u4E9B\u7591\u96BE\u95EE\u9898\uFF0C\u901A\u8FC7",(0,t.jsx)(n.code,{children:"goland"}),"\u7684",(0,t.jsx)(n.code,{children:"remote debug"}),"\u529F\u80FD\u53EF\u4EE5\u5B9E\u73B0\u5F88\u65B9\u4FBF\u7684\u8FDC\u7A0B\u8C03\u8BD5\uFF0C\u5FEB\u901F\u5B9A\u4F4D\u95EE\u9898\u3002\u6211\u8FD9\u91CC\u4EE5\u8FDC\u7A0B\u8C03\u8BD5",(0,t.jsx)(n.code,{children:"Kubernetes"}),"\u96C6\u7FA4\u4E2D\u7684",(0,t.jsx)(n.code,{children:"golang"}),"\u7A0B\u5E8F\u4E3A\u793A\u4F8B\u6F14\u793A\u5982\u4F55\u4F7F\u7528",(0,t.jsx)(n.code,{children:"goland"}),"\u7684",(0,t.jsx)(n.code,{children:"remote debug"}),"\u529F\u80FD\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"\u5B89\u88C5dlv\u5DE5\u5177",children:"\u5B89\u88C5dlv\u5DE5\u5177"}),"\n",(0,t.jsxs)(n.p,{children:["\u662F\u7684\uFF0C\u4F60\u6CA1\u731C\u9519\uFF0C\u8FD9\u4E2A\u73A9\u610F\u662F\u62FF\u6765\u8FDC\u7A0B\u4EA4\u4E92",(0,t.jsx)(n.code,{children:"debug"}),"\u5DE5\u4F5C\u7684\uFF1A",(0,t.jsx)(n.a,{href:"https://github.com/go-delve/delve",children:"https://github.com/go-delve/delve"})]}),"\n",(0,t.jsx)(n.p,{children:"\u901A\u8FC7\u624B\u52A8\u7F16\u8BD1\u5B89\u88C5\uFF0C\u547D\u4EE4\u5982\u4E0B\uFF0C\u6CE8\u610F\u8FD9\u548C\u5B98\u65B9\u63D0\u4F9B\u7684\u547D\u4EE4\u6709\u51FA\u5165\uFF0C\u4EE5\u6211\u7684\u4E3A\u51C6\uFF1A"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/go-delve/delve\ncd delve/cmd/dlv\nCGO_ENABLED=0 go build -o dlv main.go\n\n## \u62F7\u8D1D\u5DE5\u5177\u5230\u5BB9\u5668\nkubectl cp ./dlv khaos/khaos-guardian-x7j9t:/app/ -c metrics-agent\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u91CD\u65B0\u7F16\u8BD1\u7A0B\u5E8F",children:"\u91CD\u65B0\u7F16\u8BD1\u7A0B\u5E8F"}),"\n",(0,t.jsxs)(n.p,{children:["\u9700\u8981\u6DFB\u52A0",(0,t.jsx)(n.code,{children:"-gcflags"}),"\u53C2\u6570\uFF0C\u7ED9\u7F16\u8BD1\u5668\u4F20\u9012",(0,t.jsx)(n.code,{children:"-N -l"}),"\u53C2\u6570\uFF0C\u7981\u6B62\u7F16\u8BD1\u5668\u4F18\u5316\u548C\u5185\u8054\uFF1A"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'CGO_ENABLED=0 go build -gcflags "all=-N -l" main.go\n\n## \u62F7\u8D1D\u7A0B\u5E8F\u5230\u5BB9\u5668\nkubectl cp ./main khaos/khaos-guardian-x7j9t:/app/ -c metrics-agent\n'})}),"\n",(0,t.jsx)(n.h2,{id:"\u8FDB\u5BB9\u5668\u6267\u884C\u7A0B\u5E8F",children:"\u8FDB\u5BB9\u5668\u6267\u884C\u7A0B\u5E8F"}),"\n",(0,t.jsxs)(n.p,{children:["\u4F7F\u7528",(0,t.jsx)(n.code,{children:"dlv"}),"\u5DE5\u5177\u6267\u884C\u7A0B\u5E8F\u7684\u8BED\u6CD5\u5982\u4E0B\uFF1A"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./demo\n"})}),"\n",(0,t.jsxs)(n.p,{children:["\u5982\u679C\u7A0B\u5E8F\u9700\u8981\u8FD0\u884C\u53C2\u6570\uFF0C\u90A3\u4E48\u9700\u8981\u52A0\u4E0A",(0,t.jsx)(n.code,{children:"--"}),"\uFF0C\u4F8B\u5982\uFF1A"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./demo -- --c=/config\n## \u7B49\u540C\u4E8E\n./demo --c=/config\n"})}),"\n",(0,t.jsx)(n.p,{children:"\u56E0\u6B64\u6211\u7684\u7A0B\u5E8F\u7684\u6267\u884C\u547D\u4EE4\u5982\u4E0B\uFF1A"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"./dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./main -- --debug=true --address=:13047 --nodeIP=21.0.44.12 --rootPath=/khaos/root --agentConfigFilePath=/var/run/khaos-guardian/metricsconfig/config.yaml --kubeStateUrl=http://127.0.0.1:13043/metrics --enabledPlugins=.+\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u6267\u884C\u53CD\u5411\u4EE3\u7406\u5230dlv",children:"\xa0\u6267\u884C\u53CD\u5411\u4EE3\u7406\u5230dlv"}),"\n",(0,t.jsxs)(n.p,{children:["\u4F7F\u7528",(0,t.jsx)(n.code,{children:"kubectl"}),"\u7684",(0,t.jsx)(n.code,{children:"port-forward"}),"\u547D\u4EE4\uFF1A"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"kubectl -n khaos port-forward pod/khaos-guardian-8p2gx 2345:2345 --address 0.0.0.0\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u5F00\u542Fgoland-remote-debug",children:"\u5F00\u542Fgoland remote debug"}),"\n",(0,t.jsxs)(n.p,{children:["\u589E\u52A0",(0,t.jsx)(n.code,{children:"Go Remote"}),"\u914D\u7F6E\u5373\u53EF\u3002\u53EF\u4EE5\u770B\u5230\uFF0C\u8FD9\u91CC\u7684",(0,t.jsx)(n.code,{children:"IDE"}),"\u4E5F\u6709\u63D0\u793A\u5982\u4F55\u5F00\u542F\u8FDC\u7A0B\u8C03\u8BD5\u7684\u6B65\u9AA4\u3002"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:d(25163).Z+"",width:"1838",height:"1366"})})]})}function g(e={}){let{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},25163:function(e,n,d){d.d(n,{Z:function(){return l}});let l=d.p+"assets/images/image-2024-5-24_15-31-18-13e6275d221a526d160f2f1db0a0da10.png"},50065:function(e,n,d){d.d(n,{Z:function(){return r},a:function(){return i}});var l=d(67294);let t={},o=l.createContext(t);function i(e){let n=l.useContext(o);return l.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),l.createElement(o.Provider,{value:n},e.children)}}}]);