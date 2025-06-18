# Auction Backend (NestJS + Sequelize + MySQL)

This is the backend service for a real-time auction platform built with **NestJS**, **Sequelize**, **MySQL**, and **Socket.IO**. It supports:
- Creating auction items
- Real-time bidding by users
- Hardcoded user base
- WebSocket notifications on bids

---

## 🛠 Tech Stack

- **NestJS** (TypeScript)
- **Sequelize** (ORM)
- **MySQL** (Database)
- **Socket.IO** (Real-time communication)
- **Docker** (Containerization)

---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build Docker Image
docker build -t auction-backend .

## Run Docker Image
docker run auction-backend
