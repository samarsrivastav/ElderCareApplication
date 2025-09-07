# ElderCare Application

A comprehensive elder care management application built with modern web technologies, designed to provide professional care services with a focus on compassion, safety, and quality of life.

## 🏗️ Project Structure

```
ElderCareApplication/
├── backend/                 # Node.js + TypeScript REST API
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API route definitions
│   │   └── index.ts        # Main application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service layer
│   │   ├── stores/         # State management (Zustand)
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Features

### Backend Features
- **TypeScript + Node.js** with Express framework
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control
- **Zod validation** for request data
- **Modular architecture** with clear separation of concerns
- **Comprehensive error handling** and logging
- **Security middleware** (Helmet, CORS, Rate limiting)
- **Environment configuration** management

### Frontend Features
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive design
- **Ant Design** component library for professional UI
- **React Router** for client-side navigation
- **Zustand** for lightweight state management
- **Axios** for HTTP client with interceptors
- **Responsive design** for all device sizes

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs
- **Development**: Nodemon, ts-node

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Library**: Ant Design
- **Routing**: React Router DOM
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: Ant Design Forms

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher) - running locally or accessible via connection string

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ElderCareApplication
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# Update MONGODB_URI, JWT_SECRET, and other values

# Start development server
npm run dev
```

The backend will start on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Database Setup

Ensure MongoDB is running and accessible. The application will automatically create the necessary collections and indexes on first run.

## ⚙️ Environment Configuration

### Backend (.env)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@maincluster.dilmdxs.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster

# JWT Configuration
JWT_SECRET=eldercare-super-secret-jwt-key-2025-development
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
```

## 🔐 Authentication & Roles

The application supports multiple user roles:

- **Admin**: Full system access and user management
- **Caregiver**: Professional care provider with patient access
- **Family Member**: Family member with access to loved one's care
- **Patient**: Care recipient with limited access

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (Admin/Caregiver only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/role/:role` - Get users by role

## 🎨 UI Components

The frontend includes several reusable components:

- **Navbar**: Navigation with authentication state
- **ProtectedRoute**: Route protection for authenticated users
- **Forms**: Login, registration, and profile forms
- **Dashboard**: Comprehensive user dashboard
- **Cards**: Statistics and information display

## 🧪 Development

### Backend Development

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix
```

### Frontend Development

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
npm run lint:fix
```

## 📦 Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using bcrypt
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **Helmet middleware** for security headers
- **Input validation** using Zod schemas
- **Role-based access control** for API endpoints

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting service (Heroku, AWS, DigitalOcean, etc.)
4. Ensure MongoDB is accessible from your deployment environment

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Update the API URL in environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time notifications** using WebSockets
- **Mobile application** using React Native
- **Advanced analytics** and reporting
- **Integration** with healthcare systems
- **AI-powered** care recommendations
- **Video calling** for remote care
- **Medication tracking** and reminders
- **Care plan templates** and customization

---

**Built with ❤️ for better elder care**
