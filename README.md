# ⛽ Petrol Station Management System

The **Petrol Station Management System** is a full-stack web application designed to automate and manage daily petrol station operations efficiently. It handles key processes such as fuel sales, attendant shifts, pump tracking, and reporting — replacing manual records with a reliable, secure, and user-friendly system.

## 🚀 Tech Stack

- **Frontend:** Next.js (React + TailwindCSS)
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Styling:** TailwindCSS + Shadcn UI
- **APIs:** RESTful APIs (JSON-based communication)

## 📋 Features

- 👨‍💼 Admin and Attendant Role Management  
- ⛽ Fuel Sales and Pump Tracking  
- 💰 Shift Start/End and Sales Reports  
- 📊 Dashboard with Real-time Statistics  
- 🔐 Secure Login and Authentication  
- 🗃️ MySQL Database Integration  

## 🧩 Folder Structure

petrol-station-management/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ └── server.js
│
├── frontend/
│ ├── app/
│ ├── components/
│ ├── pages/
│ └── package.json
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/petrol-station-management.git
cd petrol-station-management

2️⃣ Backend Setup
cd backend
npm install

Create a .env file in the backend folder:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=petrol_station
JWT_SECRET=your_jwt_secret

Start the backend server:
npm run dev


3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev

Access the app at:
👉 http://localhost:3000

🗄️ Database Setup (MySQL)
Create a new MySQL database:
CREATE DATABASE petrol_station;
USE petrol_station;

Example Tables
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','attendant') DEFAULT 'attendant',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fuel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  price DECIMAL(10,2),
  quantity DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  fuelType VARCHAR(50),
  quantity DECIMAL(10,2),
  amount DECIMAL(10,2),
  pumpNumber INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  endTime TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);


🔧 Default Admin Account (optional)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@station.com', '<hashed_password>', 'admin');

(You can generate a hashed password using bcrypt or through the signup route.)

🧠 Usage


Admins can manage attendants, view reports, track sales, and control fuel data.


Attendants can log in, start/end shifts, and record sales.



🛠️ Scripts
Backend:
npm run dev

Frontend:
npm run dev


💡 Author
Developed by [Kalemeera Collins]
📧 Contact: kalemeeracollins@outlook.com
🔗 GitHub: Kalemeeracollins

📜 License
This project is licensed under the MIT License — feel free to use and modify it.

✅ Petrol Station Management System – Simplifying daily petrol station operations through automation and real-time insights.

---

Would you like me to modify this README for **deployment instructions** (e.g., hosting backend on Render and frontend on Vercel)?
