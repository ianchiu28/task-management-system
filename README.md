# Task management system

## Description
Simple task management system. Allowed to operate tasks via Restful APIs

## Features
| Feature | HTTP Method | Path |
| -- | -- | -- |
| Login | POST | /login |
| Create Task | POST | /tasks |
| Read Tasks | GET | /tasks |
| Read Task by ID | GET | /tasks/:id |
| Update Task | PUT | /tasks/:id |
| Delete Task | DELETE | /tasks/:id |

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