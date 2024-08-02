# Task management system

## Description
Simple task management system. Allowed to operate tasks via Restful APIs

## Features
| Feature | HTTP Method | Path |
| -- | -- | -- |
| Register Account | POST | /users |
| Change Password | PATCH | /users/:uuid |
| Delete Account | POST | /users/:uuid/delete-account |
| Login | POST | /users/login |
| Create Task | POST | /tasks |
| Read Tasks | GET | /tasks |
| Read Task by ID | GET | /tasks/:uuid |
| Update Task | PUT | /tasks/:uuid |
| Delete Task | DELETE | /tasks/:uuid |

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```