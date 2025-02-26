---
slug: "/lfu-cache-algorithm"
title: "LFU缓存算法"
hide_title: true
keywords:
  ["算法", "缓存", "LFU", "最不经常使用", "数据结构", "性能优化", "缓存淘汰"]
description: "详细介绍LFU（最不经常使用）缓存算法的工作原理、实现方法和应用场景，包括缓存淘汰策略和性能分析"
---

LFU (Least Frequently Used) 是一种用于缓存管理的算法。它通过跟踪每个缓存项被访问的频率来决定哪些项应该被移除。LFU算法倾向于保留那些使用频率较高的项，而移除那些使用频率较低的项。

> [!TIP]
> 注意LFU和LRU的区别：
> *   LRU：最近最少使用，是一种常用的页面置换算法，选择最近最久未使用的内容予以淘汰。
> *   LFU：最近最不经常使用，选择最近使用次数最少的内容予以淘汰。对于每个节点，都需要维护其使用次数count、最近使用时间time。

## 工作原理

1.  **计数器**：每个缓存项都有一个计数器，用于记录该项被访问的次数。
2.  **增加计数**：每次缓存项被访问时，其计数器加一。
3.  **移除策略**：当缓存满时，移除计数器值最小的项。如果有多个项的计数器值相同，则根据预定规则（如最早被访问的项）移除其中一个。

## 如何实现

LFU算法的实现可以使用多种数据结构，如哈希表、双向链表和优先队列。以下是一种常见的实现方法：

**使用哈希表和优先队列**：

1.  **哈希表 (cache)**：用于存储缓存项及其计数器。
2.  **优先队列 (min-heap)**：用于快速找到计数器值最小的项。

具体步骤如下：

1.  **插入/更新缓存项**：
    
    *   如果缓存项已存在，更新其计数器并调整优先队列中的位置。
    *   如果缓存项不存在，检查缓存是否已满。如果已满，移除优先队列中计数器值最小的项，然后插入新项。
2.  **访问缓存项**：
    
    *   如果缓存项存在，更新其计数器并调整优先队列中的位置。
    *   如果缓存项不存在，返回未命中。

## 应用场景

LFU算法适用于以下场景：

*   数据访问具有明显的热点数据，且热点数据相对稳定。
*   需要高效管理缓存资源，减少缓存未命中率。

## Go实现

```
package lfu
 
import (
	"container/list"
	"sync"
)
 
type entry struct {
	key   any
	value any
	freq  int
}
 
type LFUCache struct {
	mtx       sync.Mutex // protects the cache
	capacity  int
	size      int
	minFreq   int
	cache     map[any]*list.Element
	frequency map[int]*list.List
}
 
// NewLFUCache creates a new LFU cache
func NewLFUCache(capacity int) *LFUCache {
	return &LFUCache{
		capacity:  capacity,
		cache:     make(map[any]*list.Element),
		frequency: make(map[int]*list.List),
	}
}
 
// Get retrieves a value from the cache
func (c *LFUCache) Get(key any) any {
	c.mtx.Lock()
	defer c.mtx.Unlock()
	if elem, found := c.cache[key]; found {
		c.incrementFrequency(elem)
		return elem.Value.(*entry).value
	}
	return nil
}
 
// Put inserts or updates a value in the cache
func (c *LFUCache) Put(key, value any) {
	c.mtx.Lock()
	defer c.mtx.Unlock()
 
	if c.capacity == 0 {
		return
	}
 
	if elem, found := c.cache[key]; found {
		elem.Value.(*entry).value = value
		c.incrementFrequency(elem)
	} else {
		if c.size == c.capacity {
			c.evict()
		}
		newEntry := &entry{key, value, 1}
		if c.frequency[1] == nil {
			c.frequency[1] = list.New()
		}
		elem := c.frequency[1].PushFront(newEntry)
		c.cache[key] = elem
		c.minFreq = 1
		c.size++
	}
}
 
// incrementFrequency increases the frequency of a cache entry
func (c *LFUCache) incrementFrequency(elem *list.Element) {
	e := elem.Value.(*entry)
	oldFreq := e.freq
	e.freq++
 
	c.frequency[oldFreq].Remove(elem)
	if c.frequency[oldFreq].Len() == 0 {
		delete(c.frequency, oldFreq)
		if c.minFreq == oldFreq {
			c.minFreq++
		}
	}
 
	if c.frequency[e.freq] == nil {
		c.frequency[e.freq] = list.New()
	}
	newElem := c.frequency[e.freq].PushFront(e)
    c.cache[e.key] = newElem
}
 
// evict removes the least frequently used cache entry
func (c *LFUCache) evict() {
	list := c.frequency[c.minFreq]
	elem := list.Back()
	if elem != nil {
		list.Remove(elem)
		delete(c.cache, elem.Value.(*entry).key)
		c.size--
	}
}
```

> [!TIP]
> 这种通过hash表的方式实现的过期淘汰不是很优雅，并且缺少时间的记录。其实可以通过最小堆的方式来实现过期淘汰，感兴趣的朋友可以自行试试。

## 参考资料

*   [https://www.cnblogs.com/lianshuiwuyi/p/18288586](https://www.cnblogs.com/lianshuiwuyi/p/18288586)

  

  

  

  

