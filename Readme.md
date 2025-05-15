# Mini CRM Platform

Segment your audiences, deliver personalized campaigns, and unlock AI-powered insights—all from a modern, secure dashboard.

## 📚 Table of Contents

* [Features](#-features)
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [Live Demo](#-live-demo)
* [Getting Started](#-getting-started)
* [Development (Docker)](#-development-docker)
* [Environment Variables](#⚙-environment-variables)
* [API Documentation (Swagger)](#-api-documentation-swagger)
* [Deployment](#-deployment)
* [Contact & Support](#-contact--support)
* [License](#-license)

## 🚀 Features

* **Dynamic Segmentation:** Build complex audience rules with an intuitive drag-and-drop UI.
* **Campaign Automation:** Launch campaigns to selected segments with SMS delivery.
* **AI-Powered Messaging:** Get AI-generated message suggestions tailored to your objectives (Gemini API).
* **Live Delivery Stats:** Real-time tracking of delivered/failed messages per campaign.
* **Google Login:** Secure OAuth 2.0 authentication via Google.
* **Developer API:** RESTful endpoints with JWT authentication and OpenAPI docs.
* **Async Processing (Redis Streams):** Customer and order creation, as well as message delivery receipts, are handled asynchronously using Redis pub/sub.

## 🏗 Architecture

```
[ Frontend (Vercel) ]  <--REST-->  [ Backend API (Render) ]
            |                              |
            |                              |--[ Redis Streams (pub/sub) consumers ]
      End User (browser)                   |
      |-> Customer ingest                  |
      |-> Order ingest                    |
      |-> Delivery Receipt ingest         |
                              [ MySQL Database (Railway) ]
```

Redis Streams and consumer workers (Node.js) are used for background task processing and message queueing.

## 🧠 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Node.js, Express, Sequelize ORM, Joi validation
* **Database:** MySQL (hosted on Railway)
* **Async Queue:** Redis Streams, Pub/Sub, Node.js consumers
* **AI Integration:** Google Gemini API (for AI message suggestions)
* **Authentication:** Google OAuth2 and JWT
* **Cloud/CI:** Docker, Docker Compose, Vercel, Render, Railway

## 🌐 Live Demo

* **Frontend:** [mini-crm-app-ten.vercel.app](https://mini-crm-app-ten.vercel.app)
* **Backend API:** [crm-backend-ycfo.onrender.com](https://crm-backend-ycfo.onrender.com)
* **Swagger Docs:** [crm-backend-ycfo.onrender.com/docs](https://crm-backend-ycfo.onrender.com/docs)

## 💪 Getting Started

### Development (Docker)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/minicrm.git
   cd minicrm
   ```

2. **Configure environment variables**

   * Copy `.env.example` to `.env` in both `/backend` and `/frontend` and update values (see below).

3. **Build and start all services**

   ```bash
   docker-compose up --build
   ```

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:8000](http://localhost:8000)
   * MySQL: Internal (see .env)
   * Redis: Internal for event and task queue

4. **Start background consumers** (in a separate terminal/window):

   ```bash
   # In /backend or similar directory:
   node src/consumers/ingestConsumers.js
   node src/consumers/receiptConsumers.js
   ```

   Or use `npm run worker:*` if scripts are set up. These are required for async creation and message delivery handling.

## ⚙ Environment Variables

### Backend (`/backend/.env`)

```
ENV=development
PORT=8000
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
JWT_SECRET=<your-jwt-secret>
GEMINI_API_KEY=<your-google-gemini-api-key>
BACKEND_BASE_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
```

### Frontend (`/frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Update URLs as needed for production.

## 📘 API Documentation (Swagger)

* **Production:** [Swagger Docs](https://crm-backend-ycfo.onrender.com/docs)
* **Local (Docker):** [http://localhost:8000/docs](http://localhost:8000/docs)

Note: Endpoints for creating customers and orders now return HTTP 202 (Accepted) to indicate queued, asynchronous processing via Redis Streams.

## 🚢 Deployment

### Frontend (Vercel)

* **Deployed at:** [mini-crm-app-ten.vercel.app](https://mini-crm-app-ten.vercel.app)
* Set `NEXT_PUBLIC_API_URL` to your production backend URL.

### Backend (Render)

* **Deployed at:** [crm-backend-ycfo.onrender.com](https://crm-backend-ycfo.onrender.com)
* Dockerized Node.js backend with environment configs in Render dashboard.

### Database (Railway) & Redis

* MySQL instance hosted on Railway.
* Redis required for queues; can be provisioned via Upstash, Railway, or other managed service.
* Ensure connection details are set in your `.env` files and Render variables.

### Worker Deployment

* You should also run your consumer scripts (`ingestConsumers.js`, `receiptConsumers.js`) as background jobs/processes alongside your backend server.

## 📞 Contact & Support

* Developed by **Aditya Goyal**
* 📬 Email: [adityamr.1694@gmail.com](mailto:adityamr.1694@gmail.com)
* 💼 [Portfolio](#)
* 👥 [GitHub](#)
* 🔗 [LinkedIn](#)

## 📜 License

MIT