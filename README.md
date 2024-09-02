# Task management system

## Description
Simple task management system. Allowed to operate tasks via Restful APIs

## Features
| Feature | HTTP Method | Path |
| -- | -- | -- |
| Register Account | POST | /users |
| Change Password | PUT | /users/password |
| Delete Account | POST | /users/delete-account |
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

## Set up local database via Docker

```bash
$ docker compose up -d
```

## Set up environment variables

```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=user
export DATABASE_PASSWORD=password
export DATABASE_NAME=task_management

export JWT_SECRET=jwt_secret
export JWT_EXPIRES_IN=1h
export JWT_ISSUER=task_management
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