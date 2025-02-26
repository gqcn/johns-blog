"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["8070"],{4075:function(e,n,c){c.r(n),c.d(n,{metadata:()=>d,contentTitle:()=>l,default:()=>x,assets:()=>t,toc:()=>o,frontMatter:()=>s});var d=JSON.parse('{"id":"\u65E5\u5E38\u7B14\u8BB0/Linux\u7AEF\u53E3\u8F6C\u53D1\u7684\u51E0\u79CD\u5E38\u7528\u65B9\u6CD5","title":"Linux\u7AEF\u53E3\u8F6C\u53D1\u7684\u51E0\u79CD\u5E38\u7528\u65B9\u6CD5","description":"\u8BE6\u7EC6\u4ECB\u7ECDLinux\u7CFB\u7EDF\u4E0B\u5B9E\u73B0\u7AEF\u53E3\u8F6C\u53D1\u7684\u591A\u79CD\u65B9\u6CD5\uFF0C\u5305\u62ECSSH\u96A7\u9053\u3001iptables\u7B49\u5E38\u7528\u6280\u672F","source":"@site/docs/8-\u65E5\u5E38\u7B14\u8BB0/2-Linux\u7AEF\u53E3\u8F6C\u53D1\u7684\u51E0\u79CD\u5E38\u7528\u65B9\u6CD5.md","sourceDirName":"8-\u65E5\u5E38\u7B14\u8BB0","slug":"/linux-port-forwarding-methods","permalink":"/linux-port-forwarding-methods","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"slug":"/linux-port-forwarding-methods","title":"Linux\u7AEF\u53E3\u8F6C\u53D1\u7684\u51E0\u79CD\u5E38\u7528\u65B9\u6CD5","hide_title":true,"keywords":["Linux","\u7F51\u7EDC\u914D\u7F6E","\u7AEF\u53E3\u8F6C\u53D1","SSH\u96A7\u9053","iptables","\u7CFB\u7EDF\u7BA1\u7406"],"description":"\u8BE6\u7EC6\u4ECB\u7ECDLinux\u7CFB\u7EDF\u4E0B\u5B9E\u73B0\u7AEF\u53E3\u8F6C\u53D1\u7684\u591A\u79CD\u65B9\u6CD5\uFF0C\u5305\u62ECSSH\u96A7\u9053\u3001iptables\u7B49\u5E38\u7528\u6280\u672F"},"sidebar":"mainSidebar","previous":{"title":"Mac\u5B89\u88C5git completion","permalink":"/mac-git-completion-setup"},"next":{"title":"MySQL 5.7 insert into on duplicate \u6B7B\u9501","permalink":"/mysql-insert-duplicate-deadlock"}}'),i=c("85893"),r=c("50065");let s={slug:"/linux-port-forwarding-methods",title:"Linux\u7AEF\u53E3\u8F6C\u53D1\u7684\u51E0\u79CD\u5E38\u7528\u65B9\u6CD5",hide_title:!0,keywords:["Linux","\u7F51\u7EDC\u914D\u7F6E","\u7AEF\u53E3\u8F6C\u53D1","SSH\u96A7\u9053","iptables","\u7CFB\u7EDF\u7BA1\u7406"],description:"\u8BE6\u7EC6\u4ECB\u7ECDLinux\u7CFB\u7EDF\u4E0B\u5B9E\u73B0\u7AEF\u53E3\u8F6C\u53D1\u7684\u591A\u79CD\u65B9\u6CD5\uFF0C\u5305\u62ECSSH\u96A7\u9053\u3001iptables\u7B49\u5E38\u7528\u6280\u672F"},l=void 0,t={},o=[{value:"\u4E00\u3001<code>SSH</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u4E00ssh-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u4E8C\u3001<code>iptables</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u4E8Ciptables-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u4E09\u3001<code>firewall</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u4E09firewall-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u56DB\u3001<code>rinetd</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u56DBrinetd-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u4E94\u3001<code>ncat</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u4E94ncat-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u516D\u3001<code>socat</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u516Dsocat-\u7AEF\u53E3\u8F6C\u53D1",level:2},{value:"\u4E03\u3001 <code>portmap</code> \u7AEF\u53E3\u8F6C\u53D1",id:"\u4E03-portmap-\u7AEF\u53E3\u8F6C\u53D1",level:2}];function h(e){let n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h2,{id:"\u4E00ssh-\u7AEF\u53E3\u8F6C\u53D1",children:["\u4E00\u3001",(0,i.jsx)(n.code,{children:"SSH"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"SSH"}),"\u63D0\u4F9B\u4E86\u4E00\u4E2A\u975E\u5E38\u6709\u610F\u601D\u7684\u529F\u80FD\uFF0C\u5C31\u662F\u7AEF\u53E3\u8F6C\u53D1\uFF0C\u5B83\u80FD\u591F\u5C06\u5176\u4ED6 ",(0,i.jsx)(n.code,{children:"TCP"})," \u7AEF\u53E3\u7684\u7F51\u7EDC\u6570\u636E\u901A\u8FC7 ",(0,i.jsx)(n.code,{children:"SSH"})," \u94FE\u63A5\u6765\u8F6C\u53D1\uFF0C\u5E76\u4E14\u81EA\u52A8\u63D0\u4F9B\u4E86\u76F8\u5E94\u7684\u52A0\u5BC6\u53CA\u89E3\u5BC6\u670D\u52A1\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\uFF081\uFF09\u672C\u5730\u7AEF\u53E3\u8F6C\u53D1"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ssh -fgN -L 2222:localhost:22 localhost\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF082\uFF09\u8FDC\u7A0B\u7AEF\u53E3\u8F6C\u53D1"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ssh -fgN -R 2222:host1:22 localhost\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF083\uFF09\u52A8\u6001\u8F6C\u53D1"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ssh -fgN -D 12345 root@host1\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"\u4E8Ciptables-\u7AEF\u53E3\u8F6C\u53D1",children:["\u4E8C\u3001",(0,i.jsx)(n.code,{children:"iptables"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"CentOS 7.0"})," \u4EE5\u4E0B\u4F7F\u7528\u7684\u662F",(0,i.jsx)(n.code,{children:"iptables"}),"\uFF0C\u53EF\u4EE5\u901A\u8FC7",(0,i.jsx)(n.code,{children:"iptables"}),"\u5B9E\u73B0\u6570\u636E\u5305\u7684\u8F6C\u53D1\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\uFF081\uFF09\u5F00\u542F\u6570\u636E\u8F6C\u53D1\u529F\u80FD"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"vi /etc/sysctl.conf     \n## \u589E\u52A0\u4E00\u884C net.ipv4.ip_forward=1\n\n## \u4F7F\u6570\u636E\u8F6C\u53D1\u529F\u80FD\u751F\u6548\nsysctl -p\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF082\uFF09\u5C06\u672C\u5730\u7684\u7AEF\u53E3\u8F6C\u53D1\u5230\u672C\u673A\u7AEF\u53E3"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"iptables -t nat -A PREROUTING -p tcp --dport 2222 -j REDIRECT --to-port 22\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF083\uFF09\u5C06\u672C\u673A\u7684\u7AEF\u53E3\u8F6C\u53D1\u5230\u5176\u4ED6\u673A\u5668"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"iptables -t nat -A PREROUTING -d 192.168.172.130 -p tcp --dport 8000 -j DNAT --to-destination 192.168.172.131:80\niptables -t nat -A POSTROUTING -d 192.168.172.131 -p tcp --dport 80 -j SNAT --to 192.168.172.130\n\n## \u6E05\u7A7Anat\u8868\u7684\u6240\u6709\u94FE\niptables -t nat -F PREROUTING\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"\u4E09firewall-\u7AEF\u53E3\u8F6C\u53D1",children:["\u4E09\u3001",(0,i.jsx)(n.code,{children:"firewall"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"CentOS 7.0"}),"\u4EE5\u4E0A\u4F7F\u7528\u7684\u662F",(0,i.jsx)(n.code,{children:"firewall"}),"\uFF0C\u901A\u8FC7\u547D\u4EE4\u884C\u914D\u7F6E\u5B9E\u73B0\u7AEF\u53E3\u8F6C\u53D1\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\uFF081\uFF09\u5F00\u542F\u4F2A\u88C5IP"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"firewall-cmd --permanent --add-masquerade\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\uFF082\uFF09\u914D\u7F6E\u7AEF\u53E3\u8F6C\u53D1\uFF0C\u5C06\u5230\u8FBE\u672C\u673A\u7684",(0,i.jsx)(n.code,{children:"12345"}),"\u7AEF\u53E3\u7684\u8BBF\u95EE\u8F6C\u53D1\u5230\u53E6\u4E00\u53F0\u670D\u52A1\u5668\u7684",(0,i.jsx)(n.code,{children:"22"}),"\u7AEF\u53E3\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"firewall-cmd --permanent --add-forward-port=port=12345:proto=tcp:toaddr=192.168.172.131:toport=22\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF083\uFF09\u91CD\u65B0\u8F7D\u5165\uFF0C\u4F7F\u5176\u5931\u6548\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"firewall-cmd --reload\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"\u56DBrinetd-\u7AEF\u53E3\u8F6C\u53D1",children:["\u56DB\u3001",(0,i.jsx)(n.code,{children:"rinetd"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"rinetd"}),"\u662F\u4E00\u4E2A\u8F7B\u91CF\u7EA7",(0,i.jsx)(n.code,{children:"TCP"}),"\u8F6C\u53D1\u5DE5\u5177\uFF0C\u7B80\u5355\u914D\u7F6E\u5C31\u53EF\u4EE5\u5B9E\u73B0\u7AEF\u53E3\u6620\u5C04/\u8F6C\u53D1/\u91CD\u5B9A\u5411\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\uFF081\uFF09\u6E90\u7801\u4E0B\u8F7D"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"wget https://li.nux.ro/download/nux/misc/el7/x86_64/rinetd-0.62-9.el7.nux.x86_64.rpm\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\uFF082\uFF09\u5B89\u88C5",(0,i.jsx)(n.code,{children:"rinetd"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"rpm -ivh rinetd-0.62-9.el7.nux.x86_64.rpm\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF083\uFF09\u7F16\u8F91\u914D\u7F6E\u6587\u4EF6"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"vi rinetd.conf     \n0.0.0.0 1234 127.0.0.1 22\n"})}),"\n",(0,i.jsx)(n.p,{children:"\uFF084\uFF09\u542F\u52A8\u8F6C\u53D1"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"rinetd -c /etc/rinetd.conf\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"\u4E94ncat-\u7AEF\u53E3\u8F6C\u53D1",children:["\u4E94\u3001",(0,i.jsx)(n.code,{children:"ncat"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"netcat"}),"\uFF08\u7B80\u79F0",(0,i.jsx)(n.code,{children:"nc"}),"\uFF09\u88AB\u8A89\u4E3A\u7F51\u7EDC\u5B89\u5168\u754C\u7684\u201D\u745E\u58EB\u519B\u5200\u201C\uFF0C\u4E00\u4E2A\u7B80\u5355\u800C\u6709\u7528\u7684\u5DE5\u5177\uFF0C\u8FD9\u91CC\u4ECB\u7ECD\u4E00\u79CD\u4F7F\u7528",(0,i.jsx)(n.code,{children:"netcat"}),"\u5B9E\u73B0\u7AEF\u53E3\u8F6C\u53D1\u7684\u65B9\u6CD5\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\uFF081\uFF09\u5B89\u88C5",(0,i.jsx)(n.code,{children:"ncat"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"yum install nmap-ncat -y\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\uFF082\uFF09\u76D1\u542C\u672C\u673A ",(0,i.jsx)(n.code,{children:"9876"})," \u7AEF\u53E3\uFF0C\u5C06\u6570\u636E\u8F6C\u53D1\u5230 ",(0,i.jsx)(n.code,{children:"192.168.172.131"}),"\u7684 ",(0,i.jsx)(n.code,{children:"80"})," \u7AEF\u53E3"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'ncat --sh-exec "ncat 192.168.172.131 80" -l 9876  --keep-open\n'})}),"\n",(0,i.jsxs)(n.h2,{id:"\u516Dsocat-\u7AEF\u53E3\u8F6C\u53D1",children:["\u516D\u3001",(0,i.jsx)(n.code,{children:"socat"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"socat"}),"\u662F\u4E00\u4E2A\u591A\u529F\u80FD\u7684\u7F51\u7EDC\u5DE5\u5177\uFF0C\u4F7F\u7528",(0,i.jsx)(n.code,{children:"socat"}),"\u8FDB\u884C\u7AEF\u53E3\u8F6C\u53D1\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\uFF081\uFF09",(0,i.jsx)(n.code,{children:"socat"}),"\u5B89\u88C5"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"yum install -y socat\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\uFF082\uFF09\u5728\u672C\u5730\u76D1\u542C",(0,i.jsx)(n.code,{children:"12345"}),"\u7AEF\u53E3\uFF0C\u5E76\u5C06\u8BF7\u6C42\u8F6C\u53D1\u81F3",(0,i.jsx)(n.code,{children:"192.168.172.131"}),"\u7684",(0,i.jsx)(n.code,{children:"22"}),"\u7AEF\u53E3\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"socat TCP4-LISTEN:12345,reuseaddr,fork TCP4:192.168.172.131:22\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"\u4E03-portmap-\u7AEF\u53E3\u8F6C\u53D1",children:["\u4E03\u3001 ",(0,i.jsx)(n.code,{children:"portmap"})," \u7AEF\u53E3\u8F6C\u53D1"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Linux"})," \u7248\u7684",(0,i.jsx)(n.code,{children:"lcx"}),"\uFF0C\u5185\u7F51\u7AEF\u53E3\u8F6C\u53D1\u5DE5\u5177\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\uFF081\uFF09\u4E0B\u8F7D\u5730\u5740\uFF1A"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"http://www.vuln.cn/wp-content/uploads/2016/06/lcx_vuln.cn_.zip\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\uFF082\uFF09\u76D1\u542C\u672C\u5730",(0,i.jsx)(n.code,{children:"1234"}),"\u7AEF\u53E3\uFF0C\u8F6C\u53D1\u7ED9",(0,i.jsx)(n.code,{children:"192.168.172.131"}),"\u7684",(0,i.jsx)(n.code,{children:"22"}),"\u7AEF\u53E3"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"./portmap -m 1 -p1 1234 -h2 192.168.172.131 -p2 22\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  \n  \n  \n  \n  \n\n"})})]})}function x(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},50065:function(e,n,c){c.d(n,{Z:function(){return l},a:function(){return s}});var d=c(67294);let i={},r=d.createContext(i);function s(e){let n=d.useContext(r);return d.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),d.createElement(r.Provider,{value:n},e.children)}}}]);