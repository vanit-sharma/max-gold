# BP Mernstack Project

Following is the important information:

- 🔌 Concurrently runs both frontend and backend, so no need to run the frontend and backend separately.
- ⚙️ .env is added for theEnvironment variable support, copy example.env to .env and use/update the values there

---

## 📁 Project Structure

```
mern-app/
│
├── backend/          # Express backend
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── package.json      # Root - controls both frontend and backend
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/VSharma-Tech/bp-react.git
cd bp-react
```

### 2. Install Dependencies

```bash
npm run install-all
```

This installs packages in both `/frontend` and `/backend`.

### 3. Start Development Servers

```bash
npm run dev
```

- React frontend: http://localhost:3000
- Express backend: http://localhost:5000 (or as defined in `.env`)

---

## 🔐 Environment Variables

Create a `.env` file in `/backend`:

```env
PORT=5000
```

---

## 🔧 Available Scripts (For reference only!)

### In root:

- `npm run dev` – Runs both backend and frontend concurrently
- `npm run server` – Starts only the Express backend
- `npm run client` – Starts only the React frontend
- `npm run install-all` – Installs dependencies in both folders

### In `/backend`:

- `npm run dev` – Runs Express server with `nodemon`

### In `/frontend`:

- `npm start` – Runs React dev server

---

## 🧪 To Do:

- Adding frontend pages

## Junk
 keys *
 hgetall "event_bz_events"