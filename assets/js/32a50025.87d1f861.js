"use strict";(self.webpackChunkgf_site=self.webpackChunkgf_site||[]).push([["7559"],{35824:function(e,n,c){c.r(n),c.d(n,{metadata:()=>l,contentTitle:()=>s,default:()=>o,assets:()=>a,toc:()=>h,frontMatter:()=>t});var l=JSON.parse('{"id":"\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/\u7B97\u6CD5/LFU\u7F13\u5B58\u7B97\u6CD5","title":"LFU\u7F13\u5B58\u7B97\u6CD5","description":"\u8BE6\u7EC6\u4ECB\u7ECDLFU\uFF08\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528\uFF09\u7F13\u5B58\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u5305\u62EC\u7F13\u5B58\u6DD8\u6C70\u7B56\u7565\u548C\u6027\u80FD\u5206\u6790","source":"@site/docs/7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5/3-LFU\u7F13\u5B58\u7B97\u6CD5.md","sourceDirName":"7-\u6570\u636E\u7ED3\u6784\u548C\u7B97\u6CD5/0-\u7B97\u6CD5","slug":"/lfu-cache-algorithm","permalink":"/lfu-cache-algorithm","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"slug":"/lfu-cache-algorithm","title":"LFU\u7F13\u5B58\u7B97\u6CD5","hide_title":true,"keywords":["\u7B97\u6CD5","\u7F13\u5B58","LFU","\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528","\u6570\u636E\u7ED3\u6784","\u6027\u80FD\u4F18\u5316","\u7F13\u5B58\u6DD8\u6C70"],"description":"\u8BE6\u7EC6\u4ECB\u7ECDLFU\uFF08\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528\uFF09\u7F13\u5B58\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u5305\u62EC\u7F13\u5B58\u6DD8\u6C70\u7B56\u7565\u548C\u6027\u80FD\u5206\u6790"},"sidebar":"mainSidebar","previous":{"title":"\u9875\u9762\u7F6E\u6362\u7B97\u6CD5","permalink":"/page-replacement-algorithm"},"next":{"title":"\u53CD\u8F6C\u94FE\u8868(1)","permalink":"/reverse-linked-list"}}'),i=c("85893"),r=c("50065");let t={slug:"/lfu-cache-algorithm",title:"LFU\u7F13\u5B58\u7B97\u6CD5",hide_title:!0,keywords:["\u7B97\u6CD5","\u7F13\u5B58","LFU","\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528","\u6570\u636E\u7ED3\u6784","\u6027\u80FD\u4F18\u5316","\u7F13\u5B58\u6DD8\u6C70"],description:"\u8BE6\u7EC6\u4ECB\u7ECDLFU\uFF08\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528\uFF09\u7F13\u5B58\u7B97\u6CD5\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u5B9E\u73B0\u65B9\u6CD5\u548C\u5E94\u7528\u573A\u666F\uFF0C\u5305\u62EC\u7F13\u5B58\u6DD8\u6C70\u7B56\u7565\u548C\u6027\u80FD\u5206\u6790"},s=void 0,a={},h=[{value:"\u5DE5\u4F5C\u539F\u7406",id:"\u5DE5\u4F5C\u539F\u7406",level:2},{value:"\u5982\u4F55\u5B9E\u73B0",id:"\u5982\u4F55\u5B9E\u73B0",level:2},{value:"\u5E94\u7528\u573A\u666F",id:"\u5E94\u7528\u573A\u666F",level:2},{value:"Go\u5B9E\u73B0",id:"go\u5B9E\u73B0",level:2},{value:"\u53C2\u8003\u8D44\u6599",id:"\u53C2\u8003\u8D44\u6599",level:2}];function u(e){let n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"LFU (Least Frequently Used) \u662F\u4E00\u79CD\u7528\u4E8E\u7F13\u5B58\u7BA1\u7406\u7684\u7B97\u6CD5\u3002\u5B83\u901A\u8FC7\u8DDF\u8E2A\u6BCF\u4E2A\u7F13\u5B58\u9879\u88AB\u8BBF\u95EE\u7684\u9891\u7387\u6765\u51B3\u5B9A\u54EA\u4E9B\u9879\u5E94\u8BE5\u88AB\u79FB\u9664\u3002LFU\u7B97\u6CD5\u503E\u5411\u4E8E\u4FDD\u7559\u90A3\u4E9B\u4F7F\u7528\u9891\u7387\u8F83\u9AD8\u7684\u9879\uFF0C\u800C\u79FB\u9664\u90A3\u4E9B\u4F7F\u7528\u9891\u7387\u8F83\u4F4E\u7684\u9879\u3002"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"[!TIP]\n\u6CE8\u610FLFU\u548CLRU\u7684\u533A\u522B\uFF1A"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"LRU\uFF1A\u6700\u8FD1\u6700\u5C11\u4F7F\u7528\uFF0C\u662F\u4E00\u79CD\u5E38\u7528\u7684\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF0C\u9009\u62E9\u6700\u8FD1\u6700\u4E45\u672A\u4F7F\u7528\u7684\u5185\u5BB9\u4E88\u4EE5\u6DD8\u6C70\u3002"}),"\n",(0,i.jsx)(n.li,{children:"LFU\uFF1A\u6700\u8FD1\u6700\u4E0D\u7ECF\u5E38\u4F7F\u7528\uFF0C\u9009\u62E9\u6700\u8FD1\u4F7F\u7528\u6B21\u6570\u6700\u5C11\u7684\u5185\u5BB9\u4E88\u4EE5\u6DD8\u6C70\u3002\u5BF9\u4E8E\u6BCF\u4E2A\u8282\u70B9\uFF0C\u90FD\u9700\u8981\u7EF4\u62A4\u5176\u4F7F\u7528\u6B21\u6570count\u3001\u6700\u8FD1\u4F7F\u7528\u65F6\u95F4time\u3002"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u5DE5\u4F5C\u539F\u7406",children:"\u5DE5\u4F5C\u539F\u7406"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"\u8BA1\u6570\u5668"}),"\uFF1A\u6BCF\u4E2A\u7F13\u5B58\u9879\u90FD\u6709\u4E00\u4E2A\u8BA1\u6570\u5668\uFF0C\u7528\u4E8E\u8BB0\u5F55\u8BE5\u9879\u88AB\u8BBF\u95EE\u7684\u6B21\u6570\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"\u589E\u52A0\u8BA1\u6570"}),"\uFF1A\u6BCF\u6B21\u7F13\u5B58\u9879\u88AB\u8BBF\u95EE\u65F6\uFF0C\u5176\u8BA1\u6570\u5668\u52A0\u4E00\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"\u79FB\u9664\u7B56\u7565"}),"\uFF1A\u5F53\u7F13\u5B58\u6EE1\u65F6\uFF0C\u79FB\u9664\u8BA1\u6570\u5668\u503C\u6700\u5C0F\u7684\u9879\u3002\u5982\u679C\u6709\u591A\u4E2A\u9879\u7684\u8BA1\u6570\u5668\u503C\u76F8\u540C\uFF0C\u5219\u6839\u636E\u9884\u5B9A\u89C4\u5219\uFF08\u5982\u6700\u65E9\u88AB\u8BBF\u95EE\u7684\u9879\uFF09\u79FB\u9664\u5176\u4E2D\u4E00\u4E2A\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u5982\u4F55\u5B9E\u73B0",children:"\u5982\u4F55\u5B9E\u73B0"}),"\n",(0,i.jsx)(n.p,{children:"LFU\u7B97\u6CD5\u7684\u5B9E\u73B0\u53EF\u4EE5\u4F7F\u7528\u591A\u79CD\u6570\u636E\u7ED3\u6784\uFF0C\u5982\u54C8\u5E0C\u8868\u3001\u53CC\u5411\u94FE\u8868\u548C\u4F18\u5148\u961F\u5217\u3002\u4EE5\u4E0B\u662F\u4E00\u79CD\u5E38\u89C1\u7684\u5B9E\u73B0\u65B9\u6CD5\uFF1A"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"\u4F7F\u7528\u54C8\u5E0C\u8868\u548C\u4F18\u5148\u961F\u5217"}),"\uFF1A"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"\u54C8\u5E0C\u8868 (cache)"}),"\uFF1A\u7528\u4E8E\u5B58\u50A8\u7F13\u5B58\u9879\u53CA\u5176\u8BA1\u6570\u5668\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"\u4F18\u5148\u961F\u5217 (min-heap)"}),"\uFF1A\u7528\u4E8E\u5FEB\u901F\u627E\u5230\u8BA1\u6570\u5668\u503C\u6700\u5C0F\u7684\u9879\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u5177\u4F53\u6B65\u9AA4\u5982\u4E0B\uFF1A"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"\u63D2\u5165/\u66F4\u65B0\u7F13\u5B58\u9879"}),"\uFF1A"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5982\u679C\u7F13\u5B58\u9879\u5DF2\u5B58\u5728\uFF0C\u66F4\u65B0\u5176\u8BA1\u6570\u5668\u5E76\u8C03\u6574\u4F18\u5148\u961F\u5217\u4E2D\u7684\u4F4D\u7F6E\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u5982\u679C\u7F13\u5B58\u9879\u4E0D\u5B58\u5728\uFF0C\u68C0\u67E5\u7F13\u5B58\u662F\u5426\u5DF2\u6EE1\u3002\u5982\u679C\u5DF2\u6EE1\uFF0C\u79FB\u9664\u4F18\u5148\u961F\u5217\u4E2D\u8BA1\u6570\u5668\u503C\u6700\u5C0F\u7684\u9879\uFF0C\u7136\u540E\u63D2\u5165\u65B0\u9879\u3002"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"\u8BBF\u95EE\u7F13\u5B58\u9879"}),"\uFF1A"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5982\u679C\u7F13\u5B58\u9879\u5B58\u5728\uFF0C\u66F4\u65B0\u5176\u8BA1\u6570\u5668\u5E76\u8C03\u6574\u4F18\u5148\u961F\u5217\u4E2D\u7684\u4F4D\u7F6E\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u5982\u679C\u7F13\u5B58\u9879\u4E0D\u5B58\u5728\uFF0C\u8FD4\u56DE\u672A\u547D\u4E2D\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u5E94\u7528\u573A\u666F",children:"\u5E94\u7528\u573A\u666F"}),"\n",(0,i.jsx)(n.p,{children:"LFU\u7B97\u6CD5\u9002\u7528\u4E8E\u4EE5\u4E0B\u573A\u666F\uFF1A"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u6570\u636E\u8BBF\u95EE\u5177\u6709\u660E\u663E\u7684\u70ED\u70B9\u6570\u636E\uFF0C\u4E14\u70ED\u70B9\u6570\u636E\u76F8\u5BF9\u7A33\u5B9A\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u9700\u8981\u9AD8\u6548\u7BA1\u7406\u7F13\u5B58\u8D44\u6E90\uFF0C\u51CF\u5C11\u7F13\u5B58\u672A\u547D\u4E2D\u7387\u3002"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"go\u5B9E\u73B0",children:"Go\u5B9E\u73B0"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'package lfu\n \nimport (\n	"container/list"\n	"sync"\n)\n \ntype entry struct {\n	key   any\n	value any\n	freq  int\n}\n \ntype LFUCache struct {\n	mtx       sync.Mutex // protects the cache\n	capacity  int\n	size      int\n	minFreq   int\n	cache     map[any]*list.Element\n	frequency map[int]*list.List\n}\n \n// NewLFUCache creates a new LFU cache\nfunc NewLFUCache(capacity int) *LFUCache {\n	return &LFUCache{\n		capacity:  capacity,\n		cache:     make(map[any]*list.Element),\n		frequency: make(map[int]*list.List),\n	}\n}\n \n// Get retrieves a value from the cache\nfunc (c *LFUCache) Get(key any) any {\n	c.mtx.Lock()\n	defer c.mtx.Unlock()\n	if elem, found := c.cache[key]; found {\n		c.incrementFrequency(elem)\n		return elem.Value.(*entry).value\n	}\n	return nil\n}\n \n// Put inserts or updates a value in the cache\nfunc (c *LFUCache) Put(key, value any) {\n	c.mtx.Lock()\n	defer c.mtx.Unlock()\n \n	if c.capacity == 0 {\n		return\n	}\n \n	if elem, found := c.cache[key]; found {\n		elem.Value.(*entry).value = value\n		c.incrementFrequency(elem)\n	} else {\n		if c.size == c.capacity {\n			c.evict()\n		}\n		newEntry := &entry{key, value, 1}\n		if c.frequency[1] == nil {\n			c.frequency[1] = list.New()\n		}\n		elem := c.frequency[1].PushFront(newEntry)\n		c.cache[key] = elem\n		c.minFreq = 1\n		c.size++\n	}\n}\n \n// incrementFrequency increases the frequency of a cache entry\nfunc (c *LFUCache) incrementFrequency(elem *list.Element) {\n	e := elem.Value.(*entry)\n	oldFreq := e.freq\n	e.freq++\n \n	c.frequency[oldFreq].Remove(elem)\n	if c.frequency[oldFreq].Len() == 0 {\n		delete(c.frequency, oldFreq)\n		if c.minFreq == oldFreq {\n			c.minFreq++\n		}\n	}\n \n	if c.frequency[e.freq] == nil {\n		c.frequency[e.freq] = list.New()\n	}\n	newElem := c.frequency[e.freq].PushFront(e)\n    c.cache[e.key] = newElem\n}\n \n// evict removes the least frequently used cache entry\nfunc (c *LFUCache) evict() {\n	list := c.frequency[c.minFreq]\n	elem := list.Back()\n	if elem != nil {\n		list.Remove(elem)\n		delete(c.cache, elem.Value.(*entry).key)\n		c.size--\n	}\n}\n'})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"[!TIP]\n\u8FD9\u79CD\u901A\u8FC7hash\u8868\u7684\u65B9\u5F0F\u5B9E\u73B0\u7684\u8FC7\u671F\u6DD8\u6C70\u4E0D\u662F\u5F88\u4F18\u96C5\uFF0C\u5E76\u4E14\u7F3A\u5C11\u65F6\u95F4\u7684\u8BB0\u5F55\u3002\u5176\u5B9E\u53EF\u4EE5\u901A\u8FC7\u6700\u5C0F\u5806\u7684\u65B9\u5F0F\u6765\u5B9E\u73B0\u8FC7\u671F\u6DD8\u6C70\uFF0C\u611F\u5174\u8DA3\u7684\u670B\u53CB\u53EF\u4EE5\u81EA\u884C\u8BD5\u8BD5\u3002"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u53C2\u8003\u8D44\u6599",children:"\u53C2\u8003\u8D44\u6599"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://www.cnblogs.com/lianshuiwuyi/p/18288586",children:"https://www.cnblogs.com/lianshuiwuyi/p/18288586"})}),"\n"]}),"\n"]})]})}function o(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},50065:function(e,n,c){c.d(n,{Z:function(){return s},a:function(){return t}});var l=c(67294);let i={},r=l.createContext(i);function t(e){let n=l.useContext(r);return l.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),l.createElement(r.Provider,{value:n},e.children)}}}]);