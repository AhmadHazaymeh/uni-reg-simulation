# Uni-Reg-Simulation:

A comprehensive Full-Stack web application designed to simulate and optimize academic registration processes at Jordan University of Science and Technology (**JUST**). The system acts as an interactive platform that bridges the gap between administrative planning and actual student needs through an intelligent voting and data analysis system.

##  Advanced Technical Features

### 1. Secure Authentication & Role-Based Access
* **Role-Based Portals:** Separate, secure interfaces for Staff/Data Entry clerks and Students.
* **JWT Security:** Sessions are secured using JSON Web Tokens (JWT) to manage permissions and maintain user privacy.
* **Smart Validation:** Strict registration rules requiring official university emails (@just.edu.jo) and specific ID formats (6 digits starting with 1).

### 2. Intelligent Conflict Resolution Engine
* **Automated Auditing:** A built-in logic that prevents scheduling conflicts for classrooms, instructors, and time slots.
* **Real-time Feedback:** Staff receives immediate warnings during the scheduling process to reduce human errors.

### 3. Academic Logic & Prerequisites Management
* **Prerequisite Enforcement:** The system automatically checks for "Success" or "Study" prerequisites before allowing students to vote for specific courses.
* **Dynamic Study Plans:** Support for multiple specializations including Software Engineering (SE), Computer Science (CS), Cyber Security (CY), and Computer Information Systems (CIS).

### 4. Interactive Student Voting System
* **Data-Driven Decisions:** Students vote for preferred sections, providing administrators with real-time demand data via visual progress bars.
* **Unified Voting Logic:** Ensures students can only vote for one section per course, with the ability to withdraw or change votes easily.

## 🛠 Tech Stack

* **Frontend:** React.js, Axios, Lucide-React, SweetAlert2.
* **Backend:** Python (Flask), PyJWT, Flask-CORS.
* **Database:** MySQL with an advanced relational schema.

##  Installation & Setup

### Prerequisites
* Python 3.10+
* Node.js v16+
* XAMPP Server (MySQL)

### Steps
1. **Database:** Import the SQL file located in the `database` folder.
2. **Backend Setup:**
   ```bash
   cd backend
   pip install flask flask-cors mysql-connector-python PyJWT
   python app.py

 **Frontend Setup:**
cd uni-frontend
npm install
npm start

