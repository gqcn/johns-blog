"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["7860"],{93832:function(n,e,t){t.r(e),t.d(e,{metadata:()=>s,contentTitle:()=>l,default:()=>d,assets:()=>c,toc:()=>a,frontMatter:()=>o});var s=JSON.parse('{"id":"docs/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217","title":"\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217","description":"\u6DF1\u5165\u8BB2\u89E3\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217\u95EE\u9898\u7684\u89E3\u51B3\u65B9\u6848\uFF0C\u5305\u62EC\u52A8\u6001\u89C4\u5212\u65B9\u6CD5\u7684\u5B9E\u73B0\u6B65\u9AA4\u548C\u7B97\u6CD5\u590D\u6742\u5EA6\u5206\u6790","source":"@site/docs/docs/8000-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/6-\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217.md","sourceDirName":"docs/8000-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/data-structures-and-algorithms/longest-palindromic-subsequence","permalink":"/data-structures-and-algorithms/longest-palindromic-subsequence","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"slug":"/data-structures-and-algorithms/longest-palindromic-subsequence","title":"\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217","hide_title":true,"keywords":["\u7B97\u6CD5","\u52A8\u6001\u89C4\u5212","\u5B57\u7B26\u4E32","\u56DE\u6587","\u5B50\u5E8F\u5217","\u5E8F\u5217\u5206\u6790"],"description":"\u6DF1\u5165\u8BB2\u89E3\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217\u95EE\u9898\u7684\u89E3\u51B3\u65B9\u6848\uFF0C\u5305\u62EC\u52A8\u6001\u89C4\u5212\u65B9\u6CD5\u7684\u5B9E\u73B0\u6B65\u9AA4\u548C\u7B97\u6CD5\u590D\u6742\u5EA6\u5206\u6790"},"sidebar":"mainSidebar","previous":{"title":"\u6700\u957F\u516C\u5171\u5B50\u5E8F\u5217","permalink":"/data-structures-and-algorithms/longest-common-subsequence"},"next":{"title":"\u5BFB\u627E\u91CD\u590D\u6570","permalink":"/data-structures-and-algorithms/find-duplicate-number"}}'),i=t("85893"),r=t("50065");let o={slug:"/data-structures-and-algorithms/longest-palindromic-subsequence",title:"\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217",hide_title:!0,keywords:["\u7B97\u6CD5","\u52A8\u6001\u89C4\u5212","\u5B57\u7B26\u4E32","\u56DE\u6587","\u5B50\u5E8F\u5217","\u5E8F\u5217\u5206\u6790"],description:"\u6DF1\u5165\u8BB2\u89E3\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217\u95EE\u9898\u7684\u89E3\u51B3\u65B9\u6848\uFF0C\u5305\u62EC\u52A8\u6001\u89C4\u5212\u65B9\u6CD5\u7684\u5B9E\u73B0\u6B65\u9AA4\u548C\u7B97\u6CD5\u590D\u6742\u5EA6\u5206\u6790"},l=void 0,c={},a=[];function u(n){let e={a:"a",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.p,{children:(0,i.jsx)(e.a,{href:"https://leetcode.cn/problems/longest-palindromic-subsequence/?envType=list&envId=ffVoDjra",children:"https://leetcode.cn/problems/longest-palindromic-subsequence/?envType=list&envId=ffVoDjra"})}),"\n",(0,i.jsx)(e.p,{children:"\u9898\u76EE"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-text",children:"\u7ED9\u4F60\u4E00\u4E2A\u5B57\u7B26\u4E32 s \uFF0C\u627E\u51FA\u5176\u4E2D\u6700\u957F\u7684\u56DE\u6587\u5B50\u5E8F\u5217\uFF0C\u5E76\u8FD4\u56DE\u8BE5\u5E8F\u5217\u7684\u957F\u5EA6\u3002\n\n\u5B50\u5E8F\u5217\u5B9A\u4E49\u4E3A\uFF1A\u4E0D\u6539\u53D8\u5269\u4F59\u5B57\u7B26\u987A\u5E8F\u7684\u60C5\u51B5\u4E0B\uFF0C\u5220\u9664\u67D0\u4E9B\u5B57\u7B26\u6216\u8005\u4E0D\u5220\u9664\u4EFB\u4F55\u5B57\u7B26\u5F62\u6210\u7684\u4E00\u4E2A\u5E8F\u5217\u3002\n\n\u793A\u4F8B 1\uFF1A  \n\u8F93\u5165\uFF1As = \u201Cbbbab\u201D  \n\u8F93\u51FA\uFF1A4  \n\u89E3\u91CA\uFF1A\u4E00\u4E2A\u53EF\u80FD\u7684\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217\u4E3A \u201Cbbbb\u201D \u3002\n\n\u793A\u4F8B 2\uFF1A  \n\u8F93\u5165\uFF1As = \u201Ccbbd\u201D  \n\u8F93\u51FA\uFF1A2  \n\u89E3\u91CA\uFF1A\u4E00\u4E2A\u53EF\u80FD\u7684\u6700\u957F\u56DE\u6587\u5B50\u5E8F\u5217\u4E3A \u201Cbb\u201D \u3002\n\n\u63D0\u793A\uFF1A\n\n1 <= s.length <= 1000  \ns \u4EC5\u7531\u5C0F\u5199\u82F1\u6587\u5B57\u6BCD\u7EC4\u6210  \n\u9898\u76EE\u5206\u6790\n\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u5B98\u65B9\u9898\u89E3\u4EE3\u7801\uFF1A"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-go",children:"func longestPalindromeSubseq(s string) int {\n    n := len(s)\n    dp := make([][]int, n)\n    for i := range dp {\n        dp[i] = make([]int, n)\n    }\n    for i := n - 1; i >= 0; i-- {\n        dp[i][i] = 1\n        for j := i + 1; j < n; j++ {\n            if s[i] == s[j] {\n                dp[i][j] = dp[i+1][j-1] + 2\n            } else {\n                dp[i][j] = max(dp[i+1][j], dp[i][j-1])\n            }\n        }\n    }\n    return dp[0][n-1]\n}\n\nfunc max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u53C2\u8003\u94FE\u63A5\uFF1A"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:(0,i.jsx)(e.a,{href:"https://leetcode.cn/problems/longest-palindromic-subsequence/solutions/578712/516-zui-chang-hui-wen-zi-xu-lie-dong-tai-hap0/",children:"https://leetcode.cn/problems/longest-palindromic-subsequence/solutions/578712/516-zui-chang-hui-wen-zi-xu-lie-dong-tai-hap0/"})}),"\n",(0,i.jsx)(e.li,{children:(0,i.jsx)(e.a,{href:"https://leetcode.cn/problems/longest-palindromic-subsequence/solutions/67456/zi-xu-lie-wen-ti-tong-yong-si-lu-zui-chang-hui-wen/",children:"https://leetcode.cn/problems/longest-palindromic-subsequence/solutions/67456/zi-xu-lie-wen-ti-tong-yong-si-lu-zui-chang-hui-wen/"})}),"\n"]})]})}function d(n={}){let{wrapper:e}={...(0,r.a)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(u,{...n})}):u(n)}},50065:function(n,e,t){t.d(e,{Z:function(){return l},a:function(){return o}});var s=t(67294);let i={},r=s.createContext(i);function o(n){let e=s.useContext(r);return s.useMemo(function(){return"function"==typeof n?n(e):{...e,...n}},[e,n])}function l(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:o(n.components),s.createElement(r.Provider,{value:e},n.children)}}}]);