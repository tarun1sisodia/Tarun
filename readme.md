# BloodConnect - Blood Donation Management System

## Overview
BloodConnect is a comprehensive web application designed to connect blood donors with recipients in need. The platform facilitates blood donation requests, donor registration, and matching of compatible donors with patients requiring blood transfusions.

## Features
- **User Authentication**: Secure registration and login system for donors and recipients.
- **Donor Management**: Registration, profile management, and eligibility tracking for blood donors.
- **Request System**: Create and manage blood donation requests with urgency levels.
- **Matching Algorithm**: Automatically match blood requests with compatible donors.
- **Notification System**: Email alerts for donation requests and matches.
- **Dashboard**: User-friendly interface to track donations and requests.
- **Blood Type Information**: Educational content about blood type compatibility.

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS for responsive styling
- Fetch API for AJAX requests

### Backend
- Node.js with Express.js framework
- MongoDB for database storage
- JWT for authentication
- Nodemailer for email notifications

## Project Structure
├── frontend/                  # Frontend code
│   ├── assets/                # Static assets
│   │   ├── css/               # Stylesheets
│   │   ├── images/            # Image files
│   │   └── js/                # JavaScript files
│   │       ├── pages/         # Page-specific JavaScript
│   │       ├── services/      # API services
│   │       └── utils/         # Utility functions
│   ├── about.html             # About page
│   ├── donors.html            # Donors listing page
│   ├── index.html             # Homepage
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   └── requests.html          # Blood requests page
│
├── backend/                   # Backend code
│   ├── src/                   # Source code
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utility functions
│   │   └── app.js             # Express app setup
│   └── tests/                 # Test files
│
├── .env.example               # Example environment variables
├── package.json               # Project dependencies
└── README.md                  # Project documentation
## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/tarun1sisodia/Tarun.git
    cd Tarun
    ```

2. **Install backend dependencies**:
    ```bash
    cd backend
    npm install
    ```

3. **Set up environment variables**:
    - Copy the `.env.example` file to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update the `.env` file with your:
      - MongoDB connection string
      - JWT secret
      - Email credentials

4. **Start both the frontend and backend servers**:
    ```bash
    node start.js
    ```

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Login and get a JWT token.
- **GET** `/api/auth/verify` - Verify email address.

### Users
- **GET** `/api/users/profile` - Get the current user profile.
- **PUT** `/api/users/profile` - Update the user profile.
- **GET** `/api/users/donors` - Get a list of donors.
- **GET** `/api/users/:id` - Get user details by ID.

### Requests
- **POST** `/api/requests` - Create a new blood request.
- **GET** `/api/requests` - Retrieve all blood requests.
- **GET** `/api/requests/:id` - Get details of a specific request by ID.
- **PUT** `/api/requests/:id` - Update an existing request.
- **PUT** `/api/requests/:id/cancel` - Cancel a blood request.

### Donations
- **POST** `/api/donations/volunteer/:requestId` - Volunteer for a blood donation.
- **GET** `/api/donations` - Retrieve the user's donation history.
- **PUT** `/api/donations/:id/complete` - Mark a donation as complete.

---

## Blood Type Compatibility

The system follows standard blood type compatibility rules for matching donors with recipients:

| **Blood Type** | **Can Donate To**       | **Can Receive From**       |
|----------------|-------------------------|----------------------------|
| A+             | A+, AB+                | A+, A-, O+, O-             |
| A-             | A+, A-, AB+, AB-       | A-, O-                     |
| B+             | B+, AB+                | B+, B-, O+, O-             |
| B-             | B+, B-, AB+, AB-       | B-, O-                     |
| AB+            | AB+ only               | All blood types            |
| AB-            | AB+, AB-               | A-, B-, AB-, O-            |
| O+             | A+, B+, AB+, O+        | O+, O-                     |
| O-             | All blood types        | O- only                    |

---

## Contributing

1. **Fork the repository**.
2. **Create your feature branch**:
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Commit your changes**:
    ```bash
    git commit -m 'Add some amazing feature'
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature/amazing-feature
    ```
5. **Open a Pull Request**.
