---
slug: "/ddd-project-structure"
title: "DDD"
hide_title: true
unlisted: true
keywords: ["DDD", "项目结构", "领域驱动设计", "目录结构", "代码组织"]
description: "展示DDD（领域驱动设计）项目的标准目录结构和代码组织方式，包括领域层、应用层、基础设施层等"
---

```
ecommerce/
├── cmd/                           # 应用程序入口
│   └── api/
│       └── main.go
│
├── internal/                      # 内部代码
│   ├── domain/                    # 领域层
│   │   ├── order/                # 订单领域
│   │   │   ├── entity/           # 实体
│   │   │   │   ├── order.go
│   │   │   │   └── order_item.go
│   │   │   ├── valueobject/      # 值对象
│   │   │   │   ├── money.go
│   │   │   │   └── status.go
│   │   │   ├── repository/       # 仓储接口
│   │   │   │   └── order_repository.go
│   │   │   ├── service/          # 领域服务
│   │   │   │   └── order_service.go
│   │   │   └── event/            # 领域事件
│   │   │       └── order_events.go
│   │   │
│   │   └── product/              # 商品领域
│   │       ├── entity/
│   │       ├── valueobject/
│   │       ├── repository/
│   │       └── service/
│   │
│   ├── application/              # 应用层
│   │   ├── order/               # 订单应用服务
│   │   │   ├── dto/            # 数据传输对象
│   │   │   │   ├── order_dto.go
│   │   │   │   └── request.go
│   │   │   └── service.go
│   │   └── product/
│   │
│   ├── infrastructure/          # 基础设施层
│   │   ├── persistence/        # 持久化
│   │   │   ├── mysql/
│   │   │   │   └── order_repository.go
│   │   │   └── redis/
│   │   ├── messaging/         # 消息
│   │   │   └── kafka/
│   │   └── auth/             # 认证
│   │
│   └── interfaces/            # 接口层
│       ├── api/              # API接口
│       │   ├── handler/
│       │   │   ├── order_handler.go
│       │   │   └── product_handler.go
│       │   └── middleware/
│       └── grpc/            # gRPC接口
│
├── pkg/                      # 公共包
│   ├── errors/
│   ├── logger/
│   └── utils/
│
└── configs/                  # 配置文件
    └── config.yaml
```