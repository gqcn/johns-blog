"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["3838"],{74417:function(e,n,t){t.r(n),t.d(n,{metadata:()=>r,contentTitle:()=>c,default:()=>l,assets:()=>d,toc:()=>u,frontMatter:()=>s});var r=JSON.parse('{"id":"\u6280\u672F\u67B6\u6784/\u8F6F\u4EF6\u67B6\u6784/DDD","title":"DDD","description":"\u5C55\u793ADDD\uFF08\u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1\uFF09\u9879\u76EE\u7684\u6807\u51C6\u76EE\u5F55\u7ED3\u6784\u548C\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F\uFF0C\u5305\u62EC\u9886\u57DF\u5C42\u3001\u5E94\u7528\u5C42\u3001\u57FA\u7840\u8BBE\u65BD\u5C42\u7B49","source":"@site/docs/0-\u6280\u672F\u67B6\u6784/0-\u8F6F\u4EF6\u67B6\u6784/DDD.md","sourceDirName":"0-\u6280\u672F\u67B6\u6784/0-\u8F6F\u4EF6\u67B6\u6784","slug":"/ddd-project-structure","permalink":"/ddd-project-structure","draft":false,"unlisted":true,"tags":[],"version":"current","frontMatter":{"slug":"/ddd-project-structure","title":"DDD","hide_title":true,"unlisted":true,"keywords":["DDD","\u9879\u76EE\u7ED3\u6784","\u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1","\u76EE\u5F55\u7ED3\u6784","\u4EE3\u7801\u7EC4\u7EC7"],"description":"\u5C55\u793ADDD\uFF08\u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1\uFF09\u9879\u76EE\u7684\u6807\u51C6\u76EE\u5F55\u7ED3\u6784\u548C\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F\uFF0C\u5305\u62EC\u9886\u57DF\u5C42\u3001\u5E94\u7528\u5C42\u3001\u57FA\u7840\u8BBE\u65BD\u5C42\u7B49"},"sidebar":"mainSidebar"}'),o=t("85893"),i=t("50065");let s={slug:"/ddd-project-structure",title:"DDD",hide_title:!0,unlisted:!0,keywords:["DDD","\u9879\u76EE\u7ED3\u6784","\u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1","\u76EE\u5F55\u7ED3\u6784","\u4EE3\u7801\u7EC4\u7EC7"],description:"\u5C55\u793ADDD\uFF08\u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1\uFF09\u9879\u76EE\u7684\u6807\u51C6\u76EE\u5F55\u7ED3\u6784\u548C\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F\uFF0C\u5305\u62EC\u9886\u57DF\u5C42\u3001\u5E94\u7528\u5C42\u3001\u57FA\u7840\u8BBE\u65BD\u5C42\u7B49"},c=void 0,d={},u=[];function a(e){let n={code:"code",pre:"pre",...(0,i.a)(),...e.components};return(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"ecommerce/\n\u251C\u2500\u2500 cmd/                           # \u5E94\u7528\u7A0B\u5E8F\u5165\u53E3\n\u2502   \u2514\u2500\u2500 api/\n\u2502       \u2514\u2500\u2500 main.go\n\u2502\n\u251C\u2500\u2500 internal/                      # \u5185\u90E8\u4EE3\u7801\n\u2502   \u251C\u2500\u2500 domain/                    # \u9886\u57DF\u5C42\n\u2502   \u2502   \u251C\u2500\u2500 order/                # \u8BA2\u5355\u9886\u57DF\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 entity/           # \u5B9E\u4F53\n\u2502   \u2502   \u2502   \u2502   \u251C\u2500\u2500 order.go\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 order_item.go\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 valueobject/      # \u503C\u5BF9\u8C61\n\u2502   \u2502   \u2502   \u2502   \u251C\u2500\u2500 money.go\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 status.go\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 repository/       # \u4ED3\u50A8\u63A5\u53E3\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 order_repository.go\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 service/          # \u9886\u57DF\u670D\u52A1\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 order_service.go\n\u2502   \u2502   \u2502   \u2514\u2500\u2500 event/            # \u9886\u57DF\u4E8B\u4EF6\n\u2502   \u2502   \u2502       \u2514\u2500\u2500 order_events.go\n\u2502   \u2502   \u2502\n\u2502   \u2502   \u2514\u2500\u2500 product/              # \u5546\u54C1\u9886\u57DF\n\u2502   \u2502       \u251C\u2500\u2500 entity/\n\u2502   \u2502       \u251C\u2500\u2500 valueobject/\n\u2502   \u2502       \u251C\u2500\u2500 repository/\n\u2502   \u2502       \u2514\u2500\u2500 service/\n\u2502   \u2502\n\u2502   \u251C\u2500\u2500 application/              # \u5E94\u7528\u5C42\n\u2502   \u2502   \u251C\u2500\u2500 order/               # \u8BA2\u5355\u5E94\u7528\u670D\u52A1\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 dto/            # \u6570\u636E\u4F20\u8F93\u5BF9\u8C61\n\u2502   \u2502   \u2502   \u2502   \u251C\u2500\u2500 order_dto.go\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 request.go\n\u2502   \u2502   \u2502   \u2514\u2500\u2500 service.go\n\u2502   \u2502   \u2514\u2500\u2500 product/\n\u2502   \u2502\n\u2502   \u251C\u2500\u2500 infrastructure/          # \u57FA\u7840\u8BBE\u65BD\u5C42\n\u2502   \u2502   \u251C\u2500\u2500 persistence/        # \u6301\u4E45\u5316\n\u2502   \u2502   \u2502   \u251C\u2500\u2500 mysql/\n\u2502   \u2502   \u2502   \u2502   \u2514\u2500\u2500 order_repository.go\n\u2502   \u2502   \u2502   \u2514\u2500\u2500 redis/\n\u2502   \u2502   \u251C\u2500\u2500 messaging/         # \u6D88\u606F\n\u2502   \u2502   \u2502   \u2514\u2500\u2500 kafka/\n\u2502   \u2502   \u2514\u2500\u2500 auth/             # \u8BA4\u8BC1\n\u2502   \u2502\n\u2502   \u2514\u2500\u2500 interfaces/            # \u63A5\u53E3\u5C42\n\u2502       \u251C\u2500\u2500 api/              # API\u63A5\u53E3\n\u2502       \u2502   \u251C\u2500\u2500 handler/\n\u2502       \u2502   \u2502   \u251C\u2500\u2500 order_handler.go\n\u2502       \u2502   \u2502   \u2514\u2500\u2500 product_handler.go\n\u2502       \u2502   \u2514\u2500\u2500 middleware/\n\u2502       \u2514\u2500\u2500 grpc/            # gRPC\u63A5\u53E3\n\u2502\n\u251C\u2500\u2500 pkg/                      # \u516C\u5171\u5305\n\u2502   \u251C\u2500\u2500 errors/\n\u2502   \u251C\u2500\u2500 logger/\n\u2502   \u2514\u2500\u2500 utils/\n\u2502\n\u2514\u2500\u2500 configs/                  # \u914D\u7F6E\u6587\u4EF6\n    \u2514\u2500\u2500 config.yaml\n"})})}function l(e={}){let{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(a,{...e})}):a(e)}},50065:function(e,n,t){t.d(n,{Z:function(){return c},a:function(){return s}});var r=t(67294);let o={},i=r.createContext(o);function s(e){let n=r.useContext(i);return r.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);