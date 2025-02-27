---
slug: "/go-test-disable-cache"
title: "go test 禁用缓存"
hide_title: true
keywords:
  ["go test", "测试缓存", "单元测试", "性能测试", "测试技巧", "开发工具"]
description: "详细说明如何禁用 go test 的缓存功能，包括使用 -count=1 标志和其他相关测试技巧"
---



## 介绍

每当执行 `go test` 时，如果功能代码和测试代码没有变动，则在下一次执行时，会直接读取缓存中的测试结果，并通过 `(cached)` 进行标记。

要禁用测试缓存，可以通过 `-count=1` 标志来实现。

如下示例：

```bash
## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:45:16]
➜ go test -v ./...               
?       go_demo [no test files]
=== RUN   TestCreateUnixMillis
--- PASS: TestCreateUnixMillis (0.00s)
    utils_test.go:7: 1561614325740
PASS
ok      go_demo/utils   0.006s

## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:45:32]
➜ go test -v ./...
?       go_demo [no test files]
=== RUN   TestCreateUnixMillis
--- PASS: TestCreateUnixMillis (0.00s)
    utils_test.go:7: 1561614325740
PASS
ok      go_demo/utils   (cached)

## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:45:38]
➜ go test -v ./...
?       go_demo [no test files]
=== RUN   TestCreateUnixMillis
--- PASS: TestCreateUnixMillis (0.00s)
    utils_test.go:7: 1561614325740
PASS
ok      go_demo/utils   (cached)

## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:45:59]
➜ go test -v ./... -count=1
?       go_demo [no test files]
=== RUN   TestCreateUnixMillis
--- PASS: TestCreateUnixMillis (0.00s)
    utils_test.go:7: 1561614494115
PASS
ok      go_demo/utils   0.006s

## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:48:14]
➜ go test -v ./... -count=1
?       go_demo [no test files]
=== RUN   TestCreateUnixMillis
--- PASS: TestCreateUnixMillis (0.00s)
    utils_test.go:7: 1561614508408
PASS
ok      go_demo/utils   0.006s

## ~/test/hello-drone/go_demo [master ✗ (fe95bec)] [13:48:32]
➜
```

关于 `-count=1` 的解释，可以通过命令 `go help testflag` 来查看：

```text
When 'go test' runs in package list mode, 'go test' caches successful
package test results to avoid unnecessary repeated running of tests. To
disable test caching, use any test flag or argument other than the
cacheable flags. The idiomatic way to disable test caching explicitly
is to use -count=1.
```

## 总结

在 `Go 1.11` 之前，通过 `GOCACHE=off` 的方式来禁用测试缓存：`GOCACHE=off go test ./...`

在 `Go 1.11` 之后，通过 `-count=1` 的方式来禁用测试缓存：`go test -count=1 ./...`

## 参考

*   [cmd/go: how to disable (run test) Cached · Issue #24573 · golang/go](https://github.com/golang/go/issues/24573)
*   [testing - Force retesting or disable test caching - Stack Overflow](https://stackoverflow.com/questions/48882691/force-retesting-or-disable-test-caching)

  

  


