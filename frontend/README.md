# 🎯 Real-Time Auction Frontend

This is the **frontend client** for a real-time auction system, built using **React**, **Vite**, **Bootstrap 5**, and **Socket.IO**. It allows users to view auction items, place bids, and see real-time bid updates.

---

## 🚀 Features

- Create auction items (name, description, price, duration)
- View all auction items with their highest bids
- Place a bid and see real-time updates via `Socket.IO`
- Instant error/success feedback using `react-toastify`

---

## 🏗️ Tech Stack

- **React + Vite** — fast and modern frontend tooling
- **Bootstrap 5** — responsive styling
- **Socket.IO** — real-time bid updates
- **Axios** — HTTP client
- **React Toastify** — user notifications

---

## 📦 Installation

### 🧰 Prerequisites

- Node.js v18+
- Auction Backend running locally or on a server

### 🛠️ Setup

```bash

# Install dependencies
npm install
```

## Compile and run the project

# development
$ npm run dev

## Build Docker Image
docker build -t auction-frontend .

## Run Docker Image
docker run auction-frontend