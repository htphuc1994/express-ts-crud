# This repo is for Problem 5- A Crude Server; but you can find the solution for Problem 4- Three ways to sum to n.pdf and Problem 6- Architecture in pdf files under express-ts-crud/

# Problem 5- A Crude Server: Express + TypeScript + Prisma (SQLite) — Configuration & Run Guide

This document explains **how to configure** the project and **how to run** the application in development and
production.

---

## Prerequisites

- **Node.js** v18 or newer
- **npm** (or pnpm/yarn)

---

## 1) Install Dependencies, Set Up Database, and Run the Application

```bash
npm install
```

```bash
npx prisma generate
```

```bash
npx prisma migrate dev --name init
```

```bash
npm run dev
```

## 2) Try it (cURL)

# Create

```
curl -X POST http://localhost:3000/api/resources \
-H 'content-type: application/json' \
-d '{"name":"First","description":"hello"}'
```

# List with filters & pagination

```
curl "http://localhost:3000/api/resources?page=1&pageSize=5&status=ACTIVE&q=fi"
```

# Get / Update / Delete

```
curl http://localhost:3000/api/resources/1
```

```aiignore
curl -X PUT http://localhost:3000/api/resources/1 -H 'content-type: application/json' -d '{"status":"INACTIVE"}'
```

```aiignore
curl -X DELETE http://localhost:3000/api/resources/1
```

## Tests

```bash
npm install --save-dev jest
```

```bash
npx jest
```