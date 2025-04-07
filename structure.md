/bloodconnect
│
├── /backend
│ ├── /src
│ │ ├── /controllers # Business logic for routes
│ │ │ ├── authController.js
│ │ │ ├── donationController.js
│ │ │ ├── matchController.js
│ │ │ ├── requestController.js
│ │ │ └── userController.js
│ │ ├── /middleware # Express middleware
│ │ │ ├── auth.js
│ │ │ ├── validation.js
│ │ │ └── rateLimit.js # (Optional) Express rate limiter
│ │ ├── /models # Mongoose models
│ │ │ ├── User.js
│ │ │ ├── Request.js
│ │ │ └── Donation.js
│ │ ├── /routes # Express routes
│ │ │ ├── authRoutes.js
│ │ │ ├── donationRoutes.js
│ │ │ ├── matchRoutes.js
│ │ │ ├── requestsRoutes.js
│ │ │ └── usersRoutes.js
│ │ ├── /utils # Utility modules
│ │ │ ├── emailSender.js
│ │ │ └── supabase.js
│ │ └── server.js # Express server initialization
│ ├── package.json
│ └── .env
│
├── /frontend
│ ├── /assets
│ │ ├── /css # Tailwind CSS and custom styles
│ │ ├── /js
│ │ │ ├── /services # api.js, auth.js, etc.
│ │ │ ├── /utils # authcheck.js, toast.js, etc.
│ │ │ ├── config.js
│ │ │ ├── main.js
│ │ │ └── scripts.js # Shared JS utilities (currently empty)
│ │ └── /images # Static images
│ ├── index.html
│ ├── about.html
│ ├── donors.html
│ ├── requests.html
│ ├── register.html
│ ├── login.html
│ ├── profile.html
│ ├── emergency.html
│ ├── faq.html
│ ├── blog.html
│ ├── forget-password.html
│ └── ... # Other HTML files
│
├── start.js # Dev launcher script
└── package.json # Root package for managing both backend and frontend (optional)
