# 🧠 Issue Store – Fullstack Monorepo (WIP)

> AI-powered monorepo using Next.js + FastAPI, Prisma, and Supabase.

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-yellow)

---

## 📦 Stack

- **Frontend:** [Next.js](https://nextjs.org/) (`apps/web`)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (`apps/llm-backend`)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **DevOps:** Docker + Compose

---

## 📁 Project Structure



---

## 🚀 Getting Started

### 🐳 Run with Docker

```bash
docker-compose up --build
```
## 💻 Run Manually
- ### Start backend:

```bash
cd apps/llm-backend
uvicorn main:app --reload --port 8000
```

- ### Start frontend:


```bash
cd apps/web
yarn install
yarn dev or yarn run dev
```

## ⚙️ Environment Setup
- Each app uses its own `.env` file.

- Use .env.example as reference and keep actual `.env` files out of version control.

## 🛡 IPv6 Fix for Prisma
> If you use Supabase + Prisma in Docker and face DNS issues:

```bash
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1
```

## 🛠 Under Development
- Feature	Status
- Monorepo Structure `✅ Complete`
- FastAPI + Next.js	`🚧 In Progress`
- Prisma Integration `✅ Working`
- LLM Integration	`🚧 In Progress`
- Production Deployment	`🔜 Coming Soon`

## 👤 Author
> Made by Sujan Thapa
MIT License
