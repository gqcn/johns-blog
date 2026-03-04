# User Service Design

Date: 2026-03-03
Framework: GoFrame v2
Database: SQLite
Purpose: Learning / Demo

---

## 1. Overview

A RESTful user service built with GoFrame v2, providing standard CRUD operations for user management with built-in parameter validation. Designed as a learning project to demonstrate GoFrame's layered architecture and ORM capabilities.

---

## 2. Directory Structure

Generated via `gf init user-service`, then implemented as follows:

```
user-service/
├── main.go
├── go.mod
├── api/
│   └── user/v1/
│       └── user.go             # Request/response DTOs (API protocol layer)
├── internal/
│   ├── cmd/
│   │   └── cmd.go              # HTTP server startup
│   ├── controller/
│   │   └── user/
│   │       └── user.go         # HTTP handlers
│   ├── service/
│   │   └── user/
│   │       └── user.go         # Business logic interface + implementation
│   ├── dao/
│   │   └── user.go             # Data access layer (gf gen dao generated)
│   └── model/
│       ├── entity/user.go      # Database entity (gf gen dao generated)
│       └── do/user.go          # Data object (gf gen dao generated)
└── manifest/
    └── config/config.yaml      # Port + SQLite path configuration
```

**Tech Stack:** GoFrame v2 · SQLite · Go 1.21+

---

## 3. API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/users` | Create user |
| `GET` | `/api/v1/users` | List users (paginated) |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `PUT` | `/api/v1/users/:id` | Update user |
| `DELETE` | `/api/v1/users/:id` | Delete user |

### User Fields

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | int64 | Auto-increment primary key |
| `username` | string | Unique, required, 3–32 chars |
| `email` | string | Unique, required, valid email format |
| `password` | string | Required on create; stored as bcrypt hash; never returned in responses |
| `created_at` | datetime | Auto-set |
| `updated_at` | datetime | Auto-updated |

### Validation Rules (GoFrame `v` tag)

- **Create:** username, email, password required; username length 3–32; email format check
- **Update:** all fields optional, same format rules apply
- **List:** `?page=1&pageSize=10` (defaults: page=1, pageSize=10)

### Unified Response Format

```json
{ "code": 0, "message": "OK", "data": { ... } }
```

Error codes: `0` success · `400` bad request · `404` not found · `409` conflict (duplicate username/email) · `500` internal error

---

## 4. Data Flow

```
HTTP Request
  → Controller  (bind + validate params, return JSON)
    → Service   (business rules: uniqueness check, bcrypt hashing)
      → DAO     (gdb ORM executes SQL)
        → SQLite
```

---

## 5. Error Handling

- Use GoFrame `gerror` package to propagate typed errors with codes
- Controller catches errors and maps them to HTTP status codes + unified JSON body
- Password never appears in any response payload
- Validation errors return field-level detail messages via GoFrame's built-in validator

---

## 6. Out of Scope

- JWT authentication / authorization
- Role-based access control
- Rate limiting
- Email verification
