# TravelBharat 🇮🇳
**A Full-Stack Tourism Management Platform for India**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](YOUR_LIVE_LINK_HERE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge)](https://github.com/daivikp40/travelbharat)

**TravelBharat** is a comprehensive, full-stack web application built using the **MERN stack**. It serves as a one-stop destination for travelers to explore the cultural and geographical diversity of India. Users can discover tourist attractions, manage personalized favorite lists, and book hotels or travel packages seamlessly.

---

## 📺 Project Feedback & Walkthrough
I have shared my personal experience, development journey, and a technical walkthrough of the platform in the video below. I discuss architectural decisions, challenges faced with state management, and key engineering takeaways.

[**Watch the Experience & Learning Video Here**](YOUR_VIDEO_LINK_HERE)

---

## 🚀 Live Demo
You can access the live application here: [**TravelBharat Live**](YOUR_LIVE_LINK_HERE)

---

## ✨ Features

### 👤 User Capabilities
* **Secure Authentication:** Token-based session management using **JWT** and secure password hashing with **BcryptJS**.
* **Dynamic Exploration:** Interactive state-wise browsing of detailed tourist spots and hotel information.
* **Personalized Experience:** "Add to Favorites" functionality allowing users to curate their own travel wishlists.
* **Booking Management:** Real-time booking system for hotel stays and curated travel packages.
* **Feedback Loop:** Integrated review system for users to share and read experiences about specific locations.
* **Trip Tracking:** A dedicated "My Trips" dashboard to monitor current and past bookings.

### 🛠 Administrative Control
* **Full CRUD Operations:** Specialized admin dashboard to Create, Read, Update, and Delete states, places, and travel packages.
* **System Oversight:** Tools to manage user bookings and monitor platform activity.

---

## 📸 Screenshots
| Landing Page | State Details | Admin Dashboard |
| :---: | :---: | :---: |
| ![Home](https://via.placeholder.com/300x150?text=Home+Page) | ![State](https://via.placeholder.com/300x150?text=State+Detail) | ![Admin](https://via.placeholder.com/300x150?text=Admin+Panel) |

---

## 💻 Tech Stack

### Frontend
* **React.js (Vite):** Fast, component-based UI development.
* **Tailwind CSS:** Modern utility-first styling for a fully responsive design.
* **React Router:** Declarative routing for seamless navigation.
* **Axios:** Efficient handling of asynchronous API requests.
* **Context API:** Global state management for user authentication and UI state.

### Backend
* **Node.js & Express.js:** Robust and scalable server-side logic.
* **MongoDB:** Flexible, high-performance NoSQL database.
* **Mongoose:** Schema-based data modeling for MongoDB.
* **JWT & BcryptJS:** Industry-standard security for auth and data protection.
* **Nodemailer:** Automated email notifications for user interactions.

---

## 📂 Project Structure
```text
travelbharat/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic
│   ├── middleware/      # Authentication & Security
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # App state logic
│   │   ├── pages/       # View components
│   │   ├── services/    # API calls
│   │   └── data/        # Static assets
│   └── index.html
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
* **Node.js** (v14+)
* **MongoDB Atlas** account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/daivikp40/travelbharat.git
cd travelbharat
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
* Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_private_key
    ```
* Start the server:
    ```bash
    npm start
    ```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
```
* Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
* Start the development environment:
    ```bash
    npm run dev
    ```

---

## 🧠 Key Engineering Learnings
* **Schema Design:** Implemented complex relationships in MongoDB to link users with bookings and favorites.
* **Security Best Practices:** Secured API routes using custom middleware and protected sensitive data using environment variables.
* **State Management:** Optimized UI reactivity by implementing React Context API to avoid prop-drilling across the MERN app.
* **API Optimization:** Designed RESTful endpoints to handle diverse travel data types efficiently.

---

## 👨‍💻 Author
**Patel Daivik**
* Computer Engineering Graduate, **LDRP-ITR, Gandhinagar**
* Full-Stack Web Developer specialized in MERN & Django.

--
