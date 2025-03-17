---
slug: "/goframe/examples"
title: "基于即时可用、最佳实践的Examples示例代码"
hide_title: true
---


| 字段名 | 类型 | 说明 |
| ------ | ------ | ------ |
| `id` | `int` | 主键 |
| `auth_key` | `varchar(255)` | 权限标识，例如`GET:/user/{id}`或`custom:permission_name` |
| `name` | `varchar(100)` | 权限名称 |
| `description` | `varchar(255)` | 权限描述 |
| `status` | `tinyint` | 状态：`0`=禁用，`1`=启用 |
| `created_at` | `datetime` | 创建时间 |
| `updated_at` | `datetime` | 更新时间 |



2. 支持路由参数模式匹配，如`/user/{id}`而不是`/user/1`


