"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["5222"],{42626:function(e,n,t){t.r(n),t.d(n,{metadata:()=>r,contentTitle:()=>c,default:()=>u,assets:()=>d,toc:()=>o,frontMatter:()=>s});var r=JSON.parse('{"id":"hidden/\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32","title":"\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32","description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u5B57\u7B26\u4E32\u662F\u5426\u7531\u91CD\u590D\u5B50\u4E32\u6784\u6210\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u6ED1\u52A8\u7A97\u53E3\u65B9\u6CD5\u7684\u5E94\u7528\u548C\u4F18\u5316","source":"@site/docs/hidden/4-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/9-\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32.md","sourceDirName":"hidden/4-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/data-structures-and-algorithms/repeated-substring-pattern","permalink":"/data-structures-and-algorithms/repeated-substring-pattern","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":9,"frontMatter":{"slug":"/data-structures-and-algorithms/repeated-substring-pattern","title":"\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32","hide_title":true,"keywords":["\u7B97\u6CD5","\u5B57\u7B26\u4E32","\u6ED1\u52A8\u7A97\u53E3","\u6A21\u5F0F\u5339\u914D","\u5B57\u7B26\u4E32\u5904\u7406","\u5B50\u4E32\u68C0\u6D4B"],"description":"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u5B57\u7B26\u4E32\u662F\u5426\u7531\u91CD\u590D\u5B50\u4E32\u6784\u6210\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u6ED1\u52A8\u7A97\u53E3\u65B9\u6CD5\u7684\u5E94\u7528\u548C\u4F18\u5316"},"sidebar":"hiddenSidebar","previous":{"title":"\u6700\u957F\u8FDE\u7EED\u5E8F\u5217","permalink":"/data-structures-and-algorithms/longest-consecutive-sequence"},"next":{"title":"\u6709\u6548\u7684\u6B63\u65B9\u5F62","permalink":"/data-structures-and-algorithms/valid-square"}}'),a=t("85893"),i=t("50065");let s={slug:"/data-structures-and-algorithms/repeated-substring-pattern",title:"\u91CD\u590D\u7684\u5B50\u5B57\u7B26\u4E32",hide_title:!0,keywords:["\u7B97\u6CD5","\u5B57\u7B26\u4E32","\u6ED1\u52A8\u7A97\u53E3","\u6A21\u5F0F\u5339\u914D","\u5B57\u7B26\u4E32\u5904\u7406","\u5B50\u4E32\u68C0\u6D4B"],description:"\u8BE6\u7EC6\u8BB2\u89E3\u5982\u4F55\u5224\u65AD\u5B57\u7B26\u4E32\u662F\u5426\u7531\u91CD\u590D\u5B50\u4E32\u6784\u6210\u7684\u7B97\u6CD5\u5B9E\u73B0\uFF0C\u5305\u62EC\u6ED1\u52A8\u7A97\u53E3\u65B9\u6CD5\u7684\u5E94\u7528\u548C\u4F18\u5316"},c=void 0,d={},o=[];function l(e){let n={a:"a",code:"code",img:"img",p:"p",pre:"pre",...(0,i.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:(0,a.jsx)(n.a,{href:"https://leetcode.cn/problems/repeated-substring-pattern/description/",children:"https://leetcode.cn/problems/repeated-substring-pattern/description/"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{src:t(91567).Z+"",width:"1298",height:"986"})}),"\n",(0,a.jsx)(n.p,{children:"\u6211\u8FD9\u91CC\u901A\u8FC7\u6ED1\u52A8\u7A97\u53E3\u6765\u5B9E\u73B0\uFF1A"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-go",children:'package main\n\nimport "fmt"\n\nfunc repeatedSubstringPattern(s string) bool {\n    var (\n        length   = len(s)\n        checkLen int // \u4E34\u65F6\u5B50\u4E32\u6BD4\u8F83\u957F\u5EA6\n        validLen int // \u5408\u6CD5\u7684\u91CD\u590D\u5B50\u4E32\u957F\u5EA6\n    )\n    for checkLen = 1; checkLen <= length; checkLen++ {\n        // \u91CD\u590D\u7684\u5B50\u4E32\u957F\u5EA6\u5F53\u7136\u5FC5\u987B\u80FD\u6574\u9664\u5B57\u7B26\u4E32\u957F\u5EA6\n        if length%checkLen != 0 {\n            continue\n        }\n        // \u8FB9\u754C\u5224\u65AD\n        if checkLen == length {\n            break\n        }\n        // \u6ED1\u52A8\u7A97\u53E3\uFF0C\u5224\u65AD\u540E\u7EED\u6309\u7167\u4E00\u5B9A\u957F\u5EA6\u4F9D\u6B21\u6BD4\u8F83\u662F\u5426\u5339\u914D\n        var (\n            isValid         = true\n            toBeComparedStr = s[0:checkLen] // \u5F53\u524D\u68C0\u67E5\u7684\u5B50\u4E32\uFF0C\u4F7F\u7528\u547D\u540D\u53D8\u91CF\u4FBF\u4E8E\u7406\u89E3\n        )\n        for i := checkLen; i < length; i += checkLen {\n            var tempStr = s[i : i+checkLen] // \u4E34\u65F6\u68C0\u67E5\u7684\u5B50\u4E32\uFF0C\u4F7F\u7528\u547D\u540D\u53D8\u91CF\u4FBF\u4E8E\u7406\u89E3\n            if toBeComparedStr != tempStr {\n                isValid = false\n                break\n            }\n        }\n        if isValid {\n            validLen = checkLen\n        }\n    }\n    // \u6700\u7EC8\u7ED3\u679C\u5224\u65AD\n    if validLen == 0 {\n        return false\n    }\n    return true\n}\n\nfunc main() {\n    fmt.Println(repeatedSubstringPattern("a"))\n    fmt.Println(repeatedSubstringPattern("ab"))\n    fmt.Println(repeatedSubstringPattern("abab"))\n    fmt.Println(repeatedSubstringPattern("ababa"))\n    fmt.Println(repeatedSubstringPattern("ababab"))\n    fmt.Println(repeatedSubstringPattern("abababa"))\n    fmt.Println(repeatedSubstringPattern("aaa"))\n    fmt.Println(repeatedSubstringPattern("aaaa"))\n}\n'})})]})}function u(e={}){let{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},91567:function(e,n,t){t.d(n,{Z:function(){return r}});let r=t.p+"assets/images/image-2024-9-5_21-32-53-df922b5a591dfb69534b135f7077ffe5.png"},50065:function(e,n,t){t.d(n,{Z:function(){return c},a:function(){return s}});var r=t(67294);let a={},i=r.createContext(a);function s(e){let n=r.useContext(i);return r.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);