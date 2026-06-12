# SMEED - Student Management & Empowerment Platform 🎓✨

SMEED is a modern, all-in-one Student Management Platform designed to empower students to take control of their academic, personal, and financial lives. Built with a focus on usability, security, and actionable insights, SMEED provides a seamless experience for students to manage their schedules, health, finances, worship routines, and more—all in one beautiful interface.

## 🚀 Project Overview

SMEED (Student Management & Empowerment, Evaluation & Development) aims to be the ultimate companion for students, helping them balance their busy lives with ease.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **State Management:** React Context API
- **Animations:** Framer Motion, AOS
- **Reporting:** jsPDF, Chart.js
- **Internationalization:** i18next (English & Arabic support)

## 📁 Project Structure

The project has been restructured for better maintainability and separation of concerns:

- `client/`: The React frontend application.
  - `src/components/`: Reusable UI components and feature-specific modules.
  - `src/pages/`: Main application pages and routing logic.
  - `src/contexts/`: Global state management.
  - `src/i18n/`: Localization files for English and Arabic.
- `server/`: The Node.js Express backend.
  - `server.js`: Main API entry point.
  - `db.js`: Database connection configuration.
- `docs/`: Detailed documentation for specific features (Appointments, Worship, etc.).
- `legacy/`: Legacy scripts and virtual environment files.

## ✨ Key Features

### 🔐 User Authentication & Security
- **Secure Access:** Robust registration and login system.
- **OTP Verification:** Email-based One-Time Password verification for account security.
- **Password Recovery:** Secure password reset workflow.
- **Session Management:** Persistent login sessions.

### 📊 Personal Dashboard
- **Profile Management:** View and update personal info, including profile photo uploads.
- **Quick Stats:** At-a-glance overview of academic, health, financial, and worship metrics.
- **Customization:** Support for Light/Dark themes and English/Arabic languages.

### 🗓️ Appointments & Task Management
- **Smart Calendar:** Interactive monthly calendar for visualizing schedules.
- **Kanban Board:** Organize tasks into To-Do, In Progress, and Completed columns.
- **Task Analytics:** Detailed productivity insights and completion rates.
- **PDF Export:** Generate professional, branded reports of your schedule and tasks.

### 💰 Financial Management
- **Multi-Account Support:** Manage multiple accounts in different currencies (EGP, USD, EUR, GBP).
- **Expense Tracking:** Categorized logging of expenses with detailed analytics.
- **Savings Goals:** Set and track progress towards financial targets.
- **Money Transfers:** Securely transfer funds between your accounts.

### 🏥 Health & Wellness
- **Health Profile:** Track metrics like BMI, height, and weight.
- **Personalized Recommendations:** Get daily water intake and exercise suggestions.
- **Health Plans:** Start and monitor progress on custom wellness plans.
- **Data Export:** Export your health history to PDF or Excel.

### 🛐 Worship & Spiritual Tracking
- **Religious Preferences:** Support for multiple faith backgrounds.
- **Prayer Times:** Automatic calculation based on location and preferred method.
- **Progress Tracking:** Log daily worship activities and view completion rates.
- **Activity Reports:** Detailed spiritual activity reports.

### 📚 Academic Planning
- **Plan Management:** Organize and track your academic goals and study plans.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
- **Frontend (Development):**
  ```bash
   npm run dev
   ```
- **Backend:**
  ```bash
   npm run start:backend
   ```
- **Build for Production:**
  ```bash
   npm run build
   ```

## 🎥 Demo
Check out the full project video here: [YouTube Link](https://www.youtube.com/watch?v=U6gx4ooznBI)

---
*Created with For students everywhere.*
