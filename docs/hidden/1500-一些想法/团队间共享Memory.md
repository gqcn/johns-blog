---
slug: "/hidden/ideas-team-shared-memory"
title: "团队间共享Memory"
hide_title: true
keywords: ["Memory", "团队间共享Memory"]
description: "团队间共享Memory"
---

之前的想法是创建一个团队维护的Prompt库，Prompt用于AI协作，团队成员一起维护Prompt。随着Prompt越来越完善，团队成员使用它与AI的交互也越来越高效。

但随着AI编程助手的不断发展，特别是Cursor和Windsurf等AI编程助手的进步，在AI编程时代，开发人员几乎离不开AI编程助手，又或者说，不使用AI编程助手的开发者即将被时代所淘汰。因此，如何更好利用AI编程助手，特别是在团队成员写作中如何共享和管理最佳实践的内容，是当前团队管理者需要考虑的问题。

一开始我以为共享和维护Prompt即可，但发现这种方式太过于繁琐，效率仍达不到预期。直到最近出现了MCP的交互标准，又接二连三出现了很多MCP的服务，特别是 https://github.com/mem0ai/mem0/tree/main/openmemory 的出现让我有了更好的想法。

既然共享Prompt还不够，那么直接共享Memory如何？

共享Memory需要思考以下几点问题：
1. Memory归根到底其实也是一系列Prompt，只不过是根据用户与AI协作后被沉淀总结下来的Prompt。但也有可能底层是通过RAG方式来实现的存储，而不是明文存储。
2. 需要使用支持MCP的工具，比如 Cursor、Windsurf 等。
3. 共享的Memory如何跨团队共享？
4. 如何评估一个Memory是否是最佳实践？
5. Memory需要能够人工Review且人为编辑，被认可为最佳实践后再在团队中共享。并可以后续由团队成员进一步编辑改进。

