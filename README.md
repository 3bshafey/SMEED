# SMEED - Student Management & Empowerment Platform 🎓✨

SMEED is a modern, all-in-one Student Management Platform designed to empower students to take control of their academic, personal, and financial lives. Built with a focus on usability, security, and actionable insights, SMEED provides a seamless experience for students to manage their schedules, health, finances, worship routines, and more—all in one beautiful interface.

## 🚀 Project Overview

SMEED (Student Management & Empowerment, Evaluation & Development) aims to be the ultimate companion for students, helping them balance their busy lives with ease.

## 🛠️ Tech Stack (Serverless Architecture)

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend-as-a-Service:** Firebase (Auth, Firestore, Storage, Hosting)
- **State Management:** React Context API & Real-time Firestore Listeners
- **Animations:** Framer Motion, AOS
- **Reporting:** jsPDF, Chart.js
- **Internationalization:** i18next (English & Arabic support)

## 📁 Project Structure

The project uses a centralized service-based architecture for maximum maintainability:

- `client/`: The React frontend application.
  - `src/services/`: **(Critical)** Centralized Firestore services (Financial, Health, Appointments, Worship).
  - `src/components/`: Reusable UI components and feature-specific modules.
  - `src/pages/`: Main application pages and routing logic.
  - `src/contexts/`: Global state management (Auth, Theme, Language).
  - `src/i18n/`: Localization files for English and Arabic.
- `docs/`: Detailed documentation for specific features.
- `legacy/`: Archived Node.js backend and virtual environment files.

## ✨ Key Features

### 🔐 User Authentication & Security
- **Firebase Auth:** Secure signup, login, and password management.
- **Data Isolation:** Firestore security rules ensure users can only access their own data.

### 📊 Personal Dashboard
- **Real-time Sync:** All metrics (Financial, Tasks, Health) update instantly across devices via Firestore `onSnapshot`.
- **Quick Stats:** At-a-glance overview of your entire student life.

### 💰 Financial Management
- **Atomic Transactions:** Secure balance updates and expense logging using Firestore transactions.
- **Multi-Account & Savings:** Track goals and multiple accounts in one place.

### 🏥 Health & Wellness
- **Profile Tracking:** BMI, weight, and personalized health recommendations.
- **Activity Logs:** Track daily steps, water intake, and sleep.

### 🛐 Worship & Spiritual Tracking
- **Prayer Times:** Accurate calculation via Aladhan API.
- **Progress Tracking:** Daily prayer logs synced to your profile.

## 🛡️ Production Security
The project includes a `firestore.rules` file that strictly enforces:
- **Authentication**: No unauthenticated data access.
- **Ownership**: Users can only Read/Write documents where `userId == request.auth.uid`.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- Firebase Project ([Firebase Console](https://console.firebase.google.com/))

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `client/src/firebase.ts` with your project keys.

### Running the Application
- **Frontend (Development):**
  ```bash
   npm run dev
   ```
- **Build for Production:**
  ```bash
   npm run build
   ```
- **Deploy to Firebase:**
  ```bash
   firebase deploy
   ```

## 🎥 Demo
Check out the full project video here: [YouTube Link](https://www.youtube.com/watch?v=U6gx4ooznBI)

---
*Created with ❤️ for students everywhere.*
