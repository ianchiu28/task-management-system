#!/bin/bash

# database
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=user
export DATABASE_PASSWORD=password
export DATABASE_NAME=task_management

# jwt
export JWT_SECRET=jwt_secret
export JWT_EXPIRES_IN=1h
export JWT_ISSUER=task_management

# run
npm run start:dev

# unit tests
# npm run test

# e2e tests
# npm run test:e2e

# test coverage
# npm run test:cov