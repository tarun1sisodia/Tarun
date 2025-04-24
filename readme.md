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

## Tech Stack

### Frontend Technologies
- **HTML5**
  - Used for structuring the web pages.
  - Semantic elements for better accessibility and SEO.
- **CSS3**
  - Used for styling the application.
  - Custom styles in `assets/css/styles.css`.
- **Tailwind CSS (v2.2.19)**
  - Utility-first CSS framework.
  - Used for responsive design and rapid UI development.
  - Loaded via CDN: `https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css`.
- **JavaScript (ES6+)**
  - Vanilla JavaScript for client-side functionality.
  - No frontend framework like React or Vue.js is used.
  - Organized in a modular pattern with separate files for different functionalities.
- **Lucide Icons**
  - Icon library loaded from `https://unpkg.com/lucide@latest`.
  - Used for UI elements throughout the application.
- **Fetch API**
  - Used for making HTTP requests to the backend.
  - Implemented in `assets/js/services/api.js`.
- **LocalStorage API**
  - Used for client-side storage of authentication tokens and user data.
  - Implemented in the authentication service.

### Backend Technologies
- **Node.js**
  - JavaScript runtime for server-side code.
  - Version `18.20.5` as indicated in the logs.
- **Express.js**
  - Web application framework for Node.js.
  - Handles routing, middleware, and HTTP requests.
- **MongoDB**
  - NoSQL database for storing application data.
  - Connected via MongoDB Atlas cloud service.
- **Mongoose**
  - ODM (Object Data Modeling) library for MongoDB and Node.js.
  - Used for schema definition and data validation.
- **Supabase**
  - Backend-as-a-Service platform.
  - Used for authentication services.
  - Implemented via `@supabase/supabase-js` client library.
- **JSON Web Tokens (JWT)**
  - Used for secure authentication.
  - Configured with an expiration time of 7 days.
- **dotenv**
  - Environment variable management.
  - Used to load configuration from `.env` files.
- **CORS**
  - Cross-Origin Resource Sharing middleware.
  - Configured to allow requests from the frontend GitHub Pages domain.

### DevOps & Deployment
- **Git & GitHub**
  - Version control system.
  - GitHub Pages for frontend hosting.
  - GitHub repository for code storage and collaboration.
- **Railway**
  - PaaS (Platform as a Service) for backend deployment.
  - Handles environment variables and application hosting.

### Project Architecture
- **Client-Server Architecture**
  - Decoupled frontend and backend.
  - Communication via RESTful API.
- **MVC Pattern (Backend)**
  - Models: MongoDB schemas.
  - Views: N/A (API-only backend).
  - Controllers: Route handlers in separate controller files.
- **Service-Based Architecture (Frontend)**
  - Modular JavaScript with separate services for:
    - API communication.
    - Authentication.
    - User management.
    - Blood donation requests.
    - Donation centers.

### Security Features
- **Authentication**
  - JWT-based authentication.
  - Secure password handling via Supabase.
- **Rate Limiting**
  - API rate limiting to prevent abuse.
  - Configured in `middleware/rateLimit.js`.
- **CORS Protection**
  - Restricted API access to authorized origins.
- **Environment Variable Protection**
  - Sensitive data stored in environment variables.
  - Not exposed to client-side code.

### Additional Tools
- **Email Service**
  - Configuration for sending emails (SMTP).
  - Used for password reset and notifications.
- **Toast Notifications**
  - Custom toast notification system.
  - Implemented in `assets/js/utils/toast.js`.


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
│   └── requests.html           # Blood requests page
|   |__ ..etc      
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
