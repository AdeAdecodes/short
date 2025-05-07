# 🧪 Testing the Shortlink App

This guide explains how to test the **URL Shortener** app in both development and production environments.

---

## ⚙️ Environment Setup

### 1. Create `.env` file in the root directory:

```dotenv
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URL=your_postgresql_connection_url
NODE_ENV=development
USE_IN_MEMORY=true         # Set to true for development without PostgreSQL
```

---

## 🚀 Running the App Locally

### 🔧 Backend

Start the backend API:

```bash
npm install
npm start
```

To run backend tests:

```bash
npm run test
```

The backend will run on: [http://localhost:5000](http://localhost:5000)

---

### 💻 Frontend (React)
```bash
cd UI
```

## Create `.env` file in the root directory of the frontend(UI):

```dotenv
VITE_API_BASE=http://localhost:5000/api
```

#### Development mode (hot reload):

```bash
npm install
npm run dev
```

The frontend will run on: [http://localhost:5173](http://localhost:5173) (default Vite port)

#### Production build:

To build and serve production assets:

```bash
cd UI
npm run build
```

Then serve using any static server, e.g.:

```bash
npm install -g serve
serve -s dist
```

> If you want to serve React from the backend, move `UI/dist` into Express `static` folder and update your backend code accordingly.

---

## 🔌 API Testing

### Base URL

- **Development**: `http://localhost:5000/api`
- **Development-API-docs**: `http://localhost:5000/api-docs`
- **Production**: `https://short-af4u.onrender.com/api`
- **Production-API-docs**: `https://short-af4u.onrender.com/api-docs`

### 🔁 Encode URL

```http
POST /api/encode
Content-Type: application/json

{
  "longUrl": "https://example.com"
}
```

### 🔓 Decode Short URL

```http
POST /api/decode
Content-Type: application/json

{
  "shortUrl": "http://localhost:5000/abc123"
}
```

### 📊 Get Statistics

```http
GET /api/statistic/:code
```

### 📄 List All URLs

```http
GET /api/list
```

### 🔀 Redirection

```http
GET /:code
```

Redirects the short code to the original URL.

---

## ✅ Testing Tips

- Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API endpoints.
- Check console logs for `In-Memory Mode` confirmation when `USE_IN_MEMORY=true` is enabled.
- Confirm API requests are hitting the right base URL (`localhost` or your Render URL).
- Add CORS headers if testing frontend and backend on different ports.

---

## 🌐 Live URLs

- **Frontend**: [https://short-1-yqej.onrender.com](https://short-1-yqej.onrender.com)
- **Backend**: [https://short-af4u.onrender.com](https://short-af4u.onrender.com)
