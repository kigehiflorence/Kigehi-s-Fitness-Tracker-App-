# Kigehi-s-Fitness-Tracker-App-
# Fitness Tracker Web Application

A simple, beginner-friendly **Fitness Tracker Web Application** that helps users monitor daily physical activity, set fitness goals, and track progress over time. This project was developed for **CSC 417**.

---

## 📌 Project Overview

The Fitness Tracker Web Application allows users to:
- Log daily activities (steps and calories)
- Set and monitor fitness goals
- View activity history
- Stay motivated through simple progress tracking

The application focuses on **simplicity, accessibility, and ease of use**, especially for beginners.

---

## 🛠️ Technologies Used

### Frontend
- HTML5  
- CSS3  
- TypeScript  
- React  

### Backend
- Python  
- FastAPI  

### Database
- SQLite  

---

## 🏗️ System Architecture

Frontend (React + TypeScript)
↓ REST API (JSON)
Backend (FastAPI - Python)
↓
SQLite Database


---

## ⚙️ Features

- User-friendly interface
- Activity logging (steps & calories)
- Goal setting (daily step goals)
- Activity history
- Lightweight and fast system

---

## 📂 Project Structure



fitness-tracker/
│
├── backend/
│ ├── main.py
│ └── models.py
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ActivityForm.tsx
│ │ │ └── ActivityList.tsx
│ │ └── App.tsx
│ └── package.json
│
└── README.md


---

## 🚀 Installation & Setup

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload


Backend runs at:

http://127.0.0.1:8000

2️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🧪 Testing

Log activities using the form

Confirm activities appear in the list

Test API endpoints using browser or Postman

📈 Future Enhancements

User authentication (login & registration)

Charts and analytics

Mobile responsiveness

Cloud database integration

Wearable device support

🎓 Academic Relevance

This project demonstrates:

Web application development

Frontend–backend integration

RESTful API usage

Database management

User-centered system design

👩‍💻 Author

Name: Florence Kigehi
Registration No: COM/0048/22
Course Code: CSC 417

📄 License

This project is for academic purposes only.
