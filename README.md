# 🧩 Real-Time Auction System

A full-stack real-time auction application built using **React (Vite)**, **NestJS**, **MySQL**, and **Socket.IO**. It supports real-time bidding, concurrent auctions, and Docker-based deployment with GitHub Actions and DigitalOcean.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), Bootstrap 5
- **Backend:** NestJS, Sequelize (MySQL), WebSocket (Socket.IO)
- **Database:** MySQL 8
- **DevOps:** Docker, Docker Compose, GitHub Actions, DigitalOcean

---

## 📁 Project Structure

```
.
├── backend/         # NestJS Backend API
├── frontend/        # React Frontend
├── docker-compose.yml
├── .github/workflows/deploy.yml  # CI/CD Pipeline
```

---

## ⚙️ Prerequisites

- Docker & Docker Compose installed
- Node.js & npm (for local development)
- MySQL (optional if not using Docker)
- DigitalOcean Droplet (for deployment)
- GitHub Secrets for CI/CD:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  - `DROPLET_SSH_KEY`
  - `BACKEND_ENV_FILE`

---

## 🐳 Local Development (Docker)

### 1. Clone the Repo

```bash
git clone https://github.com/fahadbashir644/bidding-system.git
cd auction-app
```

### 2. Run Docker Compose

```bash
docker compose up --build
```

Access:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8088](http://localhost:8088)

MySQL will be running at port `3308`.

---

## 🧪 Local Development (Without Docker)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure you have a `.env` file in `backend/` with DB credentials and config.

---

## ☁️ CI/CD Deployment (DigitalOcean)

On every `push` or `PR merge` to `main`, the GitHub Actions workflow:

1. **Builds** Docker images for backend and frontend
2. **Pushes** images to Docker Hub
3. **SCPs** the `docker-compose.yml` and `.env` to the DigitalOcean Droplet
4. **Pulls** latest images and restarts containers

---

## 📦 Docker Images

- **Backend:** `fahadbashir644/bidding:backend`
- **Frontend:** `fahadbashir644/bidding:frontend`

You can update these using:
```bash
docker build -t fahadbashir644/bidding:backend ./backend
docker push fahadbashir644/bidding:backend
```

---

## 📂 Environment Variables

**Backend `.env`**
```
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASS=1234
DB_NAME=auction_db
PORT=8088
```

---

## 🧪 Testing

### Backend (NestJS)
```bash
cd backend
npm run test
```

### Frontend (React + Vite + Vitest)
```bash
cd frontend
npm run test
```

---

## 🧠 Features

- ✅ Create and view auction items
- ✅ Place real-time bids via WebSockets
- ✅ Handles concurrent bidding and race conditions
- ✅ Fully containerized with Docker
- ✅ CI/CD with GitHub Actions and DigitalOcean

---

## 🛑 Stopping Services

```bash
docker compose down
```

---

## Ensuring Robustness and Scalability
Concurrency-safe Bid Placement:

 - To prevent race conditions, bid placements use a transaction with LOCK.UPDATE on the Item row to ensure only one bid is processed at a time for a given item.

 - The transaction ensures no two users can place a valid higher bid at the same time that violates auction rules.

Modular Codebase:

 - Separation of concerns in services, models, DTOs, and gateways allows for easier scaling (e.g., moving to microservices later).



## 📞 Support

For any issues or enhancements, please open an [issue](https://github.com/fahadbashir644/bidding-system/issues).