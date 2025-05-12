# Mini CRM Platform

Segment your audiences, deliver personalized campaigns, and unlock AI-powered insights—all from a modern, secure dashboard.

---

## 📚 Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Live Demo](#live-demo)
* [Screenshots](#screenshots)
* [Getting Started](#getting-started)

  * [Development (Docker)](#development-docker)
  * [Environment Variables](#environment-variables)
* [API Documentation (Swagger)](#api-documentation-swagger)
* [Deployment](#deployment)

  * [Frontend (Vercel)](#frontend-vercel)
  * [Backend (Render)](#backend-render)
  * [Database (Railway)](#database-railway)
* [Contact & Support](#contact--support)
* [License](#license)

---

## 🚀 Features

* **Dynamic Segmentation:** Build complex audience rules with an intuitive drag-and-drop UI.
* **Campaign Automation:** Launch campaigns to selected segments with SMS delivery.
* **AI-Powered Messaging:** Get AI-generated message suggestions tailored to your objectives (Gemini API).
* **Live Delivery Stats:** Real-time tracking of delivered/failed messages per campaign.
* **Google Login:** Secure OAuth 2.0 authentication via Google.
* **Developer API:** RESTful endpoints with JWT authentication and OpenAPI docs.

---

## 🏗 Architecture

```
[ Frontend (Vercel) ]  <--REST-->  [ Backend API (Render) ]  <--SQL-->  [ MySQL (Railway) ]
            |                                   |  
            |                                   |
      End User (browser)               Swagger UI Docs
```

---

## 🧰 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Node.js, Express, Sequelize ORM, Joi validation
* **Database:** MySQL (hosted on Railway)
* **AI Integration:** Google Gemini API (for AI message suggestions)
* **Authentication:** Google OAuth2 and JWT
* **Cloud/CI:** Docker, Docker Compose, Vercel, Render, Railway

---

## 🌐 Live Demo

* **Frontend:** [mini-crm-app-ten.vercel.app](https://mini-crm-app-ten.vercel.app)
* **Backend API:** [crm-backend-ycfo.onrender.com](https://crm-backend-ycfo.onrender.com)
* **Swagger Docs:** [crm-backend-ycfo.onrender.com/docs](https://crm-backend-ycfo.onrender.com/docs)

---

## 🛠 Getting Started

### Development (Docker)

1. **Clone the repository**

```bash
git clone https://github.com/your-username/minicrm.git
cd minicrm
```

2. **Configure environment variables**
   Copy `.env.example` to `.env` in both `/backend` and `/frontend` and update values (see below).

3. **Build and start all services**

```bash
docker-compose up --build
```

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:8000`
* MySQL: Internal (see `.env`)

---

## ⚙ Environment Variables

### Backend (`/backend/.env`)

```env
PORT=8000
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
JWT_SECRET=<your-jwt-secret>
GEMINI_API_KEY=<your-google-gemini-api-key>
BACKEND_BASE_URL=http://localhost:8000
```

### Frontend (`/frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

*Update URLs as needed for production.*

---

## 📘 API Documentation (Swagger)

* **Production:** [Swagger Docs](https://crm-backend-ycfo.onrender.com/docs)
* **Local (Docker):** `http://localhost:8000/docs`

Explore endpoints, authentication, and schemas with Swagger UI.

---

## 🚢 Deployment

### Frontend (Vercel)

Deployed at: [mini-crm-app-ten.vercel.app](https://mini-crm-app-ten.vercel.app)
Set `NEXT_PUBLIC_API_URL` to your production backend URL.

### Backend (Render)

Deployed at: [crm-backend-ycfo.onrender.com](https://crm-backend-ycfo.onrender.com)
Dockerized Node.js backend with environment configs in Render dashboard.

### Database (Railway)

MySQL instance hosted on Railway.
Ensure connection details are set in your `.env` files and Render variables.

---

## 📞 Contact & Support

Developed by **Aditya Goyal**

* 📬 Email: [adityamr.1694@gmail.com](mailto:adityamr.1694@gmail.com)
* 💼 [Portfolio](https://port-folio-two-flame.vercel.app)
* 👥 [GitHub](https://github.com/aditya-goyal1694)
* 🔗 [LinkedIn](https://www.linkedin.com/in/aditya-goyal18)

---

## 📝 License

MIT