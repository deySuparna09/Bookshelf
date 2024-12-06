# 📚 Bookshelf : A Digital Haven for Book Lovers

## 📝 Overview

Bookshelf is a full-stack web application that brings book enthusiasts together, offering a unique platform to organize, explore, and share their love for reading. Whether you’re a casual reader or a passionate bibliophile, Bookshelf makes managing your reading life effortless and engaging.

At its core, Bookshelf is a mini social network dedicated to book lovers and enables a place for readers to curate their favourite book titles, add ratings, reviews, and comments on reviews by friends.

## ✨ Features

- 🔒 User Authentication: Secure login and registration with JWT.

- 📚 Bookshelf Management: Add books directly from the Google Books API.

- 📊 Interactive Dashboard: Track books you’re reading, completed, and want to read.

- 🗨️ Social Features: Comment on friends’ reviews and interact.

- 🔍 Search Functionality: Find books by title or author.

- 📱 Responsive Design: Fully mobile-friendly UI with Tailwind CSS.

## 💻 Technologies Used

### 🖥️ Frontend ----

- Framework: React (Vite)

- Styling: Tailwind CSS

- State Management: React Context API

### 🌐 Backend ----

- Framework: Express.js

- Database: MongoDB with Mongoose

- Authentication: JSON Web Tokens (JWT)

- API Integration: Google Books API

## ⚙️ Setup Instructions

1️⃣ Clone the repository:

- Install dependencies:

```bash
git clone https://github.com/deySuparna09/Bookshelf.git
```

2️⃣ Setup the Frontend:

- Navigate to the frontend folder:

```bash
cd Frontend
```

- Install dependencies:

```bash
npm install
```

- Set up your .env file:

```bash
VITE_GOOGLE_BOOKS_API_KEY=your-api-key
```

- Start the development server:

```bash
npm run dev
```

3️⃣ Setup the Backend:

- Navigate to the backend folder:

```bash
cd Backend
```

- Install dependencies:

```bash
npm install
```

- Set up your .env file:

```bash
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

- Start the backend server:

```bash
npm run dev
```

4️⃣ Open the App:

Visit the app at `http://localhost:5173` 🎉 .

## 📂 Project Structure

### 🖥️ Frontend

frontend/  
├── src/  
│ ├── components/  
│ ├── pages/  
│ ├── utils/  
│ ├── App.jsx  
├── .env

### 🌐 Backend

backend/  
├── config/  
├── controllers/  
├── middleware/  
├── models/  
├── routes/  
├── .env  
├── server.js
